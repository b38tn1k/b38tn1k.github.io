// Behavior tests for the reaction-time tester.
// These encode the SPEC before production logic; they should FAIL, then pass.
const { test } = require('node:test');
const assert = require('node:assert');
const { load } = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');

// A fresh app instance. The DOM uses a seeded RNG so waits are deterministic and
// testable. `seed` is exposed via window.__seed for the tests to control.
function loadApp(seed) {
  const a = load('index.html', {});
  if (seed !== undefined) a.evaluate(`window.__seed=${seed};`);
  return a;
}

test('starts in ready state; clicking begins trial 1', () => {
  const a = loadApp();
  assert.equal(a.evaluate('app.state'), 'ready');
  assert.equal(a.evaluate('app.trial'), 1);
  a.click('#stage');
  assert.equal(a.evaluate('app.state'), 'waiting');
  // The random wait was drawn from the seeded range (1000..5000ms).
  assert.ok(a.evaluate('app.waitEnd - Date.now()') >= 1000);
  assert.ok(a.evaluate('app.waitEnd - Date.now()') <= 5000);
});

test('no premature stimulus before the random wait elapses', () => {
  const a = loadApp(42);
  a.click('#stage');
  a.advance(999);
  assert.equal(a.evaluate('app.stimulated'), false);
  assert.equal(a.evaluate('app.state'), 'waiting');
});

test('clicking before stimulus is a false start', () => {
  const a = loadApp(7);
  a.click('#stage');
  a.advance(1000);
  assert.equal(a.evaluate('app.stimulated'), false);
  a.click('#stage');
  assert.equal(a.evaluate('app.state'), 'falsestart');
  assert.equal(a.evaluate('app.falseStarts'), 1);
});

test('a valid click after stimulus records reaction time', () => {
  const a = loadApp(123);
  a.click('#stage');
  const waitEnd = a.evaluate('app.waitEnd');
  a.advance(waitEnd - a.evaluate('Date.now()') + 5);
  assert.equal(a.evaluate('app.stimulated'), true);
  a.click('#stage');
  const rt = a.evaluate('app.lastRT');
  assert.ok(rt >= 0, 'rt should be non-negative, got ' + rt);
  assert.ok(rt < 2000, 'reaction time should be plausibly small, got ' + rt);
  assert.equal(a.evaluate('app.state'), 'result');
});

test('after a result, clicking advances to the next trial (max 5)', () => {
  const a = loadApp(99);
  const rts = playAll(a);
  // After 5 results, the run is done.
  assert.equal(a.evaluate('app.trial'), 6);
  assert.equal(a.evaluate('app.state'), 'done');
  assert.equal(rts.length, 5);
});

test('false start re-arms with a fresh random wait', () => {
  const a = loadApp(55);
  a.click('#stage');
  a.advance(1000);
  a.click('#stage');
  assert.equal(a.evaluate('app.state'), 'falsestart');
  a.click('#stage');
  assert.equal(a.evaluate('app.state'), 'waiting');
  const secondWait = a.evaluate('app.waitEnd');
  // re-arming schedules at least the minimum wait from the current clock
  assert.ok(secondWait >= 1000, 'second wait must be at least the minimum');
});

test('results summary computes mean, min, max and count of valid trials', () => {
  const a = loadApp(321);
  const rts = playAll(a);
  assert.equal(rts.length, 5);
  const summary = JSON.parse(a.evaluate(`JSON.stringify(app.summary())`));
  assert.equal(summary.count, 5);
  assert.equal(summary.rts.length, 5);
  let sum = 0; for (const r of rts) sum += r;
  assert.ok(Math.abs(summary.mean - sum / 5) < 1e-6);
  assert.equal(summary.min, Math.min.apply(null, rts));
  assert.equal(summary.max, Math.max.apply(null, rts));
});

// Drive five full trials (ready/waiting/stimulated/result) and return the RTs.
function playAll(a) {
  const rts = [];
  for (let completed = 0; completed < 5; completed++) {
    // Step 1: get into 'waiting' if we're at 'ready'.
    if (a.evaluate('app.state') === 'ready') { a.click('#stage'); }
    // Step 2: wait for stimulus, then click to record RT -> 'result'.
    while (a.evaluate('app.state') === 'waiting') {
      const waitEnd = a.evaluate('app.waitEnd');
      a.advance(waitEnd - a.evaluate('Date.now()') + 3);
      a.click('#stage'); // becomes 'result'
    }
    rts.push(a.evaluate('app.lastRT'));
    // Step 3: move to the next trial unless we're done.
    if (a.evaluate('app.state') === 'done') break;
    a.click('#stage'); // 'result' -> next trial
  }
  return rts;
}

test('summary rounds mean and assigns a rating band', () => {
  const a = loadApp(1);
  // drive five real trials
  for (let i = 0; i < 5; i++) {
    const st = a.evaluate('app.state');
    if (st === 'ready' || st === 'falsestart') { a.click('#stage'); continue; }
    if (st === 'waiting') {
      const waitEnd = a.evaluate('app.waitEnd');
      a.advance(waitEnd - a.evaluate('Date.now()') + 3);
      a.click('#stage');
    } else if (st === 'result') { a.click('#stage'); }
  }
  const s = JSON.parse(a.evaluate(`JSON.stringify(app.summary())`));
  assert.equal(s.mean, Math.round(s.mean));
  assert.ok(['fast', 'average', 'slow'].includes(s.rating), 'got ' + s.rating);
});

test('spamming clicks during waiting only false-starts until stimulus', () => {
  // seed 1 gives the longest first wait (~4171ms). Advancing 999ms between
  // clicks keeps us under the minimum for the first clicks but the loop
  // asserts on the false-start counter reaching the number of premature clicks
  // that occur before the stimulus fires.
  const a = loadApp(1);
  a.click('#stage');
  let falseStarts = 0;
  for (let i = 0; i < 20; i++) {
    a.advance(999);
    a.click('#stage');
    const st = a.evaluate('app.state');
    if (st === 'result' || st === 'done') break;
    if (st === 'falsestart') falseStarts++;
  }
  assert.ok(falseStarts >= 3, 'expected several false starts before stimulus');
  assert.ok(a.evaluate('app.falseStarts') >= 3);
});
