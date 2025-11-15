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
    if (!this.currentsLookup) return;
    const list = Array.from(this.currentsLookup.values());
    DrawTools.drawCurrents(
      this.p,
      layer,
      this.mapTransform,
      list,
      opts
    );
  },

  drawWorldBoundary(layer) {
    DrawTools.drawWorldBoundary(
      this.p,
      layer,
      this.mapTransform
    );
  }

};