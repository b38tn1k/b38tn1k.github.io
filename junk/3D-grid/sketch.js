
var cols, rows, terrain, valley;
var scl = 100;
var w = 5000;
var h = 5000;
var res = 0.05;
var amp = 1000;
var flying = 0;
var fSpeed = 0.01;
var bgRotate;
var bgTranslate = [];



function keyPressed() {
  if (key == ' ') {
    console.log('bang');
  }
  if (keyCode == DOWN_ARROW){

  return;
  }  else if (keyCode == LEFT_ARROW){

  return;
  }  else if (keyCode == UP_ARROW){

  return;
  }  else if (keyCode == RIGHT_ARROW){

  return;
  }
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {

}

function setupScreen() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
  w = windowWidth * 10;
  h = windowHeight * 20;
  bgTranslate = [-w / 2, -h * 0.9];
  bgRotate = PI/6;
  cols = w/scl;
  rows = h / scl
  terrain = [];
  for (let i = 0; i <= cols + 1; i ++) {
    terrain.push([]);
    for (let j = 0; j <= rows + 1; j ++) {
      terrain[i].push(0.0);
    }
  }
  valley = [];
  for (let x = 0; x < cols; x++) {
    valley.push(1.0 - sin(PI*(x/cols)) * 2 * amp);
  }

}

function setup() {

  frameRate(30);
  setupScreen();
}

function draw() {
  if (frameRate() < 25) {
    scl += 1;
    setupScreen();
  }
  console.log(scl, frameRate());
  background(0);
  flying -= fSpeed;
  let yoff = flying;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -amp, amp) + valley[x];
      xoff += res;
    }
    yoff += res;
  }
  push();
  fill(0)
  stroke(100, 255, 100);
  strokeWeight(2);
  rotateX(bgRotate);
  translate(bgTranslate[0], bgTranslate[1]);
  for (let y = 0; y < rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x * scl, y*scl, terrain[x][y]);
      vertex(x * scl, (y+1)*scl, terrain[x][y+1]);
    }
    endShape();
  }
  pop();



}
