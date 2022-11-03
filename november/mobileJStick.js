class MobileJStick {
  constructor(w, h) {
    this.layer = 0;
    this.drawable = true;
    this.g = createGraphics(w, h);
    this.bg = createGraphics(w, h);
    this.fg = createGraphics(w, h);
    this.jsX = 0.85*w;
    this.jsY = 0.8*h;
    this.jsR = 0.3 * min(w, h);
    this.jsRm = 0.5 * this.jsR;
    this.bg.fill(gColors[3]);
    this.bg.noStroke();
    this.bg.circle(this.jsX, this.jsY, this.jsR); // make this images eventually maybe
    this.fg.fill(gColors[4]);
    this.fg.noStroke();
    this.fg.circle(this.jsX, this.jsY, this.jsRm);

  }
  update() {
    this.g.image(this.bg, 0, 0);
    if (touches.length > 0) {
      console.log(touches); // will need to transform
    }
    this.g.image(this.fg, 0, 0);
  }
};
