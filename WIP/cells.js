class Cells {
  constructor(c, h, l) {
    this.cells = [];
    this.dWidth = 80;
    this.dHeight = 40;
    this.dRadius = 5;
    this.activeIndex = -1;
    this.colors = c;
    this.highlights = h;
    this.lowlights = l;
  }

  get length() {
    return this.cells.length;
  }

  addCell(x, y, c) {
    this.cells.push(new Cell(x, y, this.dWidth, this.dHeight, [this.colors[c], this.highlights[c], this.lowlights[c]], this.dRadius));
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

  update(x, y, mdown) {
    // active cell
    if (this.activeIndex != -1) {
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
      // duplicate

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
    for (let i = 0; i < this.length; i++) {
      this.cells[i].reshape();
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
