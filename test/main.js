// graphics
var view, border;
var centerX, centerY, titleY, buttonY;
var colors = [0, 255];
// strings
var titleStringArr = [];
var titleString = '';
var buttons = [];
var buttonLabels = ['music', 'blog', 'code/art'];
var titleWidth;


class myButton {
  constructor(label, x, y) {
    this.name = label;
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
  let res = false;
  for (let i = 0; i < buttons.length; i++) {
    res = buttonPressed(buttons[i], mx, my);
    if (res === true) {
      console.log(buttons[i].name);
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
}
