class PresentationHelper {
  constructor() {
    jlog('PresentationHelper', 'constructor');
    this.cells = [];
  }

  addCells(cells, start = 0){
    jlog('PresentationHelper', 'addCells');
    for (let i = start; i < cells.length; i++) {
      this.addCell(cells[i]);
    }
  }

  addCell(cell){
    jlog('PresentationHelper', 'addCell');
    if ([T_VAR, T_CONST].indexOf(cell.type) != -1){
      this.cells.push(cell);
    }
  }

};
