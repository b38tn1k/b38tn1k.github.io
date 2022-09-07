class Controller {
  constructor() {
    this.script;
    this.index = 0;
    this.stackTrace = [];
    this.workingStack = [];
    this.stackTraceDir = [];
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
  }

  step (flash, fastMode) {
    try { // big try so I can put anything into the onscreen console
      if (this.index < this.script.length) {
        this.activeCell = this.script[this.index];
        if (flash == true && this.stackTrace.length > 1) {
          this.activeCell.flash = true;
          this.script[this.stackTrace[this.stackTrace.length-2]].flash = false;
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
            this.t_get(this.activeCell, this.index);
            this.moveByParent();
            break;
          case T_SET:
            this.t_set(this.activeCell, this.index);
            this.moveByParent();
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
        this.script[this.stackTrace[this.stackTrace.length - 2]].flash = false;
        this.printStack();
      }
    } catch (error) {
      this.script[1].indexLabeldiv.html('\n' + error, true);
    }
  }

  updateVarMap(key, data) {
    if (key == 'turtleX'){
      this.tChangeX = true;
    }
    if (key == 'turtleY'){
      this.tChangeY = true;
    }
    for (let i = 0; i < this.varMap[key].length; i++) {
      this.varMap[key][i].updateDataSH(data);
    }
    this.updateTurtle();
  }

  moveByParent() {
    if (this.workingStack.length > 100){
      this.script[1].indexLabeldiv.html('\n uncomfortably deep stack, time to die', true);
      this.script[1].indexLabeldiv.elt.scrollTop = 1000 * this.script[1].lineNumber;
      this.run = false;
    }
    let currentI = this.workingStack.pop();
    this.addToStack(currentI, 0); // 0 means it adds to trace, not working stack
    this.script[currentI].flash = false;
    if (this.script[currentI].type == T_CONDITION && this.script[this.script[currentI].parent].type == T_IF){
        currentI = this.workingStack.pop();
        this.addToStack(currentI, 0);
    }
    if (this.script[currentI].type == T_CONDITION && this.script[this.script[currentI].parent].type == T_WHILE){
        if (this.script[currentI].dataSH == B_FALSE){
          currentI = this.workingStack.pop();
          this.addToStack(currentI, 0);
        }
    }
    this.script[currentI].flash = false;
    if (this.workingStack.length < 1) {
      this.index = this.terminate;
    } else {
      let callerI = this.workingStack[this.workingStack.length-1];
      let callerC = this.script[callerI];
      let curInCaller = callerC.childIndicies.indexOf(currentI);
      if (curInCaller == -1 || curInCaller == callerC.childIndicies.length-1){
        this.addToStack(callerI, 0);
        this.moveByParent();
      } else {
        this.index = callerC.childIndicies[curInCaller + 1];
      }
    }
}

getValue(child, index) {
  let data;
  let varType = -1;
  if (mathFunctions.indexOf(child.type) != -1) {
    this.t_math(child, index);
    data = child.children[0].dataSH;
    varType = V_NUMBER;
  } else if (boolFunctions.indexOf(child.type) != -1 && (child.type != T_NOT))  {
    this.t_compare(child, index);
    data = child.children[0].dataSH;
    varType = V_BOOL;
  } else if (child.type == T_LEN){
    this.t_len(child, index);
    data = String(child.dataSH);
    varType = V_NUMBER;
  } else if (child.type == T_NOT){
    this.t_not(child, index);
    data = child.children[0].dataSH;
    varType = V_BOOL;
  } else {
    data = child.dataSH;
    if (/^\d+\.\d+$/.test(data) == true || /^\d+$/.test(data) == true) {
      varType = V_NUMBER;
    } else if (data == 'true' || data == 'false'){
      varType = V_BOOL;
      data = (data == 'true');
    } else {
      varType = V_STRING;
    }
  }
  let result = {type: varType, data: data};
  return result;
  }

  lookAtChildren(activeCell, index, start=1) {
    let onlyNums = true;
    let onlyBools = true;
    let containsString = false;
    let vals = [];
    let isNumbers = [];
    for (let i = start; i < activeCell.children.length; i++) {
      if (activeCell.children[i].type != T_COMMENT) {
        let result =  this.getValue(activeCell.children[i], activeCell.childIndicies[i]);
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
      for (let i = 0; i < vals.length; i++){
        myResult += int(vals[i]);
      }
      res = (myResult == vals.length);
    }
    if (onlyNums == true) {
      for (let i = 0; i < vals.length; i++){
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
      this.script = cells.cells;
      this.terminate = this.script.length + 1;
      this.stackTrace = [];
      this.workingStack = [0];
      this.stackTraceDir = [];
      this.varRecord = [];
      this.tBuffX = [];
      this.tBuffY = [];
      this.varMap = {};
      this.weHaveATurtlePeople = false;
      this.stackNotes = [];
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
          cells.mapAndLink();
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

  printStack(){
    let readableStack = {};
    for (let i = 0; i < this.stackTrace.length; i++) {
      readableStack[i] = {};
      readableStack[i]['block index'] = this.stackTrace[i];
      readableStack[i]['name'] = this.script[this.stackTrace[i]].textLabel;
      readableStack[i]['handle'] = this.script[this.stackTrace[i]].handleSH;
      readableStack[i]['data state'] = this.varRecord[i];
      readableStack[i]['dir'] = (this.stackTraceDir[i] == 1) ? 'in' : 'out';
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
  addNote(myString){
    this.stackNotes.push([this.stackTrace.length - 1, myString]);
  }

  addToStack(index, dir=1) {
    this.stackTrace.push(index);
    this.stackTraceDir.push(dir);
    if (dir == 1) {
      this.workingStack.push(index);
    }
    let varRecAtom = '';
    for (key in this.varMap) {
      varRecAtom += String(key) + ": " + this.varMap[key][0].dataSH + ' | ';
    }
    this.varRecord.push(varRecAtom);
  }

  updateTurtle() {
    if (this.weHaveATurtlePeople == true){
      if (this.tChangeX == true) {
        this.tBuffX.push(parseFloat(this.varMap['turtleX'][0].dataSH));
        this.tChangeX = false;
      }
      if (this.tChangeY == true) {
        this.tBuffY.push(parseFloat(this.varMap['turtleY'][0].dataSH));
        this.tChangeY = false;
      }
      if (this.varMap['turtleDraw'][0].dataSHasType["bool"] == true) {
        this.updateVarMap('turtleDraw', 0);
        while (this.tBuffX.length < this.tBuffY.length) {
          this.tBuffX.push(this.tBuffX[this.tBuffX.length-1]);
        }
        while(this.tBuffX.length > this.tBuffY.length) {
          this.tBuffY.push(this.tBuffY[this.tBuffY.length-1]);
        }
        for (let i = 0; i < this.tBuffX.length - 1; i++) {
          let x1 = this.tBuffX[i];
          let x2 = this.tBuffX[i+1];
          let y1 = this.tBuffY[i];
          let y2 = this.tBuffY[i+1];
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
      if (next == this.script[i].handleSH && this.script[i].type != T_GOTO) {
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

  t_print(activeCell, index) {
    this.addToStack(index);
    let myOutput = '<br>' + this.script[1].lineNumber + ': ';
    for (let j = 0; j < activeCell.children.length; j++) {
      if (activeCell.children[j].type != T_COMMENT) {
        let myString = String(this.script[activeCell.childIndicies[j]].dataSH);
        myOutput += myString.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
      }
    }
    this.script[1].indexLabeldiv.html(myOutput, true);
    this.script[1].lineNumber += 1;
    this.script[1].indexLabeldiv.elt.scrollTop = 1000 * this.script[1].lineNumber;
  }

  t_assign(activeCell, index) {
    this.addToStack(index);
    if (activeCell.children.length > 1) {
      let assigner = activeCell.children[0];
      let data = assigner.dataSH;
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
    let survey = this.lookAtChildren(activeCell, index);
    let onlyNums = survey['onlyNums'];
    let vals = survey['vals'];
    let isNumbers = survey['isNumbers'];
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
          }
        }
        switch(activeCell.type) {
          case T_SQRT:
            res = sqrt(res);
            break;
          case T_SIN:
            res = sin(res);
            break;
          case T_COS:
            res = cos(res);
            break;
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
    this.updateVarMap(output, res)
  }

  t_compare(activeCell, index) {
    this.addToStack(index);
    let survey = this.lookAtChildren(activeCell, index);
    let onlyNums = survey['onlyNums'];
    let vals = survey['vals'];
    let isNumbers = survey['isNumbers'];
    let res = true;
    if (vals.length == 0) {
      res = false;
    }
    console.log(onlyNums);
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
    this.dataSH = res;
    let output = activeCell.children[0].handleSH;
    this.updateVarMap(output, res);
    // for (let i = 0; i < this.varMap[output].length; i++) {
    //   this.varMap[output][i].updateDataSH(res);
    // }
  }

  t_not(activeCell, index) {
    this.addToStack(index);
    let survey = this.lookAtChildren(activeCell, index);
    let onlyNums = survey['onlyNums'];
    let vals = survey['vals'];
    let containsString = survey['containsString'];
    let isNumbers = survey['isNumbers'];
    let onlyBools = survey['onlyBools'];
    let res = this.evaluateCondition(onlyBools, onlyNums, vals);
    res = !res;
    let output = activeCell.children[0].handleSH;
    activeCell.dataSH = res;
    this.updateVarMap(output, res)
  }

  t_if(activeCell, index) {
    this.addToStack(index);
    let conditions = activeCell.children[0];
    activeCell.dataSH = B_UNSET; // 0 = unknown, 1 = true, 2 = false (?)
    this.t_condition(conditions, activeCell.childIndicies[0]);
    let res = false;
    if (conditions.dataSH == B_TRUE) {
      res = true;
    }
    let yes = activeCell.children[1];
    let no = activeCell.children[2];
    let stillIn = false;
    if (res == true) {
      activeCell.dataSH = B_TRUE;
      this.addToStack(activeCell.childIndicies[1]);
      if (yes.children.length != 0){
        this.index = yes.childIndicies[0];
        stillIn = true;
      }
    } else {
      activeCell.dataSH = B_FALSE;
    }
    return stillIn;
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

  t_while(activeCell, index) {
    this.addToStack(index);
    let conditions = activeCell.children[0];
    activeCell.dataSH = B_UNSET; // 0 = unknown, 1 = true, 2 = false (?)
    this.t_condition(conditions, activeCell.childIndicies[0]);
    let res = false;
    if (conditions.dataSH == B_TRUE) {
      res = true;
    }
    let yes = activeCell.children[1];
    let stillIn = false;
    if (res == true) {
      activeCell.dataSH = B_TRUE;
      this.addToStack(activeCell.childIndicies[1]);
      if (yes.children.length != 0){
        this.index = yes.childIndicies[0];
        stillIn = true;
      }
    } else {
      activeCell.dataSH = B_FALSE;
      stillIn = false;
    }
    return stillIn;
  }

  findBlock(handle){
    let block;
    for (let i = 0; i < this.script.length; i++) {
      if (this.script[i].type == T_BLOCK && this.script[i].handleSH == handle){
        block = i;
        break;
      }
    }
    return block;
  }

  t_len(activeCell, index){
    this.addToStack(index);
    activeCell.dataSH = -1;
    if (activeCell.children.length == 2) {
      if (activeCell.children[1].type == T_GOTO){
        let block = this.findBlock(activeCell.children[1].handleSH);
        activeCell.dataSH = this.script[block].children.length;
      } else if (activeCell.children[1].type == T_BLOCK) {
        activeCell.dataSH = activeCell.children[1].children.length;
      } else {
        if (activeCell.children[1].dataSH) {
          activeCell.dataSH = activeCell.children[1].dataSH.length;
        }
      }
    }
    console.log(activeCell.dataSH);
    let output = activeCell.children[0].handleSH;
    this.updateVarMap(output, activeCell.dataSH);
  }

  t_get(activeCell, index){
    this.addToStack(index);
    activeCell.dataSH = -1;
    let getIndex = 0;
    if (activeCell.children.length == 3) {
      if (activeCell.children[2].dataSHasType['isNumber'] == true) {
        getIndex = int(activeCell.children[2].dataSHasType['number']);
      }
    }
    if (activeCell.children.length >= 2) {
      if (activeCell.children[1].type == T_GOTO){
        let block = this.findBlock(activeCell.children[1].handleSH);
        if (this.script[block].children.length > getIndex) {
          activeCell.dataSH = this.script[block].children[getIndex].dataSH;
        }
      } else if (activeCell.children[1].type == T_BLOCK) {
        if (activeCell.children[1].children.length > getIndex) {
          activeCell.dataSH = activeCell.children[1].children[getIndex].dataSH;
        }
      } else {
        if (activeCell.children[1].dataSH) {
          if (activeCell.children[1].dataSH.length > getIndex) {
            activeCell.dataSH = activeCell.children[1].dataSH[getIndex];
          }
        }
      }
    }
    let output = activeCell.children[0].handleSH;
    this.updateVarMap(output, activeCell.dataSH);
  }

  t_set(activeCell, index){
    this.addToStack(index);
    activeCell.dataSH = -1;
    let setIndex = 0;
    let newValue = '';
    let handle = ''
    if (activeCell.children.length == 3) {
      newValue = activeCell.children[2].dataSH;
      if (activeCell.children[1].dataSHasType['isNumber'] == true) {
        setIndex = int(activeCell.children[1].dataSHasType['number']);
      }
      if (activeCell.children[0].type == T_GOTO){
        let block = this.findBlock(activeCell.children[0].handleSH);
        if (this.script[block].children.length > setIndex) {
          this.script[block].children[setIndex].updateDataSH(newValue);
          handle = this.script[block].children[setIndex].handleSH;
        }
      } else if (activeCell.children[0].type == T_BLOCK) {
        if (activeCell.children[0].children.length > setIndex) {
          let block = activeCell.childIndicies[0];
          this.script[block].children[setIndex].updateDataSH(newValue);
          handle = this.script[block].children[setIndex].handleSH;
        }
      } else {
        if (activeCell.children[0].dataSH) {
          if (activeCell.children[0].dataSH.length > setIndex) {
            let block = activeCell.childIndicies[0];
            let oldV = this.script[block].dataSH;
            let updatedValue;
            if (setIndex == 0) {
              updatedValue = newValue + oldV.slice(1, oldV.length);
            } else if (setIndex == oldV.length-1) {
              updatedValue = oldV.slice(0, setIndex) + newValue;
            } else {
              updatedValue = oldV.slice(0, setIndex) + newValue + oldV.slice(setIndex+1, oldV.length);
            }
            this.script[block].updateDataSH(updatedValue);
            handle = this.script[block].handleSH;
            newValue = updatedValue;
          }
        }
      }
    }
    if (handle) {
      this.updateVarMap(handle, newValue);
    }
  }
};
