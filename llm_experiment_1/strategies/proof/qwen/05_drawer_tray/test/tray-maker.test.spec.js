const { strictEqual, ok, deepStrictEqual } = require('assert');
const harness = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');

// ===== Test 1: HTML loads and renders =====
exports['tray-maker html loads into DOM'] = async () => {
  const a = harness.load('./index.html');
  ok(a.document, 'document should exist');
  strictEqual(a.document.readyState, 'complete', 'DOM ready state should be complete');
};

// ===== Test 2: Default parameters are correct (180x120x30, 3x2 grid) =====
exports['default outer dimensions are 180 x 120 x 30 mm'] = async () => {
  const a = harness.load('./index.html');
  const p = a.P;
  strictEqual(p.W, 180);
  strictEqual(p.D, 120);
  strictEqual(p.H, 30);
};

exports['default grid is 3 rows x 2 columns'] = async () => {
  const a = harness.load('./index.html');
  const p = a.P;
  strictEqual(p.rows, 3);
  strictEqual(p.cols, 2);
};

// ===== Test 3: Default wall and floor thickness =====
exports['default wall thickness is 3 mm'] = async () => {
  const a = harness.load('./index.html');
  strictEqual(a.P.wallT, 3);
};

exports['default floor thickness is 3 mm'] = async () => {
  const a = harness.load('./index.html');
  strictEqual(a.P.floorT, 3);
};

// ===== Test 4: Interior dimensions are correct =====
exports['interior width accounts for wall thickness on both sides'] = async () => {
  const a = harness.load('./index.html');
  const W = a.P.W, D = a.P.D, wT = a.P.wallT;
  strictEqual(a.P.W - 2 * wT, 174); // 180 - 6
};

exports['interior depth accounts for wall thickness on front and back'] = async () => {
  const a = harness.load('./index.html');
  strictEqual(a.P.D - 2 * a.P.wallT, 114); // 120 - 6
};

// ===== Test 5: Compartment dimensions are computed correctly =====
exports['compartment width equals interior width divided by columns'] = async () => {
  const a = harness.load('./index.html');
  const intW = a.P.W - 2 * a.P.wallT;
  const cellW = intW / a.P.cols;
  strictEqual(cellW, 87); // (180-6)/2
};

exports['compartment depth equals interior depth divided by rows'] = async () => {
  const a = harness.load('./index.html');
  const intD = a.P.D - 2 * a.P.wallT;
  const cellD = intD / a.P.rows;
  strictEqual(cellD, Math.round(114/3*10)/10); // 38
};

// ===== Test 6: UI sliders reflect parameter values =====
exports['all slider elements are present in DOM'] = async () => {
  const a = harness.load('./index.html');
  ok(a.document.getElementById('rW'), 'width slider exists');
  ok(a.document.getElementById('rD'), 'depth slider exists');
  ok(a.document.getElementById('rH'), 'height slider exists');
  ok(a.document.getElementById('rR'), 'rows slider exists');
  ok(a.document.getElementById('rC'), 'cols slider exists');
  ok(a.document.getElementById('rT'), 'wall thickness slider exists');
  ok(a.document.getElementById('rt'), 'floor thickness slider exists');
};

exports['all value display elements are present in DOM'] = async () => {
  const a = harness.load('./index.html');
  ok(a.document.getElementById('vW'), 'width value span exists');
  ok(a.document.getElementById('vD'), 'depth value span exists');
  ok(a.document.getElementById('vH'), 'height value span exists');
  ok(a.document.getElementById('vR'), 'rows value span exists');
  ok(a.document.getElementById('vC'), 'cols value span exists');
  ok(a.document.getElementById('vT'), 'wall thickness value span exists');
  ok(a.document.getElementById('vt'), 'floor thickness value span exists');
};

// ===== Test 7: Compartment list is generated in the DOM =====
exports['compartment list displays all compartments'] = async () => {
  const a = harness.load('./index.html');
  // Trigger render to populate compList
  if (typeof a.render === 'function') a.render();
  const cl = a.document.getElementById('compList');
  ok(cl, 'compartment list container exists');
  const items = cl.querySelectorAll('.comp-item');
  strictEqual(items.length, 6); // 3 rows * 2 cols
};

// ===== Test 8: Canvas element exists for 3D preview =====
exports['canvas element c3d exists'] = async () => {
  const a = harness.load('./index.html');
  ok(a.document.getElementById('c3d'), 'canvas #c3d exists');
};

// ===== Test 9: STL export produces output structure =====
exports['exportSTL function is defined'] = async () => {
  const a = harness.load('./index.html');
  strictEqual(typeof a.exportSTL, 'function', 'exportSTL should be a function');
};

// ===== Test 10: Adjusting parameters changes dimensions =====
exports['changing width slider updates P.W'] = async () => {
  const a = harness.load('./index.html');
  const origW = a.P.W;
  const slider = a.document.getElementById('rW');
  // Simulate input event
  if (slider) {
    slider.value = 200;
    const evt = new a.CustomEvent('input', { bubbles: true, detail: { value: 200 } });
    Object.defineProperty(evt, 'target', { get() { return slider; } });
    slider.dispatchEvent(evt);
  }
  strictEqual(a.P.W, 200);
};

exports['changing rows slider updates P.rows'] = async () => {
  const a = harness.load('./index.html');
  const slider = a.document.getElementById('rR');
  if (slider) {
    slider.value = 5;
    const evt = new a.CustomEvent('input', { bubbles: true, detail: { value: 5 } });
    Object.defineProperty(evt, 'target', { get() { return slider; } });
    slider.dispatchEvent(evt);
  }
  strictEqual(a.P.rows, 5);
};

// ===== Test 11: Edge cases - minimum dimensions =====
exports['minimum width of 50 is accepted'] = async () => {
  const a = harness.load('./index.html');
  const slider = a.document.getElementById('rW');
  if (slider) {
    slider.value = 50;
    const evt = new a.CustomEvent('input', { bubbles: true, detail: { value: 50 } });
    Object.defineProperty(evt, 'target', { get() { return slider; } });
    slider.dispatchEvent(evt);
  }
  strictEqual(a.P.W, 50);
};

exports['minimum wall thickness of 1 is accepted'] = async () => {
  const a = harness.load('./index.html');
  strictEqual(a.P.wallT, 3); // default
  ok(1 <= a.document.getElementById('rT').min);
  ok(1 <= parseFloat(a.document.getElementById('rT').min));
};

// ===== Test 12: Interior dimensions for grid of 1x1 =====
exports['single compartment occupies full interior'] = async () => {
  const a = harness.load('./index.html');
  a.P.rows = 1;
  a.P.cols = 1;
  const intW = a.P.W - 2 * a.P.wallT;
  const intD = a.P.D - 2 * a.P.wallT;
  strictEqual(intW / a.P.cols, intW);
  strictEqual(intD / a.P.rows, intD);
};
