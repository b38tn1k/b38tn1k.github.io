function shareLink() {
  jlog('Main', 'shareLink');
  // shareLinkGenerated = true;
  myDivs['shareLink'] = createDiv();
  myDivs['shareLink'].style('background-color', 'DimGray');
  myDivs['shareLink'].style('padding', '10px');
  myDivs['shareLink'].style('outline', '1px solid black');
  let w = 200;
  myDivs['shareLink'].size(w, AUTO);
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
  pres.presBackup = cells.saveCells(true);
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
  myDivs['presTools'].size(myDivs['menu'].width, AUTO);
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
  shareLinkString = pres.putInAddyBar(true);
  let scriptLink = shareLinkString.replace('#', '##');
  exitPresentationMode();
  window.open(scriptLink);
  doMouseDrag = false;
}

function shareProject() {
  jlog('Main', 'shareProject');
  shareLinkString = cells.putInAddyBar();
  cancelShare();
  window.open(shareLinkString);
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
  } else if (cssClass == 'big') {
    button.style('height', '100%');
    button.style('width', '100%');
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
  addButtonToDiv('origin', 13, imlost, myDivs['utils']);
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
  myDivs['refactor'].remove();
  myDivs['refactorInputs'] = [];
  myDivs['refactorPriors'] = [];
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
      myDivs['menu'].size(AUTO, newHeight);
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

function createPresentationDiv(){
  jlog('Main', 'createPresentationDiv');
  presentationDivs['main'] = createDiv();
  presentationDivs['main'].style('font-size', '16px');
  presentationDivs['main'].style('padding', '10px');
  presentationDivs['main'].style('overflow', "auto");
  presentationDivs['main'].position(10, 10);
  if (presentationMode == true) {
    presentationDivs['main'].show();
    console.log(cells.layoutArray);
  } else {
    presentationDivs['main'].hide();
  }

  presentationDivs['dftWrapper'] = createDiv();
  presentationDivs['dftWrapper'].style('font-size', '16px');
  presentationDivs['dftWrapper'].style('border', "1px solid black")
  presentationDivs['dftWrapper'].size((windowWidth - (40 * pixelDensity())), 150);
  presentationDivs['dftWrapper'].style('overflow', "hidden");
  presentationDivs['dftWrapper'].parent(presentationDivs['main']);

  presentationDivs['consoleWrapper'] = createDiv();
  // presentationDivs['consoleWrapper'].size(100, AUTO);
  presentationDivs['consoleWrapper'].style('padding', "10px");
  presentationDivs['consoleWrapper'].style('overflow', "hidden");
  presentationDivs['consoleWrapper'].style('position', "absolute");
  presentationDivs['consoleWrapper'].parent(presentationDivs['dftWrapper']);
  addButtonToDiv('run', 3, runFromButton, presentationDivs['consoleWrapper']);

  presentationDivs['console'] = createDiv();
  presentationDivs['console'].style('padding', "10px");
  presentationDivs['console'].size((presentationDivs['dftWrapper'].size().width - 40), (presentationDivs['dftWrapper'].size().height - presentationDivs['consoleWrapper'].size().height - 20));
  presentationDivs['console'].style('overflow', "scroll");
  presentationDivs['console'].style('position', "relative");
  presentationDivs['console'].style('border', "1px solid black")
  presentationDivs['console'].parent(presentationDivs['consoleWrapper']);
}

function addToPresentation(myString, div) {
  jlog('Main', 'addToPresentation');

  if (div == 'console') {
    presentationDivs[div].html(myString, true);
    presentationDivs['console'].elt.scrollTop = 1000 * presentationDivs['console'].html().length;
  }
}
