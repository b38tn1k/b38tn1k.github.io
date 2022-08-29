class Cells {
  constructor(c, h, l, i, dt) {
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
    this.varHandles = ['none'];
    this.map = {};
    this.run = false;
    this.viewX = 0;
    this.viewY = 0;
    this.oldMouse = true;
  }

  get length() {
    return this.cells.length;
  }

  tidy(xMin, yMin) {
    let bigBlocks = [];
    let consol, start;
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].parent == -1 && this.cells[i].type != T_START && this.cells[i].type != T_CONSOLE) {
        this.cells[i].reshape(true);
        bigBlocks.push(this.cells[i]);
      }
    }
    this.cells[1].width = this.cells[0].width;
    this.cells[1].height = 5 * this.dHeight;
    this.cells[1].resizeConsole();
    bigBlocks.sort(function(a, b) {return a.width - b.width});
    bigBlocks.unshift(this.cells[0], this.cells[1]);
    let x = xMin;
    let y = yMin;
    let offset = 0;
    let newPos = [];
    for (let i = 0; i < bigBlocks.length; i++) {
      if (y + bigBlocks[i].height > windowHeight) {
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
    }
  }

  saveCells() {
    this.mapAndLink();
    let snapshot = {}
    for (let i = 0; i < cells.length; i++) {
      snapshot[i] = {};
      snapshot[i]['x'] = this.cells[i].x;
      snapshot[i]['y'] = this.cells[i].y;
      snapshot[i]['t'] = this.cells[i].type;
      snapshot[i]['h'] = this.cells[i].hide;
      snapshot[i]['s'] = this.cells[i].shrink;
      snapshot[i]['d'] = this.cells[i].dataSH;
      snapshot[i]['i'] = this.cells[i].handleSH;
      snapshot[i]['p'] = this.cells[i].parent;
      snapshot[i]['c'] = this.cells[i].childIndicies;
      snapshot[i]['tL'] = this.cells[i].textLabel;
      snapshot[i]['L'] = this.cells[i].indexLabeldiv.html();
    }
    return snapshot;
  }

  addCellWithInfo(info) {
    let type = info.t;
    if (type > this.colors.length){
      type = this.cells[info.p].type;
    }
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    if (type == T_START) {
      c = [this.colors[type], this.highlights[type], this.colors[49], this.inverted[type], this.dualtone[type]];
    }
    let newCell = this.length;
    this.cells.push(new Cell(info.t, info.x, info.y, this.dWidth, this.dHeight, c, this.radius));
    this.cells[newCell].hide = info.h;
    this.cells[newCell].shrink = info.s;
    this.cells[newCell].dataSH = info.d;
    this.cells[newCell].handleSH = info.i;
    this.cells[newCell].parent = info.p;
    if (info.t == T_OUTLET || info.t == T_VAR || info.t == T_INPUT){
      this.cells[newCell].textLabel = info.tL;
      this.cells[newCell].indexLabeldiv.html(info.L);
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
  }

  nudgeX(x) {
    let nudgeVal = 0;
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].x < x) {
        nudgeVal = max(nudgeVal, x - this.cells[i].x);
      }
    }
    for (let i = 0; i < this.length; i++) {
      this.cells[i].moveC(this.cells[i].x + nudgeVal, this.cells[i].y);
    }
  }

  putInAddyBar() {
    let myURL = getURL();
    if (myURL.indexOf('#') != -1) {
      myURL = myURL.slice(0, myURL.indexOf('#'));
    }
    let myString = myURL + '#' + encodeURIComponent(JSON.stringify(this.saveCells()));
    return myString;
  }

  makeFromAddyBar(myString=getURL()) {
    if (myString.indexOf('#') == -1) {
      return false;
    }
    try {
      let myURI = myString.slice(myString.indexOf('#')+1)
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
      console.log('failed to load');
      return false;
    }
    return true;
  }

  linkChildren(ind, info) {
    let id = parseInt(ind);
    for (let i = 0; i < info.c.length; i++) {
      this.cells[id].forcefullyAddChildren(info.c[i], this.cells[info.c[i]], true);
    }
  }

  addCell(type, startX) {
    this.mapAndLink();
    let x = startX;//0.15 * windowWidth;
    let y = 17;
    let c = [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]];
    if (type == T_START) {
      c = [this.colors[type], this.highlights[type], this.colors[49], this.inverted[type], this.dualtone[type]];
    }
    this.cells.push(new Cell(type, x, y, this.dWidth, this.dHeight, c, this.dRadius));
    let pIndex = this.length - 1;
    if (type == T_INPUT) {
      let tempID = this.getID(4);
      this.cells[pIndex].handleSH= tempID;
      this.cells[pIndex].textLabel += ' ' + tempID;
      this.cells[pIndex].indexLabeldiv.html(this.cells[pIndex].textLabel);
      this.varHandles.push(tempID);
    }
    if (type == T_IF || type == T_WHILE) {
      this.cells.push(new Cell(T_CONDITION, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      this.cells.push(new Cell(T_DO, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      this.cells.push(new Cell(T_ELSE, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      for (let i = 1; i <= 3; i++) {
        this.cells[pIndex].addChild(pIndex + i, this.cells[pIndex + i], true);
        this.cells[pIndex + i].addParent(pIndex, this.cells[pIndex], true);
      }
      this.cells[pIndex].moveC(this.cells[pIndex].x, this.cells[pIndex].y);
    }

    let theOnesWithOutlets = [T_EQUAL,T_LESS,T_GREATER,T_ADD,T_SUBTRACT,T_MULT,T_DIV,T_MOD];
    let thisOneHasAnOutlet = false;
    for (let i = 0; i < theOnesWithOutlets.length; i++) {
      if (type == theOnesWithOutlets[i]) {
        thisOneHasAnOutlet = true;
      }
    }
    if (thisOneHasAnOutlet == true) {
      this.cells.push(new Cell(T_OUTLET, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
      this.cells[pIndex].addChild(pIndex + 1, this.cells[pIndex + 1]);
      this.cells[pIndex + 1].addParent(pIndex, this.cells[pIndex]);
      let tempID = this.getID(4);
      this.cells[pIndex + 1].handleSH= tempID;
      this.cells[pIndex + 1].textLabel += ' ' + tempID;
      this.cells[pIndex + 1].indexLabeldiv.html(this.cells[pIndex + 1].textLabel);
      this.cells[pIndex + 1].updateDataSH('unset');
      this.varHandles.push(tempID);
    }
    if (type == T_BLOCK) {
      this.cells[pIndex].input.value(this.getID(1) + " block", this.getID(1) + " block");
      this.cells[pIndex].handleSH = this.cells[pIndex].input.value();
    }
    this.cells[pIndex].reshape();
    if (type != T_START && type != T_CONSOLE) {
      this.cells[pIndex].mode = M_NEW;
      this.activeIndex = pIndex;
    }
  }

  getID(count) {
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
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].inArea(x, y) === true) {
        this.cells[i].mode = M_SELECTED;
        if (this.cells[i].checkButtons(x, y) === true) {
          this.activeIndex = i;
          return true;
          break;
        }
      } else {
        this.cells[i].mode = M_IDLE;
        this.activeIndex = -1;
      }
    }
    return false;
  }

  pprint(myStr) {
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
    this.run = ! this.run;
    this.cells[this.activeIndex].mode = M_IDLE;
    this.cells[this.activeIndex].toggleStartForm(this.run);
  }

  stop() {
    this.run = false;
    this.cells[0].toggleStartForm(false);
  }

  doDelete(x, y, mdown) {
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
          if (this.cells[i].hasHandle == true) {
            rebuildFlag = true;
            delHandle.push(this.cells[i].handleSH);
            this.varHandles.splice(this.varHandles.indexOf(this.cells[i].handleSH), 1);
          }
        }
        // remove parent / child links and divs for those in delete mode
        let parent = this.cells[i].cleanForDeletionSafe();
        if (parent != -1){
          this.cells[parent].removeChild(i);
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
          if (this.cells[i].type != T_GOTO){
            this.cells[i].varLabeldiv.remove();
          }
          this.cells[i].buildDivs();
        }
      }
      for (let i = 0; i < this.length; i++) {
        if (blockConfig[this.cells[i].type]['input type'] == I_SELECT) {
          if (delHandle.indexOf(this.cells[i].handleSH) == -1) {
            this.cells[i].input.option(this.cells[i].handleSH);
            this.cells[i].input.selected(this.cells[i].handleSH);
          }
        }
      }
    }
  }

  doMove(x, y, mdown) {
    this.cells[this.activeIndex].moveC(x, y);
    if (this.cells[this.activeIndex].parent != -1) {
      this.cells[this.cells[this.activeIndex].parent].removeChild(this.activeIndex);
      this.cells[this.activeIndex].removeParent();
    }
  }

  doParentDrop(x, y, mdown) {
    let pParentIndexes = [];
    if (this.cells[this.activeIndex].type != T_START) {
      for (let i = 0; i < this.length; i++) {
        if (this.cells[i].inArea(x, y) === true) {
          this.cells[i].underneath = mdown || this.cells[this.activeIndex].mode == M_NEW;
        } else {
          this.cells[i].underneath = false;
        }
        if (this.cells[i].inArea(x, y) === true && i != this.activeIndex && this.cells[i].acceptsChild(this.cells[this.activeIndex].type)) {
          this.cells[i].highlight = mdown || this.cells[this.activeIndex].mode == M_NEW;
          pParentIndexes.push(i);
        } else {
          this.cells[i].highlight = false;
        }
      }
    }
    // release
    if (mdown === false && this.cells[this.activeIndex].mode == M_MOVE) {
      // create parent/child link and initial align
      if (pParentIndexes.length != 0) {
        let pParentIndex = pParentIndexes[0];
        for (let i = 0; i < pParentIndexes.length; i++) {
          let current = this.cells[pParentIndexes[i]];
          for (let j = 0; j < pParentIndexes.length; j++) {
            if (pParentIndexes[j] == current.parent) {
              pParentIndex = pParentIndexes[i];
            }
          }
        }
        if (this.cells[this.activeIndex].parent != -1) {
          this.cells[this.cells[this.activeIndex].parent].removeChild(this.activeIndex);
          this.cells[this.activeIndex].removeParent();
        }
        let ok = this.cells[pParentIndex].addChild(this.activeIndex, this.cells[this.activeIndex]);
        if (ok == true) {
          this.cells[this.activeIndex].addParent(pParentIndex, this.cells[pParentIndex]);
          this.cells[pParentIndex].moveC(this.cells[pParentIndex].x, this.cells[pParentIndex].y);
        }
      }
      this.cells[this.activeIndex].mode = M_IDLE;
      this.activeIndex = -1;
    }
  }

  mapAndLink(reset = false) {
    let map = {};
    map[T_GOTO] = ['none'];
    map[T_VAR] = ['none'];
    let varTable = {};
    for (let i = 0; i < this.length; i++) {
      // grab everything
      this.cells[i].updateSHs();
      // create variable map
      if ((this.cells[i].type == T_OUTLET || this.cells[i].type == T_INPUT) && this.cells[i].mode != M_SELECTED) {
        map[T_VAR].push(this.cells[i].handleSH);
        varTable[this.cells[i].handleSH] = this.cells[i].dataSH;
      }
      // read from block names
      if (this.cells[i].type == T_BLOCK) {
        map[T_GOTO].push(this.cells[i].handleSH);
      }
      // make pretty
      this.cells[i].reshape();
    }
    for (let i = 0; i < this.length; i++) {
      this.cells[i].updateOptions(map);
      if (this.cells[i].type == T_VAR) {
        this.cells[i].dataSH = varTable[this.cells[i].handleSH];
      }
    }
  }

  update(x, y, mdown) {
    this.cells[0].startButtonHighlight(x, y);
    // build mode
    if (this.run == false) {
      // active cell
      if (this.activeIndex != -1) {
        if (this.cells[this.activeIndex].mode == M_NEW){
          if (mdown == false) {
            this.doMove(x, y, true);
          }
          if (mdown == true) {
            this.cells[this.activeIndex].mode = M_IDLE;
            this.activeIndex = -1;
          }
        }
        if (this.cells[this.activeIndex].mode == M_START){
          this.startStop(x, y, mdown);
        }
        // deleting
        if (this.cells[this.activeIndex].mode == M_DELETE){
          this.doDelete(x, y, mdown);
        } else {
          // move
          if (mdown === true && this.cells[this.activeIndex].mode == M_MOVE) {
            this.doMove(x, y, mdown);
          }
          // resize
          if (mdown === true && this.cells[this.activeIndex].mode == M_RESIZE) {
            this.cells[this.activeIndex].resizeC(x, y);
          }
          if (mdown === true && this.cells[this.activeIndex].mode == M_EXPAND_OR_COLLAPSE) {
            this.cells[this.activeIndex].expandOrCollapse();
          }
          this.doParentDrop(x, y, mdown)
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

      for (let i = 0; i < this.length; i++) {
        if (this.cells[i].parent == T_PRINT) {
          this.cells[i].selfDescribe();
        }
      }
      // and NOTHING ELSE CAUSE I SHOULD MAKE A NEW THING!
    }
  }

  updateView(xPos, yPos) {
    // this.viewX = xPos;
    // this.viewY = yPos;

  }

  cellInView(cell) {
    let inview = false;
    if (cell.x > this.viewX && cell.x < windowWidth + this.viewX) {
      if (cell.y > this.viewY && cell.y < windowHeight + this.viewY) {
        inview = true;
      }
    }
    return inview;
  }

  draw(canvas = null) {
    for (let i = 0; i < this.length; i++) {
      if (this.cellInView(this.cells[i]) == true) {
        this.cells[i].draw(this.viewX, this.viewY);
      }
    }
    if (this.activeIndex != -1) {
     this.cells[this.activeIndex].draw();
   }
  }

};
