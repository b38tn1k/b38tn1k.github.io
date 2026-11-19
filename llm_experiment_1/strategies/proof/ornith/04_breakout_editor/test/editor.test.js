const test = require('node:test');
const assert = require('node:assert');
const { load } = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');
const FILE = require('path').resolve(__dirname, '../index.html');

function loadApp() { return load(FILE); }
function bricks(a) { return JSON.parse(a.evaluate('JSON.stringify(window.__game._bricks())')); }
function brickCount(a) { return a.evaluate('window.__game.bricks.length'); }

function clickCanvas(a, x, y) {
  a.click('#editorCanvas', { clientX: x, clientY: y });
}

// Tests ---------------------------------------------------------------------

test('clicking the editor grid draws a brick and paints a pixel', () => {
  const a = loadApp();
  clickCanvas(a, 30, 30);
  assert.strictEqual(brickCount(a), 1);
  assert.deepStrictEqual(a.pixel('editorCanvas', 30, 30), [224, 90, 90, 255]);
});

test('dragging on the grid draws a run of bricks', () => {
  const a = loadApp();
  clickCanvas(a, 30, 30);
  clickCanvas(a, 70, 30);
  clickCanvas(a, 110, 30);
  assert.strictEqual(brickCount(a), 3);
});

test('erasing removes a brick by clicking over it', () => {
  const a = loadApp();
  clickCanvas(a, 30, 30);
  assert.strictEqual(brickCount(a), 1);
  // toggle to erase tool
  a.click('#toolseg button[data-tool="erase"]');
  assert.strictEqual(a.evaluate('window.__game._tool()'), 'erase');
  clickCanvas(a, 30, 30);
  assert.strictEqual(brickCount(a), 0);
});

test('selecting a color changes the drawn brick color', () => {
  const a = loadApp();
  a.click('#colorseg button[data-color="#5aa0e0"]');
  clickCanvas(a, 30, 30);
  assert.strictEqual(brickCount(a), 1);
  assert.strictEqual(bricks(a)[0].color, '#5aa0e0');
});

test('clearing the grid empties it', () => {
  const a = loadApp();
  clickCanvas(a, 30, 30);
  clickCanvas(a, 70, 30);
  assert.strictEqual(brickCount(a), 2);
  a.click('#clearBtn');
  assert.strictEqual(brickCount(a), 0);
});

test('the demo button populates a level', () => {
  const a = loadApp();
  a.click('#demoBtn');
  assert.ok(brickCount(a) > 0);
  a.click('#playBtn');
  assert.strictEqual(a.evaluate('window.__game.bricksTotal'), brickCount(a));
});

test('the editor shows the number of bricks in the HUD', () => {
  const a = loadApp();
  clickCanvas(a, 30, 30);
  assert.strictEqual(Number(a.evaluate('document.getElementById("remaining").textContent')), 1);
});
