var G;
var loaders = {};

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

var testSprite;

function setupScreen() {
  resizeCanvas(windowWidth, windowHeight);
  G.updated = true;
  G.dims = new Dimensions();
  G.gLayers = new LayerHandler(G.dims);
  G.inputs = new InputHandler(G.dims.w - 100, G.dims.h - 100);
  G.debugTools = new DebugTools();
  G.gLayers.clear();

  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
  testSprite = new Drawable(w, h, r, tx, G.dims.h - 100, 0);
  testSprite.setAnimation(8, G.loaders['walk'], [0, 4], [1, 2, 3, 5, 6, 7]);

  // visualCheckLayers(true);
  drawBorder();
  vignette();
  drawRoad();
}

function preload() {
  G = new Globals();
  let c = loadStrings('NES.hex', function(){for (let i = 0; i < c.length; i++) {G.colors.push(color('#' + c[i]));};});
  G.loaders['dumsprite'] = loadImage('assets/dummysprite.png');
  G.loaders['walk'] = loadImage('assets/walk3.png');
}

function setup() {
  createCanvas(0, 0, P2D);
  setupScreen();
  imageMode(CENTER);
  rectMode(CENTER);
  pixelDensity(1);
}

function draw() {
  clear();
  G.inputs.update();
  G.gLayers.draw();
  testSprite.update();
  image(testSprite.g, testSprite.tx, testSprite.ty);
  let a = visualCheckInputs();
  updateSpritePos();
}
