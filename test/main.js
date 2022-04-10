// graphics
var view, border;
var centerX, centerY, titleY, buttonY;
// strings
var titleStringArr = [];
var titleString = '';
var buttons = [];
var buttonLabels = ['music', 'blog', 'code/art'];
var titleWidth;


class myButton {
  constructor(label, x, y) {
    this.label = '|';
    for (let i = 0; i < label.length + 3; i++) {
      this.label += '-';
    }
    this.label += '|\n| ' + label + '  |\n|';
    for (let i = 0; i < label.length + 3; i++) {
      this.label += '-';
    }
    this.label += '|';
    // this.label = label;
    this.x = x;
    this.y = y;
    this.width;
    this.x_min;
    this.x_max;
    this.y_min;
    this.y_max;
  }
}

function setupScreen() {
  // draw-onables
  createCanvas(windowWidth, windowHeight);
  border = int(min(0.05*windowWidth, 0.05*windowHeight));
  let x = (windowWidth - 2*border);
  let y = (windowHeight - 2*border);
  view = createGraphics(x, y);
  // text setup
  centerX = int(width/2);
  centerY = int(height/2);
  titleY = int(height/3);
  buttonY = height - titleY;
  let tSize = int(0.02 * x);
  textSize(tSize);
  textFont('Courier New');
  titleWidth = textWidth(titleStringArr[1]);
  buttons = [];
  // button setup
  let buttonX = int(centerX - (titleWidth/2));
  console.log(buttonX);
  let xInt = int(titleWidth/(buttonLabels.length - 1));
  console.log(xInt);
  for (let i = 0; i < buttonLabels.length; i++){
    buttons.push(new myButton(buttonLabels[i], buttonX, buttonY));
    // console.log(buttons[i].label, buttons[i].x);
    buttonX += xInt;
  }
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
  text(titleString, centerX, titleY)
  for (let i = 0; i < buttons.length; i++){
    text(buttons[i].label, buttons[i].x, buttons[i].y);
  }
  // stroke(0);
  // line(width/2, 0, width/2, height);
  // noStroke();
}
