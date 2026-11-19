// Behavior tests for tray geometry (pure math, no browser needed).
const assert=require('assert');
const {test}=require('node:test');
const path=require('path');

// Load the tray geometry module embedded in index.html by extracting <script id="tray-engine">.
function loadEngine(){
  const fs=require('fs');
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const m=html.match(/<script id="tray-engine"[^>]*>([\s\S]*?)<\/script>/);
  if(!m) throw new Error('tray-engine script block not found in index.html');
  const code=m[1];
  const wrapper=new Function('window', code + '\n;window.____ret=window.__trayEngine;');
  const win={};
  wrapper(win);
  return win.____ret;
}

const R=3, C=2;

test('default dimensions produce expected interior', ()=>{
  const E=loadEngine();
  const g=E.compute(180,120,30,3,2,2,3);
  assert.equal(g.outerLength,180);
  assert.equal(g.outerWidth,120);
  assert.equal(g.outerHeight,30);
  assert.strictEqual(g.interiorLength,180-2*2);
  assert.strictEqual(g.interiorWidth,120-2*2);
  assert.strictEqual(g.floorThickness,3);
});

test('compartment length divides interior minus internal walls', ()=>{
  const E=loadEngine();
  // compute(L,W,H,R,C,tw,th); columns C=3 along length (5th arg)
  const g=E.compute(180,120,30,2,3,2,3);
  const expected=(180-2*2-(3-1)*2)/3; // interior - (C-1) internal walls, /C
  assert.ok(Math.abs(g.compartmentLength-expected)<1e-9);
});

test('compartment depth is interior height minus top wall', ()=>{
  const E=loadEngine();
  const g=E.compute(180,120,30,3,2,2,3);
  assert.strictEqual(g.compartmentDepth,(30-3)-2);
});

test('compartment count equals rows*columns', ()=>{
  const E=loadEngine();
  const g=E.compute(180,120,30,3,2,2,3);
  assert.strictEqual(g.compartmentCount,R*C);
});

test('compartment volume is positive and consistent', ()=>{
  const E=loadEngine();
  const g=E.compute(200,150,40,4,3,2.5,4);
  const vol=g.compartmentLength*g.compartmentWidth*g.compartmentDepth;
  assert.ok(vol>0);
  assert.strictEqual(g.compartmentCount,4*3);
});

test('clamps non-physical negative values', ()=>{
  const E=loadEngine();
  const g=E.compute(180,-5,30,3,2,2,3);
  assert.ok(g.outerWidth>=0);
});

test('compartment sizes shrink as wall thickness grows', ()=>{
  const E=loadEngine();
  const a=E.compute(180,120,30,3,2,2,3);
  const b=E.compute(180,120,30,3,2,5,3);
  assert.ok(b.compartmentLength<a.compartmentLength);
  assert.ok(b.compartmentWidth<a.compartmentWidth);
});

test('more columns give narrower compartments', ()=>{
  const E=loadEngine();
  const a=E.compute(180,120,30,2,3,2,3); // 3 columns
  const b=E.compute(180,120,30,2,6,2,3); // 6 columns
  assert.ok(b.compartmentLength<a.compartmentLength);
});
