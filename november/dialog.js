class DialogEvent {
  constructor(id='', words='') {
    this.id = id;
    this.words = words;
    this.options = [];
    this.conditions = [];
    this.triggers = [];
    this.optionYs = [];
    this.children = [];
    this.printHead = 0;
    this.completed = false;
    this.pauseUntil = -1;
    this.length = words.length;
    this.hasOptions = false;
  }
  reset() {
    this.printHead = 0;
    this.completed = false;
    this.pauseUntil = -1;
    this.optionYs = [];
    if (this.options.length != 0) {
      this.hasOptions = true;
    }
  }
};

class Dialog {
  constructor(x, y, w, h) {
    this.bbox = [x-w, y-w, x+w, y+h, 2*w, 2*h];
    // this.showZones = true;
    this.layer = G.graphLayers.getLayer('dialog', true, 100);
    this.layer.g.textFont(G.loaders['font']);
    this.bgcolor = G.colors[2];
    this.fgcolor = G.colors[0];
    this.fontSize = 12;
    this.lineSpacing = 1.5;
    this.pauseMult = 40;
    this.pauseMin = 500;
    this.textBoxWidth = 100;
    this.totalLineHeight = this.fontSize * this.lineSpacing;
    this.layer.g.textSize(this.fontSize);
    this.layer.g.textLeading(this.lineSpacing * this.fontSize);
    this.layer.g.textAlign(LEFT, TOP);
    this.layer.g.noStroke();
    this.layer.g.textWrap(WORD);
    this.layer.g.rectMode(CORNER);
    this.layer.setClearable();
    this.head = new DialogEvent();
    this.de = this.head;
    this.coords = {};
    this.coords = {};
    this.coords['PC'] = {};
    this.printHeadSpeed = 1;
    this.play = false;
    this.prevPlay = false;
    this.onScr = {};
    this.selector = 0;
    this.pauseForOptions = false;
    this.eventTrigger = false;
    this.past = [];
    this.finished = false;
  }

  shutDown() {
    this.head = null;
    this.de = null;
  }

  addDialogEvent(id, words='') {
    let newLine = new DialogEvent(id, words);
    this.de.children.push(newLine);
    this.de = this.de.children[0];
    return this.de
  }

  addChildDialogEvent(parent, id, words=''){
    let newLine = new DialogEvent(id, words);
    parent.children.push(newLine);
    return parent.children[parent.children.length-1];
  }

  addOption(parent, words, trigger=returnTrue, condition=returnTrue) {
    parent.options.push(words);
    parent.conditions.push(condition);
    parent.triggers.push(trigger);
    parent.hasOptions = true;
  }

  refreshLayout(x, y, w, h) {
    this.layer = G.graphLayers.getLayer('dialog', true, 100);
    this.layer.setClearable();
    this.layer.g.textFont(G.loaders['font']);
    this.layer.g.textSize(this.fontSize);
    this.layer.g.textLeading(this.lineSpacing * this.fontSize);
    this.layer.g.textAlign(LEFT, TOP);
    this.layer.g.noStroke();
    this.layer.g.textWrap(WORD);
    this.layer.setClearable();
    this.layer.g.rectMode(CORNER);
    this.bbox = [x-w, y-w, x+w, y+h, 2*w, 2*h];
    for (key in this.onScr) {
      this.onScr[key].printHead = 0;
    }
    this.reset();
  }

  reset() {
    // reset - can be better
    this.past.push(this.de);
    this.play = false;
    this.prevPlay = false;
    this.finished = false;
    this.onScr = {};
    this.selector = 0;
    this.de = this.head;
    while (this.past.length != 0) {
      let d = this.past.pop();
      d.reset();
    }
  }

  updateCoords(tag, sprite) { // could do more here to fit text in above sprite if screen edges are close
    // create hypothetical layouts
    // 60% of sprite dims (CENTER mode)
    let newFlag = !(tag in this.coords);
    this.coords[tag] = {};
    this.coords[tag].tx = sprite.tx;
    this.coords[tag].ty = sprite.ty;
    let sw = sprite.g.width * 0.6;
    let sh = sprite.g.height * 0.6
    let left = sprite.tx - (this.textBoxWidth + sw);
    let right = sprite.tx + (this.textBoxWidth + sw);
    let above = sprite.ty - sh;
    let below = sprite.ty + sh;
    // find danger zones
    let padding = 30;
    let minLeft = padding;
    let maxRight = G.dims.w - padding;
    let minTop = sh + padding;
    let minBottom = G.dims.h - (sh + padding);
    let leftIsPossible = (left > minLeft);
    let rightIsPossible = (right < maxRight);
    let topIsPossible = (above > minTop);
    let bottomIsPossible = (below < minBottom);
    if (newFlag == true) {
      if (sprite.tx >= G.dims.cx && rightIsPossible == true) {
        this.coords[tag].x = right - this.textBoxWidth;
        this.coords[tag].y = above;
      } else if (sprite.tx < G.dims.cx && leftIsPossible == true) {
        this.coords[tag].x = left;
        this.coords[tag].y = above;
      } else {
        if (rightIsPossible == true) {
          this.coords[tag].x = right - this.textBoxWidth;
          this.coords[tag].y = above;
        } else if (leftIsPossible == true){
          this.coords[tag].x = left;
          this.coords[tag].y = above;
        } else {
          this.coords[tag].y = below;
          this.coords[tag].x = sprite.tx - this.textBoxWidth/2;
        }
      }
    } else {
      // find layout
      let othersOnLeft = false;
      let othersOnRight = false;
      for (key in this.coords) {
        if (key != tag) {
          othersOnRight = (sprite.tx < this.coords[key].tx) || othersOnRight;
          othersOnLeft = (sprite.tx > this.coords[key].tx) || othersOnLeft;
        }
      }
      let failed = true;
      if (othersOnLeft == true && rightIsPossible == true) {
        // do right
        this.coords[tag].x = right - this.textBoxWidth;
        failed = false;
      }

      if (othersOnRight == true && leftIsPossible == true) {
        // do left
        this.coords[tag].x = left;
        failed = false;
      }

      if (topIsPossible == true) {
        this.coords[tag].y = above;
      } else {
        this.coords[tag].y = below;
        this.coords[tag].x = sprite.tx - this.textBoxWidth/2;
        failed = false;
      }

      if (failed == true) {
        if (rightIsPossible == true) {
          this.coords[tag].x = right - this.textBoxWidth;
        } else {
          this.coords[tag].x = left;
        }
        // do center?
      }
    }
  }

  incrementPrintHead() {
    for (key in this.onScr) {
      if (this.onScr[key].printHead < this.onScr[key].length) {
        this.onScr[key].printHead += this.printHeadSpeed;
      }
      if (this.onScr[key].printHead == this.onScr[key].length) {
        this.setPauseTime(this.onScr[key]);
        if (this.onScr[key].hasOptions == false) {
          this.onScr[key].completed = true;
        }
      }
    }
  }

  leaveConversationArea() {
    for (key in this.onScr) {
      if (this.onScr[key].printHead > 0) {
        this.onScr[key].printHead -= this.printHeadSpeed;
      }
    }
    // this.reset();
  }

  setPauseTime(de) {
    if (de.pauseUntil == -1) {
      let pI = (this.pauseMult * de.length)
      if (pI < this.pauseMin) {
        pI = this.pauseMin;
      }
      de.pauseUntil = millis() + pI;
    }
  }

  begin(){
    this.de = this.head.children[0];
    this.onScr[this.de.id] = this.de;
  }

  getChild(){
    let result = this.de;
    if (this.de.children.length != 0) {
      result = this.de.children[this.selector];
      this.selector = 0;
    } else {
      this.finished = true;
    }
    return result;
  }

  progress(input) {
    this.past.push(this.de);
    this.de = this.getChild();
    this.onScr[this.de.id] = this.de;
    input.setChangeListener();
    if (this.de.hasOptions == true) {
      this.pauseForOptions = true;
    } else {
      this.pauseForOptions = false;
    }
  }

  waitForSelection(input) {
    if (input.hasChanged() == true && input.on == true) {
      this.pauseForOptions = false;
      this.chooseOption(input.y);
    }
  }

  update(sprite, input) {
    this.eventTrigger = false;
    this.updateCoords('PC', sprite);
    if (bounded(this.bbox, sprite.tx, sprite.ty).complete == true) {
      this.play = true;
      if (this.prevPlay != this.play) {
        this.begin();
        input.setChangeListener();
        this.prevPlay = this.play;
      }
      this.incrementPrintHead()
    } else {
      this.leaveConversationArea()
    }
    if (this.de.completed == true && millis() > this.de.pauseUntil && this.finished == false) {
      this.progress(input);
    }
    if (this.pauseForOptions) {
      this.waitForSelection(input);
    }
  }

  chooseOption(y) {
    let option = 0;
    if (y < this.de.optionYs[0]) {
      option = 0;
    }
    for (let i = 1; i < this.de.optionYs.length; i++) {
      if ((this.de.optionYs[i-1] < y) && (this.de.optionYs[i] > y)){
        option = i;
      }
    }
    this.de.hasOptions = false;
    this.de.words = this.de.options[option];
    this.de.length = this.de.words.length;
    this.selector = option;
    this.eventTrigger = true;
    this.de.triggers[option]();
    // console.log();
    // this.eventID = this.de.eventIDs[option];
  }

  writeText() {
    let words = this.onScr[key].words.slice(0, this.onScr[key].printHead);
    let x = this.coords[key].x;
    let y = this.coords[key].y;
    let lineCount = ceil(this.layer.g.textWidth(this.onScr[key].words) / this.textBoxWidth);
    let textBoxHeight =lineCount * (this.totalLineHeight);
    if (this.onScr[key].printHead > 0) {
      this.layer.g.fill(this.bgcolor);
      this.layer.g.rect(x, y, this.textBoxWidth, textBoxHeight);
    }
    this.layer.g.fill(this.fgcolor);
    this.layer.g.text(words,x ,y, 100);
  }

  writeOptions() {
    let x = this.coords[key].x
    let y = this.coords[key].y
    let firstTime = (this.onScr[key].optionYs.length == 0);
    for (let i = 0; i < this.onScr[key].options.length; i++) {
      if (this.onScr[key].conditions[i]() == true) {
        let fullText = '> ' + this.onScr[key].options[i];
        let lineCount = ceil(this.layer.g.textWidth(fullText) / this.textBoxWidth);
        let textBoxHeight =lineCount * (this.totalLineHeight);
        this.layer.g.fill(this.bgcolor);
        this.layer.g.rect(x, y, this.textBoxWidth, textBoxHeight);
        this.layer.g.fill(this.fgcolor);
        this.layer.g.text(fullText, x, y, this.textBoxWidth);
        // y += textBoxHeight * 2;
        y += textBoxHeight + this.fontSize;
      }
      if (firstTime) {
        this.onScr[key].optionYs.push(y);
      }
    }
  }

  draw() {
    this.layer.clear();
    if (this.showZones == true) {
      this.layer.g.fill(this.bgcolor);
      this.layer.g.rect(this.bbox[0], this.bbox[1], this.bbox[4], this.bbox[5]);
      this.layer.g.circle(this.bbox[0], this.bbox[1], 20);
    }
    for (key in this.onScr) {
      if (this.onScr[key].hasOptions == false) {
        this.writeText();
      } else {
        this.writeOptions();
      }
    }

  }

};
