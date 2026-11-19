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
function undo(a){ a.event(a.document.getElementById('btn-undo'),'click',{}); }
function redo(a){ a.event(a.document.getElementById('btn-redo'),'click',{}); }

test('initially undo is disabled', ()=>{
  const a = loadApp();
  assert.strictEqual(a.document.getElementById('btn-undo').disabled, true);
});

test('a mark creates an undoable step and undo restores the blank canvas', ()=>{
  const a = loadApp();
  paint(a, 3, 3);
  assert.strictEqual(a.document.getElementById('btn-undo').disabled, false);
  undo(a);
  assert.deepStrictEqual(px(a, 3, 3), [0, 0, 0, 0]);
});

test('redo re-applies the undone mark', ()=>{
  const a = loadApp();
  paint(a, 3, 3);
  undo(a);
  assert.strictEqual(a.document.getElementById('btn-redo').disabled, false);
  redo(a);
  assert.deepStrictEqual(px(a, 3, 3), [0, 0, 0, 255]);
});

test('two sequential marks can be undone one at a time', ()=>{
  const a = loadApp();
  paint(a, 2, 2);
  paint(a, 8, 8);
  assert.deepStrictEqual(px(a, 8, 8), [0, 0, 0, 255]);
  undo(a);
  assert.deepStrictEqual(px(a, 8, 8), [0, 0, 0, 0]);
  assert.deepStrictEqual(px(a, 2, 2), [0, 0, 0, 255]);
  undo(a);
  assert.deepStrictEqual(px(a, 2, 2), [0, 0, 0, 0]);
  redo(a);
  assert.deepStrictEqual(px(a, 2, 2), [0, 0, 0, 255]);
});
