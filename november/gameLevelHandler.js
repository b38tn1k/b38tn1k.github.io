class Level {
  constructor(name) {
    this.name = name;
    this.dialogs = [];
    this.pickups = [];
    this.dialogsC = [];
    this.dialogCondition = [];
    this.diaP = 0;
    this.obstacles = [];
    this.npcs = [];
    this.npcsC = [];
    this.npcTags = [];
    this.bg;
    this.drawBGFG;
    this.inventory = new Inventory();
    this.initBGFG();
    this.transitionBB;
    this.spriteLayer = G.graphLayers.getLayer('sprites', true, 100);
    this.new = true;
    this.levelLogic = returnTrue;
  }
  optimizePickups() {
    let distances = [];
    let orderedIndices = [];
    for (let i = 0; i < this.pickups.length; i++){
      distances.push(int(pow((G.dims.cx - this.pickups[i].bbox[0]), 2)) + int(pow(G.dims.h - (this.pickups[i].bbox[1]), 2)));
    }
    while (distances.length > 0) {
      const minCurInd =  this.pickups[distances.indexOf(min(distances))];
      orderedIndices.push(minCurInd);
      distances.splice(minCurInd, 1);
    }
    this.pickups = orderedIndices;
  }
  initBGFG(res = 16) {
    let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
    this.bg = G.graphLayers.getLayer('background');
    this.fg = G.graphLayers.getLayer('foreground');
    if (this.bg == -1) {
      this.bg = G.graphLayers.newLayer(0, 'background', w, h, r, tx, ty, 16);
      this.fg = G.graphLayers.newLayer(100, 'foreground', w, h, r, tx, ty, 16);
    }
  }
  attachBGSetup(bg){
    this.drawBGFG = bg;
  }

  shutDown() {
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].shutDown();
    }
    this.npcs = [];
    // console.log(this.dialogs);
    for (let i = 0; i < this.dialogs.length; i++) {
      this.dialogs[i].shutDown();
    }
    this.dialogs = [];
  }

  newSpriteCollection(tag, x, y, type=0, radius=32) {
    this.npcsC.push([x, y]);
    this.npcTags.push(tag);
    let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
    let sc;
    if (type == 1) {
      sc = new ChasingSprites(G.dims.w * x, G.dims.h * y);
    } else if (type == 0){
      sc = new SpriteCollection(G.dims.w * x, G.dims.h * y);
    } else if (type == 2) {
      let xx = G.dims.w * x;
      let yy = G.dims.h * y;
      sc = new SpriteCollection(xx, yy);
      let bb = [xx - radius, yy-radius, xx + radius, yy + radius];
      this.obstacles.push(bb);
    }
    this.addNPC(sc);
    return sc;
  }
  deleteDialogs() {
    this.dialogsC = [];
    this.dialogCondition = [];
    this.dialogs = [];
  }
  setSpritesToAttack(deleteDialogs=true) {
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].autochange = true;
      this.npcs[i].attack = true;
      this.npcs[i].aggressive = true;
      this.npcs[i].doRandomWalk = true;
      if (deleteDialogs == true) {
        this.deleteDialogs();
      }
    }
    return true;
  }
  newDialog(x, y, condition=returnTrue) {
    this.dialogsC.push([x, y]);
    let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
    let nd = new Dialog(G.dims.w * x, G.dims.h * y, G.triggerRadius, G.triggerRadius);
    this.addDialog(nd, condition);
    return nd;
  }
  addDialog(dialog, condition) { // i might want to save the dims in these ones for resizing?
    this.dialogs.push(dialog);
    this.dialogCondition.push(condition);
  }
  addNPC(npc) {
    this.npcs.push(npc);
  }
  addPickup(x, y, items) {
    this.pickups.push(new Pickup(x, y, items));
  }
  drawStatics() { // handle deletion and creation of graphics better
    this.bg.g.clear();
    this.fg.g.clear();
    this.transitionBB = this.drawBGFG(this.bg, this.fg);
  }
  refreshLayout() {
    this.initBGFG();
    this.drawBGFG(this.bg, this.fg);
    console.log(this.transitionBB, this.bg.g.width, this.fg.g.width);
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].refreshLayout(G.dims.w * this.npcsC[i][0], G.dims.h * this.npcsC[i][1]);
    }
    for (let i = 0; i < this.dialogs.length; i++) {
      let newX = G.dims.w * this.dialogsC[i][0]
      let newY = G.dims.h * this.dialogsC[i][1]
      this.dialogs[i].refreshLayout(newX, newY, G.triggerRadius, G.triggerRadius);
      for (let j = 0; j < this.npcs.length; j++) {
        this.dialogs[i].updateCoords(this.npcTags[j], this.npcs[j].current);
      }
    }
  }
  chooseDialog(player){
    for (let i = 0; i < this.dialogCondition.length; i++) {
      if (this.dialogCondition[i]() == true) {
        this.diaP = i;
        break;
      }
    }
  }
  update(player, inputs) {
    this.levelLogic(player, inputs, this);
    if (player && this.new == true) {
      this.chooseDialog();
      this.new = false;
    }
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].update(player);
    }
    if (this.dialogs.length > 0) {
      this.dialogs[this.diaP].update(player.current, inputs);
    }
    if (bounded(this.transitionBB, player.current.tx, player.current.ty).complete == true) {
      G.transitionFlag = true;
    }
    for (let i = 0; i < this.pickups.length; i++) {
      this.pickups[i].update(player);
    }
  }
  draw() {
    if (this.dialogs.length > 0) {
      this.dialogs[this.diaP].draw();
    }
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].draw();
    }
    let bounce;
    for (let i = 0; i < this.pickups.length; i++) {
      if (this.pickups[i].isActive == true) {
        if (this.pickups[i].bounce == true) {
          bounce = 0.5*(sin(millis()/200));
        } else {
          bounce = 0;
        }
        this.spriteLayer.g.image(G.loaders[this.pickups[i].image], this.pickups[i].x, this.pickups[i].y + bounce);
      }
    }
  }
}
