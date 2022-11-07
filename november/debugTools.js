class DebugTools {
  constructor() {
    let tri = createGraphics(25, 20);
    tri.fill(G.colors[0]);
    tri.noStroke();
    tri.triangle(0, tri.height/2, tri.width * 0.8, tri.height/2, tri.width, 0);
    tri.triangle(0, tri.height/2, tri.width * 0.8, tri.height/2, tri.width, tri.height);
    this.compass = createGraphics(50, 50);
    this.compass.fill(G.colors[1]);
    this.compass.strokeWeight(3);
    this.compass.stroke(G.colors[0]);
    this.compass.circle(25, 25, 45);
    this.compass.imageMode(CENTER);
    this.compass.image(tri, 25, 25);
    this.compassx = G.dims.w - 100;
    this.compassy = G.dims.h - 100;
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

function dummyLayout() {
  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
  testSprite = new Drawable(w, h, r, tx, G.dims.h - 100, 0);
  testSprite.setAnimation(8, G.loaders['walk'], [0, 4], [1, 2, 3, 5, 6, 7]);
  let b = G.gLayers.newLayer(100, 'border');
  pixelBorder(b);
  let bg = G.gLayers.newLayer(0, 'background');
  bg.g.background(255, 255, 255);
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
  push();
  let [x, y] = [G.debugTools.compassx, G.debugTools.compassy];
  translate(x, y);
  // rotate(myInp.angleTo(x, y))

  rotate(myInp.angleTo(myInp.originX, myInp.originY));
  image(G.debugTools.compass, 0, 0);
  pop();
  return myInp.angleTo(x, y);
}

function updateSpritePos(myInp=G.inputs) {
  if (myInp.on == true) {
    testSprite.play = true;
    let uv = G.inputs.getUnitVectorFromOrigin();
    let speed = 1;
    if (testSprite.isMoveFrame() == true) {
      testSprite.tx += uv[0] * speed;//-= cos(a) * 0.5;
      testSprite.ty += uv[1]  * speed;//-= sin(a) * 0.5;
    }
  } else {
    testSprite.stopAtOne = true;
  }
}
