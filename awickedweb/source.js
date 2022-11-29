

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  testWeb.findClosestParticle(mouseX, mouseY);
  babyWeb.findClosestParticle(mouseX, mouseY);
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
}

var testWeb;
function setupSim() {
  testWeb = new Strand(new Particle(100, height-100, 0, true), new Particle(width-100, 100, 0, true));
  testWeb.createParticles();
  testWeb.createSpringMesh();
  babyWeb = new Strand(new Particle(width-100, height-100, 0, true), testWeb.particles[5]);
  babyWeb.createParticles();
  babyWeb.createSpringMesh();
}

function setup() {
  setupScreen();
  setupSim();
}

function draw() {
  clear();
  testWeb.update();
  testWeb.drawStartEnd();
  testWeb.draw2DCurve();
  testWeb.draw2DParticles();
  babyWeb.update();
  babyWeb.drawStartEnd();
  babyWeb.draw2DCurve();
  babyWeb.draw2DParticles();

}
