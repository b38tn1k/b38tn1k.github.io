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
  gGLayers.clear();
  visualUserAgentCheck();
  visualCheckLayers(true);

}

function preload() {
  let c = loadStrings('NES.hex', function(){for (let i = 0; i < c.length; i++) {gColors.push(color('#' + c[i]));};});
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
  pixelDensity(1);
}

function draw() {
  if (gUpdated == true) {
    gGLayers.draw();
    gUpdated = false;
  }
}
