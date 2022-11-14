class Level {
  constructor(name) {
    this.name = name;
    this.dialogs = [];
    this.dialogsC = [];
    this.diaP = 0;
    this.dialogCurrent;
    this.npcs = [];
    this.npcsC = [];
    this.npcTags = [];
    this.bg;
    // this.bg = G.graphLayers.getLayer('background', true, 0, 16);
    this.drawBGFG;
    this.initBGFG();
  }
  initBGFG(res = 16) {
    let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
    this.bg = G.graphLayers.newLayer(0, 'background', w, h, r, tx, ty, 16);
    this.fg = G.graphLayers.newLayer(100, 'foreground', w, h, r, tx, ty, 16);
  }
  attachBGSetup(bg){
    this.drawBGFG = bg;
  }
  newSpriteCollection(tag, x, y) {
    this.npcsC.push([x, y]);
    this.npcTags.push(tag);
    let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
    let sc = new SpriteCollection(G.dims.w * x, G.dims.h * y);
    this.addNPC(sc);
    return sc;
  }
  newDialog(x, y) {
    this.dialogsC.push([x, y]);
    let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
    let nd = new Dialog(G.dims.w * x, G.dims.h * y, G.triggerRadius, G.triggerRadius);
    this.addDialog(nd);
    return nd;
  }
  addDialog(dialog) { // i might want to save the dims in these ones for resizing?
    this.dialogs.push(dialog);
  }
  addNPC(npc) {
    this.npcs.push(npc);
  }
  refreshLayout() {
    this.initBGFG();
    this.drawBGFG(this.bg, this.fg);
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
  update(player, inputs) {
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].update(this.currentDialog, inputs);
    }
    this.dialogs[this.diaP].update(player.current, inputs);
  }
  draw() {
    this.dialogs[this.diaP].draw();
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].draw();
    }
  }
}
