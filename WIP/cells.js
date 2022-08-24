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
  }

  get length() {
    return this.cells.length;
  }

  addCell(type) {
    let x = 0.15 * windowWidth;
    let y = 20;
    let width = this.dWidth;
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].y < this.dHeight + y && this.cells[i].x < x + width) {
        if (this.cells[i].parent == -1) {
          y += this.cells[i].height + 10;
        }
        width = max(width, this.cells[i].width + 10);
      }
      if (y > windowHeight*0.7) {
        y = 20;
        x += width;
        width = this.dWidth;
      }
    }
    this.cells.push(new Cell(type, x, y, this.dWidth, this.dHeight, [this.colors[type], this.highlights[type], this.lowlights[type], this.inverted[type], this.dualtone[type]], this.dRadius));
    let pIndex = this.length - 1;
    if (type == T_INPUT) {
      let tempID = this.getID(4);
      this.cells[pIndex].varID= tempID;
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
      this.cells[pIndex + 1].varID= tempID;
      this.cells[pIndex + 1].textLabel += ' ' + tempID;
      this.cells[pIndex + 1].indexLabeldiv.html(this.cells[pIndex + 1].textLabel);
      this.cells[pIndex + 1].updateoutletValueSH('unset');
      this.varHandles.push(tempID);
    }
  }

  getID(count) {
    let tempID = '';
    for (let i = 0; i < count; i++) {
      tempID += this.varNames[floor(random(0, this.varNames.length))];
    }
    return tempID;
  }

  checkSelected(x, y) {
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].inArea(x, y) === true) {
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
    console.log(myStr + '\n');
  }

  update(x, y, mdown) {
    // active cell
    if (this.activeIndex != -1) {
      // deleting
      if (this.cells[this.activeIndex].mode == M_DELETE){
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
      } else {
        // move
        if (mdown === true && this.cells[this.activeIndex].mode == M_MOVE) {
          this.cells[this.activeIndex].moveC(x, y);
          if (this.cells[this.activeIndex].parent != -1) {
            this.cells[this.cells[this.activeIndex].parent].removeChild(this.activeIndex);
            this.cells[this.activeIndex].removeParent();
          }
        }
        // resize
        if (mdown === true && this.cells[this.activeIndex].mode == M_RESIZE) {
          this.cells[this.activeIndex].resizeC(x, y);
        }
        // drop indicator
        let pParentIndex = -1;
        for (let i = 0; i < this.length; i++) {
          if (this.cells[i].inArea(x, y) === true && i != this.activeIndex) {
            this.cells[i].highlight = mdown;
            pParentIndex = i;
          } else {
            this.cells[i].highlight = false;
          }
        }
        // release
        if (mdown === false && this.cells[this.activeIndex].mode == M_MOVE) {
          // create parent/child link and initial align
          if (pParentIndex != -1) {
            if (this.cells[this.activeIndex].parent != -1) {
              this.cells[this.cells[this.activeIndex].parent].removeChild(this.activeIndex);
              this.cells[this.activeIndex].removeParent();
            }
            this.cells[pParentIndex].addChild(this.activeIndex, this.cells[this.activeIndex]);
            this.cells[this.activeIndex].addParent(pParentIndex, this.cells[pParentIndex]);
            this.cells[pParentIndex].moveC(this.cells[pParentIndex].x, this.cells[pParentIndex].y);
          }
          this.cells[this.activeIndex].mode = M_IDLE;
          this.activeIndex = -1;
        }
      }
    }
    let blocks = [];
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].type in this.map) {
        this.map[this.cells[i].type].add(i);
      } else {
        this.map[this.cells[i].type] = new Set();
        this.map[this.cells[i].type].add(i);
      }

      blocks.push('');
      // make pretty
      this.cells[i].reshape();
      // read from block names
      if (this.cells[i].type == T_BLOCK && this.cells[i].mode != M_SELECTED) {
        blocks[i] = this.cells[i].input.value();
        this.cells[i].updateoutletHandleSH(blocks[i]);
      }
    }
    // linking (oof)
    for (key in this.map) {
      if (key == T_GOTO) {
        for (let i of this.map[key]) {
          for (let j = 0; j < blocks.length; j++) {
            this.cells[i].input.option(blocks[j]);
          }
        }
      }
      if (key == T_VAR) {
        for (let vi of this.map[key]) {
          for (let j = 0; j < this.varHandles.length; j++) {
            this.cells[vi].input.option(this.varHandles[j], this.varHandles[j]);
          }
          this.cells[vi].trackingSH = this.cells[vi].input.value();
          for (key in this.map) {
            if (key == T_INPUT) {
              for (let ii of this.map[key]) {
                if (this.cells[vi].trackingSH == this.cells[ii].varID) {
                  this.cells[vi].updateoutletValueSH(this.cells[ii].input.value());
                }
              }
            }

            if (key == T_OUTLET) {
              for (let oi of this.map[key]) {
                if (this.cells[vi].trackingSH == this.cells[oi].varID) {
                  this.cells[vi].updateoutletValueSH(this.cells[oi].outletValueSH);
                }
              }
            }
          }
        }
      }
    }
  }

  draw(canvas = null) {
    for (let i = 0; i < this.length; i++) {
      this.cells[i].draw();
    }
    if (this.activeIndex != -1) {
      this.cells[this.activeIndex].draw();
    }
  }

};
