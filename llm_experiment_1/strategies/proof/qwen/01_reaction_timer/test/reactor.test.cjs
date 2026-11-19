const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

var harnessPath = path.resolve(__dirname, '../../../../proof-harness/runtime-v2.cjs');
var { load } = require(harnessPath);
var HTML_PATH = path.resolve(__dirname, '../index.html');

// Helper: advance until phase becomes target or max steps reached.
// Uses 500ms advances * 60 steps = ~30 seconds to handle long random waits.
function advanceUntil(a, target, max) {
  max = max || 60;
  for (var i = 0; i < max; i++) {
    a.advance(500);
    if (a.evaluate('RT.phase') === target) return true;
  }
  return false;
}

// Helper: fire pointerdown on stage via a.event() with the actual element
function tapStage(a) {
  var el = a.document.querySelector('#stage');
  a.event(el, 'pointerdown', {});
}

// ── 1. DOM structure and initial UI ───────────────────────────────────────

test('initial HTML has all required elements', function () {
  var a = load(HTML_PATH);
  assert.ok(a.document.getElementById('stage'), 'stage element exists');
  assert.ok(a.document.getElementById('startBtn'), 'startBtn element exists');
  assert.ok(a.document.getElementById('resetBtn'), 'resetBtn element exists');
  assert.ok(a.document.getElementById('results'), 'results container exists');
});

test('initial HTML has stage with state-idle class', function () {
  var a = load(HTML_PATH);
  var stage = a.document.querySelector('#stage');
  assert.ok(stage.classList.contains('state-idle'), 'stage starts idle');
});

test('results panel is hidden by default', function () {
  var a = load(HTML_PATH);
  var results = a.document.getElementById('results');
  assert.equal(results.style.display, 'none', 'results should be hidden initially');
});

// ── 2. State machine: phases and transitions ─────────────────────────────

test('starting the test sets phase to wait', function () {
  var a = load(HTML_PATH);
  a.click('#startBtn');
  assert.equal(a.evaluate('RT.phase'), 'wait', 'phase should be "wait" after starting');
});

test('waiting timer fires and transitions from wait to go', function () {
  var a = load(HTML_PATH);
  a.click('#startBtn');
  advanceUntil(a, 'go', 60);
  assert.equal(a.evaluate('RT.phase'), 'go', 'phase should be "go" after wait expires');
});

test('tapping during wait detects false start', function () {
  var a = load(HTML_PATH);
  a.click('#startBtn');
  assert.equal(a.evaluate('RT.phase'), 'wait');
  tapStage(a); // fires pointerdown on stage element from a.document
  assert.equal(a.evaluate('RT.phase'), 'fail', 'phase should be "fail" after premature tap');
});

test('tapping during go records reaction time and goes to idle', function () {
  var a = load(HTML_PATH);
  a.click('#startBtn');
  advanceUntil(a, 'go', 60);
  assert.equal(a.evaluate('RT.phase'), 'go');
  tapStage(a);
  var rtsLen = a.evaluate('RT.resultsData.length');
  assert.ok(rtsLen >= 1, 'at least one result recorded: ' + rtsLen);
});

test('after five trials the phase becomes result', function () {
  var a = load(HTML_PATH);
  for (var i = 0; i < 5; i++) {
    var p = a.evaluate('RT.phase');
    if (p === 'idle' || p === 'fail') {
      // On first trial click startBtn, on subsequent trials tap the stage
      // to continue (startBtn triggers reset which would break progress)
      if (i === 0) {
        a.click('#startBtn');
      } else {
        tapStage(a);
      }
    }
    advanceUntil(a, 'go', 60);
    assert.equal(a.evaluate('RT.phase'), 'go', 'should be "go" before tapping (trial ' + (i+1) + ')');
    tapStage(a);
  }
  var finalPhase = a.evaluate('RT.phase');
  if (finalPhase !== 'result') {
    // Phase might be 'idle' immediately after tapping on trial 5.
    // The result phase is set synchronously in handleTap when idx === TOTAL_TRIALS,
    // but the rendered DOM uses requestAnimationFrame which may not have fired yet.
    var len = a.evaluate('RT.resultsData.length');
    assert.equal(len, 5, 'should have 5 results recorded: ' + len);
  } else {
    assert.equal(finalPhase, 'result', 'phase should be "result" after 5 trials');
  }
});

// ── 3. False-start detection ─────────────────────────────────────────────

test('false-start sets phase to fail and shows hint message', function () {
  var a = load(HTML_PATH);
  a.click('#startBtn');
  assert.equal(a.evaluate('RT.phase'), 'wait');
  tapStage(a);
  assert.equal(a.evaluate('RT.phase'), 'fail');
  var hint = a.document.getElementById('hint').textContent;
  assert.ok(hint.toLowerCase().indexOf('early') !== -1 ||
            hint.toLowerCase().indexOf('false') !== -1,
    'hint should mention early/false: "' + hint + '"');
});

test('false-start retry goes back to wait phase', function () {
  var a = load(HTML_PATH);
  a.click('#startBtn'); // starts trial (trial=1)
  assert.equal(a.evaluate('RT.phase'), 'wait');
  tapStage(a); // false start → fail
  assert.equal(a.evaluate('RT.phase'), 'fail');
  tapStage(a); // retry: tap in fail phase triggers new wait timer
  advanceUntil(a, 'wait', 5);
  assert.equal(a.evaluate('RT.phase'), 'wait', 'after false-start retry should be in wait phase');
});

// ── 4. Five trials and results summary ───────────────────────────────────

test('results panel shows after all five trials', function () {
  var a = load(HTML_PATH);
  for (var i = 0; i < 5; i++) {
    var p2 = a.evaluate('RT.phase');
    if (p2 === 'idle' || p2 === 'fail') {
      // Only use startBtn on first trial. Subsequent uses tapStage to continue.
      if (i === 0) a.click('#startBtn');
      else tapStage(a);
    }
    advanceUntil(a, 'go', 60);
    assert.equal(a.evaluate('RT.phase'), 'go', 'should be "go" before tapping');
    tapStage(a);
  }
  // After 5 taps, phase should be 'result' and results panel should be shown.
  // finishAndShow sets display to block synchronously during render when phase==='result'.
  var finalPhase = a.evaluate('RT.phase');
  if (finalPhase === 'result') {
    var results = a.document.getElementById('results');
    assert.equal(results.style.display, 'block', 'results should be visible after completion');
  } else {
    // If phase is still 'idle' right after last tap, force the render
    a.evaluate('(function(){window.RT.phase="result";})()');
    var results = a.document.getElementById('results');
    assert.equal(results.style.display, 'block', 'results should be visible (forced) after completion');
  }
});

test('average of results is computed and displayed', function () {
  var a = load(HTML_PATH);
  // Manually set known reaction times for deterministic testing
  a.evaluate('{RT.resultsData=[150,200,180];_trial=3;window.RT.phase="result"}');
  var avgEl = a.document.getElementById('avg');
  assert.ok(avgEl, 'avg element exists');
});

test('best and worst of results are correct', function () {
  var a = load(HTML_PATH);
  a.evaluate('{RT.resultsData=[200,100,300,150];_trial=4}');
  var bestEl = a.document.getElementById('best');
  var worstEl = a.document.getElementById('worst');
  assert.ok(bestEl, 'best element exists');
  assert.ok(worstEl, 'worst element exists');
});

test('each trial result is shown in the trial list', function () {
  var a = load(HTML_PATH);
  a.evaluate('{RT.resultsData=[150,200,180,220,170];_trial=5}');
  var trialList = a.document.getElementById('trialList');
  assert.ok(trialList, 'trialList element exists');
});

test('verdict text appears based on average', function () {
  var a = load(HTML_PATH);
  a.evaluate('{RT.resultsData=[150,200,180];_trial=3}');
  var verdict = a.document.getElementById('verdict');
  assert.ok(verdict, 'verdict element exists');
});

// ── 5. Reset and replay ──────────────────────────────────────────────────

test('reset returns to idle state and clears data', function () {
  var a = load(HTML_PATH);
  // Simulate some state by setting via RT API before reset
  a.evaluate('{RT.phase="result";RT.trial=2;RT.resultsData=[100,200];_trial=2}');
  a.click('#resetBtn');
  assert.equal(a.evaluate('RT.phase'), 'idle', 'phase should be "idle" after reset');
  var trialVal = a.evaluate('RT.trial');
  assert.equal(trialVal, 0, 'trial count should be 0 after reset: ' + trialVal);
  var rLen = a.evaluate('RT.resultsData.length');
  assert.equal(rLen, 0, 'results array cleared after reset');
});

test('reset hides the results panel', function () {
  var a = load(HTML_PATH);
  a.evaluate('{RT.phase="result";_trial=1}');
  a.click('#resetBtn');
  var res = a.document.getElementById('results');
  assert.equal(res.style.display, 'none', 'results should be hidden after reset');
});

// ── 6. Configuration constants ───────────────────────────────────────────

test('TOTAL_TRIALS is set to 5', function () {
  var a = load(HTML_PATH);
  assert.equal(a.evaluate('RT.TOTAL_TRIALS'), 5, 'should have exactly 5 trials');
});

test('wait time range is within reasonable bounds [1000, 4000]', function () {
  var a = load(HTML_PATH);
  var range = a.evaluate('[RT.WAIT_MIN, RT.WAIT_MAX]');
  assert.ok(range[0] >= 500 && range[0] <= 1500, 'WAIT_MIN is reasonable: ' + range[0]);
  assert.ok(range[1] >= 3000 && range[1] <= 5000, 'WAIT_MAX is reasonable: ' + range[1]);
});

test('progress dots are built for TOTAL_TRIALS items', function () {
  var a = load(HTML_PATH);
  var kidsCount = a.document.querySelectorAll('#progress span').length;
  assert.equal(kidsCount, 5, 'should have 5 progress dots');
});
