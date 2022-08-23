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
  }

  get length() {
    return this.cells.length;
  }

  addCell(x, y, c) {
    this.cells.push(new Cell(x, y, this.dWidth, this.dHeight, [this.colors[c], this.highlights[c], this.lowlights[c], this.inverted[c], this.dualtone[c]], this.dRadius));
    this.cells[this.length-1].div.html(this.length-1);
  }

  checkSelected(x, y) {
    for (let i = 0; i < this.length; i++) {
      if (this.cells[i].inArea(x, y) === true) {
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
    for (let i = 0; i < this.length; i++) {
      this.cells[i].reshape();
      this.cells[i].div.html(i);
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
