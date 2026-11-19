const {test}=require('node:test');
const assert=require('node:assert');
const {load}=require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');
const path=require('path');

function loadApp(){
  return load(path.join(__dirname,'..','index.html'));
}
function paint(a, px, py){
  const c = a.document.getElementById('canvas');
  a.event(c,'mousedown',{clientX:px,clientY:py,button:0,buttons:1});
  a.event(c,'mouseup',{clientX:px,clientY:py,button:0,buttons:0});
}
function px(a, x, y){ return a.pixel('canvas', x, y); }

test('canvas size inputs update the canvas when Apply is pressed', ()=>{
  const a = loadApp();
  const c = a.document.getElementById('canvas');
  assert.strictEqual(c.width, 16);
  a.document.getElementById('width-input').value = '32';
  a.document.getElementById('height-input').value = '24';
  a.event(a.document.getElementById('btn-apply-size'),'click',{});
  assert.strictEqual(c.width, 32);
  assert.strictEqual(c.height, 24);
});

test('the size label reflects the current dimensions', ()=>{
  const a = loadApp();
  assert.strictEqual(a.document.getElementById('size-label').textContent, '16 × 16');
  a.document.getElementById('width-input').value = '40';
  a.document.getElementById('height-input').value = '30';
  a.event(a.document.getElementById('btn-apply-size'),'click',{});
  assert.strictEqual(a.document.getElementById('size-label').textContent, '40 × 30');
});

test('increasing canvas size preserves existing pixels', ()=>{
  const a = loadApp();
  paint(a, 5, 5);
  assert.deepStrictEqual(px(a, 5, 5), [0, 0, 0, 255]);
  a.document.getElementById('width-input').value = '20';
  a.document.getElementById('height-input').value = '20';
  a.event(a.document.getElementById('btn-apply-size'),'click',{});
  assert.strictEqual(px(a, 5, 5)[3], 255); // still opaque
});

test('the plus button grows the canvas by one pixel', ()=>{
  const a = loadApp();
  const c = a.document.getElementById('canvas');
  a.event(a.document.getElementById('btn-in'),'click',{});
  assert.strictEqual(c.width, 17);
});

test('the minus button shrinks the canvas by one pixel', ()=>{
  const a = loadApp();
  const c = a.document.getElementById('canvas');
  a.event(a.document.getElementById('btn-out'),'click',{});
  assert.strictEqual(c.width, 15);
});

test('brush size expands the painted area', ()=>{
  const a = loadApp();
  a.event(a.document.getElementById('brush-size'),'input',{});
  a.document.getElementById('brush-size').value = '3';
  a.event(a.document.getElementById('brush-size'),'input',{});
  assert.strictEqual(a.document.getElementById('brush-size-label').textContent, '3 × 3');
  paint(a, 5, 5);
  // A 3x3 brush centered on (5,5) covers cells 4,5,6 in both axes.
  assert.deepStrictEqual(px(a, 4, 4), [0, 0, 0, 255]);
  assert.deepStrictEqual(px(a, 6, 6), [0, 0, 0, 255]);
  assert.deepStrictEqual(px(a, 5, 5), [0, 0, 0, 255]);
});

test('exporting a PNG triggers a download of the canvas', ()=>{
  const a = loadApp();
  a.event(a.document.getElementById('btn-export'),'click',{});
  const anchors = a.downloads.filter(d => d.kind === 'anchor');
  assert.strictEqual(anchors.length, 1);
  assert.match(anchors[0].download, /\.png$/);
});

test('a custom color from the color picker is painted', ()=>{
  const a = loadApp();
  a.document.getElementById('color-picker').value = '#123456';
  a.event(a.document.getElementById('color-picker'),'input',{});
  paint(a, 2, 2);
  const p = px(a, 2, 2);
  assert.deepStrictEqual(p, [18, 52, 86, 255]);
});
