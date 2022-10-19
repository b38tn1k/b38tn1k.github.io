
var gps; //location data source
var debugDiv;

function windowResized() {
  setupScreen();
}

function mousePressed() {
  console.log(mouseX, mouseY);
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
}

function setup() {
  gps = new lgeGPSStream();
  setupScreen();
  // testing stuff
  debugDiv = createDiv('hi');
  debugDiv.position(10, 10);
}

function draw() {
  frameRate(1);
  gps.update();
  debugDiv.html('LAT: ' + String(gps.lat) + '<br>LON: ' + String(gps.lon));
}
