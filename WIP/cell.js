function selectChangedCallback(){
  selectChanged = true;
  redrawCounter = 2;
}

class Cell {
  constructor(type, x, y, w, h, c, r) {
    jlog('Cell', 'constructor');
    // heirachy
    this.children = [];
    this.childIndicies = [];
    this.parent = -1;
    // control etc
    this.dataSH;
    this.dataSHasType = {};
    this.handleSH = 'unset';
    // if (type == T_VAR || type == T_OUTLET || type == T_RANGE) {
    //   this.handleSH = 'unset';
    // }
    this.type = type
    this.textLabel = blockConfig[this.type]['block label'];
    if (this.type == T_BLOCK){
      this.textLabel = '<a href="javascript:void(0)" onclick="toggleInput("")">' + this.textLabel + '</a>';
    }
    // labels, tools, setup
    this.mode = M_IDLE;
    this.highlight = false;
    this.underneath = false;
    this.flash = false;
    this.startForm = false;
    this.showHandleInput = false;
    this.inputOptions = [];
    // geometry
    this.childYBorder = 2*r;
    this.childXBorder = 1.5 * r;
    this.ySpacer = 0;
    if (type == T_CONSOLE) {
      w = 2*w;
      h = 5*h;
    }
    this.width = w;
    this.height = h;
    this.oldHeight = h;
    this.minWidth = w;
    this.minHeight = h;
    this.radius = r;
    this.x = x;
    this.y = y;
    this.deletable = true;
    this.viewX = x;
    this.viewY = y;
    this.deltaX = 0;
    this.deltaY = 0;
    this.hide = false;
    this.shrink = false;
    this.handleW = 1.5*r;
    this.handleH = 1.5*r;
    this.graphicUpdate = true;
    this.specialLayer = null;
    // colors
    this.colors = c;
    if (type == T_START) {
      this.makeStartButtonOptions();
      this.sbHighlight = false;
    }
    // divs
    this.lineNumber = 0;
    this.indexLabeldiv = createDiv(this.textLabel);
    this.indexLabeldiv.style('font-size', fontSizeString);
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
    if (this.type == T_TURTLE){
      this.canvas = createGraphics(200, 150);
      this.canvas.pixelDensity(1);
      this.canvas.background(255);
    }
    this.buildDivs();
    this.resizeConsole();
    this.updateAllDivPositions();
  }

  get size() {
    jlog('Cell', 'size');
    return [this.width, this.height]
  }

  resetDims() {
    this.minWidth = this.width;
    this.minHeight = this.height;
  }

  getDataSH() {
    const d = new Date();
    switch(this.handleSH) {
      case 'random':
        this.dataSH = random();
        break;
      case 'year':
        this.dataSH = d.getFullYear();
        break;
      case 'month#':
        this.dataSH = d.getMonth() + 1;
        break;
      case 'monthS':
        const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        this.dataSH = month[d.getMonth()];
        break;
      case 'day#':
        this.dataSH = d.getDate();
        break;
      case 'dayS':
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.dataSH = days[d.getDay()];
        break;
      case 'hour':
        this.dataSH = d.getHours();
        break;
      case 'minute':
        this.dataSH = d.getMinutes();
        break;
      case 'second':
        this.dataSH = d.getSeconds();
        break;
      case 'millis':
        this.dataSH = d.getMilliseconds();
        break;
      default:
        break;
    }
    return this.dataSH;
  }

  getDataSHForPrint() {
    let res = this.getDataSH();
    if (String(res) == 'undefined') {
      res = this.textLabel;
    }
    return res;
  }

  disableDelete(){
    this.deletable = false;
  }

  updateHandleSH(newHandle) {
    this.handleSH = newHandle;
    if (this.type == T_BLOCK || this.type == T_INPUT){
      this.textLabel = '<strong><a href="javascript:void(0)" onclick="toggleInput(\''+String(this.handleSH)+'\',' + String(this.type) + ')">' + blockConfig[this.type]['block label'] + '</a></strong>';
      this.indexLabeldiv.html(this.textLabel + ' ' + newHandle);
      this.updateView(this.viewX - this.x, this.viewY - this.y);
      this.updateAllDivPositions();
      this.refresh();
    }
    if (this.type == T_BLOCK) {
      this.input.value(newHandle);
    }
    if (this.type == T_VAR) {
      this.input.selected(newHandle);
      this.indexLabeldiv.html(this.textLabel + ' ' + newHandle);
    }
    if (this.type == T_GOTO) {
      this.input.selected(newHandle);
      this.indexLabeldiv.html(this.textLabel + ' ' + newHandle);
    }

    if (blockConfig[this.type]['input type'] == I_SELECT) {
      this.input.selected(newHandle);
    }

    // if (newHandle != 'unset' && String(newHandle) != 'undefined'){
    //   this.indexLabeldiv.html(this.textLabel + ' ' + newHandle);
    // }
  }

  reStyle() {
    jlog('Cell', 'reStyle');
    this.indexLabeldiv.style('font-size', fontSizeString);
    this.indexLabeldiv.style('color', colorToHTMLRGB(this.colors[4]));
    this.indexLabeldiv.show();
    this.buildDivs();
    // if (blockConfig[this.type]['input type'] != I_NONE) {
    //   this.input.style('font-size', fontSizeString);
    // }

  }

  resizeConsole() {
    jlog('Cell', 'resizeConsole');
    this.graphicUpdate = true;
    if (this.type == T_CONSOLE) {
      this.minWidth = max(100, this.minWidth);
      this.minHeight = max(75, this.minHeight);
      this.indexLabeldiv.size(this.width - 3*this.childXBorder, this.height - this.childYBorder);
      this.indexLabeldiv.style('overflow', "auto");
    }
  }

  buildDivs() {
    jlog('Cell', 'buildDivs');
    this.graphicUpdate = true;
    let xp = this.viewX;
    let yp = this.viewY;
    this.height = this.startHeight;
    this.width = this.startWidth;
    this.ySpacer = 0;
    if (this.input) {
      this.input.remove();
    }
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
      this.width = max(this.width, this.startWidth);
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.input.style('font-size', fontSizeString);
      if (this.showHandleInput == true) {
        this.input.style('background-color', colorToHTMLRGB(this.colors[1]));
      } else {
        if (this.type == T_CONST){
          this.input.style('background-color', colorToHTMLRGB(color(255)));
        } else {
          this.input.style('background-color', colorToHTMLRGB(this.colors[2]));
        }
      }
      this.input.style('border-color', colorToHTMLRGB(this.colors[1]));
      this.input.style('color', colorToHTMLRGB(this.colors[4]));
      this.input.style('border', 0);
      let h = this.input.size().height;
      let w = this.width;
      this.standardInputHeight = h;
      this.input.size(w, h);
      this.width = w + 3*this.childXBorder;
      if (mobileHackActual == true) {
        this.width += this.handleW;
      }
      this.ySpacer += this.input.height;
      this.minWidth = this.width;
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
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.updateDivPosition(this.input, xp + this.childXBorder, yp + this.childYBorder + this.yHeaderEnd);
    }
  }

  updateDataSH(value, hard=false) {
    jlog('Cell', 'updateDataSH');
    this.dataSH = value;
    if (blockConfig[this.type]['input type'] == I_TEXT && hard==true){
      this.input.value(value, value);
    }
    // if (/^\d+\.\d+$/.test(String(value)) == true) {
    //   value = parseFloat(value).toFixed(3);
    // }

    // if (this.type != T_INLET) {
    //   let htmlString = this.textLabel + ' ' + this.handleSH + String(value);
    //   this.indexLabeldiv.html(htmlString);
    // }
    this.unpackDataSH();
  }

  updateView(xOff, yOff) {
    jlog('Cell', 'updateView');
    if (this.parent == -1){
      this.viewX = this.x + xOff;
      this.viewY = this.y + yOff;
    }
  }

  draw(canvas=null) {
    jlog('Cell', 'draw');
    // let x = this.x;
    // let y = this.y;
    let x = this.viewX;
    let y = this.viewY;
    if (this.specialLayer) {
      let sx = x - (this.specialLayer.width - this.width)/2;
      let sy = y - (this.specialLayer.height - this.height)/2;
      image(this.specialLayer, int(sx), int(sy));
    }
    if (this.hide === false){
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
          if (this.type == T_BLOCK) {
            if (this.showHandleInput == true) {
              this.input.show();
            } else {
              this.input.hide();
            }
          } else {
            this.input.show();
          }
        }
        this.indexLabeldiv.show();

      }
      stroke(this.colors[1]);
      rect(x, y, this.width, this.height, this.radius);
      if (blockConfig[this.type]['handles']['move'] == true) {
        fill(this.colors[1]);
        rect(x, y, this.handleW, this.handleH);
      }
      if (blockConfig[this.type]['handles']['delete'] == true) {
        fill(this.colors[3]);
        stroke(this.colors[3]);
        rect(x + this.width - this.handleW, y, this.handleW, this.handleH);
        stroke(this.colors[1]);
      }
      if (blockConfig[this.type]['handles']['expand'] == true) {
        fill(this.colors[1]);
        rect(x + this.width/2 - this.handleW, y + this.height - this.handleH, this.handleW, this.handleH);
      }
      if (this.shrink == false) {
        if (blockConfig[this.type]['handles']['resize'] == true) {
          fill(this.colors[1]);
          rect(x + this.width - this.handleW, y + this.height - this.handleH, this.handleW, this.handleH);
        }
        if (blockConfig[this.type]['handles']['copy'] == true) {
          fill(this.colors[1]);
          rect(x + this.width - this.handleW, y + this.height/2 - this.handleH, this.handleW, this.handleH);
        }
        if (blockConfig[this.type]['handles']['mutate'] != -1) {
          fill(this.colors[1]);
          rect(x, y + this.height - this.handleH, this.handleW, this.handleH);
        }
      }
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].draw();
      }
      if (this.type == T_TURTLE){
        image(this.canvas, x + this.handleW, y + 3*this.yHeaderEnd)
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

  updateDivPosition(div, x, y){
    jlog('Cell', 'updateDivPosition');
    div.position(x, y);
  }

  moveC(x, y, xdelta, ydelta) {
    jlog('Cell', 'moveC');
    this.graphicUpdate = true;
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
    jlog('Cell', 'refresh');
    this.graphicUpdate = true;
    let childX = this.viewX + this.childXBorder;
    let childY = this.viewY + 2*this.childYBorder + this.ySpacer + this.yHeaderEnd;
    if (this.showHandleInput == false && this.type == T_BLOCK){
      childY -= this.standardInputHeight;
    }
    if (this.type == T_TURTLE){
      childX += this.canvas.width + this.handleW;
      childY = this.viewY + 3*this.yHeaderEnd;// + this.childYBorder + this.ySpacer + this.yHeaderEnd;
    }
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
    this.graphicUpdate = true;
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
      if (mobileHackActual == true) {
        this.input.size(this.width - 3*this.childXBorder - this.handleW, this.height - 4*this.childYBorder);
      } else {
        this.input.size(this.width - 3*this.childXBorder, this.height - 4*this.childYBorder);
      }
      this.minHeight = this.height;
      this.minWidth = this.minWidth;
    } else {
      this.width = max(this.minWidth, this.width);
    }

    this.height = max(this.minHeight, this.height);
    if (blockConfig[this.type]['input type'] != I_NONE && blockConfig[this.type]['input type'] != I_TEXT_AREA && this.type != T_CONSOLE) {
      if (mobileHackActual == true) {
        this.input.size(this.width - 3*this.childXBorder - this.handleW, this.standardInputHeight);
      } else {
        this.input.size(this.width - 3*this.childXBorder, this.standardInputHeight);
      }
    }

    this.resizeConsole();

  }

  reshape(reshape=false) {
    jlog('Cell', 'reshape');
    this.graphicUpdate = true;
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
      if (this.children[i].hide == false){
        heightSum += this.children[i].height + this.childYBorder;
      }

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
      this.width = this.startWidth;
      if (this.type == T_START) {
        this.height = this.yHeaderEnd;
      } else {
        this.height = this.yHeaderEnd * 3;
      }
      this.minHeight = this.height;
    }
    if (this.width < this.indexLabeldiv.size().width + 3 * this.childXBorder && this.type != T_CONSOLE) {
      this.width = this.indexLabeldiv.size().width + 3 * this.childXBorder;
    }
    if (blockConfig[this.type]['input type'] != I_NONE) {
      let h = this.input.size().height;
      if (mobileHackActual == true) {
        this.input.size(this.width - 3 * this.childXBorder - this.handleW);
      } else {
        this.input.size(this.width - 3 * this.childXBorder);
      }

    }
    this.refresh(0, 0);
    if (this.type == T_TURTLE){
      this.height = this.canvas.height + this.yHeaderEnd + 4 * this.handleH;
      this.width = this.canvas.width + 2 * this.handleW;
      if (this.children[0]) {
        if (this.children[0].mode != M_DELETE){
          this.width += this.children[2].width + this.handleW;
        }
      }
    }
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
    if (this.hide == false) {
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
      if (blockConfig[this.type]['handles']['delete'] == true) {
        if (x > xp + this.width - this.handleW - fudge && x < xp + this.width + fudge) {
          if (y > yp - fudge && y < yp + this.handleH + fudge) {
            console.log('delete button pressed');
            if (this.type == T_CONSOLE) {
              this.indexLabeldiv.html(this.textLabel);
              this.lineNumber = 0;
            } else {
              if (this.deletable == true){
                this.mode = M_DELETE;
              }
              breaker = true;
            }
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
      if (this.shrink == false){
        if (blockConfig[this.type]['handles']['resize'] == true) {
          if (x > xp + this.width - this.handleW - fudge && x < xp + this.width + fudge) {
            if (y > yp + this.height - this.handleH - fudge && y < yp + this.height + fudge) {
              console.log('resize button pressed');
              this.mode = M_RESIZE;
              breaker = true;
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
        if (blockConfig[this.type]['handles']['mutate'] != -1) {
          if (xp - fudge < x && x < xp+this.handleW + fudge) {
            if (yp + this.height - this.handleH - fudge < y && y < yp + this.height + fudge){
              console.log('mutate button pressed');
              this.mode = M_MUTATE;
              breaker = true;
            }
          }
        }
        if (this.type == T_START) {
          if (this.mode != M_MOVE && this.shrink == false) {
            let xMin = xp + this.width/2 - 1.5*this.handleW - fudge;
            let xMax = xMin + 3*this.handleW + fudge;
            if (x > xMin && x < xMax) {
              let yMin = yp + this.yHeaderEnd - 2 * (1.25 * this.handleH) - fudge;
              let yMax = yMin + 3*this.handleH + fudge;
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
    jlog('Cell', 'updateSHs');
    if (blockConfig[this.type]['input type'] != I_NONE && this.mode != M_NEW) {
      switch (this.type) {
        case T_BLOCK:
          if (this.mode != M_SELECTED) {
            this.updateHandleSH(this.input.value());
          }
          break;
        case T_GOTO:
          this.updateHandleSH(this.input.value());
          break;
        case T_VAR:
          this.updateHandleSH(this.input.value());
          break;
        case T_GET:
          this.updateHandleSH(this.input.value());
          break;
        case T_RUN:
          this.updateHandleSH(this.input.value());
          break;
        case T_SET:
          this.updateHandleSH(this.input.value());
          break;
        case T_RANGE:
          this.updateHandleSH(this.input.value());
          break;
        case T_PUSH:
          this.updateHandleSH(this.input.value());
          break;
        case T_DELETE:
          this.updateHandleSH(this.input.value());
          break;
        case T_LEN:
          this.updateHandleSH(this.input.value());
          break;
        case T_OUTLET:
            let tempHandle = this.input.value();
            if (this.handleSH != tempHandle){
              this.unsetData();
              // this.handleSH = tempHandle;
              this.updateHandleSH(tempHandle);
            }
          break;
        case T_INPUT:
          if (this.mode != M_SELECTED) {
            if (this.showHandleInput == false){
              this.updateDataSH(this.input.value());
            }
          }
          break;
        case T_COMMENT:
          this.dataSH = this.input.value();
          break;
        case T_CONST:
          this.updateDataSH(this.input.value());
          break;
        default:
          break;
      }
      this.unpackDataSH();
    }
  }

  unpackDataSH() {
    this.dataSHasType['string'] = this.dataSH;
    this.dataSHasType['number'] = parseFloat(this.dataSH);
    this.dataSHasType['isNumber'] = !(isNaN(this.dataSHasType['number']));
    if (this.dataSH == 'false'){
      this.dataSHasType['bool'] = false;
    } else {
      this.dataSHasType['bool'] = true;
    }
    if (/^\d+\.\d+$/.test(this.dataSH) == true || /^\d+$/.test(this.dataSH) == true) {
      this.dataSHasType['bool'] = Boolean(parseInt(this.dataSH))
    }
  }

  updateOptions(options) {
    jlog('Cell', 'updateOptions');
    if (blockConfig[this.type]['input type'] == I_SELECT) {
      for (let i = 0; i < this.inputOptions.length; i++){
        if (options[this.type].indexOf(this.inputOptions[i]) == -1) {
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
    let tempSet = new Set(this.inputOptions);
    this.inputOptions = Array.from(tempSet);
  }

  forcefullyAddChildren(ind, child) {
    jlog('Cell', 'forcefullyAddChildren');
    this.graphicUpdate = true;
    this.childIndicies.push(ind);
    this.children.push(child);
  }

  acceptsChild(type) {
    jlog('Cell', 'acceptsChild');
    return (blockConfig[this.type]['accept child'].indexOf(type) != -1)
  }

  addChild(ind, child, force=false) {
    jlog('Cell', 'addChild');
    this.graphicUpdate = true;
    if (force == true|| (this.acceptsChild(child.type) == true && this.children.length < blockConfig[this.type]['max children'])) {
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
    this.graphicUpdate = true;
    if (this.type != T_VAR && this.type != T_INPUT) {
      let ci = this.childIndicies.indexOf(ind);
      if (ci != -1) {
        this.childIndicies.splice(ci, 1);
        this.children.splice(ci, 1);
      }
    }
    this.minHeight = 0;
    this.reshape(true);
    return this.parent;
  }

  expandOrCollapse() {
    jlog('Cell', 'expandOrCollapse');
    if (this.type == T_TURTLE) {
      this.canvas.clear();
      this.canvas.background(255);
      this.shrink = false;
    } else {
      if (this.shrink === true) {
        this.expandBlock();
      } else {
        this.shrinkBlock();
      }
    }
    this.graphicUpdate = true;
    this.mode = M_IDLE
  }

  hideDivs() {
    jlog('Cell', 'hideDivs');
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.input.hide();
    }
  }

  hideBlock() {
    jlog('Cell', 'hideBlock');
    this.graphicUpdate = true;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].hideBlock();
    }
    this.hide = true;
    this.hideDivs();
    this.indexLabeldiv.hide();
  }

  showDivs() {
    jlog('Cell', 'showDivs');
    if (blockConfig[this.type]['input type'] != I_NONE) {
      if (this.type == T_BLOCK) {
        if (this.showHandleInput == true) {
          this.input.show();
        } else {
          this.input.hide();
        }
      } else {
        this.input.show();
      }
    }
  }

  showBlock() {
    jlog('Cell', 'showBlock');
    this.graphicUpdate = true;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].showBlock();
    }
    this.hide = false;
    this.showDivs();
    this.indexLabeldiv.show();
  }

  shrinkBlock() {
    jlog('Cell', 'shrinkBlock');
    this.graphicUpdate = true;
    this.oldHeight = this.height;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].hideBlock();
      this.children[i].shrinkBlock();
    }
    this.shrink = true;
    this.width = this.startWidth;
    this.hideDivs();
  }

  expandBlock() {
    jlog('Cell', 'expandBlock');
    this.graphicUpdate = true;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].showBlock();
      this.children[i].expandBlock();
    }
    this.shrink = false;
    this.showDivs();
    this.minHeight = this.oldHeight;
    this.height = this.oldHeight;
    this.reshape();
  }

  selfDescribe(short=false) {
    jlog('Cell', 'selfDescribe');
    console.log('TYPE', blockConfig[this.type]['block label']);
    console.log('DATA',this.dataSH);
    console.log('DATAAS',this.dataSHasType);
    console.log('HANDLE', this.handleSH);
    console.log('CHILDREN', this.childIndicies);
    console.log('DIMS', this.width, this.height);
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

  pushX(x) {
    this.viewX += x;
    this.x += x;
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
      if (mobileHack == true) {
        fudge = this.handleW;
      }
      if (x > xp - fudge && x < xp + this.width + fudge) {
        if (y > yp - fudge && y < yp + this.height + fudge) {
          if (clickDebug == true) {
            this.selfDescribe(false);
          }
          // this.unsetData()
          // this.children = [];
          // this.parent = -1;
          breaker = true;
        }
      }
    }
    return breaker;
  }

};
