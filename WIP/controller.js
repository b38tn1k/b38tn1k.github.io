class Controller {
  constructor() {
    this.script;
    this.envChanged = false;
    this.index = 0;
    this.stackTrace = {};
    this.workingStack = [];
    this.terminate;
    this.run = false;
    this.activeCell = null;
    this.running = false;
    this.prevIndex = -1;
    this.varMap = {};
    this.varRecord = [];
    this.weHaveATurtlePeople = false;
    this.turtleIndex = -1;
    this.tBuffX = [];
    this.tChangeX = false;
    this.tBuffY = [];
    this.tChangeY = false;
    this.stackNotes = [];
    this.stackSizeRecord = [];
    this.objectWideFlashFlag = true;
    this.tidyFlag = false;
  }

  step(flash, fastMode) {
    this.objectWideFlashFlag = flash;
    try { // big try so I can put anything into the onscreen c onsole
      if (this.index < this.script.length) {
        this.activeCell = this.script[this.index];
        if (flash == true && this.stackTrace.length > 1) {
          this.activeCell.flash = true;
          this.script[this.stackTrace[this.stackTrace.length - 2]].flash = false;
        }
        switch (this.activeCell.type) {
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
          case T_ROUND:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_HYPOT:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_SIN:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_COS:
            this.t_math(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_COMMENT:
            this.addToStack(this.index);
            this.moveByParent();
            break;
          case T_VAR:
            this.addToStack(this.index);
            this.moveByParent();
            break;
          case T_CONST:
            this.addToStack(this.index);
            this.moveByParent();
            break;
          case T_INPUT:
            this.addToStack(this.index);
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
          case T_WHILE:
            let stillInWhile = this.t_while(this.activeCell, this.index);
            if (stillInWhile == false) {
              this.moveByParent();
            }
            break;
          case T_FOR:
            let stillInFor = this.t_for(this.activeCell, this.index);
            if (stillInFor == false) {
              this.moveByParent();
            }
            break;
          case T_ELSE:
            this.index = this.script[this.index].parent;
            break;
          case T_DO:
            this.index = this.script[this.index].parent;
            break;
          case T_LEN:
            this.t_len(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_GET:
            this.t_arrayOp(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_RUN:
            let tempInd = this.index;
            this.t_arrayOp(this.activeCell, this.index);
            if (tempInd == this.index) {
              this.moveByParent();
            }
            break;
          case T_SET:
            this.t_arrayOp(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_PUSH:
            this.t_arrayOp(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_DELETE:
            this.t_arrayOp(this.activeCell, this.index);
            this.moveByParent();
            break;
          default:
            this.script[1].indexLabeldiv.html("<br>Something is missing", true);
            this.HCF();
            break;
        }
        if (this.run == true && fastMode == true) {
          this.step(flash, fastMode);
        }
      } else {
        this.run = false;
        // this.script[this.stackTrace[this.stackTrace.length - 2]].flash = false;
        for (let i = 0; i < cells.length; i++){
          cells.cells[i].flash = false;
        }
        this.printStack();
        if (this.envChanged == true) {
          this.tidyFlag = true;
          this.d_print('Your environment was updated. Click <a style="color: blue;" href="javascript:void(0)" onclick="loadBackup();">here</a> to reset, or do nothing to continue.<br>')
        }
      }
    } catch (error) {
      this.HCF();
      this.script[1].indexLabeldiv.html('\n' + error, true);
      console.log(error);
    }
  }

  updateVarMap(key, data) {
    if (key == 'turtleX') {
      this.tChangeX = true;
    }
    if (key == 'turtleY') {
      this.tChangeY = true;
    }
    for (let i = 0; i < this.varMap[key].length; i++) {
      this.varMap[key][i].updateDataSH(data);
    }
    this.updateTurtle();
  }

  moveByParent() {
    if (this.workingStack.length > 100) {
      this.script[1].indexLabeldiv.html('\n uncomfortably deep stack, time to die', true);
      this.script[1].indexLabeldiv.elt.scrollTop = 1000 * this.script[1].lineNumber;
      this.run = false;
    }
    let currentI = this.workingStack.pop();
    this.addToStack(currentI, 0); // 0 means it adds to trace, not working stack
    this.script[currentI].flash = false;
    if (this.script[currentI].type == T_CONDITION && this.script[this.script[currentI].parent].type == T_IF) {
      currentI = this.workingStack.pop();
      this.addToStack(currentI, 0);
    }
    if (this.script[currentI].type == T_RANGE && this.script[this.script[currentI].parent].type == T_FOR) {
      let target = this.script[currentI].dataSHasType['number'];
      let counter = this.script[this.script[currentI].parent].dataSHasType['number'];
      if (target < counter) {
        this.script[this.script[currentI].parent].updateDataSH(B_UNSET);
        currentI = this.workingStack.pop();
        this.addToStack(currentI, 0);
      }
    }
    if (this.script[currentI].type == T_CONDITION && this.script[this.script[currentI].parent].type == T_WHILE) {
      let shrinkStack = this.workingStack.indexOf(this.script[currentI].parent);
      this.workingStack = this.workingStack.slice(0, shrinkStack + 1);
      this.addNote("shrunk working stack");
      if (this.script[currentI].getDataSH() == B_FALSE) {
        currentI = this.workingStack.pop();
        this.addToStack(currentI, 0);
      }
    }
    this.script[currentI].flash = false;
    if (this.workingStack.length < 1) {
      this.index = this.terminate;
      return;
    } else {
      let callerI = this.workingStack[this.workingStack.length - 1];
      let callerC = this.script[callerI];
      let curInCaller = callerC.childIndicies.indexOf(currentI);
      if (curInCaller == -1 || curInCaller == callerC.childIndicies.length - 1) {
        this.addToStack(callerI, 0);
        this.moveByParent();
      } else {
        this.index = callerC.childIndicies[curInCaller + 1];
      }
    }
  }

  findBlock(handle) {
    let block = -1;
    for (let i = 0; i < this.script.length; i++) {
      if ((this.script[i].type == T_BLOCK || this.script[i].type == T_INPUT) && this.script[i].handleSH == handle) {
        block = i;
        break;
      }
    }
    if (handle == 'unset') {
      return -1;
    }
    return block;
  }

  getValue(child, index) {
    let data;
    let varType = -1;
    if (mathFunctions.indexOf(child.type) != -1) {
      this.t_math(child, index);
      data = child.children[0].getDataSH();
      varType = V_NUMBER;
    } else if (boolFunctions.indexOf(child.type) != -1 && (child.type != T_NOT)) {
      this.t_compare(child, index);
      data = child.getDataSH();
      varType = V_BOOL;
    } else if (child.type == T_LEN) {
      this.t_len(child, index);
      data = child.getDataSH();
      varType = V_NUMBER;
    } else if (child.type == T_NOT) {
      this.t_not(child, index);
      data = child.getDataSH();
      varType = V_BOOL;
    } else if (child.type == T_GET) {
      this.t_arrayOp(child, index);
      data = child.getDataSH();
      varType = V_STRING;
    } else {
      data = child.getDataSH();
      if (/^\d+\.\d+$/.test(data) == true || /^\d+$/.test(data) == true) {
        varType = V_NUMBER;
      } else if (data == 'true' || data == 'false') {
        varType = V_BOOL;
        data = (data == 'true');
      } else {
        varType = V_STRING;
      }
    }
    let result = {
      type: varType,
      data: data
    };
    return result;
  }

  lookAtChildren(activeCell, index, start = 0) {
    let onlyNums = true;
    let onlyBools = true;
    let containsString = false;
    let vals = [];
    let isNumbers = [];
    // this.runChildren(activeCell.children, activeCell.childIndicies);
    for (let i = start; i < activeCell.children.length; i++) {
      if (activeCell.children[i].type != T_COMMENT) {
        let result = this.getValue(activeCell.children[i], activeCell.childIndicies[i]);
        vals.push(result['data']);
        if (result['type'] == V_NUMBER) {
          onlyBools = false;
          isNumbers.push(true);
        } else if (result['type'] == V_STRING) {
          onlyBools = false;
          onlyNums = false;
          containsString = true;
          isNumbers.push(false);
        } else if (result['type'] == V_BOOL) {
          onlyNums = false;
          isNumbers.push(false);
        }
      }
    }
    let res = {};
    res['onlyNums'] = onlyNums;
    res['vals'] = vals;
    res['isNumbers'] = isNumbers;
    res['onlyBools'] = onlyBools;
    res['containsString'] = containsString;
    return res;
  }

  evaluateCondition(onlyBools, onlyNums, vals) {
    let res = true;
    let myResult = 0;
    if (onlyBools == true) {
      for (let i = 0; i < vals.length; i++) {
        myResult += int(vals[i]);
      }
      res = (myResult == vals.length);
    }
    if (onlyNums == true) {
      for (let i = 0; i < vals.length; i++) {
        if (vals[i] == 0) {
          res = false;
        }
      }
    }
    return res;
  }

  startStop(cells) {
    // started
    if (cells.run == true && this.running == false) {
      this.run = true;
      this.running = true;
      this.index = 0;
      cells.mapAndLink(); // freeze the thing
      cells.mapAndLink(); // do it twice for fun
      backupObject = JSON.stringify(cells.saveCells());
      this.envChanged = false;
      this.script = cells.cells;
      this.terminate = this.script.length + 1;
      this.stackTrace = {};
      this.stackTrace['index'] = [];
      this.stackTrace['dir'] = [];
      this.stackTrace['label'] = [];
      this.stackTrace['handle'] = [];
      this.workingStack = [0];
      this.varRecord = [];
      this.tBuffX = [];
      this.tBuffY = [];
      this.varMap = {};
      this.varMap['outlet'] = [];
      this.weHaveATurtlePeople = false;
      this.stackNotes = [];
      this.stackSizeRecord = [];
      for (let i = 0; i < cells.length; i++) {
        if (this.script[i].type == T_VAR || this.script[i].type == T_OUTLET || this.script[i].type == T_INPUT) {
          if (!(this.script[i].handleSH in this.varMap)) {
            this.varMap[this.script[i].handleSH] = [];
          }
          this.varMap[this.script[i].handleSH].push(this.script[i]);
        }
        if (this.script[i].type == T_TURTLE) {
          this.weHaveATurtlePeople = true;
          this.turtleIndex = i;
        }
      }
      for (key in this.varMap) {
        if (cells.varHandles.indexOf(key) == -1) {
          cells.varHandles.push(key);
          // cells.mapAndLink();
          this.startStop(cells);
        }
      }
    }
    // stop by cells
    if (cells.run == false) {
      if (this.run == true) {
        this.printStack();
      }
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

  printStack() {
    let readableStack = {};
    for (let i = 0; i < this.stackTrace['index'].length; i++) {
      readableStack[i] = {};
      readableStack[i]['stack depth'] = this.stackSizeRecord[i];
      readableStack[i]['block index'] = this.stackTrace['index'][i];
      readableStack[i]['name'] = this.stackTrace['label'][i];
      readableStack[i]['handle'] = this.stackTrace['handle'][i];
      readableStack[i]['data state'] = this.varRecord[i];
      readableStack[i]['dir'] = (this.stackTrace['dir'][i] == 1) ? 'in' : 'out';
      readableStack[i]['stack notes'] = ""
    }
    for (let i = 0; i < this.stackNotes.length; i++) {
      let note = this.stackNotes[i];
      readableStack[note[0]]['stack notes'] = note[1];
    }
    if (printStack == true) {
      console.table(readableStack);
    }
  }
  addNote(myString) {
    this.stackNotes.push([this.stackTrace['index'].length - 1, myString]);
  }

  addToStack(index, dir = 1) {
    this.stackSizeRecord.push(this.workingStack.length);
    this.stackTrace['index'].push(index);
    this.stackTrace['dir'].push(dir);
    this.stackTrace['label'].push(this.script[index].textLabel);
    this.stackTrace['handle'].push(this.script[index].handleSH);
    if (dir == 1) {
      this.workingStack.push(index);
      this.script[index].flash = this.objectWideFlashFlag;
    }
    let varRecAtom = '';
    for (key in this.varMap) {
      if (this.varMap[key].length > 0) {
        varRecAtom += String(key) + ": " + this.varMap[key][0].getDataSH() + ' | ';
      } else {
        varRecAtom += String(key) + " ";
      }
    }
    this.varRecord.push(varRecAtom);
  }

  updateTurtle() {
    if (this.weHaveATurtlePeople == true) {
      if (this.tChangeX == true) {
        this.tBuffX.push(parseFloat(this.varMap['turtleX'][0].getDataSH()));
        this.tChangeX = false;
      }
      if (this.tChangeY == true) {
        this.tBuffY.push(parseFloat(this.varMap['turtleY'][0].getDataSH()));
        this.tChangeY = false;
      }
      if (this.varMap['turtleDraw'][0].dataSHasType["bool"] == true) {
        this.updateVarMap('turtleDraw', 0);
        while (this.tBuffX.length < this.tBuffY.length) {
          this.tBuffX.push(this.tBuffX[this.tBuffX.length - 1]);
        }
        while (this.tBuffX.length > this.tBuffY.length) {
          this.tBuffY.push(this.tBuffY[this.tBuffY.length - 1]);
        }
        for (let i = 0; i < this.tBuffX.length - 1; i++) {
          let x1 = this.tBuffX[i];
          let x2 = this.tBuffX[i + 1];
          let y1 = this.tBuffY[i];
          let y2 = this.tBuffY[i + 1];
          this.script[this.turtleIndex].canvas.line(x1, y1, x2, y2);
        }
        this.tBuffX = [];
        this.tBuffY = [];
      }
    }
  }

  t_start(activeCell, index) {
    this.addToStack(index);
    if (activeCell.children.length == 0) {
      this.run = false;
      this.index = this.terminate;
    } else {
      this.index = activeCell.childIndicies[0];
    }
  }

  t_goto(activeCell, index) {
    this.addToStack(index);
    // let myIndex = this.index;
    let next = activeCell.handleSH;
    this.index = this.terminate;
    for (let i = 0; i < this.script.length; i++) {
      if (next == this.script[i].handleSH && this.script[i].type == T_BLOCK) {
        this.index = i;
      }
    }
    // this.script[this.index].parent = myIndex;
  }

  t_block(activeCell, index) {
    this.addToStack(index);
    let stillIn = false;
    if (activeCell.children.length != 0) {
      stillIn = true;
      this.index = activeCell.childIndicies[0];
    }
    return stillIn;
  }

  buildPrintString(activeCell, depth){
    depth += 1;
    if (depth > 20) {
      return 'max depth';
    }
    let myOutput = '';
    for (let j = 0; j < activeCell.children.length; j++) {
      if (activeCell.children[j].type == T_GET) {
        this.t_arrayOp(activeCell.children[j], activeCell.childIndicies[j]);
        if (String(activeCell.children[j].dataSH).indexOf('object:') == -1){
          myOutput += activeCell.children[j].dataSH;
        } else {
          let myInd = this.unpackGet(activeCell.children[j]);
          if (this.script[myInd].type == T_BLOCK || this.script[myInd].type == T_GOTO){
            myOutput += '[';
            myOutput += this.buildPrintString(this.script[myInd], depth);
            myOutput += ']';
          } else {
            myOutput += this.script[myInd].getDataSHForPrint();
          }
        }
      } else if (activeCell.children[j].type == T_GOTO || activeCell.children[j].type == T_BLOCK) {
        let block = this.findBlock(activeCell.children[j].handleSH);
        myOutput += '[';
        if (block == -1) {
          myOutput += 'unset';
        } else {
          myOutput += this.buildPrintString(this.script[block], depth);
        }
        myOutput += ']';
      } else if (activeCell.children[j].type != T_COMMENT) {
        myOutput += String(this.script[activeCell.childIndicies[j]].getDataSHForPrint());
      }
      if (j < activeCell.children.length-1) {
        myOutput += ', ';
      }
    }
    return myOutput;
  }

  d_print(myString, inplace=false, flagString=''){
    if (!this.script){
      this.script = cells.cells;
    }
    if (inplace == true) {
      let htmlString = this.script[1].indexLabeldiv.html();
      if (htmlString.indexOf(flagString) != -1){
        htmlString = htmlString.slice(0, htmlString.indexOf(flagString))

      }
      htmlString += flagString + myString;
      this.script[1].indexLabeldiv.html(htmlString);
    } else {
      this.script[1].indexLabeldiv.html('<br>' + myString + '<br>', true);
      this.script[1].lineNumber += 1;
      this.script[1].indexLabeldiv.elt.scrollTop = 1000 * this.script[1].lineNumber;
    }
  }

  t_print(activeCell, index) {
    this.addToStack(index);
    let myOutput = this.script[1].lineNumber + ': '
    if (this.script[1].lineNumber == 0) {
      myOutput = '<br>' + this.script[1].lineNumber + ': ';
    }

    let myString = this.buildPrintString(activeCell, 0);
    this.script[1].indexLabeldiv.html(myOutput + myString.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") + '<br>', true);
    this.script[1].lineNumber += 1;
    this.script[1].indexLabeldiv.elt.scrollTop = 1000 * this.script[1].lineNumber;
  }

  t_assign(activeCell, index) {
    this.addToStack(index);
    if (activeCell.children.length > 1) {
      let assigner = activeCell.children[0];
      let data = assigner.getDataSH();
      let cI = activeCell.childIndicies;
      for (let i = 1; i < cI.length; i++) {
        let key = this.script[cI[i]].handleSH;
        this.updateVarMap(key, data);
      }
    }
  }

  t_math(activeCell, index) {
    this.addToStack(index);
    let res;
    let survey = this.lookAtChildren(activeCell, index, 1);
    let onlyNums = survey['onlyNums'];
    let vals = survey['vals'];
    let isNumbers = survey['isNumbers'];
    if (onlyNums) {
      res = parseFloat(vals[0]);
      if (activeCell.type == T_HYPOT) {
        res = res ** 2;
      }
      for (let i = 1; i < vals.length; i++) {
        switch (activeCell.type) {
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
            res += parseFloat(vals[i]) ** 2;
            break;
        }
      }
      switch (activeCell.type) {
        case T_SQRT:
          res = sqrt(res);
          break;
        case T_SIN:
          res = sin(res);
          break;
        case T_COS:
          res = cos(res);
          break;
        case T_ROUND:
          res = round(res);
          break;
      }
      if (activeCell.type == T_AVERAGE) {
        res = res / vals.length;
      }
      if (activeCell.type == T_HYPOT) {
        res = sqrt(res);
      }
    }
    let output = activeCell.children[0].handleSH;
    this.updateVarMap(output, res)
  }

  t_compare(activeCell, index) {
    this.addToStack(index);
    let survey = this.lookAtChildren(activeCell, index, 0);
    let onlyNums = survey['onlyNums'];
    let vals = survey['vals'];
    let isNumbers = survey['isNumbers'];
    let res = true;
    if (vals.length == 0) {
      res = false;
    }
    if (onlyNums == true) {
      let prev = vals[0];
      for (let i = 1; i < vals.length; i++) {
        switch (activeCell.type) {
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
        switch (activeCell.type) {
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
    activeCell.dataSH = res;
  }

  t_not(activeCell, index) {
    this.addToStack(index);
    let survey = this.lookAtChildren(activeCell, index, 0);
    let onlyNums = survey['onlyNums'];
    let vals = survey['vals'];
    let containsString = survey['containsString'];
    let isNumbers = survey['isNumbers'];
    let onlyBools = survey['onlyBools'];
    let res = this.evaluateCondition(onlyBools, onlyNums, vals);
    res = !res;
    // let output = activeCell.children[0].handleSH;
    activeCell.dataSH = res;
    // this.updateVarMap(output, res)
  }

  t_if(activeCell, index) {
    this.addToStack(index);
    let conditions = activeCell.children[0];
    activeCell.dataSH = B_UNSET; // 0 = unknown, 1 = true, 2 = false (?)
    this.t_condition(conditions, activeCell.childIndicies[0]);
    let res = false;
    if (conditions.getDataSH() == B_TRUE) {
      res = true;
    }
    let yes = activeCell.children[1];
    let no = activeCell.children[2];
    let stillIn = false;
    if (res == true) {
      activeCell.dataSH = B_TRUE;
      this.addToStack(activeCell.childIndicies[1]);
      if (yes.children.length != 0) {
        this.index = yes.childIndicies[0];
        stillIn = true;
      }
    } else {
      activeCell.dataSH = B_FALSE;
    }
    return stillIn;
  }

  runChildren(childs, indix){ //arays but used sequentially
    for (let i = 0; i < childs.length; i++){
      switch(childs[i].type){
        case T_EQUAL:
          this.t_compare(childs[i], indix[i]);
          break;
        case T_LESS:
          this.t_compare(childs[i], indix[i]);
          break;
        case T_GREATER:
          this.t_compare(childs[i], indix[i]);
          break;
        case T_NOT:
          this.t_not(childs[i], indix[i]);
          break;
        default:
          break;
      }
    }
  }

  t_condition(activeCell, index) {
    this.addToStack(index);
    activeCell.dataSH = B_UNSET;
    let survey = this.lookAtChildren(activeCell, index, 0);
    let res = this.evaluateCondition(survey['onlyBools'], survey['onlyNums'], survey['vals']);
    if (res == true) {
      activeCell.dataSH = B_TRUE;
    } else {
      activeCell.dataSH = B_FALSE;
    }
  }

  t_for(activeCell, index) {
    this.addToStack(index);
    let stillIn = false;
    if (activeCell.children[0].children.length > 0) {
      this.addToStack(activeCell.childIndicies[0]);
      if (activeCell.children[0].children[0].type == T_LEN){
        this.t_len(activeCell.children[0].children[0], activeCell.children[0].childIndicies[0]);
      }
      let repeats = activeCell.children[0].children[0].dataSHasType['number'];
      activeCell.children[0].updateDataSH(repeats);
      activeCell.updateDataSH(activeCell.dataSHasType['number'] + 1);
      if (activeCell.dataSH <= repeats) {
        stillIn = true;
      }
      this.updateVarMap(activeCell.children[0].handleSH, activeCell.dataSHasType['number'] -1);
    }
    if (stillIn == true) {
      if (activeCell.children[1].children.length > 0) {
        this.addToStack(activeCell.childIndicies[1]);
        this.index = activeCell.children[1].childIndicies[0];
      }
    }
    return stillIn;
  }

  t_while(activeCell, index) {
    this.addToStack(index);
    let conditions = activeCell.children[0];
    activeCell.dataSH = B_UNSET; // 0 = unknown, 1 = true, 2 = false (?)
    this.t_condition(conditions, activeCell.childIndicies[0]);
    let res = false;
    if (conditions.getDataSH() == B_TRUE) {
      res = true;
    }
    let yes = activeCell.children[1];
    let stillIn = false;
    if (res == true) {
      activeCell.dataSH = B_TRUE;
      this.addToStack(activeCell.childIndicies[1]);
      if (yes.children.length != 0) {
        this.index = yes.childIndicies[0];
        stillIn = true;
      }
    } else {
      activeCell.dataSH = B_FALSE;
      stillIn = false;
    }
    return stillIn;
  }

  t_len(activeCell, index) {
    this.addToStack(index);
    let blockIndex = this.findBlock(activeCell.handleSH);
    if (blockIndex == -1) {
      return;
    }
    activeCell.dataSH = -1;
    if (this.script[blockIndex].type == T_INPUT){
      activeCell.updateDataSH(this.script[blockIndex].dataSHasType['string'].length);
    } else {
      activeCell.updateDataSH(this.script[blockIndex].children.length);
    }
  }

  unpackGet(getBlock){
    if (getBlock.dataSH.indexOf('object:') != -1){
      let index = parseInt(getBlock.dataSH.slice('object:'.length));
      if (String(this.script[index].handleSH) == 'undefined') {
        return index;
      } else {
        return this.findBlock(this.script[index].handleSH);
      }
    } else {
      return getBlock.dataSH;
    }
  }

  t_arrayOp(activeCell, index) {
    this.addToStack(index);
    if (activeCell.children[0].children.length == 0){
      return;
    }
    let blockIndex = this.findBlock(activeCell.handleSH);
    if (blockIndex == -1 || activeCell.children.length < 1 || activeCell.handleSH == 'unset') {
      activeCell.updateDataSH(-1);
      return;
    }
    this.tidyFlag = true;
    let blockType = this.script[blockIndex].type;
    let myInd = parseInt(activeCell.children[0].children[0].dataSH);
    if (activeCell.type == T_GET || activeCell.type == T_RUN) {
      this.tidyFlag = false;
      if (blockType == T_INPUT){
        let target = String(this.script[blockIndex].dataSH);
        let dataval = target[myInd % target.length];
        activeCell.updateDataSH(dataval);
      } else {
        let children = this.script[blockIndex].children;
        let child = children[myInd % children.length];
        while (myInd < 0) {
          myInd += children.length;
        }
        myInd = myInd % children.length;
        let childInd = this.script[blockIndex].childIndicies[myInd];
        if (activeCell.type == T_RUN && (child.type == T_BLOCK || child.type == T_GOTO)){
          this.index = childInd;
          return;
        }
        this.addToStack(childInd);
        if (String(child.dataSH) != 'undefined') {
          activeCell.updateDataSH(child.dataSH);
        } else {
          activeCell.updateDataSH("object:" + this.script[blockIndex].childIndicies[myInd]);
        }
      }
    } else if (activeCell.type == T_PUSH) {
      this.lookAtChildren(activeCell.children[0], activeCell.childIndicies[0], 0);
      this.envChanged = true;
      let childData = 0;
      if (activeCell.children[0].children.length > 0){
        childData = activeCell.children[0].children[0].getDataSH();
      }
      if (blockType == T_INPUT) {
        this.script[blockIndex].updateDataSH(this.script[blockIndex].dataSHasType['string'] + String(childData), true);
        // need to update globally too
        let output = this.script[blockIndex].handleSH;
        this.updateVarMap(output, this.script[blockIndex].getDataSH());
      } else {
        let type = T_CONST;
        if (activeCell.children[0].children[0].type == T_GOTO) {
          type = T_GOTO;
        }
        let newChild = cells.pushChild(type, blockIndex, this.script[blockIndex], childData);
        if (type == T_GOTO) {
          newChild.updateHandleSH(activeCell.children[0].children[0].handleSH);
        }
        this.script.push(newChild);// = cells.cells;
        this.terminate = this.script.length + 1;
      }
    } else if (activeCell.type == T_SET) { // might not work with T_GET
      this.lookAtChildren(activeCell.children[0], activeCell.childIndicies[0], 0);
      this.lookAtChildren(activeCell.children[1], activeCell.childIndicies[1], 0);
      this.envChanged = true;
      let newVal = String(activeCell.children[1].children[0].getDataSH());
      if (blockType == T_INPUT) {
        newVal = newVal[0];
        let oldData = this.script[blockIndex].dataSHasType['string'];
        myInd = myInd % oldData.length;
        let newData = oldData.substring(0, myInd) + newVal + oldData.substring(myInd+1)
        this.script[blockIndex].updateDataSH(newData, true);
        let output = this.script[blockIndex].handleSH;
        this.updateVarMap(output, this.script[blockIndex].getDataSH());
      } else {
        let sourceType = activeCell.children[1].children[0].type;
        myInd = myInd % this.script[blockIndex].children.length
        let target = this.script[blockIndex].children[myInd];
        let targetI = this.script[blockIndex].childIndicies[myInd];
        // change to type: keep handle change data, add handle and data, addData ?
        cells.replaceWithType(sourceType, this.script[blockIndex], target, targetI, activeCell.children[1].children[0]);
        this.script = cells.cells;
      }
    } else if (activeCell.type == T_DELETE) {
      this.envChanged = true;
      if (blockType == T_INPUT) {
        let data = this.script[blockIndex].dataSHasType['string'];
        myInd = myInd % data.length;
        let newData = data.slice(0, myInd) + data.slice(myInd + 1);
        this.script[blockIndex].updateDataSH(newData, true);
        this.updateVarMap(this.script[blockIndex].handleSH, this.script[blockIndex].getDataSH());
      } else {
        if (this.script[blockIndex].children.length == 0) {
          return;
        }
        myInd = myInd % this.script[blockIndex].children.length;
        let indexToDelete = this.script[blockIndex].childIndicies[myInd];
        cells.cells[indexToDelete].markForDeletion();
        let deleted = [];
        for (let i = 0; i < cells.length; i++){
          if (cells.cells[i].mode == M_DELETE){
            deleted.push(i);
          }
        }
        cells.activeIndex = indexToDelete;
        cells.doDelete();
        this.script = cells.cells;
        this.terminate -= deleted.length;
        for (let j = 0; j < deleted.length; j++) {
          for (let i = 0; i < this.workingStack.length; i++){
            if (this.workingStack[i] > deleted[j]) {
              this.workingStack[i] -= 1;
            }
          }
        }
      }
    }
  }

};
