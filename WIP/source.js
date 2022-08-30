
var bgGrid, widthOnTwo, heightOnTwo, cells, c, menu, shareLinkString;
var xPos, yPos, xStart, yStart, xOff, yOff, doMouseDrag;
var colors = [];
var icolors = [];
var dtcolors = [];
var highlights = [];
var lowlights = [];
var showBlockMenu = false;
var showDemoMenu = false;
var shareLinkGenerated = false;
var slowMode = false;
var flash = true;
var gridSize = 20;
var demos = [];

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  doMouseDrag = !(cells.checkSelected(mouseX, mouseY));
  if (doMouseDrag == true){
    xStart = mouseX;
    yStart = mouseY;
  }
}

// function keyTyped() {
//   if (key === ' ') {
//     tidy();
//     tidy();
//   }
// }

function newCell(type) {
  cells.addCell(type, 1.5 * menu.size().width);
}

function tidy() {
  let xOffset = 2*menu.x + menu.size().width;
  cells.tidy(round(xOffset/(gridSize/2))*(gridSize/2), gridSize);
}

function preload() {
  c = loadStrings('nintendo-entertainment-system.hex');
  demos.push(loadJSON('helloworld.json'));
  demos.push(loadJSON('demo1.json'));
  demos.push(loadJSON('demo2.json'));
  demos.push(loadJSON('demo3.json'));
  demos.push(loadJSON('demo4.json'));
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

function saveCells() {
  let map = cells.saveCells();
  save(map, 'my.json', true);
}

function shareLink() {
  shareLinkString = cells.putInAddyBar();
  shareLinkGenerated = true;
  menu.html('');
  createMenuDiv();
}

function loadCells(myLoaderMap) {
  for (let i = 0; i < cells.length; i++) {
    cells.cells[i].mode = M_DELETE;
    cells.cells[i].cleanForDeletionSafe();
  }
  cells.cells[0].indexLabeldiv.remove();
  cells.cells[1].indexLabeldiv.remove();
  cells = new Cells(colors, highlights, lowlights, icolors, dtcolors);
  for (key in Object.keys(myLoaderMap)) {
    cells.addCellWithInfo(myLoaderMap[key]);
  }
  for (key in Object.keys(myLoaderMap)) {
    cells.linkChildren(key, myLoaderMap[key]);
  }
  let xOffset = 2*menu.x + menu.size().width;
  cells.nudgeX(xOffset);
  // tidy();
}

function showHideBlockMenu() {
  showBlockMenu = ! showBlockMenu;
  menu.html('');
  createMenuDiv();
}

function showHideDemoMenu() {
  showDemoMenu = ! showDemoMenu;
  menu.html('');
  createMenuDiv();
}

function clearCells() {
  while (cells.cells.length > 2) {
    cells.activeIndex = 2;
    cells.cells[2].mode = M_DELETE;
    cells.update();
  }
}

function toggleSlow() {
  slowMode = !slowMode;
  menu.html('');
  createMenuDiv();
}

function toggleFlash() {
  flash = !flash;
  menu.html('');
  createMenuDiv();
}

function showAll() {
  let userBlocks = [T_BLOCK, T_GOTO, T_INPUT, T_VAR, T_IF, T_WHILE, T_NOT, T_EQUAL, T_LESS, T_GREATER, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD, T_ASSIGN, T_PRINT, T_COMMENT];
  for (let i = 0; i < userBlocks.length; i++) {
    cells.addCell(userBlocks[i], 1.5 * menu.size().width);
    cells.cells[cells.activeIndex].mode = M_IDLE;
  }
  tidy();
}

function drawGrid() {
  // console.log(xPos, yPos);
  for (let x = 0; x < windowWidth; x+=bgGrid.width) {
    for (let y = 0; y < windowHeight; y+= bgGrid.height) {
      image(bgGrid, x + xPos%20, y + yPos%20);
    }
  }
}

function mouseDrag() {
  if (mouseIsPressed == false) {
    doMouseDrag = false;
  }
  if (doMouseDrag == true) {
    xOff = xStart - mouseX;
    yOff = yStart - mouseY;
    xPos -= xOff * 0.02;
    yPos -= yOff  * 0.02;
  } else {
    xOff = 0;
    yOff = 0;
  }
}

function createMenuDiv() {
  menu.html('<strong><a href="javascript:void(0)" onclick="showHideBlockMenu();">blocks menu</a></strong><br>');
  if (showBlockMenu == true) {
    let userBlocks = [T_BLOCK, T_GOTO, T_CONST, T_INPUT, T_VAR, T_IF, T_WHILE, T_NOT, T_EQUAL, T_LESS, T_GREATER, T_ADD, T_SUBTRACT, T_MULT, T_DIV, T_MOD, T_ASSIGN, T_PRINT, T_COMMENT];
    let bad = [T_IF, T_WHILE, T_NOT, T_EQUAL, T_GREATER, T_LESS];
    for (let i = 0; i < userBlocks.length; i++) {
      if (bad.indexOf(userBlocks[i]) == -1) {
        menu.html('<a href="javascript:void(0)" onclick="newCell(' + userBlocks[i] + ')">+ '+ blockConfig[userBlocks[i]]['block label'] + '</a><br>', true);
      } else {
        menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + userBlocks[i] + ')">+ '+ blockConfig[userBlocks[i]]['block label'] + '</a><br>', true);
      }
    }
    menu.html('<a class="bad" href="javascript:void(0)" onclick="showAll()">show all</a><br>', true);
  }
  menu.html('<br><strong><a href="javascript:void(0)" onclick="showHideDemoMenu();">demo menu</a></strong><br>', true);
  if (showDemoMenu == true) {
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[0])">hello world</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[1])">blocks</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[2])">assigning</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[3])">basic math</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[4])">string math</a><br>', true);
  }
  menu.html('<br><a href="javascript:void(0)" onclick="clearCells()">clear</a><br>', true);
  menu.html('<a class="bad" href="javascript:void(0)" onclick="tidy()">tidy</a><br>', true);
  if (slowMode == false) {
    menu.html('<a href="javascript:void(0)" onclick="toggleSlow()">slow mode</a><br>', true);
  } else {
    menu.html('<a href="javascript:void(0)" onclick="toggleSlow()">normal mode</a><br>', true);
  }
  if (flash == false) {
    menu.html('<a href="javascript:void(0)" onclick="toggleFlash()">flash on</a><br>', true);
  } else {
    menu.html('<a href="javascript:void(0)" onclick="toggleFlash()">flash off</a><br>', true);
  }
  menu.html('<br><a href="javascript:void(0)" onclick="saveCells()">save</a><br>', true);
  if (shareLinkGenerated == true) {
    menu.html('<a href="javascript:void(0)" onclick="shareLink()">reshare</a><br>', true);
    menu.html('<a href="' +shareLinkString +'" target="_blank">share link</a><br>', true);

  } else {
    menu.html('<a href="javascript:void(0)" onclick="shareLink()">share</a><br>', true);
  }
  menu.position(10, 10);
  menu.style('font-size', '16px');
  menu.style('background-color', 'DimGray');
  menu.style('padding', '10px');
  menu.style('outline', '1px solid black')
  menu.show();
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  let gs2 = gridSize**2;
  bgGrid = createGraphics(gs2, gs2);
  for (let i = gridSize/2; i < gs2; i += gridSize) {
    for (let j = gridSize/2; j < gs2; j+= gridSize) {
      bgGrid.point(i, j);
    }
  }
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
}

function setup() {
  pixelDensity(1);
  colorSetup();
  setupScreen();
  cells = new Cells(colors, highlights, lowlights, icolors, dtcolors);
  controller = new Controller();
  menu = createDiv();
  createMenuDiv();
  xOff = 0;
  yOff = 0;
  xPos = 0;
  yPos = 0;
  let loaded = cells.makeFromAddyBar();
  if (loaded == false) {
    cells.addCell(T_START, 1.5 * menu.size().width);
    cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
    tidy();
  }
  cells.cells[1].resizeConsole();

}

function draw() {
  clear();
  mouseDrag();
  drawGrid();
  cells.updateView(xPos, yPos, doMouseDrag);
  cells.draw();
  cells.update(mouseX, mouseY, mouseIsPressed);
  controller.update(cells, flash);
  if (cells.run == true && slowMode == true) {
    frameRate(2);
  } else {
    frameRate(100);
  }
}
