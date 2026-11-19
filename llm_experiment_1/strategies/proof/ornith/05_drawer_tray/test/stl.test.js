// Behavior tests for the STL export geometry.
const assert=require('assert');
const {test}=require('node:test');
const path=require('path');

function loadEngine(){
  const fs=require('fs');
  const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
  const m=html.match(/<script id="tray-engine"[^>]*>([\s\S]*?)<\/script>/);
  if(!m) throw new Error('tray-engine script block not found in index.html');
  const wrapper=new Function('window', m[1] + '\n;window.____ret=window.__trayEngine;');
  const win={};
  wrapper(win);
  return win.____ret;
}

// exportSTL signature: exportSTL(L,W,H,R,C,tw,th,subdivisions,binary)
function ascii(...a){ return a[0].exportSTL(...a.slice(1), false); }
function binary(...a){ return a[0].exportSTL(...a.slice(1), true); }
function countFacets(s){ return (s.match(/(^|\s)facet\s/g)||[]).length; }
function countVertices(s){ return (s.match(/(^|\s)vertex\s/g)||[]).length; }

test('exportSTL ASCII returns a String with solid header', ()=>{
  const E=loadEngine();
  const stl=ascii(E,180,120,30,3,2,2,3,12);
  assert.strictEqual(typeof stl,'string');
  assert.ok(stl.startsWith('solid '));
  assert.ok(stl.includes('endsolid'));
});

test('ASCII triangle count equals cells * tris-per-cell * sub*(sub+1)/2', ()=>{
  const E=loadEngine();
  const sub=12;
  const stl=ascii(E,180,120,30,3,2,2,3,sub);
  const cells=3*2;          // R*C
  const trisPerCell=12;     // cellVerts() defines 12 triangles
  const perTri=sub*(sub+1)/2;
  const expected=cells*trisPerCell*perTri;
  assert.strictEqual(countFacets(stl), expected);
});

test('ASCII vertex count equals 3x triangle count', ()=>{
  const E=loadEngine();
  const sub=8;
  const stl=ascii(E,180,120,30,3,2,2,3,sub);
  assert.strictEqual(countVertices(stl), 3*countFacets(stl));
});

test('binary STL header triangle count equals ASCII facet count', ()=>{
  const E=loadEngine();
  const sub=10;
  const asciiStr=ascii(E,200,150,40,4,3,2.5,4,sub);
  const bin=binary(E,200,150,40,4,3,2.5,4,sub);
  assert.strictEqual(typeof asciiStr,'string');
  assert.ok(Buffer.isBuffer(bin));
  const asciiTris=countFacets(asciiStr);
  const ntri=bin.readUInt32LE(80);
  assert.strictEqual(ntri, asciiTris);
  assert.strictEqual(bin.length, 80+ntri*50);
});

test('binary STL is far shorter than ASCII for the same model', ()=>{
  const E=loadEngine();
  const asciiStr=ascii(E,180,120,30,3,2,2,3,12);
  const bin=binary(E,180,120,30,3,2,2,3,12);
  assert.ok(bin.length<asciiStr.length);
  assert.strictEqual(bin.length, 80+(bin.readUInt32LE(80))*50);
});

test('mesh is watertight: mean oriented normal magnitude ~ 0', ()=>{
  const E=loadEngine();
  const stl=ascii(E,200,150,40,4,3,2.5,4,6);
  const re=/facet normal ([-\d.eE+]+) ([-\d.eE+]+) ([-\d.eE+]+)/g;
  let sx=0,sy=0,sz=0,n=0; let mm;
  while((mm=re.exec(stl))){ const a=parseFloat(mm[1]),b=parseFloat(mm[2]),c=parseFloat(mm[3]); sx+=a;sy+=b;sz+=c;n++; }
  const mag=Math.hypot(sx,sy,sz)/Math.max(1,n);
  assert.ok(n>0);
  assert.ok(mag<1e-2, 'mean normal magnitude '+mag+' should be ~0 for a closed surface');
});
