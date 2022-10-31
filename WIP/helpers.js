function newCell(type, x =-1, y =-1) {
  jlog('Main', 'newCell');
  type = int(type);
  let presAddStart = 0;
  if (mobileDeviceDetected == false) {
    presAddStart = cells.length;
    cells.addCell(type, x, y);
    pres.addCellsForPres(cells.cells, presAddStart)
  } else {
    if (mobileHAddon == true) {
      presAddStart = cells.length;
      cells.addCell(mobileHType, x, y);
      pres.addCellsForPres(cells.cells, pas)
      mobileHAddon = false;
    } else {
      mobileHType = type;
      mobileHAddon = true;
    }
  }
  myDivs['menu'].remove();
  myDivs['menu'] = createDiv();
  createMenuDiv();
}

function setTidyFlag() {
  jlog('Main', 'tidy');
  tidyFlag = 3;
}

function tidy() {
  jlog('Main', 'tidy');
  if (cells.run == false) {
    if (runMode == RM_NORMAL) {
      let xOffset = 2*myDivs['menu'].x + myDivs['menu'].size().width;
      cells.tidy(round(xOffset/(gridSize/2))*(gridSize/2), gridSize);
      if (zoomMode == true) {
        cells.update(mouseX, mouseY, mouseIsPressed);
      }
    }
    if (runMode == RM_CREATE) {
      let yOffset = 2*myDivs['presTools'].y + myDivs['presTools'].size().height// + gridSize/2;
      pres.tidy((myDivs['presTools'].x + 10)/pixelDensity(), yOffset);
      if (zoomMode == true) {
        pres.update(mouseX, mouseY, mouseIsPressed);
      }
    }
  }
}

function colorSetup() {
  jlog('Main', 'colorSetup');
  let colors = [];
  let icolors = [];
  let dtcolors = [];
  let highlights = [];
  let lowlights = [];
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
  allColors['colors'] = colors;
  allColors['icolors'] = icolors;
  allColors['dtcolors'] = dtcolors;
  allColors['highlights'] = highlights;
  allColors['lowlights'] = lowlights;
}

function saveCells(wip=false) {
  jlog('Main', 'saveCells');
  let map = cells.saveCells();
  let name = 'demo' + String(demos.length) + '.json';
  if (wip == true) {
    name = 'wip-demo.json'
  }
  save(map, name, true);
  setTidyFlag();
}

function copyToClipboard(myString) {
  // console.log(myString); //stolen from tutorial
  // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = myString;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
   controller.d_print('copied link to clipboard');
}

function loadBackup() {
  jlog('Main', 'loadBackup');
  let consoleTextLabel = cells.cells[1].indexLabeldiv.html();;
  let lineNumber = cells.cells[1].lineNumber;
  let currentLayout = cells.saveCells();
  clearCells();
  cells.cells[0].indexLabeldiv.remove();
  cells.cells[1].indexLabeldiv.remove();
  cells.cells = [];
  let myLoaderMap = JSON.parse(backupObject);
  for (key in Object.keys(myLoaderMap)) {
    cells.addCellWithInfo(myLoaderMap[key]);
  }
  for (key in Object.keys(myLoaderMap)) {
    cells.linkChildren(key, myLoaderMap[key]);
  }
  for (let i = 0; i < this.length; i++) {
    this.cells[i].reshape(true);
  }
  cells.cells[1].indexLabeldiv.html(consoleTextLabel);
  cells.cells[1].lineNumber = lineNumber;
  cells.cells[1].indexLabeldiv.elt.scrollTop = 1000 * cells.cells[1].lineNumber;
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
  cells = new Cells(allColors['colors'], allColors['highlights'], allColors['lowlights'], allColors['icolors'], allColors['dtcolors']);
  // cells = new Cells(colors, highlights, lowlights, icolors, dtcolors);
  mobileSettings();
  for (key in Object.keys(myLoaderMap)) {
    cells.addCellWithInfo(myLoaderMap[key]);
  }
  for (key in Object.keys(myLoaderMap)) {
    cells.linkChildren(key, myLoaderMap[key]);
  }
  let xOffset = 2*myDivs['menu'].x + myDivs['menu'].size().width;
  cells.nudgeX(xOffset);
  setTidyFlag(); // have to do twice?
  myDivs['menu'].remove();
  myDivs['menu'] = createDiv();
  createMenuDiv();
  cells.updateView(xPos, yPos, true);
  setTidyFlag();
  redrawCounter = 4;
  pres.cells = [];
  pres.addCellsForPres(cells.cells);
}

function mobileSettings() {
  jlog('Main', 'mobileSettings');
  if (zoomMode == true){
    fontSizeString = '10px';
    cells.dWidth = 40;
    cells.dHeight = 20;
    cells.dRadius = 4;
  } else {
    cells.dWidth = 80;
    cells.dHeight = 40;
    cells.dRadius = 5;
    fontSizeString = '12px';
  }
}

function clearCells() {
  jlog('Main', 'clearCells');
  controller.d_print('Clearing...');
  cells.quickClear();
  createMenuDiv();
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
  speedButton.html('speed: ' + String(speedMode + 1));
}

function toggleFlash() {
  jlog('Main', 'toggleFlash');
  flash = !flash;
  flashButton.html('flash: ' + String(flash));
}

function showAll() {
  jlog('Main', 'showAll');
  for (let i = 0; i < userBlocks.length; i++) {
    cells.addCell(userBlocks[i], 1.5 * myDivs['menu'].size().width);
    cells.cells[cells.activeIndex].mode = M_IDLE;
  }
  setTidyFlag();
}

function drawGrid() {
  jlog('Main', 'drawGrid');
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
  if (disableDrag == true){
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
  jlog('Main', 'imlost');
  xPos = 0;
  yPos = 0;
}

function togglezoomMode() {
  jlog('Main', 'togglezoomMode');
  zoomMode = ! zoomMode;
  // back up everything
  // reset font and max width sizes
  // recreate everything
  let consoleTextLabel = cells.cells[1].indexLabeldiv.html();;
  let lineNumber = cells.cells[1].lineNumber;
  let currentLayout = cells.saveCells();
  loadCells(currentLayout);
  cells.cells[1].indexLabeldiv.html(consoleTextLabel);
  cells.cells[1].lineNumber = lineNumber;
  cells.cells[1].indexLabeldiv.elt.scrollTop = 1000 * cells.cells[1].lineNumber;
  myDivs['menu'].html('');
  for (let i = 0; i < cells.length; i++){
    cells.cells[i].resetDims();
  }
  // createMenuDiv();
  if (zoomMode == false){
    myDivs['menu'].style('font-size', '16px');
  } else {
    myDivs['menu'].style('font-size', '12px');
  }
}

function refactor() {
  jlog('Main', 'refactor');
  jlog('Main', 'refactor');
  myDivs['refactor'] = createDiv();;
  myDivs['refactor'].style('background-color', 'DimGray');
  myDivs['refactor'].style('padding', '10px');
  myDivs['refactor'].style('outline', '1px solid black');
  let w = 200;
  myDivs['refactor'].size(w, null);
  myDivs['refactor'].style('overflow', "auto");
  myDivs['refactor'].position((windowWidth/2) - (w/2), 40);
  myDivs['refactor'].show();
  let handleSet = new Set();
  for (let i = 0; i < cells.length; i++) {
    if (cells.cells[i].handleSH) {
      if (['turtleY', 'turtleX', 'turtleDraw', 'unset', 'random', 'year', 'month#', 'monthS', 'day#', 'dayS', 'hour', 'minute', 'second', 'millis'].indexOf(cells.cells[i].handleSH) == -1) {
        handleSet.add(cells.cells[i].handleSH);
      }
    }
  }
  myDivs['refactorInputs'] = [];
  myDivs['refactorPriors'] = [];
  for (const hand of handleSet.keys()) {
    let inp = createInput(hand);
    inp.parent(myDivs['refactor']);
    myDivs['refactorInputs'].push(inp);
    myDivs['refactorPriors'].push(hand);
  }
  addButtonToDiv('rename & close', 1, closeRefactorDiv, myDivs['refactor'], 'header');
  noClickZone = [0, windowWidth, 0, windowHeight];
}

function setupScreen() {
  jlog('Main', 'setupScreen');
  jlog('Main', 'setupScreen');
  pixelDensity(1);
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    zoomMode = true;
    mobileDeviceDetected = true;
  }
  createCanvas(windowWidth, windowHeight);
  if (windowWidth/windowHeight < 10/16) {
    zoomMode = true;
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
  showDev = ! showDev;
  showDevDiv();
}

function doLastBit(){
  jlog('Main', 'doLastBit');
  let loaded = false;
  let demoIndex = -1;
  let myString = getURL();
  if (myString.indexOf("#tutorial")  != -1) {
    tutorial = true;
    tutorialstring = myString.slice(myString.indexOf("#tutorial"), myString.length);
  } else if (myString.indexOf("#demo") != -1) {
    let demo = myString.split("demo");
    demoIndex = parseInt(demo[demo.length - 1]);
  } else {
    loaded = cells.makeFromAddyBar();
  }
  loaded = doTutorials(loaded);
  if (loaded == false) {
    cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
    cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
    if (demoIndex != -1 && demoIndex < demos.length) {
      loadCells(demos[demoIndex]);
    }
    setTidyFlag();
  }
  if (cells.length > 1) {
    cells.cells[1].resizeConsole();
  }
  myDivs['menu'].remove();
  myDivs['menu'] = createDiv();
  createMenuDiv();
  createPresentationDiv();
}

function runFromButton() {
  cells.run = ! cells.run;
  fastMode = 1;
}

function testAll() {
  jlog('Main', 'testAll');
  while (speedMode != 1) {
    toggleSpeedMode();
  }
  testTimer = TST_LOAD;
  currentTestIndex = -1;
  testPacer = millis();
}

function colorToHTMLRGB(color) {
  jlog('Main', 'colorToHTMLRGB');
  return "rgb(" + color._getRed() + ", " + color._getGreen() + ", " + color._getBlue() + ")";
}

function toggleInput(cID, type){
  jlog('Main', 'toggleInput');
  console.log('functionality removed to tools/refactor');
  // for (let i = 0; i < cells.length; i++){
  //   if (type == cells.cells[i].type && (cells.cells[i].handleSH == cID)){
  //     cells.cells[i].showHandleInput = !cells.cells[i].showHandleInput;
  //   }
  //
  //   if (cells.cells[i].type == T_BLOCK && (cells.cells[i].handleSH == cID)) {
  //     if (cells.cells[i].showHandleInput == true && cells.cells[i].hide == false){
  //       cells.cells[i].input.show();
  //       cells.cells[i].refresh();
  //     }
  //     if (cells.cells[i].showHandleInput == false) {
  //       cells.cells[i].input.hide();
  //       cells.cells[i].refresh();
  //     }
  //     break;
  //   } else if (cells.cells[i].type == T_INPUT && (cells.cells[i].handleSH == cID)) {
  //     if (cells.cells[i].showHandleInput == true) {
  //       cells.cells[i].input.style('background-color', colorToHTMLRGB(cells.cells[i].colors[3]));
  //       cells.cells[i].input.value(cells.cells[i].handleSH);
  //     } else {
  //       cells.cells[i].updateHandleSH(cells.cells[i].input.value());
  //       cells.cells[i].input.value(cells.cells[i].dataSH);
  //       cells.cells[i].input.style('background-color', colorToHTMLRGB(cells.cells[i].colors[2]));
  //     }
  //     break;
  //   }
  // }
}

function jlog(classname, label) {
  if (['length', 'tidy', 'startStop', 'stop', 'toggleStartForm', 'resizeConsole', 'updateView', 'moveC','updateAllDivPositions', 'updateDivPosition', 'reshape', 'refresh'].indexOf(label) != -1) {
    return;
  }
  if (doJLOGCountDown > 0) {
    doJLOG = true;
  } else {
    doJLOG = false;
  }
  if (doJLOG == true) {
    console.debug('frame: '+ frameCount, classname, label);
    logCounter += 1;
    doJLOGCountDown -= 1;
    if (logCounter == 100) {
      console.clear();
    }
  }
}

function whatsLeft(){
  jlog('Main', 'whatsLeft');
  for (let i = 0; i < 55; i++) {
    if (everyone.indexOf(i) == -1){
      console.log('FREE:', i);
    }
  }
}
