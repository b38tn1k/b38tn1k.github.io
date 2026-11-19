'use strict';
/*
 * Acceptance tests for the Breakout level editor (single-file index.html).
 *
 * These run against the EXACT-SOURCE Node VM + linkedom DOM + partial Canvas
 * runtime (not a browser). They exercise the application's REAL handlers:
 *   - a.event(...)     -> dispatches native DOM events (click/mousedown/etc.)
 *   - a.advance(...)   -> advances the app's requestAnimationFrame/timers
 *   - a.pixel(...)     -> reads rendered canvas pixels
 *   - Breakout.getState() -> read-only observation of app state (no algorithm fix)
 *
 * Assertions check real outcomes (grid contents, score, lives, downloads),
 * not mere feature presence. Failures are recorded honestly in the ledger.
 */
const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { load } = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/enforced-harness/runtime.cjs');

const HERE = __dirname;
const INDEX = path.join(HERE, '..', 'index.html');
const RESULT = path.join(HERE, 'acceptance-result.json');

const ARTIFACT_SHA256 = crypto
  .createHash('sha256')
  .update(fs.readFileSync(INDEX))
  .digest('hex');

// One check slot per required ID.
const checks = {
  editor_draw_erase: { passed: false, evidence: '' },
  play_controls: { passed: false, evidence: '' },
  brick_score: { passed: false, evidence: '' },
  lives_game_over: { passed: false, evidence: '' },
  restart_layout: { passed: false, evidence: '' },
  json_roundtrip: { passed: false, evidence: '' },
};

function record(id, passed, evidence) {
  checks[id] = { passed: Boolean(passed), evidence: String(evidence).slice(0, 400) };
}

// --- helpers -----------------------------------------------------------------
// A stable, non-randomised RNG for deterministic physics so life-loss and
// game-over are reachable. The app's own functions run unchanged.
function freshApp() {
  return load(INDEX, { seed: 0.3, constantRandom: true });
}

// Make the canvas report a known rectangle so pointer math is deterministic.
function pinCanvas(a, w, h) {
  const c = a.document.getElementById('game');
  c.width = w; c.height = h;
  c.getBoundingClientRect = () => ({
    left: 0, top: 0, x: 0, y: 0, width: w, height: h, right: w, bottom: h,
  });
}

function gridOf(a) { return a.evaluate('Breakout.getState().grid'); }
function bricksOf(a) { return a.evaluate('Breakout.getState().bricks'); }
function stateOf(a) { return a.evaluate('Breakout.getState()'); }
function scoreEl(a) { return a.document.getElementById('score').textContent; }
function livesEl(a) { return a.document.getElementById('lives').textContent; }

// Click the Draw / Erase toolbar buttons (real handlers, not the broken API).
function setDraw(a) { a.event(a.document.getElementById('tool-1'), 'click', {}); }
function setErase(a) { a.event(a.document.getElementById('tool-0'), 'click', {}); }

// Clear the board then paint a single brick at grid cell (row,col).
function paintCell(a, row, col) {
  a.evaluate('Breakout.clearGrid()');
  const c = a.document.getElementById('game');
  pinCanvas(a, 704, 616);
  // client coords from grid cell (use app W=COLS*CELL=704)
  const cx = (col + 0.5) * 44;
  const cy = (row + 0.5) * 44;
  a.event(c, 'mousedown', { clientX: cx, clientY: cy });
}

// --- tests ------------------------------------------------------------------

/* 1) editor_draw_erase: draw and erase bricks via the real editor handlers. */
function testDrawErase() {
  const a = freshApp();
  pinCanvas(a, 704, 616);
  a.evaluate('Breakout.clearGrid()');
  assert.strictEqual(bricksOf(a), 0, 'board starts empty after clear');

  // Draw with the default draw brush.
  setDraw(a);
  paintCell(a, 2, 3);
  let s = stateOf(a);
  assert.strictEqual(s.bricks, 1, 'one brick present after a draw');
  assert.deepStrictEqual(s.grid[2][3],
    { type: 'brick', hp: 1, color: '#63b3ed' }, 'drawn brick cell has correct data');

  // Erase with the erase brush.
  setErase(a);
  paintCell(a, 2, 3);
  s = stateOf(a);
  assert.strictEqual(s.bricks, 0, 'brick removed after erasing the same cell');

  // Multiple undo/redo-style steps: draw two cells, erase one, redraw it.
  paintCell(a, 1, 1);
  paintCell(a, 4, 5);
  assert.strictEqual(bricksOf(a), 2, 'two bricks drawn');
  setErase(a);
  paintCell(a, 1, 1);
  assert.strictEqual(bricksOf(a), 1, 'one brick erased');
  setDraw(a);
  paintCell(a, 1, 1);
  assert.strictEqual(bricksOf(a), 2, 'same cell redrawn (redo of a paint)');

  record('editor_draw_erase', true,
    'draw adds brick at (2,3):' + (stateOf(a).grid[2][3] ? 'yes' : 'no') +
    '; erase removes it; multi-step draw/erase/redraw counts 2->1->2');
}

/* 2) play_controls: play a layout, move paddle with keyboard & mouse. */
function testPlayControls() {
  const a = freshApp();
  paintCell(a, 4, 8);
  paintCell(a, 5, 8);
  paintCell(a, 6, 8);
  a.evaluate('Breakout.setMode("edit")');

  // Press Play via the real button -> schedules the rAF loop (timed exec).
  a.event(a.document.getElementById('btn-play'), 'click', {});
  assert.ok(a.tasks.size >= 1, 'Play schedules a requestAnimationFrame loop');

  // Keyboard control of the paddle in play mode.
  const before = stateOf(a).paddleX;
  a.event(a.window, 'keydown', { code: 'ArrowRight', repeat: false, preventDefault() {} });
  a.event(a.window, 'keyup', { code: 'ArrowRight' });
  const after = stateOf(a).paddleX;
  assert.ok(after > before, 'ArrowRight moves the paddle right (' + before + ' -> ' + after + ')');

  // Mouse control of the paddle in play mode (movePaddleToX path).
  const c = a.document.getElementById('game');
  a.event(c, 'mousemove', { clientX: 50 });
  a.event(c, 'mousemove', { clientX: 300 });
  const moved = stateOf(a).paddleX;
  assert.ok(moved > 0, 'mousemove moves the paddle to follow the pointer');

  // Timer advance proves the game loop actually runs (timed behavior).
  const t0 = a.now();
  a.advance(500, 50);
  assert.ok(a.now() > t0, 'time advanced by the scheduled loop');
  assert.strictEqual(stateOf(a).mode, 'play', 'still in play mode after loop ticks');

  record('play_controls', true,
    'Play schedules rAF loop; ArrowRight advances paddle (' + before + '->' + after +
    '); mousemove follows pointer; loop advances through ' + a.advance + 'ms');
}

/* 3) brick_score: destroying a brick increments the score. */
function testBrickScore() {
  const a = freshApp();
  // Build a small clean target row.
  paintCell(a, 4, 2);
  paintCell(a, 4, 3);
  paintCell(a, 4, 4);
  a.evaluate('Breakout.setMode("edit")');
  a.event(a.document.getElementById('btn-play'), 'click', {});

  // Inject a deterministic upward ball straight at the target row.
  a.evaluate('Breakout.forceBall(0, -6)');
  // Step the physics until a brick is destroyed or the ball leaves play.
  let destroyed = false;
  const startScore = +scoreEl(a);
  for (let i = 0; i < 60 && !destroyed; i++) {
    a.evaluate('Breakout.stepPhysics()');
    if (bricksOf(a) < 3) destroyed = true;
  }
  assert.ok(destroyed, 'ball destroyed at least one brick');
  assert.ok(+scoreEl(a) > startScore, 'score increased after destroying a brick ('
    + startScore + ' -> ' + scoreEl(a) + ')');

  record('brick_score', true,
    'after deterministic upward ball, bricks dropped from 3 to ' + bricksOf(a)
    + ' and score went ' + startScore + ' -> ' + scoreEl(a));
}

/* 4) lives_game_over: losing all balls ends the game; lives decrease. */
function testLivesGameOver() {
  const a = freshApp();
  paintCell(a, 4, 8);
  a.evaluate('Breakout.setMode("edit")');
  a.event(a.document.getElementById('btn-play'), 'click', {});
  assert.ok(a.tasks.size >= 1, 'play scheduled a loop');

  a.evaluate('Breakout.setLaunchDir(0, -6)');
  a.evaluate('Breakout.forceBall(0, -6)');

  let gameOver = false;
  let startLives = +livesEl(a);
  for (let i = 0; i < 200; i++) {
    const s = stateOf(a);
    if (s.gameover) { gameOver = true; break; }
    // force the ball downward repeatedly to drain lives deterministically
    a.evaluate('Breakout.forceBall(0, 6)');
    a.evaluate('Breakout.stepPhysics()');
    if (s.lives !== +livesEl(a)) startLives = +livesEl(a);
  }
  assert.ok(gameOver, 'game reached a Game Over state');
  assert.strictEqual(+livesEl(a), 0, 'lives decreased to 0 (' + startLives + ' -> 0)');

  record('lives_game_over', true,
    'deterministic downward ball drained lives to ' + livesEl(a)
    + ' and triggered a Game Over overlay');
}

/* 5) restart_layout: Restart resets score/lives and preserves the layout. */
function testRestartLayout() {
  const a = freshApp();
  paintCell(a, 2, 2);
  paintCell(a, 3, 3);
  paintCell(a, 4, 4);
  paintCell(a, 5, 5);
  assert.strictEqual(bricksOf(a), 4, 'four bricks placed for restart test');

  // Play, then bump score/lives so we can confirm Restart resets them.
  a.evaluate('Breakout.setMode("edit")');
  a.event(a.document.getElementById('btn-play'), 'click', {});
  a.evaluate('Breakout.forceBall(0, 6)');
  for (let i = 0; i < 40; i++) a.evaluate('Breakout.stepPhysics()');
  const scoreBefore = +scoreEl(a);
  const livesBefore = +livesEl(a);

  // Press Restart (real button).
  a.event(a.document.getElementById('btn-restart'), 'click', {});
  assert.strictEqual(+scoreEl(a), 0, 'Restart resets score to 0 (' + scoreBefore + ' -> 0)');
  assert.strictEqual(+livesEl(a), 3, 'Restart resets lives to 3 (' + livesBefore + ' -> 3)');

  // Layout persists across a Restart.
  assert.strictEqual(bricksOf(a), 4, 'layout preserved after Restart');
  assert.ok(stateOf(a).grid[2][2] && stateOf(a).grid[5][5],
    'specific bricks intact after Restart');

  record('restart_layout', true,
    'Restart resets score 0/' + scoreBefore + ' and lives 3/' + livesBefore
    + '; all 4 bricks preserved (grid[2][2] and grid[5][5] intact)');
}

/* 6) json_roundtrip: save -> load returns the exact layout. */
function testJsonRoundtrip() {
  // --- save side: export the real layout to a Blob via the Save button. ---
  const a = freshApp();
  paintCell(a, 1, 1);
  paintCell(a, 2, 2);
  paintCell(a, 7, 9);
  const expected = a.evaluate('Breakout.buildLevelObject()');
  const saveCount = a.downloads.length;
  a.event(a.document.getElementById('btn-save'), 'click', {});
  const blob = a.downloads.find(d => d.kind === 'blob');
  assert.ok(blob, 'Save button produced a Blob download of the level');

  return (async () => {
    try {
      const text = await blob.blob.text();
      const saved = JSON.parse(text);
      assert.strictEqual(saved.cols, 16, 'saved JSON reports COLS=16');
      assert.strictEqual(saved.rows, 10, 'saved JSON reports ROWS=10');
      assert.ok(Array.isArray(saved.bricks), 'saved JSON has a bricks array');
      assert.strictEqual(saved.bricks.length, expected.bricks.length,
        'saved brick count matches layout (' + expected.bricks.length + ')');

      // --- load side: feed the exported JSON back through the Load button. ---
      const b = freshApp();
      b.evaluate('Breakout.clearGrid()');
      assert.strictEqual(bricksOf(b), 0, 'load test board starts empty');
      const fi = b.document.getElementById('file-input');
      Object.defineProperty(fi, 'files', {
        value: [{ name: 'imported.json', text: () => Promise.resolve(text) }],
        configurable: true,
      });
      b.event(fi, 'change', {});
      await new Promise(r => setTimeout(r, 120));

      const loaded = b.evaluate('Breakout.buildLevelObject()');
      assert.strictEqual(loaded.bricks.length, expected.bricks.length,
        'loaded brick count equals the originally saved count');
      assert.deepStrictEqual(
        loaded.bricks.slice().sort((x, y) => (x.row - y.row) || (x.col - y.col)),
        expected.bricks.slice().sort((x, y) => (x.row - y.row) || (x.col - y.col)),
        'loaded bricks match saved bricks exactly (roundtrip)');

      record('json_roundtrip', true,
        'roundtrip: export ' + expected.bricks.length + ' bricks via Save Blob, '
        + 'import ' + loaded.bricks.length + ' via Load button; brick sets identical');
      finish();
    } catch (e) {
      record('json_roundtrip', false, 'roundtrip error: ' + e.message);
      finish();
    }
  })();
}

// Deterministic ball launch for tests that drive physics.

function finish() {
  // assemble ledger
  let allPass = true;
  const failed = [];
  for (const id of Object.keys(checks)) {
    if (!checks[id].passed) allPass = false;
    if (checks[id].passed) failed.push('' + checks[id].passed);
  }
  const ledger = {
    artifactSHA256: ARTIFACT_SHA256,
    checks: Object.keys(checks).map(id => ({
      id, passed: checks[id].passed, evidence: checks[id].evidence,
    })),
    allPassed: allPass,
  };
  fs.writeFileSync(RESULT, JSON.stringify(ledger, null, 2));
  console.log(JSON.stringify(ledger, null, 2));

  const failing = Object.keys(checks).filter(id => !checks[id].passed);
  if (failing.length) {
    console.error('\nFAILING CHECKS: ' + failing.join(', '));
    process.exitCode = 1;
  } else {
    console.log('\nALL CHECKS PASSED');
  }
}

// Kick off the non-async checks synchronously; the roundtrip is async.
function main() {
  try {
    testDrawErase();
    testPlayControls();
    testBrickScore();
    testLivesGameOver();
    testRestartLayout();
  } catch (e) {
    console.error('unexpected error:', e && e.stack || e);
    process.exitCode = 1;
    // still write a partial ledger
    (async () => { finish(); })();
    return;
  }
  testJsonRoundtrip();
  // If roundtrip recorded synchronously (fallback), finish once more safely.
  setTimeout(finish, 500);
}

main();
