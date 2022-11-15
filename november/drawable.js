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
    let widthInTiles = ceil((this.g.width) / resX);
    let tileOverlapX = 2;
    let choice = 0;
    let borderWidth = int(ceil(0.07 * widthInTiles)) * tileOverlapX;
    let hResY = resY/4;
    let hResX = resX/2;
    let borderL = 1;
    let borderR = 1;
    let xL = -hResX;
    let xR = (widthInTiles - 1) * resX;
    let rowL, rowR;
    for (let y = -hResY; y < this.g.height; y+= hResY) {
      choice = floor(random(length));
      rowL = ceil(random(borderWidth));
      for (let x = xL + rowL * hResX; x > xL; x-=hResX) {
        choice = floor(random(length));
        this.g.image(tileset, x, y, resX, resY, choice*resX, 0, resX, resY);
      }
      rowR = ceil(random(borderWidth));
      for (let x = xR - rowR * hResX; x < xR; x+= hResX) {
        choice = floor(random(length));
        this.g.image(tileset, x, y, resX, resY, choice*resX, 0, resX, resY);
      }
      this.g.image(tileset, xL, y, resX, resY, choice*resX, 0, resX, resY);
      this.g.image(tileset, xR, y, resX, resY, choice*resX, 0, resX, resY);
    }
  }

  drawPath(tileset, length, height, final=false){
    let resX = tileset.width/length;
    let resY = tileset.height/height;
    let center = resX * floor((this.g.width/2)/resX);
    let even = (floor(this.g.width/resX) % 2 == 0);
    let valX = 0;
    let x = center;
    let tempCanvas;
    if (even){
      tempCanvas = createGraphics(4 * resX, resY);
      x -= 2 * resX;
      tempCanvas.image(tileset, 0, 0, resX, resY, 0, 0, resX, resY);
      tempCanvas.image(tileset, resX, 0, resX, resY, resX, 0, resX, resY);
      tempCanvas.image(tileset, 2 * resX, 0, resX, resY, resX, 0, resX, resY);
      tempCanvas.image(tileset, 3 * resX, 0, resX, resY, 2* resX, 0, resX, resY);
    } else {
      tempCanvas = createGraphics(3 * resX, resY);
      tempCanvas.image(tileset, 0, 0, resX, resY, 0, 0, resX, resY);
      tempCanvas.image(tileset, resX, 0, resX, resY, resX, 0, resX, resY);
      tempCanvas.image(tileset, 2 * resX, 0, resX, resY, 2*resX, 0, resX, resY);
      x -= resX;
    }
    for (let y = 0; y < this.g.height + resY; y+= resY) {
      this.g.image(tempCanvas, x, y);
    }
    let bb;
    if (even) {
      if (final == false) {
        this.g.image(tileset, center - resX, 0, resX, resY, resX * 3, 0, resX, resY);
        this.g.image(tileset, center, 0, resX, resY, resX * 3, 0, resX, resY);
      }
      bb = [center - resX, 0, center + resX, resY];
    } else {
      if (final == false) {
        this.g.image(tileset, center, 0, resX, resY, resX * 3, 0, resX, resY);
      }
      bb = [center, 0, center + resX, resY];
    }
    return bb;
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
      if (this.cFrame >= this.frameCount) {
        this.cFrame = 0;
      }
    }
  }
}
