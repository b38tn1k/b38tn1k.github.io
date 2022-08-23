
var widthOnTwo, heightOnTwo;
var cells;
var colors = [];
var icolors = [];
var dtcolors = [];
var highlights = [];
var lowlights = [];
var c;
var menu;

function keyPressed() {
  if (key == 'n') {
    // cells.addCell(mouseX, mouseY, int(random(1, c.length)));
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

function newCell(type) {
  cells.addCell(type);
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
    m = (colors[i]['maxes']['rgb'][0] + colors[i]['maxes']['rgb'][1] + colors[i]['maxes']['rgb'][2])/2;
    icolors.push(color(colors[i]['maxes']['rgb'][0] - colors[i]['levels'][0], colors[i]['maxes']['rgb'][1] - colors[i]['levels'][1], colors[i]['maxes']['rgb'][2] - colors[i]['levels'][2]))
    if (cvals > m) {
      highlights.push(lerpColor(colors[i], color(0), 0.7));
      lowlights.push(lerpColor(colors[i], color(255), 0.2));
      dtcolors.push(color(0));
    } else {
      highlights.push(lerpColor(colors[i], color(255), 0.7));
      lowlights.push(lerpColor(colors[i], color(0), 0.2));
      dtcolors.push(color(255));
    }
  }
}

function setup() {
  colorSetup();
  setupScreen();
  cells = new Cells(colors, highlights, lowlights, icolors, dtcolors);
  menu = createDiv('<a href="javascript:void(0)" onclick="newCell(' + T_BLOCK + ')"> + block</a><br>');
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_INPUT + ')"> + input</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_VAR + ')"> + variable</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_IF + ')"> + if</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_WHILE + ')"> + while</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_NOT + ')"> + not</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_EQUAL + ')"> + equal</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_LESS + ')"> + less</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_GREATER + ')"> + greater</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_ADD + ')"> + add</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_SUBTRACT + ')"> + subtract</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_MULT + ')"> + multiply</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_DIV + ')"> + divide</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_MOD + ')"> + modulus</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_GOTO + ')"> + goto</a><br>', true);
  menu.position(10, 10);
  menu.style('font-size', '16px');
  menu.show();
}

function draw() {
  clear();
  cells.draw();
  cells.update(mouseX, mouseY, mouseIsPressed);
}
