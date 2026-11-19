const test = require('node:test');
const assert = require('node:assert');
const { load } = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');
const FILE = require('path').resolve(__dirname, '../index.html');

function loadApp() { return load(FILE); }
function paddleX(a) { return a.evaluate('window.__game.paddle.x'); }
function lives(a) { return Number(a.evaluate('document.getElementById("lives").textContent')); }
function remaining(a) { return Number(a.evaluate('document.getElementById("remaining").textContent')); }

function demoAndPlay(a) {
  a.click('#demoBtn');
  a.click('#playBtn');
  a.event(a.document.getElementById('canvas'), 'pointerdown', { clientX: 240, clientY: 290, button: 0, buttons: 1 });
}

// Tests ---------------------------------------------------------------------

test('arrow-right moves the paddle right', () => {
  const a = loadApp();
  demoAndPlay(a);
  const x0 = paddleX(a);
  a.event(a.document.getElementById('canvas'), 'keydown', { code: 'ArrowRight', key: '→', bubbles: true });
  a.advance(50);
  assert.ok(paddleX(a) > x0);
});

test('arrow-left moves the paddle left', () => {
  const a = loadApp();
  demoAndPlay(a);
  a.event(a.document.getElementById('canvas'), 'keydown', { code: 'ArrowRight', key: '→', bubbles: true });
  a.event(a.document.getElementById('canvas'), 'keydown', { code: 'ArrowLeft', key: '←', bubbles: true });
  a.advance(50);
  a.event(a.document.getElementById('canvas'), 'keyup', { code: 'ArrowLeft', key: '←', bubbles: true });
  a.advance(50);
  assert.ok(paddleX(a) < 300);
});

test('the paddle does not leave the left edge', () => {
  const a = loadApp();
  demoAndPlay(a);
  a.evaluate('window.__game.paddle.x = 0');
  a.event(a.document.getElementById('canvas'), 'keydown', { code: 'ArrowLeft', key: '←', bubbles: true });
  a.advance(50);
  assert.strictEqual(paddleX(a), 0);
});

test('Space launches the ball from the ready state', () => {
  const a = loadApp();
  a.click('#demoBtn');
  a.click('#playBtn');
  assert.ok(a.evaluate('window.__game.ready'));
  assert.ok(!a.evaluate('window.__game.ball'));
  a.event(a.document.getElementById('canvas'), 'keydown', { code: 'Space', key: ' ', bubbles: true });
  assert.ok(a.evaluate('window.__game.ball !== null'));
});
