class Scroller1D{
  constructor(upper, lower, rUpper, rLower, height) {
    this.y = 0;
    this.target;
    this.scrollDir = 0; // -1, 0 , 1;
    this.upper = int(upper * height);
    this.lower = int(lower * height);
    this.resetLower = int(rLower * height);
    this.resetUpper = int(rUpper * height);
  }

  attachTarget(target) {
    this.target = target;
  }

  update() {
    if (this.target.y <= this.upper) { //coords hurting my brain :-P top of the screen is small Y
      this.scrollDir = 1;
    } else if (this.target.y >= this.lower) {
      this.scrollDir = (this.y > 0) ? -1 : 0;
    } else if (this.target.y < this.resetLower && this.target.y > this.resetUpper) {
      this.scrollDir = 0;
    }
    this.y = max(this.y, 0);
    this.y += this.scrollDir;
  }
};
