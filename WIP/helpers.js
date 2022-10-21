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
      pres.tidy(myDivs['presTools'].x/pixelDensity(), yOffset);
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
  // shareLinkGenerated = true;
  myDivs['shareLink'] = createDiv();
  myDivs['shareLink'].style('background-color', 'DimGray');
  myDivs['shareLink'].style('padding', '10px');
  myDivs['shareLink'].style('outline', '1px solid black');
  let w = 200;
  myDivs['shareLink'].size(w, null);
  myDivs['shareLink'].style('overflow', "auto");
  myDivs['shareLink'].position((windowWidth/2) - (w/2), 40);
  myDivs['shareLink'].show();
  addButtonToDiv('share project', 1, shareProject, myDivs['shareLink'], 'header');
  addButtonToDiv('create presentation', 1, createPresentation, myDivs['shareLink'], 'header');
  addButtonToDiv('cancel', 1, cancelShare, myDivs['shareLink']);
  // noClickZone = [10, myDivs['menu'].size().width + 10, windowHeight - 2* myDivs['menu'].size().height, windowHeight];
  noClickZone = [0, windowWidth, 0, windowHeight];
}

function cancelShare() {
  jlog('Main', 'cancelShare');
  myDivs['shareLink'].remove();
  noClickZone = [10, myDivs['menu'].size().width + 10, windowHeight - 2* myDivs['menu'].size().height, windowHeight];
  doMouseDrag = false;
}

function createPresentation() {
  jlog('Main', 'createPresentation');
  backupObject = JSON.stringify(cells.saveCells());
  cells.addIDsForCreateMode();
  redrawCounter = 2;
  if (pres.length == 0){
    pres.addCellsForPres(cells.cells)
  }
  cancelShare();
  presCreationMode = true;
  // showGUI = false;
  runMode = RM_CREATE;
  cells.hideAll(presComponents);
  myDivs['presTools'] = createDiv();
  myDivs['presTools'].style('background-color', 'DimGray');
  myDivs['presTools'].style('padding', '10px');
  myDivs['presTools'].style('outline', '1px solid black');
  myDivs['presTools'].size(myDivs['menu'].width, null);
  myDivs['presTools'].style('overflow', "auto");
  myDivs['presTools'].position(10, 10);
  myDivs['presTools'].show();
  hideMenu = true;
  myDivs['menu'].hide();
  addButtonToDiv('share presentation', 1, sharePresentation, myDivs['presTools']);
  addButtonToDiv('center', 13, imlost, myDivs['presTools']);
  addButtonToDiv('back', 1, exitPresentationMode, myDivs['presTools']);
  pres.cleanForCreateMode();
  setTidyFlag();
}

function exitPresentationMode() {
  hideMenu = false;
  presCreationMode = false;
  showGUI = true;
  pres.getLayoutArray();
  pres.removeCreateMode();
  loadBackup();
  myDivs['menu'].show();
  noClickZone = [10, myDivs['menu'].size().width + 10, windowHeight - 2* myDivs['menu'].size().height, windowHeight];
  myDivs['presTools'].remove();
  runMode = RM_NORMAL;
  redrawCounter = 4;
  cells.updateView(xPos, yPos, true);
}

function sharePresentation() {
  shareLinkString = cells.putInAddyBar(true);
  let scriptLink = shareLinkString.replace('#', '##');
  window.open(scriptLink);
  doMouseDrag = false;
}

function shareProject() {
  jlog('Main', 'shareProject');
  shareLinkString = cells.putInAddyBar();
  cancelShare();
  window.open(shareLinkString);
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

function showHideBlockMenu() {
  jlog('Main', 'showHideBlockMenu');
  showBlockMenu = ! showBlockMenu;
  if (showBlockMenu == true) {
    myDivs['blocks']['main'].show();
    myDivs['demos'].hide();
    showDemoMenu = false;
    myDivs['utils'].hide();
    showUtils = false;
  } else {
    myDivs['blocks']['main'].hide();
    restyleMenuDiv();
    if (submenu != 0) {
      myDivs['blocks'][submenu].hide();
      submenu = 0;
    }
  }
}

function showHideDemoMenu() {
  jlog('Main', 'showHideDemoMenu');

  showDemoMenu = ! showDemoMenu;
  if (showDemoMenu == true) {
    myDivs['blocks']['main'].hide();
    showBlockMenu = false;
    myDivs['utils'].hide();
    showUtils = false;
    myDivs['demos'].show();
  } else {
    myDivs['demos'].hide();
    restyleMenuDiv();
  }
  // myDivs['menu'].html('');
  // createMenuDiv();
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

function newCellFromButtonClick(button) {
  jlog('Main', 'newCellFromButtonClick');
  type = button.srcElement.value;
  newCell(type, mouseX, mouseY);
  // createMenuDiv();
}

function createAddBlockMenu(list, div) {
  jlog('Main', 'createAddBlockMenu');
  for (let i = 0; i < list.length; i++) {
    addButtonToDiv('+ ' + blockConfig[list[i]]['block label'], list[i], newCellFromButtonClick, div, 'colorcoded');
  }
}

function loadCellsFromButtonClick(button) {
  jlog('Main', 'loadCellsFromButtonClick');
  index = parseInt(button.srcElement.value);
  loadCells(demos[index]);
  // createMenuDiv();
}

function showBlocksubmenu(button) {
  jlog('Main', 'showBlocksubmenu');
  let oldSM = submenu;
  submenu = parseInt(button.srcElement.value);
  for (let i = 1; i <= 7; i++){
    myDivs['blocks'][i].hide();
  }
  if (oldSM == submenu) {
    submenu = 0;
  } else {
    myDivs['blocks'][submenu].show();
  }
  restyleMenuDiv();
}

function addButtonToDiv(name, value, callback, div, cssClass='basic'){
  jlog('Main', 'addButtonToDiv');
  let button = createButton(name, String(value));
  // button.addClass(String(cssClass)); // i prefer using JS
  button.addClass('basic');
  if (cssClass == 'colorcoded') {
    let tc = allColors['dtcolors'][value].toString('#rrggbb');
    let c1 = allColors['colors'][value].toString('#rrggbb');
    button.style('color', tc);
    button.style('text-align', 'left');
    button.style('background-image', 'linear-gradient(' + c1 + ', ' + c1 + ')');
    button.style('border-color', 'DimGray');
  } else if (cssClass == 'dev') {
    button.style('height', '18px');
    button.style('background-image', 'linear-gradient(DimGray, DimGray)');
    button.style('border-color', 'DimGray');
    button.style('box-shadow', 'rgba(255,255,255,.6) 0 0px 0 inset')
    button.style('color', 'LightGray');
  } else if (cssClass == 'header') {
    button.style('background-image', 'linear-gradient(#b7b8ba ,#a7a9ac)');
  } else if (cssClass == 'demo') {
    button.style('text-align', 'left');
  } else if (cssClass == 'eg') {
    button.style('text-align', 'left');
    button.style('background-image', 'linear-gradient(#d7d8da ,#c7c9cc)');
  }
  button.parent(div);
  if (callback != 0) {
    button.mousePressed(callback);
  }

  if (cssClass == 'speedID') {
    speedButton = button;
  } else if (cssClass == 'flashID') {
    flashButton = button;

  }
  div.html('<br>', true);
}

function blocksMenu() {
  jlog('Main', 'blocksMenu');
  addButtonToDiv('blocks menu', 0, showHideBlockMenu, myDivs['menu'], 'header');
  myDivs['blocks'] = {};
  myDivs['blocks']['main'] = createDiv();
  for (let i = 1; i <= 7; i++) {
    myDivs['blocks'][i] = createDiv();
  }
  createAddBlockMenu(containers, myDivs['blocks'][1]);
  createAddBlockMenu(handles, myDivs['blocks'][2]);
  createAddBlockMenu(arrayTools, myDivs['blocks'][7]);
  createAddBlockMenu(mathFunctions, myDivs['blocks'][3]);
  createAddBlockMenu(boolFunctions, myDivs['blocks'][4]);
  createAddBlockMenu(conditionals, myDivs['blocks'][5]);
  createAddBlockMenu(utilities, myDivs['blocks'][6]);
  for (let i = 1; i <= 7; i++) {
    // if (i != submenu && showBlockMenu == true)
    myDivs['blocks'][i].hide();
  }
  addButtonToDiv('data containers', 1, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][1].parent(myDivs['blocks']['main']);

  addButtonToDiv('data references', 2, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][2].parent(myDivs['blocks']['main']);

  addButtonToDiv('array tools', 7, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][7].parent(myDivs['blocks']['main']);

  addButtonToDiv('math', 3, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][3].parent(myDivs['blocks']['main']);

  addButtonToDiv('comparison', 4, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][4].parent(myDivs['blocks']['main']);

  addButtonToDiv('conditionals', 5, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][5].parent(myDivs['blocks']['main']);

  addButtonToDiv('utilities', 6, showBlocksubmenu, myDivs['blocks']['main']);
  myDivs['blocks'][6].parent(myDivs['blocks']['main']);

  addButtonToDiv('show all', 6, showAll, myDivs['blocks']['main']);
  myDivs['blocks']['main'].parent(myDivs['menu']);
  if (showBlockMenu == false) {
    myDivs['blocks']['main'].hide();
  } else {
    if (submenu != 0) {
      myDivs['blocks'][submenu].show();
    }
  }
}

function demoMenu(){
  jlog('Main', 'demoMenu');
  myDivs['menu'].html('<br>', true);
  addButtonToDiv('demo menu', 6, showHideDemoMenu, myDivs['menu'], 'header');
  myDivs['demos'] = createDiv();
  addButtonToDiv('Hello, World!', 0, loadCellsFromButtonClick, myDivs['demos'], 'demo');
  addButtonToDiv('Turing bit flip', 14, loadCellsFromButtonClick, myDivs['demos'], 'demo');
  addButtonToDiv('Programmable TM', 15, loadCellsFromButtonClick, myDivs['demos'], 'demo');
  addButtonToDiv('Sleep Sort', 7, loadCellsFromButtonClick, myDivs['demos'], 'demo');
  addButtonToDiv('Draw Polygons', 8, loadCellsFromButtonClick, myDivs['demos'], 'demo');
  // myDivs['menu'].html('<span style="color:LightGray">block usage:</span><br>', true);
  addButtonToDiv('blocks', 1, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('assigning', 2, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('basic math', 3, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('comparisons', 4, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('if', 5, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('if not', 6, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('while and array get', 9, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('array/string push', 10, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('array/string set', 11, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('string delete', 12, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('array delete', 13, loadCellsFromButtonClick, myDivs['demos'], 'eg');
  addButtonToDiv('test all', 13, testAll, myDivs['demos']);
  myDivs['demos'].parent(myDivs['menu']);
  if (showDemoMenu == false){
    myDivs['demos'].hide();
  } else {
    myDivs['demos'].show();
  }

}

function showHideUtilMenu() {
  jlog('Main', 'showHideUtilMenu');
  showUtils = !showUtils;
  if (showUtils == true) {
    myDivs['utils'].show();
    myDivs['demos'].hide();
    showDemoMenu = false;
    myDivs['blocks']['main'].hide();
    showBlockMenu = false;

  } else {
    myDivs['utils'].hide();
    restyleMenuDiv();
  }
}

function utilitiesMenu(){
  jlog('Main', 'utilitiesMenu');
  myDivs['menu'].html("<br>", true);
  addButtonToDiv('tools', 13, showHideUtilMenu, myDivs['menu'], 'header');
  myDivs['utils'] = createDiv();
  addButtonToDiv('clear', 13, clearCells, myDivs['utils']);
  addButtonToDiv('tidy', 13, setTidyFlag, myDivs['utils']);
  addButtonToDiv('speed: ' + String(speedMode+1), 13, toggleSpeedMode, myDivs['utils'], 'speedID');
  addButtonToDiv('flash: ' + String(flash), 13, toggleFlash, myDivs['utils'], 'flashID');
  addButtonToDiv('center', 13, imlost, myDivs['utils']);
  addButtonToDiv('share', 13, shareLink, myDivs['utils']);
  addButtonToDiv('refactor', 13, refactor, myDivs['utils']);
  // if (shareLinkGenerated == true) {
  //   addButtonToDiv('reshare', 13, shareLink, myDivs['utils']);
  //   myDivs['utils'].html('<a href="' +shareLinkString +'" target="_blank">share link</a><br>', true);
  // } else {
  //   addButtonToDiv('share', 13, shareLink, myDivs['utils']);
  // }
  if (zoomMode == false) {
    addButtonToDiv('zoom out', 13, togglezoomMode, myDivs['utils']);
    // myDivs['menu'].html('<br><a href="javascript:void(0);" onclick="togglezoomMode();createMenuDiv();">zoom out</a><br>', true);
  } else {
    // myDivs['menu'].html('<br><a href="javascript:void(0);" onclick="togglezoomMode();createMenuDiv();">zoom in</a><br>', true);
    addButtonToDiv('zoom in', 13, togglezoomMode, myDivs['utils']);
  }
  myDivs['utils'].parent(myDivs['menu']);
  if (showUtils == true) {
    myDivs['utils'].show();
  } else {
    myDivs['utils'].hide();
  }

  // myDivs['menu'].html('<br><a href="http://b38tn1k.com/code/ux/2022/09/08/blocks-explained/" target="_blank">about</a><br>', true);
  myDivs['menu'].html('<br>', true);
  addButtonToDiv('about', 0, openAbout, myDivs['menu']);
  myDivs['menu'].html('<br>', true);
  addButtonToDiv('version 0.000..01', 13, showDevDiv, myDivs['menu'], 'dev');
  // let myLink = createA('http://b38tn1k.com/code/ux/2022/09/08/blocks-explained/', 'about', '_blank_');
  // myLink.parent(myDivs['menu']);
}

function openAbout(){
  jlog('Main', 'openAbout');
  window.open('https://b38tn1k.com/code/ux/2022/09/08/blocks-explained/');
}

function closeRefactorDiv(){
  jlog('Main', 'closeRefactorDiv');
  noClickZone = [10, myDivs['menu'].size().width + 10, windowHeight - 2* myDivs['menu'].size().height, windowHeight];
  let stringed = String(JSON.stringify(cells.saveCells()));
  for (let i = 0; i < myDivs['refactorInputs'].length; i++){
    stringed = stringed.replaceAll(myDivs['refactorPriors'][i], myDivs['refactorInputs'][i].value());
  }

  let consoleTextLabel = cells.cells[1].indexLabeldiv.html();;
  let lineNumber = cells.cells[1].lineNumber;
  let currentLayout = cells.saveCells();
  clearCells();
  cells.cells[0].indexLabeldiv.remove();
  cells.cells[1].indexLabeldiv.remove();
  cells.cells = [];
  let myLoaderMap = JSON.parse(stringed);
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


  // for (let i = 0; i < myDivs['refactorInputs'].length; i++){
  //   if (myDivs['refactorPriors'][i] != myDivs['refactorInputs'][i].value()) {
  //     cells.refactors.push(myDivs['refactorInputs'][i].value());
  //     for (let j = 0; j < cells.length; j++) {
  //       if (cells.cells[j].handleSH == myDivs['refactorPriors'][i]) {
  //         cells.cells[j].updateHandleSH(myDivs['refactorInputs'][i].value());
  //         cells.cells[j].inputOptions.push(myDivs['refactorInputs'][i].value());
  //       }
  //     }
  //   }
  // }
  myDivs['refactor'].remove();
  myDivs['refactorInputs'] = [];
  myDivs['refactorPriors'] = [];
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

function restyleMenuDiv(){
  myDivs['menu'].style('background-color', 'DimGray');
  myDivs['menu'].style('padding', '10px');
  myDivs['menu'].style('outline', '1px solid black');
  if (myDivs['menu'].size().height > windowHeight - 50){
    let newHeight = windowHeight - 50;
    myDivs['menu'].size(null, newHeight);
  } else {
    myDivs['menu'].size(null, null);
  }
  myDivs['menu'].style('overflow', "auto");
  myDivs['menu'].position(10, 10);
}

function createMenuDiv() {
  jlog('Main', 'createMenuDiv');
  myDivs['menu'].remove();
  if (showGUI == true) {
    myDivs['menu'] = createDiv();
    blocksMenu();
    demoMenu();
    utilitiesMenu();
    if (zoomMode == false){
      myDivs['menu'].style('font-size', '16px');
    } else {
      myDivs['menu'].style('font-size', '12px');
    }
    myDivs['menu'].style('background-color', 'DimGray');
    myDivs['menu'].style('padding', '10px');
    myDivs['menu'].style('outline', '1px solid black');
    if (myDivs['menu'].size().height > windowHeight - 50){
      let newHeight = windowHeight - 50;
      myDivs['menu'].size(null, newHeight);
    } else {
      myDivs['menu'].size(null, null);
    }
    myDivs['menu'].style('overflow', "auto");
    myDivs['menu'].position(10, 10);
    noClickZone = [10, myDivs['menu'].size().width + 10, windowHeight - 2* myDivs['menu'].size().height, windowHeight];
    if (hideMenu == true){
      myDivs['menu'].hide();
      noClickZone = [-1, -1, -1, -1];
    } else {
      myDivs['menu'].show();
    }
    showDev = ! showDev;
    showDevDiv();
  }
}

function toggleDevOptions(button) {
  jlog('Main', 'toggleDevOptions');
  item = parseInt(button.srcElement.value);
  switch (item) {
    case 0:
      showFPS = !showFPS;
      break;
    case 1:
      clickDebug = !clickDebug;
      break;
    case 2:
      printStack = !printStack;
      break;
    case 3:
      doJLOGCountDown = 50;
      break;
  }
}

function showDevDiv(){
  showDev = ! showDev;
  if (showDev == false){
    if (myDivs['devDiv']) {
      myDivs['devDiv'].remove();
    }
    return;
  }
  if (myDivs['devDiv']) {
    myDivs['devDiv'].remove();
  }
  myDivs['devDiv']= createDiv();
  myDivs['devDiv'].style('font-size', '12px');
  myDivs['devDiv'].style('background-color', 'DimGray');
  myDivs['devDiv'].style('padding', '10px');
  myDivs['devDiv'].style('outline', '1px solid black');
  addButtonToDiv('save json', 0, saveCells, myDivs['devDiv']);
  addButtonToDiv('show FPS', 0, toggleDevOptions, myDivs['devDiv']);
  addButtonToDiv('click log', 1, toggleDevOptions, myDivs['devDiv']);
  addButtonToDiv('print stack', 2, toggleDevOptions, myDivs['devDiv']);
  addButtonToDiv('tmi log', 3, toggleDevOptions, myDivs['devDiv']);
  addButtonToDiv('free colors', 3, whatsLeft, myDivs['devDiv']);
  addButtonToDiv('clean', 3, cells.clean, myDivs['devDiv']);
  addButtonToDiv('load wip', demos.length-1, loadCellsFromButtonClick, myDivs['devDiv']);
  myDivs['devDiv'].position(windowWidth - (40 + myDivs['devDiv'].size().width), 10);
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

function createPresentationDiv(){
  jlog('Main', 'createPresentationDiv');
  presentationDivs['main'] = createDiv();
  presentationDivs['main'].style('font-size', '16px');
  // presentationDivs['main'].style('background-color', 'DimGray');
  presentationDivs['main'].style('padding', '10px');
  // presentationDivs['main'].size(null, null);
  presentationDivs['main'].style('overflow', "auto");
  presentationDivs['main'].position(10, 10);
}

function addToPresentation(myString) {
  jlog('Main', 'addToPresentation');
  presentationDivs['main'].html(myString + '<br>', true);
}

function doTutorials(loaded) {
  jlog('Main', 'doTutorials');
  if (tutorial == true){
    let noIframe = true;
    try {
      noIframe = window.self == window.top;
    } catch (e) {
      noIframe = true;
    }
    if (noIframe == true) {
      let myDiv = createDiv('<a href="https://b38tn1k.com/code/ux/2022/09/08/blocks-explained/"> back to tutorial </a>');
      myDiv.style('font-size', '16px');
      textSize(16);
      myDiv.position(windowWidth - textWidth(' back to tutorial '), windowHeight - 40);
    }
    switch(tutorialstring) {
      case '#tutorialBlank':
        break;
      case '#tutorialHello':
        cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
        cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
        loadCells(demos[0]);
        cells.cells[0].reshape();
        cells.cells[0].refresh();
        if (zoomMode == true){
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
        cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
        cells.addCell(T_CONSOLE, windowWidth - 2.5 * cells.dWidth);
        cells.cells[0].x = windowWidth * 2;
        cells.cells[1].x = windowWidth * 2;
        cells.addCell(T_CONST, 1.5 * myDivs['menu'].size().width);
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
        cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
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
        cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
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
      cells.addCell(T_START, 1.5 * myDivs['menu'].size().width);
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
  jlog('Main', 'checkAnOrUpdateTutorial');
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
