
var widthOnTwo, heightOnTwo, cells, c, menu, shareLinkString, demo0, demo1, demo2;
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
  cells.addCell(type, 1.5 * menu.size().width);
}

function tidy() {
  let xOffset = 2*menu.x + menu.size().width;
  cells.tidy(xOffset, 17);
}

function preload() {
  c = loadStrings('nintendo-entertainment-system.hex');
  demo0 = loadJSON('helloworld.json');
  demo1 = loadJSON('demo1.json');
  demo2 = loadJSON('demo2.json');
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
  save(map, 'my.json', false);
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
  cells.tidy(xOffset, 17);
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

function createMenuDiv() {
  menu.html('<strong><a href="javascript:void(0)" onclick="showHideBlockMenu();">blocks menu</a></strong><br>');
  if (showBlockMenu == true) {
    menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_BLOCK + ')">+ block</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_INPUT + ')">+ value</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_VAR + ')">+ variable</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_IF + ')">+ if</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_WHILE + ')">+ while</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_NOT + ')">+ not</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_EQUAL + ')">+ equal</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_LESS + ')">+ less</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_GREATER + ')">+ greater</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_ADD + ')">+ add</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_SUBTRACT + ')">+ subtract</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_MULT + ')">+ multiply</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_DIV + ')">+ divide</a><br>', true);
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + T_MOD + ')">+ modulus</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_GOTO + ')">+ goto</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_ASSIGN + ')">+ assign</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="newCell(' + T_PRINT + ')">+ print</a><br>', true);
  }
  menu.html('<br><strong><a href="javascript:void(0)" onclick="showHideDemoMenu();">demo menu</a></strong><br>', true);
  if (showDemoMenu == true) {
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demo0)">hello world</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demo1)">gotos & blocks</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demo2)">assigning</a><br>', true);
  }

  menu.html('<br><a href="javascript:void(0)" onclick="clearCells()">clear</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="tidy()">tidy</a><br>', true);
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
    menu.html('<a href="' +shareLinkString +'">share link</a><br>', true);

  } else {
    menu.html('<a href="javascript:void(0)" onclick="shareLink()">share</a><br>', true);
  }
  menu.position(10, 10);
  menu.style('font-size', '16px');
  menu.show();
}

function setup() {
  colorSetup();
  setupScreen();
  cells = new Cells(colors, highlights, lowlights, icolors, dtcolors);
  controller = new Controller();
  menu = createDiv();
  createMenuDiv();
  let loaded = cells.makeFromAddyBar();
  if (loaded == false) {
    cells.addCell(T_START, 1.5 * menu.size().width);
    cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
  } else {
    tidy();
  }
}

function draw() {
  clear();
  cells.draw();
  cells.update(mouseX, mouseY, mouseIsPressed);
  controller.update(cells, flash);
  if (cells.run == true && slowMode == true) {
    frameRate(2);
  } else {
    frameRate(100);
  }
}
