const test = require('node:test');
const assert = require('node:assert');
const { load } = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');
const FILE = require('path').resolve(__dirname, '../index.html');

// Helpers -------------------------------------------------------------------

function loadApp() {
  return load(FILE);
}

function bricks(a) {
  return JSON.parse(a.evaluate('JSON.stringify(window.__game._bricks())'));
}

function tool(a) {
  return a.evaluate('window.__game._tool()');
}

// Tests ---------------------------------------------------------------------

test('game object exists after load', () => {
  const a = loadApp();
  assert.strictEqual(a.evaluate('typeof window.__game'), 'object');
});

test('grid is empty at start', () => {
  const a = loadApp();
  assert.deepStrictEqual(bricks(a), []);
});

test('edit grid reports correct dimensions', () => {
  const a = loadApp();
  assert.strictEqual(a.evaluate('window.__game._cols()'), 12);
  assert.strictEqual(a.evaluate('window.__game._rows()'), 8);
});

test('drawing a brick marks the cell', () => {
  const a = loadApp();
  a.evaluate('window.__game._setCell(3, 2, "draw")');
  const b = bricks(a);
  assert.strictEqual(b.length, 1);
  assert.deepStrictEqual(b[0], { x: 3, y: 2, color: '#e05a5a', hp: 1 });
});

test('erasing a brick removes the cell', () => {
  const a = loadApp();
  a.evaluate('window.__game._setCell(3, 2, "draw")');
  a.evaluate('window.__game._setCell(3, 2, "erase")');
  assert.deepStrictEqual(bricks(a), []);
});

test('drawing over an existing brick does not duplicate it', () => {
  const a = loadApp();
  a.evaluate('window.__game._setCell(1, 1, "draw")');
  a.evaluate('window.__game._setCell(1, 1, "draw")');
  assert.strictEqual(bricks(a).length, 1);
});

test('tool toggles between draw and erase', () => {
  const a = loadApp();
  a.evaluate('window.__game._setTool("erase")');
  assert.strictEqual(tool(a), 'erase');
  a.evaluate('window.__game._setTool("draw")');
  assert.strictEqual(tool(a), 'draw');
});

test('save produces a JSON string with rows and cols', () => {
  const a = loadApp();
  a.evaluate('window.__game._setCell(5, 4, "draw")');
  const saved = a.evaluate('window.__game._save()');
  const parsed = JSON.parse(saved);
  assert.strictEqual(parsed.cols, 12);
  assert.strictEqual(parsed.rows, 8);
  assert.strictEqual(parsed.bricks.length, 1);
  assert.deepStrictEqual(parsed.bricks[0], { x: 5, y: 4, color: '#e05a5a', hp: 1 });
});

test('load restores a previously saved level', () => {
  const a = loadApp();
  a.evaluate('window.__game._setCell(5, 4, "draw")');
  const saved = a.evaluate('window.__game._save()');
  // reload into a fresh instance
  const b = load(FILE);
  b.evaluate(`window.__game._load(${JSON.stringify(saved)})`);
  assert.strictEqual(bricks(b).length, 1);
  assert.deepStrictEqual(bricks(b)[0], { x: 5, y: 4, color: '#e05a5a', hp: 1 });
});

test('load with nil returns the JSON string', () => {
  const a = loadApp();
  a.evaluate('window.__game._setCell(2, 2, "draw")');
  const out = a.evaluate('window.__game._load(null)');
  assert.strictEqual(typeof out, 'string');
  assert.strictEqual(JSON.parse(out).bricks.length, 1);
});
