class DebugTools {
  constructor() {
    let tri = createGraphics(25, 20);
    tri.fill(G.colors[52]);
    tri.noStroke();
    tri.triangle(0, tri.height/2, tri.width * 0.8, tri.height/2, tri.width, 0);
    tri.triangle(0, tri.height/2, tri.width * 0.8, tri.height/2, tri.width, tri.height);
    this.compass = createGraphics(50, 50);
    this.compass.fill(G.colors[3]);
    this.compass.strokeWeight(3);
    this.compass.stroke(G.colors[30]);
    this.compass.circle(25, 25, 45);
    this.compass.imageMode(CENTER);
    this.compass.image(tri, 25, 25);
    this.compassx = G.inputs.originX;
    this.compassy = G.inputs.originY;
  }
};

function bigCText(myString, size = 64, canvas, c=G.colors[10]) {
  canvas.textSize(size);
  if ( String(canvas.elt.id).includes('defaultCanvas')) {
    fill(c);
  } else {
    canvas.fill(c);
  }
  canvas.textAlign(CENTER, CENTER);
  canvas.text(myString, canvas.width/2, canvas.height/2);
}

function drawTestPattern(canvas) {
  canvas.noStroke();
  canvas.fill(G.colors[22]);
  canvas.circle(0, 0, 40);
  canvas.circle(canvas.width, 0, 40);
  canvas.circle(canvas.width, canvas.height, 40);
  canvas.circle(canvas.width/2, canvas.height/2, 40);
  canvas.circle(0, canvas.height, 40);
  canvas.fill(G.colors[42]);
  canvas.circle(0, 0, 20);
  canvas.circle(canvas.width, 0, 20);
  canvas.circle(canvas.width, canvas.height, 20);
  canvas.circle(canvas.width/2, canvas.height/2, 20);
  canvas.circle(0, canvas.height, 20);
}

function visualUserAgentCheck(canvas){
  drawTestPattern(canvas);
  if (checkIsTouchDevice() === true){
    bigCText('MOBILE-ISH', 64, canvas);
  } else {
    bigCText('NOT MOBILE', 64, canvas);
  }
}

function visualCheckLayers(addFakes = false) {
  if (addFakes == true) {
    G.gLayers.newLayer(0, 'L3');
    G.gLayers.newLayer(0, 'L2');
    G.gLayers.newLayer(2, 'L4');
    G.gLayers.newLayer(0, 'L0');
    G.gLayers.newLayer(1, 'L1');
  }
  let x = 100;
  let y = 100;
  let r = 50;
  let ts = 32;
  let c = 10;
  for (let i = 0; i < G.gLayers.layers.length; i++) {
    y += 40;
    c += 2;
    let myL = G.gLayers.layers[i]
    G.gLayers.layers[i].g.fill(G.colors[c]);
    G.gLayers.layers[i].g.circle(x, y, r);
    G.gLayers.layers[i].g.fill(G.colors[c + 10]);
    G.gLayers.layers[i].g.textAlign(CENTER, CENTER);
    G.gLayers.layers[i].g.textSize(ts);
    G.gLayers.layers[i].g.text(G.gLayers.getLayerName(i), x, y);
  }
}

function visualCheckInputs(myInp=G.inputs) {
  if (myInp.on == true) {
    fill(G.colors[22]);
  } else {
    fill(G.colors[12]);
  }
  push();
  let [x, y] = [G.debugTools.compassx, G.debugTools.compassy];
  translate(x, y);
  rotate(myInp.angleTo(x, y))
  image(G.debugTools.compass, 0, 0);
  pop();
  return myInp.angleTo(x, y);
}

function drawRoad(){
  // make the world brown and sad looking;
  let r = G.gLayers.newLayer(0, 'road');
  r.g.background(G.colors[36]);
  // add a road
  r.g.fill(G.colors[35]);
  r.g.noStroke();
  r.g.rectMode(CENTER);
  r.g.rect(G.dims.cx, G.dims.cy, 7*G.dims.w/12, G.dims.h * 2);
}

function drawBorder() {
  let b = G.gLayers.newLayer(0, 'border');
  b.g.fill(G.colors[0]);
  b.g.noStroke();
  b.g.rectMode(CENTER);
  let r = 5;
  let w = b.g.width;
  let h = b.g.height;
  let wOn2 = b.g.width/2;
  let hOn2 = b.g.height/2;
  let flwr = floor((w)/r);
  let flhr = floor((h)/r);
  flwr -= 1;
  brh = (w - (flwr * r)) * 2;
  brv = (h - (flhr * r)) * 2;
  b.g.rect(wOn2, brh/2, w, brh);
  b.g.rect(wOn2, h-brh/2, w, brh);
  b.g.rect(brv/2, hOn2, brv, h);
  b.g.rect(w-brv/2, hOn2, brv, h);
  let rd = r;
  let v = 0;
  let off = 0;
  for (let i = 0; i < r; i++) {
    for (let i = brv + r/2; i < w; i += 2*r) {
      b.g.square(i + off, brh + r/2 + v, rd);
      b.g.square(i + off, h - (brh + r/2 + v), rd);
    }
    for (let i = brh/2 - r/2; i < h; i += 2*r) {
      b.g.square(brv + r/2 + v, i + off, rd);
      b.g.square(w - (brv + r/2 + v), i + off, rd);
    }
    v += r;
    if (off == 0) {
      off = r;
    } else {
      off = 0;
    }
    rd -= 1;
  }
}

function updateSpritePos(myInp=G.inputs) {
  if (myInp.on == true) {
    testSprite.play = true;
    let uv = G.inputs.getUnitVectorFromOrigin();
    let speed = 0.3;
    if (testSprite.isMoveFrame() == true) {
      testSprite.tx += uv[0] * speed;//-= cos(a) * 0.5;
      testSprite.ty += uv[1]  * speed;//-= sin(a) * 0.5;
    }
  } else {
    testSprite.stopAtOne = true;
  }
}

function vignette(){
  let vg = G.gLayers.newLayer(100, 'vignette');
  vg.g.noFill();
  vg.g.strokeWeight(1);
  let c1 = color(0, 0, 0, 0);
  let c2 = color(255, 0, 0, 255);
  let border = 1.1;
  let w = G.dims.w * border;
  let h = G.dims.h * border;
  let br = min(w, h) / max(G.dims.w, G.dims.h);
  while (min(w, h) < max(G.dims.w, G.dims.h)) {
    let ratio = (min(w, h) / max(G.dims.w, G.dims.h)) - br;
    vg.g.stroke(lerpColor(c1, c2, ratio));
    vg.g.ellipse(G.dims.cx, G.dims.cy, w, h);
    w += 1;
    h += 1;
  }
}
