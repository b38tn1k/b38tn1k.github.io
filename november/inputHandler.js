class InputHandler {
  constructor(Ox, Oy) {
    this.x = 0;
    this.y  = 0;
    this.originX = Ox;
    this.originY = Oy;
    this.on = false;
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
