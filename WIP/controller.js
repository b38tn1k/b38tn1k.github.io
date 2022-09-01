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
  update(cells, flash, fastMode) {
    this.startStop(cells);
    if (this.run == true) {
      this.step(flash, fastMode);
    }
  }
  HCF() {
    this.index = this.terminate;
    this.run = false;
  }
  step (flash, fastMode) {
    if (this.index < this.script.length) {
      this.activeCell = this.script[this.index];
      if (flash == true && this.stack.length > 1) {
        this.activeCell.flash = true;
        this.script[this.stack[this.stack.length-2]].flash = false;
      }
      switch(this.activeCell.type) {
        case T_START:
          this.t_start(this.activeCell, this.index);
          break;
        case T_GOTO:
          this.t_goto(this.activeCell, this.index);
          break;
        case T_BLOCK:
          let stillInBlock = this.t_block(this.activeCell, this.index);
          if (stillInBlock == false) {
            this.moveByParent();
          }
          break;
        case T_PRINT:
          this.t_print(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_ASSIGN:
          this.t_assign(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_ADD:
          this.t_math(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_SUBTRACT:
          this.t_math(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_MULT:
          this.t_math(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_DIV:
          this.t_math(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_MOD:
          this.t_math(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_AVERAGE:
          this.t_math(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_SQRT:
          this.t_math(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_HYPOT:
          this.t_math(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_COMMENT:
          this.moveByParent();
          break;
        case T_VAR:
          this.moveByParent();
          break;
        case T_CONST:
          this.moveByParent();
          break;
        case T_INPUT:
          this.moveByParent();
          break;
        case T_EQUAL:
          this.t_compare(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_LESS:
          this.t_compare(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_GREATER:
          this.t_compare(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_NOT:
          this.t_not(this.activeCell, this.index);
          this.moveByParent();
          break;
        case T_IF:
          let stillInIf = this.t_if(this.activeCell, this.index);
          if (stillInIf == false) {
            this.moveByParent();
          }
          break;
        default:
          this.script[1].indexLabeldiv.html("Something is missing", true);
          break;
      }
      if (this.run == true && fastMode == true) {
        this.step(flash, fastMode);
      }
    } else {
      this.run = false;
      this.script[this.stack[this.stack.length - 2]].flash = false;
      console.log("STACK", this.stack);
    }
  }

  t_start(activeCell, index) {
    this.stack.push(index);
    if (activeCell.children.length == 0) {
      this.run = false;
      this.index = this.terminate;
    } else {
      this.index = activeCell.childIndicies[0];
    }
  }

  t_goto(activeCell, index) {
    this.stack.push(index);
    let myIndex = this.index;
    let next = activeCell.handleSH;
    this.index = this.terminate;
    for (let i = 0; i < this.script.length; i++) {
      if (next == this.script[i].handleSH && this.script[i].type != T_GOTO) {
        this.index = i;
      }
    }
    this.script[this.index].parent = myIndex;
  }

  t_block(activeCell, index) {
    this.stack.push(index);
    let stillIn = false;
    if (activeCell.children.length != 0) {
      stillIn = true;
      this.index = activeCell.childIndicies[0];
    }
    return stillIn;
  }

  t_print(activeCell, index) {
    this.stack.push(index);
    let myOutput = '<br>' + this.script[1].lineNumber + ': ';
    for (let j = 0; j < activeCell.children.length; j++) {
      if (activeCell.children[j].type != T_COMMENT) {
        let myString = String(this.script[activeCell.childIndicies[j]].dataSH);
        myOutput += myString.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
      }
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
          this.stack.push(parIndex);
        } else {
          this.index = parIndex;
          this.activeCell = parent;
          this.moveByParent();
        }
      }
    }
  }

  t_assign(activeCell, index) {
    this.stack.push(index);
    if (activeCell.children.length > 1) {
      let assigner = activeCell.children[0];
      let data = assigner.dataSH;
      let cI = activeCell.childIndicies;
      for (let i = 1; i < cI.length; i++) {
        let key = this.script[cI[i]].handleSH;
        for (let i = 0; i < this.varMap[key].length; i++) {
          this.varMap[key][i].updateDataSH(data);
        }
      }
    }
  }
  t_math(activeCell, index) {
    this.stack.push(index);
    let res;
    let survey = this.lookAtChildren(activeCell, index);
    let onlyNums = survey[0];
    let vals = survey[1];
    let isNumbers = survey[2];
    if (onlyNums) {
      res = parseFloat(vals[0]);
      if (activeCell.type == T_HYPOT) {
        res = res**2;
      }
      for (let i = 1; i < vals.length; i++) {
        switch(activeCell.type) {
          case T_ADD:
            res += parseFloat(vals[i]);
            break;
          case T_SUBTRACT:
            res -= parseFloat(vals[i]);
            break;
          case T_MULT:
            res *= parseFloat(vals[i]);
            break;
          case T_DIV:
            res /= parseFloat(vals[i]);
            break;
          case T_MOD:
            res %= parseFloat(vals[i]);
            break;
          case T_AVERAGE:
            res += parseFloat(vals[i]);
            break;
          case T_HYPOT:
            res += parseFloat(vals[i])**2;
            break;
          case T_SQRT:
            res = sqrt(parseFloat(vals[0]));
            break;
          }
        }
        if (activeCell.type == T_AVERAGE){
          res = res / vals.length;
        }
        if (activeCell.type == T_HYPOT){
          res = sqrt(res);
        }
    } else {
      if (activeCell.type == T_ADD) { // concatenate
        res = '';
        for (let i = 0; i < vals.length; i++) {
          res += vals[i];
        }
      } else if (activeCell.type == T_SUBTRACT) { // shorten or remove
        res = vals[0];
        for (let i = 1; i < vals.length; i++) {
          if (isNumbers[i] == true) {
            let myNumber = parseFloat(vals[i])
            if (myNumber < res.length) {
              res = res.substring(0, res.length - myNumber);
            } else {
              res = '';
            }
          } else {
            let myIndexStart = res.indexOf(vals[i]);
            let myIndexEnd = myIndexStart + vals[i].length;
            if (myIndexStart != -1) {
              let endCap = '';
              if (myIndexEnd < res.length) {
                endCap = res.substring(myIndexEnd, res.length);
              }
              res = res.substring(0, myIndexStart) + endCap;
            }
          }
        }
      } else if (activeCell.type == T_MULT) { // get index of substring
        res = 'error';
        if (vals.length >= 2) {
          res = vals[0].indexOf(vals[1]);
        }
      } else if (activeCell.type == T_DIV) { //get char at index
        let myIndex = 0;
        let cando = false;
        res = -1
        for (let i = 1; i < isNumbers.length; i++) {
          if (isNumbers[i] == true) {
            myIndex = vals[i];
            cando = true;
            break;
          }
        }
        if (cando == true && myIndex < vals[0].length) {
          res = vals[0][myIndex];
        }
      } else {
        res = '';
      }
    }
    let output = activeCell.children[0].handleSH;
    for (let i = 0; i < this.varMap[output].length; i++) {
      this.varMap[output][i].updateDataSH(res);
    }
  }

  t_compare(activeCell, index) {
    this.stack.push(index);
    let survey = this.lookAtChildren(activeCell, index);
    let onlyNums = survey[0];
    let vals = survey[1];
    let isNumbers = survey[2];
    let res = true;
    if (onlyNums == true) {
      let prev = vals[0];
      for (let i = 1; i < vals.length; i++) {
        switch(activeCell.type) {
          case T_EQUAL:
            if (prev != vals[i]) {
              res = false;
            }
            break;
          case T_GREATER:
            if (prev <= vals[i]) {
              res = false;
            }
            break;
          case T_LESS:
            if (prev >= vals[i]) {
              res = false;
            }
            break;
          }
          prev = vals[i];
      }
    } else {
      let prev = vals[0];
      for (let i = 1; i < vals.length; i++) {
        switch(activeCell.type) {
          case T_EQUAL:
            if (prev != vals[i]) {
              res = false;
            }
            break;
          case T_GREATER:
            res = false;
            break;
          case T_LESS:
            res = false
            break;
          }
          prev = vals[i];
      }
    }
    // and return
    let output = activeCell.children[0].handleSH;
    for (let i = 0; i < this.varMap[output].length; i++) {
      this.varMap[output][i].updateDataSH(res);
    }
  }

  t_not(activeCell, index) {
    this.stack.push(index);
    let survey = this.lookAtChildren(activeCell, index);
    let onlyNums = survey[0];
    let vals = survey[1];
    let isNumbers = survey[2];
    let res = false;
  }

  t_if(activeCell, index) {
    this.stack.push(index);
    let stillIn = false;
    let conditions = activeCell.children[0];
    for (let i = 0; i < conditions.length; i++) {
       // send in and listen to dataSH, add them up and make a decision where to go next

    }
    let yes = activeCell.children[1];
    let no = activeCell.children[2]

    return stillIn
  }

  getValue(child, index) {
    let data;
    let varType = -1;
    if (mathFunctions.indexOf(child.type) != -1) {
      this.t_math(child, index);
      data = child.children[0].dataSH;
      varType = V_NUMBER;
    } else if (boolFunctions.indexOf(child.type) != -1) {
      this.t_compare(child, index);
      data = child.children[0].dataSH;
      varType = V_BOOL;
    } else {
      data = child.dataSH;
      if (/^\d+\.\d+$/.test(data) == true || /^\d+$/.test(data) == true) {
        varType = V_NUMBER;
      } else {
        varType = V_STRING;
      }
    }
    let result = {type: varType, data: data};
    return result;
  }
  lookAtChildren(activeCell, index) {
    let onlyNums = true;
    let vals = [];
    let isNumbers = [];
    for (let i = 1; i < activeCell.children.length; i++) {
      if (activeCell.children[i].type != T_COMMENT) {
        this.stack.push(activeCell.childIndicies[i]);
        let result =  this.getValue(activeCell.children[i], activeCell.childIndicies[i]);
        vals.push(result['data']);
        if (result['type'] == V_NUMBER) {
          isNumbers.push(true);
        } else if (result['type'] == V_STRING) {
          onlyNums = false;
          isNumbers.push(false);
        } else if (result['type'] == V_BOOL) {
          onlyNums = false;
          isNumbers.push(false);
        }
      }
    }
    return [onlyNums, vals, isNumbers];
  }
};
