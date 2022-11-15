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
    this.moveVector = [0, 0];
    this.keyInput = false;
    this.keyBasedDir = 'up';
  }

  moveNorth(){
    this.moveVector[0] -= 1;
    this.keyInput = true;
  }

  moveSouth(){
    this.moveVector[0] += 1;
    this.keyInput = true;
  }

  moveWest(){
    this.moveVector[1] -= 1;
    this.keyInput = true;
  }

  moveEast(){
    this.moveVector[1] += 1;
    this.keyInput = true;
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
    this.keyBasedDir = direction;
    this.chooseSequence(direction);
  }

  selectCurrentKeys(mv){
    let direction = this.keyBasedDir;
    if (abs(mv[0]) >= 1) {
      this.keyBasedDir = mv[0] > 0 ? 'down' : 'up';
    } else if (abs(mv[1]) >= 1) {
      this.keyBasedDir = mv[1] > 0 ? 'right' : 'left';
    }
    this.chooseSequence(this.keyBasedDir);
  }

  update(level, input) {
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.moveNorth();
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.moveSouth();
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.moveWest();
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.moveEast();
    }
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
      }
    } else if (this.keyInput == true  && pause == false){
      this.selectCurrentKeys(this.moveVector);
      this.keyInput = false;
      this.current.play = true;
      if (this.current.isMoveFrame() == true) {
        this.current.tx += this.moveVector[1] * this.movementSpeed;
        this.current.ty += this.moveVector[0]  * this.movementSpeed;
      }
      this.moveVector = [0, 0];
    } else {
      this.current.stopAtOne = true;
    }
    this.current.tx = constrain(this.current.tx, 0, G.dims.w);
    this.current.ty = constrain(this.current.ty, 0, G.dims.h);
  }
}
