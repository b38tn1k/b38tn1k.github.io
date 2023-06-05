const TEXT_WIDTH_MULTIPLIER = 1.5;
const TIGHT_DIM_GAP_PERCENT = 0.2;
const LOW_MID_DIM_GAP_PERCENT = 0.4;
const MID_DIM_GAP_PERCENT = 0.6;
const TAB_GROUP_BORDER = 40;

class Geometry {
  constructor(x, y, width, height) {
    this.bCart = createVector(x, y); // board position
    this.sCart = createVector(x, y); // screen position
    this.bDims = { w: width, h: height }; // board dims
    this.sDims = { w: 0, h: 0 }; // screen dims
    this.sMids = { w: 0, h: 0 }; // screen middle
    this.aDims = { w: width, h: height }; //animation dims
    this.manualOnScreen = false; // force is on screen with 'true'
  }

  clearBDims() {
    // set to 0 for animation if required
    this.bDims = { w: 0, h: 0 };
  }

  get isOnScreen() {
    // big boolean in screen space to see if object is onscreen
    return (
      (this.sCart.x < windowWidth &&
        this.sCart.x + this.sDims.w > 0 &&
        this.sCart.y < windowHeight &&
        this.sCart.y + this.sDims.h > 0) ||
      this.manualOnScreen // and the manual force
    );
  }

  update(zoom) {
    this.sCart = boardToScreen(this.bCart.x, this.bCart.y);
    this.sDims.w = this.bDims.w * zoom;
    this.sDims.h = this.bDims.h * zoom;
    this.sMids.w = this.sDims.w >> 1;
    this.sMids.h = this.sDims.h >> 1;
  }
}

class ParentDefinedGeometry {
    constructor(x, y, size) {
      this.bCart = createVector(x, y);
      this.sCart = createVector(0, 0);
      this.bSqrDim = size;
      this.static = true;
      this.sSqrDim = size;
      this.sSqrDimOn2 = size/2;
      this.bDims = {w: this.bSqrDim, h: this.bSqrDim};
      this.sDims = {w: this.sSqrDim, h: this.sSqrDim};
      this.bOffset = createVector(0, 0);
      this.calculateOffsets();
    }

    setBDimsWidth(myTextSize, textWidthMultiplier, data) {
      textSize(myTextSize);
      let wa = textWidth(data) * textWidthMultiplier;
      
      if (this.bDims.w != wa) {
        wa = max(wa, this.bSqrDim);
        this.bDims.w = wa;
        this.calculateOffsets();
      }
    }

    calculateOffsets() {
      if (this.bCart.x === 1.0) {
        this.bOffset.x = -this.bDims.w;
      }
      if (this.bCart.x === 0.5) {
        this.bOffset.x = -this.bDims.w/2;
      }
      if (this.bCart.y === 1.0) {
        this.bOffset.y = -this.bDims.h;
      }
    }
  
    update(zoom, gp){ 
      this.sDims.w = this.bDims.w * zoom;
      this.sDims.h = this.bDims.h * zoom;
      this.sSqrDim = this.sDims.h;
      this.sSqrDimOn2 = this.sSqrDim/2;
      if (this.static == true) {
        const xs = gp.sCart.x + (this.bCart.x * gp.aDims.w + this.bOffset.x) * zoom;
        const ys = gp.sCart.y + (this.bCart.y * gp.aDims.h + this.bOffset.y) * zoom;
        this.sCart = createVector(xs, ys);
      } else {
        const xd = gp.sCart.x + this.bCart.x * gp.sDims.w + this.bOffset.x * zoom;
        const yd = gp.sCart.y + this.bCart.y * gp.sDims.h + this.bOffset.y * zoom;
        this.sCart = createVector(xd, yd);
      }
    }

    checkMouseOver(mouseX, mouseY) {
        let inXRange = mouseX >= this.sCart.x && mouseX <= this.sCart.x + this.sDims.w;
        let inYRange = mouseY >= this.sCart.y && mouseY <= this.sCart.y + this.sDims.h;
        return inXRange && inYRange;
    }
    
    getCenter() {
      const clickY = this.sCart.y + this.sSqrDimOn2;
      const clickX = this.sCart.x + this.sSqrDimOn2;
      return createVector(clickX, clickY);
    }
  }