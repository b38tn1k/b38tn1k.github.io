const {test}=require('node:test');
const assert=require('node:assert');
const {load}=require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');
const path=require('path');

// Coordinate mapping: the app maps a pointer clientX to an art pixel via
//   cell = round(clientX / (rect.width / artWidth))
// In the QA runtime the canvas element's getBoundingClientRect() returns the
// canvas width/height *attribute* value (which equals artWidth here), so a
// pointer at clientX == pixel index maps exactly to that pixel. The same code
// path is correct in a real browser (where rect.width is the CSS size). Tests
// therefore use clientX/Y equal to the target art pixel for crisp coordinates.
function loadApp(){
  return load(path.join(__dirname,'..','index.html'));
}
function paint(a, px, py, opts={}){
  const c = a.document.getElementById('canvas');
  a.event(c,'mousedown',{clientX:px,clientY:py,button:0,buttons:1});
  a.event(c,'mouseup',{clientX:px,clientY:py,button:0,buttons:0});
}
function px(a, x, y){ return a.pixel('canvas', x, y); }

test('a click places the current color at the tapped pixel', ()=>{
  const a = loadApp();
  paint(a, 4, 5);
  assert.deepStrictEqual(px(a, 4, 5), [0, 0, 0, 255]);
});

test('a drag paints a connected line of pixels', ()=>{
  const a = loadApp();
  const c = a.document.getElementById('canvas');
  a.event(c,'mousedown',{clientX:1,clientY:1,button:0,buttons:1});
  a.event(c,'mousemove',{clientX:3,clientY:3,button:0,buttons:1});
  a.event(c,'mouseup',{clientX:3,clientY:3,button:0,buttons:0});
  assert.deepStrictEqual(px(a, 1, 1), [0, 0, 0, 255]);
  assert.deepStrictEqual(px(a, 3, 3), [0, 0, 0, 255]);
  assert.deepStrictEqual(px(a, 2, 2), [0, 0, 0, 255]);
});

test('clicking a palette swatch changes the paint color', ()=>{
  const a = loadApp();
  const swatches = a.document.querySelectorAll('#palette .swatch');
  const red = swatches[3]; // #e0524e
  assert.strictEqual(red.getAttribute('data-color'), '#e0524e');
  a.event(red,'click',{});
  paint(a, 7, 7);
  assert.deepStrictEqual(px(a, 7, 7), [224, 82, 78, 255]);
});

test('the eraser clears a pixel back to transparent', ()=>{
  const a = loadApp();
  paint(a, 6, 6);
  assert.deepStrictEqual(px(a, 6, 6), [0, 0, 0, 255]);
  a.event(a.document.getElementById('btn-eraser'),'click',{});
  paint(a, 6, 6);
  assert.deepStrictEqual(px(a, 6, 6), [0, 0, 0, 0]);
});

test('clear removes everything on the canvas', ()=>{
  const a = loadApp();
  const c = a.document.getElementById('canvas');
  for(let i=0;i<5;i++){ paint(a, i+1, i+1); }
  a.event(a.document.getElementById('btn-clear'),'click',{});
  assert.deepStrictEqual(px(a, 1, 1), [0, 0, 0, 0]);
  assert.deepStrictEqual(px(a, 4, 4), [0, 0, 0, 0]);
});
