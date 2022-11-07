class Drawable {
  constructor(w, h, r, tx, ty, level) {
    this.rot = r;
    this.tx = tx;
    this.ty = ty;
    this.g = createGraphics(w, h);
    this.level = level;
    this.clearable = false;
    this.animate = false;
    this.rate = 0.2;
    this.frames = [];
    this.cFrame = 0;
    this.frameCount = 0;
    this.fWidth = 0;
    this.spriteSheet;
    this.stopAtOne = false;
    this.play = false;
    this.stopFrames;
    this.moveFrames;
    this.tiled = false;
  }

  setClearable() {
    this.clearable = true;
  }

  clear() {
    if (this.clearable == true) {
      this.g.clear();
    }
  }

  isMoveFrame() {
    return this.moveFrames.indexOf(int(this.cFrame)) != -1;
  }

  setAnimation(frames, spriteSheet, stopFrames=[0], moveFrames = 0) {
    this.setClearable();
    if (moveFrames == 0) {
      this.moveFrames = [];
      for (let i = 0; i <= frames; i++) {
        this.moveFrames.push(i);
      }
    } else {
      this.moveFrames = moveFrames;
    }
    this.stopFrames = stopFrames;
    this.frameCount = frames;
    this.spriteSheet = spriteSheet;
    this.animate = true;
    this.fWidth = spriteSheet.width / frames;
    let frameHeight = spriteSheet.height;
    this.g = createGraphics(this.fWidth, frameHeight);
    this.update();
  }

  setTileAble(tileCnv) {
    this.tiled = true;
    for (let i = 0; i < this.g.width; i+=tileCnv.g.width) {
      for (let j = 0; j < this.g.height; j+=tileCnv.g.height) {
        this.g.image(tileCnv.g, i, j);
      }
    }
  }

  update() {
    if (this.animate == true) {
      this.g.clear();
      this.g.image(this.spriteSheet, -1 * int(this.cFrame) * this.fWidth, 0);
      if (this.stopAtOne == true && (this.stopFrames.indexOf(int(this.cFrame)) != -1)) {
        this.play = false;
        this.stopAtOne = false;
      }
      if (this.play == true) {
        this.cFrame += this.rate;
      }
      if (this.cFrame > this.frameCount) {
        this.cFrame = 0;
      }
    }
  }
}
