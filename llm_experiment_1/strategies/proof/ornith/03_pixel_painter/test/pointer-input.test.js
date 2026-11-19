const {test}=require('node:test');
const assert=require('node:assert');
const {load}=require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');
const path=require('path');

function loadApp(){
  return load(path.join(__dirname,'..','index.html'));
}
function px(a, x, y){ return a.pixel('canvas', x, y); }

// Model a touch interaction: touchstart on the canvas paints a pixel.
function touch(a, startPx, startPy, endPx, endPy){
  const c = a.document.getElementById('canvas');
  const mk = (type) => ({
    clientX: (type==='touchend'?endPx:startPx),
    clientY: (type==='touchend'?endPy:startPy),
    touches:[{clientX:(type==='touchend'?endPx:startPx),clientY:(type==='touchend'?endPy:startPy)}],
    changedTouches:[{clientX:(type==='touchend'?endPx:startPx),clientY:(type==='touchend'?endPy:startPy)}],
    pointerId:1, pointerType:'touch', isPrimary:true
  });
  a.event(c,'touchstart',mk('touchstart'));
  if(startPx!==endPx || startPy!==endPy){
    a.event(c,'touchmove',mk('touchmove'));
  }
  a.event(c,'touchend',mk('touchend'));
}

test('a touch draw on the canvas paints a pixel', ()=>{
  const a = loadApp();
  touch(a, 6, 6, 6, 6);
  assert.deepStrictEqual(px(a, 6, 6), [0, 0, 0, 255]);
});

test('touch painting and mouse painting share the same canvas', ()=>{
  const a = loadApp();
  touch(a, 2, 2, 2, 2);
  const c = a.document.getElementById('canvas');
  a.event(c,'mousedown',{clientX:8,clientY:8,button:0,buttons:1});
  a.event(c,'mouseup',{clientX:8,clientY:8,button:0,buttons:0});
  assert.deepStrictEqual(px(a, 2, 2), [0, 0, 0, 255]);
  assert.deepStrictEqual(px(a, 8, 8), [0, 0, 0, 255]);
});

test('pressing B activates the brush tool', ()=>{
  const a = loadApp();
  a.event(a.document.getElementById('btn-eraser'),'click',{});
  assert.strictEqual(a.document.getElementById('btn-eraser').classList.contains('active'), true);
  a.event(a.document,'keydown',{key:'B'});
  assert.strictEqual(a.document.getElementById('btn-brush').classList.contains('active'), true);
  assert.strictEqual(a.document.getElementById('btn-eraser').classList.contains('active'), false);
});

test('pressing E activates the eraser tool', ()=>{
  const a = loadApp();
  a.event(a.document,'keydown',{key:'E'});
  assert.strictEqual(a.document.getElementById('btn-eraser').classList.contains('active'), true);
});

test('Ctrl+Z undoes a paint via keyboard', ()=>{
  const a = loadApp();
  const c = a.document.getElementById('canvas');
  a.event(c,'mousedown',{clientX:3,clientY:3,button:0,buttons:1});
  a.event(c,'mouseup',{clientX:3,clientY:3,button:0,buttons:0});
  a.event(a.document,'keydown',{key:'z',ctrlKey:true});
  assert.deepStrictEqual(px(a, 3, 3), [0, 0, 0, 0]);
});

test('Ctrl+Shift+Z redoes via keyboard', ()=>{
  const a = loadApp();
  const c = a.document.getElementById('canvas');
  a.event(c,'mousedown',{clientX:3,clientY:3,button:0,buttons:1});
  a.event(c,'mouseup',{clientX:3,clientY:3,button:0,buttons:0});
  a.event(a.document,'keydown',{key:'z',ctrlKey:true});
  a.event(a.document,'keydown',{key:'z',ctrlKey:true,shiftKey:true});
  assert.deepStrictEqual(px(a, 3, 3), [0, 0, 0, 255]);
});
