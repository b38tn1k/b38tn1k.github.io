const TEXT_WIDTH_MULTIPLIER = 1.5;
const TIGHT_DIM_GAP_PERCENT = 0.2;
const LOW_MID_DIM_GAP_PERCENT = 0.4;
const MID_DIM_GAP_PERCENT = 0.6;
const TAB_GROUP_BORDER = 40;

class DrawUtils {
  static drawXIcon(g, xa, ya, offval = TIGHT_DIM_GAP_PERCENT) {
    let off = offval * g.sSqrDim;
    let xs = xa + off;
    let xe = xa + g.sSqrDim - off;
    let ys = ya + off;
    let ye = ya + g.sSqrDim - off;
    line(xs, ys, xe, ye);
    line(xe, ys, xs, ye);
  }

  static drawCross(g, xa, ya, offval = TIGHT_DIM_GAP_PERCENT) {
    let off = offval * g.sSqrDim;
    line(
      xa + g.sSqrDimOn2,
      ya + off,
      xa + g.sSqrDimOn2,
      ya + g.sSqrDim - off
    );
    line(
      xa + off,
      ya + g.sSqrDimOn2,
      xa + g.sSqrDim - off,
      ya + g.sSqrDimOn2
    );
  }
}

function getUnsecureHash() {
  let myStr =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  myStr += myStr + myStr;
  return myStr.substring(0, 10);
}

class FeatureComponent {
  constructor(x, y, size) {
    this.g = new ParentDefinedGeometry(x, y, size);
    this.id = getUnsecureHash();
    this.targetID = 'none';
    this.doCheckMouseOver = false;
    this.hasMouseOver = false;
    this.mouseOverData = 'none';
  }

  update(zoom, gp) {
    this.g.update(zoom, gp);
  }
}

class FeatureLabel extends FeatureComponent {
  constructor(x, y, data, size, action) {
    super(x, y, size);
    this.data = data;
    this.action = action;
    this.mode = 'idle';
  }

  display(zoom, cnv, strokeColor, fillColor) {
    textSize(myTextSize * zoom);
    let wa = this.calculateWidth(zoom);
    this.draw(zoom, cnv, strokeColor, fillColor, wa);
  }

  checkClicked(zoom) {
    return false;
  }

  checkMouseClick(zoom) {
    if (this.mode != 'busy') {
      if (this.checkClicked(zoom)) {
        this.mode = 'busy';
        this.action(this, this.g.sCart.x, this.g.sCart.y);
      }
    }
  }
}

class FeatureDataTextLabel extends FeatureLabel {
  constructor(x, y, data, size, action) {
    super(x, y, data, size, action);
  }

  calculateWidth(zoom) {
    textSize(myTextSize * zoom);
    let wa = textWidth(this.data) * TEXT_WIDTH_MULTIPLIER;
    if (wa == 0) {
      wa = this.g.sSqrDim;
    }
    return wa;
  }

  checkClicked(zoom) {
    let wa = this.calculateWidth(zoom);
    const waOn2 = wa / 2;
    const centerX = this.g.sCart.x; // Calculate the X coordinate of the center of the button
    const centerY = this.g.sCart.y + this.g.sSqrDimOn2; // Calculate the Y coordinate of the center of the button
    const distanceX = Math.abs(mouseX - centerX);
    const distanceY = Math.abs(mouseY - centerY);
    return distanceX < waOn2 && distanceY < this.g.sSqrDimOn2 * zoom;
  }

  draw(zoom, cnv, strokeColor, fillColor, width) {
    fill(fillColor);
    stroke(strokeColor);
    const won2 = width / 2;
    const x = this.g.sCart.x - won2;
    rect(x, this.g.sCart.y, width, this.g.sSqrDim);
    fill(strokeColor);
    noStroke();
    textAlign(CENTER, CENTER);
    text(this.data, x + won2, this.g.sCart.y + this.g.sSqrDimOn2); // Center the text within the rectangle
  }
}

class FeatureDataTextLabelTrigger extends FeatureDataTextLabel {
  checkMouseClick(zoom) {
    if (this.checkClicked(zoom)) {
      this.action(this, this.g.sCart.x, this.g.sCart.y);
    }
  }
}

class FeatureDataIDLabel extends FeatureDataTextLabel {
  constructor(x, y, data, size) {
    super(x, y, data, size, NOP);
  }

  checkClicked(zoom) {
    return false;
  }

  draw(zoom, cnv, strokeColor, fillColor, width) {
    fill(strokeColor);
    noStroke();
    textAlign(LEFT, TOP);
    textSize((myTextSize * zoom) / 2);
    text(
      this.data,
      this.g.sCart.x + this.g.sSqrDim * TIGHT_DIM_GAP_PERCENT,
      this.g.sCart.y + this.g.sSqrDim * MID_DIM_GAP_PERCENT
    );
  }
}

class FeatureUIButton extends FeatureComponent {
  constructor(label, x, y, size, action) {
    super(x, y, size);
    this.label = label;
    this.action = action;
  }
  // drawXIcon(xa, ya, offval = TIGHT_DIM_GAP_PERCENT) {
  //   let off = offval * this.g.sSqrDim;
  //   let xs = xa + off;
  //   let xe = xa + this.g.sSqrDim - off;
  //   let ys = ya + off;
  //   let ye = ya + this.g.sSqrDim - off;
  //   line(xs, ys, xe, ye);
  //   line(xe, ys, xs, ye);
  // }
  // drawCross(xa, ya, offval = TIGHT_DIM_GAP_PERCENT) {
  //   let off = offval * this.g.sSqrDim;
  //   line(
  //     xa + this.g.sSqrDimOn2,
  //     ya + off,
  //     xa + this.g.sSqrDimOn2,
  //     ya + this.g.sSqrDim - off
  //   );
  //   line(
  //     xa + off,
  //     ya + this.g.sSqrDimOn2,
  //     xa + this.g.sSqrDim - off,
  //     ya + this.g.sSqrDimOn2
  //   );
  // }

  display(zoom, cnv, strokeColor, fillColor) {
    fill(fillColor);
    stroke(strokeColor);
    square(this.g.sCart.x, this.g.sCart.y, this.g.sSqrDim);
    this.draw(this.g.sCart.x, this.g.sCart.y, zoom, cnv, strokeColor);
  }

  checkMouseClick(zoom) {
    let caller = false;
    if (this.g.checkMouseOver(mouseX, mouseY)) {
      this.action(this);
      caller = true;
    }
    return caller;
  }
}

class FeatureUIButtonClose extends FeatureUIButton {
  constructor(label, x, y, size, action) {
    super(label, x, y, size, action);
  }
  draw(xa, ya, zoom, cnv, textColor) {
    // this.drawXIcon(xa, ya);
    DrawUtils.drawXIcon(this.g, xa, ya);
  }
}

class FeatureUIButtonMove extends FeatureUIButton {
  constructor(label, x, y, size, action) {
    super(label, x, y, size, action);
  }
  draw(xa, ya, zoom, cnv, textColor) {
    // this.drawCross(xa, ya);
    DrawUtils.drawCross(this.g, xa, ya);

    
  }
}

class FeatureUIButtonResize extends FeatureUIButton {
  constructor(label, x, y, size, action) {
    super(label, x, y, size, action);
  }
  draw(xa, ya, zoom, cnv, textColor) {
    const ratio = MID_DIM_GAP_PERCENT;
    const offset = (this.g.sSqrDim * (1 - ratio)) / 2;
    const arrowSize = this.g.sSqrDim * ratio;
    line(xa + offset, ya + offset, xa + arrowSize, ya + offset);
    line(xa + offset, ya + offset, xa + offset, ya + arrowSize);
    line(
      xa + offset + arrowSize,
      ya + offset + arrowSize,
      xa + offset + arrowSize,
      ya + 2 * offset
    );
    line(
      xa + 2 * offset,
      ya + offset + arrowSize,
      xa + offset + arrowSize,
      ya + offset + arrowSize
    );
  }
}

class FeatureUIButtonLetterLabel extends FeatureUIButton {
  constructor(label, x, y, size, action) {
    super(label, x, y, size, action);
  }
  draw(xa, ya, zoom, cnv, textColor) {
    textSize(myTextSize * zoom);
    fill(textColor);
    noStroke();
    textAlign(CENTER, CENTER);
    text(this.label[0], xa + this.g.sSqrDimOn2, ya + this.g.sSqrDimOn2);
  }
}

class FeatureUIOutputButton extends FeatureUIButton {
  constructor(label, x, y, size, action) {
    super(label, x, y, size, action);
    this.connected = false;
    this.associatedConnector = null;
    this.hasMouseOver = false;
    this.mouseOverData = label;
  }

  update(zoom, x, y, w, h) {
    super.update(zoom, x, y, w, h);
    this.hasMouseOver = this.g.checkMouseOver(mouseX, mouseY);
  }

  checkMouseClick(zoom) {
    if (this.connected) {
      if (this.g.checkMouseOver(mouseX, mouseY)) {
        this.associatedConnector.markToDelete();
      }
    } else {
      return super.checkMouseClick(zoom);
    }
  }

  draw(xa, ya, zoom, cnv, textColor) {
    if (this.connected) {
      DrawUtils.drawXIcon(this.g, xa, ya, LOW_MID_DIM_GAP_PERCENT);
    } else {
      textSize(myTextSize * zoom);
      fill(textColor);
      noStroke();
      textAlign(CENTER, CENTER);
      text(this.label[0], xa + this.g.sSqrDimOn2, ya + this.g.sSqrDimOn2);
    }

    if (this.hasMouseOver) {
      textSize(myTextSize * zoom);
      fill(textColor);
      noStroke();
      text(this.mouseOverData, xa + this.g.sSqrDimOn2, ya - this.g.sSqrDim);
    }
  }
}

class FeatureUIInputButton extends FeatureUIOutputButton {}
