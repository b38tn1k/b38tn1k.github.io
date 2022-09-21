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
  frameRate(100);
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
//   } else
//   if (key == 's') {
//     save();
//   }
// }

function preload() {
  jlog('Main', 'preload');
  c = loadStrings('assets/nintendo-entertainment-system.hex');
  demos.push(loadJSON('assets/helloworld.json'));
  demos.push(loadJSON('assets/demo1.json'));
  demos.push(loadJSON('assets/demo2.json'));
  demos.push(loadJSON('assets/demo3.json'));
  demos.push(loadJSON('assets/demo4.json'));
  demos.push(loadJSON('assets/demo5.json'));
  demos.push(loadJSON('assets/demo6.json'));
  demos.push(loadJSON('assets/demo7.json'));
  demos.push(loadJSON('assets/demo8.json'));
  demos.push(loadJSON('assets/demo9.json'));
  demos.push(loadJSON('assets/demo10.json'));
  demos.push(loadJSON('assets/demo11.json'));
}

function setup() {
  jlog('Main', 'setup');
  pixelDensity(1);
  mainDiv = document.getElementById('main');
  colorSetup();
  setupScreen();
  cells = new Cells(allColors['colors'], allColors['highlights'], allColors['lowlights'], allColors['icolors'], allColors['dtcolors']);
  mobileSettings()
  controller = new Controller();
  menu = createDiv();
  createMenuDiv();
  xOff = 0;
  yOff = 0;
  xPos = 0;
  yPos = 0;
  doLastBit();
}

function draw() {
  // if (mobileHack == true && cells.activeIndex == -1){
  //   mainDiv.scrollTop = 0;
  //   mainDiv.scrollLeft = 0;
  // }
  // doJLOG = cells.run;
  if (redrawCounter != 0) {
    clear();
  }
  mouseDrag();
  cells.updateView(xPos, yPos, doMouseDrag);
  if (redrawCounter != 0) {
    drawGrid();
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
  if (controller.tidyFlag == true) {
    setTidyFlag();
    controller.tidyFlag = false;
  }
  if (cells.run == true && slowMode == true) {
    frameRate(5);
  } else {
    if (redrawCounter != 0) {
      frameRate(100);
    } else {
      frameRate(30);
    }
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

  if (testTimer != TST_OFF) {
    let readyToStep = (millis() - testPacer > testPaceSettings[testTimer]);
    if (cells.run == false && readyToStep == true) {
      switch(testTimer) {
        case TST_LOAD:
          currentTestIndex += 1;
          if (currentTestIndex == demos.length){
            if (testLoop == true) {
              currentTestIndex = 0;
            } else {
              testTimer = TST_OFF;
            }
          } else {
            testPacer = millis();
            loadCells(demos[currentTestIndex]);
            setTidyFlag();
            testTimer = TST_TIDY;
          }
          break;
        case TST_TIDY:
          testPacer = millis();
          testTimer = TST_RUN;
          break;
        case TST_RUN:
          testPacer = millis();
          cells.run = true;
          testTimer = TST_PAUSE;
          break;
        case TST_PAUSE:
          testPacer = millis();
          testTimer = TST_LOAD;
          break;
      }
    }
  }
  checkAnOrUpdateTutorial();
}
