// graphics
var view, border;
var centerX, centerY, titleY, buttonY;
// strings
var titleStringArr = [];
var titleString = '';
var buttons = [];
var buttonLabels = ['music', 'blog', 'code/art'];
var buttonLinks = ['https://b38tn1k.com/stream/', null, null];
var titleWidth, titleHeight;


class myButton {
  constructor(label, link, x, y) {
    this.name = label;
    this.link = link;
    if (!(link === null)) {
      // figure out how to handle links that look like buttons here
    }
    this.label = '|';
    for (let i = 0; i < label.length + 2; i++) {
      this.label += '-';
    }
    this.label += '|\n| ' + label + ' |\n|';
    for (let i = 0; i < label.length + 2; i++) {
      this.label += '-';
    }
    this.label += '|';
    // this.label = label;
    this.x = x;
    this.y = y;
    this.width = textWidth('|-' + label + '-|');
    this.height = 3 * textSize();
    this.x_min = x - (this.width/2);
    this.x_max = x + (this.width/2);
    this.y_min = y - (this.height/2);
    this.y_max= y + (this.height/2);
    this.clickCountDown = 0;
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
  let tSize = int(0.02 * x);
  centerX = int(width/2);
  centerY = int(height/2);
  titleY = int(height/3);
  buttonY = height - titleY;
  titleHeight = titleStringArr.length * tSize;
  buttonY = titleY + titleHeight;
  textSize(tSize);
  console.log(tSize);
  textFont('Courier New');
  titleWidth = textWidth(titleStringArr[1]);
  buttons = [];
  // button setup
  let buttonX = int(centerX - (titleWidth/2));
  let xInt = int(titleWidth/(buttonLabels.length - 1));
  for (let i = 0; i < buttonLabels.length; i++){
    buttons.push(new myButton(buttonLabels[i], buttonLinks[i], buttonX, buttonY));
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
  let res = false;
  for (let i = 0; i < buttons.length; i++) {
    res = buttonPressed(buttons[i], mx, my);
    if (res === true) {
      buttons[i].clickCountDown = 2;
    }
  }
}

function buttonPressed(button, mx, my){
  let pressed = false;
  if (mx > button.x_min  && mx < button.x_max) {
    if (my > button.y_min && my < button.y_max){
      pressed = true;
    }
  }
  return pressed;
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function setup() {
  for (let i = 0; i < titleStringArr.length-1; i++){
    titleString += titleStringArr[i] + '\n';
  }
  setupScreen();
  frameRate(24);
}

function draw(){
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  image(view, border, border);
  fill(255);
  rect(centerX, titleY, titleWidth, titleHeight);
  fill(0);
  text(titleString, centerX, titleY);
  noStroke();
  for (let i = 0; i < buttons.length; i++){
    if (buttons[i].clickCountDown > 0) {
      fill(0);
      rect(buttons[i].x, buttons[i].y, buttons[i].width, buttons[i].height)
      fill(255);
      text(buttons[i].label, buttons[i].x, buttons[i].y);
      buttons[i].clickCountDown -= 1;
    } else {
      fill(255);
      rect(buttons[i].x, buttons[i].y, buttons[i].width, buttons[i].height)
      fill(0);
      text(buttons[i].label, buttons[i].x, buttons[i].y);
    }
  }
}
