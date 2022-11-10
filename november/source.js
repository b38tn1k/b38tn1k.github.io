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

var testNPC;
var testDialog;

function setupScreen() {
  resizeCanvas(windowWidth, windowHeight);
  G.updated = true;
  G.dims = new Dimensions();
  G.gLayers = new LayerHandler(G.dims);
  G.inputs = new InputHandler(G.dims);
  G.UIElements = new UIElements();
  G.gLayers.clear();


  dummyLayout();
}

function preload() {
  G = new Globals();
  let c = loadStrings('assets/NES.hex', function(){for (let i = 0; i < c.length; i++) {G.colors.push(color('#' + c[i]));};});
  G.loaders['walk'] = loadImage('assets/walk4.png');
  G.loaders['slume-idle'] = loadImage('assets/BlueSlumeIdle.png');
  G.loaders['slume-death'] = loadImage('assets/BlueSlumeDeath.png');
  G.loaders['slume-death'] = loadImage('assets/BlueSlumeDeath.png');
  G.loaders['agulha'] = loadImage('assets/agulha.png');
  G.loaders['windrose'] = loadImage('assets/windrose.png');

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

  G.gLayers.clear();

  G.inputs.update();
  G.UIElements.update();
  G.player.update(testDialog, G.inputs);
  testNPC.update(testDialog, G.inputs);
  testDialog.update(G.player.current, G.inputs);

  if (testDialog.eventTrigger == true) {
    if (parseInt(testDialog.eventID) == 101) {
      testNPC.changeSequence(1, true);
    }
  }

  G.player.draw();
  testNPC.draw();
  testDialog.draw();
  G.gLayers.draw();
  G.UIElements.draw();

}
