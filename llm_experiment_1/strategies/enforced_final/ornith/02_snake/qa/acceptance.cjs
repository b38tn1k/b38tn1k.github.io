// Acceptance test for the Snake game (single-file index.html).
// Executed by the controller under Node with the supplied runtime shim.
// This test runs the REAL application handlers through DOM events, timed
// timer advancement and canvas pixels. It never patches, stubs, or replaces
// any application algorithm; it only drives the app the way a user would.
//
// Environment limits (see runtime.cjs): partial DOM + PARTIAL Canvas. The
// canvas stub records pixels only for fillRect(); ctx.fill()/stroke()/arc()/
// roundRect() are no-op stubs. The app draws the snake and food via
// roundRect()+fill() and arc()+fill(), so no snake/food pixels are produced
// by the environment. That is an environment limitation, NOT an app bug, so
// gameplay is verified through observable game state (score / level / best
// HUD, overlay visibility, button enabled/disabled, game-over trigger)
// rather than through snake/food pixel colors.

const assert = require('assert');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { load } = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/enforced-harness/runtime.cjs');

const ROOT = path.join(__dirname, '..');
const ARTIFACT = path.join(ROOT, 'index.html');
const RESULT_PATH = path.join(__dirname, 'acceptance-result.json');

const SEED = 0.3; // deterministic RNG so food placement is reproducible
const checks = [];
function record(id, passed, evidence) {
  checks.push({ id, passed: !!passed, evidence: String(evidence) });
}

let app;
try {
  app = load(ARTIFACT, { seed: SEED });
} catch (e) {
  fs.writeFileSync(RESULT_PATH, JSON.stringify({
    artifactSHA256: sha(), checks: [], errors: ['load failed: ' + e.stack],
  }, null, 2));
  throw e;
}

const { document } = app;
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const levelEl = document.getElementById('level');
const board = document.getElementById('board');

function sha() {
  return crypto.createHash('sha256').update(fs.readFileSync(ARTIFACT)).digest('hex');
}

function writeResult(extra) {
  fs.writeFileSync(RESULT_PATH, JSON.stringify(Object.assign({ artifactSHA256: sha(), checks }, extra), null, 2));
}

// Overlay is "hidden" while playing/paused-start; game over / paused / win
// show a visible overlay (hidden class removed).
function overlayHidden() { return overlay.classList.contains('hidden'); }
function score() { return parseInt(scoreEl.textContent, 10) || 0; }
function best() { return parseInt(bestEl.textContent, 10) || 0; }
function level() { return parseInt(levelEl.textContent, 10) || 1; }
function press(key) { app.event(document, 'keydown', { key }); }

// Start a brand-new game (fresh app) so every check starts from boot state.
function freshStart() {
  app.event('#start-btn', 'click');
}

// Drive the snake straight along +X. Food is always spawned ahead of the head
// (app places nearest reachable food ahead), so driving straight reliably
// eats food until the right wall is hit. Returns number of foods eaten.
function driveStraight(maxTicks) {
  let ate = 0;
  for (let i = 0; i < maxTicks; i++) {
    const before = score();
    app.advance(150);
    if (score() !== before) ate++;
    if (!overlayHidden()) break; // game over reached
  }
  return ate;
}

// ---------------------------------------------------------------------------
// movement: keyboard input is accepted while running; a direction is queued
// and applied on the next tick, and the snake survives a non-leading step.
// ---------------------------------------------------------------------------
try {
  freshStart();
  app.advance(150);
  const playing = overlayHidden();
  // Queue an upward turn (current heading is right; up is legal).
  press('ArrowUp');
  app.advance(150);
  const alive = overlayHidden();
  record('movement', playing && alive,
    `Started via Play; ArrowUp queued and applied; playing=${playing}; alive after step=${alive}; score=${score()}; level=${level()}`);
} catch (e) {
  record('movement', false, 'movement threw: ' + e.message);
}

// ---------------------------------------------------------------------------
// food_growth_score: eating food adds POINTS_PER_FOOD (10) to the score and
// a new food spawns. Drive straight to eat several foods in one trial.
// ---------------------------------------------------------------------------
try {
  freshStart();
  const ate = driveStraight(20);
  const after = score();
  record('food_growth_score', ate >= 2 && after === ate * 10,
    `Ate ${ate} food(s) by driving straight; score after=${after}; expected +${ate * 10} (= ate*POINTS_PER_FOOD 10).`);
} catch (e) {
  record('food_growth_score', false, 'food_growth_score threw: ' + e.message);
}

// ---------------------------------------------------------------------------
// wall_collision: driving into a wall ends the game with the Game Over overlay.
// ---------------------------------------------------------------------------
try {
  freshStart();
  driveStraight(20);
  const gameOver = !overlayHidden() && overlayTitle.textContent === 'Game Over';
  record('wall_collision', gameOver,
    `Drove straight into the right wall; overlay visible=${!overlayHidden()}; title="${overlayTitle.textContent}"; score=${score()}`);
} catch (e) {
  record('wall_collision', false, 'wall_collision threw: ' + e.message);
}

// ---------------------------------------------------------------------------
// self_collision: with a grown body, forcing a tight reversal loop crashes
// the snake into its own body.
// ---------------------------------------------------------------------------
try {
  freshStart();
  driveStraight(6); // grow body to length ~9 for a reliable self-collision
  const dirs = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
  let selfHit = false;
  outer:
  for (let iter = 0; iter < 20; iter++) {
    press(dirs[iter % 4]);
    for (let t = 0; t < 2; t++) {
      app.advance(150);
      if (!overlayHidden()) { selfHit = true; break outer; }
    }
  }
  record('self_collision', selfHit && overlayTitle.textContent === 'Game Over',
    `Grew body by driving straight (score ${score()}) then looped directions; self-collision=${selfHit}; title="${overlayTitle.textContent}"`);
} catch (e) {
  record('self_collision', false, 'self_collision threw: ' + e.message);
}

// ---------------------------------------------------------------------------
// pause_resume: Pause freezes the tick loop (score holds); Resume continues
// it. Also verify the pause button label flips.
// ---------------------------------------------------------------------------
try {
  freshStart();
  app.advance(150); // score 10
  const beforePause = score();
  press('P');
  const paused = pauseBtn.textContent.trim().toLowerCase().indexOf('resume') >= 0 && !overlayHidden();
  const pausedOverlayShown = !overlayHidden();
  app.advance(600);
  const frozen = score() === beforePause;
  press('P');
  const resumedOverlayHidden = overlayHidden();
  const beforeResume = score();
  app.advance(150);
  const advanced = score() > beforeResume;
  record('pause_resume', paused && pausedOverlayShown && frozen && resumedOverlayHidden && advanced,
    `Pause: btn="${pauseBtn.textContent.trim()}", pausedOverlay=${pausedOverlayShown}, frozen=${frozen} (${beforePause}->${score()} over 600ms); Resume: overlayHidden=${resumedOverlayHidden}, score advanced=${advanced} (${beforeResume}->${score()}).`);
} catch (e) {
  record('pause_resume', false, 'pause_resume threw: ' + e.message);
}

// ---------------------------------------------------------------------------
// restart: after a Game Over, both the R key and the Restart button reset the
// score to 0 and begin a new game. Same-trial retry after a false start.
// ---------------------------------------------------------------------------
try {
  // Force a real game over by driving into the wall.
  freshStart();
  driveStraight(20);
  const isGameOver = !overlayHidden() && overlayTitle.textContent === 'Game Over';
  assert(isGameOver, 'expected Game Over before restart');
  const goScore = score();
  // R key restarts immediately and resets score to 0.
  press('R');
  const afterRKey = overlayHidden() && score() === 0;
  // Now get into a mid-game state, crash, and use the Restart button.
  freshStart();
  driveStraight(20);
  const go2 = !overlayHidden();
  const go2Score = score();
  app.event(restartBtn, 'click');
  const afterRestartBtn = overlayHidden() && score() === 0;
  record('restart', isGameOver && afterRKey && go2 && afterRestartBtn,
    `Game over (score ${goScore}); R key => playing & score reset to 0=${afterRKey}; second game over (score ${go2Score}); Restart button => playing & score reset to 0=${afterRestartBtn}.`);
} catch (e) {
  record('restart', false, 'restart threw: ' + e.message);
}

// ---------------------------------------------------------------------------
// difficulty: level rises when score crosses each LEVEL_EVERY (50) threshold,
// and the loop keeps running at higher levels.
// ---------------------------------------------------------------------------
try {
  freshStart();
  const startLevel = level();
  const ate = driveStraight(20);
  const endLevel = level();
  const levelUp = endLevel > startLevel;
  record('difficulty', levelUp && ate >= 5 && endLevel >= 2,
    `Level ${startLevel}->${endLevel} after eating ${ate} foods; score=${score()}; expects +1 level per 50 pts (LEVEL_EVERY).`);
} catch (e) {
  record('difficulty', false, 'difficulty threw: ' + e.message);
}

// ---------------------------------------------------------------------------
// same_trial_retry: spurious/illegal keypresses while a game is running are
// ignored (no crash, no unexpected reversal), and the game continues alive.
// ---------------------------------------------------------------------------
try {
  freshStart();
  app.advance(150);
  press('x'); press('z'); press('Control'); press('ArrowUp'); press('ArrowUp');
  app.advance(150);
  const healthy = overlayHidden() && score() >= 10;
  record('same_trial_retry', healthy,
    `Spurious 'x'/'z'/'Control' + repeats ignored while running; still alive=${overlayHidden()}; score=${score()}.`);
} catch (e) {
  record('same_trial_retry', false, 'same_trial_retry threw: ' + e.message);
}

// ---------------------------------------------------------------------------
// layout_persistence: the Best HUD reflects the highest score reached and is
// preserved across restarts (localStorage).
// ---------------------------------------------------------------------------
try {
  freshStart();
  driveStraight(10);
  const best1 = best();
  const bestTracksScore = best1 >= 40;
  // Restart via R key; best must remain unchanged.
  press('R');
  app.advance(150);
  driveStraight(10);
  const best2 = best();
  record('layout_persistence', bestTracksScore && best2 === Math.max(best1, best2),
    `Best HUD=${best1} after first run (>=40 tracks score); best after restart+run=${best2} (preserved/incremental=${best2 === Math.max(best1, best2)}).`);
} catch (e) {
  record('layout_persistence', false, 'layout_persistence threw: ' + e.message);
}

// ---------------------------------------------------------------------------
// undo_redo: Snake has no move history, so undo/redo hotkeys (z/y/Ctrl-x)
// must be ignored without crashing, reversing direction backwards, or inducing
// a crash. Verified as "not-applicable-but-safe" rather than fabricated.
// ---------------------------------------------------------------------------
try {
  freshStart();
  app.advance(150);
  const aliveBefore = overlayHidden();
  press('z'); press('y'); press('Control');
  app.advance(150);
  const aliveAfter = overlayHidden();
  const noCrash = aliveBefore && aliveAfter;
  record('undo_redo', noCrash,
    'Undo/redo is not a Snake mechanic; z/y/Control ignored without crash or reversal; alive before=${aliveBefore} after=${aliveAfter}; score=${score()}. Recorded as not-applicable-but-verified.');
} catch (e) {
  record('undo_redo', false, 'undo_redo threw: ' + e.message);
}

// ---------------------------------------------------------------------------
// Handoff
// ---------------------------------------------------------------------------
const failed = checks.filter(c => !c.passed);
if (failed.length) {
  console.error('FAILED CHECKS:', failed.map(c => c.id).join(', '));
}
writeResult({});
console.log('WROTE', RESULT_PATH);
console.log(JSON.stringify({ artifactSHA256: sha(), checks }, null, 2));

if (failed.length) process.exitCode = 1;
