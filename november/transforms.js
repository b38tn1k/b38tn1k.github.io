class Transforms {
  constructor(isTouchDevice) {
    this.isTouchDevice = isTouchDevice;
    if (this.isTouchDevice === true){
      this.w = max(width, height);
      this.h = min(width, height);
      this.rot = (width < height ? radians(90) : 0);
      this.tx = (width < height ? height/2 : width/2);
      this.ty = (width < height ?  (-width)/2 : height/2);
    } else {
      this.w = width;
      this.h = height;
      this.rot = 0;
      this.tx = width/2;
      this.ty = height/2;
    }
  }

  get fullScreenGraphicDims() {
    return [this.w, this.h, this.rot, this.tx, this.ty];
  }
}
