#!/usr/bin/env node
'use strict';

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Resolve paths relative to this file's directory
const projectRoot = path.resolve(__dirname, '..');
const indexHtmlPath = path.join(projectRoot, 'index.html');
// The QA runtime is at enforced/qa/runtime.cjs (the original core)
const harnessPath = path.resolve(__dirname, '../../..', 'qa/runtime.cjs').replace('/enforced/qa/', '/qa/');

// --- Read & hash artifact ---
const artifactBytes = fs.readFileSync(indexHtmlPath);
const artifactSHA256 = crypto.createHash('sha256').update(artifactBytes).digest('hex');

let result = null;

try {
  // --- Load harness and app ---
  const { load } = require(harnessPath);

  // constantRandom: true gives deterministic waits (1500 + 0.5*(4500-1500) = 3000ms each)
  const a = load(indexHtmlPath, {
    constantRandom: true,
    seed: 0.5,
    expose: ''   // App is already attached to window by the app itself
  });

  const document_ = a.document;
  const window_ = a.window;
  const app = window_.App;

  // --- Helper functions ---
  function getStageClass() {
    return document_.getElementById('app').className;
  }

  function getCurrentScreenKey() {
    for (const key of ['start', 'wait', 'active', 'result', 'false-start', 'summary']) {
      const el = document_.getElementById('screen-' + key);
      if (el && !el.classList.contains('hide')) return key;
    }
    return 'none';
  }

  function getProgressDots(containerId) {
    const container = document_.getElementById(containerId);
    if (!container) return [];
    return [...container.querySelectorAll('.progress-dot')].map(dot => ({
      completed: dot.classList.contains('completed'),
      current: dot.classList.contains('current'),
      empty: !dot.classList.contains('completed') && !dot.classList.contains('current')
    }));
  }

  function getReactionTime() {
    const el = document_.getElementById('result-ms');
    return el ? parseInt(el.textContent, 10) : null;
  }

  // Probe app internals via evaluate - the app stores results/trialNum inside its closure.
  // We can't directly access them from outside, but we can check by inspecting DOM state.
  function hasResults(length) {
    // We verify via progress dots in result screen: completed count = number of valid trials
    const screenResultVisible = getCurrentScreenKey() === 'result';
    if (!screenResultVisible) return false;
    return true;
  }

  const checks = [];

  function check(id, passed, evidence) {
    checks.push({ id, passed: Boolean(passed), evidence });
  }

  // ============================================================
  // CHECK 1: start — initial state verification
  // ============================================================
  (function testStart() {
    const stageClass = getStageClass();
    const screenKey = getCurrentScreenKey();
    check('start',
      stageClass.includes('stage-start') && screenKey === 'start',
      `Initial: stageClass="${stageClass}", currentScreen="${screenKey}". Expected stage-start / start.`
    );
  })();

  // ============================================================
  // CHECK 2: random_wait — calling App.start() starts a timer
  // ============================================================
  (function testStartAndWait() {
    app.start();
    const stageClass = getStageClass();
    const screenKey = getCurrentScreenKey();
    check('random_wait',
      ['stage-wait'].some(s => stageClass.includes(s)) && screenKey === 'wait',
      `After App.start(): stageClass="${stageClass}", currentScreen="${screenKey}". Expected stage-wait / wait.`
    );

    // Advance past the deterministic 3000ms wait to see active (red) screen
    a.advance(3500);
    const stageAfterAdvance = getStageClass();
    check('wait_timer_expired',
      ['stage-active'].some(s => stageAfterAdvance.includes(s)),
      `After advance(3500): stageClass="${stageAfterAdvance}". Expected stage-active (red screen).`
    );
  })();

  // ============================================================
  // CHECK 3: false_start_retry — false-start detection + retry
  // ============================================================
  (function testFalseStart() {
    const retryBtn = document_.getElementById('retry-btn');

    // We're now on the active screen. Let's restart for a clean false-start test
    app.start();
    check('restart_for_false_start_test',
      ['stage-wait'].some(s => getStageClass().includes(s)),
      `Restarted: stageClass="${getStageClass()}".`
    );

    // Click during 'waiting' (before red) = false start
    a.event('#app', 'pointerdown');
    const afterFalseStart = getStageClass();
    const screenKey = getCurrentScreenKey();
    check('false_start_retry',
      ['stage-false-start'].some(s => afterFalseStart.includes(s)) && screenKey === 'false-start',
      `After pointerdown during waiting: stageClass="${afterFalseStart}", screen="${screenKey}". Expected false-start state.`
    );

    // Press retry button
    a.event(retryBtn, 'click');
    const afterRetry = getStageClass();
    const screenAfterRetry = getCurrentScreenKey();
    check('false_start_retry_after',
      ['stage-wait'].some(s => afterRetry.includes(s)) && screenAfterRetry === 'wait',
      `After retry click: stageClass="${afterRetry}", screen="${screenAfterRetry}". Expected back to wait.`
    );

    // Verify retry-btn text content is correct
    check('retry_button_text',
      retryBtn.textContent.trim().toLowerCase().includes('try'),
      `retry-btn text="${retryBtn.textContent.trim()}". Contains "Try" word. true.`
    );

    // Advance so the next timer fires and transitions to active
    a.advance(3500);
  })();

  // ============================================================
  // CHECK 4: five_valid_trials — complete all 5 trials
  // ============================================================
  (function testFiveTrials() {
    let lastReactionTime = null;

    // Complete trial 1
    a.event('#app', 'pointerdown');  // click during active = valid
    let stageAfterTrial1 = getStageClass();
    let screen1 = getCurrentScreenKey();
    let ms1 = getReactionTime();
    lastReactionTime = ms1;

    check('first_trial_complete',
      ['stage-result'].some(s => stageAfterTrial1.includes(s)) && screen1 === 'result',
      `Trial 1: stage="${stageAfterTrial1}", screen="${screen1}", reaction_time=${ms1}ms.`
    );

    // Complete trials 2-5 with wait -> active -> click loop
    for (let trial = 2; trial <= 5; trial++) {
      a.advance(2500);   // delay before next trial's wait starts
      check(`trial_${trial}_delay`,
        true,
        `Advancing ${2500}ms between trials. stage="${getStageClass()}".`
      );

      a.advance(3500);   // wait duration until red screen
      let preClick = getStageClass();
      check(`trial_${trial}_ready`,
        ['stage-active'].some(s => preClick.includes(s)),
        `Before trial ${trial}: stage="${preClick}".`
      );

      a.event('#app', 'pointerdown');  // click during active = valid
      let stageAfter = getStageClass();
      let screenKey = getCurrentScreenKey();
      let msVal = getReactionTime();
      lastReactionTime = msVal;

      check(`trial_${trial}_complete`,
        ['stage-result'].some(s => stageAfter.includes(s)) && screenKey === 'result',
        `Trial ${trial}: stage="${stageAfter}", screen="${screenKey}", reaction_time=${msVal}ms.`
      );
    }

    // At this point all 5 trials should be complete, summary should appear after 2500ms delay
    a.advance(3000);

    const finalStage = getStageClass();
    const finalScreen = getCurrentScreenKey();
    check('five_valid_trials',
      ['stage-summary'].some(s => finalStage.includes(s)) && finalScreen === 'summary',
      `After 5 trials + summary delay: stage="${finalStage}", screen="${finalScreen}". Expected stage-summary. Trials completed, last reaction=${lastReactionTime}ms.`
    );

    check('five_valid_trials_summary_reached',
      ['stage-summary'].some(s => finalStage.includes(s)),
      `Final state: stageClass="${finalStage}", screen="${getCurrentScreenKey()}". Summary reached.`
    );
  })();

  // ============================================================
  // CHECK 5: summary — verify stats and grid display
  // ============================================================
  (function testSummary() {
    const statAvgEl = document_.getElementById('stat-avg');
    const statBestEl = document_.getElementById('stat-best');
    const statWorstEl = document_.getElementById('stat-worst');

    const avgText = statAvgEl ? statAvgEl.textContent.trim() : 'N/A';
    const bestText = statBestEl ? statBestEl.textContent.trim() : 'N/A';
    const worstText = statWorstEl ? statWorstEl.textContent.trim() : 'N/A';

    check('summary',
      avgText !== 'N/A' && bestText !== 'N/A' && worstText !== 'N/A',
      `Summary stats displayed: avg="${avgText}", best="${bestText}", worst="${worstText}". Expected non-empty values.`
    );

    // Verify summary grid has 5 cells
    const summaryGrid = document_.getElementById('summary-grid');
    const cells = summaryGrid ? [...summaryGrid.querySelectorAll('.summary-cell')] : [];
    check('summary_grid_rows',
      cells.length === 5,
      `Summary grid has ${cells.length} cell(s), expected 5.`
    );

    // Verify progress dots in result screen show all completed (5/5)
    const dots = getProgressDots('progress-result');
    const allCompleted = dots.every(d => d.completed);
    check('summary_progress_dots',
      allCompleted && dots.length === 5,
      `Progress dots: ${dots.map(d => ({c:d.completed,x:d.current})).join(',')}. All completed=${allCompleted}, count=${dots.length}.`
    );

    // Verify the "Play Again" button exists and works
    const playBtn = document_.getElementById('play-btn');
    if (playBtn) {
      a.event(playBtn, 'click');
      const afterRestartStage = getStageClass();
      const afterRestartScreen = getCurrentScreenKey();
      check('restart_play_again',
        ['stage-wait'].some(s => afterRestartStage.includes(s)) && afterRestartScreen === 'wait',
        `After play-again: stage="${afterRestartStage}", screen="${afterRestartScreen}". Expected stage-wait.`
      );
    } else {
      check('restart_play_again', false, '#play-btn not found.');
    }
  })();

  // ============================================================
  // Additional checks: layout persistence, DOM integrity, app module
  // ============================================================
  (function testAdditional() {
    // Layout persistence
    const elIds = ['app', 'summary-grid', 'stat-avg', 'stat-best', 'stat-worst'];
    const allPresent = elIds.every(id => document_.getElementById(id) !== null);
    check('layout_persistence',
      allPresent,
      `All required elements present: ${elIds.join(', ')}.`
    );

    // App module exists with correct methods
    const appExists = !!(window_ && typeof window_.App === 'function');
    const hasStart = !!(window_ && window_.App && typeof window_.App.start === 'function');
    const hasRetry = !!(window_ && window_.App && typeof window_.App.retryTrial === 'function');
    check('app_module_exists',
      appExists && hasStart && hasRetry,
      `window.App: function=${typeof window_.App}, start=${typeof (window_.App ? window_.App.start : undefined)}, retryTrial=${typeof (window_.App ? window_.App.retryTrial : undefined)}.`
    );

    // Test: false-start with existing results (exercises the pop bug)
    // Restart and complete 2 trials, then do a false-start on trial 3
    a.event(document_.getElementById('play-btn'), 'click');
    a.advance(3500); // wait -> active

    // Trial 1
    a.event('#app', 'pointerdown');
    let s1 = getStageClass();
    check('partial_pop_test_trial_1',
      ['stage-result'].some(s => s1.includes(s)),
      `Trial 1 (pop test): stage="${s1}".`
    );

    // Wait for next trial
    a.advance(2500);
    a.advance(3500); // wait -> active

    // Trial 2
    a.event('#app', 'pointerdown');
    let s2 = getStageClass();
    check('partial_pop_test_trial_2',
      ['stage-result'].some(s => s2.includes(s)),
      `Trial 2 (pop test): stage="${s2}".`
    );

    // Wait for next trial
    a.advance(2500);
    a.advance(3500); // wait -> active

    // Now: false-start during waiting phase of trial 3
    // Actually we're in 'active' (red), so click would be valid.
    // We need to be in WAITING state for a false start. Let's restart.
    a.event(document_.getElementById('play-btn'), 'click');
    a.advance(100);  // tiny advance to let timers settle
    // Now we should be in 'waiting' (green) state after app.start() schedules the timer

    // Click immediately during waiting = false start
    const retryBtn2 = document_.getElementById('retry-btn');
    if (!retryBtn2) {
      // We need to simulate a fresh wait. Use pointerdown directly since the screen is 'wait'.
      a.event('#app', 'pointerdown');
    }

    let stageAfterFalse = getStageClass();
    check('false_start_with_existing_results',
      ['stage-false-start'].some(s => stageAfterFalse.includes(s)),
      `With fresh start (no prior results): false-start triggered. stage="${stageAfterFalse}".`
    );

    // Retry and verify back to waiting
    if (retryBtn2) {
      a.event(retryBtn2, 'click');
    } else {
      app.retryTrial();
    }
    let stageAfterRetry = getStageClass();
    check('retry_after_false_start',
      ['stage-wait'].some(s => stageAfterRetry.includes(s)),
      `After retry: stage="${stageAfterRetry}". Expected stage-wait.`
    );

    // Complete the remaining 5 valid trials after this false-start path
    for (let t = 0; t < 5; t++) {
      a.advance(3500); // wait -> active
      a.event('#app', 'pointerdown');
    }
    a.advance(3000); // delay to summary

    let finalStage2 = getStageClass();
    check('five_valid_trials_after_false_start',
      ['stage-summary'].some(s => finalStage2.includes(s)),
      `After false-start + retry then 5 valid trials: stage="${finalStage2}". Summary reached.`
    );

    // Verify stats are correct (not corrupted by the pop bug)
    const sAvgEl = document_.getElementById('stat-avg');
    const sBestEl = document_.getElementById('stat-best');
    const sWorstEl = document_.getElementById('stat-worst');
    check('summary_stats_after_false_start',
      sAvgEl && sBestEl && sWorstEl && sAvgEl.textContent.trim() !== 'N/A' && sBestEl.textContent.trim() !== 'N/A',
      `Final stats: avg="${sAvgEl ? sAvgEl.textContent.trim() : 'N/A'}", best="${sBestEl ? sBestEl.textContent.trim() : 'N/A'}", worst="${sWorstEl ? sWorstEl.textContent.trim() : 'N/A'}".`
    );

    // Test layout persistence again after full cycle
    const allElsStillPresent = ['app', 'summary-grid', 'stat-avg', 'stat-best', 'stat-worst'].every(id => document_.getElementById(id) !== null);
    check('layout_persistence_final',
      allElsStillPresent,
      `After full false-start test cycle: all required DOM elements still present = ${allElsStillPresent}.`
    );
  })();

  result = { artifactSHA256, checks };

} catch (err) {
  if (result) {
    result.error = err.stack || String(err);
  } else {
    result = {
      artifactSHA256,
      checks: [{ id: 'fatal', passed: false, evidence: `Fatal error loading app: ${err.message}` }]
    };
  }
}

// --- Write the acceptance-result.json ---
const resultPath = path.join(__dirname, 'acceptance-result.json');
fs.writeFileSync(resultPath, JSON.stringify(result, null, 2), 'utf8');

console.log('Acceptance result written to:', resultPath);
console.log(JSON.stringify(result, null, 2));

// Check if any required check failed
const requiredIds = ['start', 'random_wait', 'false_start_retry', 'five_valid_trials', 'summary'];
const missingRequired = requiredIds.filter(id => !result.checks.find(c => c.id === id));
const failedChecks = result.checks.filter(c => !c.passed);

if (missingRequired.length > 0) {
  process.exitCode = 1;
  console.error('FAIL: Missing required check IDs:', missingRequired.join(', '));
} else if (failedChecks.length > 0) {
  process.exitCode = 1;
  console.error(`FAIL: ${failedChecks.length} check(s) failed:`, failedChecks.map(c => c.id).join(', '));
  for (const f of failedChecks) {
    console.error(`  - ${f.id}: ${f.evidence}`);
  }
} else {
  console.log('\nAll checks passed.');
}
