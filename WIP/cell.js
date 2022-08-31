function colorToHTMLRGB(color) {
  return "rgb(" + color._getRed() + ", " + color._getGreen() + ", " + color._getBlue() + ")";
}

var selectChanged = true;

function selectChangedCallback(){
  selectChanged = true;
}

function jlog(classname, label) {
  // console.debug(classname, label)
}

class Cell {
  constructor(type, x, y, w, h, c, r=5) {
    jlog('Cell', 'constructor');
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
    this.startForm = false;
    this.inputOptions = [];
    // geometry
    this.childYBorder = 2*r;
    this.childXBorder = 1.5 * r;
    this.ySpacer = 0;
    if (type == T_CONSOLE) {
      this.width = 1.5*w;
      this.height = 3*h;
    } else {
      this.width = w;
      this.height = h;
    }

    this.minWidth = w;
    this.minHeight = h;
    this.radius = r;
    this.x = x;
    this.y = y;
    this.viewX = x;
    this.viewY = y;
    this.deltaX = 0;
    this.deltaY = 0;
    this.hide = false;
    this.shrink = false;
    this.handleW = 1.5*r;
    this.handleH = 1.5*r;
    // colors
    this.colors = c;
    if (type == T_START) {
      this.makeStartButtonOptions();
      this.sbHighlight = false;
    }
    // divs
    this.lineNumber = 0;
    this.indexLabeldiv = createDiv(this.textLabel);
    if (this.type == T_VAR) {
      this.varLabeldiv = createDiv("empty");
    }
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
    this.updateAllDivPositions();
  }

  get size() {
    jlog('Cell', 'size');
    return [this.width, this.height]
  }

  resizeConsole() {
    jlog('Cell', 'resizeConsole');
    if (this.type == T_CONSOLE) {
      this.minWidth = max(100, this.minWidth);
      this.minHeight = max(75, this.minHeight);
      this.indexLabeldiv.size(this.width - this.childXBorder, this.height - this.childYBorder);
      this.indexLabeldiv.style('overflow', "auto");
    }
  }

  buildDivs() {
    jlog('Cell', 'buildDivs');
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
    this.height = this.startHeight;
    this.width = this.startWidth;
    this.ySpacer = 0;
    if (blockConfig[this.type]['input type'] == I_TEXT) {
      this.input = createInput();
      this.input.input(selectChangedCallback);
    }
    if (blockConfig[this.type]['input type'] == I_TEXT_AREA) {
      this.input = createElement('textarea');
      this.input.input(selectChangedCallback);
    }
    if (blockConfig[this.type]['input type'] == I_SELECT) {
      this.input = createSelect();
      this.input.changed(selectChangedCallback);
      this.width = max(this.width, 80);
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.input.style('font-size', '16px');
      this.input.style('background-color', colorToHTMLRGB(this.colors[2]));
      this.input.style('border-color', colorToHTMLRGB(this.colors[1]));
      this.input.style('color', colorToHTMLRGB(this.colors[4]));
      this.input.style('border', 0);
      let h = this.input.size().height;
      let w = this.width;
      this.standardInputHeight = h;
      this.input.size(w, h);
      // this.updateDivPosition(this.input, xp + this.childXBorder, yp + this.yHeaderEnd);
      this.width = w + 3*this.childXBorder;
      this.ySpacer += this.input.height;
      this.minWidth = this.width;
      if (this.type == T_VAR) {
        this.varLabeldiv.remove();
        this.varLabeldiv = createDiv("empty");
        // this.updateDivPosition(this.varLabeldiv, xp + this.childXBorder, yp + this.yHeaderEnd + 2*this.ySpacer);
        this.height += this.childYBorder + this.ySpacer;
        this.minHeight = this.height;
        this.varLabeldiv.style('font-size', '16px');
        this.varLabeldiv.style('color', colorToHTMLRGB(this.colors[4]));
        this.varLabeldiv.show();
      }
    }

    this.updateAllDivPositions();
  }

  updateAllDivPositions() {
    jlog('Cell', 'updateAllDivPositions');
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
    this.updateDivPosition(this.indexLabeldiv, xp + 2*this.childXBorder, yp);
    if (this.type == T_VAR) {
      this.updateDivPosition(this.varLabeldiv, xp + this.childXBorder, yp + this.yHeaderEnd + 2*this.ySpacer);
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.updateDivPosition(this.input, xp + this.childXBorder, yp + this.childYBorder + this.yHeaderEnd);
    }
  }

  updateDataSH(value) {
    jlog('Cell', 'updateDataSH');
    this.dataSH = value;
    if (this.type != T_VAR) {
      let htmlString = this.textLabel + '<br>' + String(this.dataSH);
      this.indexLabeldiv.html(htmlString);
    } else {
      this.varLabeldiv.html(value);
    }
  }

  updateView(xOff, yOff) {
    this.viewX = this.x + xOff;
    this.viewY = this.y + yOff;
  }

  draw(canvas=null) {
    jlog('Cell', 'draw');
    // let x = this.x;
    // let y = this.y;
    let x = this.viewX;
    let y = this.viewY;
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
        if (blockConfig[this.type]['handles']['copy'] == true) {
          fill(this.colors[1]);
          rect(x + this.width - this.handleW, y + this.height/2 - this.handleH, this.handleW, this.handleH);
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
      image(this.sbGraphics[int(this.startForm)][int(this.sbHighlight)], x + this.width/2 - 1.5*this.handleW, y + this.yHeaderEnd - 2 * (1.25 * this.handleH));
    }
  }

  toggleStartForm(myBool){
    jlog('Cell', 'toggleStartForm');
    this.startForm = myBool;
    if (myBool == true) {
      this.textLabel = blockConfig[T_STOP]['block label'];
      this.indexLabeldiv.html(this.textLabel);
    } else {
      this.textLabel = blockConfig[T_START]['block label'];
      this.indexLabeldiv.html(this.textLabel);
    }
  }

  makeStartButtonOptions() {
    jlog('Cell', 'makeStartButtonOptions');
    this.sbGraphics = {};
    this.sbGraphics[0] = {};
    this.sbGraphics[1] = {};

    this.sbGraphics[0][0] = createGraphics(3*this.handleW, 3*this.handleH);
    this.sbGraphics[0][1] = createGraphics(3*this.handleW, 3*this.handleH);
    this.sbGraphics[1][0] = createGraphics(3*this.handleW, 3*this.handleH);
    this.sbGraphics[1][1] = createGraphics(3*this.handleW, 3*this.handleH);

    this.sbGraphics[0][0].stroke(this.colors[1]);
    this.sbGraphics[0][1].stroke(this.colors[1]);
    this.sbGraphics[1][0].stroke(this.colors[1]);
    this.sbGraphics[1][1].stroke(this.colors[1]);

    this.sbGraphics[0][0].fill(this.colors[0]);
    this.sbGraphics[0][1].fill(this.colors[2]);
    this.sbGraphics[1][0].fill(this.colors[0]);
    this.sbGraphics[1][1].fill(this.colors[2]);

    this.sbGraphics[0][0].rect(1, 1, 3*this.handleW - 2, 3*this.handleH - 2);
    this.sbGraphics[0][1].rect(1, 1, 3*this.handleW - 2, 3*this.handleH - 2);
    this.sbGraphics[1][0].rect(1, 1, 3*this.handleW - 2, 3*this.handleH - 2);
    this.sbGraphics[1][1].rect(1, 1, 3*this.handleW - 2, 3*this.handleH - 2);

    this.sbGraphics[0][0].fill(this.colors[2]);
    this.sbGraphics[0][1].fill(this.colors[0]);
    this.sbGraphics[1][0].fill(this.colors[2]);
    this.sbGraphics[1][1].fill(this.colors[0]);

    this.sbGraphics[0][0].triangle(this.handleW * 0.5, this.handleH * 0.5, this.handleW * 0.5, 2.5*this.handleH, this.handleW*2.5, this.handleH*1.5);
    this.sbGraphics[0][1].triangle(this.handleW * 0.5, this.handleH * 0.5, this.handleW * 0.5, 2.5*this.handleH, this.handleW*2.5, this.handleH*1.5);
    this.sbGraphics[1][0].rect(this.handleW * 0.5, this.handleH * 0.5, this.handleW * 2, this.handleH * 2);
    this.sbGraphics[1][1].rect(this.handleW * 0.5, this.handleH * 0.5, this.handleW * 2, this.handleH * 2);
  }

  startButtonUpdate(x, y) {
    jlog('Cell', 'startButtonUpdate');
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
    let xMin = xp + this.width/2 - 1.5*this.handleW;
    let xMax = xMin + 3*this.handleW;
    this.sbHighlight = false;
    if (x > xMin && x < xMax) {
      let yMin = yp + this.yHeaderEnd - 2 * (1.25 * this.handleH);
      let yMax = yMin + 3*this.handleH;
      if (y > yMin && y < yMax) {
        this.sbHighlight = true;

      }
    }
  }

  updateDivPosition(div, x, y){
    jlog('Cell', 'updateDivPosition');
    div.position(x, y);
  }

  moveC(x, y, xdelta, ydelta) {
    jlog('Cell', 'moveC');
    // this.x = x;
    // this.y = y;
    // let xp = this.x;
    // let yp = this.y;
    this.viewX = x;
    this.viewY = y;
    this.x = this.viewX - xdelta;
    this.y = this.viewY - ydelta;
    this.refresh(xdelta, ydelta);
  }

  refresh(xdelta, ydelta) {
    let childX = this.viewX + this.childXBorder;
    let childY = this.viewY + 2*this.childYBorder + this.ySpacer + this.yHeaderEnd;
    this.updateAllDivPositions();
    for (let i = 0; i < this.children.length; i++) {
      if (blockConfig[this.type]['accept child'].indexOf(this.children[i].type) != -1) {
        this.children[i].moveC(childX, childY, xdelta, ydelta);
        childY += this.childYBorder + this.children[i].height;
      }
    }
  }

  resizeC(x, y) {
    jlog('Cell', 'resize');
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
    let nw = x - xp;
    let nh = y - yp;
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
    jlog('Cell', 'reshape');
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
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
    if (this.width < this.indexLabeldiv.size().width + 3 * this.childXBorder && this.type != T_CONSOLE) {
      this.width = this.indexLabeldiv.size().width + 3 * this.childXBorder;
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
      let h = this.input.size().height;
      this.input.size(this.width - 3 * this.childXBorder);
    }
    this.refresh();
  }

  markForDeletion() {
    jlog('Cell', 'markForDeletion');
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].markForDeletion();
    }
    this.mode = M_DELETE;
  }

  cleanForDeletionSafe() {
    jlog('Cell', 'cleanForDeletionSafe');
    let par = -1;
    if (this.mode == M_DELETE) {
      this.indexLabeldiv.remove();
      par = this.parent;
      this.removeParent();
      if (blockConfig[this.type]['input type'] != I_NONE) {
        this.input.remove();
        this.input.remove();
      }
      if (this.type == T_VAR) {
        this.varLabeldiv.remove();
        this.varLabeldiv.remove();
      }
    }
    return par;
  }

  checkButtons(x, y) {
    jlog('Cell', 'checkButtons');
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
    let breaker = false;
    if (this.hide === false) {
      let fudge = 2;
      if (mobileHack == true) {
        fudge = this.handleW;
      }
      if (blockConfig[this.type]['handles']['move'] == true) {
        if (x > xp - fudge && x < xp + this.handleW + fudge) {
          if (y > yp - fudge && y < yp + this.handleH + fudge) {
            console.log('move button pressed');
            this.mode = M_MOVE;
            breaker = true;
          }
        }
      }
      if (blockConfig[this.type]['handles']['resize'] == true) {
        if (x > xp + this.width - this.handleW - fudge && x < xp + this.width + fudge) {
          if (y > yp + this.height - this.handleH - fudge && y < yp + this.height + fudge) {
            console.log('resize button pressed');
            this.mode = M_RESIZE;
            breaker = true;
          }
        }

      }
      if (blockConfig[this.type]['handles']['expand'] == true) {
        if (x > xp + this.width/2 - this.handleW && x < xp + this.width/2) {
          if (y > yp + this.height - this.handleH && y < yp + this.height) {
            console.log('expand || collapse button pressed');
            this.mode = M_EXPAND_OR_COLLAPSE;
            breaker = true;
          }
        }

      }
      if (blockConfig[this.type]['handles']['delete'] == true) {
        if (x > xp + this.width - this.handleW - fudge && x < xp + this.width + fudge) {
          if (y > yp - fudge && y < yp + this.handleH + fudge) {
            console.log('delete button pressed');
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
      // rect(x + this.width - this.handleW, y + this.height/2 - this.handleH, this.handleW, this.handleH);
      if (blockConfig[this.type]['handles']['copy'] == true) {
        let xMin = xp + this.width - this.handleW;
        let yMin = yp + this.height/2 - this.handleH;
        let xMax = xMin + this.handleW;
        let yMax = yMin + this.handleH;
        if (xMin - fudge < x && x < xMax + fudge) {
          if (yMin - fudge < y && y < yMax + fudge) {
            console.log('copy button pressed');
            this.mode = M_COPY;
            breaker = true;
          }
        }
      }
      if (this.type == T_START) {
        if (this.mode != M_MOVE && this.shrink == false) {
          let xMin = xp + this.width/2 - 1.5*this.handleW;
          let xMax = xMin + 3*this.handleW;
          if (x > xMin && x < xMax) {
            let yMin = yp + this.yHeaderEnd - 2 * (1.25 * this.handleH);
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
    jlog('Cell', 'updateSHs');
    if (blockConfig[this.type]['input type'] != I_NONE && this.mode != M_NEW) {
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
        case T_CONST:
          this.dataSH = this.input.value();
          break;
        default:
          break;
      }
      // this.selfDescribe();
    }
  }

  updateOptions(options) {
    jlog('Cell', 'updateOptions');
    if (blockConfig[this.type]['input type'] == I_SELECT) {
      for (let i = 0; i < this.inputOptions.length; i++){
        if (options[this.type].indexOf(this.inputOptions[i]) == -1) {
          console.log(this.inputOptions[i], "is out!");
          this.inputOptions = [];
          this.input.remove();
          this.buildDivs();
          break
        }
      }
      for (let i = 0; i < options[this.type].length; i++){
        this.input.option(options[this.type][i], options[this.type][i]);
        this.inputOptions.push(options[this.type][i]);
      }
      if (options[this.type].indexOf(this.handleSH) != -1){
        this.input.selected(this.handleSH);
      }
    }
  }

  forcefullyAddChildren(ind, child) {
    jlog('Cell', 'forcefullyAddChildren');
    this.childIndicies.push(ind);
    this.children.push(child);
  }

  acceptsChild(type) {
    jlog('Cell', 'acceptsChild');
    return (blockConfig[this.type]['accept child'].indexOf(type) != -1)
  }

  addChild(ind, child, force=false) {
    jlog('Cell', 'addChild');
    if (force == true|| this.acceptsChild(child.type) == true) {
      if (this.childIndicies.indexOf(ind) == -1) {
        this.children.push(child);
        this.childIndicies.push(ind);
      }
    }
    return true;
  }

  addParent(ind, parent) {
    jlog('Cell', 'addParent');
    this.parent = ind;
    if (this.type == T_START) {
      this.parent = -1;
    }
  }

  removeParent() {
    jlog('Cell', 'removeParent');
    this.parent = -1;
  }

  removeChild(ind) {
    jlog('Cell', 'removeChild');
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
    jlog('Cell', 'expandOrCollapse');
    if (this.shrink === true) {
      this.expandBlock();
    } else {
      this.shrinkBlock();
    }
    this.mode = M_IDLE
  }

  hideDivs() {
    jlog('Cell', 'hideDivs');
    if (this.type == T_VAR) {
      this.varLabeldiv.hide();
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.input.hide();
    }
  }

  hideBlock() {
    jlog('Cell', 'hideBlock');
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].hideBlock();
    }
    this.hide = true;
    this.hideDivs();
    this.indexLabeldiv.hide();
  }

  showDivs() {
    jlog('Cell', 'showDivs');
    if (this.type == T_VAR) {
      this.varLabeldiv.show();
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.input.show();
    }
  }

  showBlock() {
    jlog('Cell', 'showBlock');
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].showBlock();
    }
    this.hide = false;
    this.showDivs();
    this.indexLabeldiv.show();
  }

  shrinkBlock() {
    jlog('Cell', 'shrinkBlock');
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].hideBlock();
    }
    this.shrink = true;
    this.hideDivs();
  }

  expandBlock() {
    jlog('Cell', 'expandBlock');
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
    jlog('Cell', 'selfDescribe');
    console.log('TYPE', blockConfig[this.type]['block label']);
    if (short == false) {
      console.log('DATA',this.dataSH);
      console.log('HANDLE', this.handleSH);
      console.log('CHILDREN', this.childIndicies);
      console.log('DIMS', this.width, this.height);
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
    console.log('XY', this.x, this.y);
    console.log('VIEW XY', this.viewX, this.viewY);
    console.log('\n');
  }

  unsetData(){
    jlog('Cell', 'unsetData');
    let nothing;
    this.dataSH = nothing;
  }

  inArea(x, y) {
    jlog('Cell', 'inArea');
    // let xp = this.x;
    // let yp = this.y;
    let xp = this.viewX;
    let yp = this.viewY;
    let breaker = false;
    if (this.hide === false) {
      let fudge = 2;
      if (x > xp - fudge && x < xp + this.width + fudge) {
        if (y > yp - fudge && y < yp + this.height + fudge) {
          // this.selfDescribe(false);
          // this.unsetData()
          breaker = true;
        }
      }
    }
    return breaker;
  }

};
