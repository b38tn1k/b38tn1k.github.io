export class BaseScene {
  constructor(p) {
    this.p = p;
    this.Debug = p.shared.Debug;
    this.renderer = p.shared.renderer;
    this.sceneFrameCount = 0;
    this.recentlyLaunchedScene = true;
    this.recentlyChangedScene = true;
    this.lastSceneChangeFrameNumber = 0;
  }
  init() {
    this.Debug.log('level', `📜 ${this.constructor.name} initialized`);
    this.sceneFrameCount = 0;
  }
  update() {
    const r = this.p.shared.renderer;
    const player = this.p.shared.player;
    const dt = this.p.shared.timing.delta;
    if (player?.visible) player.update(dt);
    this.sceneFrameCount++;
    this.recentlyLaunchedScene = this.sceneFrameCount < 5;
    this.recentlyChangedScene = (this.sceneFrameCount - this.lastSceneChangeFrameNumber) < 5;
    return [r, player, dt];
  }

  draw() {
    // default noop
  }

  cleanup() {
    this.Debug.log('level', `🧹 ${this.constructor.name} cleanup`);
  }

  // ---- Convenience ----------------------------------------------------------

  markDirty(...layers) {
    const r = this.renderer;
    if (!r || !r.layerDirty) return;

    const flat = layers.flat();
    flat.forEach(name => {
      if (r.layerDirty[name] !== undefined) {
        r.layerDirty[name] = true;
        this.Debug.log('renderer', `🟠 Marked dirty: ${name}`);
      }
    });
  }

  markClean(...layers) {
    const r = this.renderer;
    if (!r || !r.layerDirty) return;
    layers.forEach(name => {
      if (r.layerDirty[name] !== undefined) r.layerDirty[name] = false;
    });
  }

  drawBlockingBackgroundTransformed(layer, tiles) {
    if (!layer || !this.mapTransform) {
      console.warn('⚠️ drawBlockingBackgroundTransformed: Missing layer or mapTransform');
      return;
    }
    const { tileSizePx, originPx } = this.mapTransform;

    layer.clear();
    layer.noStroke();
    layer.fill(100, 120, 150);

    for (const t of tiles) {
      if (t && Number.isFinite(t.x) && Number.isFinite(t.y)) {
        const px = originPx.x + t.x * tileSizePx;
        const py = originPx.y + t.y * tileSizePx;
        layer.rect(px, py, tileSizePx, tileSizePx);
      }
    }
  }

  drawRainbowBar(layer, tileSize = 32) {
    if (!layer) {
      this.Debug.log('level', '⚠️ drawRainbowBar: No layer provided');
      return;
    }
    layer.clear();
    layer.noStroke();
    const width = layer.width || 320;
    const height = tileSize;

    if (typeof layer.colorMode === 'function') layer.colorMode(layer.HSB, 360, 100, 100);
    for (let x = 0; x < width; x++) {
      const hue = (x / width) * 360;
      layer.fill(hue, 100, 100);
      layer.rect(x, 0, 1, height);
    }
    if (typeof layer.colorMode === 'function') layer.colorMode(layer.RGB, 255, 255, 255);
  }

  // ---- Common setup helpers -------------------------------------------------

  setupDefaultShaders() {
    const r = this.renderer;
    if (!r) return;
    r.reset();
    r.deferShader('background', 'default');
    r.deferShader('world', 'default');
    r.setNoShader('entities');
    r.deferShader('ui', 'default');
  }

  resetPlayerToLevel(levelName = 'level1') {
    const levels = this.p.shared.levels;
    const spawn = levels?.[levelName]?.spawn || { x: 0, y: 0 };
    const player = this.p.shared.player;
    if (player) {
      player.reset(spawn);
      this.Debug.log('level', `📍 Player reset to (${spawn.x}, ${spawn.y})`);
    }
  }

  deactivatePlayer() {
    const player = this.p.shared.player;
    if (player) player.deactivate();
  }

  onResize(w, h) {
    this.Debug.log('level', `🔄 Scene onResize called: ${w}x${h}`);
    this.lastSceneChangeFrameNumber = this.sceneFrameCount;
  }

  computeMapTransform(levelData, opts = {}) {
    const p = this.p;
    const W = p.width;
    const H = p.height;
    const scale = this.p.shared.settings?.graphicsScaling ?? 1;

    const cols = levelData.cols;
    const rows = levelData.rows;
    if (!cols || !rows) {
      this.Debug.log('level', '⚠️ computeMapTransform: invalid layout');
      return null;
    }

    const paddingPx = opts.paddingPx ?? 0;

    // Work entirely in *internal render space*
    const internalW = W / scale;
    const internalH = H / scale;
    const usableW = internalW - 2 * paddingPx;
    const usableH = internalH - 2 * paddingPx;
    const tileSizePx = Math.floor(Math.min(usableW / cols, usableH / rows));

    // Center inside the internal coordinate system
    const mapW = cols * tileSizePx;
    const mapH = rows * tileSizePx;
    const originPx = {
      x: Math.floor((internalW - mapW) / 2),
      y: Math.floor((internalH - mapH) / 2)
    };

    this.mapTransform = {
      cols,
      rows,
      tileSizePx,
      originPx,
      scale
    };

    this.Debug.log(
      'level',
      `🧭 mapTransform: ${cols}×${rows} tiles, ${tileSizePx}px each, origin=(${originPx.x},${originPx.y}), scale=${scale}`
    );

    return this.mapTransform;
  }

  worldToScreen(pt) {
    if (!this.mapTransform) return pt;
    const { originPx, tileSizePx, scale } = this.mapTransform;
    // convert from grid to internal pixel space, then scale up
    return {
      x: (originPx.x + pt.x * tileSizePx),
      y: (originPx.y + pt.y * tileSizePx)
    };
  }

  screenToWorld(pt) {
    if (!this.mapTransform) return pt;
    const { originPx, tileSizePx, scale } = this.mapTransform;
    // invert worldToScreen to return logical grid coordinates
    return {
      x: (pt.x  - originPx.x) / tileSizePx,
      y: (pt.y - originPx.y) / tileSizePx
    };
  }
}