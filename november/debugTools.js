class DebugTools {
  constructor() {
    let tri = createGraphics(25, 20);
    tri.fill(gColors[52]);
    tri.noStroke();
    tri.triangle(0, tri.height/2, tri.width * 0.8, tri.height/2, tri.width, 0);
    tri.triangle(0, tri.height/2, tri.width * 0.8, tri.height/2, tri.width, tri.height);
    this.compass = createGraphics(50, 50);
    this.compass.fill(gColors[3]);
    this.compass.strokeWeight(3);
    this.compass.stroke(gColors[30]);
    this.compass.circle(25, 25, 45);
    this.compass.imageMode(CENTER);
    this.compass.image(tri, 25, 25);
    this.compassx = gTransforms.w - 100;
    this.compassy = gTransforms.h - 70;
  }
};

function bigCText(myString, size = 64, canvas=gGLayers.base.g, c=gColors[10]) {
  canvas.textSize(size);
  if ( String(canvas.elt.id).includes('defaultCanvas')) {
    fill(c);
  } else {
    canvas.fill(c);
  }
  canvas.textAlign(CENTER, CENTER);
  canvas.text(myString, canvas.width/2, canvas.height/2);
}

function drawTestPattern(canvas=gGLayers.base.g) {
  canvas.noStroke();
  canvas.fill(gColors[22]);
  canvas.circle(0, 0, 40);
  canvas.circle(canvas.width, 0, 40);
  canvas.circle(canvas.width, canvas.height, 40);
  canvas.circle(canvas.width/2, canvas.height/2, 40);
  canvas.circle(0, canvas.height, 40);
  canvas.fill(gColors[42]);
  canvas.circle(0, 0, 20);
  canvas.circle(canvas.width, 0, 20);
  canvas.circle(canvas.width, canvas.height, 20);
  canvas.circle(canvas.width/2, canvas.height/2, 20);
  canvas.circle(0, canvas.height, 20);
}

function visualUserAgentCheck(canvas=gGLayers.base.g){
  drawTestPattern(canvas);
  if (checkIsTouchDevice() === true){
    bigCText('MOBILE-ISH', 64, canvas);
  } else {
    bigCText('NOT MOBILE', 64, canvas);
  }
}

function visualCheckLayers(addFakes = false) {
  if (addFakes == true) {
    gGLayers.newLayer(0, 'L3');
    gGLayers.newLayer(0, 'L2');
    gGLayers.newLayer(2, 'L4');
    gGLayers.newLayer(0, 'L0');
    gGLayers.newLayer(1, 'L1');
  }
  let x = 100;
  let y = 100;
  let r = 50;
  let ts = 32;
  let c = 10;
  gGLayers.base.g.fill(gColors[c]);
  gGLayers.base.g.circle(x, y, r);
  gGLayers.base.g.fill(gColors[c + 10]);
  gGLayers.base.g.textAlign(CENTER, CENTER);
  gGLayers.base.g.textSize(ts);
  gGLayers.base.g.text('B', x, y);
  for (let i = 0; i < gGLayers.layers.length; i++) {
    y += 40;
    c += 2;
    let myL = gGLayers.layers[i]
    gGLayers.base.g.fill(gColors[c]);
    gGLayers.base.g.circle(x, y, r);
    gGLayers.base.g.fill(gColors[c + 10]);
    gGLayers.base.g.textAlign(CENTER, CENTER);
    gGLayers.base.g.textSize(ts);
    gGLayers.base.g.text(gGLayers.getLayerName(i), x, y);
  }
}

function visualCheckInputs(myInp=gInputs) {
  if (myInp.on == true) {
    fill(gColors[22]);
  } else {
    fill(gColors[12]);
  }
  push();
  let [x, y] = [gDebugTools.compassx, gDebugTools.compassy];
  // [x, y] = [100, 100];
  [x, y] = gTransforms.transformCart(x, y);
  translate(x, y);
  rotate(myInp.angleTo(x, y))
  image(gDebugTools.compass, 0, 0);
  pop();
  return myInp.angleTo(x, y);
}

function drawRoad(){
  // make the world brown and sad looking;
  let r = gGLayers.newLayer(0, 'road');
  r.g.background(gColors[36]);
  // add a road
  r.g.fill(gColors[35]);
  r.g.noStroke();
  r.g.rectMode(CENTER);
  r.g.rect(gGLayers.base.g.width/2, gGLayers.base.g.height/2, 7*gGLayers.base.g.width/12, gGLayers.base.g.height * 2);
}

function drawBorder() {
  let b = gGLayers.newLayer(0, 'border');
  b.g.fill(gColors[0]);
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

function addSprite(sprt = gLoaders['dumsprite']){
  let ml = gGLayers.newLayer(0, 'sprite');
  ml.g = sprt;
  [ml.tx, ml.ty] = gTransforms.transformCart((gTransforms.w - ml.g.width)/2, 3*gTransforms.h/4);
  ml = gGLayers.newLayer(0, 'spritesays');
  [ml.tx, ml.ty] = gTransforms.transformCart((gTransforms.w)/2, 3*gTransforms.h/4);
  ml.ty -= 20;
  ml.g.textAlign(LEFT, TOP);
  ml.g.textSize(12);
}

function updateSpritePos(myInp=gInputs) {
  if (myInp.on == true) {
    let [x, y] = [gDebugTools.compassx, gDebugTools.compassy];
    // [x, y] = [100, 100];
    [x, y] = gTransforms.transformCart(x, y);
    let a = myInp.angleTo(x, y);
    if (a > PI) {
      a -= PI;
    }
    let ml = gGLayers.getLayer('sprite');
    let sps = gGLayers.getLayer('spritesays');
    sps.tx = ml.tx;
    sps.ty = ml.ty - 20;
    sps.g.clear();
    //7*gGLayers.base.g.width/12
    if (a < 0) {
      sps.g.text('I\'m sorry, I can\'t go back', 0, 0);
      // console.log('I\'m sorry, I can\'t go back');
    } else {
      ml.tx -= cos(a) * 0.5;
      ml.ty -= sin(a) * 0.5;
      // ml.tx =( a * 7*gGLayers.base.g.width/12) + (5 * gGLayers.base.g.width/24) - ml.g.width/2;
    }
  }
}

function vignette(){
  let vg = gGLayers.newLayer(0, 'vignette');
  vg.g.noFill();
  let c1 = color(0, 0, 0, 0);
  let c2 = color(0, 0, 0, 255);
  let border = 1.1;
  let w = gGLayers.w * border;
  let h = gGLayers.h * border;
  let br = min(w, h) / max(gGLayers.w, gGLayers.h);
  while (min(w, h) < max(gGLayers.w, gGLayers.h)) {
    let ratio = (min(w, h) / max(gGLayers.w, gGLayers.h)) - br;
    vg.g.stroke(lerpColor(c1, c2, ratio));
    vg.g.ellipse(gGLayers.cx, gGLayers.cy, w, h);
    w += 1;
    h += 1;
  }


}
