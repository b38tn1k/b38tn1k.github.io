
var widthOnTwo, heightOnTwo;

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
  console.log(mouseX, mouseY)

}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
}

function setup() {

  setupScreen();
}

function draw() {

}
