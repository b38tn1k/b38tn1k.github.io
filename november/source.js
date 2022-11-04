function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function setupScreen() {
  resizeCanvas(windowWidth, windowHeight);
  gUpdated = true;
  gTransforms = new Transforms(checkIsTouchDevice());
  gGLayers = new LayerHandler(gTransforms);
  gInputs = new InputHandler(gTransforms);
  gDebugTools = new DebugTools();
  gGLayers.clear();

  addSprite();
  drawBorder();
  drawRoad();
  // visualUserAgentCheck();
  // visualCheckLayers(true);
}

function preload() {
  let c = loadStrings('NES.hex', function(){for (let i = 0; i < c.length; i++) {gColors.push(color('#' + c[i]));};});
  gLoaders['dumsprite'] = loadImage('assets/dummysprite.png');

}

function unpackColors(c) {
  for (let i = 0; i < c.length; i++) {
    gColors.push(color('#' + c[i]));
  }
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
  gGLayers.clear();
  gInputs.update();
  gGLayers.draw();
  let a = visualCheckInputs();
  updateSpritePos();
}
