class InputHandler {
  constructor() {
    this.x = 0;
    this.y  = 0;
    this.on = false;
  }
  update() {
    this.x = mouseX;
    this.y = mouseY;
    this.on = mouseIsPressed;
  }
  angleTo(x, y) {
    return gTransforms.angleTo(x, y, this.x, this.y);
  }
};
