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

  selfDescribe() {
    let info = {};
    info['this'] = this.constructor.name;
    info['subclasses'] = {};
    info['subclasses'][this.g.constructor.name] = this.g.selfDescribe();
    info['properties'] = {};
    Object.keys(this).forEach((key) => {
      if (this[key] instanceof p5.Vector) {
        info['properties'][key] = {
          x: this[key].x,
          y: this[key].y,
          z: this[key].z
        };
      } else if (key == 'g') {
        info['properties'][key] = this.g.constructor.name;
      } else if (key == 'action') {
        1;
      } else if (key == 'associatedConnector') {
        1;
      } else {
        info['properties'][key] = this[key];
      }
    });
    return info;
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
    this.draw(zoom, cnv, strokeColor, fillColor);
  }

  update(zoom, gp) {
    super.update(zoom, gp);
    this.g.setBDimsWidth(myTextSize, TEXT_WIDTH_MULTIPLIER, this.data);
  }

  checkClicked(zoom) {
    return false;
  }

  mouseClickActionHandler(zoom) {
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

  checkClicked(zoom) {
    this.g.setBDimsWidth(myTextSize, TEXT_WIDTH_MULTIPLIER, this.data);
    return this.g.checkMouseOver(mouseX, mouseY);
  }

  draw(zoom, cnv, strokeColor, fillColor) {
    fill(fillColor);
    stroke(strokeColor);
    rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);
    fill(strokeColor);
    noStroke();
    textAlign(CENTER, CENTER);
    text(
      this.data,
      this.g.sCart.x + this.g.sDims.w / 2,
      this.g.sCart.y + this.g.sSqrDimOn2
    ); // Center the text within the rectangle
  }
}

class FeatureDataTextLabelTrigger extends FeatureDataTextLabel {
  mouseClickActionHandler(zoom) {
    if (this.checkClicked(zoom)) {
      this.action(this, this.g.sCart.x, this.g.sCart.y);
    }
  }
}

class FeatureDataIDLabel extends FeatureDataTextLabel {
  constructor(x, y, data, size) {
    super(x, y, data, size, NOP);
    this.g.static = false;
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
