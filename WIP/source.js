
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
var fastMode = false;
var speedMode = 0;
var flash = true;
var gridSize = 20;
var demos = [];
var mobileHType;
var mobileHAddon = false;
var tidyFlag = 0;
let subMenu = 0;
let currentTestIndex = 0;
let testLoadTimer = 0;
let runTest = false;

function deviceTurned() {
  jlog('Main', 'deviceTurned');
  setupScreen();
}

function windowResized() {
  jlog('Main', 'windowResized');
  setupScreen();
  cells.updateView(xPos, yPos, doMouseDrag);
  redrawCounter = 2;
}

function mousePressed() {
  jlog('Main', 'mousePressed');
  if (mobileHack == true && mobileHAddon == true) {
    newCell(mobileHType, mouseX, mouseY);
  } else {
    doMouseDrag = !(cells.checkSelected(mouseX, mouseY));
    if (doMouseDrag == true){
      xStart = mouseX;
      yStart = mouseY;
    }
  }
}

// function keyTyped() {
//   if (key === ' ') {
//     setTidyFlag();
//   }
// }

function newCell(type, x =-1, y =-1) {
  jlog('Main', 'newCell');
  if (mobileHack == false) {
    cells.addCell(type, 1.5 * menu.size().width);
    menu.remove();
    menu = createDiv();
    createMenuDiv();
  } else {
    if (mobileHAddon == true) {
      cells.addCell(mobileHType, x, y);
      // cells.turnOffActiveIndex();
      mobileHAddon = false;
      menu.remove();
      menu = createDiv();
      createMenuDiv();
    } else {
      console.log('mobileHack');
      mobileHType = type;
      mobileHAddon = true;
    }
  }
  // setTidyFlag();
}

function setTidyFlag() {
  jlog('Main', 'tidy');
  tidyFlag = 2;
}

function tidy() {
  jlog('Main', 'tidy');
  let xOffset = 2*menu.x + menu.size().width;
  cells.tidy(round(xOffset/(gridSize/2))*(gridSize/2), gridSize);
  if (mobileHack == true) {
    cells.update(mouseX, mouseY, mouseIsPressed);
  }
}

function preload() {
  jlog('Main', 'preload');
  c = loadStrings('nintendo-entertainment-system.hex');
  demos.push(loadJSON('helloworld.json'));
  demos.push(loadJSON('demo1.json'));
  demos.push(loadJSON('demo2.json'));
  demos.push(loadJSON('demo3.json'));
  demos.push(loadJSON('demo4.json'));
  demos.push(loadJSON('demo5.json'));
  demos.push(loadJSON('demo6.json'));
  demos.push(loadJSON('demo7.json'));
  demos.push(loadJSON('demo8.json'));
  demos.push(loadJSON('demo9.json'));
  demos.push(loadJSON('demo10.json'));
}

function colorSetup() {
  jlog('Main', 'colorSetup');
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
  jlog('Main', 'saveCells');
  let map = cells.saveCells();
  console.log(JSON.stringify(map));
  save(map, 'my.json', true);
  setTidyFlag();
}

function shareLink() {
  jlog('Main', 'shareLink');
  shareLinkString = cells.putInAddyBar();
  shareLinkGenerated = true;
  menu.html('');
  createMenuDiv();
  setTidyFlag();
}

function loadCells(myLoaderMap) {
  jlog('Main', 'loadCells');
  imlost();
  xOff = 0;
  yOff = 0;
  xPos = 0;
  yPos = 0;
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
  setTidyFlag(); // have to do twice?
  menu.remove();
  menu = createDiv();
  createMenuDiv();
  cells.updateView(xPos, yPos, true);
  setTidyFlag();
}

function showHideBlockMenu() {
  jlog('Main', 'showHideBlockMenu');
  showBlockMenu = ! showBlockMenu;
  menu.html('');
  createMenuDiv();
}

function showHideDemoMenu() {
  jlog('Main', 'showHideDemoMenu');
  showDemoMenu = ! showDemoMenu;
  menu.html('');
  createMenuDiv();
}

function clearCells() {
  jlog('Main', 'clearCells');
  while (cells.cells.length > 2) {
    cells.activeIndex = 2;
    cells.cells[2].mode = M_DELETE;
    cells.update();
  }
}

function toggleSpeedMode() {
  jlog('Main', 'toggleSpeedMode');
  speedMode += 1;
  if (speedMode > 2) {
    speedMode = 0;
  }
  slowMode = false;
  fastMode = false;
  if (speedMode == 2) {
    slowMode = true;
  }
  if (speedMode == 1) {
    fastMode = true;
  }
  menu.html('');
  createMenuDiv();
}

function toggleFlash() {
  jlog('Main', 'toggleFlash');
  flash = !flash;
  menu.html('');
  createMenuDiv();
}

function showAll() {
  jlog('Main', 'showAll');
  for (let i = 0; i < userBlocks.length; i++) {
    cells.addCell(userBlocks[i], 1.5 * menu.size().width);
    cells.cells[cells.activeIndex].mode = M_IDLE;
  }
  setTidyFlag();
}

function drawGrid() {
  jlog('Main', 'drawGrid');
  // console.log(xPos, yPos);
  for (let x = 0; x < windowWidth; x+=bgGrid.width) {
    for (let y = 0; y < windowHeight; y+= bgGrid.height) {
      image(bgGrid, x + xPos%20, y + yPos%20);
    }
  }
}

function mouseDrag() {
  jlog('Main', 'mouseDrag');
  if (mouseIsPressed == false) {
    doMouseDrag = false;
  }
  if (doMouseDrag == true) {
    xOff = xStart - mouseX;
    yOff = yStart - mouseY;
    xPos -= xOff * 0.1;//0.03;
    yPos -= yOff  * 0.1;//0.03;
  } else {
    xOff = 0;
    yOff = 0;
  }
}

function imlost() {
  xPos = 0;
  yPos = 0;
}

function toggleMobileHack() {
  mobileHack = ! mobileHack;
  menu.html('');
  createMenuDiv();
}

function addBlockMenuOption(type, bad){
  if (bad.indexOf(type) == -1) {
    menu.html('<a href="javascript:void(0)" onclick="newCell(' + type + ')">+ '+ blockConfig[type]['block label'] + '</a><br>', true);
  } else {
    menu.html('<a class="bad" href="javascript:void(0)" onclick="newCell(' + type + ')">+ '+ blockConfig[type]['block label'] + '</a><br>', true);
  }
}

function addBlockMenuList(list, bad) {
  for (let i = 0; i < list.length; i++) {
    addBlockMenuOption(list[i], bad);
  }
}

function createMenuDiv() {
  jlog('Main', 'createMenuDiv');
  menu.html('<strong><a href="javascript:void(0)" onclick="showHideBlockMenu();">blocks menu</a></strong><br>');
  if (showBlockMenu == true) {
    let bad = [];
    menu.html('<a href="javascript:void(0)" onclick="subMenu=1;createMenuDiv();">data containers</a><br>', true);
    if (subMenu == 1) {
      addBlockMenuList(containers, bad);
    }
    menu.html('<a href="javascript:void(0)" onclick="subMenu=2;createMenuDiv();">data handles</a><br>', true);
    if (subMenu == 2) {
      addBlockMenuList(handles, bad);
    }
    menu.html('<a href="javascript:void(0)" onclick="subMenu=7;createMenuDiv();">arrays</a><br>', true);
    if (subMenu == 7) {
      addBlockMenuList(arrayTools, bad);
    }
    menu.html('<a href="javascript:void(0)" onclick="subMenu=3;createMenuDiv();">math</a><br>', true);
    if (subMenu == 3) {
      addBlockMenuList(mathFunctions, bad);
    }
    menu.html('<a href="javascript:void(0)" onclick="subMenu=4;createMenuDiv();">comparison</a><br>', true);
    if (subMenu == 4) {
      addBlockMenuList(boolFunctions, bad);
    }
    menu.html('<a href="javascript:void(0)" onclick="subMenu=5;createMenuDiv();">conditionals</a><br>', true);
    if (subMenu == 5) {
      addBlockMenuList(conditionals, bad);
    }
    menu.html('<a href="javascript:void(0)" onclick="subMenu=6;createMenuDiv();">utilities</a><br>', true);
    if (subMenu == 6) {
      addBlockMenuList(utilities, bad);
    }
    menu.html('<a class="bad" href="javascript:void(0)" onclick="showAll()">show all</a><br>', true);
  } else {
    subMenu = 0;
  }
  menu.html('<br><strong><a href="javascript:void(0)" onclick="showHideDemoMenu();">demo menu</a></strong><br>', true);
  if (showDemoMenu == true) {
    menu.html('<a href="javascript:void(0)" onclick="testAll()">+ test all</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[0])">+ hello world</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[1])">+ blocks</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[2])">+ assigning</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[3])">+ basic math</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[4])">+ silly string math</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[5])">+ comparisons</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[6])">+ iffy if</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[7])">+ if not</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[8])">+ sleep sort(a)</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[9])">+ draw polygons</a><br>', true);
    menu.html('<a href="javascript:void(0)" onclick="loadCells(demos[10])">+ array basics</a><br>', true);
  }
  menu.html('<br><a href="javascript:void(0)" onclick="clearCells()">clear</a><br>', true);
  menu.html('<a href="javascript:void(0)" onclick="setTidyFlag()">tidy</a><br>', true);
  if (speedMode == 0) {
    menu.html('<a href="javascript:void(0)" onclick="toggleSpeedMode()">speed: 1</a><br>', true);
  } else if (speedMode == 1){
    menu.html('<a href="javascript:void(0)" onclick="toggleSpeedMode()">speed: 2</a><br>', true);
    // menu.html('<a class="bad" href="javascript:void(0)" onclick="toggleSpeedMode()">may lock browser</a><br>', true);
  } else if ( speedMode == 2) {
    menu.html('<a href="javascript:void(0)" onclick="toggleSpeedMode()">speed: 3</a><br>', true);
  }
  if (flash == false) {
    menu.html('<a href="javascript:void(0)" onclick="toggleFlash()">flash on</a><br>', true);
  } else {
    menu.html('<a href="javascript:void(0)" onclick="toggleFlash()">flash off</a><br>', true);
  }
  menu.html('<a href="javascript:void(0)" onclick="imlost()">center</a><br>', true);
  menu.html('<br><a href="javascript:void(0)" onclick="saveCells()">save</a><br>', true);
  if (shareLinkGenerated == true) {
    menu.html('<a href="javascript:void(0)" onclick="shareLink()">reshare</a><br>', true);
    menu.html('<a href="' +shareLinkString +'" target="_blank">share link</a><br>', true);

  } else {
    menu.html('<a href="javascript:void(0)" onclick="shareLink()">share</a><br>', true);
  }
  if (mobileHack == false) {
    menu.html('<br><a class="bad" href="javascript:void(0)" onclick="toggleMobileHack();">mobile hack</a><br>', true);
  } else {
    menu.html('<br><a href="javascript:void(0)" onclick="toggleMobileHack();">desktop</a><br>', true);
  }
  menu.html('<br><span style="color:LightGray"><small>version 0.1<br>refresh if zoomed<br>WIP - YMMV</small></span>', true);
  menu.position(10, 10);
  menu.style('font-size', '16px');
  menu.style('background-color', 'DimGray');
  menu.style('padding', '10px');
  menu.style('outline', '1px solid black');
  menu.style('overflow', "auto");
  menu.show();
}

function setupScreen() {
  jlog('Main', 'setupScreen');
  createCanvas(windowWidth, windowHeight);
  if (windowWidth/windowHeight < 10/16) {
    mobileHack = true;
  }
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

function doLastBit(){
  let loaded = false;
  let demoIndex = -1;
  let myString = getURL();
  if (myString.indexOf("#demo") != -1) {
    let demo = myString.split("demo");
    demoIndex = parseInt(demo[demo.length - 1]);
  } else {
    loaded = cells.makeFromAddyBar();
  }
  if (loaded == false) {
    cells.addCell(T_START, 1.5 * menu.size().width);
    cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
    if (demoIndex != -1 && demoIndex < demos.length) {
      loadCells(demos[demoIndex]);
    }
    setTidyFlag();
  }
  cells.cells[1].resizeConsole();
  menu.remove();
  menu = createDiv();
  createMenuDiv();
}

function setup() {
  jlog('Main', 'setup');
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
  doLastBit();
}

function testAll() {
  runTest = true;
  currentTestIndex = -1;
  testLoadTimer = 101;
}

function draw() {
  if (redrawCounter != 0) {
    clear();
  }
  mouseDrag();
  cells.updateView(xPos, yPos, doMouseDrag);
  if (redrawCounter != 0) {
    drawGrid();
  }
  if (redrawCounter != 0) {
    cells.draw();
    redrawCounter -= 1;
  }
  if (cells.redrawFlag == true || cells.run == true){
    redrawCounter = 2;
  }
  cells.update(mouseX, mouseY, mouseIsPressed);
  if (redrawCounter != 0) {
    controller.update(cells, flash, fastMode);
  }
  if (cells.run == true && slowMode == true) {
    frameRate(5);
  } else {
    frameRate(100);
  }
  if (tidyFlag > 0) {
    tidy();
    cells.updateView(xPos, yPos, true);
    tidyFlag -= 1;
  }
  if (cells.rebuildMenuFlag == true){
    menu.remove();
    menu = createDiv();
    createMenuDiv();
    cells.rebuildMenuFlag = false;
  }
  if (runTest == true && cells.run == false) {
    testLoadTimer += 1;
  }
  if (runTest == true && cells.run == false && testLoadTimer > 30){
    currentTestIndex += 1;
    testLoadTimer = 0;
    loadCells(demos[currentTestIndex]);
    cells.run = true;
    if (currentTestIndex == demos.length-1){
      runTest = false;
    }
  }
}
