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
      this.sSqrDim = size;
      this.sSqrDimOn2 = size/2;
      this.bOffset = createVector(0, 0);
      if (x == 1) {
        this.bOffset.x = -size;
      }
      if (x == 0.5) {
        this.bOffset.x = -this.sSqrDimOn2;
      }
      if (y == 1) {
        this.bOffset.y = -size;
      }
    }
  
    update(zoom, gp){ 
      this.sSqrDim = this.bSqrDim * zoom;
      this.sSqrDimOn2 = this.sSqrDim / 2;
      let xa = gp.sCart.x + this.bCart.x * gp.sDims.w + this.bOffset.x * zoom;
      let ya = gp.sCart.y + this.bCart.y * gp.sDims.h + this.bOffset.y * zoom;
      this.sCart = createVector(xa, ya);
    }

    checkMouseOver(mouseX, mouseY) {
        let inXRange = mouseX >= this.sCart.x && mouseX <= this.sCart.x + this.sSqrDim;
        let inYRange = mouseY >= this.sCart.y && mouseY <= this.sCart.y + this.sSqrDim;
        return inXRange && inYRange;
    }
    
  
    getCenter() {
      const clickY = this.sCart.y + this.sSqrDimOn2;
      const clickX = this.sCart.x + this.sSqrDimOn2;
      return createVector(clickX, clickY);
    }
  }

  // this class is currently unudes but should be used with some FeatureDataTextLabel classes
  class ParentDefinedGeometryOblong extends ParentDefinedGeometry {
    constructor(x, y, height, data, textSizeMultiplier, myTextSize) {
      super(x, y, height);
      this.data = data;
      this.textSizeMultiplier = textSizeMultiplier;
      this.myTextSize = myTextSize;
      this.width = this.calculateWidth();
    }
  
    calculateWidth() {
      textSize(this.myTextSize);
      let width = textWidth(this.data) * this.textSizeMultiplier;
      if (width == 0) {
        width = this.sSqrDim;
      }
      return width;
    }
  
    checkClicked(mouseX, mouseY) {
      const halfWidth = this.width / 2;
      const centerX = this.sCart.x;
      const centerY = this.sCart.y + this.sSqrDimOn2;
      const distanceX = Math.abs(mouseX - centerX);
      const distanceY = Math.abs(mouseY - centerY);
      return distanceX < halfWidth && distanceY < this.sSqrDimOn2;
    }
    
  }
  