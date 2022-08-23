var M_IDLE = 0;
var M_MOVE = 1;
var M_RESIZE = 2;
var M_DELETE = 3;

var T_BLOCK = 23;
var T_SOURCE = 47;
var T_IF = 6;
var T_WHILE = 7;
var T_EQUAL = 8;
var T_LESS = 9;
var T_GREATER = 10;
var T_ADD = 11;
var T_SUBTRACT = 12;
var T_MULT = 13;
var T_DIV = 14;
var T_MOD = 15;
var T_GOTO = 16;
var T_NOT = 18;

var blockLabels = {};
blockLabels[T_BLOCK] = "block";
blockLabels[T_SOURCE] = "source";
blockLabels[T_IF] = "if";
blockLabels[T_WHILE] = "while";
blockLabels[T_EQUAL] = "equals";
blockLabels[T_LESS] = "less";
blockLabels[T_GREATER] = "greater";
blockLabels[T_ADD] = "add";
blockLabels[T_SUBTRACT] = "subtract";
blockLabels[T_MULT] = "multiply";
blockLabels[T_DIV] = "divide";
blockLabels[T_MOD] = "modulus";
blockLabels[T_GOTO] = "goto";
blockLabels[T_NOT] = "not";



function colorToHTMLRGB(color) {
  return "rgb(" + color._getRed() + ", " + color._getGreen() + ", " + color._getBlue() + ")";
}

class Cell {
  constructor(type, x, y, w, h, c, r=5) {
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

    // specifics
    this.type = type
    this.textLabel = blockLabels[type];
    // labels
    this.indexLabeldiv = createDiv(this.textLabel);
    this.indexLabeldiv.position(this.x + 2*this.childXBorder, this.y + this.childYBorder);
    this.indexLabeldiv.style('font-size', '16px');
    this.indexLabeldiv.style('color', colorToHTMLRGB(this.colors[4]));
    this.indexLabeldiv.show();
    this.ySpacer = 0;
    this.yHeaderEnd = parseInt(this.indexLabeldiv.style('font-size'));
    console.log(this.yHeaderEnd)
    this.height += this.yHeaderEnd;
    if (type == T_BLOCK || type == T_SOURCE || type == T_GOTO) {
      this.input = createInput();
      this.input.position(x + this.childXBorder, y + this.yHeaderEnd);
      this.width = this.input.width + 2*this.childXBorder;
      this.ySpacer += this.input.height;
      this.input.style('background-color', colorToHTMLRGB(this.colors[2]));
      this.input.style('border-color', colorToHTMLRGB(this.colors[1]));
      this.input.style('color', colorToHTMLRGB(this.colors[4]));
      this.input.style('border', 0);
    }
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
      if (this.highlight === true && this.type != T_SOURCE) {
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
    if (this.type == T_BLOCK || this.type == T_SOURCE) {
      this.input.position(this.x + this.childXBorder, this.y + this.childYBorder + this.yHeaderEnd);
    }
    this.indexLabeldiv.position(this.x + this.childXBorder, this.y);
    let childX = x + this.childXBorder;
    let childY = this.y + 2*this.childYBorder + this.ySpacer + this.yHeaderEnd;
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
    let heightSum = this.childYBorder + this.ySpacer;
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
      this.indexLabeldiv.remove();
      par = this.parent;
      this.removeParent();
      if (this.type == T_BLOCK || this.type == T_SOURCE) {
        this.input.remove();
      }
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
    if (this.type != T_SOURCE) {
      if (this.childIndicies.indexOf(ind) == -1) {
        this.childIndicies.push(ind);
        this.children.push(child);
      }
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
    if (this.type != T_SOURCE) {
      let ci = this.childIndicies.indexOf(ind);
      if (ci != -1) {
        this.childIndicies.splice(ci, 1);
        this.children.splice(ci, 1);
      }
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
