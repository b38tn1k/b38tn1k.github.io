class Dimensions {
  constructor() {
    this.isTouchDevice = this.checkIsTouchDevice();
    this.w = width;
    this.h = height;
    this.cx = width/2;
    this.cy = height/2;
    this.swarmSize = min(20, ceil((width * height) / (18000)));
    this.rot = 0;
  }

  getScrollTransform(x, y){
    return [x, y];
  }

  checkIsTouchDevice() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }

  get fullScreenGraphicDims() {
    return [this.w, this.h, this.rot, this.cx, this.cy];
  }
}
