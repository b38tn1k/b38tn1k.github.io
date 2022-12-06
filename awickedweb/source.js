var testWeb;
var JL;
var physicsDiv;
var CURSOR_IN_GAME_WINDOW = true;

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  if (CURSOR_IN_GAME_WINDOW == true) {
    testWeb.mouseClickEvent(mouseX, mouseY);
  }
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key == ' ') {
    testWeb.toggleDebug();
  }
}

function setupSim() {
  testWeb = new spWeb();
  JL = new TimedLog();
  // let parent = testWeb.addStrand(new Particle(100, height-100, 0, true), new Particle(width-100, 100, 0, true));
  // testWeb.addStrand(new Particle(width-100, height-100, 0, true), parent.particles[5]);
}

function setup() {
  setupScreen();
  setupSim();
  pixelDensity(1);
  createPhysicsDiv();
}

function draw() {
  clear();
  testWeb.update();
  testWeb.draw();
  JL.update();
  writePhysics(width - 120, 18);
}
