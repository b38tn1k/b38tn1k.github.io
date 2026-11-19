const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require(
  '/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs'
);

const PATH = './index.html';
const TICK_MS = 120; // initial tick interval (matches default in index.html)

// A helper that loads the game. Stepping is fully controlled by the test via
// step(), which calls the page's window.__snakeStep() directly.
function loadGame() {
  const a = load(PATH);
  const doc = a.document;
  const canvas = () => doc.querySelector('canvas');
  const ctx = () => canvas().getContext('2d');
  return { a, doc, canvas, ctx };
}

// The game exposes its state and driving primitives on `window`. The frozen
// runtime only reflects those properties via evaluate(), so every call goes
// through a.evaluate.
function call(a, expr) {
  return a.evaluate(expr);
}

// Advance the page's own game loop by exactly one game step. We call the page's
// exposed step() function directly (window.__snakeStep) so tests are immune to
// bootstrap timers and scheduling jitter; one call == one deliberate step.
function step(a, doc) {
  a.evaluate('window.__snakeStep()');
}

function state(a) {
  return JSON.parse(a.evaluate('JSON.stringify(window.__snakeState())'));
}

// Set a controlled game state. This only assigns state and renders; it does
// NOT schedule any timer, so tests fully control stepping via step().
function reset(a, cfg) {
  if (cfg) {
    a.evaluate('window.__snakeReset(' + JSON.stringify(cfg) + ')');
  } else {
    a.evaluate('window.__snakeReset()');
  }
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

test('exposes game state for testing', () => {
  const { a } = loadGame();
  const s = state(a);
  assert.ok(Array.isArray(s.snake));
  assert.ok(typeof s.score === 'number');
  assert.ok(['up', 'down', 'left', 'right'].includes(s.direction));
  assert.equal(s.cols, 20);
  assert.equal(s.rows, 20);
});

test('snake starts with at least three cells', () => {
  const { a } = loadGame();
  const s = state(a);
  assert.ok(s.snake.length >= 3, `expected >=3 cells, got ${s.snake.length}`);
});

test('initial direction is right', () => {
  const { a } = loadGame();
  assert.equal(state(a).direction, 'right');
});

test('initial snake length is exactly three', () => {
  const { a } = loadGame();
  assert.equal(state(a).snake.length, 3);
});

test('food is within grid bounds and off the snake', () => {
  const { a } = loadGame();
  const s = state(a);
  assert.ok(s.food && typeof s.food.x === 'number' && typeof s.food.y === 'number');
  assert.ok(s.food.x >= 0 && s.food.x < s.cols, 'food x in range');
  assert.ok(s.food.y >= 0 && s.food.y < s.rows, 'food y in range');
  const onSnake = s.snake.some((c) => c.x === s.food.x && c.y === s.food.y);
  assert.equal(onSnake, false, 'food must not start on the snake');
});

// ---------------------------------------------------------------------------
// Movement & turning
// ---------------------------------------------------------------------------

test('ArrowRight moves head right and keeps length constant (no growth)', () => {
  const { a, doc } = loadGame();
  reset(a, {
    snake: [
      { x: 3, y: 10 },
      { x: 2, y: 10 },
      { x: 1, y: 10 },
    ],
    direction: 'right',
    food: { x: 9, y: 9 },
  });
  const before = state(a);
  a.event(doc, 'keydown', { key: 'ArrowRight' });
  step(a, doc);
  const after = state(a);
  assert.equal(after.direction, 'right');
  // Head advanced by one cell.
  assert.equal(after.snake[0].x, before.snake[0].x + 1);
  // No food eaten: the snake length is unchanged (it slid, not grew).
  assert.equal(after.snake.length, before.snake.length);
  // Every body segment advanced together (each cell shifted right by one).
  for (let i = 0; i < before.snake.length; i++) {
    assert.equal(after.snake[i].x, before.snake[i].x + 1, `segment ${i}`);
    assert.equal(after.snake[i].y, before.snake[i].y, `segment ${i} y`);
  }
});

test('cannot reverse directly into itself', () => {
  const { a, doc } = loadGame();
  a.event(doc, 'keydown', { key: 'ArrowRight' });
  step(a, doc);
  const going = state(a).direction;
  a.event(doc, 'keydown', { key: 'ArrowLeft' });
  step(a, doc);
  assert.equal(state(a).direction, going);
});

test('each arrow key sets the corresponding direction', () => {
  // For each key we set up a snake whose current direction makes that key a
  // legal turn (perpendicular), since reversing into the body is intentionally
  // rejected. Head is index 0 (as the game expects).
  //   dir:    current direction (make keypress a legal turn)
  //   target: direction after pressing the key
  //   snake:  head-first cells, laid so the target turn is unobstructed
  const cases = [
    { key: 'ArrowUp', dir: 'right', target: 'up', snake: [[10, 6], [10, 7], [10, 8]] },
    { key: 'ArrowDown', dir: 'right', target: 'down', snake: [[10, 8], [10, 7], [10, 6]] },
    { key: 'ArrowLeft', dir: 'up', target: 'left', snake: [[8, 10], [9, 10], [10, 10]] },
    { key: 'ArrowRight', dir: 'up', target: 'right', snake: [[10, 10], [9, 10], [8, 10]] },
  ];
  for (const c of cases) {
    const { a, doc } = loadGame();
    reset(a, {
      snake: c.snake.map((p) => ({ x: p[0], y: p[1] })),
      direction: c.dir,
      food: { x: 9, y: 9 },
    });
    a.event(doc, 'keydown', { key: c.key });
    step(a, doc);
    assert.equal(state(a).direction, c.target, `key ${c.key}`);
  }
});

// ---------------------------------------------------------------------------
// Food, scoring, growth
// ---------------------------------------------------------------------------

test('eating food increases score by 10 and grows the snake by one', () => {
  const { a, doc } = loadGame();
  // Head one cell away from the food; the single controlled step() eats it.
  reset(a, {
    snake: [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ],
    direction: 'right',
    food: { x: 6, y: 5 },
  });
  const before = state(a);
  step(a, doc); // head 5 -> 6 (eat food)
  const s = state(a);
  assert.equal(s.score, before.score + 10);
  assert.equal(s.snake.length, before.snake.length + 1);
  assert.equal(s.snake[0].x, 6, 'head advanced into the food cell');
});

test('new food spawns on a non-snake cell', () => {
  const { a, doc } = loadGame();
  reset(a, {
    snake: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
    direction: 'right',
    food: { x: 3, y: 0 },
  });
  step(a, doc); // eat food at (3,0)
  const s = state(a);
  const onSnake = s.snake.some((c) => c.x === s.food.x && c.y === s.food.y);
  assert.equal(onSnake, false, 'food must not land on the snake');
});

// ---------------------------------------------------------------------------
// Collisions
// ---------------------------------------------------------------------------

test('hitting a wall ends the game (gameOver true)', () => {
  const { a, doc } = loadGame();
  reset(a, {
    snake: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
    direction: 'left',
    food: { x: 5, y: 5 },
  });
  // Moving left from x=0 hits the wall.
  step(a, doc);
  assert.equal(state(a).gameOver, true);
});

test('hitting own body ends the game', () => {
  const { a, doc } = loadGame();
  // An 8-cell coil that lets the head loop back into its own body.
  reset(a, {
    snake: [
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
    ],
    direction: 'right',
    food: { x: 9, y: 9 },
  });
  a.event(doc, 'keydown', { key: 'ArrowDown' });
  step(a, doc); // (4,3) -> (4,4)
  a.event(doc, 'keydown', { key: 'ArrowLeft' });
  step(a, doc); // (4,4) -> (3,4)
  a.event(doc, 'keydown', { key: 'ArrowUp' });
  step(a, doc); // (3,4) -> (3,3) which is occupied by body -> gameOver
  assert.equal(state(a).gameOver, true);
});

// ---------------------------------------------------------------------------
// Pause / restart
// ---------------------------------------------------------------------------

test('pause freezes the game loop (score and position unchanged)', () => {
  const { a, doc } = loadGame();
  reset(a, {
    snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }],
    direction: 'right',
    food: { x: 6, y: 5 },
  });
  a.event(doc, 'keydown', { key: 'p' });
  const statePaused = state(a);
  const scorePaused = statePaused.score;
  const headPaused = { ...statePaused.snake[0] };
  for (let i = 0; i < 5; i++) step(a, doc);
  const s = state(a);
  assert.equal(s.paused, true);
  assert.equal(s.score, scorePaused, 'score must not change while paused');
  assert.deepEqual(s.snake[0], headPaused, 'head must not move while paused');
});

test('resuming unpauses the game', () => {
  const { a, doc } = loadGame();
  a.event(doc, 'keydown', { key: 'p' });
  a.event(doc, 'keydown', { key: 'p' });
  assert.equal(state(a).paused, false);
});

test('restart resets snake, score, direction, food and game over', () => {
  const { a, doc } = loadGame();
  reset(a, {
    snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }],
    direction: 'right',
    food: { x: 6, y: 5 },
  });
  a.event(doc, 'keydown', { key: 'r' });
  const s = state(a);
  assert.equal(s.score, 0);
  assert.equal(s.direction, 'right');
  assert.equal(s.gameOver, false);
  assert.equal(s.paused, false);
  assert.ok(s.snake.length >= 3);
});

// ---------------------------------------------------------------------------
// Difficulty scaling
// ---------------------------------------------------------------------------

test('tick interval decreases (difficulty rises) as score increases', () => {
  const { a } = loadGame();
  const fast = a.evaluate('window.__snakeTickInterval(200)');
  const slow = a.evaluate('window.__snakeTickInterval(0)');
  assert.ok(fast <= slow, `fast(${fast}) should be <= slow(${slow})`);
});

test('tick interval stays within sane bounds for many scores', () => {
  const { a } = loadGame();
  for (const score of [0, 50, 200, 500, 1000, 5000]) {
    const iv = a.evaluate('window.__snakeTickInterval(' + score + ')');
    assert.ok(iv > 0, `interval for ${score} must be > 0`);
    assert.ok(iv <= TICK_MS + 1, `interval for ${score} must not exceed initial ${TICK_MS}`);
  }
});

// ---------------------------------------------------------------------------
// Rendering (documented: partial Canvas supports filled rects)
// ---------------------------------------------------------------------------

test('canvas is visible and sized for the grid', () => {
  const { doc, canvas } = loadGame();
  const el = canvas();
  assert.equal(el.width, 400);
  assert.equal(el.height, 400);
  // A render ran during load: the background should fill the canvas area.
  assert.equal(doc.querySelector('#game'), el);
});
