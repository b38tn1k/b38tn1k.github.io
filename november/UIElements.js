function pixelBorder(cnv, r=3) {
  let flwr = floor((cnv.g.width - r)/r);
  let flhr = floor((cnv.g.height - r)/r);
  let rd = r;
  let v = 0;
  let off = 0;
  let noff = r;
  flwr -= 1;
  let flY = (flwr%2 == 0);
  let flX = (flhr%2 == 0);
  cnv.g.fill(G.colors[0]);
  cnv.g.stroke(G.colors[0]);
  cnv.g.strokeWeight(1);
  let newCanv = createGraphics(flwr*r, flhr*r);
  cnv.g.rectMode(CORNER);
  cnv.g.rect(0, 0, cnv.g.width, (cnv.g.height - newCanv.height)/2);
  cnv.g.rect(0, 0, (cnv.g.width - newCanv.width)/2, cnv.g.height);
  cnv.g.rect(0, cnv.g.height-((cnv.g.height - newCanv.height)/2), cnv.g.width, newCanv.height);
  cnv.g.rect(cnv.g.width - (cnv.g.width - newCanv.width)/2, 0, newCanv.width, cnv.g.height);
  newCanv.fill(G.colors[0]);
  newCanv.noStroke();
  newCanv.rectMode(CORNER);
  for (let i = 0; i < r; i++) {
    // horizontals
    for (let j = 0; j < newCanv.width; j += 2*r) {
      newCanv.square(j + off, v, rd);
      if (flX == true) {
        newCanv.square(j + noff, newCanv.height - (v + r), rd);
      } else {
        newCanv.square(j + off, newCanv.height - (v + r), rd);
      }
    }
    // verticals
    for (let j = 0; j <= cnv.g.height; j += 2*r) {
      newCanv.square(v, j + off, rd);
      if (flY == true) {
        newCanv.square(newCanv.width - (v + r), j + noff, rd);
      } else {
        newCanv.square(newCanv.width - (v + r), j + off, rd);
      }

    }
    v += r;
    if (off == 0) {
      off = r;
      noff = 0;
    } else {
      off = 0;
      noff = r;
    }
    rd -= 1;
  }
  cnv.g.imageMode(CENTER);
  cnv.g.image(newCanv, cnv.tx, cnv.ty);
  newCanv.remove();
}

class UIElements {
  constructor() {
    this.layer = G.graphLayers.getLayer('UI', true, 100);
    this.layer.g.imageMode(CENTER);
    this.cmp = {}
    this.cmp.bg = newDrawableFromImage(splitSheet(G.loaders['compass'], 38, 0, 0, 1));
    this.cmp.fg = newDrawableFromImage(splitSheet(G.loaders['compass'], 38, 2, 1, 9));
    // compass height = 38;

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
    this.layer.g.image(this.cmp.bg.g, this.cmp.x, this.cmp.y);
    let selection = int(((this.cmp.fg.rot + radians(22.5) + PI)/TWO_PI) * 8);
    selection = (selection == 8) ? 0 : selection;
    this.layer.g.image(this.cmp.fg.g, this.cmp.x, this.cmp.y, 38, 38, selection*38, 0, 38, 38);
    this.layer.g.image(this.inv.g, this.inv.tx, this.inv.ty);
    this.layer.g.image(this.border.g, this.inv.tx, this.inv.ty);
  }

};
