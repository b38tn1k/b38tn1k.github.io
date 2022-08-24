class Controller {
  constructor() {
    this.script;
    this.run = false;
  }

  startStop(cells) {
    // started
    if (cells.run == true && this.run == false) {
      this.run = true;
      this.script = cells.cells;
      console.log("wahhhooooo");
    }
    // stopped by cells
    if (cells.run == false) {
      this.run = false;
    }
    // stopped by controller
    if (this.run === false) {
      cells.run = false;
    }
  }
  update(cells) {
    this.startStop(cells);
  }
};
