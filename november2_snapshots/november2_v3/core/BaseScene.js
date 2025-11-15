import { PhysicsWorld } from './PhysicsWorld.js';
import { PhysicsSolver } from './PhysicsSolver.js';
import { GeometryTools } from './GeometryTools.js';
import { SceneDrawingMixin } from './SceneDrawingMixin.js';
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
    this.currentsLookup = null;
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
    this.padding = this.calculatePadding();
    if (this.levelData) {
      this.computeMapTransform(this.levelData, { paddingPx: this.padding });
      player.setScene(this);
      const spawnWorld = {
        x: this.levelData.spawn.x + 0.5,
        y: this.levelData.spawn.y + 0.5
      };
      player.reset(spawnWorld);
      this.tileLookup = new Map();
      for (const t of this.levelData.tiles) {
        const key = `${t.x},${t.y}`;
        this.tileLookup.set(key, t);
      }
      this.currentsLookup = new Map();
      for (const c of this.levelData.currents) {
        const key = `${c.x},${c.y}`;
        this.currentsLookup.set(key, c);
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
      const p = entity.mainPhysicsParticle;
      if (p) {
        const cx = Math.floor(p.pos.x);
        const cy = Math.floor(p.pos.y);
        const current = this.getCurrent(cx, cy);
        if (current) {
          this.Debug.log('level', `Applying current to entity at (${cx},${cy}): dx=${current.dx}, dy=${current.dy}`);
          p.addForce(current.dx, current.dy);
        }
      }
    }

    // NEED TO WORK ON MAKING THIS VERSION WORK VVV

    // for (const entity of this.entities) {
    //   entity.applyForces(dt);

    //   if (entity.physicsParticles && entity.physicsParticles.length > 0) {
    //     for (const particle of entity.physicsParticles) {
    //       const cx = Math.floor(particle.pos.x);
    //       const cy = Math.floor(particle.pos.y);
    //       const current = this.getCurrent(cx, cy);
    //       if (current) {
    //         particle.addForce(current.dx, current.dy);
    //       }
    //     }
    //   }
    // }

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
    if (!this.tileLookup || !this.levelData) return null;

    const cols = this.levelData.cols;
    const rows = this.levelData.rows;

    // 1. Outside playable area → implicit solid boundary
    if (x < 0 || y < 0 || x >= cols || y >= rows) {
      return {
        x,
        y,
        solid: true,
        type: "boundary"
      };
    }

    // 2. Inside world → return actual tile
    const tile = this.tileLookup.get(`${x},${y}`);
    if (!tile) return null;

    return {
      ...tile,
      solid: tile.type === "wall"
    };
  }

  getCurrent(x, y) {
    if (!this.currentsLookup) return null;
    return this.currentsLookup.get(`${x},${y}`) || null;
  }

  onKeyPressed(key, keyCode) {
    this.Debug.log('level', `Key pressed in ${this.constructor.name}: ${key} (${keyCode})`);
    if (this.p.keyIsPressed && this.p.key === 's') {
      this.p.shared.settings.enableShaders = !this.p.shared.settings.enableShaders;
      this.Debug.log('level', `Toggled shaders: ${this.p.shared.settings.enableShaders}`);
      // this.Debug.log('level', `Toggled physics debug: ${this.physicsWorld.debug}`);
      // this.physicsWorld.DEBUG_COLLISIONS = !this.physicsWorld.DEBUG_COLLISIONS;
    }
  }



  draw() {
    // default noop
  }

  cleanup() {
    this.Debug.log('level', `🧹 ${this.constructor.name} cleanup`);
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
    this.padding = this.calculatePadding();
    if (this.levelData) this.computeMapTransform(this.levelData, { paddingPx: this.padding });
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

  calculatePadding() {
    const p = this.p;
    const W = p.width;
    const H = p.height;
    const scale = this.p.shared.settings?.paddingRatio ?? 1;

    const paddingPx = Math.floor(Math.min(W, H) * scale);
    this.Debug.log('level', `Calculated padding: ${paddingPx}px (scale: ${scale})`);
    return paddingPx;
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

    this.mapTransform.tileToScreen = (tx, ty) => {
      return {
        x: this.mapTransform.originPx.x + tx * this.mapTransform.tileSizePx,
        y: this.mapTransform.originPx.y + ty * this.mapTransform.tileSizePx
      };
    };

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

Object.assign(BaseScene.prototype, SceneDrawingMixin);