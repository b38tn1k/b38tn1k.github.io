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
      cells.mapAndLink(true); // freeze the thing
      this.script = cells.cells;
      this.terminate = this.script.length + 1;
      this.stack = [];
      for (let i = 0; i < cells.length; i++) {
        if (this.script[i].type == T_VAR || this.script[i].type == T_OUTLET) {
          if (!(this.script[i].handleSH in this.varMap)) {
            this.varMap[this.script[i].handleSH] = [];
          }
          this.varMap[this.script[i].handleSH].push(this.script[i]);
        }
      }
      for (key in this.varMap) {
        if (cells.varHandles.indexOf(key) == -1) {
          cells.varHandles.push(key);
          cells.mapAndLink();
          this.startStop(cells);
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
      if (flash == true && this.stack.length > 1) {
        this.activeCell.flash = true;
        this.script[this.stack[this.stack.length-2]].flash = false;
      }

      switch(this.activeCell.type) {
        case T_START:
          this.t_start();
          break;
        case T_GOTO:
          this.t_goto();
          break;
        case T_BLOCK:
          let stillIn = this.t_block();
          if (stillIn == false) {
            this.moveByParent();
          }
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
        case T_SUBTRACT:
          this.t_math();
          this.moveByParent();
          break;
        case T_MULT:
          this.t_math();
          this.moveByParent();
          break;
        case T_DIV:
          this.t_math();
          this.moveByParent();
          break;
        case T_MOD:
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
    console.log('hi!')
    let myIndex = this.index;
    let next = this.activeCell.handleSH;
    this.index = this.terminate;
    for (let i = 0; i < this.script.length; i++) {
      if (next == this.script[i].handleSH && this.script[i].type != T_GOTO) {
        this.index = i;
      }
    }
    this.script[this.index].parent = myIndex;
    // make this block the parent
  }

  t_block() {
    let stillIn = false;
    if (this.activeCell.children.length != 0) {
      stillIn = true;
      this.index = this.activeCell.childIndicies[0];
    }
    return stillIn;
  }

  t_print() {
    let myOutput = '<br>' + this.script[1].lineNumber + ' > ';
    for (let j = 0; j < this.activeCell.children.length; j++) {
      myOutput += this.script[this.activeCell.childIndicies[j]].dataSH;
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
        let key = this.script[cI[i]].handleSH;
        for (let i = 0; i < this.varMap[key].length; i++) {
          this.varMap[key][i].updateDataSH(data);
        }
      }
    }
  }
  t_math() {
    let onlyNums = true;
    let vals = [];
    let res;
    for (let i = 1; i < this.activeCell.children.length; i++) {
      vals.push(this.activeCell.children[i].dataSH);
      if (/^\d+\.\d+$/.test(vals[i-1]) == false && /^\d+$/.test(vals[i-1]) == false) {
        onlyNums = false;
      }
    }
    if (onlyNums) {
      res = parseFloat(vals[0]);
      for (let i = 1; i < vals.length; i++) {
        if (this.activeCell.type == T_ADD) {
          res += parseFloat(vals[i]);
        }
        if (this.activeCell.type == T_SUBTRACT) {
          res -= parseFloat(vals[i]);
        }
        if (this.activeCell.type == T_MULT) {
          res *= parseFloat(vals[i]);
        }
        if (this.activeCell.type == T_DIV) {
          res /= parseFloat(vals[i]);
        }
        if (this.activeCell.type == T_MOD) {
          res %= parseFloat(vals[i]);
        }
      }
    } else {
      if ([T_MULT, T_MOD, T_DIV].indexOf(this.activeCell.type) != -1) {
        res = 'error'
        // cat strings
        // if a string and minus, remove substrings
        // make result 'error'
      }
    }
    let output = this.activeCell.children[0].handleSH;
    for (let i = 0; i < this.varMap[output].length; i++) {
      this.varMap[output][i].updateDataSH(res);
    }
  }
};

//http://127.0.0.1:4000/WIP/#%7B%220%22%3A%7B%22x%22%3A138%2C%22y%22%3A32%2C%22t%22%3A1%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22p%22%3A-1%2C%22c%22%3A%5B10%2C18%5D%2C%22tL%22%3A%22start%22%2C%22L%22%3A%22start%22%7D%2C%221%22%3A%7B%22x%22%3A129%2C%22y%22%3A296%2C%22t%22%3A2%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22p%22%3A-1%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22console%22%2C%22L%22%3A%22console%22%7D%2C%222%22%3A%7B%22x%22%3A130%2C%22y%22%3A529%2C%22t%22%3A47%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%221%22%2C%22i%22%3A%22dsgk%22%2C%22p%22%3A-1%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22set%20variable%20dsgk%22%2C%22L%22%3A%22set%20variable%20dsgk%22%7D%2C%223%22%3A%7B%22x%22%3A130%2C%22y%22%3A456%2C%22t%22%3A47%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%22%2B%22%2C%22i%22%3A%22wdrt%22%2C%22p%22%3A-1%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22set%20variable%20wdrt%22%2C%22L%22%3A%22set%20variable%20wdrt%22%7D%2C%224%22%3A%7B%22x%22%3A130%2C%22y%22%3A383%2C%22t%22%3A47%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%222%22%2C%22i%22%3A%22sian%22%2C%22p%22%3A-1%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22set%20variable%20sian%22%2C%22L%22%3A%22set%20variable%20sian%22%7D%2C%225%22%3A%7B%22x%22%3A274%2C%22y%22%3A35%2C%22t%22%3A23%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%22printBlock%22%2C%22i%22%3A%22printBlock%22%2C%22p%22%3A-1%2C%22c%22%3A%5B6%5D%2C%22tL%22%3A%22set%20block%22%2C%22L%22%3A%22set%20block%22%7D%2C%226%22%3A%7B%22x%22%3A281.5%2C%22y%22%3A88%2C%22t%22%3A27%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22p%22%3A5%2C%22c%22%3A%5B7%2C8%2C9%2C11%2C12%5D%2C%22tL%22%3A%22print%22%2C%22L%22%3A%22print%22%7D%2C%227%22%3A%7B%22x%22%3A289%2C%22y%22%3A119%2C%22t%22%3A45%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%221%22%2C%22i%22%3A%22dsgk%22%2C%22p%22%3A6%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22variable%22%2C%22L%22%3A%22variable%22%7D%2C%228%22%3A%7B%22x%22%3A289%2C%22y%22%3A211%2C%22t%22%3A45%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%22%2B%22%2C%22i%22%3A%22wdrt%22%2C%22p%22%3A6%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22variable%22%2C%22L%22%3A%22variable%22%7D%2C%229%22%3A%7B%22x%22%3A289%2C%22y%22%3A303%2C%22t%22%3A45%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%222%22%2C%22i%22%3A%22sian%22%2C%22p%22%3A6%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22variable%22%2C%22L%22%3A%22variable%22%7D%2C%2210%22%3A%7B%22x%22%3A145.5%2C%22y%22%3A93%2C%22t%22%3A16%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22i%22%3A%22subtract%22%2C%22p%22%3A0%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22block%22%2C%22L%22%3A%22block%22%7D%2C%2211%22%3A%7B%22x%22%3A289%2C%22y%22%3A395%2C%22t%22%3A46%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%22%3D%22%2C%22p%22%3A6%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22constant%22%2C%22L%22%3A%22constant%22%7D%2C%2212%22%3A%7B%22x%22%3A289%2C%22y%22%3A468%2C%22t%22%3A45%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A-1%2C%22i%22%3A%22outlet%22%2C%22p%22%3A6%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22variable%22%2C%22L%22%3A%22variable%22%7D%2C%2213%22%3A%7B%22x%22%3A428.5%2C%22y%22%3A82%2C%22t%22%3A52%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22p%22%3A17%2C%22c%22%3A%5B14%2C15%2C16%5D%2C%22tL%22%3A%22subtract%22%2C%22L%22%3A%22subtract%22%7D%2C%2214%22%3A%7B%22x%22%3A436%2C%22y%22%3A113%2C%22t%22%3A104%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A-1%2C%22i%22%3A%22outlet%22%2C%22p%22%3A13%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22out%22%2C%22L%22%3A%22out%3Cbr%3E-1%22%7D%2C%2215%22%3A%7B%22x%22%3A436%2C%22y%22%3A164%2C%22t%22%3A45%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%221%22%2C%22i%22%3A%22dsgk%22%2C%22p%22%3A13%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22variable%22%2C%22L%22%3A%22variable%22%7D%2C%2216%22%3A%7B%22x%22%3A436%2C%22y%22%3A256%2C%22t%22%3A45%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%222%22%2C%22i%22%3A%22sian%22%2C%22p%22%3A13%2C%22c%22%3A%5B%5D%2C%22tL%22%3A%22variable%22%2C%22L%22%3A%22variable%22%7D%2C%2217%22%3A%7B%22x%22%3A421%2C%22y%22%3A29%2C%22t%22%3A23%2C%22h%22%3Afalse%2C%22s%22%3Afalse%2C%22d%22%3A%22subtract%22%2C%22i%22%3A%22subtract%22%2C%22p%22%3A-1%2C%22c%22%3A%5B13%2C19%5D%2C%22tL%22%3A%22set%20block%22%2C%22L%22%3A
