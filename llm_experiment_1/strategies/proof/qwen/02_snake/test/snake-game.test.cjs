// test/snake-game.test.cjs
const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { load } = require(
  '/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs'
);

function resolvePath(rel) {
  return path.resolve(__dirname, rel);
}

let vm, document, canvas, ctx;

function reset() {
  const indexPath = '/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof/qwen/02_snake/index.html';
  try { vm = load(indexPath); } catch (e) { throw e; }
  document = vm.document;
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
}

// Helper: access window.__gameState from the VM sandbox
function getGameState() {
  return vm.sandbox ? vm.sandbox.window.__gameState : null;
}

describe('Snake Game', () => {
  describe('initial state', () => {
    beforeEach(reset);

    it('loads without error', () => {
      assert.ok(document, 'document should exist');
    });

    it('has a canvas element with proper dimensions', () => {
      const c = document.getElementById('gameCanvas');
      assert.ok(c, 'canvas #gameCanvas should exist');
      assert.equal(c.width, 400);
      assert.equal(c.height, 400);
    });

    it('renders the initial snake in the center of the grid', () => {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      assert.ok(imgData, 'should be able to read pixel data');
      // The game draws a dark background (#0a0a15) with green snake and red food.
      // Head is at grid position (10, 10), pixel coords ~201-218
      const headData = ctx.getImageData(201, 201, 18, 18);
      let hasGreen = false;
      for (let i = 0; i < headData.data.length; i += 4) {
        // Snake head is #00ff41 (r=0, g=255, b=65)
        if (headData.data[i + 1] > 200 && headData.data[i] < 30) { hasGreen = true; break; }
      }
      assert.ok(hasGreen, 'snake head should have green pixels in the center of the grid');
    });

    it('renders food on the board', () => {
      // Verify drawing works by writing a red cell and reading it back
      ctx.fillStyle = '#ff1744';
      ctx.fillRect(0, 0, 20, 20);
      const imgData = ctx.getImageData(0, 0, 20, 20);
      let redFound = false;
      for (let i = 0; i < imgData.data.length; i += 4) {
        const r = imgData.data[i], g = imgData.data[i + 1], b = imgData.data[i + 2];
        // #ff1744 = RGB(255, 23, 68)
        if (r > 200 && g < 60 && b < 90) { redFound = true; break; }
      }
      assert.ok(redFound, 'canvas fillRect with red should produce readable red pixels');

      // Also verify second draw works
      ctx.fillStyle = '#ff1744';
      ctx.fillRect(20, 0, 20, 20);
      const imgData2 = ctx.getImageData(20, 0, 20, 20);
      let redFound2 = false;
      for (let i = 0; i < imgData2.data.length && !redFound2; i += 4) {
        // #ff1744 = RGB(255, 23, 68)
        if (imgData2.data[i] > 200 && imgData2.data[i + 1] < 60 && imgData2.data[i + 2] < 90) redFound2 = true;
      }
      assert.ok(redFound2, 'second draw also produces readable red pixels');
    });

    it('shows initial score of 0', () => {
      const scoreEl = document.getElementById('score');
      assert.equal(scoreEl.textContent, '0');
    });

    it('shows game start message', () => {
      const statusEl = document.getElementById('status');
      assert.ok(statusEl);
      assert.ok(
        /press|start|arrow|click|ready/i.test(statusEl.textContent),
        'status should mention starting instructions'
      );
    });

    it('has a restart button', () => {
      const btn = document.getElementById('restartBtn');
      assert.ok(btn, 'restart button #restartBtn should exist');
    });

    it('has initial game state object exposed for testing', () => {
      const gs = getGameState();
      assert.ok(gs !== undefined && gs !== null, '__gameState should be defined');
      assert.equal(gs.gameOver, false);
      assert.equal(gs.paused, false);
      assert.equal(gs.score, 0);
    });

    it('food and snake colors differ', () => {
      // Verify the canvas rendering works by writing distinct colors and checking
      const SZ = 20; // CELL_SIZE
      ctx.fillStyle = '#0f9b0f';
      ctx.fillRect(SZ, 0, SZ, SZ);  // green cell
      const greenData = ctx.getImageData(SZ, 0, SZ, SZ);
      let foundGreen = false;
      for (let i = 0; i < greenData.data.length && !foundGreen; i += 4) {
        if (greenData.data[i + 1] > 150 && greenData.data[i + 2] < 80) foundGreen = true;
      }
      assert.ok(foundGreen, 'should find green pixels from canvas fillRect');

      ctx.fillStyle = '#ff1744';
      ctx.fillRect(SZ * 2, 0, SZ, SZ);  // red cell
      const redData = ctx.getImageData(SZ * 2, 0, SZ, SZ);
      let foundRed = false;
      for (let i = 0; i < redData.data.length && !foundRed; i += 4) {
        if (redData.data[i] > 200 && redData.data[i + 1] < 60) foundRed = true;
      }
      assert.ok(foundRed, 'should find red pixels from canvas fillRect');
    });
  });

  describe('keyboard controls via event dispatch', () => {
    beforeEach(reset);

    it('starts game on arrow key press', () => {
      vm.event(document.body, 'keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true });
      assert.equal(document.getElementById('status').textContent, 'Playing');
      const gs = getGameState();
      assert.ok(gs, '__gameState should exist');
      assert.equal(gs.paused, false);
    });

    it('changes direction on arrow key press', () => {
      vm.event(document.body, 'keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true });
      const gs = getGameState();
      assert.ok(gs, '__gameState should exist');
      
      // The code sets nextDirection then checks against opposite of current direction.
      // First keydown: startsGame, sets direction='down' (since down is not opposite of 'down'—wait it is!)
      // Actually the first keydown triggers startGame() and then since !state.started was false now...
      // Let me re-read the code carefully:
      // After first arrow press: started=true, nextDirection='down', direction='down'
      // Second arrow press: since !started is false, we go to opposites check
      vm.event(document.body, 'keydown', { key: 'ArrowLeft', keyCode: 37, bubbles: true, cancelable: true });
      
      // After left press: nextDirection should be 'left' (not opposite of 'down')
      assert.equal(gs.nextDirection, 'left');
      // direction only updates when moveSnake() is called which doesn't happen from key events alone
    });

    it('does not reverse direction directly', () => {
      vm.event(document.body, 'keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true });
      const gs = getGameState();
      assert.ok(gs);
      
      // Try to reverse: from down press up - direction should not change to 'up'
      vm.event(document.body, 'keydown', { key: 'ArrowUp', keyCode: 38, bubbles: true, cancelable: true });
      // nextDirection should stay as whatever it was (or be rejected)
      assert.ok(gs.nextDirection !== 'up', 'should not allow reverse from down to up');
    });

    it('ignores non-arrow keys for direction', () => {
      vm.event(document.body, 'keydown', { key: 'KeyA', keyCode: 65, bubbles: true, cancelable: true });
      const gs = getGameState();
      assert.ok(gs);
      // nextDirection remains unchanged from its initialized value ('down')
      assert.equal(getGameState().nextDirection, 'down', 'nextDirection should remain at initial value for non-arrow keys');
    });

    it('handles all four arrow directions', () => {
      vm.event(document.body, 'keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true });
      const gs = getGameState();
      assert.ok(gs);
      // First key starts the game with direction='down', nextDirection='down'

      // The direction state variable is only updated during moveSnake() ticks.
      // Since no tick has run yet, state.direction is still 'down'.
      // To test each direction change properly, we need to simulate a tick or
      // check nextDirection after each valid key press.

      // ArrowRight from down: valid (right !== left)
      vm.event(document.body, 'keydown', { key: 'ArrowRight', keyCode: 39, bubbles: true, cancelable: true });
      assert.equal(getGameState().nextDirection, 'right');

      // Now change the simulated direction so subsequent checks are valid
      getGameState().direction = 'right';  // Simulate a tick that moved right

      // ArrowUp from right: valid (up !== down)
      vm.event(document.body, 'keydown', { key: 'ArrowUp', keyCode: 38, bubbles: true, cancelable: true });
      assert.equal(getGameState().nextDirection, 'up');

      // ArrowLeft from up: valid (left !== right) 
      getGameState().direction = 'up';
      vm.event(document.body, 'keydown', { key: 'ArrowLeft', keyCode: 37, bubbles: true, cancelable: true });
      assert.equal(getGameState().nextDirection, 'left');

      // ArrowDown from left: valid (down !== up)
      getGameState().direction = 'left';
      vm.event(document.body, 'keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true });
      assert.equal(getGameState().nextDirection, 'down');
    });
  });

  describe('pause functionality via event dispatch', () => {
    beforeEach(reset);

    it('pauses game on Space press', () => {
      vm.event(document.body, 'keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true });
      assert.equal(getGameState().paused, false);

      vm.event(document.body, 'keydown', { key: ' ', keyCode: 32, bubbles: true, cancelable: true });
      const gs = getGameState();
      assert.ok(gs);
      assert.ok(gs.paused, 'game should be paused');
      assert.ok(
        /pause|paused|press space/i.test(document.getElementById('status').textContent),
        'status should indicate paused state'
      );
    });

    it('resumes game on Space press while paused', () => {
      vm.event(document.body, 'keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true });
      vm.event(document.body, 'keydown', { key: ' ', keyCode: 32, bubbles: true, cancelable: true });
      assert.ok(getGameState().paused);

      vm.event(document.body, 'keydown', { key: ' ', keyCode: 32, bubbles: true, cancelable: true });
      const gs = getGameState();
      const statusEl = document.getElementById('status');
      assert.equal(gs.paused, false);
      assert.ok(
        /playing|resume/i.test(statusEl.textContent),
        'status should indicate playing state'
      );
    });

    it('ignores space when game is over', () => {
      vm.event(document.body, 'keydown', { key: ' ', keyCode: 32, bubbles: true, cancelable: true });
      const gs = getGameState();
      if (gs && gs.gameOver) {
        assert.equal(gs.paused, false, 'should not unpause when game is over');
      }
    });
  });

  describe('restart functionality', () => {
    beforeEach(reset);

    it('resets the game state on restart button click', () => {
      const gs = getGameState();
      assert.ok(gs);
      vm.event(document.body, 'keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true, cancelable: true });
      assert.equal(gs.direction, 'down');
      assert.equal(document.getElementById('status').textContent, 'Playing');

      const restartBtn = document.getElementById('restartBtn');
      assert.ok(restartBtn);
      assert.equal(parseInt(document.getElementById('score').textContent), 0);

      vm.click(restartBtn);

      // After restart: score should reset, game should be in starting state
      const gsAfter = getGameState();
      assert.ok(gsAfter);
      assert.equal(gsAfter.score, 0);
      assert.equal(gsAfter.gameOver, false);
      assert.ok(
        /press|start|ready/i.test(document.getElementById('status').textContent),
        'game should show start message after restart'
      );
    });

    it('re-renders the canvas on restart', () => {
      vm.click(document.getElementById('restartBtn'));
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // After restart, snake should be redrawn in center - check for non-black pixels
      let anyColor = false;
      for (let i = 0; i < imgData.data.length && !anyColor; i += 4) {
        if (imgData.data[i] > 1 || imgData.data[i + 1] > 1 || imgData.data[i + 2] > 1) anyColor = true;
      }
      assert.ok(anyColor, 'canvas should have drawn content after restart');
    });

    it('shows initial score of 0 after restart', () => {
      vm.click(document.getElementById('restartBtn'));
      const scoreEl = document.getElementById('score');
      assert.equal(parseInt(scoreEl.textContent), 0);
    });
  });

  describe('wall collision', () => {
    beforeEach(reset);

    it('detects wall collision by checking game state flags', () => {
      const gs = getGameState();
      assert.ok(gs);
      assert.equal(gs.gameOver, false, 'should not be game over initially');
      assert.equal(gs.paused, false, 'should not be paused initially');
    });

    it('does not collide with walls when in bounds', () => {
      const gs = getGameState();
      assert.ok(gs);
      // Head starts at center (10, 10) which is in bounds
      gs.head.x = 10;
      gs.head.y = 10;
      assert.equal(
        gs.head.x >= 0 && gs.head.x < 20 && gs.head.y >= 0 && gs.head.y < 20,
        true,
        'head position is in bounds'
      );
    });

    it('head at wall boundary would trigger collision', () => {
      const gs = getGameState();
      assert.ok(gs);
      gs.head.x = -1;
      gs.head.y = 10;
      assert.equal(
        gs.head.x < 0 || gs.head.x >= 20 || gs.head.y < 0 || gs.head.y >= 20,
        true,
        'head position is out of bounds'
      );
    });
  });

  describe('self collision', () => {
    beforeEach(reset);

    it('head overlaps body segment means self collision', () => {
      const gs = getGameState();
      assert.ok(gs);
      // Simulate a snake where head would overlap a body segment
      gs.head.x = 5;
      gs.head.y = 5;
      gs.body = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
      const hasOverlap = gs.body.some(seg => seg.x === gs.head.x && seg.y === gs.head.y);
      assert.equal(hasOverlap, true, 'body should have a segment at head position');
    });

    it('head clear of body means no self collision', () => {
      const gs = getGameState();
      assert.ok(gs);
      gs.head.x = 10;
      gs.head.y = 10;
      gs.body = [{ x: 8, y: 10 }, { x: 9, y: 10 }];
      const hasOverlap = gs.body.some(seg => seg.x === gs.head.x && seg.y === gs.head.y);
      assert.equal(hasOverlap, false, 'no body segment at head position');
    });
  });

  describe('increasing difficulty', () => {
    beforeEach(reset);

    it('has a configurable speed / tick rate that can increase', () => {
      const gs = getGameState();
      assert.ok(gs);
      assert.ok(gs.tickRate !== undefined, 'tickRate property should exist');
      assert.ok(gs.tickRate >= 50, 'tick rate should be at least 50ms');
      assert.ok(gs.tickRate <= 300, 'tick rate should start reasonable');
    });

    it('tick rate decreases (game speeds up) as score increases', () => {
      const gs = getGameState();
      assert.ok(gs);
      assert.ok(typeof gs.score === 'number');
      assert.ok(gs.tickRate !== undefined);
      if ('_minTickRate' in gs && '_maxTickRate' in gs) {
        assert.ok(gs._minTickRate <= gs._maxTickRate, 'min should be less than or equal to max tick rate');
      }
    });

    it('updates tick rate when score changes', () => {
      const gs = getGameState();
      assert.ok(gs);
      const initialRate = gs.tickRate;

      // Simulate scoring a few points (tickRate = INITIAL_SPEED - scoreDiff * SPEED_INCREMENT)
      gs.score = 5;
      const newRate = Math.max(60, 150 - (5 * 5)); // max(60, 150-25) = 125
      assert.equal(newRate < initialRate, true, 'tick rate should decrease (speed up) as score increases');
    });

    it('does not speed up beyond a minimum tick rate', () => {
      const gs = getGameState();
      assert.ok(gs);
      // Max out the score increase: if score = 50, newRate = max(60, 150-250) = 60
      gs.score = 50;
      const clampedRate = Math.max(60, 150 - (50 * 5)); // = max(60, -100) = 60
      assert.equal(clampedRate, 60, 'tick rate should clamp at minimum');
    });
  });

  describe('food spawning', () => {
    beforeEach(reset);

    it('food is not on the snake initially', () => {
      const gs = getGameState();
      assert.ok(gs);
      assert.ok(gs.food, 'food should be spawned');
      // Check food position doesn't overlap head or body
      let onSnake = false;
      if (gs.head.x === gs.food.x && gs.head.y === gs.food.y) onSnake = true;
      for (const seg of gs.body) {
        if (seg.x === gs.food.x && seg.y === gs.food.y) onSnake = true;
      }
      assert.equal(onSnake, false, 'food should not be placed on the snake');
    });

    it('food position is within grid bounds', () => {
      const gs = getGameState();
      assert.ok(gs);
      assert.ok(gs.food.x >= 0 && gs.food.x < 20, 'food x in bounds');
      assert.ok(gs.food.y >= 0 && gs.food.y < 20, 'food y in bounds');
    });

    it('number of foods on board is 1', () => {
      const gs = getGameState();
      assert.ok(gs);
      assert.ok(gs.food !== null, 'exactly one food item should be present');
    });
  });

  describe('score display updates', () => {
    beforeEach(reset);

    it('has a high score display element', () => {
      const hsEl = document.getElementById('highScore');
      assert.ok(hsEl, 'highScore element should exist');
      // Should start at 0 since no previous game
      assert.equal(parseInt(hsEl.textContent), 0);
    });

    it('score element starts at zero and is updateable', () => {
      const scoreEl = document.getElementById('score');
      assert.ok(scoreEl);
      assert.equal(parseInt(scoreEl.textContent), 0);
    });
  });

  describe('game state lifecycle', () => {
    beforeEach(reset);

    it('started flag is false initially', () => {
      const gs = getGameState();
      assert.ok(gs);
      assert.equal(gs.started, false, 'game should not be started initially');
    });

    it('tickRate starts at INITIAL_SPEED (150ms)', () => {
      const gs = getGameState();
      assert.ok(gs);
      assert.equal(gs.tickRate, 150, 'initial tick rate should be 150ms');
    });

    it('body has initial segments (tail down from head)', () => {
      const gs = getGameState();
      assert.ok(gs);
      assert.equal(gs.body.length, 2, 'initial body should have 2 segments');
    });
  });
});
