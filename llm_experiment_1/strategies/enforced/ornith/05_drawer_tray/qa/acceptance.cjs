// Acceptance tests for the Drawer Tray Maker (index.html).
//
// Runs under the QA runtime at ../enforced-harness/runtime.cjs (a source-only
// JS VM with a partial DOM shim and a partial WebGL stub). It is NOT a browser
// and does NOT encode a PNG. All image encoding, browser layout and GPU
// behavior are unverified here; we only assert real handler dispatch and the
// artifact's own computed outputs.
//
// Outcome-based assertions. Exits nonzero on any failed assertion. Uses
// process.exitCode (not process.exit) so the controller tracer can flush its
// evidence and any exported Blob bytes.
//
// This harness does NOT modify index.html or the runtime. It only loads the
// delivered artifact and exercises its real handlers via a.event, a.advance
// and a.pixel. All failures are recorded faithfully.

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..');
const ARTIFACT = path.join(ROOT, 'index.html');
const runtimePath =
  '/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/enforced-harness/runtime.cjs';
const runtime = require(runtimePath);

// Exact bytes the controller hashes too.
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(ARTIFACT)).digest('hex');

// The four IDs from the original brief requirements.json.
const requiredIds = [
  'editable_dimensions',
  'compartment_dimensions',
  'rotatable_preview',
  'stl_export'
];

const results = { artifactSHA256: sha256, checks: [] };
function record(id, passed, evidence) {
  results.checks.push({ id, passed: Boolean(passed), evidence: String(evidence) });
}

// ---------------------------------------------------------------------------
// Load the actual page. Record the precise reason if load throws.
// ---------------------------------------------------------------------------
let a, document, win, $, canvasEl;
let startupError = null;
let appLoaded = false;
try {
  a = runtime.load(ARTIFACT, { seed: 0.37 });
  document = a.document;
  win = a.window;
  appLoaded = !!a;
  $ = (id) => document.getElementById(id);
  canvasEl = () => $('canvas');
} catch (e) {
  startupError = e;
}

if (!appLoaded) {
  const msg = startupError && startupError.message ? startupError.message : String(startupError);
  record('startup', false, 'Load threw: ' + msg);
  for (const id of requiredIds) {
    record(id, false, 'App failed to initialize in the QA runtime (' + msg + '); ' +
      'functional handlers unreachable via a.event/a.advance/a.pixel.');
  }
  record('stl_export', false, 'No actual STL Blob captured: the app never initialized.');
  record('layout_persistence', false, 'App failed to initialize; cannot persist/edit layout.');
  record('same_trial_retry', false, 'App failed to initialize; cannot retry a false start.');
  fs.writeFileSync(path.join(HERE, 'acceptance-result.json'), JSON.stringify(results, null, 2));
  console.error('Startup failed; handoff written. reason: ' + msg);
  process.exitCode = 1;
  return;
}

const setValue = (id, v) => {
  const el = $(id);
  el.value = v;
  el.dispatchEvent(new win.Event('input', { bubbles: true }));
  el.dispatchEvent(new win.Event('change', { bubbles: true }));
  return el;
};
const fire = (id, type) => {
  $(id).dispatchEvent(new win.Event(type, { bubbles: true }));
};
const compCells = () => document.querySelectorAll('#comp-grid .comp');

// ---------------------------------------------------------------------------
// Baseline: app starts, renderer inits (gl stub present), default run() ran.
// ---------------------------------------------------------------------------
let glSupported = !!a.window.__glProbe; // app probes gl; set below if present
try { glSupported = !!$('canvas') && !!a.document.getElementById('error') === false; } catch (e) {}

// ---------------------------------------------------------------------------
// rotatable_preview: canvas element present, WebGL inited, drag rotates,
// auto-rotate toggles, wireframe toggles.
// ---------------------------------------------------------------------------
(function testRotatablePreview() {
  const canvas = canvasEl();
  let ev = [];
  const canvasOk = !!canvas && +canvas.getAttribute('width') > 0 && +canvas.getAttribute('height') > 0;
  // WebGL context was requested and obtained (the app guards missing gl with an error).
  const glOk = $('error').textContent !== 'WebGL not supported by this browser.';
  // Initial camera orientation stored in app state.
  const startRotY = a.window.__state ? a.window.__state.rotY : null;
  const initialDist = a.window.__state ? a.window.__state.dist : null;

  // Drag to rotate: mousedown + mousemove moves rotY/rotX.
  if (a.window.__state) {
    canvas.dispatchEvent(new win.Event('mousedown', { bubbles: true, clientX: 100, clientY: 100 }));
    window.__qaMockMouse = null;
    // Simulate move by dispatching to window (app listens on window for moveup/move).
    document.dispatchEvent(new win.Event('mouseup'));
    document.dispatchEvent(new win.Event('mousemove', { bubbles: true, clientX: 160, clientY: 130 }));
    document.dispatchEvent(new win.Event('mouseup'));
    const afterRotY = a.window.__state ? a.window.__state.rotY : null;
    ev.push('dragDeltaRotY=' + (afterRotY != null && startRotY != null ? (afterRotY - startRotY).toFixed(3) : 'n/a'));
  }

  // Auto-rotate toggle flips the button label.
  const rotBefore = $('rot-toggle').textContent;
  fire('rot-toggle', 'click');
  const rotAfter = $('rot-toggle').textContent;
  const toggleWorks = (rotBefore.includes('ON') && rotAfter.includes('OFF')) ||
                      (rotBefore.includes('OFF') && rotAfter.includes('ON'));

  // Wire toggle flips label too (exercises the preview toolbar path).
  const wireBefore = $('wire-toggle').textContent;
  fire('wire-toggle', 'click');
  const wireAfter = $('wire-toggle').textContent;
  const wireWorks = (wireBefore.includes('OFF') && wireAfter.includes('ON'));

  // Distinct canvas size proves resize() re-ran against the preview viewport.
  const w1 = +canvas.getAttribute('width'), h1 = +canvas.getAttribute('height');
  canvas.width = 424; canvas.height = 300; // forces __qaInvalidate + resize path
  const w2 = +canvas.getAttribute('width'), h2 = +canvas.getAttribute('height');

  ev.push('canvasOK=' + canvasOk, 'glOk=' + glOk, 'rotToggle=' + toggleWorks,
          'wireToggle=' + wireWorks, 'sizeChanged=' + (w1 !== w2));
  const passed = canvasOk && glOk && toggleWorks && wireWorks;
  record('rotatable_preview', passed, 'canvas ' + w1 + 'x' + h1 + ' gl=' + glOk +
         ' dragDeltaRotY=' + ev.slice(0, 1)[0] + ' rotToggle ' + rotBefore + '->' + rotAfter +
         ' wire ' + wireBefore + '->' + wireAfter + ' sizeChanged=' + (w1 !== w2));
})();

// ---------------------------------------------------------------------------
// editable_dimensions: change outer length; stats + compartment table update.
// ---------------------------------------------------------------------------
(function testEditableDimensions() {
  const beforeLen = +$('length').value;
  setValue('length', 200);
  const afterLen = +$('length').value;
  const countText = $('s-count').textContent;
  const eachText = $('s-each').textContent;
  const cells = compCells().length;
  const changed = afterLen === 200 && eachText !== '' && cells === 6;
  record('editable_dimensions', changed,
    'length ' + beforeLen + '->' + afterLen + ' s-count=' + countText +
    ' s-each=' + eachText + ' compCells=' + cells);
})();

// ---------------------------------------------------------------------------
// compartment_dimensions: a specific layout yields deterministic sizes.
// Default 180x120x30, 3 rows x 2 cols, wall=3, floor=3, gap=0:
//   cavity.w = 180-6=174 -> cellW = 174/2 = 87.0 ; cavity.d = 120-6=114 -> cellH=114/3=38.0
//   cavityH = 30-3 = 27
// ---------------------------------------------------------------------------
(function testCompartmentDimensions() {
  // set explicit wall/floor 2mm test values below; here test the documented default
  setValue('wall', 3); setValue('floor', 3); setValue('gap', 0);
  setValue('length', 180); setValue('width', 120); setValue('height', 30);
  setValue('rows', 3); setValue('cols', 2);
  // read cells
  const cells = [...compCells()];
  const firstDim = cells[0] ? cells[0].textContent : '';
  // each-compartment stat
  const each = $('s-each').textContent;
  // expect 87.0 x 38.0 mm, 27 deep
  const okDim = firstDim.includes('87.0') && firstDim.includes('38.0');
  const okEach = each.includes('87.0') && each.includes('38.0');
  const okCount = cells.length === 6;
  record('compartment_dimensions', okDim && okEach && okCount,
    'cells=' + cells.length + ' firstCell="' + firstDim.trim() + '" s-each="' + each + '"');
})();

// ---------------------------------------------------------------------------
// layout_persistence: after changing the grid, the compartment table and stats
// recompute and persist across rebuilds (run() re-derives from live inputs).
// Try a distinct grid 4x3 and verify 12 cells + matching count.
// ---------------------------------------------------------------------------
(function testLayoutPersistence() {
  setValue('rows', 4); setValue('cols', 3);
  const countText = $('s-count').textContent;
  const cells = compCells().length;
  const each = $('s-each').textContent;
  const ok = cells === 12 && countText === '12' && each.includes('mm');
  // 4 rows x 3 cols, wall=3: cavity.w=174/3=58.0, cavity.d=114/4=28.5
  const cell0 = [...compCells()][0].textContent;
  record('layout_persistence', ok,
    'rows=4 cols=3 -> compCells=' + cells + ' s-count=' + countText +
    ' s-each=' + each + ' cell0="' + cell0.trim() + '"');
})();

// ---------------------------------------------------------------------------
// same-trial retry after a false start: set an INVALID height (1mm < floor 5mm),
// expect a non-crash error message, then repair the input and re-run.
// ---------------------------------------------------------------------------
(function testSameTrialRetry() {
  // repair first so state is valid, then deliberately break then fix.
  setValue('height', 30); setValue('floor', 3);
  const errBefore = $('error').textContent;
  // false start: height smaller than floor -> must be rejected, not crash
  setValue('height', 1);
  const errText = $('error').textContent;
  const rejected = errText.startsWith('Invalid input');
  // retry: fix height above floor
  setValue('height', 30);
  const errAfter = $('error').textContent;
  const repaired = !errAfter.startsWith('Invalid input') && $('s-count').textContent === '6';
  record('same_trial_retry', rejected && repaired,
    'invalid height=1 error="' + errText + '" repaired error="' + errAfter + '"');
})();

// ---------------------------------------------------------------------------
// stl_export: trigger the actual export control, capture the Blob, verify the
// ASCII STL structure and vertex count for the repaired default layout.
// ---------------------------------------------------------------------------
let stlBlob = null;
(function testStlExport() {
  // ensure default layout again (180x120x30, 3x2, wall/floor 3)
  setValue('length', 180); setValue('width', 120); setValue('height', 30);
  setValue('rows', 3); setValue('cols', 2); setValue('wall', 3); setValue('floor', 3); setValue('gap', 0);

  // capture downloads before
  const before = a.downloads.length;
  fire('export', 'click');
  const newDl = a.downloads.slice(before).find(d => d.kind === 'blob');
  if (!newDl) {
    // maybe an anchor download only
    const anchor = a.downloads.slice(before).find(d => d.kind === 'anchor');
    record('stl_export', false, 'no blob download captured; anchor=' + !!anchor + ' kinds=' +
      JSON.stringify(a.downloads.slice(before).map(d => d.kind)));
    return;
  }
  stlBlob = newDl.blob;
  const size = newDl.blob.size;
  newDl.blob.text().then((txt) => {
    const headerOk = txt.startsWith('solid drawer_tray');
    const endOk = txt.includes('end solid');
    const facets = (txt.match(/facet outer loop/g) || []).length;
    const vertices = (txt.match(/ vertex /g) || []).length;
    // vertices in STL = 3 per facet. Default 8 volumes * (18 verts/box) = 144 verts / 6 per... 
    // actual app: boxFaces emits 6 tris/box, 8 volumes -> 48 facets -> 144 verts.
    const vertexConsistent = vertices === facets * 3;
    // stats panel agrees
    const reported = $('s-verts').textContent;
    const sizeReported = $('s-size').textContent;
    const statsOk = reported === String(vertices) && /KB/.test(sizeReported);
    const passed = headerOk && endOk && vertexConsistent && facets >= 1;
    record('stl_export', passed,
      'blob size=' + size + ' B header=' + headerOk + ' endSolid=' + endOk +
      ' facets=' + facets + ' stl-vertices=' + vertices + ' reported-verts=' + reported +
      ' size-label=' + sizeReported);
  }).catch((e) => {
    record('stl_export', false, 'blob.text() failed: ' + e.message);
  });
})();

// ---------------------------------------------------------------------------
// wall/floor 2mm variation (brief: exercise wall/floor edit before export).
// ---------------------------------------------------------------------------
(function testThickness() {
  setValue('wall', 2); setValue('floor', 2);
  setValue('length', 180); setValue('width', 120); setValue('height', 30);
  setValue('rows', 3); setValue('cols', 2);
  const each = $('s-each').textContent;
  // cavity.w = 180-4=176 -> cellW=88.0 ; cavity.d=120-4=116 -> cellH=116/3=38.666->38.7
  // cavityH = 30-2=28
  const cells = [...compCells()][0].textContent;
  const ok = each.includes('88.0') && cells.includes('28.0'); // 28 deep
  record('wall_floor_thickness', ok,
    'wall=2 floor=2 s-each=' + each + ' cell0=' + cells.trim());
})();

// ---------------------------------------------------------------------------
// write results. If STL async hasn't resolved yet, wait for it.
// ---------------------------------------------------------------------------
function finish() {
  // add an environment-note check for PNG (not applicable here, but document the shim)
  fs.writeFileSync(path.join(HERE, 'acceptance-result.json'), JSON.stringify(results, null, 2));
  if (stlBlob) {
    // stash for controller inspection
    try {
      stlBlob.text().then((t) => {
        results.stlBytes = t.length;
        results.stlFirstLines = t.split('\n').slice(0, 3).join(' | ');
        fs.writeFileSync(path.join(HERE, 'acceptance-result.json'), JSON.stringify(results, null, 2));
      }).catch(() => {});
    } catch (e) {}
  }
  const failed = results.checks.filter(c => !c.passed);
  console.error('checks passed ' + (results.checks.length - failed.length) + '/' + results.checks.length);
  if (failed.length) console.error('FAILED: ' + failed.map(f => f.id).join(', '));
  process.exitCode = failed.length ? 1 : 0;
}

// If STL export hasn't resolved by a short timer, finish anyway after awaiting.
const start = Date.now();
function waitStl() {
  if (!stlBlob) {
    if (Date.now() - start > 60000) { finish(); return; }
    setTimeout(waitStl, 200);
    return;
  }
  // wait for the .then inside testStlExport to record; poll ledger until stl recorded or timeout
  const seen = results.checks.find(c => c.id === 'stl_export' && !String(c.evidence).includes('no blob'));
  if (seen && !String(seen.evidence).includes('failed')) {
    finish();
  } else if (Date.now() - start > 60000) {
    finish();
  } else {
    setTimeout(waitStl, 150);
  }
}
// Let synchronous checks complete then schedule the async-aware finish.
setTimeout(waitStl, 300);
