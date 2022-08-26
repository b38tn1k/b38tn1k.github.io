class Controller {
  constructor() {
    this.script;
    this.index = 0;
    this.stack = [];
    this.terminate;
    this.run = false;
    this.activeCell = null;
    this.running = false;
    this.prevIndex = -1;
    this.varTable = {};
    this.varMap = {};
  }

  startStop(cells) {
    // started
    if (cells.run == true && this.running == false) {
      this.run = true;
      this.running = true;
      this.index = 0;
      cells.mapAndLink(); // freeze the thing
      this.script = cells.cells;
      this.terminate = this.script.length + 1;
      this.stack = [];
      for (let i = 0; i < cells.length; i++) {
        if (this.script[i].type == T_VAR) {
          if (!(this.script[i].inletHandleSH in this.varMap)) {
            this.varMap[this.script[i].inletHandleSH] = [];
          }
          this.varMap[this.script[i].inletHandleSH].push(this.script[i]);
        }
      }
      // console.clear();
    }
    // stop by cells
    if (cells.run == false) {
      this.run = false;
      this.running = false;
    }
    // stop by controller
    if (this.run == false) {
      cells.stop();
      this.running = false;
    }
  }
  update(cells, flash) {
    this.startStop(cells);
    if (this.run == true) {
      this.step(flash);
    }
  }
  HCF() {
    this.index = this.terminate;
    this.run = false;
  }
  step (flash) {
    if (this.index < this.script.length) {

      this.stack.push(this.index);
      this.activeCell = this.script[this.index];
      if (flash == true) {
        this.activeCell.flash = true;
        if (this.stack.length > 1) {
          this.script[this.stack[this.stack.length-2]].flash = false;
        }
      }

      switch(this.activeCell.type) {
        case T_START:
          this.t_start();
          break;
        case T_GOTO:
          this.t_goto();
          break;
        case T_BLOCK:
          this.t_block();
          break;
        case T_PRINT:
          this.t_print();
          this.moveByParent();
          break;
        case T_ASSIGN:
          this.t_assign();
          this.moveByParent();
          break;
        case T_ADD:
          this.t_math();
          this.moveByParent();
          break;
        default:
          break;
      }
    } else {
      this.run = false;
    }
  }

  t_start() {
    if (this.activeCell.children.length == 0) {
      this.run = false;
      this.index = this.terminate;
    } else {
      this.index = this.activeCell.childIndicies[0];
    }
  }

  t_goto() {
    console.log(this.activeCell.flash);
    let next = this.activeCell.inletHandleSH;
    this.index = this.terminate;
    for (let i = 0; i < this.script.length; i++) {
      if (next == this.script[i].funcHandleSH) {
        this.index = i;
      }
    }
  }

  t_block() {
    if (this.activeCell.children.length != 0) {
      this.index = this.activeCell.childIndicies[0];
    } else {
      this.moveByParent();
    }
  }

  t_print() {
    let myOutput = '<br>' + this.script[1].lineNumber + ' > ';
    if (this.activeCell.children.length == 1) {
      myOutput += this.script[this.activeCell.childIndicies[0]].dataSH;
    }
    this.script[1].indexLabeldiv.html(myOutput, true);
    this.script[1].lineNumber += 1;
    this.script[1].indexLabeldiv.elt.scrollTop = 100 * this.script[1].lineNumber;
  }

  moveByParent() {
    let parIndex = this.activeCell.parent;
    if (parIndex != -1) {
      let parent = this.script[parIndex];
      let posInSiblings = parent.childIndicies.indexOf(this.index);
      let lastOne = (posInSiblings == parent.childIndicies.length - 1);
      if (lastOne == false) {
        this.index = parent.childIndicies[posInSiblings + 1];
      } else {
        if (parent.parent == -1) {
          this.index = this.terminate;
        } else {
          this.index = parIndex;
          this.activeCell = parent;
          this.moveByParent();
        }
      }
    }
  }

  t_assign() {
    if (this.activeCell.children.length > 1) {
      let assigner = this.activeCell.children[0];
      let data = assigner.dataSH;
      let cI = this.activeCell.childIndicies;
      for (let i = 1; i < cI.length; i++) {
        let key = this.script[cI[i]].inletHandleSH;
        for (let i = 0; i < this.varMap[key].length; i++) {
          this.varMap[key][i].updateDataSH(data);
        }
      }
    }
  }
  t_math() {
    let output;

  }
};
