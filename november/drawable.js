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
    this.g.imageMode(CORNER);
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

  randomTile(tileset, length, height, chance=1.0, valley=0.0) {
    let resX = tileset.width/length;
    let resY = tileset.height/height;
    let valleyWidth = this.g.width * valley;
    let valleyXS = (this.g.width/2) - (valleyWidth/2);
    let valleyXE = (this.g.width/2) + (valleyWidth/2);
    for (let x = 0; x < this.g.width; x += resX){
      if (x < valleyXS || x > valleyXE) {
        for (let y = 0; y < this.g.height; y += resY) {
          let valX = int(random(length));
          let valY = int(random(height));
          if (random() <= chance) {
            this.g.image(tileset, x, y, resX, resY, valX*resX, valY*resX, resX, resY);
          }
        }
      }
    }
  }

  border(tileset, length, height) {
    let resX = tileset.width/length;
    let resY = tileset.height/height;
    let hResY = resY/4;
    let hResX = resY/2;
    let borderL = 1;
    let borderR = 1;
    let threshold = 2;
    for (let y = -hResY; y < this.g.height; y+= hResY) {
      // borderL = 4;
      // borderR = 4;
      for (let x = borderL * hResX; x >= -hResX; x -= hResX) {
        this.g.image(tileset, x, y);
      }
      for (let x = this.g.width - ((borderR + 2) * hResX); x < this.g.width; x += hResX) {
        this.g.image(tileset, x, y);
      }
      if (random() > 0.5 ) {
        borderR += 1
      } else {
        borderR -= 1;
      }
      if (random() > 0.5 ) {
        borderL += 1
      } else {
        borderL -= 1;
      }
      borderL = constrain(borderL, 0, threshold);
      borderR = constrain(borderR, 0, threshold);
    }
  }

  drawPath(tileset, length, height, width=0.3){
    let resX = tileset.width/length;
    let resY = tileset.height/height;
    let valX = 0;
    let valY = 0;
    let actualWidth = this.g.width * width;
    actualWidth = max(2 * resX, actualWidth);
    let startX = (this.g.width / 2 - 1) - (actualWidth/2);
    startX = int(startX / resX + 1) * resX;
    let endX = (this.g.width / 2) + (actualWidth/2);
    endX = int(endX / resX + 1) * resX;
    let endTrig = endX - resX;
    for (let x = startX; x < endX; x+= resX) {
      if (x >= endTrig) {
        valX = 2;
      }
      for (let y = 0; y < this.g.height; y+= resY) {
        this.g.image(tileset, x, y, resX, resY, valX*resX, valY*resX, resX, resY);
      }
      valX = 1;
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
