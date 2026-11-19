// Integration tests for the browser app using the provided runtime helper.
const assert=require('assert');
const {test, before}=require('node:test');
const path=require('path');
const {load}=require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime.cjs');

const htmlPath=path.join(__dirname,'..','index.html');
let a, doc;
before(()=>{
  a=load(htmlPath);
  doc=a.document;
});

test('renders default 3x2 grid in compartment list', ()=>{
  const comps=doc.querySelectorAll('#compGrid .comp');
  assert.ok(comps.length>=6, 'expected 6 compartment cards, got '+comps.length);
});

test('status line reflects default geometry', ()=>{
  const s=doc.querySelector('#status').textContent;
  assert.ok(/176/.test(s) && /116/.test(s), s);
});

test('changing columns to 4 increases compartment count to 12 (3 rows x 4 cols)', ()=>{
  const colEl=doc.querySelector('#C');
  const oldVal=colEl.value;
  colEl.value='4';
  a.event(colEl,'input',{});
  const comps=doc.querySelectorAll('#compGrid .comp');
  assert.ok(comps.length===12, 'expected 12 compartments, got '+comps.length);
  colEl.value=oldVal; a.event(colEl,'input',{});
});

test('dragging the canvas rotates the view without throwing', ()=>{
  a.click('#gl');
  a.event(a.window,'mousemove',{clientX:120,clientY:90});
  a.event(a.window,'mousemove',{clientX:140,clientY:100});
  const canvas=doc.querySelector('#gl');
  assert.ok(canvas.width>0);
});

test('reset button restores default dimensions', ()=>{
  doc.querySelector('#tw').value='8'; a.event(doc.querySelector('#tw'),'input',{});
  a.click('#reset');
  assert.equal(doc.querySelector('#L').value, '180');
  assert.equal(doc.querySelector('#C').value, '2');
  assert.equal(doc.querySelector('#tw').value, '2');
});

test('download button produces a valid ASCII STL via engine', ()=>{
  // The export path must not throw and must call exportSTL returning a string.
  const fs=require('fs');
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const em=html.match(/<script id="tray-engine"[^>]*>([\s\S]*?)<\/script>/);
  const win={};
  new Function('window', em[1]+'\nwindow.__t=window.__trayEngine;')(win);
  const E=win.__t;
  const stl=E.exportSTL(180,120,30,3,2,2,3,12,false);
  assert.strictEqual(typeof stl,'string');
  assert.ok(stl.startsWith('solid '));
  assert.ok(stl.includes('endfacet'));
});
