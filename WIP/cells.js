class Cells {
  constructor(c, h, l, i, dt) {
    jlog('Cells', 'constructor');
    this.cells = [];
    this.dWidth = 80;
    this.dHeight = 40;
    this.dRadius = 5;
    this.activeIndex = -1;
    this.colors = c;
    this.highlights = h;
    this.lowlights = l;
    this.inverted = i;
    this.dualtone = dt;
    this.varNames = 'abcdefghijklmnopqrstuvwxyz';
    this.varHandles = ['unset'];
    this.map = {};
    this.run = false;
    this.viewXdelta = 0;
    this.viewYdelta = 0;
    this.cellsInView = [];
    this.oldMouse = true;
    this.rebuildMenuFlag = false;
    this.redrawFlag = false;
    this.parentFlag = 0;
    this.parentWidthRecord = [-1, 0];
    this.partialUpdate = [];
    // this.refactors = [];
  }

  get length() {
    jlog('Cells', 'length');
    return this.cells.length;
  }

  tidy(xMin, yMin) {
    jlog('Cells', 'tidy');
    let bigBlocks = [];
    let consol, start;
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].parent == -1) {
        if (this.cells[i].type != T_START && this.cells[i].type != T_CONSOLE) {
          this.cells[i].reshape(true);
          bigBlocks.push(this.cells[i]);
        } // i hate this but..
      } else {
        let parType = this.cells[this.cells[i].parent].type;
        let cType = this.cells[i].type;
        if (blockConfig[parType]['accept child'].indexOf(cType) == -1) {
          bigBlocks.push(this.cells[i]);
        }
      }
    }
    this.cells[1].resizeConsole();
    // bigBlocks.sort(function(a, b) {return a.width - b.width});
    // bigBlocks.sort(function(a, b) {return sqrt(a.x**2 + a.y**2) - sqrt(b.x**2 + b.y**2)});
    bigBlocks.sort(function(a, b) {return a.width * a.height - b.width * b.height});
    bigBlocks.unshift(this.cells[0], this.cells[1]);
    let x = xMin;
    let y = yMin;
    let offset = 0;
    let newPos = [];
    for (let i = 0; i < bigBlocks.length; i++) {
      if (y + bigBlocks[i].height > windowHeight || i < 2) {
        x += offset + bigBlocks[i].childXBorder * 3;
        y = yMin;
        offset = 0;
      }
      newPos.push([x, y]);
      bigBlocks[i].reshape();
      if (bigBlocks[i].width > offset) {
        offset = bigBlocks[i].width;
      }
      y += bigBlocks[i].height + bigBlocks[i].childYBorder;
    }
    for (let i = 0; i < bigBlocks.length; i++) {
      bigBlocks[i].x = newPos[i][0];
      bigBlocks[i].y = newPos[i][1];
      // bigBlocks[i].reshape();
      bigBlocks[i].updateAllDivPositions();
    }
    this.updateView(this.viewX, this.viewY, false);
    this.mapAndLink();
    this.rebuildMenuFlag = true;
  }

  saveCells() {
    jlog('Cells', 'saveCells');
    this.mapAndLink();
    let snapshot = {}
    for (let i = 0; i < this.length; i++) {
      snapshot[i] = {};
      snapshot[i]['x'] = int(this.cells[i].x);
      snapshot[i]['y'] = int(this.cells[i].y);
      snapshot[i]['t'] = this.cells[i].type;
      snapshot[i]['h'] = this.cells[i].hide;
      snapshot[i]['s'] = this.cells[i].shrink;
      snapshot[i]['d'] = this.cells[i].dataSH;
      snapshot[i]['i'] = this.cells[i].handleSH;
      snapshot[i]['p'] = this.cells[i].parent;
      snapshot[i]['c'] = this.cells[i].childIndicies;
      if (i == 1){
        snapshot[i]['tL'] = blockConfig[T_CONSOLE]['block label'];
      } else {
        snapshot[i]['tL'] = this.cells[i].textLabel;
      }
      snapshot[i]['L'] = this.cells[i].indexLabeldiv.html();
    }
    return snapshot;
  }

  addCellWithInfo(info) {
    jlog('Cells', 'addCellWithInfo');
    let type = info.t;
    if (type > this.colors.length){
      type = this.cells[info.p].type;
    }
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    if (type == T_START) {
      c = [this.colors[type], this.highlights[type], this.colors[49], this.inverted[type], this.dualtone[type]];
    }
    let newCell = this.length;
    this.cells.push(new Cell(info.t, info.x, info.y, this.dWidth, this.dHeight, c, this.dRadius));
    this.cells[newCell].hide = info.h;
    this.cells[newCell].shrink = info.s;
    // this.cells[newCell].dataSH = info.d;
    this.cells[newCell].updateDataSH(info.d);
    // this.cells[newCell].handleSH = info.i;
    this.cells[newCell].updateHandleSH(info.i);
    this.varHandles.push(info.i);
    this.cells[newCell].parent = info.p;
    if (info.t == T_OUTLET || info.t == T_VAR || info.t == T_INPUT || info.t == T_INLET){
      this.cells[newCell].textLabel = info.tL;
      this.cells[newCell].indexLabeldiv.html(info.L);
      this.cells[newCell].updateHandleSH(info.i);
      this.cells[newCell].updateDataSH(info.d);
    }
    if (blockConfig[this.cells[newCell].type]['input type'] == I_SELECT) {
      this.cells[newCell].input.option(info.i);
      this.cells[newCell].input.selected(info.i);
    }
    if (blockConfig[this.cells[newCell].type]['input type'] == I_TEXT || blockConfig[this.cells[newCell].type]['input type'] == I_TEXT_AREA) {
      if (this.cells[newCell].type == T_BLOCK) {
        this.cells[newCell].input.value(info.i);
      } else {
        this.cells[newCell].input.value(info.d);
      }
    }
    this.cells[newCell].refresh(this.viewXdelta, this.viewYdelta);
    if (this.cells[newCell].hide == true) {
      this.cells[newCell].hideBlock();
    }
    this.cells[newCell].updateAllDivPositions();
    this.rebuildMenuFlag = true;
  }

  nudgeX(x) {
    jlog('Cells', 'nudgeX');
    let nudgeVal = 0;
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].x < x) {
        nudgeVal = max(nudgeVal, x - this.cells[i].x);
      }
    }
    for (let i = 0; i < this.length; i++) {
      this.cells[i].moveC(this.cells[i].x + nudgeVal, this.cells[i].y, this.viewXdelta, this.viewYdelta);
    }
  }

  putInAddyBar() {
    jlog('Cells', 'putInAddyBar');
    let myURL = getURL();
    if (myURL.indexOf('#') != -1) {
      myURL = myURL.slice(0, myURL.indexOf('#'));
    }
    let myString = myURL + '#' + encodeURIComponent(JSON.stringify(this.saveCells()));
    return myString;
  }

  makeFromAddyBar(myString=getURL()) {
    jlog('Cells', 'makeFromAddyBar');
    if (myString.indexOf('#') == -1) {
      return false;
    }
    try {
      let myURI = myString.slice(myString.indexOf('#')+1)
      if (myURI[0] == '#') {
        myURI = myURI.slice(1);
      }
      let myJSONString = decodeURIComponent(myURI);
      let myLoaderMap = JSON.parse(myJSONString);
      for (key in Object.keys(myLoaderMap)) {
        cells.addCellWithInfo(myLoaderMap[key]);
      }
      for (key in Object.keys(myLoaderMap)) {
        cells.linkChildren(key, myLoaderMap[key]);
      }
      for (let i = 0; i < this.length; i++) {
        this.cells[i].reshape(true);
      }
    } catch (e) {
      console.log('failed to load', e);
      return false;
    }
    return true;
  }

  linkChildren(ind, info) {
    jlog('Cells', 'linkChildren');
    let id = parseInt(ind);
    for (let i = 0; i < info.c.length; i++) {
      this.cells[id].forcefullyAddChildren(info.c[i], this.cells[info.c[i]], true);
    }
  }

  // turnOffActiveIndex() {
  //   if (this.activeIndex != -1) {
  //     this.cells[this.activeIndex].mode = M_IDLE;
  //     this.activeIndex = -1;
  //   }
  // }

  pushChild(type, myBlockIndex, myBlock, childData){
    jlog('Cells', 'pushChild');
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    let child = new Cell(type, myBlock.viewX, myBlock.viewY, this.dWidth, this.dHeight, c, this.dRadius);
    child.updateDataSH(childData);
    // child.updateHandleSH('newData');
    child.input.value(childData, childData);
    myBlock.addChild(this.length, child);
    child.addParent(myBlockIndex, myBlock);
    this.cells.push(child);
    this.rebuildMenuFlag = true;
    myBlock.reshape();

    return child;
  }

  replaceWithType(type, parent, oldBlock, targetIndex, source){
    jlog('Cells', 'replaceWithType');
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    let child = new Cell(type, oldBlock.viewX, oldBlock.viewY, this.dWidth, this.dHeight, c, this.dRadius);
    child.parent = oldBlock.parent;
    let indexInParent = parent.childIndicies.indexOf(targetIndex);
    parent.children[indexInParent] = child;
    oldBlock.mode = M_DELETE;
    oldBlock.cleanForDeletionSafe();
    oldBlock.mode = M_IDLE;
    this.cells[targetIndex] = child;
    this.mapAndLink();
    this.cells[targetIndex].updateDataSH(source.dataSH, true);
    this.cells[targetIndex].updateHandleSH(source.handleSH);
    return child;
  }

  addCell(type, startX, y = 17) {
    jlog('Cells', 'addCell');
    this.rebuildMenuFlag = true;
    this.mapAndLink();
    let x = startX;//0.15 * windowWidth;
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    if (type == T_START) {
      c = [this.colors[type], this.highlights[type], this.colors[49], this.inverted[type], this.dualtone[type]];
    }
    this.cells.push(new Cell(type, x, y, this.dWidth, this.dHeight, c, this.dRadius));
    let pIndex = this.length - 1;
    if (type == T_PRINT) {
      c = [this.colors[T_VAR], this.highlights[T_VAR], this.lowlights[T_VAR], this.inverted[T_VAR], this.dualtone[T_VAR]];
      this.cells.push(new Cell(T_VAR, x, y, this.dWidth, this.dHeight, c, this.dRadius));
      this.cells[pIndex].addChild(pIndex+1, this.cells[pIndex+1])
      this.cells[pIndex+1].addParent(pIndex, this.cells[pIndex]);
      this.cells[pIndex+1].input.option('unset', 'unset');
      this.cells[pIndex+1].input.selected('unset');
    }
    if (type == T_INPUT) {
      let tempID = this.getID(4);
      this.cells[pIndex].updateHandleSH(tempID);
      // this.cells[pIndex].textLabel += ' ' + tempID;
      // this.cells[pIndex].indexLabeldiv.html(this.cells[pIndex].textLabel);
      this.varHandles.push(tempID);
    }
    if (type == T_IF || type == T_WHILE || type == T_FOR) {
      let counter = 2;
      if (type == T_FOR) {
        this.cells.push(new Cell(T_RANGE, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
        this.cells[pIndex + 1].updateHandleSH('unset');
      } else {
        this.cells.push(new Cell(T_CONDITION, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      }
      this.cells.push(new Cell(T_DO, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      for (let i = 1; i <= counter; i++) {
        this.cells[pIndex].addChild(pIndex + i, this.cells[pIndex + i], true);
        this.cells[pIndex + i].addParent(pIndex, this.cells[pIndex], true);
      }
      this.cells[pIndex].refresh(this.viewXdelta, this.viewYdelta);
    }

    if (blockConfig[type]['accept child'].indexOf(T_INDEX) != -1) {
      this.cells.push(new Cell(T_INDEX, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      let cIndex = this.length-1;
      this.cells[pIndex].addChild(cIndex, this.cells[cIndex]);
      this.cells[cIndex].addParent(pIndex, this.cells[pIndex]);
    }
    if (blockConfig[type]['accept child'].indexOf(T_REF) != -1) {
      this.cells.push(new Cell(T_REF, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      let cIndex = this.length-1;
      this.cells[pIndex].addChild(cIndex, this.cells[cIndex]);
      this.cells[cIndex].addParent(pIndex, this.cells[pIndex]);
    }

    if (blockConfig[type]['accept child'].indexOf(T_OUTLET) != -1) {
      this.cells.push(new Cell(T_OUTLET, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      this.cells[pIndex].addChild(pIndex + 1, this.cells[pIndex + 1]);
      this.cells[pIndex + 1].addParent(pIndex, this.cells[pIndex]);
      this.cells[pIndex + 1].handleSH= 'unset';//tempID;
      this.cells[pIndex + 1].indexLabeldiv.html(this.cells[pIndex + 1].textLabel);
      this.cells[pIndex + 1].updateDataSH('unset');
      this.cells[pIndex + 1].input.option('unset', 'unset');
      this.cells[pIndex + 1].input.selected('unset');
      if (this.varHandles.indexOf('unset') == -1){
        this.varHandles.push('unset');
      }
    }
    if (type == T_BLOCK) {
      let tempID = this.getID(2);
      this.cells[pIndex].updateHandleSH(tempID);
      this.cells[pIndex].input.value(tempID, tempID);
    //   this.cells[pIndex].handleSH = this.cells[pIndex].input.value();
    }
    this.cells[pIndex].reshape();
    if (type != T_START && type != T_CONSOLE) {
      this.cells[pIndex].mode = M_NEW;
      this.activeIndex = pIndex;
    }
    if (type == T_TURTLE) {
      let index = this.length;
      for (let i = 0; i < turtleVars.length; i++) {
        this.cells.push(new Cell(T_INLET, x, y, this.dWidth, this.dHeight, c, this.dRadius));
        this.cells[index + i].updateHandleSH(turtleVars[i]);
        this.cells[index + i].updateDataSH(0);
        this.cells[pIndex].addChild(index + i, this.cells[index + i])
        this.cells[index + i].addParent(pIndex, this.cells[pIndex]);
      }
    }
    for (let i = pIndex; i < this.length; i++) {
      this.cellsInView.push(i);
    }
  }

  quickClear(){
    for (let i = 2; i < this.length; i++){
      this.cells[i].indexLabeldiv.remove();
      if (this.cells[i].input) {
        this.cells[i].input.remove();
      }
    }
    this.cells[0].children = [];
    this.cells[0].resetDims(true);
    this.cells[0].childIndicies = [];
    this.cells[1].reshape(true);
    this.cells.splice(2);

  }

  getID(count) {
    jlog('Cells', 'getID');
    let tempID = '';
    for (let i = 0; i < count; i++) {
      tempID += this.varNames[floor(random(0, this.varNames.length))];
    }
    if (this.varHandles.indexOf(tempID) != -1) {
      tempID = this.getID();
    }
    return tempID;
  }

  checkSelected(x, y) {
    jlog('Cells', 'checkSelected');
    let inArea = false;
    if (this.activeIndex != -1){
      if (this.cells[this.activeIndex].mode == M_NEW){
        this.cells[this.activeIndex].mode = M_MOVE;
        return true;
      }
    }
    for (let j = 0; j < this.cellsInView.length; j++) {
      let i = this.cellsInView[j];
      if (this.cells[i].inArea(x, y) === true) {
        inArea = true;
        this.cells[i].mode = M_SELECTED;
        if (this.cells[i].checkButtons(x, y) === true) {
          this.activeIndex = i;
          break;
        }
      } else {
        this.cells[i].mode = M_IDLE;
        this.activeIndex = -1;
      }
    }
    return inArea;
  }

  pprint(myStr) {
    jlog('Cells', 'pprint');
    myStr += '\ncell:     \t'
    for (let i = 0; i < this.cells.length; i++){
      myStr += String(i) + '\t';
    }
    myStr += '\nmode:  \t';
    for (let i = 0; i < this.cells.length; i++){
      myStr += String(this.cells[i].mode) + '\t';
    }
    myStr += '\n#child: \t';
    for (let i = 0; i < this.cells.length; i++){
      myStr += String(this.cells[i].childIndicies.length) + '\t';
    }
    myStr += '\nChild Indicies for Cell: \n';
    for (let i = 0; i < this.cells.length; i++){
      if (this.cells[i].childIndicies.length > 0) {
        myStr += 'Cell ' + String(i) + '\t\t\t';
        for (let j = 0; j < this.cells[i].childIndicies.length; j++) {
          myStr += String(this.cells[i].childIndicies[j]) + '\t'
        }
        myStr+='\n'
      }
    }
  }

  startStop(x, y, mdown) {
    jlog('Cells', 'startStop');
    this.run = ! this.run;
    this.cells[this.activeIndex].mode = M_IDLE;
    this.cells[this.activeIndex].toggleStartForm(this.run);
  }

  stop() {
    jlog('Cells', 'stop');
    this.run = false;
    this.cells[0].toggleStartForm(false);
  }

  doDelete(x, y, mdown) {
    jlog('Cells', 'doDelete');
    this.rebuildMenuFlag = true;
    let gotoVarHandleCatcher = [];
    let rebuildFlag = false;
    let delHandle = [];
    if (this.length == 1) { // last cell
      this.cells[0].cleanForDeletionSafe();
      this.cells = [];
    } else {
      // recursive call to find all children to also be deleted
      this.cells[this.activeIndex].markForDeletion();
      let map = []; // for the 'survivors'
      for (let i = 0; i < this.length; i++) {
        if (this.cells[i].mode != M_DELETE){
          map.push(i); // find all cells that will not be deleted
        } else {
          if (this.cells[i].handleSH) {
            rebuildFlag = true;
            if (this.cells[i].type != T_INPUT && this.cells[i].type != T_BLOCK){
              gotoVarHandleCatcher.push(this.cells[i].handleSH);
            }
            if (this.cells[i].handleSH != 'unset') {
              delHandle.push(this.cells[i].handleSH);
              this.varHandles.splice(this.varHandles.indexOf(this.cells[i].handleSH), 1);
            }
          }
          let tdv = this.cellsInView.indexOf(i);
          if (tdv != -1){
            this.cellsInView.splice(tdv, 1);
            this.parentFlag += 1;
          }
        }
        // remove parent / child links and divs for those in delete mode
        let parent = this.cells[i].cleanForDeletionSafe();
        if (parent != -1 && this.cells[parent]){
          let pParent = this.cells[parent].removeChild(i);
          while (pParent != -1) {
            if (this.cells[pParent]) {
              this.cells[pParent].minHeight = 0;
              this.cells[pParent].reshape(true);
              pParent = this.cells[pParent].parent;
            }
          }
        }
      }
      // reassign parent/child relationship
      for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < this.cells[i].childIndicies.length; j++) {
          let oldCI = this.cells[i].childIndicies[j]
          let oldPI = i;
          let newCI = map.indexOf(oldCI);
          let newPI = map.indexOf(oldPI);
          this.cells[oldCI].parent = newPI;
          this.cells[i].childIndicies[j] = newCI;
        }
      }
      // console.log('made it this far')// nope
      // recreate the cell list
      let newCells = [];
      for (let i = 0; i < map.length; i++) {
        newCells.push(this.cells[map[i]]);
      }
      this.cells = newCells;
    }
    this.activeIndex = -1;
    if (rebuildFlag === true) {
      for (let i = 0; i < this.length; i++) {
        if (blockConfig[this.cells[i].type]['input type'] == I_SELECT) {
          this.cells[i].input.remove();
          // if (this.cells[i].type != T_GOTO){
          //   this.cells[i].varLabeldiv.remove();
          // }
          this.cells[i].buildDivs();
        }
      }

      for (let i = 0; i < this.length; i++) {
        if (blockConfig[this.cells[i].type]['input type'] == I_SELECT) {
          if (delHandle.indexOf(this.cells[i].handleSH) != -1 && gotoVarHandleCatcher.indexOf(this.cells[i].handleSH) == -1) {
            this.cells[i].input.option('unset');
          } else {
            this.cells[i].input.option(this.cells[i].handleSH);
            this.cells[i].input.selected(this.cells[i].handleSH);
          }
        }
      }
    }
  }

  doCopy(programatic = false, parent = -1){
    jlog('Cells', 'doCopy');
    let type = this.cells[this.activeIndex].type;
    let x = this.cells[this.activeIndex].x;
    let y = this.cells[this.activeIndex].y;
    let c = this.cells[this.activeIndex].colors;
    let handle = this.cells[this.activeIndex].handleSH;
    let val = this.cells[this.activeIndex].dataSH;
    let opts = this.cells[this.activeIndex].inputOptions;
    this.cells[this.activeIndex].mode = M_IDLE;
    const oldAI = this.activeIndex;

    // let w = this.cells[this.activeIndex].width;
    // let h = this.cells[this.activeIndex].height;
    this.activeIndex = this.length;
    let iCanHasChild = true;
    if (type == T_BLOCK){
      iCanHasChild = false;
      type  = T_GOTO;
      c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    }
    if (type == T_INPUT || type == T_RANGE){
      iCanHasChild = false;
      type  = T_VAR;
      c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    }
    if (programatic == false) {
      if (type == T_OUTLET){
        iCanHasChild = false;
        type  = T_VAR;
        c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
      }
    }
    if (type == T_INLET){
      iCanHasChild = false;
      type  = T_VAR;
    }
    this.cells.push(new Cell(type, x, y, this.dWidth, this.dHeight, c, this.dRadius));

    let newAI = this.activeIndex;
    this.cells[this.activeIndex].mode = M_NEW;
    this.cells[this.activeIndex].handleSH = handle;
    this.cells[this.activeIndex].dataSH = val;
    if (parent != -1) {
      this.cells[this.activeIndex].parent = parent;
    }
    // if (type == T_VAR) {
    if (blockConfig[type]['input type'] == I_SELECT) {
      for (let i = 0; i < opts.length; i++) {
        this.cells[this.activeIndex].inputOptions.push(opts[i]);
      }
      this.cells[newAI].input.selected(this.cells[newAI].handleSH);
    }
    if (blockConfig[type]['input type'] == I_TEXT) {
      this.cells[this.activeIndex].input.value(val, val);
    }
    if (iCanHasChild == true) {
      const childrenStart = this.length;
      for (let i = 0; i < this.cells[oldAI].childIndicies.length; i++) {
        this.activeIndex = this.cells[oldAI].childIndicies[i];
        this.doCopy(true, newAI);
      }
      this.activeIndex = newAI;

      for (let i = childrenStart; i < this.length; i++){
        this.cells[i].mode = M_IDLE;
        let parentIndex = this.cells[i].parent;
        this.cells[parentIndex].addChild(i, this.cells[i]);
        this.cells[i].addParent(parentIndex, this.cells[parentIndex]);
      }
      this.cells[this.activeIndex].mode = M_NEW;
      if (programatic == true) {
        for (let i = this.length-1; i != newAI; i--){
          this.cells[i].minHeight = 0;
          this.cells[i].reshape(true);
        }
      }

      this.mapAndLink();
    }
  }

  doMove(x, y, mdown) {
    jlog('Cells', 'doMove');
    console.log('moving');
    this.cells[this.activeIndex].moveC(x, y, this.viewXdelta, this.viewYdelta);
    if (this.cells[this.activeIndex].parent != -1) {
      this.cells[this.cells[this.activeIndex].parent].removeChild(this.activeIndex);
      this.cells[this.activeIndex].removeParent();
    }
  }

  doParentDrop(x, y, mdown) {
    jlog('Cells', 'doParentDrop');
    let pParentIndexes = [];
    // let pMoveIndexes = [];
    if (this.cells[this.activeIndex].type != T_START) {
      for (let j = 0; j < this.cellsInView.length; j++) {
        let i = this.cellsInView[j];

        if (this.cells[i].inArea(x, y) === true && i != this.activeIndex) {
          this.cells[i].underneath = mdown || this.cells[this.activeIndex].mode == M_NEW;
        } else {
          this.cells[i].underneath = false;
        }
        if (this.cells[i].inArea(x, y) === true && i != this.activeIndex) {
          if (this.cells[i].acceptsChild(this.cells[this.activeIndex].type)) {
            this.cells[i].highlight = mdown || this.cells[this.activeIndex].mode == M_NEW;
            pParentIndexes.push(i);
          } else {
            // pMoveIndexes.push(i);
          }
        } else {
          this.cells[i].highlight = false;
        }
      }
    }

    // release
    if (mdown === false && this.cells[this.activeIndex].mode == M_MOVE) {
      // if (pMoveIndexes.length != 0) {
      //   for (let i = 0; i < pMoveIndexes.length; i++) {
      //     console.log(this.cells[pMoveIndexes[i]].textLabel);
      //   }
      // }
      // create parent/child link and initial align
      if (pParentIndexes.length != 0) {
        // make parent trees
        let parentTree = [];
        for (let i = 0; i < pParentIndexes.length; i++) {
          // let branch = [pParentIndexes[i]];
          let branch = 1;

          parent = this.cells[pParentIndexes[i]].parent;
          while (parent != -1) {
            // branch.push(parent);
            branch += 1;
            if (this.cells[parent].type == T_GOTO) { // UI and code logic are too close here :-/
              parent = -1;
            } else {
              parent = this.cells[parent].parent
            }

          }
          parentTree.push(branch);
        }
        let pParentIndex = pParentIndexes[parentTree.indexOf(max(parentTree))];
        if (this.cells[this.activeIndex].parent != -1) {
          this.cells[this.cells[this.activeIndex].parent].removeChild(this.activeIndex);
          this.cells[this.activeIndex].removeParent();
        }
        let ok = this.cells[pParentIndex].addChild(this.activeIndex, this.cells[this.activeIndex]);
        if (ok == true) {
          this.parentFlag += 1;
          this.cells[this.activeIndex].addParent(pParentIndex, this.cells[pParentIndex]);
          this.cells[pParentIndex].refresh(this.viewXdelta, this.viewYdelta);
          this.parentWidthRecord = [pParentIndex, this.cells[pParentIndex].width]

        }
      }
      this.cells[this.activeIndex].mode = M_IDLE;
      this.activeIndex = -1;
    }
  }

  clean() {
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].parent != -1){
        console.log(this.cells[this.cells[i].parent].childIndicies.indexOf(i));
      }
    }
  }

  mapAndLink() {
    jlog('Cells', 'mapAndLink');
    let map = {};
    map[T_GOTO] = [];
    map[T_PUSH] = [];
    map[T_DELETE] = [];
    map[T_GET] = [];
    map[T_RUN] = [];
    map[T_SET] = [];
    map[T_LEN] = [];
    map[T_VAR] = [];
    map[T_OUTLET] = [];
    map[T_RANGE] = [];

    // map[T_GOTO] = [...this.refactors];
    // map[T_PUSH] = [...this.refactors];
    // map[T_DELETE] = [...this.refactors];
    // map[T_GET] = [...this.refactors];
    // map[T_RUN] = [...this.refactors];
    // map[T_SET] = [...this.refactors];
    // map[T_LEN] = [...this.refactors];
    // map[T_VAR] = [...this.refactors];
    // map[T_OUTLET] = [...this.refactors];
    // map[T_RANGE] = [...this.refactors];
    let varTable = {};
    for (let i = 0; i < this.length; i++) {
      // grab everything
      this.cells[i].updateSHs();
      if ((this.cells[i].type == T_WHILE) || this.cells[i].type == T_IF || this.cells[i].type == T_FOR || this.cells[i].type == T_CONDITION || this.cells[i].type == T_RANGE) {
        this.cells[i].dataSH = B_UNSET;
      }
      if (this.cells[i].type == T_CONST) {
        let nothing;
        this.cells[i].handleSH = nothing;
      }
      // create variable map
      // if ((this.cells[i].type == T_OUTLET || this.cells[i].type == T_INPUT || this.cells[i].type == T_INLET)) { //this.cells[i].mode != M_SELECTED
      if (this.cells[i].type == T_INPUT) { //this.cells[i].mode != M_SELECTED
        map[T_VAR].push(this.cells[i].handleSH);
        map[T_OUTLET].push(this.cells[i].handleSH);
        map[T_PUSH].push(this.cells[i].handleSH);
        map[T_DELETE].push(this.cells[i].handleSH);
        map[T_GET].push(this.cells[i].handleSH);
        map[T_SET].push(this.cells[i].handleSH);
        map[T_RANGE].push(this.cells[i].handleSH);
        map[T_LEN].push(this.cells[i].handleSH);
        if (this.run == false) {
          varTable[this.cells[i].handleSH] = this.cells[i].getDataSH();
        }
      }
      // read from block names
      if (this.cells[i].type == T_BLOCK) {
        map[T_GOTO].push(this.cells[i].handleSH);
        map[T_PUSH].push(this.cells[i].handleSH);
        map[T_DELETE].push(this.cells[i].handleSH);
        map[T_GET].push(this.cells[i].handleSH);
        map[T_RUN].push(this.cells[i].handleSH);
        map[T_SET].push(this.cells[i].handleSH);
        map[T_LEN].push(this.cells[i].handleSH);
      }
      // make pretty
      this.cells[i].reshape();
    }

    map[T_VAR] = map[T_VAR].concat(['unset', 'random', 'year', 'month#', 'monthS', 'day#', 'dayS', 'hour', 'minute', 'second', 'millis']);
    map[T_OUTLET].push('unset');
    map[T_RANGE].push('unset');
    map[T_GOTO].push('unset');
    map[T_PUSH].push('unset');
    map[T_DELETE].push('unset');
    map[T_GET].push('unset');
    map[T_RUN].push('unset');
    map[T_SET].push('unset');
    map[T_LEN].push('unset');
    for (let i = 0; i < this.length; i++) {
      if (this.run == false || this.partialUpdate.indexOf(i) != -1) {
        this.cells[i].updateOptions(map);
        if (this.cells[i].type == T_VAR) {
          this.cells[i].dataSH = varTable[this.cells[i].handleSH];
        }
        if (this.cells[i].mode == M_DELETE){
          this.cells[i].cleanForDeletionSafe();
        }
      }
    }
    // this.refactors = [];
  }

  doMutate() {
    jlog('Cells', 'doMutate');
    this.rebuildMenuFlag = true;
    let ac = this.cells[this.activeIndex];
    ac.mode = M_IDLE;
    let type = blockConfig[ac.type]['handles']['mutate'];
    let data = ac.dataSH;
    let handle = ac.handleSH;
    let pInd = ac.parent;
    let parent = this.cells[ac.parent];
    let children = ac.children;
    let childIndicies = ac.childIndicies;
    ac.indexLabeldiv.remove();
    if (blockConfig[ac.type]['input type'] != I_NONE) {
      ac.input.remove();
      ac.input.remove();
    }
    // if (ac.type == T_VAR) {
    //   ac.varLabeldiv.remove();
    //   ac.varLabeldiv.remove();
    // }
    let inParentIndex = 0;
    if (pInd != -1) {
      inParentIndex = parent.childIndicies.indexOf(this.activeIndex);
    }
    ac.mode = M_IDLE;
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    this.cells[this.activeIndex] = new Cell(type, ac.x, ac.y, this.dWidth, this.dHeight, c, this.dRadius);
    this.cells[this.activeIndex].dataSH = data;
    this.cells[this.activeIndex].handleSH = handle;
    this.cells[this.activeIndex].children = children;
    this.cells[this.activeIndex].childIndicies = childIndicies;
    this.cells[this.activeIndex].parent = pInd;
    if (pInd != -1) {
      parent.children[inParentIndex] = this.cells[this.activeIndex];
    }
    for (let i = 0; i < this.cells[this.activeIndex].children.length; i++){
      if ([T_CONDITION, T_ELSE, T_DO, T_OUTLET, T_INDEX, T_REF].indexOf(this.cells[this.activeIndex].children[i].type) != -1) {
        this.cells[this.activeIndex].children[i].colors = c;
        this.cells[this.activeIndex].children[i].reStyle();
      }
    }
    if (type == T_SQRT) {
      for (let i = 2; i < this.cells[this.activeIndex].children.length; i++){
        this.cells[this.activeIndex].children[i].hideBlock();
      }
      this.cells[this.activeIndex].minHeight = 0;
      this.cells[this.activeIndex].reshape();


    } else {
      for (let i = 2; i < this.cells[this.activeIndex].children.length; i++){
        this.cells[this.activeIndex].children[i].showBlock();
      }
    }
    if (type == T_INPUT) {
      let tempID = this.getID(4);
      this.cells[this.activeIndex].updateHandleSH(tempID);
      // this.cells[this.activeIndex].textLabel += ' ' + tempID;
      // this.cells[this.activeIndex].indexLabeldiv.html(this.cells[this.activeIndex].textLabel);
      this.cells[this.activeIndex].input.value(data, data);
      this.varHandles.push(tempID);
    }
    this.cells[this.activeIndex].mode = M_IDLE;
    this.cells[this.activeIndex].reshape(this.viewXdelta, this.viewYdelta);

    if (pInd != -1) {
      parent.reshape(this.viewXdelta, this.viewYdelta);
    }
  }

  update(x, y, mdown) {
    jlog('Cells', 'update');
    // build mode
    if (this.parentFlag > 0) {
      this.reshapeAllInView();
      if (this.parentWidthRecord[0] != -1) {
        let delta = this.cells[this.parentWidthRecord[0]].width - this.parentWidthRecord[1]
        for (let i = 0; i < this.length; i++) {
          if (this.cells[i].x > this.cells[this.parentWidthRecord[0]].x){
            this.cells[i].pushX(delta);
          }
        }
        this.reshapeAllInView();
      }
      this.parentWidthRecord = [-1, 0]
      this.parentFlag -= 1;
    }
    if (this.run == false) {
      // active cell
      if (this.activeIndex != -1) {
        if (this.cells[this.activeIndex].mode == M_MUTATE){
          this.doMutate();
        }
        if (this.cells[this.activeIndex].mode == M_NEW){
          this.doMove(x, y, true);
        }
        if (this.cells[this.activeIndex].mode == M_START){
          this.startStop(x, y, mdown);
        }
        // deleting
        if (this.cells[this.activeIndex].mode == M_DELETE){
          this.doDelete(x, y, mdown);
          this.mapAndLink();
        } else {
          // move
          if (mdown === true && this.cells[this.activeIndex].mode == M_MOVE) {
            this.doMove(x, y, mdown);
          }
          // resize
          if (mdown === true && this.cells[this.activeIndex].mode == M_RESIZE) {
            this.parentFlag = 2;
            this.cells[this.activeIndex].resizeC(x, y);
          }
          if (mdown === true && this.cells[this.activeIndex].mode == M_EXPAND_OR_COLLAPSE) {
            this.parentFlag = 2;
            this.cells[this.activeIndex].expandOrCollapse();
            if (this.cells[this.activeIndex].shrink == true) {
              let parent = this.cells[this.activeIndex].parent;
              while (parent != -1) {
                this.cells[parent].minHeight = 0;
                this.cells[parent].reshape(true);
                parent = this.cells[parent].parent;
              }
            }
          }
          if (mdown === true && this.cells[this.activeIndex].mode == M_COPY) {
            this.doCopy();
          }
          if (this.redrawFlag == true) {
            this.doParentDrop(x, y, mdown);
          }
        }
      }
      if (this.oldMouse != mdown || selectChanged == true) {
        this.mapAndLink();
        this.oldMouse = mdown;
        selectChanged = false;
      }
    } else { // RUN MODE!!!
      // stop button
      if (this.cells[0].mode == M_START){
        this.startStop(x, y, mdown);
      }
      // and NOTHING ELSE CAUSE I SHOULD MAKE A NEW THING!
    }
  }

  reshapeAllInView(){
    jlog('Cells', 'reshapeAllInView');
    for (let i = 0; i < this.cellsInView.length; i++) {
      if (this.cells[this.cellsInView[i]] != null){
        this.cells[this.cellsInView[i]].reshape(this.viewX, this.viewY, false);
      }
    }
  }

  hideAllDivs(){
    for (let i = 0; i < this.length; i++){
      this.cells[i].indexLabeldiv.hide();
      this.cells[i].hideDivs();
    }
  }

  showAllDivs(){
    for (let i = 0; i < this.length; i++){
      if (this.cells[i].hide == false) {
        this.cells[i].indexLabeldiv.show();
        this.cells[i].showDivs();
      }
    }
  }

  updateView(xPos, yPos, doDrag) {
    jlog('Cells', 'updateView');
    this.viewXdelta = xPos;
    this.viewYdelta = yPos;
    this.redrawFlag = false;
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].graphicUpdate == true) {
        this.cells[i].graphicUpdate = false;
        this.redrawFlag = true;
      }
      // might need to clean this up!
      if (this.cells[i].parent == -1) {// || blockConfig[this.cells[this.cells[i].parent].type]['accept child'].indexOf(this.cells[i].type == -1)) {
        this.cells[i].updateView(this.viewXdelta, this.viewYdelta);
      } else {
        let parType = this.cells[this.cells[i].parent].type;
        let cType = this.cells[i].type;
        if (blockConfig[parType]['accept child'].indexOf(cType) == -1) {
          this.cells[i].updateView(this.viewXdelta, this.viewYdelta);
        }
      }
      if (doDrag == true && this.cellsInView.indexOf(i) != -1) {
        this.cells[i].updateAllDivPositions();
        this.cells[i].refresh();
      }
    }
  }

  cellInView(cell) {
    jlog('Cells', 'cellInView');
    let inview = false;
    let xMin = -1*cell.width;
    let xMax = windowWidth;
    let yMin = -1*cell.height;
    let yMax = windowHeight;
    if (xMin < cell.viewX && cell.viewX < xMax) {
      if ( yMin < cell.viewY && cell.viewY < yMax) {
        inview = true;
      }
    }
    return inview;
  }

  draw(canvas = null) {
    jlog('Cells', 'draw');
    this.cellsInView = [];
    for (let i = 0; i < this.length; i++) {
      this.cellInView(this.cells[i]);
      if (this.cellInView(this.cells[i]) == true) {
        this.cells[i].draw();
        this.cellsInView.push(i);
      }
    }
    if (this.activeIndex != -1) {
     this.cells[this.activeIndex].draw();
   }
  }

};
