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

function inClickableZone() {
  let res = true;
  if (mouseX > noClickZone[0] && mouseX < noClickZone[1]){
    if (mouseY > noClickZone[2] && mouseY < noClickZone[3]){
      res = false;
    }
  }
  return res;
}

function mousePressed() {
  frameRate(100);
  jlog('Main', 'mousePressed');
  if (mobileDeviceDetected == true && mobileHAddon == true) {
    newCell(mobileHType, mouseX, mouseY); // call it again;
  } else {
    if (inClickableZone() === true) { // this was commented out but I forget why

      doMouseDrag = !(cells.checkSelected(mouseX, mouseY));

    } else {
      doMouseDrag = false;
    }
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
  demos.push(loadJSON('assets/demo12.json'));
  demos.push(loadJSON('assets/demo13.json'));
  demos.push(loadJSON('assets/demo14.json'));
  demos.push(loadJSON('assets/demo15.json'));

  demos.push(loadJSON('assets/wip-demo.json'));
}

function setup() {
  jlog('Main', 'setup');
  if (getURL().indexOf("##")  != -1) { // hijack earlier
    showGUI = false;
    presentationMode = true;
    autoStart = true;
    runMode = RM_PRESENT;
  }
  pixelDensity(1);
  mainDiv = document.getElementById('main');
  myDivs['devDiv']= createDiv();
  colorSetup();
  setupScreen();
  cells = new Cells(allColors['colors'], allColors['highlights'], allColors['lowlights'], allColors['icolors'], allColors['dtcolors']);
  mobileSettings()
  controller = new Controller();
  myDivs['menu']= createDiv();
  createMenuDiv();
  xOff = 0;
  yOff = 0;
  xPos = 0;
  yPos = 0;
  showDev = ! showDev; //lazy
  showDevDiv();
  doLastBit();
  if (autoStart == true) {
    cells.run = true;
    fastMode = 1;
  }
}

function draw() {
  notIdle = (focused || cells.redrawFlag || cells.run || controller.tidyFlag || testTimer != TST_OFF || tidyFlag > 0 || frameCount < 100);
  if (showFPS == true){
    controller.d_print(frameRate().toFixed(2), true, '<br>FPS: ');
  }
  if (notIdle == true){
    fpsSetValue = 30;
  } else {
    fpsSetValue = 5;
  }
  if (redrawCounter != 0) {
    clear();
  }
  if (runMode == RM_NORMAL) {
    if ((tutorial == false) && (scrollX != 0 || scrollY != 0)) {
      window.scrollTo(0, 0);
      cells.updateView(xPos, yPos, false);
      cells.rebuildMenuFlag = true;
    }
    if (notIdle == true) {
      mouseDrag();
      cells.updateView(xPos, yPos, doMouseDrag);
    }

    if (redrawCounter != 0) {
      drawGrid();
      cells.draw();
      redrawCounter -= 1;
    }
    if (cells.redrawFlag == true || cells.run == true){
      redrawCounter = 2;
    }
    if (notIdle == true) {
      cells.update(mouseX, mouseY, mouseIsPressed);
    }
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
        frameRate(fpsSetValue);
      }
    }

    if (tidyFlag > 0) {
      tidy();
      cells.updateView(xPos, yPos, true);
      tidyFlag -= 1;
    }
    if (cells.rebuildMenuFlag == true){
      myDivs['menu'].remove();
      myDivs['menu']= createDiv();
      createMenuDiv();
      cells.rebuildMenuFlag = false;
    }

    if (testTimer != TST_OFF) {
      let readyToStep = (millis() - testPacer > testPaceSettings[testTimer]);
      if (cells.run == false && readyToStep == true) {
        switch(testTimer) {
          case TST_LOAD:
            currentTestIndex += 1;
            if (currentTestIndex == demos.length-1){
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
  } else if (runMode == RM_CREATE){
    clear();
    drawGrid();
  } else if (runMode == RM_PRESENT){
    controller.update(cells, flash, fastMode);
  }
}
