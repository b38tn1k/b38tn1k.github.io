var testWeb;

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  testWeb.mouseClickEvent(mouseX, mouseY);
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
}

function setupSim() {
  testWeb = new spWeb();
  let parent = testWeb.addStrand(new Particle(100, height-100, 0, true), new Particle(width-100, 100, 0, true));
  testWeb.addStrand(new Particle(width-100, height-100, 0, true), parent.particles[5]);
}

function setup() {
  setupScreen();
  setupSim();
}

function draw() {
  clear();
  testWeb.update();
  testWeb.draw();
}
