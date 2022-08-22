
var widthOnTwo, heightOnTwo;
var cells;
var colors = [];
var highlights = [];
var lowlights = [];
var c;
var menu;

function keyPressed() {
  if (key == 'n') {
    cells.addCell(mouseX, mouseY, int(random(1, c.length)));
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
  cells.checkSelected(mouseX, mouseY);
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
}

function newCell() {
  cells.addCell(widthOnTwo, heightOnTwo, int(random(1, c.length)));
}


function preload() {
  c = loadStrings('nintendo-entertainment-system.hex');
}

function colorSetup() {
  for (let i = 0; i < c.length; i++) {
    colors.push(color('#' + c[i]));
  }
  delete c;
  let cvals;
  let m;
  for (let i = 0; i < colors.length; i++) {
    cvals = colors[i]['levels'][0] + colors[i]['levels'][1] + colors[i]['levels'][2];
    m = colors[i]['maxes']['rgb'][0] + colors[i]['maxes']['rgb'][1] + colors[i]['maxes']['rgb'][2];
    if (cvals > m/2) {
      highlights.push(lerpColor(colors[i], color(0), 0.5));
      lowlights.push(lerpColor(colors[i], color(255), 0.2));
    } else {
      highlights.push(lerpColor(colors[i], color(255), 0.5));
      lowlights.push(lerpColor(colors[i], color(0), 0.2));
    }
  }
}

function setup() {
  colorSetup();
  setupScreen();
  cells = new Cells(colors, highlights, lowlights);
  menu = createDiv('<a href="javascript:void(0)" onclick="newCell()"> + </a>');
  menu.position(10, 10);
  menu.style('font-size', '16px');
  menu.show();
}

function draw() {
  clear();
  cells.draw();
  cells.update(mouseX, mouseY, mouseIsPressed);
}
