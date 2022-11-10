class SpriteCollection {
  constructor(x, y, playable=false) {
    this.x = x;
    this.y = y;
    this.userControllable = playable;
    this.movementSpeed = 1;
    this.collection = [];
    this.pointer = 0;
    this.layer = G.gLayers.getLayer('sprites', true, 100);
    this.layer.clearable = true;
    this.layer.g.imageMode(CENTER);
    this.current;
    this.playAni = true;
  }
  addAnimation(frames, spriteSheet, stopFrames=[0], moveFrames = 0) {
    let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
    let newSprite = new Drawable(w, h, r, this.x, this.y, 100);
    newSprite.setAnimation(frames, spriteSheet, stopFrames, moveFrames);
    this.collection.push(newSprite);
  }
  setCollectionRate(num){
    for (let i = 0; i < this.collection.length; i++) {
      this.collection[i].setRate(num);
    }
  }
  setRate(num){
    this.collection[this.pointer].setRate(num);
  }
  play() {
    this.playAni = true;
    this.current.play = this.playAni;
  }
  stop() {
    this.playAni = false;
    this.current.play = false;
  }
  changeSequence(num, thenStop=false) {
    if (num < this.collection.length) {
      this.pointer = num;
      this.current = this.collection[this.pointer];
      this.current.play = this.playAni;
      this.current.update();
      this.current.stopAtOne = true;
      if (thenStop == true) {
        this.current.stopAtOne = true;
      }
    }
  }
  update(dialog, input=G.inputs) {
    this.current = this.collection[this.pointer];
    if (this.userControllable == true) {
      if (input.on == true && dialog.pauseForOptions == false) {
        this.current.play = true;
        let uv = G.inputs.getUnitVectorFromOrigin();
        if (this.current.isMoveFrame() == true) {
          this.current.tx += uv[0] * this.movementSpeed;
          this.current.ty += uv[1]  * this.movementSpeed;
        }
      } else {
        this.current.stopAtOne = true;
      }
    } else {
      // this.current.play = this.playAni;
    }
    this.x = this.current.tx;
    this.y = this.current.ty;
    this.current.update();
  }
  draw() {
    // this.layer.g.clear();
    this.layer.g.image(this.current.g, this.current.tx, this.current.ty);
  }
}
