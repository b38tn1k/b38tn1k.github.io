// core/debug.js
export const Debug = {
  enabled: true, // master switch

  // Optional subsystem toggles
  flags: {
    controls: false,
    renderer: true,
    system: false,
    player: false,
    level: true,
  },

  log(subsystem, ...args) {
    if (this.enabled && this.flags[subsystem]) {
      console.log(`[${subsystem.toUpperCase()}]`, ...args);
    }
  },

  toggleAll(state) {
    this.enabled = state;
  },

  toggle(subsystem, state) {
    this.flags[subsystem] = state;
  },

  drawRainbowBar(layer, tileSize = 32) {
    layer.clear();
    layer.noStroke();
    const width = layer.width || 320;
    const height = tileSize;

    if (typeof layer.colorMode === 'function') layer.colorMode(layer.HSB, 360, 100, 100);
    for (let x = 0; x < width; x++) {
      const hue = (x / width) * 360;
      layer.fill(hue, 100, 100);
      layer.rect(x, 100, 1, height);
    }
    if (typeof layer.colorMode === 'function') layer.colorMode(layer.RGB, 255, 255, 255);
  }
};