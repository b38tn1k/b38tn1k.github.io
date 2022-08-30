function colorToHTMLRGB(color) {
  return "rgb(" + color._getRed() + ", " + color._getGreen() + ", " + color._getBlue() + ")";
}

var doMouseStuff = true;
var selectChanged = true;
function selectChangedCallback(){
  selectChanged = true;
  doMouseStuff = false;
}

class Cell {
  constructor(type, x, y, w, h, c, r=5) {
    // heirachy
    this.children = [];
    this.childIndicies = [];
    this.parent = -1;
    // control etc
    this.dataSH;
    this.handleSH;
    this.type = type
    this.textLabel = blockConfig[this.type]['block label'];
    this.hasHandle = false;
    // labels, tools, setup
    if (type == T_BLOCK || type == T_INPUT || type == T_OUTLET) {
      this.hasHandle = true;
    }
    this.mode = M_IDLE;
    this.highlight = false;
    this.underneath = false;
    this.flash = false;
    this.toggleShape = false;
    // geometry
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
    this.updateDivPosition(this.indexLabeldiv, this.x + 2*this.childXBorder, this.y + this.childYBorder);
    this.indexLabeldiv.style('font-size', '16px');
    this.indexLabeldiv.style('color', colorToHTMLRGB(this.colors[4]));
    this.indexLabeldiv.show();
    this.yHeaderEnd = parseInt(this.indexLabeldiv.style('font-size')) + this.childYBorder;
    if (this.type == T_START) {
      this.yHeaderEnd += 2 * this.handleH;
    } else {
      this.yHeaderEnd -= 2 * this.handleH;
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
    if (blockConfig[this.type]['input type'] == I_TEXT) {
      this.input = createInput();
    }
    if (blockConfig[this.type]['input type'] == I_TEXT_AREA) {
      this.input = createElement('textarea');
    }
    if (blockConfig[this.type]['input type'] == I_SELECT) {
      this.input = createSelect();
      this.input.changed(selectChangedCallback);
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.input.style('font-size', '16px');
      let h = this.input.size().height;
      this.standardInputHeight = h;
      this.input.size(this.width - 3*this.childXBorder, h);
      this.input.style('background-color', colorToHTMLRGB(this.colors[2]));
      this.input.style('border-color', colorToHTMLRGB(this.colors[1]));
      this.input.style('color', colorToHTMLRGB(this.colors[4]));
      this.input.style('border', 0);
      this.updateDivPosition(this.input, this.x + this.childXBorder, this.y + this.yHeaderEnd);
      this.width = this.input.size().width + 3*this.childXBorder;
      this.ySpacer += this.input.height;
      this.minWidth = this.width;
      if (this.type == T_VAR) {
        this.varLabeldiv = createDiv("empty");
        this.updateDivPosition(this.varLabeldiv, this.x + this.childXBorder, this.y + this.yHeaderEnd + 2*this.ySpacer);
        this.height += this.childYBorder + this.ySpacer;
        this.minHeight = this.height;
        this.varLabeldiv.style('font-size', '16px');
        this.varLabeldiv.style('color', colorToHTMLRGB(this.colors[4]));
        this.varLabeldiv.show();
      }
    }
  }

  updateDataSH(value) {
    this.dataSH = value;
    if (this.type != T_VAR) {
      let htmlString = this.textLabel + '<br>' + String(this.dataSH);
      this.indexLabeldiv.html(htmlString);
    } else {
      this.varLabeldiv.html(value);
    }
  }

  draw(xOff, yOff, canvas=null) {
    let x = this.x// + xOff;
    let y = this.y// + yOff;
    if (this.hide === false){
      if (canvas === null) {
        // body
        if (this.flash == true) {
          fill(this.colors[2]);
        } else {
          if (this.highlight === true) {
            fill(this.colors[2]);
          } else {
            fill(this.colors[0]);
          }
        }
        if (this.underneath === true) {
          if (blockConfig[this.type]['input type'] != I_NONE) {
            this.input.hide();
          }
          this.indexLabeldiv.hide();

        }
        if (this.underneath === false) {
          if (blockConfig[this.type]['input type'] != I_NONE) {
            this.input.show();
          }
          this.indexLabeldiv.show();

        }
        stroke(this.colors[1]);
        rect(x, y, this.width, this.height, this.radius);
        if (blockConfig[this.type]['handles']['move'] == true) {
          fill(this.colors[1]);
          rect(x, y, this.handleW, this.handleH);
        }
        if (blockConfig[this.type]['handles']['resize'] == true) {
          fill(this.colors[1]);
          rect(x + this.width - this.handleW, y + this.height - this.handleH, this.handleW, this.handleH);
        }
        if (blockConfig[this.type]['handles']['expand'] == true) {
          fill(this.colors[1]);
          rect(x + this.width/2 - this.handleW, y + this.height - this.handleH, this.handleW, this.handleH);
        }
        if (blockConfig[this.type]['handles']['delete'] == true) {
          fill(this.colors[3]);
          stroke(this.colors[3]);
          rect(x + this.width - this.handleW, y, this.handleW, this.handleH);
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
      rect(x + this.width/2 - 1.5*this.handleW, y + this.yHeaderEnd - 2 * (1.25 * this.handleH), 3*this.handleW, 3 * this.handleH);
      fill(this.colors[2]);
      if (this.toggleShape === true) {
        rect(x + this.width/2 - this.handleW, y + this.yHeaderEnd - 2 * this.handleH, this.handleW * 2, this.handleH * 2);
      } else {
        triangle(x + this.width/2 - this.handleW, y + this.yHeaderEnd - 2 * this.handleH, x + this.width/2 - this.handleW, y + this.yHeaderEnd, x + this.width/2 + this.handleW, y + this.yHeaderEnd - this.handleH);
      }
    }
  }

  updateDivPosition(div, x, y){
    div.position(x, y);
  }

  moveC(x, y) {
    x = max(x, this.handleW);
    y = max(y, this.handleH);
    this.x = x;
    this.y = y;
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.updateDivPosition(this.input, this.x + this.childXBorder, this.y + this.childYBorder + this.yHeaderEnd);
    }
    if (this.type == T_VAR) {
      this.updateDivPosition(this.varLabeldiv, x + this.childXBorder, this.y + this.yHeaderEnd + 2*this.ySpacer);
    }
    this.updateDivPosition(this.indexLabeldiv, this.x + 2*this.childXBorder, this.y);
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
    if (this.type == T_COMMENT) {
      this.input.size(this.width - 3*this.childXBorder, this.height - 4*this.childYBorder);
      this.minHeight = this.height;
      this.minWidth = this.minWidth;
    } else {
      this.width = max(this.minWidth, this.width);
    }

    this.height = max(this.minHeight, this.height);
    if (blockConfig[this.type]['input type'] != I_NONE && blockConfig[this.type]['input type'] != I_TEXT_AREA && this.type != T_CONSOLE) {
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
    if (this.height < this.indexLabeldiv.size().height) {
      this.minHeight = this.indexLabeldiv.size().height + 2*this.childYBorder;
    }
    if (reshape == true) {
      this.height = this.minHeight;
    }
    if (this.shrink === true) {
      this.height = this.yHeaderEnd * 3;
      this.minHeight = this.height;
    }
    if (this.width < this.indexLabeldiv.size().width + 3 * this.childXBorder) {
      this.width = this.indexLabeldiv.size().width + 3 * this.childXBorder;
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
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
      if (blockConfig[this.type]['input type'] != I_NONE) {
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
      this.textLabel = blockConfig[T_STOP]['block label'];
      this.indexLabeldiv.html(this.textLabel);
    } else {
      this.textLabel = blockConfig[T_START]['block label'];
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
      if (blockConfig[this.type]['handles']['move'] == true) {
        if (x > this.x - fudge && x < this.x + this.handleW + fudge) {
          if (y > this.y - fudge && y < this.y + this.handleH + fudge) {
            this.mode = M_MOVE;
            breaker = true;
          }
        }
      }
      if (blockConfig[this.type]['handles']['resize'] == true) {
        if (x > this.x + this.width - this.handleW - fudge && x < this.x + this.width + fudge) {
          if (y > this.y + this.height - this.handleH - fudge && y < this.y + this.height + fudge) {
            this.mode = M_RESIZE;
            breaker = true;
          }
        }

      }
      if (blockConfig[this.type]['handles']['expand'] == true) {
        if (x > this.x + this.width/2 - this.handleW && x < this.x + this.width/2) {
          if (y > this.y + this.height - this.handleH && y < this.y + this.height) {
            this.mode = M_EXPAND_OR_COLLAPSE;
            breaker = true;
          }
        }

      }
      if (blockConfig[this.type]['handles']['delete'] == true) {
        if (x > this.x + this.width - this.handleW - fudge && x < this.x + this.width + fudge) {
          if (y > this.y - fudge && y < this.y + this.handleH + fudge) {
            if (this.type == T_CONSOLE) {
              this.indexLabeldiv.html(this.textLabel);
              this.lineNumber = 0;
            } else {
              this.mode = M_DELETE;
              breaker = true;
            }
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
    return breaker;
  }

  updateSHs() {
    if (blockConfig[this.type]['input type'] != I_NONE) {
      switch (this.type) {
        case T_BLOCK:
          if (this.mode != M_SELECTED) {
            this.handleSH = this.input.value();
            this.dataSH = this.input.value();
          }
          break;
        case T_GOTO:
          this.handleSH = this.input.value();
          this.handleSH = this.input.value();
          break;
        case T_VAR:
          this.handleSH = this.input.value();
          break;
        case T_INPUT:
          if (this.mode != M_SELECTED) {
            this.dataSH = this.input.value();
          }
          break;
        case T_COMMENT:
          this.dataSH = this.input.value();
          break;
        default:
          break;
      }
      // this.selfDescribe();
    }
  }

  updateOptions(options) {
    if (blockConfig[this.type]['input type'] == I_SELECT) {
      for (let i = 0; i < options[this.type].length; i++){
        this.input.option(options[this.type][i], options[this.type][i]);
      }
    }
  }

  forcefullyAddChildren(ind, child) {
    this.childIndicies.push(ind);
    this.children.push(child);
  }

  acceptsChild(type) {
    return (blockConfig[this.type]['accept child'].indexOf(type) != -1)
  }

  addChild(ind, child, force=false) {
    if (force == true|| this.acceptsChild(child.type) == true) {
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
    if (blockConfig[this.type]['input type'] != I_NONE) {
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
    if (blockConfig[this.type]['input type'] != I_NONE) {
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
    console.log('TYPE', blockConfig[this.type]['block label']);
    if (short == false) {
      console.log('DATA',this.dataSH);
      console.log('HANDLE', this.handleSH);
      console.log('CHILDREN', this.childIndicies);
    } else {
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

  unsetData(){
    let nothing;
    this.dataSH = nothing;
  }

  inArea(x, y) {
    let breaker = false;
    if (this.hide === false) {
      let fudge = 2;
      if (x > this.x - fudge && x < this.x + this.width + fudge) {
        if (y > this.y - fudge && y < this.y + this.height + fudge) {
          // this.selfDescribe(false);
          // this.unsetData()
          breaker = true;
        }
      }
    }
    return breaker;
  }

};
