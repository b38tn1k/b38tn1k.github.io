class ClickableSprite extends SpriteCollection {
  constructor(x, y) {
    super(x, y, true);
    this.clickable = true;
    this.bbox = [];
    this.active = false;
  }

  init() {
    let w = this.current.fWidth;
    let x = this.current.tx;
    let y = this.current.ty;
    this.bbox = [x - w/2, y - w/2, x + w/2, y + w/2];
  }

  update() {
    super.update();
    if (this.active == true) {
      this.current.tx = mouseX;
      this.current.ty = mouseY;
      let w = this.current.fWidth;
      let x = this.current.tx;
      let y = this.current.ty;
      this.bbox = [x - w/2, y - w/2, x + w/2, y + w/2];
    }
  }

  draw() {
    super.draw();
  }
}
