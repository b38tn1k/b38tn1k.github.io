class HitThing {
  constructor(name, value, x, y) {
    if (value > 0) {
      value = '+' + String(value);
    }
    if (value == 0) {
      this.words = name;
    } else {
      this.words = name + ' ' + String(value);
    }
    this.time = millis() + 300;
    this.is = true;
    this.x = x;
    this.y = y;
  }
}

class Inventory {
  constructor() {
    this.i = {};
    this.dI = true;
    this.iDi = true;
    this.count = 0;
  }
  getRandomOwnedInventoryItem() {
    let choice = [];
    for (key in this.i) {
      if (this.i[key] >= 1 && key != 'boot'){
        choice.push(key);
      }
    }
    return random(choice);
  }
  addItem(key, count=1) {
    let res = this.checkInventory(key);
    this.dI = true;
    this.iDi = true;
    if (res.has == true) {
      this.i[key] += count;
    } else {
      this.i[key] = count;
    }
    this.count += count;
    return true;
  }

  subtractItem(key, count=1) {
    let res = this.checkInventory(key);
    if (res.has == true) {
      this.i[key] -= count;
      this.dI = true;
      this.iDi = true;
      this.count -= count;
    }
    return true;
  }

  hasItems() {
    return this.count > 0;
  }

  trade(sI, sC, dI, dC) {
    this.subtractItem(sI, sC);
    this.addItem(dI, dC);
  }

  empty() {
    let tempCount = this.count;
    for (key in this.i) {
      this.i[key] = 0;
    }
    this.count = 0;
    this.dI = true;
    this.iDi = true;
    return tempCount;
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
    // super(G.dims.w * 0.5, G.dims.h * 0.8);
    super(G.dims.w * 0.5, G.dims.h);
    this.makeEntry = true;
    this.companion = new Companion();
    this.hasCompanion = false;
    this.layer.g.textFont(G.loaders['font']);
    this.textColor = G.colors[0];
    this.bgColor = G.colors[2];
    this.fontSize = 12;
    this.layer.g.textSize(this.fontSize);
    this.layer.g.textLeading(this.lineSpacing * this.fontSize);
    this.layer.g.textAlign(LEFT, TOP);
    this.layer.g.noStroke();
    this.origin = [0.5, 1];
    this.playable = true;
    this.inventory = new Inventory();
    this.oldInventory = new Inventory();;
    this.movementSpeed = 2;
    this.wBoots = 4;
    this.noBoots = 2;
    this.bbox = [0, 0, 0, 0];
    this.bboxWidth = 16;
    this.moveVector = [0, 0];
    this.keyInput = false;
    this.keyBasedDir = 'up';
    this.hit = {};
    this.hit.is = false;
    this.isStuck = false;
  }

  moveNorth(){
    this.moveVector[0] -= 1;
    this.keyInput = true;
  }

  backupInventory() {
    this.oldInventory.i = {};
    this.oldInventory.count = this.inventory.count;
    for (key in this.inventory.i) {
      this.oldInventory.i[key] = this.inventory.i[key];
    }
  }

  recoverInventory() {
    this.inventory.i = {};
    this.inventory.count = this.oldInventory.count;
    for (key in this.oldInventory.i) {
      this.inventory.i[key] = this.oldInventory.i[key];
    }
    this.inventory.dI = true;
    this.inventory.iDi = true;
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
    this.current.tx = int(this.origin[0] * G.dims.w);
    this.current.ty = int(this.origin[1] * G.dims.h);
    this.refreshLayout();
    this.companion.reset(this);
  }

  refreshLayout() {
    super.refreshLayout(int(this.origin[0] * G.dims.w), int(this.origin[1] * G.dims.h));
    this.inventory.dI = true;
  }

  addItem(key, count=1) {
    this.inventory.addItem(key, count);
    return true;
  }

  subtractItem(key, count=1) {
    this.inventory.subtractItem(key, count);
    return true;
  }

  checkInventory(key) {
    return this.inventory.checkInventory(key);
  }
  hasBead() {
    return this.inventory.checkInventory('bead').has;
  }
  hasNoFoodAndNoBeads() {
    return !(this.hasBead() || this.hasFood());
  }
  hasFood() {
    return this.inventory.checkInventory('food').has;
  }
  hasNoFood() {
    return ! (this.hasFood());
  }
  hasBoot() {
    return this.inventory.checkInventory('boot').has;
  }
  removeMedicine() {
    let medCount = this.inventory.i['medicine'];
    this.subtractItem('medicine', medCount);
  }
  crystalsToFood(mult){
    let crystalCount = this.inventory.i['crystal'];
    this.addItem('food', mult * crystalCount);
    this.subtractItem('crystal', crystalCount);
  }
  hasNoBoot() {
    return ! (this.hasBoot());
  }
  hasAnything() {
    return this.inventory.hasItems();
  }
  hasNothing() {
    return ! (this.inventory.hasItems());
  }
  emptyInventory() {
    return this.inventory.empty();
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

  doUpdate(level, input) {
    let prevX = this.current.tx;
    let prevY = this.current.ty;
    if (this.inventory.iDi == true) {
      this.movementSpeed = this.inventory.checkInventory('boot').has ? this.wBoots : this.noBoots;
      if (this.inventory.checkInventory('boot').has == false) {
        this.addAnimation(8, G.loaders['player-noboots-up'], 'up', [0, 4], 0);
        this.addAnimation(8, G.loaders['player-noboots-down'], 'down',[0, 4], 0);
        this.addAnimation(8, G.loaders['player-noboots-left'], 'left',[0, 4], 0);
        this.addAnimation(8, G.loaders['player-noboots-right'], 'right',[0, 4], 0);
        this.setCollectionRate(0.8);
      } else {
        this.addAnimation(8, G.loaders['player-boots-up'], 'up', [0, 4], 0);
        this.addAnimation(8, G.loaders['player-boots-down'], 'down',[0, 4], 0);
        this.addAnimation(8, G.loaders['player-boots-left'], 'left',[0, 4], 0);
        this.addAnimation(8, G.loaders['player-boots-right'], 'right',[0, 4], 0);
        this.setCollectionRate(0.8);
      }
      this.inventory.iDi = false;
    }
    this.moveVector = [0, 0];
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
      let dialog = level.dialogs[level.diaP]
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
    for (let i = 0; i < level.obstacles.length; i++) {
      if (bounded(level.obstacles[i], this.current.tx, this.current.ty).complete == true) {
        this.current.tx = prevX;
        this.current.ty = prevY;
      }
    }
  }

  enterLevel(level, input){
    super.update();
    if (this.current.ty > G.dims.h * 0.85) {
      this.current.play = true;
      this.current.ty -= this.movementSpeed;
    } else {
      this.makeEntry = false;
    }
  }

  update(level, input) {
    if (this.hasCompanion) {
      this.companion.update(this, level);
    }
    if (this.makeEntry == true) {
      this.enterLevel(level, input);
    } else if (this.isStuck == true) {
      this.current.play = true;
      this.current.stopAtOne = false;
      super.update();
    } else {
      this.doUpdate(level, input);
    }

  }

  draw() {
    super.draw();
    if (this.hasCompanion) {
      this.companion.draw();
    }
    if (this.hit.is == true && this.hit.time > millis()) {
      this.layer.g.fill(this.bgColor);
      this.layer.g.rect(this.hit.x, this.hit.y, this.layer.g.textWidth(this.hit.words), this.fontSize * 1.5);
      this.layer.g.fill(this.textColor);
      this.layer.g.text(this.hit.words, this.hit.x ,this.hit.y);
    }
  }
};
