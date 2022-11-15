class LayerHandler {
  constructor (dims) {
    let [w, h, r, tx, ty] = dims.fullScreenGraphicDims;
    this.dims = dims;
    this.layers = [];
    this.layerMap = {};
  }

  newLayer(level, name, w=0, h=0, r=0, tx=0, ty=0, res=-1) {
    if (w == 0) {
      [w, h, r, tx, ty] = this.dims.fullScreenGraphicDims;
    }
    if (res != -1) {
      w = int((w/res) + 1) * res;
      h = int((h/res) + 1) * res;
      tx = w/2;
      ty = h/2;
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

  getLayerNames() {
    let names = [];
    for (key in this.layerMap) {
      names.push(key, this.layerMap[key]);
    }
    return names;
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

  getLayer(name, force=false, level=0, res=-1) {
    let result = -1;
    if (name in this.layerMap) {
      result = this.layers[this.layerMap[name]];
    }
    if (force == true && result == -1) {
      result = this.newLayer(level, name, 0, 0, 0, 0, 0, res)
    }
    return result;
  }

  clear() {
    clear();
    for (let i = 0; i < this.layers.length; i++) {
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
