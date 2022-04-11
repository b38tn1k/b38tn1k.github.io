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
// some fun
var sprites = [];
var spriteCount = 15;
var frameCount = 0;


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

function genSprite(spriteWidth, spriteHeight, pixelSize) {
  // let spriteWidth = 8.0;
  // let spriteHeight = 5.0;
  let sprite = createGraphics((spriteWidth+2)*pixelSize, spriteHeight*2*pixelSize);
  sprite.background = 255;
  sprite.fill(200);
  // sprite.stroke(0);
  sprite.noStroke();
  let x = 0;
  let y = 0;
  let invLength = spriteHeight;
  let invHeight = spriteWidth;
  let grid = new Array();
  let max = 0.0;
  //generate
  for (let i = 0; i < invLength; i++) {
    grid[i] = new Array();
    for (let j = 0; j < invHeight; j++) {
      // probability of pixel decreases radiating from grid[6][4]
      // random component
      //grid[i][j] = 0;
      grid[i][j] = random(2);
      // increase density towards horizontal center
      grid[i][j] = grid[i][j] + sin(radians(90*i/invLength));
      // increase density towards vertical center
      grid[i][j] = grid[i][j] + sin(radians(180*(j/invHeight)));
      // reduce density near eye areas

      // end of generating
      if (grid[i][j] > max) {
        max = grid[i][j];
      }
    }
  }
  //scale and prepare for threshold
  let sum = 0;
  let count = 0;
  for (let i = 0; i < invLength; i++) {
    for (let j = 0; j < invHeight; j++) {
      grid[i][j] = grid[i][j]/max;
      sum += grid[i][j];
      count++;
    }
  }
  let average = sum/count;
  let threshhold = average;
  let xpos = 0;
  let ypos = 0;
  for (var i = 0; i < invLength; i++) {
    for (var j = 0; j < invHeight; j++) {
      if (grid[i][j] > threshhold) {
        sprite.rect(xpos, ypos, pixelSize, pixelSize);
      }
      ypos += pixelSize;
    }
    ypos = 0;
    xpos += pixelSize;
  }
  var invlen = int(invLength) - 1;
  for (var i = 0; i < invLength; i++) {
    for (var j = 0; j < invHeight; j++) {
      if (grid[invlen- i][j] > threshhold) {
        sprite.rect(xpos, ypos, pixelSize, pixelSize);
      }
      ypos += pixelSize;
    }
    ypos = 0;
    xpos += pixelSize;
  }
  return sprite;
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
  // invaders guy
  sprites = [];
  let spritePixelSize = int(max(3, tSize/10));
  for (let i = 0; i < spriteCount; i++){
    sprites.push([genSprite(8, 5, 3), random(view.width), random(view.height), random(-1, 1), random(-1, 1), int(random(50, 100))]);
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
  frameCount += 1;
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  view.background(255);
  for (let i = 0; i < sprites.length; i++){
    view.image(sprites[i][0], sprites[i][1], sprites[i][2]);
    sprites[i][1] += sprites[i][3];
    sprites[i][2] += sprites[i][4];
    if (frameCount % sprites[i][5] == 0) {
      sprites[i][3] = random(-1, 1);
      sprites[i][4] = random(-1, 1);
    }
    if (sprites[i][1] < 0 || sprites[i][1] > view.width || sprites[i][2] < 0 || sprites[i][2] > view.height) {
      sprites[i][1] = centerX;
      sprites[i][2] = titleY;
    }
  }
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
