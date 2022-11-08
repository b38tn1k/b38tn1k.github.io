class InputHandler {
  constructor(dims, offX=100, offY=100) {
    this.originY = dims.h - offX;
    if (dims.isTouchDevice == true) {
      this.originX = dims.w - offY;
    } else {
      this.originX = dims.cx;
    }
    this.x = 0;
    this.y  = 0;
    this.on = false;
    this.prevOn = false;
    this.listenerOn = false;
  }
  setChangeListener() {
    this.listenerOn = true;
    this.prevOn = this.on;
  }
  hasChanged() {
    let result = true;
    if (this.listenerOn == true) {
      if (this.prevOn == this.on) {
        result = false;
      } else {
        result = true;
        this.listenerOn = false;
      }
    } else {
      result = true;
    }
    return result;
  }
  update() {
    this.x = mouseX;
    this.y = mouseY;
    this.on = mouseIsPressed;
  }
  angleTo(x, y) {
    let dx = x - this.x;
    let dy = y - this.y;
    return atan2(dy, dx);
  }
  getUnitVectorFromOrigin() {
    let i = -1 * cos(this.angleTo(this.originX, this.originY));
    let j = -1 * sin(this.angleTo(this.originX, this.originY));
    return [i, j];
  }
};
