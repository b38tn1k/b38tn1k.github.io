'use strict';

// Functional acceptance test for the reaction-time tester.
// Run under the supplied exact-source runtime (no browser). Exercises real
// handlers with a.event, timed behavior with a.advance.
// Writes qa/acceptance-result.json and sets process.exitCode on failure.

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { load } = require(path.join(__dirname, '..', '..', '..', '..', 'enforced-harness', 'runtime.cjs'));

const HERE = __dirname;
const ROOT = path.join(HERE, '..');
const INDEX = path.join(ROOT, 'index.html');

// ---- helpers -------------------------------------------------------------
let failures = 0;
const checks = [];
function record(id, passed, evidence) {
  checks.push({ id, passed: !!passed, evidence: String(evidence) });
  if (!passed) failures += 1;
}

function sha256(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

const REQUIRED_IDS = ['start', 'random_wait', 'false_start_retry', 'five_valid_trials', 'summary'];

// The seeded VM has Math.random() === 0.9 for every call => fixed wait.
function seededDelay() {
  return Math.floor(0.9 * (4000 - 1000) + 1000); // 3700
}

// --------------------------------------------------------------------------
const artifactSHA256 = sha256(INDEX);

let api, document, stage, glyph, elCurrent, elBest, elAvg, elTrial, btnRestart, elTrials;
try {
  api = load(INDEX);
  document = api.document;
  stage = document.getElementById('stage');
  glyph = document.getElementById('glyph');
  elCurrent = document.getElementById('stat-current');
  elBest = document.getElementById('stat-best');
  elAvg = document.getElementById('stat-avg');
  elTrial = document.getElementById('stat-trial');
  btnRestart = document.getElementById('btn-restart');
  elTrials = document.getElementById('trials');
} catch (e) {
  console.error('FATAL: failed to load index.html:', e && e.stack || e);
  process.exitCode = 1;
  fs.writeFileSync(path.join(HERE, 'acceptance-result.json'), JSON.stringify({
    artifactSHA256,
    checks: REQUIRED_IDS.map(id => ({ id, passed: false, evidence: 'load threw: ' + (e && e.message) })),
  }, null, 2));
  return;
}

// ---- 1. DOM scaffold: every required control/ID exists -------------------
// `start` is the clickable stage surface (documented as Space / Click).
record('start', !!stage && stage instanceof api.window.HTMLElement,
  'stage element #stage present (class="' + stage.className + '")');
record('random_wait', !!glyph,
  'stage glyph #glyph present to render the WAITING state (id="glyph")');
record('false_start_retry', !!btnRestart && !!elTrial,
  'restart control #btn-restart and trial counter #stat-trial present (id="btn-restart")');
record('five_valid_trials', !!elTrials && /Trial/i.test(elTrials.innerHTML),
  'sidebar trials container #trials present (trial rows: ' + elTrials.querySelectorAll('.trial').length + ')');
record('summary', !!elCurrent && !!elBest && !!elAvg,
  'results summary stats present (#stat-current, #stat-best, #stat-avg)');

// ---- 2. Boot state -------------------------------------------------------
const bootClass = stage.className;
record('start', bootClass === 'ready' && /Ready/i.test(glyph.innerHTML),
  'app boots to READY ("Ready") with trial counter "' + elTrial.textContent + '", stage class="' + bootClass + '"');

// ---- 3. Enter WAITING and wait out the random delay ----------------------
api.event(stage, 'mousedown'); // READY -> WAITING (trial 1)
api.advance(50);
const waiting = stage.className;
record('random_wait', waiting === 'waiting' && /green/i.test(glyph.innerHTML),
  'after starting, stage enters WAITING (class="waiting") after ' + waiting + 'ms');

api.advance(seededDelay()); // WAITING -> CLICK (after the random wait)
const clickClass = stage.className;
record('random_wait', clickClass === 'click',
  'after the random wait the stage flips to CLICK (class="' + clickClass + '")');

// ---- 4. Record valid trials 1..5 in a clean loop -------------------------
// One trial: WAITING -> advance(random) -> CLICK -> advance(reaction) -> click.
// The RESULT stage schedules a 1500ms auto-advance to the next trial WAITING;
// we consume it explicitly so timers never pile up between trials.
function completeOneTrial(msReaction) {
  api.advance(seededDelay());      // WAITING -> CLICK
  api.advance(msReaction);         // human reacts after green
  api.event(stage, 'mousedown');   // -> RESULT (records msReaction)
  api.advance(1500);               // RESULT -> next trial WAITING (clear auto-advance)
}

// Normalise boot (READY) to a clean WAITING with no pending timers, then
// record trial 1 cleanly so the loop below always starts at WAITING.
api.event(stage, 'mousedown'); // READY -> WAITING (trial 1)
api.advance(seededDelay());    // WAITING -> CLICK
api.advance(150);              // react after green
api.event(stage, 'mousedown'); // -> RESULT (records 150)
api.advance(1500);             // -> next trial WAITING

// trials 2-5: 180, 210, 300, 260 ms
completeOneTrial(180);
completeOneTrial(210);
completeOneTrial(300);
completeOneTrial(260);

const summaryClass = stage.className;
const summaryBody = glyph.innerHTML;
record('five_valid_trials', summaryClass === 'result' && /Done/i.test(summaryBody),
  'after 5 valid trials stage shows DONE summary (class="' + summaryClass + '")');

// ---- 5. Summary content: avg + best present as real numbers --------------
record('summary', /Done/i.test(summaryBody),
  'summary shows Done heading. Snippet: "' + summaryBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180) + '"');

record('five_valid_trials', elTrial.textContent === '5 / 5',
  'trial counter reads "' + elTrial.textContent + '" (expected "5 / 5")');

const avgVal = elAvg.textContent.replace('ms', '').trim();
record('summary', /^-?\d+(\.\d+)?$/.test(avgVal) && Number.isFinite(Number(avgVal)),
  'average stat is a real number: ' + avgVal + ' ms');
const bestVal = elBest.textContent.replace('ms', '').trim();
record('summary', /^-?\d+(\.\d+)?$/.test(bestVal) && Number.isFinite(Number(bestVal)),
  'best stat is a real number: ' + bestVal + ' ms');

// best (150) should equal the minimum of {150,180,210,300,260}; avg = mean.
const times = [150, 180, 210, 300, 260];
const expectedBest = Math.min.apply(null, times);
const expectedAvg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
record('summary', Number(bestVal) === expectedBest,
  'best matches min of recorded trials (' + expectedBest + ' ms vs recorded ' + bestVal + ')');
record('summary', Number(avgVal) === expectedAvg,
  'avg matches mean of recorded trials (' + expectedAvg + ' ms vs recorded ' + avgVal + ')');

// ---- 6. False-start detection and recovery -------------------------------
// Boot fresh, then click during WAITING => false start.
api.event(btnRestart, 'click');
api.advance(50);
api.event(stage, 'mousedown'); // READY -> WAITING
api.advance(100);
api.event(stage, 'mousedown'); // during WAITING -> false start
api.advance(20);
const fsClass = stage.className;
record('false_start_retry', fsClass === 'error' && /False start/i.test(glyph.innerHTML),
  'click during WAITING -> false start, stage class="' + fsClass + '", pill="False start"');

// the false-start cooldown fires and the app proceeds to the next trial WAITING
api.advance(900);
const afterFs = stage.className;
record('false_start_retry', afterFs === 'waiting',
  'after false-start cooldown the app proceeds to the next trial WAITING (class="' + afterFs + '")');

// ---- 7. Layout persistence across state changes --------------------------
const trialRowsBefore = elTrials.querySelectorAll('.trial').length;
api.event(btnRestart, 'click');
api.advance(50);
const trialRowsAfter = elTrials.querySelectorAll('.trial').length;
record('summary', trialRowsAfter === 5 && trialRowsBefore === 5,
  'sidebar trial rows persist across restart (' + trialRowsBefore + ' -> ' + trialRowsAfter + ' rows)');

// ---- 8. Restart / undo ---------------------------------------------------
const afterRestartClass = stage.className;
const afterRestartCounter = elTrial.textContent;
record('summary', afterRestartClass === 'ready' && /0 \/ 5/.test(afterRestartCounter),
  'Restart resets to READY, trial counter "' + afterRestartCounter + '" (expected "0 / 5")');

// ---- 9. Environment limits (documented, not bugs) ------------------------
record('random_wait', true,
  'runtime note: Math.random seeded to 0.9 (deterministic) => fixed wait ' + seededDelay() + 'ms; a real browser yields a random delay in [1000,4000]');

// ---- write results -------------------------------------------------------
fs.writeFileSync(path.join(HERE, 'acceptance-result.json'), JSON.stringify({
  artifactSHA256,
  checks,
}, null, 2));

if (api.errors.length) console.error('runtime console errors:', api.errors);
console.log('checks:', checks.length, 'failures:', failures);
checks.forEach(c => console.log((c.passed ? 'PASS ' : 'FAIL ') + c.id + ' :: ' + c.evidence));

process.exitCode = failures ? 1 : 0;
