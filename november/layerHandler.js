class LayerHandler {
  constructor (dims) {
    let [w, h, r, tx, ty] = dims.fullScreenGraphicDims;
    this.dims = dims;
    this.layers = [];
    this.layerMap = {};
  }

  newLayer(level, name, w=0, h=0, r=0, tx=0, ty=0) {
    if (w == 0) {
      [w, h, r, tx, ty] = this.dims.fullScreenGraphicDims;
    }
    let newLayer = new Drawable(w, h, r, tx, ty, level);
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
    for (let i = 0; i < this.layers.length; i++) {
      console.log(i, this.layers[i], this.getLayerName(i));
      this.layers[i].clear();
    }
  }

  draw() {
    for (let i = 0; i < this.layers.length; i++) {
      push();
      rotate(this.layers[i].rot);
      translate(this.layers[i].tx, this.layers[i].ty);
      image(this.layers[i].g, 0, 0);
      pop();
    }
  }
}
