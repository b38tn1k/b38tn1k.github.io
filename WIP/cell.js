var M_IDLE = 0;
var M_MOVE = 1;
var M_RESIZE = 2;
var M_DELETE = 3;
var M_SELECTED = 4;
var M_EXPAND_OR_COLLAPSE = 5;
var M_START = 6;
var M_NEW = 7;

var T_START = 1;
var T_STOP = 0;
var T_BLOCK = 23;
var T_VAR = 45;
var T_INPUT = 47;
var T_IF = 30;
var T_WHILE = 7;
var T_EQUAL = 48;
var T_LESS = 9;
var T_GREATER = 38;
var T_ADD = 11;
var T_SUBTRACT = 52;
var T_MULT = 13;
var T_DIV = 14;
var T_MOD = 32;
var T_GOTO = 16;
var T_NOT = 28;
var T_CONDITION = 103;
var T_ELSE = 102;
var T_DO = 101;
var T_OUTLET = 104;
var T_ASSIGN = 42;
var T_CONSOLE = 2;
var T_PRINT = 27;

var blockLabels = {};
blockLabels[T_BLOCK] = "block";
blockLabels[T_VAR] = "variable";
blockLabels[T_INPUT] = "value";
blockLabels[T_IF] = "if";
blockLabels[T_WHILE] = "while";
blockLabels[T_EQUAL] = "equal";
blockLabels[T_LESS] = "less";
blockLabels[T_GREATER] = "greater";
blockLabels[T_ADD] = "add";
blockLabels[T_SUBTRACT] = "subtract";
blockLabels[T_MULT] = "multiply";
blockLabels[T_DIV] = "divide";
blockLabels[T_MOD] = "modulus";
blockLabels[T_GOTO] = "goto";
blockLabels[T_NOT] = "not";
blockLabels[T_CONDITION] = "condition";
blockLabels[T_ELSE] = "else";
blockLabels[T_DO] = "do";
blockLabels[T_OUTLET] = "out";
blockLabels[T_START] = "start";
blockLabels[T_STOP] = "stop";
blockLabels[T_ASSIGN] = "assign";
blockLabels[T_CONSOLE] = "console";
blockLabels[T_PRINT] = "print";

function colorToHTMLRGB(color) {
  return "rgb(" + color._getRed() + ", " + color._getGreen() + ", " + color._getBlue() + ")";
}

class Cell {
  constructor(type, x, y, w, h, c, r=5) {
    // heirachy
    this.children = [];
    this.childIndicies = [];
    this.parent = -1;
    // control etc
    this.funcHandleSH;
    this.dataSH;
    this.handleSH;
    this.type = type
    this.textLabel = blockLabels[type];
    this.hasSelect = false;
    this.hasInput = false;
    this.hasHandle = false;
    // labels, tools, setup
    if (type == T_BLOCK || type == T_INPUT || type == T_OUTLET) {
      this.hasHandle = true;
    }
    this.mode = M_IDLE;
    this.highlight = false;
    this.flash = false;
    this.toggleShape = false;
    // geometry
    if (type == T_CONSOLE) {
      w *= 2;
    }
    this.childYBorder = 2*r;
    this.childXBorder = 1.5 * r;
    this.ySpacer = 0;
    this.width = w;
    this.height = h;
    this.minWidth = w;
    this.minHeight = h;
    this.radius = r;
    this.x = x;
    this.y = y;
    this.hide = false;
    this.shrink = false;
    this.handleW = 1.5*r;
    this.handleH = 1.5*r;
    // colors
    this.colors = c;
    // divs
    this.lineNumber = 0;
    this.indexLabeldiv = createDiv(this.textLabel);
    this.indexLabeldiv.position(this.x + 2*this.childXBorder, this.y + this.childYBorder);
    this.indexLabeldiv.style('font-size', '16px');
    this.indexLabeldiv.style('color', colorToHTMLRGB(this.colors[4]));
    this.indexLabeldiv.show();
    this.yHeaderEnd = parseInt(this.indexLabeldiv.style('font-size')) + this.childYBorder;
    if (this.type == T_START) {
      this.yHeaderEnd += 2 * this.handleH;
    }
    this.height += this.yHeaderEnd;
    this.startHeight = this.height;
    this.startWidth = this.width;
    this.buildDivs();
    this.resizeConsole();
  }

  get pos() {
    return [this.x, this.y]
  }

  get size() {
    return [this.width, this.height]
  }

  resizeConsole() {
    if (this.type == T_CONSOLE) {
      this.indexLabeldiv.size(this.width - this.childXBorder, this.height - this.childYBorder);
      this.indexLabeldiv.style('overflow', "auto");
    }
  }

  buildDivs() {
    this.height = this.startHeight;
    this.width = this.startWidth;
    this.ySpacer = 0;
    if (this.type == T_BLOCK || this.type == T_INPUT || this.type == T_GOTO || this.type == T_VAR) {
      if (this.type == T_BLOCK || this.type == T_INPUT) {
        this.input = createInput();
        this.hasInput = true;
      }
      if (this.type == T_GOTO || this.type == T_VAR){
        this.input = createSelect();
        this.hasSelect = true;
      }
      this.input.style('font-size', '16px');
      let h = this.input.size().height;
      this.standardInputHeight = h;
      this.input.size(this.width - 3*this.childXBorder, h);
      this.input.style('background-color', colorToHTMLRGB(this.colors[2]));
      this.input.style('border-color', colorToHTMLRGB(this.colors[1]));
      this.input.style('color', colorToHTMLRGB(this.colors[4]));
      this.input.style('border', 0);
      this.input.position(this.x + this.childXBorder, this.y + this.yHeaderEnd);

      this.width = this.input.size().width + 3*this.childXBorder;
      this.ySpacer += this.input.height;
      this.minWidth = this.width;
      if (this.type == T_VAR) {
        this.varLabeldiv = createDiv("empty");
        this.varLabeldiv.position(this.x + this.childXBorder, this.y + this.yHeaderEnd + 2*this.ySpacer);
        this.height += this.childYBorder + this.ySpacer;
        this.minHeight = this.height;
        this.varLabeldiv.style('font-size', '16px');
        this.varLabeldiv.style('color', colorToHTMLRGB(this.colors[4]));
        this.varLabeldiv.show();
      }
    }
  }

  updateFuncHandleSH(value) {
    this.funcHandleSH = value;
    this.dataSH = value; //what could go wrong :-P
  }

  updateDataSH(value) {
    this.dataSH = value;
    if (this.type != T_VAR) {
      let htmlString = this.textLabel + '<br><br>' + String(this.dataSH);
      this.indexLabeldiv.html(htmlString);
    } else {
      this.varLabeldiv.html(value);
    }
  }

  draw(canvas=null) {
    if (this.hide === false){
      if (canvas === null) {
        // body
        if (this.highlight === true && this.type != T_CONSOLE && this.type != T_INPUT && this.type != T_VAR && this.type != T_IF && this.type != T_WHILE && this.type != T_OUTLET) {
          fill(this.colors[2]);
        } else {
          fill(this.colors[0]);
        }
        if ((this.highlight === true) && (this.type == T_BLOCK || this.type == T_INPUT || this.type == T_GOTO || this.type == T_VAR)) {
          this.input.hide();
        }
        if ((this.highlight === false) && (this.type == T_BLOCK || this.type == T_INPUT || this.type == T_GOTO || this.type == T_VAR)) {
          this.input.show();
        }
        if (this.flash == true) {
          // console.log(this.textLabel);
          fill(this.colors[2]);
          // this.flash = false;
        } else {
          fill(this.colors[0]);
        }

        stroke(this.colors[1]);
        rect(this.x, this.y, this.width, this.height, this.radius);

        // resize handle
        rect(this.x + this.width - this.handleW, this.y + this.height - this.handleH, this.handleW, this.handleH);

        if (this.type != T_CONDITION && this.type != T_ELSE && this.type != T_DO && this.type != T_OUTLET) {
          // move handle
          fill(this.colors[1]);
          rect(this.x, this.y, this.handleW, this.handleH);
          // shrinkHandle
          rect(this.x + this.width/2 - this.handleW, this.y + this.height - this.handleH, this.handleW, this.handleH);
          if (this.type != T_START) {
            // delete handle
            fill(this.colors[3]);
            stroke(this.colors[3]);
            rect(this.x + this.width - this.handleW, this.y, this.handleW, this.handleH);
          }
        }
      }
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].draw();
      }
    } else {
      this.hideDivs();
    }
    if (this.shrink === true) {
      this.hideDivs();
    }
    if (this.type == T_START && this.shrink == false) {
      stroke(this.colors[1]);
      fill(this.colors[0]);
      rect(this.x + this.width/2 - 1.5*this.handleW, this.y + this.yHeaderEnd - 2 * (1.25 * this.handleH), 3*this.handleW, 3 * this.handleH);
      fill(this.colors[2]);
      if (this.toggleShape === true) {
        rect(this.x + this.width/2 - this.handleW, this.y + this.yHeaderEnd - 2 * this.handleH, this.handleW * 2, this.handleH * 2);
      } else {
        triangle(this.x + this.width/2 - this.handleW, this.y + this.yHeaderEnd - 2 * this.handleH, this.x + this.width/2 - this.handleW, this.y + this.yHeaderEnd, this.x + this.width/2 + this.handleW, this.y + this.yHeaderEnd - this.handleH);
      }

    }
  }

  moveC(x, y) {
    x = max(x, this.handleW);
    y = max(y, this.handleH);
    this.x = x;
    this.y = y;
    if (this.type == T_BLOCK || this.type == T_INPUT || this.type == T_GOTO || this.type == T_VAR) {
      this.input.position(this.x + this.childXBorder, this.y + this.childYBorder + this.yHeaderEnd);
    }
    if (this.type == T_VAR) {
      this.varLabeldiv.position(x + this.childXBorder, this.y + this.yHeaderEnd + 2*this.ySpacer);
    }
    this.indexLabeldiv.position(this.x + 2*this.childXBorder, this.y);
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
    this.width = max(this.minWidth, this.width);
    this.height = max(this.minHeight, this.height);
    if (this.type == T_VAR || this.type == T_INPUT || this.type == T_BLOCK || this.type == T_GOTO) {
      this.input.size(this.width - 3*this.childXBorder, this.standardInputHeight);
    }
    this.resizeConsole();

  }

  reshape(reshape=false) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].mode == M_IDLE) {
        this.children[i].reshape();
      }
    }
    let heightSum = this.yHeaderEnd + this.childYBorder + this.ySpacer;
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].width + this.childXBorder * 2 > this.width) {
        this.width = this.children[i].width + this.childXBorder * 2;
      }
      heightSum += this.children[i].height + this.childYBorder;
    }
    heightSum += 2 * this.childYBorder;
    if (heightSum > this.height) {
      this.height = heightSum;
      this.minHeight = this.height;
    }
    if (reshape == true) {
      this.height = this.minHeight;
    }
    if (this.shrink === true) {
      this.height = this.yHeaderEnd;
      this.minHeight = this.height;
    }
    if (this.width < this.indexLabeldiv.size().width + 3 * this.childXBorder) {
      this.width = this.indexLabeldiv.size().width + 3 * this.childXBorder;
    }
    if (this.hasInput == true || this.hasSelect == true) {
      let h = this.input.size().height;
      this.input.size(this.width - 3 * this.childXBorder);
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
      if (this.type == T_BLOCK || this.type == T_INPUT || this.type == T_GOTO || this.type == T_VAR) {
        this.input.remove();
      }
      if (this.type == T_VAR) {
        this.varLabeldiv.remove();
      }
    }
    return par;
  }

  toggleStartForm(myBool){
    this.toggleShape = myBool;
    if (myBool == true) {
      this.textLabel = blockLabels[T_STOP];
      this.indexLabeldiv.html(this.textLabel);
    } else {
      this.textLabel = blockLabels[T_START];
      this.indexLabeldiv.html(this.textLabel);
    }
  }

  startButtonHighlight(x, y){
    stroke(this.colors[1]);
    if (this.type == T_START && this.mode != M_START && this.shrink == false) {
      let xMin = this.x + this.width/2 - 1.5*this.handleW;
      let xMax = xMin + 3*this.handleW;
      if (x > xMin && x < xMax) {
        let yMin = this.y + this.yHeaderEnd - 2 * (1.25 * this.handleH);
        let yMax = yMin + 3*this.handleH;
        if (y > yMin && y < yMax) {
          fill(this.colors[2]);
          rect(this.x + this.width/2 - 1.5*this.handleW, this.y + this.yHeaderEnd - 2 * (1.25 * this.handleH), 3*this.handleW, 3 * this.handleH);
          fill(this.colors[0]);
          if (this.toggleShape === true) {
            rect(this.x + this.width/2 - this.handleW, this.y + this.yHeaderEnd - 2 * this.handleH, this.handleW * 2, this.handleH * 2);
          } else {
            triangle(this.x + this.width/2 - this.handleW, this.y + this.yHeaderEnd - 2 * this.handleH, this.x + this.width/2 - this.handleW, this.y + this.yHeaderEnd, this.x + this.width/2 + this.handleW, this.y + this.yHeaderEnd - this.handleH);
          }
        }
      }
    }
  }

  checkButtons(x, y) {
    let breaker = false;
    if (this.hide === false) {
      let fudge = 2;
      //resize handle?
      if (x > this.x + this.width - this.handleW - fudge && x < this.x + this.width + fudge) {
        if (y > this.y + this.height - this.handleH - fudge && y < this.y + this.height + fudge) {
          this.mode = M_RESIZE;
          breaker = true;
        }
      }
      if (this.type != T_CONDITION && this.type != T_ELSE && this.type != T_DO && this.type != T_OUTLET) {
        // move handle?
        if (x > this.x - fudge && x < this.x + this.handleW + fudge) {
          if (y > this.y - fudge && y < this.y + this.handleH + fudge) {
            this.mode = M_MOVE;
            breaker = true;
          }
        }

        if (x > this.x + this.width/2 - this.handleW && x < this.x + this.width/2) {
          if (y > this.y + this.height - this.handleH && y < this.y + this.height) {
            this.mode = M_EXPAND_OR_COLLAPSE;
            breaker = true;
          }
        }
        // delete
        if (x > this.x + this.width - this.handleW - fudge && x < this.x + this.width + fudge) {
          if (y > this.y - fudge && y < this.y + this.handleH + fudge) {
            if (this.type != T_CONSOLE && this.type != T_START) {
              this.mode = M_DELETE;
              breaker = true;
            }
            if (this.type == T_CONSOLE) {
              this.indexLabeldiv.html(this.textLabel);
              this.lineNumber = 0;
            }
          }
        }
        if (this.type == T_START) {
          if (this.mode != M_MOVE && this.shrink == false) {
            let xMin = this.x + this.width/2 - 1.5*this.handleW;
            let xMax = xMin + 3*this.handleW;
            if (x > xMin && x < xMax) {
              let yMin = this.y + this.yHeaderEnd - 2 * (1.25 * this.handleH);
              let yMax = yMin + 3*this.handleH;
              if (y > yMin && y < yMax) {
                this.mode = M_START;
                breaker = true;
              }
            }
          }
        }
      }
    }
    return breaker;
  }

  updateSHs() {
    if ((this.hasInput == true) || (this.hasSelect == true)) {
      switch (this.type) {
        case T_BLOCK:
          this.funcHandleSH = this.input.value();
          this.dataSH = this.input.value(); //what could go wrong :-P
          break;
        case T_GOTO:
        this.handleSH = this.input.value();
          break;
        case T_VAR:
          this.handleSH = this.input.value();
          break;
        case T_INPUT:
          this.dataSH = this.input.value();
          break;
        default:
          break;
      }
      // this.selfDescribe();
    }
  }
  forcefullyAddChildren(ind, child) {
    this.childIndicies.push(ind);
    this.children.push(child);
  }

  addChild(ind, child, force=false) {
    if (child.type == T_START) {
      return false;
    }
    if ((this.type == T_ASSIGN) && child.type != T_VAR && child.type != T_INPUT) {
      return false;
    }
    if ((this.type == T_PRINT) && (this.children.length == 1)) {
      return false;
    }
    if (force == false && (this.type == T_OUTLET || this.type == T_VAR || this.type == T_INPUT || this.type == T_IF || this.type == T_WHILE || this.type == T_CONSOLE || this.type == T_GOTO)) {
      return false;
    }
    if ((this.type != T_OUTLET && this.type != T_VAR && this.type != T_INPUT && this.type != T_IF && this.type != T_WHILE && this.type != T_CONSOLE) || force == true) {
      if (this.childIndicies.indexOf(ind) == -1) {
        this.children.push(child);
        this.childIndicies.push(ind);
      }
    }
    return true;
  }

  addParent(ind, parent) {
    this.parent = ind;
    if (this.type == T_START) {
      this.parent = -1;
    }
  }

  removeParent() {
    this.parent = -1;
  }

  removeChild(ind) {
    if (this.type != T_VAR && this.type != T_INPUT) {
      let ci = this.childIndicies.indexOf(ind);
      if (ci != -1) {
        this.childIndicies.splice(ci, 1);
        this.children.splice(ci, 1);
      }
    }
    this.minHeight = 0;
    this.reshape(true);
  }

  expandOrCollapse() {
    if (this.shrink === true) {
      this.expandBlock();
    } else {
      this.shrinkBlock();
    }
    this.mode = M_IDLE
  }

  hideDivs() {
    if (this.type == T_VAR) {
      this.varLabeldiv.hide();
    }
    if (this.type == T_BLOCK || this.type == T_INPUT || this.type == T_GOTO || this.type == T_VAR) {
      this.input.hide();
    }
  }

  hideBlock() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].hideBlock();
    }
    this.hide = true;
    this.hideDivs();
    this.indexLabeldiv.hide();
  }

  showDivs() {
    if (this.type == T_VAR) {
      this.varLabeldiv.show();
    }
    if (this.type == T_BLOCK || this.type == T_INPUT || this.type == T_GOTO || this.type == T_VAR) {
      this.input.show();
    }
  }

  showBlock() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].showBlock();
    }
    this.hide = false;
    this.showDivs();
    this.indexLabeldiv.show();
  }

  shrinkBlock() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].hideBlock();
    }
    this.shrink = true;
    this.hideDivs();
  }

  expandBlock() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].showBlock();
      this.children[i].expandBlock();
    }
    this.shrink = false;
    this.showDivs();
    this.minHeight = 0;
    this.reshape();
  }

  selfDescribe(short=false) {
    console.log('TYPE', blockLabels[this.type]);
    if (short == false) {
      console.log('FUNCTION NAME', this.funcHandleSH);
      console.log('DATA',this.dataSH);
      console.log('HANDLE', this.handleSH);
      console.log('CHILDREN', this.childIndicies);
    } else {
      if (this.funcHandleSH != null) {
        console.log('FUNCTION NAME', this.funcHandleSH);
      }
      if (this.dataSH != null) {
        console.log('DATA',this.dataSH);
      }
      if (this.handleSH != null) {
        console.log('HANDLE', this.handleSH);
      }
      if (this.childIndicies.length > 0) {
        console.log('CHILDREN', this.childIndicies);
      }
    }
    console.log('PARENT', this.parent);
    console.log('\n');
  }

  inArea(x, y) {
    let breaker = false;
    if (this.hide === false) {
      let fudge = 2;
      if (x > this.x - fudge && x < this.x + this.width + fudge) {
        if (y > this.y - fudge && y < this.y + this.height + fudge) {
          // this.selfDescribe(false);
          breaker = true;
        }
      }
    }
    return breaker;
  }

};
