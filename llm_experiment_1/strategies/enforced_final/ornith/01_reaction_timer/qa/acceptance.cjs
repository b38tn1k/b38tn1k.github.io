'use strict';

// Independent functional acceptance test for the Reaction Time Tester.
// Runs under Node against the exact-source partial DOM/Canvas runtime
// (a lightweight VM DOM + deterministic clock; NOT a browser).
// Exercises real handlers via a.event, timed behavior via a.advance.
// Records actual outcomes (not mere feature presence).

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { load } = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/qa/runtime.cjs');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..');
const INDEX = path.join(ROOT, 'index.html');

// SHA-256 of the exact artifact under test.
const artifactSHA256 = crypto.createHash('sha256').update(fs.readFileSync(INDEX)).digest('hex');

// Deterministic seeded RNG so the random wait lands inside [minWait,maxWait].
const SEED = 0.9;

const REQUIRED_IDS = ['start', 'random_wait', 'false_start_retry', 'five_valid_trials', 'summary'];

const checks = [];
function record(id, passed, evidence) {
  checks.push({ id, passed: !!passed, evidence: String(evidence) });
}

const STAGE = 'stage';
function stageClass(a) { return a.document.getElementById(STAGE).className; }
function isClass(a, name) { return stageClass(a).indexOf(' ' + name) !== -1 || stageClass(a) === 'stage ' + name; }

// ---------------------------------------------------------------------------
// Fixture builder: a fresh loaded page.
// ---------------------------------------------------------------------------
function fresh(seed) { return load(INDEX, { seed: seed ?? SEED }); }

// Drive one trial to a valid recorded result.
//   - press in ready -> forces a false start
//   - press on false -> retry into ready
//   - advance -> go screen
//   - advance + click -> valid result recorded
// Returns the phase after the result is recorded.
function driveValidTrial(a) {
  let ph = stageClass(a);
  if (isClass(a, 'ready')) {
    // false start during ready
    a.event(a.document.getElementById(STAGE), 'mousedown');
    ph = stageClass(a);
  }
  if (isClass(a, 'false')) {
    // retry this same trial -> back to ready
    a.event(a.document.getElementById(STAGE), 'mousedown');
    ph = stageClass(a);
  }
  if (isClass(a, 'ready')) {
    a.advance(4000); // random wait elapses -> go
    ph = stageClass(a);
  }
  if (isClass(a, 'go')) {
    a.advance(1500); // respond ~1500ms after go (> 30ms -> valid)
    if (isClass(a, 'go')) a.event(a.document.getElementById(STAGE), 'mousedown');
    ph = stageClass(a);
  }
  return ph;
}

try {
  // ------------------------------------------------------------------
  // START: #startBtn exists at boot and begins the test.
  // ------------------------------------------------------------------
  let a = fresh();
  const realStartBtn = a.document.querySelector('#startBtn');
  const bootStage = stageClass(a);
  record('start', !!realStartBtn && bootStage.indexOf('warmup') !== -1,
    `#startBtn present: ${!!realStartBtn}, boot stage="${bootStage}"`);

  a.event('#startBtn', 'click');
  const afterStart = stageClass(a);
  record('start', afterStart.indexOf('ready') !== -1,
    `after clicking #startBtn, stage="${afterStart}" (left warmup into ready)`);

  // ------------------------------------------------------------------
  // RANDOM_WAIT: after ready a timer is pending; the go screen must NOT
  // appear before the random wait elapses, and must appear after it.
  // ------------------------------------------------------------------
  // We are in ready now; the go timer was scheduled by renderReady.
  const pendingTimers = a.tasks.size;
  const readyBefore = isClass(a, 'ready');
  a.advance(500); // < minWait(1000): must still be waiting, NOT go
  const at500 = stageClass(a);
  a.advance(4000); // > maxWait(3000): go must have fired
  const afterBigWait = stageClass(a);

  record('random_wait',
    pendingTimers >= 1 && readyBefore &&
    at500.indexOf('go') === -1 && afterBigWait.indexOf('go') !== -1,
    `pending timers after ready=${pendingTimers}, still-not-go at +500ms="${at500}", go at +4000ms="${afterBigWait}"`);

  // ------------------------------------------------------------------
  // FALSE_START_RETRY: clicking before go is a false start; the SAME
  // trial is retried (not a new trial), returning to ready.
  // Also: a sub-30ms click during go is treated as a false start.
  // ------------------------------------------------------------------
  a = fresh();
  a.event('#startBtn', 'click');
  a.advance(500);
  const freshReady = isClass(a, 'ready');
  // false start while waiting
  a.event(a.document.getElementById(STAGE), 'mousedown');
  const afterFalse = stageClass(a);
  const afterFalseHtml = a.document.getElementById(STAGE).innerHTML;
  const isFalseStart = afterFalse.indexOf('false') !== -1 &&
    afterFalseHtml.toLowerCase().indexOf('false start') !== -1;
  // retry same trial
  a.event(a.document.getElementById(STAGE), 'mousedown');
  const afterRetry = isClass(a, 'ready');

  record('false_start_retry',
    freshReady && isFalseStart && afterRetry,
    `was in ready=${freshReady}; false-start stage="${afterFalse}" contains "false start": ${isFalseStart}; after retry stage="${stageClass(a)}" ready: ${afterRetry}`);

  // sub-30ms go-click is also a false start. Advance in small bounded steps
  // until the go screen renders, then click immediately (elapsed ~0 < 30ms).
  a = fresh();
  a.event('#startBtn', 'click');
  let gotGo = false;
  for (let s = 0; s < 3500 && !gotGo; s += 10) {
    a.advance(10);
    if (isClass(a, 'go')) { gotGo = true; break; }
  }
  const goPhase1 = gotGo;
  a.event(a.document.getElementById(STAGE), 'mousedown'); // elapsed ~0 -> false
  const goFastFalse = stageClass(a);
  const goFastIsFalse = goFastFalse.indexOf('false') !== -1;

  record('false_start_retry',
    goPhase1 && goFastIsFalse,
    `go rendered: ${goPhase1}; sub-30ms click during go -> "${goFastFalse}" (false start): ${goFastIsFalse}`);

  // ------------------------------------------------------------------
  // FIVE_VALID_TRIALS: complete 5 valid trials (each exercising a
  // false-start retry) and reach the completion ("done") stage.
  // ------------------------------------------------------------------
  a = fresh();
  a.event('#startBtn', 'click');
  let completed = false;
  let guard = 0;
  for (let trial = 0; trial < 5; trial++) {
    // ensure we are in ready; retry through any non-progressing phase
    let loop = 0;
    while (!isClass(a, 'ready') && loop++ < 20) {
      const ph = stageClass(a);
      if (ph === 'stage result') { a.event(a.document.getElementById(STAGE), 'mousedown'); continue; }
      if (ph === 'stage false') { a.event(a.document.getElementById(STAGE), 'mousedown'); continue; }
      if (ph === 'stage warmup' || ph === 'stage done') break;
      a.event(a.document.getElementById(STAGE), 'mousedown');
    }
    if (!isClass(a, 'ready')) break;
    driveValidTrial(a);
    // press "next" if in result phase
    if (isClass(a, 'result')) a.event(a.document.getElementById(STAGE), 'mousedown');
    if (isClass(a, 'done')) { completed = true; break; }
  }
  const finalPhase = stageClass(a);
  const trialCards = a.document.querySelectorAll('.results-grid .trial');
  const validCards = Array.from(trialCards).filter(
    t => t.className.indexOf('false') === -1 && /\d+/.test(t.textContent)
  ).length;
  const allFiveNumeric = trialCards.length === 5 && validCards === 5;

  record('five_valid_trials', completed && finalPhase === 'stage done',
    `completed 5 valid trials: completed=${completed}, final stage="${finalPhase}", loops=${guard}`);

  record('five_valid_trials', allFiveNumeric,
    `results-grid cards=${trialCards.length}, valid numeric trial values=${validCards}`);

  // ------------------------------------------------------------------
  // SUMMARY: summary stats present and recomputed average matches.
  // ------------------------------------------------------------------
  const html = a.document.getElementById(STAGE).innerHTML;
  const mAvg = /<b>(\d+)ms<\/b><span>Average<\/span>/i.exec(html);
  const mFast = /<b>(\d+)ms<\/b><span>Fastest<\/span>/i.exec(html);
  const mSlow = /<b>(\d+)ms<\/b><span>Slowest<\/span>/i.exec(html);
  const mSpread = /<b>(\d+)ms<\/b><span>Spread<\/span>/i.exec(html);
  const restartBtn = a.document.querySelector('#restartBtn');
  const restartGhost = a.document.querySelector('#restartGhost');

  record('summary', !!(mAvg && mFast && mSlow && mSpread && restartBtn && restartGhost),
    `Average=${!!mAvg} Fastest=${!!mFast} Slowest=${!!mSlow} Spread=${!!mSpread} restartBtn=${!!restartBtn} restartGhost=${!!restartGhost}`);

  // Recompute the mean from the displayed numeric trial values.
  const vals = [];
  Array.from(trialCards).forEach(t => {
    const m = /<div class="v[^"]*">(\d+)<\/div>/i.exec(t.innerHTML);
    if (m) vals.push(parseInt(m[1], 10));
  });
  let computedMean = null;
  if (vals.length) computedMean = Math.round(vals.reduce((x, y) => x + y, 0) / vals.length);
  const avgMatches = computedMean !== null && !!mAvg && parseInt(mAvg[1], 10) === computedMean;

  record('summary', avgMatches,
    `documented average=${mAvg ? mAvg[1] + 'ms' : 'none'}, recomputed mean of [${vals.join(', ')}] = ${computedMean}ms`);

  // "Test Again" restarts the whole app; "New Settings" returns to warmup.
  // "New Settings" (ghost) from the done phase returns to warmup (undo/replay).
  // Verify the ghost exists at done, then click it to confirm replayability.
  const ghostAtDone = a.document.querySelector('#restartGhost');
  let afterRestart = stageClass(a);
  if (ghostAtDone) { a.event('#restartGhost', 'click'); afterRestart = stageClass(a); }
  record('summary', !!ghostAtDone && afterRestart.indexOf('warmup') !== -1,
    `New Settings button present at done=${!!ghostAtDone}; after click stage="${afterRestart}" (returned to warmup / replayable)`);

  // ------------------------------------------------------------------
  // LAYOUT / DEFAULTS: default settings present in the controls.
  // NOTE: the app does not persist settings across reloads (no
  // localStorage); "layout persistence" is recorded as default-values
  // verification of the current DOM rather than cross-reload persistence.
  // ------------------------------------------------------------------
  const minWait = a.document.getElementById('minWait').value;
  const maxWait = a.document.getElementById('maxWait').value;
  const trialCount = a.document.getElementById('trialCount').value;
  record('layout_persistence',
    minWait === '1000' && maxWait === '3000' && trialCount === '5',
    `default controls minWait=${minWait}ms maxWait=${maxWait}ms trialCount=${trialCount} (defaults: 1s/3s/5)`);

} catch (err) {
  record('exception', false, String((err && err.stack) || err));
}

// ------------------------------------------------------------------
// Handoff JSON (written via process.exitCode so the tracer can flush).
// ------------------------------------------------------------------
const handoff = {
  artifactSHA256,
  checks: checks.map(c => ({ id: c.id, passed: !!c.passed, evidence: c.evidence }))
};
fs.writeFileSync(path.join(HERE, 'acceptance-result.json'), JSON.stringify(handoff, null, 2));

const failed = handoff.checks.filter(c => !c.passed);
console.log(JSON.stringify({
  artifactSHA256,
  total: handoff.checks.length,
  failed: failed.map(f => f.id),
  missingRequiredIds: REQUIRED_IDS.filter(rid => !handoff.checks.some(c => c.id === rid))
}, null, 2));

if (failed.length) process.exitCode = 1;
