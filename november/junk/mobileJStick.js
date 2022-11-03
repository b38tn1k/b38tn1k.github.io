class MobileJStick {
  constructor(w, h) {
    this.layer = 0;
    this.drawable = true;
    this.g = createGraphics(w, h);
    this.bg = createGraphics(w, h);
    this.fg = createGraphics(w, h);
    let jsX = 0.85*w;
    let jsY = 0.8*h;
    let jsR = 0.3 * min(w, h);
    let jsRm = 0.5 * jsR;
    this.bg.fill(gColors[3]);
    this.bg.noStroke();
    this.bg.circle(jsX, jsY, jsR); // make this images eventually maybe
    this.fg.fill(gColors[4]);
    this.fg.noStroke();
    this.fg.circle(jsX, jsY, jsRm);
  }
  update() {
    this.g.image(this.bg, 0, 0);
    if (touches.length > 0) {
      console.log(touches); // will need to transform
    }
    this.g.image(this.fg, 0, 0);
  }
};
