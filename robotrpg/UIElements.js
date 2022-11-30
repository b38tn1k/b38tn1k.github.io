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
    this.layer.g.textFont(G.loaders['font']);
    this.textSize = 14;
    this.layer.g.textSize(this.textSize);
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
    this.textBoxWidth = 500;
    this.lineSpacing = 1.5;
    this.totalLineHeight = this.fontSize * this.lineSpacing;
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
    this.albumdiv = createDiv('<a href="https://b38tn1k.com/#discog/november-man-and-possum-ost"><img src="https://b38tn1k.com/november/albumcoversquared.png" width=100%></a>');
    this.albumdiv.hide();
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

  calculateTextBoxHeight(line, magicnumber=0) {
    let words = line.split(" ");
    let wordLengths = [];
    for (let i = 0; i < words.length; i++) {
      wordLengths.push(this.layer.g.textWidth(words[i]) + this.layer.g.textWidth(" "));
    }
    let currentLine = 0;
    let lc = 1;
    for (let i = 0; i < wordLengths.length; i++) {
      if (currentLine + wordLengths[i] < this.textBoxWidth) {
        currentLine += wordLengths[i];
      } else {
        currentLine = wordLengths[i];
        lc += 1;
      }
    }
    lc += magicnumber;
    let textBoxHeight =lc * this.totalLineHeight;
    return textBoxHeight;
  }

  draw() {
    this.layer.g.clear();
  }

};
