var M_IDLE = 0;
var M_MOVE = 1;
var M_RESIZE = 2;
var M_DELETE = 3;

class Cell {
  constructor(x, y, w, h, c, r=5) {
    // heirachy
    this.children = [];
    this.childIndicies = [];
    this.parent = -1;
    // heirachy interface
    this.childYBorder = 2*r;
    this.childXBorder = 1.5 * r;
    // control interface
    this.mode = M_IDLE;
    // graphical interface
    this.highlight = false;
    // body
    this.width = w;
    this.height = h;
    this.radius = r;
    this.x = x;
    this.y = y;
    this.offX = this.childXBorder;
    this.offY = this.childYBorder;
    // handles
    this.handleW = 1.5*r;
    this.handleH = 1.5*r;
    // colors
    this.colors = c;
    // labels
    this.div = createDiv();
    this.div.position(this.x + this.childXBorder, this.y);
    let colorString = "rgb(" + this.colors[4]._getRed() + ", " + this.colors[4]._getGreen() + ", " + this.colors[4]._getBlue() + ")";
    this.div.style('font-size', '16px');
    this.div.style('color', colorString);
    this.div.show();

    console.log(this.colors[3]._getRed());

  }

  get pos() {
    return [this.x, this.y]
  }

  get size() {
    return [this.width, this.height]
  }

  draw(canvas=null) {
    if (canvas === null) {
      // body
      if (this.highlight === true) {
        fill(this.colors[2]);
      } else {
        fill(this.colors[0]);
      }
      stroke(this.colors[1]);
      rect(this.x, this.y, this.width, this.height, this.radius);
      // move handle
      fill(this.colors[1]);
      rect(this.x, this.y, this.handleW, this.handleH);
      // resize handle
      rect(this.x + this.width - this.handleW, this.y + this.height - this.handleH, this.handleW, this.handleH);
      // delete handle
      fill(this.colors[3]);
      stroke(this.colors[3]);
      rect(this.x + this.width - this.handleW, this.y, this.handleW, this.handleH);
    }
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].draw();
    }
  }

  moveC(x, y) {
    this.x = x;
    this.y = y;
    this.div.position(this.x + this.childXBorder, this.y);
    let childX = x + this.childXBorder;
    let childY = this.y + this.childYBorder;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].moveC(childX, childY);
      childY += this.childYBorder + this.children[i].height;
    }
  }

  resizeC(x, y) {
    let nw = x - this.x;
    let nh = y - this.y;
    if (nw > 2*this.handleW) {
      this.width = nw;
    }
    if (nh > 2*this.handleH) {
      this.height = nh;
    }
  }

  reshape() {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].mode == M_IDLE) {
        this.children[i].reshape();
      }
    }
    let heightSum = this.childYBorder;
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].width + this.childXBorder * 2 > this.width) {
        this.width = this.children[i].width + this.childXBorder * 2;
      }
      heightSum += this.children[i].height + this.childYBorder;
    }
    heightSum += 2 * this.childYBorder;
    if (heightSum > this.height) {
      this.height = heightSum;
    }
    this.moveC(this.x, this.y);
  }

  markForDeletion() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].markForDeletion();
    }
    this.mode = M_DELETE;
  }

  cleanForDeletionSafe() {
    let par = -1;
    if (this.mode == M_DELETE) {
      this.div.remove();
      par = this.parent;
      this.removeParent();
    }
    return par;
  }

  checkButtons(x, y) {
    let breaker = false;
    let fudge = 2;
    // move handle?
    if (x > this.x - fudge && x < this.x + this.handleW + fudge) {
      if (y > this.y - fudge && y < this.y + this.handleH + fudge) {
        this.mode = M_MOVE;
        breaker = true;
      }
    }
    //resize handle?
    if (x > this.x + this.width - this.handleW - fudge && x < this.x + this.width + fudge) {
      if (y > this.y + this.height - this.handleH - fudge && y < this.y + this.height + fudge) {
        this.mode = M_RESIZE;
        breaker = true;
      }
    }

    if (x > this.x + this.width - this.handleW - fudge && x < this.x + this.width + fudge) {
      if (y > this.y - fudge && y < this.y + this.handleH + fudge) {
        this.mode = M_DELETE;
        breaker = true;
      }
    }
    return breaker;
  }

  addChild(ind, child) {
    if (this.childIndicies.indexOf(ind) == -1) {
      this.childIndicies.push(ind);
      this.children.push(child);
    }
  }

  addParent(ind, parent) {
    this.parent = ind;
    this.offX = parent.childXBorder;
    this.offY = parent.childY - this.height;
  }

  removeParent() {
    this.parent = -1;
  }

  removeChild(ind) {
    let ci = this.childIndicies.indexOf(ind);
    if (ci != -1) {
      this.childIndicies.splice(ci, 1);
      this.children.splice(ci, 1);
    }
    // sort out offsets
  }

  inArea(x, y) {
    let breaker = false;
    let fudge = 2;
    if (x > this.x - fudge && x < this.x + this.width + fudge) {
      if (y > this.y - fudge && y < this.y + this.height + fudge) {
        breaker = true;
      }
    }
    return breaker;
  }

};
