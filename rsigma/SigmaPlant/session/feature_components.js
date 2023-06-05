const TEXT_WIDTH_MULTIPLIER = 1.5;
const TIGHT_DIM_GAP_PERCENT = 0.2;
const LOW_MID_DIM_GAP_PERCENT = 0.4;
const MID_DIM_GAP_PERCENT = 0.6;
const TAB_GROUP_BORDER = 40;

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
