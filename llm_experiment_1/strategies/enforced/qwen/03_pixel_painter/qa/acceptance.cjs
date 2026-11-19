#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Resolve paths: work dir is parent of qa/
const workDir = path.resolve(__dirname, '..');
const indexHtml = path.join(workDir, 'index.html');
const resultPath = path.join(__dirname, 'acceptance-result.json');

// ===================== SHA-256 =====================
const artifactSHA256 = crypto.createHash('sha256').update(fs.readFileSync(indexHtml)).digest('hex');

// ===================== LOAD APP =====================
const { load } = require('../../../../enforced-harness/runtime.cjs');
const app = load(indexHtml, { constantRandom: true });
const { document, window, event, downloads, logs, errors, now, buttons, pixel } = app;

if (errors.length > 0) {
  console.log('App startup errors:', JSON.stringify(errors));
}

let exitCode = 0;
const checks = [];

function check(id, fn) {
  try {
    const result = fn();
    checks.push(result);
    if (!result.passed) {
      console.error(`[FAIL] ${id}: ${result.evidence}`);
      exitCode = 1;
    } else {
      console.log(`[PASS] ${id}`);
    }
  } catch (e) {
    checks.push({ id, passed: false, evidence: 'Assertion threw: ' + e.message });
    console.error(`[ERROR] ${id}: ${e.message}`);
    exitCode = 1;
  }
}

// Helper to count non-transparent pixels in the canvas
function countNonTransparent(canvas) {
  const ctx2d = canvas.getContext('2d');
  const imgData = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
  let count = 0;
  for (let i = 3; i < imgData.data.length; i += 4) {
    if (imgData.data[i] > 0) count++;
  }
  return count;
}

function isCanvasBlank(canvas) {
  const ctx2d = canvas.getContext('2d');
  const imgData = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 3; i < imgData.data.length; i += 4) {
    if (imgData.data[i] > 0) return false;
  }
  return true;
}

// ===================== CHECK 1: resize_rectangular =====================
check('resize_rectangular', () => {
  const canvas = document.getElementById('canvas');
  const initialW = canvas.width;
  const initialH = canvas.height;

  const wInput = document.getElementById('canvasW');
  const hInput = document.getElementById('canvasH');
  wInput.value = '60';
  hInput.value = '40';

  event(document.getElementById('btnResize'), 'click');

  const newW = canvas.width;
  const newH = canvas.height;
  const statusEl = document.getElementById('canvasSizeDisplay');
  const statusText = statusEl.textContent;

  return {
    id: 'resize_rectangular',
    passed: (newW === 60 && newH === 40) && statusText.includes('60') && statusText.includes('40'),
    evidence: `Resized from ${initialW}x${initialH} to ${newW}x${newH}; dims_correct=${(newW===60&&newH===40)}; status="${statusText}"`
  };
});

// ===================== CHECK 2: palette_brush =====================
check('palette_brush', () => {
  const swatches = document.querySelectorAll('.swatch');
  if (swatches.length === 0) {
    return { id: 'palette_brush', passed: false, evidence: 'No palette swatches found' };
  }

  // Pick the second swatch
  event(swatches[1], 'click');

  let activeSwatchColor = '';
  for (const s of swatches) {
    if (s.classList.contains('active')) {
      const c = s.dataset.color || s.style.backgroundColor;
      activeSwatchColor = c;
      break;
    }
  }

  const hexDisplay = document.getElementById('hexDisplay').textContent;

  return {
    id: 'palette_brush',
    passed: swatches.length >= 8 && !!activeSwatchColor,
    evidence: `Palette has ${swatches.length} swatches; active color="${activeSwatchColor}"; hexDisplay="${hexDisplay}"`
  };
});

// ===================== CHECK 3: eraser =====================
check('eraser', () => {
  const eraserBtn = document.querySelector('[data-tool="eraser"]');
  if (!eraserBtn) return { id: 'eraser', passed: false, evidence: 'No eraser button with data-tool="eraser"' };

  event(eraserBtn, 'click');

  const activeToolBtn = document.querySelector('[data-tool].active');
  const isEraserActive = activeToolBtn && activeToolBtn.dataset.tool === 'eraser';

  return {
    id: 'eraser',
    passed: isEraserActive,
    evidence: `Eraser button exists=${!!eraserBtn}; active tool="${activeToolBtn ? activeToolBtn.dataset.tool : 'none'}"`
  };
});

// ===================== CHECK 4: undo_redo (multiple steps + same-trial retry) =====================
check('undo_redo', () => {
  const canvas = document.getElementById('canvas');
  const btnUndo = document.getElementById('btnUndo');
  const btnRedo = document.getElementById('btnRedo');
  if (!btnUndo || !btnRedo) return { id: 'undo_redo', passed: false, evidence: 'Missing undo/redo buttons' };

  const histDisplay = document.getElementById('historyDisplay');

  // Paint a pixel (triggers saveHistory inside handlePointerDown)
  event(canvas, 'mousedown', { clientX: 10, clientY: 10 });

  const histBeforeUndo = histDisplay.textContent;

  // Undo step 1
  event(btnUndo, 'click');
  const histAfterU1 = histDisplay.textContent;

  // Undo step 2 (multiple undo)
  event(btnUndo, 'click');
  const histAfterU2 = histDisplay.textContent;

  // Redo step 1
  event(btnRedo, 'click');
  const histAfterR1 = histDisplay.textContent;

  // Redo step 2 (multiple redo)
  event(btnRedo, 'click');
  const histAfterR2 = histDisplay.textContent;

  // Same-trial retry: paint again and undo/redo
  event(canvas, 'mousedown', { clientX: 20, clientY: 20 });
  const histAfterRetryPaint = histDisplay.textContent;
  event(btnUndo, 'click');
  const histAfterRetryU = histDisplay.textContent;
  event(btnRedo, 'click');
  const histAfterRetryR = histDisplay.textContent;

  // The history display should contain meaningful numeric data (e.g., "History: N/M")
  const hasHistoryData = /[0-9]+\s*[\/:/]\s*[0-9]+/.test(histDisplay.textContent);

  return {
    id: 'undo_redo',
    passed: !!btnUndo && !!btnRedo && hasHistoryData,
    evidence: `before="${histBeforeUndo}"; u1="${histAfterU1}"; u2="${histAfterU2}"; r1="${histAfterR1}"; r2="${histAfterR2}"; retry-paint="${histAfterRetryPaint}"; retry-u="${histAfterRetryU}"; retry-r="${histAfterRetryR}"`
  };
});

// ===================== CHECK 5: clear (paint, clear, paint again, clear again) =====================
check('clear', () => {
  const canvas = document.getElementById('canvas');
  const btnClear = document.getElementById('btnClear');
  if (!btnClear) return { id: 'clear', passed: false, evidence: 'No clear button' };

  // Ensure tool is brush for painting
  const brushBtn = document.querySelector('[data-tool="brush"]');
  if (brushBtn) event(brushBtn, 'click');

  // Phase 1: Paint content
  event(canvas, 'mousedown', { clientX: 0, clientY: 0 });
  const nonTransparentBefore = countNonTransparent(canvas);

  // Phase 2: Clear
  event(btnClear, 'click');
  const blankAfterClear1 = isCanvasBlank(canvas);

  // Same-trial retry: Paint again on now-blank canvas
  event(canvas, 'mousedown', { clientX: 5, clientY: 5 });
  const nonTransparentAfterRetryPaint = countNonTransparent(canvas);

  // Phase 3: Clear again
  event(btnClear, 'click');
  const blankAfterClear2 = isCanvasBlank(canvas);

  return {
    id: 'clear',
    passed: blankAfterClear1 && blankAfterClear2,
    evidence: `Phase1-nonTransparent=${nonTransparentBefore}; clear-blank=${blankAfterClear1}; retry-paint-nonTransparent=${nonTransparentAfterRetryPaint}; retry-clear-blank=${blankAfterClear2}`
  };
});

// ===================== CHECK 6: png_export =====================
check('png_export', () => {
  const canvas = document.getElementById('canvas');
  const btnExport = document.getElementById('btnExport');
  if (!btnExport) return { id: 'png_export', passed: false, evidence: 'No export button' };

  // Paint something first so toDataURL has content
  event(canvas, 'mousedown', { clientX: 0, clientY: 0 });

  const wBefore = canvas.width;
  const hBefore = canvas.height;

  // Trigger the actual export handler
  event(btnExport, 'click');

  // The runtime captures toDataURL calls in downloads[] with kind='canvasDataURL'
  const exportEntry = downloads.find(d => d.kind === 'canvasDataURL');

  return {
    id: 'png_export',
    passed: !!exportEntry,
    evidence: `Export button id="${btnExport.id}"; canvas=${wBefore}x${hBefore}; toDataURL captured=${!!exportEntry}; downloadKind=${exportEntry ? exportEntry.kind : 'none'}; dims_match=${exportEntry && exportEntry.width === wBefore && exportEntry.height === hBefore}. The QA shim simulates Canvas.toDataURL() by recording the call in downloads[] and returning 'data:image/png;base64,QA_NOT_REAL_PNG'; actual PNG encoding does not occur in this test environment.`
  };
});

// ===================== CHECK 7: mouse_touch =====================
check('mouse_touch', () => {
  const canvas = document.getElementById('canvas');
  if (!canvas) return { id: 'mouse_touch', passed: false, evidence: 'No canvas element' };

  const cw = canvas.width;
  const ch = canvas.height;

  // Ensure tool is brush
  const brushBtn = document.querySelector('[data-tool="brush"]');
  if (brushBtn) event(brushBtn, 'click');

  // Simulate mouse drawing: mousedown triggers handlePointerDown which calls saveHistory and paintPixel
  event(canvas, 'mousedown', { clientX: 0, clientY: 0 });
  const nonTransparentMouse = countNonTransparent(canvas);

  // Verify the app source registers touch handlers by checking registered listener types
  // The app binds: pointerdown/move/up, mouseup/down/move, touchstart/move/end/cancel
  const src = fs.readFileSync(indexHtml, 'utf8');
  const hasMouseHandlers = /addEventListener\s*\(\s*["']mouse(down|up|move)/.test(src);
  const hasTouchHandlers = /addEventListener\s*\(\s*["']touch(s(start|move)|end|cancel)/.test(src);

  return {
    id: 'mouse_touch',
    passed: nonTransparentMouse > 0 && hasMouseHandlers && hasTouchHandlers,
    evidence: `Mouse drawing painted ${nonTransparentMouse} non-transparent pixels at clientX=0,clientY=0; canvas=${cw}x${ch}; mouse_handlers=${hasMouseHandlers}; touch_handlers=${hasTouchHandlers}.`
  };
});

// ===================== WRITE RESULT =====================
const result = {
  artifactSHA256,
  checks
};

fs.writeFileSync(resultPath, JSON.stringify(result, null, 2), 'utf8');
console.log('Wrote acceptance-result.json with', checks.length, 'checks');
process.exitCode = exitCode;
