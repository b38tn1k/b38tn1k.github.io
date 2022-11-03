class Drawable {
  constructor(w, h, r, tx, ty) {
    this.rot = r;
    this.tx = tx;
    this.ty = ty;
    this.g = createGraphics(w, h);
  }
}
