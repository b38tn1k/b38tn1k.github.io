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
  if (cells.run == false) {
    let xOffset = 2*menu.x + menu.size().width;
    cells.tidy(round(xOffset/(gridSize/2))*(gridSize/2), gridSize);
    if (mobileHack == true) {
      cells.update(mouseX, mouseY, mouseIsPressed);
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
  console.log(JSON.stringify(map));
  let name = 'demo' + String(demos.length) + '.json';
  if (wip == true) {
    name = 'wip-demo.json'
  }
  save(map, name, true);
  setTidyFlag();
}

function loadBackup() {
  jlog('Main', 'loadBackup');
  // console.log(backupObject);

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
  cells = new Cells(allColors['colors'], allColors['highlights'], allColors['lowlights'], allColors['icolors'], allColors['dtcolors']);
  // cells = new Cells(colors, highlights, lowlights, icolors, dtcolors);
  mobileSettings();
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
  redrawCounter = 4;
}

function mobileSettings() {
  if (mobileHack == true){
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
  controller.d_print('Clearing...');
  clearCellFlag = 2;
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
  xPos = 0;
  yPos = 0;
}

function toggleMobileHack() {
  mobileHack = ! mobileHack;
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
  menu.html('');
  for (let i = 0; i < cells.length; i++){
    cells.cells[i].resetDims();
  }
  createMenuDiv();
}

function newCellFromButtonClick(button) {
  type = button.srcElement.value;
  newCell(type);
  createMenuDiv();
}

function addBlockMenuOption(type){
  button = createButton('+ ' + blockConfig[type]['block label'], type);
  button.parent(menu);
  button.mousePressed(newCellFromButtonClick);
  menu.html('<br>', true);
  // menu.html('<a href="javascript:void(0);" onclick="newCell(' + type + ');createMenuDiv();">+ '+ blockConfig[type]['block label'] + '</a><br>', true);
}

function addBlockMenuList(list) {
  for (let i = 0; i < list.length; i++) {
    addBlockMenuOption(list[i]);
  }
}

function loadCellsFromButtonClick(button) {
  index = parseInt(button.srcElement.value);
  loadCells(demos[index]);
  createMenuDiv();
}

function showBlockSubMenu(button) {
  subMenu = parseInt(button.srcElement.value);
  createMenuDiv();
}

function addButtonToMainDiv(name, value=0, callback=0){
  let button = createButton(name, String(value));
  button.parent(menu);
  if (callback != 0) {
    button.mousePressed(callback);
  }
  menu.html('<br>', true);
}

function createMenuDiv() {
  jlog('Main', 'createMenuDiv');
  menu.remove();
  menu = createDiv();
  addButtonToMainDiv('blocks menu', 0, showHideBlockMenu);
  if (showBlockMenu == true) {
    addButtonToMainDiv('data containers', 1, showBlockSubMenu);
    if (subMenu == 1) {
      addBlockMenuList(containers);
    }
    addButtonToMainDiv('data references', 2, showBlockSubMenu);
    if (subMenu == 2) {
      addBlockMenuList(handles);
    }
    addButtonToMainDiv('array tools', 7, showBlockSubMenu);
    if (subMenu == 7) {
      addBlockMenuList(arrayTools);
    }
    addButtonToMainDiv('math', 3, showBlockSubMenu);
    if (subMenu == 3) {
      addBlockMenuList(mathFunctions);
    }
    addButtonToMainDiv('comparison', 4, showBlockSubMenu);
    if (subMenu == 4) {
      addBlockMenuList(boolFunctions);
    }
    addButtonToMainDiv('conditionals', 5, showBlockSubMenu);
    if (subMenu == 5) {
      addBlockMenuList(conditionals);
    }
    addButtonToMainDiv('utilities', 6, showBlockSubMenu);
    if (subMenu == 6) {
      addBlockMenuList(utilities);
    }
    addButtonToMainDiv('show all', 6, showAll);
  } else {
    subMenu = 0;
  }
  addButtonToMainDiv('demo menu', 6, showHideDemoMenu);
  if (showDemoMenu == true) {
    addButtonToMainDiv('+ Hello, World!', 0, loadCellsFromButtonClick);
    addButtonToMainDiv('+ Turing bit flip', 14, loadCellsFromButtonClick);
    addButtonToMainDiv('+ Programmable TM', 15, loadCellsFromButtonClick);
    addButtonToMainDiv('+ Sleep Sort', 7, loadCellsFromButtonClick);
    addButtonToMainDiv('+ Draw Polygons', 8, loadCellsFromButtonClick);
    menu.html('<span style="color:LightGray">block usage:</span><br>', true);
    addButtonToMainDiv('+ blocks', 1, loadCellsFromButtonClick);
    addButtonToMainDiv('+ assigning', 2, loadCellsFromButtonClick);
    addButtonToMainDiv('+ basic math', 3, loadCellsFromButtonClick);
    addButtonToMainDiv('+ comparisons', 4, loadCellsFromButtonClick);
    addButtonToMainDiv('+ if', 5, loadCellsFromButtonClick);
    addButtonToMainDiv('+ if not', 6, loadCellsFromButtonClick);
    addButtonToMainDiv('+ while and array get', 9, loadCellsFromButtonClick);
    addButtonToMainDiv('+ array/string push', 10, loadCellsFromButtonClick);
    addButtonToMainDiv('+ array/string set', 11, loadCellsFromButtonClick);
    addButtonToMainDiv('+ string delete', 12, loadCellsFromButtonClick);
    addButtonToMainDiv('+ array delete', 13, loadCellsFromButtonClick);
    addButtonToMainDiv('+ test all', 13, testAll);
  }
  menu.html("<br>", true);
  addButtonToMainDiv('clear', 13, clearCells);
  addButtonToMainDiv('tidy', 13, setTidyFlag);
  addButtonToMainDiv('speed: ' + String(speedMode+1), 13, toggleSpeedMode);
  addButtonToMainDiv('flash: ' + String(flash), 13, toggleFlash);
  addButtonToMainDiv('center', 13, imlost);
  if (shareLinkGenerated == true) {
    addButtonToMainDiv('reshare', 13, shareLink);
    menu.html('<a href="' +shareLinkString +'" target="_blank">share link</a><br>', true);
  } else {
    addButtonToMainDiv('share', 13, shareLink);
  }
  if (mobileHack == false) {
    addButtonToMainDiv('zoom out', 13, toggleMobileHack);
    // menu.html('<br><a href="javascript:void(0);" onclick="toggleMobileHack();createMenuDiv();">zoom out</a><br>', true);
  } else {
    // menu.html('<br><a href="javascript:void(0);" onclick="toggleMobileHack();createMenuDiv();">zoom in</a><br>', true);
    addButtonToMainDiv('zoom in', 13, toggleMobileHack);
  }
  menu.html('<br><span style="color:LightGray"><small>version 0.alpha', true);
  addButtonToMainDiv('dev div', 13, showDevDiv);
  menu.html('refresh if zoomed</small></span>', true);
  menu.html('', true);
  menu.html('<br><a href="http://b38tn1k.com/code/ux/2022/09/08/blocks-explained/" target="_blank">about</a><br>', true);
  if (mobileHack == false){
    menu.style('font-size', '16px');
  } else {
    menu.style('font-size', '12px');
  }
  menu.style('background-color', 'DimGray');
  menu.style('padding', '10px');
  menu.style('outline', '1px solid black');
  if (menu.size().height > windowHeight - 50){
    let newHeight = windowHeight - 50;
    menu.size(null, newHeight);
  } else {
    menu.size(null, null);
  }
  menu.style('overflow', "auto");
  menu.position(10, 10);
  noClickZone = [10, menu.size().width + 10, windowHeight - 2* menu.size().height, windowHeight];
  if (hideMenu == true){
    menu.hide();
    noClickZone = [-1, -1, -1, -1];
  } else {
    menu.show();
  }
  showDev = ! showDev;
  showDevDiv();
}

function showDevDiv(){
  showDev = ! showDev;
  if (showDev == false){
    devDiv.remove();
    return;
  }
  devDiv.remove();
  devDiv = createDiv();
  devDiv.style('font-size', '12px');
  devDiv.style('background-color', 'DimGray');
  devDiv.style('padding', '10px');
  devDiv.style('outline', '1px solid black');
  // devDiv.style('overflow', "auto");
  devDiv.html('<a href="javascript:void(0);" onclick="saveCells()">save json</a><br>', true);
  devDiv.html('<a href="javascript:void(0);" onclick="saveCells(true)">save WIP</a><br>', true);
  devDiv.html('<a href="javascript:void(0);" onclick="showFPS = !showFPS;">show FPS</a><br>', true);
  devDiv.html('<a href="javascript:void(0);" onclick="clickDebug = !clickDebug;console.log(\'click debug\', clickDebug)">click log</a><br>', true);
  devDiv.html('<a href="javascript:void(0);" onclick="printStack = !printStack;console.log(\'print stack\', printStack)">stack log</a><br>', true);
  devDiv.html('<a href="javascript:void(0);" onclick="doJLOG = !doJLOG;">TMI</a><br>', true);
  devDiv.html('<a href="javascript:void(0);" onclick="whatsLeft();">free colors</a><br>', true);
  devDiv.html('<a href="javascript:void(0);" onclick="cells.clean();">clean</a><br>', true);
  devDiv.html('<a href="javascript:void(0);" onclick="loadCells(demos[demos.length-1])">current tester</a><br>', true);
  devDiv.position(windowWidth - (40 + devDiv.size().width), 10);
}

function setupScreen() {
  jlog('Main', 'setupScreen');
  pixelDensity(1);
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    mobileHack = true;
    mobileHackActual = true;
  }
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
  showDev = ! showDev;
  showDevDiv();
}

function doLastBit(){
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
    cells.addCell(T_START, 1.5 * menu.size().width);
    cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
    if (demoIndex != -1 && demoIndex < demos.length) {
      loadCells(demos[demoIndex]);
    }
    setTidyFlag();
  }
  if (cells.length > 1) {
    cells.cells[1].resizeConsole();
  }
  menu.remove();
  menu = createDiv();
  createMenuDiv();
}

function doTutorials(loaded) {
  if (tutorial == true){
    let noIframe = true;
    try {
      noIframe = window.self == window.top;
    } catch (e) {
      noIframe = true;
    }
    if (noIframe == true) {
      let myDiv = createDiv('<a onclick="window.history.back()"> back to tutorial </a>');
      myDiv.style('font-size', '16px');
      textSize(16);
      myDiv.position(windowWidth - textWidth(' back to tutorial '), windowHeight - 40);
    }
    switch(tutorialstring) {
      case '#tutorialBlank':
        break;
      case '#tutorialHello':
        cells.addCell(T_START, 1.5 * menu.size().width);
        cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
        loadCells(demos[0]);
        cells.cells[0].reshape();
        cells.cells[0].refresh();
        if (mobileHack == true){
          tidyFlag = 0;
          cells.cells[1].x = cells.cells[0].x;
          cells.cells[1].y = cells.cells[0].y + cells.cells[0].height + cells.cells[0].handleH*2;
        } else {
          setTidyFlag();
        }
        cells.run = true;
        loaded = true;
        break;
      case '#tutorialHandles':
        cells.addCell(T_START, 1.5 * menu.size().width);
        cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
        cells.cells[0].x = windowWidth * 2;
        cells.cells[1].x = windowWidth * 2;
        cells.addCell(T_CONST, 1.5 * menu.size().width);
        cells.cells[2].mode = M_IDLE;
        cells.cells[2].x = (windowWidth / 2 ) - cells.cells[2].width/2;
        cells.cells[2].y = windowHeight/2 - cells.cells[2].height/2;
        cells.cells[2].specialLayer = createGraphics(cells.cells[2].width*3, cells.cells[2].height*3);
        let fSize = parseInt(fontSizeString.slice(0, 2));
        cells.cells[2].specialLayer.textSize(fSize);
        let xc = cells.cells[2].specialLayer.width/2;
        let yc = cells.cells[2].specialLayer.height/2;
        let cw2 = cells.cells[2].width/2;
        let ch2 = cells.cells[2].height/2;
        let gap = fSize * 2;
        let px = int(xc - cw2 - gap- cells.cells[2].specialLayer.textWidth("move"));
        let py = int(yc - ch2);
        cells.cells[2].specialLayer.text("move", px, py);
        px = int(xc + cw2 + gap);
        py = int(yc - ch2);
        cells.cells[2].specialLayer.text("delete", px, py);
        px = int(xc + cw2 + gap);
        py = int(yc);
        cells.cells[2].specialLayer.text("copy", px, py);
        px = int(xc + cw2 + gap);
        py = int(yc + ch2 + fSize);
        cells.cells[2].specialLayer.text("resize", px, py);
        px = int(xc - cw2 - gap - cells.cells[2].specialLayer.textWidth("mutate"));
        py = int(yc + ch2 + fSize);
        cells.cells[2].specialLayer.text("mutate", px, py);
        px = int(xc);
        py = int(yc + ch2 + gap);
        cells.cells[2].specialLayer.textAlign(CENTER, CENTER);
        cells.cells[2].specialLayer.text("expand/collapse", px, py);
        loaded = true;
        hideMenu = true;
        disableDrag = true;
        break;
      case '#tutorialMove':
        cells.addCell(T_START, 1.5 * menu.size().width);
        cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
        hideMenu = true;
        loaded = true;
        disableDrag = true;
        cells.addCell(T_COMMENT, windowWidth * 0.25);
        cells.addCell(T_BLOCK, windowWidth * 0.75);
        cells.addCell(T_CONST, windowWidth * 0.5);
        cells.cells[2].mode= M_IDLE;
        cells.cells[3].mode= M_IDLE;
        cells.cells[4].mode= M_IDLE;
        cells.cells[0].x = windowWidth * 2;
        cells.cells[1].x = windowWidth * 2;
        cells.cells[2].x -= cells.cells[2].width/2;
        cells.cells[3].x -= cells.cells[3].width/2;
        cells.cells[4].x -= cells.cells[4].width/2;
        cells.cells[2].input.value("can't drop on me");
        cells.cells[3].updateHandleSH("drop on me!");
        cells.cells[4].input.value('drag me');
        cells.cells[2].disableDelete();
        cells.cells[3].disableDelete();
        cells.cells[4].disableDelete();
        break;
      case '#tutorialMutate':
        cells.addCell(T_START, 1.5 * menu.size().width);
        cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
        cells.cells[0].x = windowWidth * 2;
        cells.cells[1].x = windowWidth * 2;
        hideMenu = true;
        loaded = true;
        disableDrag = true;
        cells.addCell(T_ADD, windowWidth * 0.5);
        cells.cells[2].x -= cells.cells[2].width/2;
        cells.addCell(T_CONST, windowWidth * 0.5);
        cells.cells[4].input.value(1);
        cells.addCell(T_CONST, windowWidth * 0.5);
        cells.cells[5].input.value(2);
        cells.addCell(T_CONST, windowWidth * 0.5);
        cells.cells[6].input.value(3);
        cells.cells[2].addChild(4, cells.cells[4]);
        cells.cells[2].addChild(5, cells.cells[5]);
        cells.cells[2].addChild(6, cells.cells[6]);
        cells.cells[4].addParent(2, cells.cells[2]);
        cells.cells[5].addParent(2, cells.cells[2]);
        cells.cells[6].addParent(2, cells.cells[2]);
        for (let i = 0; i < cells.length; i++){
          cells.cells[i].disableDelete();
          cells.cells[i].mode = M_IDLE;
        }
        break;
      case '#tutorialCopy':
      cells.addCell(T_START, 1.5 * menu.size().width);
      cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
      cells.cells[0].x = windowWidth * 2;
      cells.cells[1].x = windowWidth * 2;
      hideMenu = true;
      loaded = true;
      disableDrag = true;
      cells.addCell(T_SUBTRACT, windowWidth * 0.7);
      cells.cells[2].x -= cells.cells[2].width/2;
      cells.addCell(T_CONST, windowWidth * 0.2);
      cells.cells[4].input.value(1);
      cells.addCell(T_CONST, windowWidth * 0.2);
      cells.cells[5].input.value(2);
      cells.addCell(T_CONST, windowWidth * 0.2);
      cells.cells[6].input.value(3);
      cells.cells[2].addChild(4, cells.cells[4]);
      cells.cells[2].addChild(5, cells.cells[5]);
      cells.cells[2].addChild(6, cells.cells[6]);
      cells.cells[4].addParent(2, cells.cells[2]);
      cells.cells[5].addParent(2, cells.cells[2]);
      cells.cells[6].addParent(2, cells.cells[2]);
      cells.addCell(T_INPUT, windowWidth * 0.2);
      cells.cells[7].updateHandleSH("Reference me!");
      cells.cells[7].x -= cells.cells[7].width * 0.5;
      cells.addCell(T_CONST, windowWidth * 0.2);
      cells.cells[8].input.value("Copy me!");
      cells.cells[8].x -= cells.cells[8].width  * 0.5;
      cells.cells[8].y += cells.cells[7].height + cells.cells[7].handleH*2;
      cells.addCell(T_BLOCK, windowWidth * 0.2);
      cells.cells[9].updateHandleSH("Reference me!");
      cells.cells[9].x -= cells.cells[9].width  * 0.5;
      cells.cells[9].y += cells.cells[8].y + cells.cells[8].height + cells.cells[8].handleH*2;
      cells.addCell(T_CONST, windowWidth * 0.25);
      cells.cells[9].addChild(10, cells.cells[10]);
      cells.cells[10].addParent(9, cells.cells[9]);
      cells.cells[10].input.value("inside a block")
      for (let i = 0; i < cells.length; i++){
        cells.cells[i].disableDelete();
        cells.cells[i].mode = M_IDLE;
      }
      break;
    case '#tutorialData':
      cells.addCell(T_START, 10);
      cells.addCell(T_CONSOLE, 10);
      hideMenu = true;
      loaded = true;
      cells.addCell(T_CONST, windowWidth * 0.5);
      cells.cells[cells.length-1].input.value("I am useless")
      cells.addCell(T_INPUT, windowWidth * 0.5);
      cells.cells[cells.length-1].input.value("I am eternal")
      cells.mapAndLink();
      cells.addCell(T_PRINT, windowWidth * 0.5);
      cells.cells[0].addChild(cells.length-2, cells.cells[cells.length-2]);
      let blockIndex = cells.length;
      cells.addCell(T_BLOCK, windowWidth * 0.5);
      cells.addCell(T_GOTO, windowWidth * 0.5);
      cells.addCell(T_CONST, 0);
      cells.addCell(T_CONST, 0);
      cells.mapAndLink();
      cells.cells[5].updateHandleSH(cells.cells[3].handleSH);
      cells.cells[7].updateHandleSH(cells.cells[6].handleSH);
      cells.cells[blockIndex].addChild(blockIndex+2, cells.cells[blockIndex+2]);
      cells.cells[blockIndex+2].addParent(blockIndex, cells.cells[blockIndex]);
      cells.cells[blockIndex].addChild(blockIndex+3, cells.cells[blockIndex+3]);
      cells.cells[blockIndex+3].addParent(blockIndex, cells.cells[blockIndex]);
      cells.cells[blockIndex+2].input.value("I'm ok");
      cells.cells[blockIndex+3].input.value("me too");
      let printIndex = cells.length;
      cells.addCell(T_PRINT, windowWidth * 0.5);
      cells.cells[0].addChild(cells.length-2, cells.cells[cells.length-2]);
      cells.cells[cells.length-2].addChild(blockIndex + 1, cells.cells[cells.length-2]);
      cells.activeIndex = cells.length-1;
      cells.doDelete();
      cells.mapAndLink();
      cells.cells[printIndex].addChild(blockIndex + 1, cells.cells[blockIndex + 1]);
      cells.cells[blockIndex + 1].addParent(printIndex, cells.cells[printIndex]);
      for (let i = 0; i < cells.length; i++){
        cells.cells[i].disableDelete();
        cells.cells[i].mode = M_IDLE;
      }
      cells.tidy(0, 10);
      break;
    }
  }
  return loaded;
}

function checkAnOrUpdateTutorial() {
  if (tutorial == true){
    switch(tutorialstring) {
      case '#tutorialBlank':
        break;
      case '#tutorialHello':
        demoIndex = 0;
        break;
      case '#tutorialHandles':
        if (cells.length < 3){
          cells.cells[0].x = windowWidth * 2;
          cells.cells[1].x = windowWidth * 2;
          cells.addCell(T_CONST, windowWidth * 0.5);
          cells.cells[2].mode = M_IDLE;
          cells.cells[2].x -= cells.cells[0].width/2;
        }
        cells.cells[2].x = max(cells.cells[2].x, 0);
        cells.cells[2].x = min(cells.cells[2].x, windowWidth-20);
        cells.cells[2].y = max(cells.cells[2].y, 0);
        cells.cells[2].y = min(cells.cells[2].y, windowHeight - 5);
        cells.cells[2].viewX = max(cells.cells[2].viewX, 0);
        cells.cells[2].viewX = min(cells.cells[2].viewX, windowWidth-20);
        cells.cells[2].viewY = max(cells.cells[2].viewY, 0);
        cells.cells[2].viewY = min(cells.cells[2].viewY, windowHeight - 5);
        cells.cells[2].updateAllDivPositions();
        break;
      case '#tutorialMove':
        for (let j = 2; j<5; j++) {
          cells.cells[j].x = max(cells.cells[j].x, 0);
          cells.cells[j].x = min(cells.cells[j].x, windowWidth-20);
          cells.cells[j].y = max(cells.cells[j].y, 0);
          cells.cells[j].y = min(cells.cells[j].y, windowHeight - 5);
          cells.cells[j].viewX = max(cells.cells[j].viewX, 0);
          cells.cells[j].viewX = min(cells.cells[j].viewX, windowWidth-20);
          cells.cells[j].viewY = max(cells.cells[j].viewY, 0);
          cells.cells[j].viewY = min(cells.cells[j].viewY, windowHeight - 5);
          cells.cells[j].updateAllDivPositions();
        }
        break;
      case '#tutorialMutate':
        for (let j = 2; j<7; j++) {
          cells.cells[j].x = max(cells.cells[j].x, 0);
          cells.cells[j].x = min(cells.cells[j].x, windowWidth-20);
          cells.cells[j].y = max(cells.cells[j].y, 0);
          cells.cells[j].y = min(cells.cells[j].y, windowHeight - 5);
          cells.cells[j].viewX = max(cells.cells[j].viewX, 0);
          cells.cells[j].viewX = min(cells.cells[j].viewX, windowWidth-20);
          cells.cells[j].viewY = max(cells.cells[j].viewY, 0);
          cells.cells[j].viewY = min(cells.cells[j].viewY, windowHeight - 5);
          cells.cells[j].updateAllDivPositions();
        }
        break;
      case '#tutorialCopy':
        for (let j = 2; j<11; j++) {
          cells.cells[j].x = max(cells.cells[j].x, 0);
          cells.cells[j].x = min(cells.cells[j].x, windowWidth-20);
          cells.cells[j].y = max(cells.cells[j].y, 0);
          cells.cells[j].y = min(cells.cells[j].y, windowHeight - 5);
          cells.cells[j].viewX = max(cells.cells[j].viewX, 0);
          cells.cells[j].viewX = min(cells.cells[j].viewX, windowWidth-20);
          cells.cells[j].viewY = max(cells.cells[j].viewY, 0);
          cells.cells[j].viewY = min(cells.cells[j].viewY, windowHeight - 5);
          cells.cells[j].updateAllDivPositions();
        }
        break;
      case '#tutorialData':
        if (millis() < 10000){
          cells.cells[5].updateHandleSH(cells.cells[3].handleSH);
          cells.cells[7].updateHandleSH(cells.cells[6].handleSH);
        }
        for (let j = 2; j<cells.length; j++) {
          cells.cells[j].x = max(cells.cells[j].x, 0);
          cells.cells[j].x = min(cells.cells[j].x, windowWidth-20);
          cells.cells[j].y = max(cells.cells[j].y, 0);
          cells.cells[j].y = min(cells.cells[j].y, windowHeight - 5);
          cells.cells[j].viewX = max(cells.cells[j].viewX, 0);
          cells.cells[j].viewX = min(cells.cells[j].viewX, windowWidth-20);
          cells.cells[j].viewY = max(cells.cells[j].viewY, 0);
          cells.cells[j].viewY = min(cells.cells[j].viewY, windowHeight - 5);
          cells.cells[j].updateAllDivPositions();
        }
        break;
      }
    }
}

function testAll() {
  while (speedMode != 1) {
    toggleSpeedMode();
  }
  testTimer = TST_LOAD;
  currentTestIndex = -1;
  testPacer = millis();
}

function colorToHTMLRGB(color) {
  return "rgb(" + color._getRed() + ", " + color._getGreen() + ", " + color._getBlue() + ")";
}

function toggleInput(cID, type){
  for (let i = 0; i < cells.length; i++){
    if (type == cells.cells[i].type && (cells.cells[i].handleSH == cID)){
      cells.cells[i].showHandleInput = !cells.cells[i].showHandleInput;
    }

    if (cells.cells[i].type == T_BLOCK && (cells.cells[i].handleSH == cID)) {
      if (cells.cells[i].showHandleInput == true && cells.cells[i].hide == false){
        cells.cells[i].input.show();
        cells.cells[i].refresh();
      }
      if (cells.cells[i].showHandleInput == false) {
        cells.cells[i].input.hide();
        cells.cells[i].refresh();
      }
      break;
    } else if (cells.cells[i].type == T_INPUT && (cells.cells[i].handleSH == cID)) {
      if (cells.cells[i].showHandleInput == true) {
        cells.cells[i].input.style('background-color', colorToHTMLRGB(cells.cells[i].colors[3]));
        cells.cells[i].input.value(cells.cells[i].handleSH);
      } else {
        cells.cells[i].updateHandleSH(cells.cells[i].input.value());
        cells.cells[i].input.value(cells.cells[i].dataSH);
        cells.cells[i].input.style('background-color', colorToHTMLRGB(cells.cells[i].colors[2]));
      }
      break;
    }
  }
}

function jlog(classname, label) {
  if (doJLOG == true) {
    console.debug(classname, label, (millis()/1000).toFixed(1));
    logCounter += 1;
    if (logCounter == 100) {
      console.clear();
    }
  }
}

function whatsLeft(){
  for (let i = 0; i < 55; i++) {
    if (everyone.indexOf(i) == -1){
      console.log('FREE:', i);
    }
  }
}
