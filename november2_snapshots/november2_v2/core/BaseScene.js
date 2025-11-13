import { PhysicsWorld } from './PhysicsWorld.js';
import { PhysicsSolver } from './PhysicsSolver.js';

export class BaseScene {
  constructor(p) {
    this.p = p;
    this.Debug = p.shared.Debug;
    this.renderer = p.shared.renderer;
    this.sceneFrameCount = 0;
    this.recentlyLaunchedScene = true;
    this.recentlyChangedScene = true;
    this.lastSceneChangeFrameNumber = 0;
    this.entities = [];
    this.tileLookup = null;
    this.physicsWorld = new PhysicsWorld({
      getTile: this.getTile.bind(this),
      restitution: 0.2,
      friction: 0.1
    });
    this.physicsSolver = new PhysicsSolver(this.physicsWorld, {
      integrator: 'verlet',
      springIterations: 1,
      useMemoryTethers: true,
      gravity: { x: 0, y: 0.15 }
    });
  }

  init() {
    this.Debug.log('level', `📜 ${this.constructor.name} initialized`);
    this.sceneFrameCount = 0;
    const player = this.p.shared.player;
    if (this.levelData) {
      this.computeMapTransform(this.levelData);
      player.setScene(this);
      player.reset(this.levelData.spawn);
      this.tileLookup = new Map();
      for (const t of this.levelData.tiles) {
        const key = `${t.x},${t.y}`;
        this.tileLookup.set(key, t);
      }
    }
    const r = this.p.shared.renderer;
    r.reset();
    this.registerEntity(player);
    return [r, player];
  }

  update() {
    const r = this.p.shared.renderer;
    const player = this.p.shared.player;
    const dt = this.p.shared.timing.delta;

    this.sceneFrameCount++;
    this.recentlyLaunchedScene = this.sceneFrameCount < 5;
    this.recentlyChangedScene = (this.sceneFrameCount - this.lastSceneChangeFrameNumber) < 5;

    // 1. apply entity forces
    for (const entity of this.entities) {
      entity.applyForces(dt);
    }

    // 2. gather root particles (for example, each entity exposes mainPhysicsParticle)
    const roots = [];
    for (const entity of this.entities) {
      if (entity.mainPhysicsParticle) {
        roots.push(entity.mainPhysicsParticle);
      }
    }

    // 3. step the physics
    this.physicsSolver.step(dt, roots);
    
    // 4. post-physics entity updates
    for (const entity of this.entities) {
      entity.postPhysics(dt);
    }

    return [r, player, dt];
  }

  registerEntity(entity) {
    this.entities.push(entity);
    entity.setScene(this);
  }

  getTile(x, y) {
    if (!this.tileLookup) return null;
    const tile = this.tileLookup.get(`${x},${y}`);
    if (!tile) return null;

    // Tag anything with type === 'wall' as solid
    return {
      ...tile,
      solid: tile.type === 'wall'
    };
  }



  draw() {
    // default noop
  }

  cleanup() {
    this.Debug.log('level', `🧹 ${this.constructor.name} cleanup`);
  }

  // ---- Drawing Tools ----------------------------------------------------------

  // --------------------------------------------------------------
  // Identify contiguous wall regions (4-way connectivity)
  // --------------------------------------------------------------
  extractTileRegions(tiles) {
    const grid = new Map();
    for (const t of tiles) {
      grid.set(`${t.x},${t.y}`, t);
    }

    const visited = new Set();
    const regions = [];

    for (const tile of tiles) {
      const key = `${tile.x},${tile.y}`;
      if (visited.has(key)) continue;

      const stack = [tile];
      const region = [];

      while (stack.length) {
        const cur = stack.pop();
        const ck = `${cur.x},${cur.y}`;
        if (visited.has(ck)) continue;

        visited.add(ck);
        region.push(cur);

        // 4-way neighbors
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nk = `${cur.x + dx},${cur.y + dy}`;
          if (grid.has(nk) && !visited.has(nk)) {
            stack.push({ x: cur.x + dx, y: cur.y + dy });
          }
        }
      }

      regions.push(region);
    }

    return regions;
  }

  // --------------------------------------------------------------
  // Convert region tiles into a polygon outline (clockwise)
  // Simple marching-squares boundary tracing
  // --------------------------------------------------------------
  computeRegionOutline(region) {
    const tileSet = new Set(region.map(t => `${t.x},${t.y}`));

    const edges = [];

    for (const t of region) {
      const { x, y } = t;

      const isEmpty = (dx, dy) => !tileSet.has(`${x + dx},${y + dy}`);

      if (isEmpty(0, -1)) edges.push([[x, y], [x + 1, y]]);
      if (isEmpty(1, 0)) edges.push([[x + 1, y], [x + 1, y + 1]]);
      if (isEmpty(0, 1)) edges.push([[x + 1, y + 1], [x, y + 1]]);
      if (isEmpty(-1, 0)) edges.push([[x, y + 1], [x, y]]);
    }

    if (edges.length === 0) return [];

    const outline = [];
    let [startA, startB] = edges[0];
    outline.push({ x: startA[0], y: startA[1] });

    let current = startB;
    let guard = 0;

    while (guard++ < 5000) {
      outline.push({ x: current[0], y: current[1] });

      const next = edges.find(e => e[0][0] === current[0] && e[0][1] === current[1]);
      if (!next) break;

      current = next[1];
      if (current[0] === startA[0] && current[1] === startA[1]) break;
    }

    return outline;
  }

  // --------------------------------------------------------------
  // Apply noise-based organic displacement + corner softness
  // --------------------------------------------------------------
  distortPolygon(points, opts = {}) {
    const noiseScale = opts.noiseScale ?? 0.08;
    const noiseAmp = opts.noiseAmp ?? 0.25;
    const cornerSmooth = opts.cornerSmooth ?? 0.5;

    const p = this.p;
    const out = [];

    for (let i = 0; i < points.length; i++) {
      const a = points[(i - 1 + points.length) % points.length];
      const b = points[i];
      const c = points[(i + 1) % points.length];

      const vx1 = b.x - a.x;
      const vy1 = b.y - a.y;
      const vx2 = c.x - b.x;
      const vy2 = c.y - b.y;

      const avgx = b.x + (vx1 + vx2) * cornerSmooth * 0.5;
      const avgy = b.y + (vy1 + vy2) * cornerSmooth * 0.5;

      const n = p.noise(b.x * noiseScale, b.y * noiseScale) - 0.5;
      const angle = Math.atan2(vy1 + vy2, vx1 + vx2);

      const dx = Math.cos(angle) * n * noiseAmp;
      const dy = Math.sin(angle) * n * noiseAmp;

      out.push({ x: avgx + dx, y: avgy + dy });
    }

    return out;
  }

  // --------------------------------------------------------------
  // Draws organic blobby wall shapes instead of squares
  // --------------------------------------------------------------
  drawOrganicBlockingBackground(layer, tiles, opts = {}) {
    if (!layer || !this.mapTransform) {
      console.warn('⚠️ drawOrganicBlockingBackground: Missing layer or mapTransform');
      return;
    }

    const { tileSizePx, originPx } = this.mapTransform;

    layer.clear();
    layer.noStroke();
    const chroma = this.p.shared.chroma;
    const pc = chroma.terrain;
    layer.fill(pc[0], pc[1], pc[2], pc[3]);

    const regions = this.extractTileRegions(tiles);

    for (const region of regions) {
      const outline = this.computeRegionOutline(region);
      if (outline.length === 0) continue;

      const distorted = this.distortPolygon(outline, opts);

      layer.beginShape();
      for (const p of distorted) {
        const sx = originPx.x + p.x * tileSizePx;
        const sy = originPx.y + p.y * tileSizePx;
        layer.curveVertex(sx, sy);
      }
      layer.endShape(this.p.CLOSE);
    }
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
      layer.rect(x, 100, 1, height);
    }
    if (typeof layer.colorMode === 'function') layer.colorMode(layer.RGB, 255, 255, 255);
  }

  // ---- Helpers -------------------------------------------------

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

  deactivatePlayer() {
    const player = this.p.shared.player;
    if (player) player.deactivate();
  }

  onResize(w, h) {
    this.Debug.log('level', `🔄 Scene onResize called: ${w}x${h}`);
    this.lastSceneChangeFrameNumber = this.sceneFrameCount;
    if (this.levelData) this.computeMapTransform(this.levelData);
  }

  onActionStart(action) {
    const player = this.p.shared.player;
    player?.onActionStart?.(action);
    if (action === "pause") this.p.shared.sceneManager.change("menu");
  }

  onActionEnd(action) {
    const player = this.p.shared.player;
    player?.onActionEnd?.(action);
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
      x: (pt.x - originPx.x) / tileSizePx,
      y: (pt.y - originPx.y) / tileSizePx
    };
  }
}