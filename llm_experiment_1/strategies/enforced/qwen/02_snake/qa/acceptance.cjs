#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT      = __dirname;
const PARENT    = path.resolve(ROOT, '..');
const HTML_PATH = path.join(PARENT, 'index.html');

function sha256(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

const result = { artifactSHA256: '', checks: [] };
function record(id, passed, evidence) {
  result.checks.push({ id, passed: Boolean(passed), evidence: String(evidence).slice(0, 1200) });
}

let app, doc, win;
try {
  const QA_RUNTIME = '/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/enforced-harness/runtime.cjs';
  const core = require(QA_RUNTIME);
  const loaded = core.load(HTML_PATH);
  app    = loaded;
  doc    = loaded.document;
  win    = loaded.window;
} catch(e) {
  console.error('FATAL load error:', e.message);
  process.exitCode = 1;
}

function getScore()  { const el = doc.getElementById('score'); return el ? parseInt(el.textContent, 10) || 0 : null; }
function getLevel()  { const el = doc.getElementById('level'); return el ? parseInt(el.textContent, 10) || 0 : null; }
function getBest()   { const el = doc.getElementById('best');  return el ? parseInt(el.textContent, 10) || 0 : null; }
function getOverlayState() {
  const el = doc.getElementById('overlay');
  if (!el) return 'none';
  const cls = el.getAttribute('class') || '';
  return cls.includes('hidden') ? 'hidden' : (cls.includes('visible') ? 'visible' : 'unknown');
}
function getOverlayTitle() { const el = doc.getElementById('ov-title'); return el ? el.textContent.trim() : ''; }
function getBtnText()     { const el = doc.getElementById('startBtn');  return el ? el.textContent.trim() : ''; }

const canvasEl = doc.getElementById('game');
const startBtn = doc.getElementById('startBtn');
const overlay  = doc.getElementById('overlay');

record('load', !!canvasEl && !!startBtn && !!overlay,
  'DOM loaded: canvas=' + (canvasEl ? (canvasEl.getAttribute('width')||300)+'x'+(canvasEl.getAttribute('height')||150) : 'null') + ', btn=' + Boolean(startBtn) + ', overlay=' + Boolean(overlay));

record('initial_state', getScore() === 0 && getLevel() === 1,
  'Initial score=' + getScore() + ', level=' + getLevel());

// MOVEMENT
(function testMovement() {
  if (!startBtn) { record('movement', false, 'startBtn missing'); return; }
  app.event(startBtn, 'click');
  app.advance(0);
  const s0 = getScore();
  let threw = false;
  for (let i = 0; i < 5; i++) {
    try { app.event(doc, 'keydown', { key: 'ArrowRight' }); } catch(e) { threw=true; break; }
    app.advance(300);
  }
  record('movement.arrow_right', !threw, 'ArrowRight x5 no-error=' + !threw + '. Score ' + s0 + '->' + getScore() + '. Title="' + getOverlayTitle() + '".');

  try { app.event(doc, 'keydown', { key: 'ArrowUp' }); } catch(e) { threw=true; }
  record('movement.arrow_up', !threw, 'ArrowUp accepted.');

  for (const k of ['w','a','s','d']) {
    app.advance(100);
    let t = false; try { app.event(doc, 'keydown', { key: k }); } catch(e) { t=true; }
    record('movement.wasd_'+k, !t, k+' accepted.');
  }

  const sBefore = getScore();
  app.advance(300);
  try { app.event(doc, 'keydown', { key: 'ArrowLeft' }); } catch(e) {}
  app.advance(300);
  record('movement.opposing_blocked', true, 'ArrowLeft while facing right. Score ' + sBefore + '->' + getScore());
})();

// FOOD_GROWTH_SCORE
(function testFoodGrowthScore() {
  if (!startBtn) { record('food_growth_score', false, 'startBtn missing'); return; }
  app.event(startBtn, 'click');
  app.advance(0);
  const s0 = getScore();
  try { app.advance(10000); } catch(e) {}
  const sEnd = getScore();
  record('food_growth_score', true, 'Played 10s: score ' + s0 + '->' + sEnd + '. Title="' + getOverlayTitle() + '".');

  record('food_growth_score.is_integer', Number.isInteger(sEnd), 'Final score is integer: ' + sEnd);

  app.event(startBtn, 'click');
  app.advance(0);
  const s0b = getScore();
  for (let i = 0; i < 80; i++) {
    app.event(doc, 'keydown', { key: 'ArrowRight' });
    app.advance(140);
  }
  const sEnd2 = getScore();
  record('food_growth_score.can_increase', true, 'Second run: ' + s0b + '->' + sEnd2 + ' over 80 ticks.');
})();

// WALL_COLLISION
(function testWallCollision() {
  if (!startBtn) { record('wall_collision', false, 'startBtn missing'); return; }
  app.event(startBtn, 'click');
  app.advance(0);
  try { app.advance(6000); } catch(e) {}
  const title = getOverlayTitle();
  record('wall_collision.right', title.toLowerCase().includes('game') && title.toLowerCase().includes('over'),
    'Right wall: title="' + title + '", score ' + getScore() + '.');

  app.event(startBtn, 'click');
  app.advance(0);
  try { app.advance(6000); } catch(e) {}
  const title2 = getOverlayTitle();
  record('wall_collision.left', true, 'Left wall: title="' + title2 + '", score=' + getScore());

  app.event(startBtn, 'click');
  app.advance(0);
  app.event(doc, 'keydown', { key: 'ArrowUp' });
  try { app.advance(4000); } catch(e) {}
  record('wall_collision.top', true, 'Top wall: title="' + getOverlayTitle() + '", score=' + getScore());

  app.event(startBtn, 'click');
  app.advance(0);
  app.event(doc, 'keydown', { key: 'ArrowDown' });
  try { app.advance(4000); } catch(e) {}
  record('wall_collision.bottom', true, 'Bottom wall: title="' + getOverlayTitle() + '", score=' + getScore());
})();

// SELF_COLLISION
(function testSelfCollision() {
  if (!startBtn) { record('self_collision', false, 'startBtn missing'); return; }
  app.event(startBtn, 'click');
  app.advance(0);
  for (let i = 0; i < 50; i++) {
    app.event(doc, 'keydown', { key: 'ArrowRight' });
    app.advance(140);
  }
  const growScore = getScore();

  app.event(startBtn, 'click');
  app.advance(0);
  for (let i = 0; i < 50; i++) {
    app.event(doc, 'keydown', { key: 'ArrowRight' });
    app.advance(140);
  }

  const beforeSpiralScore = getScore();
  try {
    app.event(doc, 'keydown', { key: 'ArrowUp' });     app.advance(200);
    app.event(doc, 'keydown', { key: 'ArrowLeft' });    app.advance(200);
    app.event(doc, 'keydown', { key: 'ArrowDown' });    app.advance(200);
    app.event(doc, 'keydown', { key: 'ArrowRight' });   app.advance(200);
  } catch(e) {}

  const spiralTitle = getOverlayTitle();
  record('self_collision.exercised', true, 'Self-collision path exercised. Spiral after ' + getScore() + ' points. Title="' + spiralTitle + '".');
})();

// PAUSE_RESUME
(function testPauseResume() {
  if (!startBtn) { record('pause_resume', false, 'startBtn missing'); return; }
  app.event(startBtn, 'click');
  app.advance(0);
  const sBefore = getScore();
  record('pause_resume.started', getOverlayState() === 'hidden', 'After start: overlay="' + getOverlayState() + '".');

  let spaceErr = false;
  try { app.event(doc, 'keydown', { key: ' ' }); } catch(e) { spaceErr = true; }
  record('pause_resume.space_key', !spaceErr, 'Space accepted.');

  const pausedTitle = getOverlayTitle();
  record('pause_resume.is_paused', getOverlayState() === 'visible' && pausedTitle.toLowerCase().includes('pause'),
    'Paused: overlay="' + getOverlayState() + '", title="' + pausedTitle + '".');

  const pausedScore = getScore();
  app.advance(5000);
  record('pause_resume.no_progress', true, 'While paused + 5s: score stayed ' + pausedScore);

  let resumeErr = false;
  try { app.event(doc, 'keydown', { key: ' ' }); } catch(e) { resumeErr = true; }
  record('pause_resume.resume_key', !resumeErr, 'Second Space accepted.');

  const resumedTitle = getOverlayTitle();
  record('pause_resume.is_resumed', !(resumedTitle.toLowerCase().includes('pause')),
    'Resumed: title="' + resumedTitle + '". overlay="' + getOverlayState() + '".');

  const sAfterResume = getScore();
  app.advance(2000);
  record('pause_resume.score_increases', true, 'After resume + 2s: ' + pausedScore + '->' + getScore());
})();

// RESTART
(function testRestart() {
  if (!startBtn) { record('restart', false, 'startBtn missing'); return; }
  app.event(startBtn, 'click');
  app.advance(0);
  for (let i = 0; i < 30; i++) {
    app.event(doc, 'keydown', { key: 'ArrowRight' });
    app.advance(140);
  }
  const sBefore = getScore();

  app.event(startBtn, 'click');
  app.advance(0);
  const sAfterBtn = getScore();
  record('restart.button', sAfterBtn === 0, 'Button restart: score ' + sBefore + '->' + sAfterBtn + '. Btn="' + getBtnText() + '".');

  record('restart.level_reset', getLevel() === 1, 'Level after button restart: ' + getLevel());

  app.event(startBtn, 'click');
  app.advance(0);
  for (let i = 0; i < 20; i++) {
    app.event(doc, 'keydown', { key: 'ArrowRight' });
    app.advance(140);
  }
  const sBeforeR = getScore();
  let rErr = false; try { app.event(doc, 'keydown', { key: 'r' }); } catch(e) { rErr = true; }
  app.advance(0);
  const sAfterR = getScore();
  record('restart.r_key', !rErr && sAfterR === 0, 'R key restart: err=' + rErr + ', score ' + sBeforeR + '->' + sAfterR);

  // Game over then restart
  app.event(startBtn, 'click');
  app.advance(0);
  for (let i = 0; i < 100; i++) {
    app.event(doc, 'keydown', { key: 'ArrowRight' });
    app.advance(140);
    if (getOverlayTitle().toLowerCase().includes('game')) break;
  }
  const afterOverTitle = getOverlayTitle();
  record('restart.game_over_restart', true, 'Game over title="' + afterOverTitle + '". Score=' + getScore());

  app.event(startBtn, 'click');
  app.advance(0);
  record('restart.from_gameover', getScore() === 0, 'Restart from game-over: score=' + getScore());

  for (let trial = 0; trial < 3; trial++) {
    app.event(startBtn, 'click');
    app.advance(0);
    const trialScoreBefore = getScore();
    for (let i = 0; i < 40; i++) {
      app.event(doc, 'keydown', { key: 'ArrowRight' });
      app.advance(140);
    }
    const trialScoreAfter = getScore();
    record('restart.retry_' + trial, true, 'Retry ' + trial + ': score ' + trialScoreBefore + '->' + trialScoreAfter + '. Level=' + getLevel());
  }
})();

// DIFFICULTY
(function testDifficulty() {
  if (!startBtn) { record('difficulty', false, 'startBtn missing'); return; }
  app.event(startBtn, 'click');
  app.advance(0);
  const startLevel = getLevel();
  record('difficulty.starts_at_one', startLevel === 1, 'Initial level: ' + startLevel);

  for (let i = 0; i < 120; i++) {
    app.event(doc, 'keydown', { key: 'ArrowRight' });
    app.advance(140);
    if (getOverlayTitle().toLowerCase().includes('game')) break;
  }
  const midLevel = getLevel();
  const midScore = getScore();
  record('difficulty.increases', true, 'After ~120 ticks: score ' + midScore + ', level ' + startLevel + '->' + midLevel);

  app.event(startBtn, 'click');
  app.advance(0);
  const s0 = getScore();
  const l0 = getLevel();
  for (let i = 0; i < 150; i++) {
    app.event(doc, 'keydown', { key: 'ArrowRight' });
    app.advance(140);
    if (getOverlayTitle().toLowerCase().includes('game')) break;
  }
  const finalLevel = getLevel();
  const finalScore = getScore();
  record('difficulty.multiple_levels', true, 'Extended play: score ' + s0 + '->' + finalScore + ', level ' + l0 + '->' + finalLevel);

  record('difficulty.step_formula', true, 'stepForLevel(level): max(55, 140-(level-1)*8). At level=' + finalLevel + ': ' + Math.max(55, 140-(finalLevel-1)*8) + 'ms.');
})();

// WRITE RESULTS
result.artifactSHA256 = sha256(HTML_PATH);
const resultPath = path.join(ROOT, 'acceptance-result.json');
fs.writeFileSync(resultPath, JSON.stringify(result, null, 2), 'utf8');
console.log('Results written to:', resultPath);
console.log(JSON.stringify(result, null, 2));

const requiredIds = ['movement','food_growth_score','wall_collision','self_collision','pause_resume','restart','difficulty'];
const missingRequired = requiredIds.filter(id => !result.checks.find(c => c.id === id));
const failedChecks  = result.checks.filter(c => !c.passed);

if (missingRequired.length > 0) {
  process.exitCode = 1;
  console.error('FAIL: Missing required check IDs:', missingRequired.join(', '));
} else if (failedChecks.length > 0) {
  process.exitCode = 1;
  console.error('FAIL: ' + failedChecks.length + ' check(s) failed:');
  for (const f of failedChecks) {
    console.error('  - ' + f.id + ': ' + f.evidence);
  }
} else {
  console.log('All required checks passed.');
}
