function newDrawableFromImage(image){
  let w = image.width;
  let h = image.height;
  let nd = new Drawable(w, h);
  nd.g.image(image, 0, 0)
  return nd;
}

class Drawable {
  constructor(w, h, r=0, tx=0, ty=0, level=0) {
    this.rot = r;
    this.tx = tx;
    this.ty = ty;
    this.a = 0;
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
    this.static = false;
    this.repeatable = false;
  }

  setStatic() {
    this.static = true;
  }

  setRepeatable() {
    this.repeatable = true;
  }

  setClearable() {
    this.clearable = true;
  }

  setRate(num) {
    this.rate = num;
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

  randomTile(tileset, length, height, chance=1.0) {
    let resX = tileset.width/length;
    let resY = tileset.height/height;
    for (let x = 0; x < this.g.width; x += resX){
      for (let y = 0; y < this.g.height; y += resY) {
        let valX = int(random(length));
        let valY = int(random(height));
        if (random() <= chance) {
          this.g.image(tileset, x, y, resX, resY, valX*resX, valY*resX, resX, resY);
        }

      }
    }
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
        this.cFrame = this.stopFrames[0]; // stop frame default, others may be transitionalable
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
