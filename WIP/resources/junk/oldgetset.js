t_get(activeCell, index) {
  this.addToStack(index);
  activeCell.dataSH = -1;
  let getIndex = 0;
  if (activeCell.children.length == 3) {
    // test this
    activeCell.updateHandleSH(activeCell.children[2].handleSH);
    // test this
    if (activeCell.children[2].dataSHasType['isNumber'] == true) {
      getIndex = int(activeCell.children[2].dataSHasType['number']);
    }
  }
  if (activeCell.children.length >= 2) {
    if (activeCell.children[1].type == T_GOTO) {
      // test this
      activeCell.updateHandleSH(activeCell.children[1].handleSH);
      // test this
      let block = this.findBlock(activeCell.children[1].handleSH);
      if (this.script[block].children.length > getIndex) {
        activeCell.dataSH = this.script[block].children[getIndex].getDataSH();
      }
    } else if (activeCell.children[1].type == T_BLOCK) {
      if (activeCell.children[1].children.length > getIndex) {
        activeCell.dataSH = activeCell.children[1].children[getIndex].getDataSH();
      }
    } else {
      if (activeCell.children[1].dataSH) {
        if (activeCell.children[1].dataSH.length > getIndex) {
          activeCell.dataSH = activeCell.children[1].getDataSH()[getIndex];
        }
      }
    }
  }
  let output = activeCell.children[0].handleSH;
  this.updateVarMap(output, activeCell.getDataSH());
}

t_set(activeCell, index) {
  this.addToStack(index);
  activeCell.dataSH = -1;
  let setIndex = 0;
  let newValue = '';
  let handle = ''
  if (activeCell.children.length == 3) {
    newValue = activeCell.children[2].getDataSH();
    if (activeCell.children[1].dataSHasType['isNumber'] == true) {
      setIndex = int(activeCell.children[1].dataSHasType['number']);
    }
    if (activeCell.children[0].type == T_GOTO) {
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
          let oldV = this.script[block].getDataSH();
          let updatedValue;
          if (setIndex == 0) {
            updatedValue = newValue + oldV.slice(1, oldV.length);
          } else if (setIndex == oldV.length - 1) {
            updatedValue = oldV.slice(0, setIndex) + newValue;
          } else {
            updatedValue = oldV.slice(0, setIndex) + newValue + oldV.slice(setIndex + 1, oldV.length);
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
