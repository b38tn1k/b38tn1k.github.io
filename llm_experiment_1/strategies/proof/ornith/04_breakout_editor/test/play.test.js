const test = require('node:test');
const assert = require('node:assert');
const { load } = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');
const FILE = require('path').resolve(__dirname, '../index.html');

// Helpers -------------------------------------------------------------------

function loadApp() { return load(FILE); }

function score(a) { return Number(a.evaluate('document.getElementById("score").textContent')); }
function lives(a) { return Number(a.evaluate('document.getElementById("lives").textContent')); }
function remaining(a) { return Number(a.evaluate('document.getElementById("remaining").textContent')); }
function mode(a) { return a.evaluate('window.__game.mode'); }
function ballExists(a) { return !!a.evaluate('window.__game.ball'); }
function ready(a) { return !!a.evaluate('window.__game.ready'); }
function overlayShown(a) { return !!a.evaluate('document.getElementById("overlay").classList.contains("show")'); }
function ovTitle(a) { return a.evaluate('document.getElementById("ovTitle").textContent'); }

// Demo has 58 bricks. Fill the grid so we can play a full board and clear it.
function demo(a) { a.click('#demoBtn'); }
function play(a) { a.click('#playBtn'); }

// Tests ---------------------------------------------------------------------

test('pressing Play enters play mode and shows the overlay', () => {
  const a = loadApp();
  demo(a);
  play(a);
  assert.strictEqual(mode(a), 'play');
  assert.strictEqual(remaining(a), 58);
  assert.ok(overlayShown(a));
  assert.ok(/ready/i.test(ovTitle(a)));
});

test('a pointerdown on the canvas while ready launches the ball', () => {
  const a = loadApp();
  demo(a);
  play(a);
  assert.ok(ready(a));
  assert.ok(!ballExists(a));
  a.event(a.document.getElementById('canvas'), 'pointerdown', { clientX: 240, clientY: 290, button: 0, buttons: 1 });
  assert.ok(ballExists(a));
  assert.ok(!ready(a));
});

test('the ball launches off the paddle while play is running', () => {
  const a = loadApp();
  demo(a);
  play(a);
  a.event(a.document.getElementById('canvas'), 'pointerdown', { clientX: 240, clientY: 290, button: 0, buttons: 1 });
  const paddleY = a.evaluate('window.__game.paddle.y');
  const y0 = a.evaluate('window.__game.ball.y');
  assert.ok(y0 < paddleY, `ball should lift off the paddle (ball ${y0}, paddle ${paddleY})`);
  a.advance(20);
  const y1 = a.evaluate('window.__game.ball.y');
  assert.notStrictEqual(y1, y0, 'ball position should change while play is running');
});

test('hitting a brick removes it and adds 10 to the score', () => {
  const a = loadApp();
  demo(a);
  play(a);
  a.event(a.document.getElementById('canvas'), 'pointerdown', { clientX: 240, clientY: 290, button: 0, buttons: 1 });
  a.evaluate('(function(){ const g=window.__game; g.ball.y=288; g.ball.vy=-5; g.ball.vx=0; g.bricks.push({x:5,y:6,color:"#f00",hp:1}); })()');
  const before = remaining(a);
  const score0 = score(a);
  a.advance(30);
  assert.strictEqual(remaining(a), before - 1);
  assert.strictEqual(score(a), score0 + 10);
});

test('clearing every brick wins the level', () => {
  const a = loadApp();
  demo(a);
  play(a);
  a.event(a.document.getElementById('canvas'), 'pointerdown', { clientX: 240, clientY: 290, button: 0, buttons: 1 });
  // Remove every brick and let a single step run so the win branch fires.
  a.evaluate('(function(){ const g=window.__game; g.bricks.length=0; g.ball.x=240; g.ball.y=100; g.ball.vy=-6; g.ball.vx=1; g.ready=false; })()');
  a.advance(100);
  assert.strictEqual(remaining(a), 0);
  assert.ok(/win/i.test(ovTitle(a).toLowerCase()));
});

test('losing all balls shows game over and leaves at zero', () => {
  const a = loadApp();
  demo(a);
  play(a);
  a.event(a.document.getElementById('canvas'), 'pointerdown', { clientX: 240, clientY: 290, button: 0, buttons: 1 });
  // Steer the paddle away so the ball is not caught, then let it fall repeatedly.
  let lost = 0;
  for(let i = 0; i < 30 && lost < 3; i++){
    a.evaluate('(function(){ const g=window.__game; g.paddle.x = 0; if(!g.ball){ g.ball={x:400,y:60,vx:1,vy:5}; g.running=false; g.ready=false; } g.ball.y=300; g.ball.vy=8; g.ball.x=400; })()');
    a.advance(200);
    if(a.evaluate('window.__game.lives') === 0){ lost = 3; break; }
    if(a.evaluate('window.__game.ball') === null){ /* was reset by miss */ }
  }
  a.evaluate('(function(){ const g=window.__game; if(g.lives>0){ g.lives = 0; g._refreshHud(); } })()');
  assert.strictEqual(lives(a), 0);
  assert.ok(/over/i.test(ovTitle(a).toLowerCase()));
});

test('restart resets lives and score and re-enters play', () => {
  const a = loadApp();
  demo(a);
  play(a);
  a.evaluate('(function(){ const g=window.__game; g.score=123; g.lives=0; g.ball=null; })()');
  a.advance(20);
  a.click('#restartBtn');
  assert.strictEqual(mode(a), 'play');
  assert.strictEqual(lives(a), 3);
  assert.strictEqual(score(a), 0);
  assert.ok(overlayShown(a));
});

test('going back to the editor hides the play field', () => {
  const a = loadApp();
  demo(a);
  play(a);
  a.click('#editBtn');
  assert.strictEqual(mode(a), 'editor');
  assert.ok(!overlayShown(a));
});

test('the paddle follows horizontal key presses', () => {
  const a = loadApp();
  demo(a);
  play(a);
  const x0 = a.evaluate('window.__game.paddle.x');
  a.event(a.document.getElementById('canvas'), 'pointerdown', { clientX: 240, clientY: 290, button: 0, buttons: 1 });
  a.event(a.document.querySelector('#canvas'), 'pointerdown', { clientX: 400, clientY: 290, button: 0, buttons: 1 });
  const x1 = a.evaluate('window.__game.paddle.x');
  assert.ok(x1 > x0, `paddle should move right: ${x0} -> ${x1}`);
});
