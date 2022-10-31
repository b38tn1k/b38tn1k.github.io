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
    case '#tutorialPLM':
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
      loaded = true;
      createPresentation();
      pres.cells[1].addChild(0, pres.cells[0]);
      pres.cells[1].input.value('Input:')
      pres.cells[0].addParent(1, pres.cells[1]);
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
      case '#tutorialPLM':
        disableDrag = true;
        break;

      }
    }
}
