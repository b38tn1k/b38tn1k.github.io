const {test}=require('node:test');
const assert=require('node:assert');
const {load}=require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime-v2.cjs');
const path=require('path');

function loadApp(){
  return load(path.join(__dirname,'..','index.html'));
}

test('app boots with no console errors', ()=>{
  const a = loadApp();
  assert.strictEqual(a.errors.length, 0, 'expected no runtime errors');
});

test('canvas exists and defaults to 16x16', ()=>{
  const a = loadApp();
  const canvas = a.document.getElementById('canvas');
  assert.strictEqual(canvas.width, 16);
  assert.strictEqual(canvas.height, 16);
});

test('a full palette of 18 swatches is rendered', ()=>{
  const a = loadApp();
  const swatches = a.document.querySelectorAll('#palette .swatch');
  assert.strictEqual(swatches.length, 18);
});

test('toolbar buttons are present', ()=>{
  const a = loadApp();
  for(const id of ['btn-brush','btn-eraser','btn-undo','btn-redo','btn-clear','btn-export','btn-in','btn-out','btn-apply-size']){
    assert.ok(a.document.getElementById(id), 'missing button '+id);
  }
});
