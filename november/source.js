var G;
var loaders = {};

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
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

  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
  testNPC = new Drawable(w, h, r, G.dims.w * 0.7, G.dims.cy);
  testNPC.setAnimation(8, G.loaders['walk'], [0, 4], [1, 2, 3, 5, 6, 7]);
  testNPC.update();
  
  testDialog = new Dialog(G.dims.cy + 20, 50);
  testDialog.updateCoords('NPC1', testNPC);
  testDialog.addDialogEvent('NPC1', 'What\'s the hurry, buddy?');
  testDialog.addDialogEvent('PC', 'I can\'t stop! I have to keep going.');
  testDialog.addDialogEvent('NPC1', 'I\'m so hungry! Please, do you have any food?');
  let parEvent = testDialog.addDialogEvent('PC', '', ['Here you go.', 'I\'m hungry too.', 'No!']);
  let thankyou = testDialog.addChildDialogEvent(parEvent, 'NPC1', 'Thank you!');
  testDialog.addChildDialogEvent(thankyou, 'PC', 'You are welcome!');
  let sorry = testDialog.addChildDialogEvent(parEvent, 'NPC1', 'That\'s ok. Don\'t worry about me');
  testDialog.addChildDialogEvent(sorry, 'PC', 'I wish I had food.');
  let selfish = testDialog.addChildDialogEvent(parEvent, 'NPC1', 'Selfish much?');
  testDialog.addChildDialogEvent(selfish, 'PC', 'I have a family!');
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
  testDialog.update(testSprite, G.inputs);
  testDialog.draw();


  let a = visualCheckInputs();

}
