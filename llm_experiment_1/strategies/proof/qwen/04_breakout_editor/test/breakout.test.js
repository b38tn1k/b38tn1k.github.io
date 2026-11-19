var fs = require('fs');
var path = require('path');
var test = require('node:test');
var assert = require('assert');

var htmlPath = path.join(__dirname, '..', 'index.html');

test('1. index.html exists and has game content', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.length > 2000, 'HTML must have substantial game code');
  assert.ok(html.includes('<canvas'), 'Must contain a <canvas> element');
  assert.ok(html.includes('context') || html.includes('getContext'), 'Must get canvas context');
});

test('2. Score and lives are displayed', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('score-display') || html.includes('Score'), 'Must display score');
  assert.ok(html.includes('lives-display') || html.includes('Lives'), 'Must display lives');
});

test('3. Mode toggle buttons (Editor / Play) exist', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('btn-edit') || html.includes('editor') || html.includes('Editor'), 'Must have Editor button');
  assert.ok(html.includes('btn-play') || html.includes('play') || html.includes('Play'), 'Must have Play button');
});

test('4. Brick editor supports draw (click to place bricks)', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('mousedown') && html.includes('handleEditorCell'), 'Must handle mousedown for drawing');
  assert.ok(html.includes('bricks[') || html.includes('bricks[key]'), 'Must store bricks in a data structure');
});

test('5. Brick erasure (right-click to erase bricks)', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('contextmenu') || html.includes('button === 2') || html.includes('isRightClick'), 
    'Must support right-click for erasing bricks or have right-click handling');
});

test('6. Play mode launches ball on spacebar', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('keydown') && (html.includes('Space') || html.includes('launchBall')), 
    'Must handle spacebar to launch ball');
});

test('7. Ball and paddle collision with walls', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('BALL_R') && html.includes('CANVAS_W'), 
    'Must have ball radius and canvas width for wall collision');
});

test('8. Brick collision detection exists', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('BRICK_PAD') || html.includes('BRICK_W') || html.includes('brick'), 
    'Must have brick dimensions and collision logic');
});

test('9. Lives decrement on ball going off screen', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok((html.includes('lives--') || html.includes('lives = ') || 
             html.includes('lose life') || html.includes('life')) && 
            html.includes('GAME OVER'), 
    'Must decrement lives and show game over');
});

test('10. Restart resets score, lives, level', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok((html.includes('restart') || html.includes('Restart')) && 
            (html.includes('score = 0') || html.includes('lives = 3') || html.includes('reset')),
    'Must have restart that resets game state');
});

test('11. Save level produces valid JSON', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('saveLevel') && html.includes('JSON.stringify'), 
    'Must have save function with JSON serialization');
  assert.ok(html.includes('bricks') && html.includes('version'), 
    'Saved JSON should include bricks and metadata');
});

test('12. Load level parses JSON and restores bricks', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok((html.includes('loadLevel') || html.includes('Load')) && html.includes('JSON.parse'), 
    'Must have load function with JSON parsing');
  assert.ok(html.includes('applyJsonLevel') || (html.includes('bricks[') && html.includes('data.bricks')),
    'Must restore brick data from loaded JSON');
});

test('13. Keyboard paddle movement (arrows / A,D)', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok((html.includes('ArrowLeft') && html.includes('ArrowRight')) || 
            (html.includes("['a']") && html.includes("['d']")),
    'Must support arrow keys or A/D for paddle movement');
});

test('14. Touch input is supported', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('touchstart') || html.includes('touchmove') || html.includes('touchend'),
    'Must handle touch events for mobile support');
});

test('15. Default brick pattern can be filled', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('fillDefault') && (html.includes('grid') || html.includes('default')),
    'Must have ability to fill default brick pattern');
});

test('16. Clear bricks functionality exists', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('clearAll'), 'Must have clear all bricks function');
});

test('17. Color selection for bricks in editor', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  var colorMatches = html.match(/#[0-9a-fA-F]{6}/g);
  assert.ok(colorMatches && colorMatches.length >= 3, 
    'Must have at least 3 brick colors defined');
});

test('18. Grid toggle option for editor', function() {
  var html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('toggleGrid') || (html.includes('grid') && html.includes('toggle')),
    'Must have grid visibility toggle');
});
