class LayerHandler {
  constructor (tf) {
    let [w, h, r, tx, ty] = tf.fullScreenGraphicDims;
    this.cx = w/2;
    this.cy = h/2;
    this.w = w;
    this.h = h; // these ones are sorta useful for gen stuff / playing
    this.base = new Drawable(w, h, r, tx, ty);
    this.layers = [];
    this.layerMap = {};
  }

  newLayer(level, name, w=0, h=0, r=0, tx=0, ty=0) {
    if (w == 0) {
      w=this.base.g.width;
      h=this.base.g.height;
      r=this.base.rot;
    }
    let newLayer = new Drawable(w, h, r, tx, ty);
    if (level > this.layers.length) {
      this.layerMap[name] = this.layers.length;
      this.layers.push(newLayer);
    } else { // insert layer at level and update the layerMap!!');
      for (key in this.layerMap) {
        if (this.layerMap[key] >= level) {
          this.layerMap[key] += 1;
        }
      }
      this.layers.splice(level, 0, newLayer);
      this.layerMap[name] = level;
    }
    return this.getLayer(name);
  }

  getLayerName(index) {
    let name = 'unk';
    for (key in this.layerMap) {
      if (this.layerMap[key] == index) {
        name = key;
      }
    }
    return name;
  }

  getLayer(name) {
    return this.layers[this.layerMap[name]];
  }

  clear() {
    this.base.g.clear();
  }

  draw() {
    for (let i = 0; i < this.layers.length; i++) {
      this.base.g.image(this.layers[i].g, this.layers[i].tx, this.layers[i].ty);
    }
    push();
    rotate(this.base.rot);
    translate(this.base.tx, this.base.ty);
    image(this.base.g, 0, 0);
    pop();
  }
}
