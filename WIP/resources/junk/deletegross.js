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
