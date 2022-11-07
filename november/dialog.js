class DialogEvent {
  constructor(id='', words='', options = [], conditions = []) {
    this.id = id;
    this.words = words;
    this.options = options;
    this.conditions = conditions;
    this.optionYs = [];
    this.children = [];
    this.printHead = 0;
    this.completed = false;
    this.pauseUntil = -1;
    this.length = words.length;
    this.hasOptions = (options.length != 0);
  }
};

class Dialog {
  constructor(y, h) {
    this.layer = G.gLayers.getLayer('dialog', true, 100);
    this.layer.g.textAlign(LEFT, TOP);
    this.layer.g.textWrap(WORD);
    this.layer.setClearable();
    this.head = new DialogEvent();
    this.de = this.head;
    this.coords = {};
    this.yIn = y;
    this.yOut = y - h;
    this.coords = {};
    this.coords['PC'] = {};
    this.printHeadSpeed = 1;
    this.play = false;
    this.prevPlay = false;
    this.onScr = {};
    this.selector = 0;
    this.pauseMult = 40;
    this.pauseMin = 500;
    this.optionBorder = 20;
    this.textBoxWidth = 100;
    this.pauseForOptions = false;
    this.eventTrigger = false;
  }

  updateCoords(tag, sprite, playerCharacter=false) {
    this.coords[tag] = {};
    if (playerCharacter == true) {
      for (key in this.coords) {
        if (key != 'PC') {
          if (this.coords[key].tx > sprite.tx) {
            this.coords[tag].x = sprite.tx + (sprite.g.width * 0.6);
          } else {
            this.coords[tag].x = sprite.tx - (this.textBoxWidth + (sprite.g.width * 0.6));
          }
        }
      }
    } else {
      if (sprite.tx > G.dims.cx) {
        this.coords[tag].x = sprite.tx + (sprite.g.width * 0.6);
      } else {
        this.coords[tag].x = sprite.tx - (this.textBoxWidth + (sprite.g.width * 0.6));
      }
    }
    this.coords[tag].y = sprite.ty - sprite.g.height * 0.6;
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

  decrementPrintHead() {
    for (key in this.onScr) {
      if (this.onScr[key].printHead > 0) {
        this.onScr[key].printHead -= this.printHeadSpeed;
      }
    }
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
    }
    return result;
  }

  progress(input) {
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
    if (input.on == true && input.hasChanged() == true) {
      this.pauseForOptions = false;
      this.chooseOption(input.y);
      this.eventTrigger = true;
    }
  }

  update(sprite, input) {
    this.eventTrigger = false;
    this.updateCoords('PC', sprite, true);
    if (sprite.ty < this.yIn && sprite.ty > this.yOut) {
      this.play = true;
      if (this.prevPlay != this.play) {
        this.begin();
        input.setChangeListener();
        this.prevPlay = this.play;
      }
      this.incrementPrintHead()
    } else {
      this.decrementPrintHead()
    }
    if (this.de.completed == true && millis() > this.de.pauseUntil) {
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
  }

  addDialogEvent(id, words, options=[], conditions=[]) {
    let newLine = new DialogEvent(id, words, options, conditions);
    this.de.children.push(newLine);
    this.de = this.de.children[0];
    return this.de
  }

  addChildDialogEvent(parent, id, words, options=[], conditions=[]){
    let newLine = new DialogEvent(id, words, options, conditions);
    parent.children.push(newLine);
    return parent.children[parent.children.length-1];
  }

  writeText() {
    let words = this.onScr[key].words.slice(0, this.onScr[key].printHead);
    let x = this.coords[key].x
    let y = this.coords[key].y
    this.layer.g.text(words ,x ,y, 100);
  }

  writeOptions() {
    let x = this.coords[key].x
    let y = this.coords[key].y
    let firstTime = (this.onScr[key].optionYs.length == 0);
    for (let i = 0; i < this.onScr[key].options.length; i++) {
      if (this.onScr[key].conditions[i]() == true) {
        this.layer.g.text('> ' + this.onScr[key].options[i], x, y, this.textBoxWidth);
        y += this.optionBorder;
      }
      if (firstTime) {
        this.onScr[key].optionYs.push(y);
      }
    }
  }

  draw() {
    this.layer.clear();
    for (key in this.onScr) {
      if (this.onScr[key].hasOptions == false) {
        this.writeText();
      } else {
        this.writeOptions();
      }
    }
  }

};
