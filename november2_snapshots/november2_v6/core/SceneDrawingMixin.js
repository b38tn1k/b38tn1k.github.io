import * as DrawTools from './staticDrawingTools.js';

export const SceneDrawingMixin = {

  drawTerrainOrganic(layer, opts = {}) {
    if (!this.levelData) return;
    DrawTools.drawOrganicBlockingBackground(
      this.p,
      layer,
      this.mapTransform,
      this.levelData.tiles,
      opts
    );
  },

  drawTerrainBlocking(layer, opts = {}) {
    if (!this.levelData) return;
    DrawTools.drawBlockingBackgroundTransformed(
      this.p,
      layer,
      this.mapTransform,
      this.levelData.tiles,
      opts
    );
  },

  drawCurrentsLayer(layer, opts = {}) {
    // { skipGenerated: true } what if this?
    if (!this.currentsLookup) return;
    let myList = Array.from(this.currentsLookup.values());
    if (opts.skipGenerated) {
      myList = myList.filter(c => c.legend !== 'border' && c.legend !== 'tileEdge' && c.legend !== 'ambient');
    }
    DrawTools.drawCurrents(
      this.p,
      layer,
      this.mapTransform,
      myList
    );
  },

  drawWorldBoundary(layer) {
    DrawTools.drawWorldBoundary(
      this.p,
      layer,
      this.mapTransform
    );
  },

  drawWorldGrid(layer) {
    console.log(this.mapTransform);
    const pix = this.mapTransform.tileSizePx;
    const og = this.mapTransform.originPx;
    layer.noFill();
    layer.strokeWeight(1);
    layer.stroke(255);
    for (let i = 0; i < this.mapTransform.cols; i++) {
      for (let j = 0; j < this.mapTransform.rows; j++) {
        layer.square(og.x + i * pix, og.y + j * pix, pix);
      }
    }
  }


};