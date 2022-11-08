var G;
var loaders = {};

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function keyPressed() {
  if (key == 's') {
    saveImage();
  }
}

function saveImage() {
  var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  save(timestamp+".png");
}

var testSprite;
var testNPC;
var testDialog;

function setupScreen() {
  resizeCanvas(windowWidth, windowHeight);
  G.updated = true;
  G.dims = new Dimensions();
  G.gLayers = new LayerHandler(G.dims);
  G.inputs = new InputHandler(G.dims);
  G.debugTools = new DebugTools();
  G.gLayers.clear();

  dummyLayout();
}

function preload() {
  G = new Globals();
  let c = loadStrings('NES.hex', function(){for (let i = 0; i < c.length; i++) {G.colors.push(color('#' + c[i]));};});
  G.loaders['dumsprite'] = loadImage('assets/dummysprite.png');
  G.loaders['walk'] = loadImage('assets/walk3.png');
  G.loaders['font'] = loadFont('assets/Lato-Regular.ttf');
}

function setup() {
  createCanvas(0, 0, P2D);
  setupScreen();
  imageMode(CENTER);
  rectMode(CENTER);
  pixelDensity(1);
  frameRate(30);
}

function draw() {
  G.inputs.update();
  G.gLayers.draw();
  if (testDialog.pauseForOptions == false) {
    testSprite.update();
    updateSpritePos();
  }

  image(testSprite.g, testSprite.tx, testSprite.ty);
  image(testNPC.g, testNPC.tx, testNPC.ty);
  // console.log(testNPC.tx)
  circle(testNPC.tx, testNPC.ty, 10);
  testDialog.update(testSprite, G.inputs);
  testDialog.draw();
  if (testDialog.eventTrigger == true) {
    console.log(testDialog.eventID);
  }
  let a = visualCheckInputs();

}
