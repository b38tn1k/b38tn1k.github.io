class PlayerCharacter extends SpriteCollection {
  constructor() {
    super(G.dims.cx, G.dims.h - 100, true);
    this.playable = true;
    this.inventory = {};
    this.inventoryChanged = true;
    this.movementSpeed = 2;
  }

  addInventoryItem(key, count=1) {
    let res = this.checkInventory(key);
    if (res.has == true) {
      this.inventory[key] += count;
      this.inventoryChanged = true;
    } else {
      this.inventory[key] = count;
    }
  }

  refreshLayout() {
    super.refreshLayout(G.dims.cx, G.dims.h - 100);
    this.inventoryChanged = true;

  }

  subtractInventoryItem(key, count=1) {
    let res = this.checkInventory(key);
    if (res.has == true) {
      this.inventory[key] -= count;
      this.inventoryChanged = true;
    }
  }

  checkInventory(key) {
    let result = {};
    result.has = (key in this.inventory);
    result.count = result.has ? this.inventory[key] : 0;
    if (result.has == true) {
      result.has = this.inventory[key] > 0 ? true : false;
    }
    return result;
  }

  hasFood() {
    return this.checkInventory('food').has;
  }

  selectCurrent(input){
    let direction = input.facing(this.current);
    this.chooseSequence(direction);

  }

  update(level, input) {
    let dialog = level.dialogs[G.levels[G.levelPointer].diaP]
    super.update(dialog, input);

    if (input.on == true && dialog.pauseForOptions == false) {
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
