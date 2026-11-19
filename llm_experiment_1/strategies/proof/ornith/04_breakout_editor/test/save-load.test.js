const test = require('node:test');
const assert = require('node:assert');
const { load } = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');
const FILE = require('path').resolve(__dirname, '../index.html');

function loadApp() { return load(FILE); }
function brickCount(a) { return a.evaluate('window.__game.bricks.length'); }
function bricks(a) { return JSON.parse(a.evaluate('JSON.stringify(window.__game._bricks())')); }

// Simulate the file <input>'s change event. The JSON payload is injected as a
// string literal so the FileReader can read it; we do not JSON-encode a function.
// The harness FileReader resolves its result via a Promise microtask, so we await
// a macrotask after dispatching the change event to let the callback run.
async function loadFromFile(a, json) {
  a.evaluate(
    `(function(json){ const f={ name:'level.json', text:function(){ return Promise.resolve(json); } }; ` +
    `const fi=document.getElementById('file'); ` +
    `Object.defineProperty(fi,'files',{ get:function(){ return [f]; } }); ` +
    `fi.dispatchEvent(new window.Event('change',{bubbles:true})); })(${JSON.stringify(json)})`
  );
  await new Promise(r => setTimeout(r, 10));
}

async function freshApp() {
  const a = loadApp();
  await new Promise(r => setTimeout(r, 10));
  return a;
}

// Tests ---------------------------------------------------------------------

test('saving exports a JSON string with the current bricks', async () => {
  const a = loadApp();
  a.evaluate('window.__game._setCell(6, 4, "draw")');
  const json = a.evaluate('window.__game._save()');
  const parsed = JSON.parse(json);
  assert.strictEqual(parsed.cols, 12);
  assert.strictEqual(parsed.rows, 8);
  assert.strictEqual(parsed.bricks.length, 1);
});

test('loading a JSON file restores the level', async () => {
  const a = loadApp();
  const json = '{"version":1,"cols":12,"rows":8,"bricks":[{"x":9,"y":5,"color":"#7be07b","hp":1}]}';
  await loadFromFile(a, json);
  assert.strictEqual(brickCount(a), 1);
  assert.deepStrictEqual(bricks(a)[0], { x: 9, y: 5, color: '#7be07b', hp: 1 });
});

test('a saved level round-trips back to the same bricks', async () => {
  const a = loadApp();
  a.evaluate('window.__game._setCell(2, 2, "draw")');
  a.evaluate('window.__game._setCell(7, 3, "draw")');
  const json = a.evaluate('window.__game._save()');

  const b = loadApp();
  await loadFromFile(b, json);
  assert.strictEqual(brickCount(b), 2);
  const aBricks = bricks(a).sort((p, q) => p.x - q.x);
  const bBricks = bricks(b).sort((p, q) => p.x - q.x);
  assert.deepStrictEqual(bBricks, aBricks);
});

test('loading invalid JSON does not corrupt the current level', async () => {
  const a = loadApp();
  a.evaluate('window.__game._setCell(3, 3, "draw")');
  const before = brickCount(a);
  await loadFromFile(a, '{not valid json');
  // The load handler catches errors and shows a toast; bricks stay put.
  assert.strictEqual(brickCount(a), before);
});
