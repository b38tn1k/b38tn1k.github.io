// Runs the real theme-toggle script from _layouts/default.html against a stub
// DOM.  node tools/test_toggle.js   (exits non-zero on failure)
// Minimal DOM stub: enough to run the real toggle script unmodified.
const store = {};
const el = (t) => ({ _t: t, textContent: '', hidden: true, attrs: {},
  setAttribute(k, v) { this.attrs[k] = v; },
  getAttribute(k) { return this.attrs[k] ?? null; },
  addEventListener(_, fn) { this.click = fn; },
  querySelector(sel) { return sel.includes('label') ? label : icon } });
const label = el('span'), icon = el('span');
const button = el('button');
const root = el('html');
global.document = { documentElement: root, querySelector: () => button };
global.window = { matchMedia: () => ({ matches: false }) };   // OS says dark
global.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => store[k] = v };

const fs = require('fs');
const src = fs.readFileSync('_layouts/default.html', 'utf8');
eval(src.match(/<script>([\s\S]*?)<\/script>/)[1]);

let failed = 0;
const check = (desc, got, want) =>
  (got !== want && failed++, console.log(`${got === want ? 'PASS' : 'FAIL'}  ${desc}: ${JSON.stringify(got)}${got === want ? '' : ' want ' + JSON.stringify(want)}`));

check('button unhidden by script', button.hidden, false);
check('OS dark -> offers light', label.textContent, 'light');
check('icon for light', icon.textContent, '◐');
check('aria-label set', button.getAttribute('aria-label'), 'Switch to light mode');

button.click();
check('after click -> data-theme light', root.getAttribute('data-theme'), 'light');
check('persisted', store.theme, 'light');
check('now offers dark', label.textContent, 'dark');
check('icon flipped', icon.textContent, '◑');

button.click();
check('click again -> back to dark', root.getAttribute('data-theme'), 'dark');
check('persisted dark', store.theme, 'dark');
check('offers light again', label.textContent, 'light');

if (failed) { console.error(`\n${failed} check(s) failed`); process.exit(1); }
