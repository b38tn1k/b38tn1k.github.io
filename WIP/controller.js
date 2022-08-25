class Controller {
  constructor() {
    this.script;
    this.index = 0;
    this.terminate;
    this.run = false;
    this.activeCell = null;
    this.running = false;
    this.prevIndex = -1;
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
      console.clear();
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
  update(cells) {
    this.startStop(cells);
    if (this.run == true) {
      this.step();
    }
  }
  step () {
    if (this.index < this.script.length) {
      this.activeCell = this.script[this.index];
      this.activeCell.flash = true;
      switch(this.activeCell.type) {
        case T_START:
          this.t_start();
          break;
        case T_CONSOLE:
          this.t_console();
          break;
        case T_GOTO:
          this.t_goto();
          break;
        case T_BLOCK:
          this.t_block();
        default:
          break;
      }
    } else {
      this.run = false;
    }
    this.activeCell.selfDescribe(true);

  }

  t_start() {
    if (this.activeCell.children.length == 0) {
      this.run = false;
      this.index = this.terminate;
    } else {
      this.index = this.activeCell.childIndicies[0];
    }
  }

  t_console() {
    // do nothing I can think of
  }

  t_goto() {
    let next = this.activeCell.inletHandleSH;
    this.index = this.terminate;
    for (let i = 0; i < this.script.length; i++) {
      if (next == this.script[i].funcHandleSH) {
        this.index = i;
      }
    }
  }

  t_block() {
    if (this.activeCell.children.length == 0) {
      this.run = false;
      this.index = this.terminate;
    } else {
      this.index = this.activeCell.childIndicies[0];
    }
  }
};
