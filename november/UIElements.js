class UIElements {
  constructor() {
    this.cmp = {}
    this.cmp.bg = newDrawableFromImage(splitSheet(G.loaders['compass'], 38, 0, 0, 1));
    this.cmp.fg = newDrawableFromImage(splitSheet(G.loaders['compass'], 38, 0, 1, 2));

    let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
    this.border = new Drawable(w, h, r, tx, ty, 0);
    pixelBorder(this.border);
    this.inv = new Drawable(w, h, r, tx, ty);
    this.inv.g.textFont(G.loaders['font']);
    this.fontSize = 10;
    this.halfFontSize = this.fontSize / 2;
    this.inv.g.textSize(this.fontSize);
    this.inv.g.textAlign(CENTER, TOP);
    this.inv.unit = 36;
    this.inv.halfunit = this.inv.unit/2;
    this.inv.x = 10;
    this.inv.y = 10;
    this.inv.textY = this.inv.y + this.inv.unit - 3;
    this.cmp.x = G.dims.w - this.inv.unit;
    this.cmp.y = this.inv.y + this.inv.halfunit;
    this.isTouchDevice = G.dims.isTouchDevice;
    this.controlOrigin = [];
  }

  drawInventory(inventory) {
    let keys = Object.keys(inventory);
    let invLength = Object.keys(inventory).length;
    let newWidth = this.inv.unit * invLength;
    let counter = 0;
    let y = this.inv.y;
    let subunit = int(0.4 * this.inv.unit);
    let invsubunit = this.inv.unit - subunit;
    let y2 = y + invsubunit;
    let r = this.inv.unit;

    for (let x = this.inv.x; x < newWidth + this.inv.x; x+=this.inv.unit) {
      this.inv.g.stroke(G.colors[4]);
      this.inv.g.fill(G.colors[3]);
      this.inv.g.square(x, y, r);
      if (keys[counter] in G.loaders) {
        this.inv.g.image(G.loaders[keys[counter]], x, y);
      } else {
        this.inv.g.image(G.loaders['unk'], x, y);
      }
      this.inv.g.fill(G.colors[1]);
      let sx = x + invsubunit;
      this.inv.g.square(sx, y2, subunit);

      this.inv.g.fill(G.colors[23]);
      this.inv.g.text(inventory[keys[counter]], sx, y2, subunit);
      counter += 1;
    }
  }

  update(player, myInp=G.inputs) {
    this.controlOrigin = [myInp.originX, myInp.originY]
    this.cmp.fg.rot = myInp.angleTo(player.current);
    if (player.inventory.dI == true) {
      this.drawInventory(player.inventory.i);
      player.inventory.dI = false;
    }
  }

  draw() {
    // if (this.isTouchDevice == true) {
    //   image(G.loaders['controlOrigin'], this.controlOrigin[0], this.controlOrigin[1])
    // }
    push();
    translate(this.cmp.x, this.cmp.y);
    image(this.cmp.bg.g, 0, 0);
    rotate(this.cmp.fg.rot);
    image(this.cmp.fg.g, 0, 0);
    pop();

    push();
    translate(this.inv.tx, this.inv.ty);
    image(this.inv.g, 0, 0);
    image(this.border.g, 0, 0);
    pop();

  }

};
