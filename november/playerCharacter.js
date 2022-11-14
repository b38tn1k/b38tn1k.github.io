class Inventory {
  constructor() {
    this.i = {};
    this.dI = true;
  }
  addItem(key, count=1) {
    let res = this.checkInventory(key);
    if (res.has == true) {
      this.i[key] += count;
      this.dI = true;
    } else {
      this.i[key] = count;
    }
  }

  subtractItem(key, count=1) {
    let res = this.checkInventory(key);
    if (res.has == true) {
      this.i[key] -= count;
      this.dI = true;
    }
  }

  checkInventory(key) {
    let result = {};
    result.has = (key in this.i);
    result.count = result.has ? this.i[key] : 0;
    if (result.has == true) {
      result.has = this.i[key] > 0 ? true : false;
    }
    return result;
  }
}

class PlayerCharacter extends SpriteCollection {
  constructor() {
    super(G.dims.cx, G.dims.h - 100);
    this.origin = [G.dims.cx, G.dims.h - 100];
    this.playable = true;
    this.inventory = new Inventory;
    this.movementSpeed = 2;
    this.bbox = [0, 0, 0, 0];
    this.bboxWidth = 16;
  }

  reOrigin() {
    this.current.tx = this.origin[0];
    this.current.ty = this.origin[1];
  }

  refreshLayout() {
    super.refreshLayout(G.dims.cx, G.dims.h - 100);
    this.inventory.dI = true;
  }

  addItem(key, count=1) {
    this.inventory.addItem(key, count);
  }

  subtractItem(key, count=1) {
    this.inventory.subtractItem(key, count);
  }

  checkInventory(key) {
    return this.inventory.checkInventory(key);
  }

  hasFood() {
    return this.inventory.checkInventory('food').has;
  }

  selectCurrent(input){
    let direction = input.facing(this.current);
    this.chooseSequence(direction);

  }

  update(level, input) {
    let pause = false;
    if (level.dialogs.length > 0) {
      let dialog = level.dialogs[G.levels[G.levelPointer].diaP]
      pause = dialog.pauseForOptions;
    }
    super.update();
    this.bbox = [this.x - this.bboxWidth, this.y - this.bboxWidth, this.x + this.bboxWidth, this.y + this.bboxWidth];
    if (input.on == true && pause == false) {
      this.selectCurrent(input);
      this.current.play = true;
      let uv = input.getUnitVector(this.current);
      if (this.current.isMoveFrame() == true) {
        this.current.tx += uv[0] * this.movementSpeed;
        this.current.ty += uv[1]  * this.movementSpeed;
        this.current.tx = constrain(this.current.tx, 0, G.dims.w);
        this.current.ty = constrain(this.current.ty, 0, G.dims.h);
      }
    } else {
      this.current.stopAtOne = true;
    }
  }
}
