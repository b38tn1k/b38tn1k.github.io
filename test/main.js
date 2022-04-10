// graphics
var view, border;
// strings
var titleStringArr = [];
var titleString = '';

function setupScreen() {
  // draw-onables
  createCanvas(windowWidth, windowHeight);
  border = int(min(0.05*windowWidth, 0.05*windowHeight));
  let x = (windowWidth - 2*border);
  let y = (windowHeight - 2*border);
  view = createGraphics(x, y);
  // text setup
  let tSize = int(0.02 * x);
  textSize(tSize);
  textFont('Courier New');

  // prettify
  background(0);
  view.background(255);
}

function preload() {
  titleStringArr = loadStrings('textAssets/title.txt');
}

function mousePressed() {
  mx = mouseX;
  my = mouseY;
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function setup() {
  for (let i = 0; i < titleStringArr.length; i++){
    titleString += titleStringArr[i] + '\n';
  }
  setupScreen();
}

function draw(){
  textAlign(CENTER, CENTER);
  image(view, border, border);
  text(titleString, int(width/2), int(height/2))
}
