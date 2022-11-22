class SpriteCollection {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.collection = [];
    this.tags = {};
    this.pointer = 0;
    this.layer = G.graphLayers.getLayer('sprites', true, 100);
    this.layer.clearable = true;
    this.layer.g.imageMode(CENTER);
    this.layer.g.textFont(G.loaders['font']);
    this.textColor = G.colors[0];
    this.bgColor = G.colors[2];
    this.fontSize = 12;
    this.layer.g.textSize(this.fontSize);
    this.layer.g.textLeading(this.lineSpacing * this.fontSize);
    this.layer.g.textAlign(LEFT, TOP);
    this.current;
    this.playAni = true;
  }
  shutDown() {
    for (let i = 0; i < this.collection.length; i++) {
      this.collection[i].shutDown();
    }
    this.collection = [];
    this.layer = null;
    this.collection = null;

  }
  addAnimation(frames, spriteSheet, tag = '', stopFrames=[0], moveFrames=0) {
    this.tags[tag] = this.collection.length;
    let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
    let newSprite = new Drawable(w, h, r, this.x, this.y, 100);
    newSprite.setAnimation(frames, spriteSheet, stopFrames, moveFrames);
    this.collection.push(newSprite);
    if (this.collection.length == 1){
      this.current = this.collection[0];
    }
  }
  refreshLayout(x, y){
    this.current.tx = x;
    this.current.ty = y;
    this.x = x;
    this.y = y;
    this.layer = G.graphLayers.getLayer('sprites', true, 100);
    this.layer.clearable = true;

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
  playAll(num=0.4) {
    for (let i = 0; i < this.collection.length; i+= 1) {
      this.collection[i].play = true;
    }
  }
  stop() {
    this.playAni = false;
    this.current.play = false;
  }
  chooseSequence(tag) {
    let changed = false;
    if (tag in this.tags) {
      if (this.tags[tag] != this.pointer) {
        changed = true;
        let tx = this.current.tx;
        let ty = this.current.ty;
        this.changeSequence(this.tags[tag]);
        this.current.tx = tx;
        this.current.ty = ty;
      }
    }
    return changed;
  }
  changeSequence(num, thenStop=false, continueAni=false) {
    if (num < this.collection.length) {
      this.pointer = num;
      let tempFrame = this.current.cFrame;
      this.current = this.collection[this.pointer];
      this.current.cFrame = tempFrame;
      this.current.play = this.playAni;
      this.current.update();
      if (thenStop == true) {
        this.current.stopAtOne = true;
      }
    } else {
      console.log('oops - missing sequence')
    }
  }
  update(none) {
    this.current = this.collection[this.pointer];
    this.x = this.current.tx;
    this.y = this.current.ty;
    this.current.update();
  }
  draw() {
    // this.layer.g.clear();
    this.layer.g.image(this.current.g, this.current.tx, this.current.ty);
  }
};
