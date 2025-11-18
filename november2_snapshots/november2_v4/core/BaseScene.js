import { PhysicsWorld } from './PhysicsWorld.js';
import { PhysicsSolver } from './PhysicsSolver.js';
import { GeometryTools } from './GeometryTools.js';
import { SceneDrawingMixin } from './SceneDrawingMixin.js';
import { generateCurrents } from './generateCurrents.js';
import { MyButton } from '../components/myButton.js';

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
    this.uiElements = [];
    this.tileLookup = null;
    this.currentsLookup = null;
    this.physicsWorld = null;
    this.physicsSolver = null;
  }

  init() {
    this.Debug.log('level', `📜 ${this.constructor.name} initialized`);
    this.sceneFrameCount = 0;
    const player = this.p.shared.player;
    this.padding = this.calculatePadding();
    if (this.levelData) {
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
      this.computeMapTransform(this.levelData, { paddingPx: this.padding });
      player.setScene(this);
      this.levelData = generateCurrents(this.levelData, this.p);
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
    console.log('reset renderer layers width:');
    console.log(this.renderer.layers.uiLayer.width);
    return [r, player];
  }

  addLevelButtons() {
    // Main Menu Button
    const dim = 0.02 * this.renderer.layers.uiLayer.width;
    const btn = new MyButton(
      this.renderer.layers.uiLayer.width - dim - this.padding, // x (with 10px padding)
      this.padding,                     // y
      dim,                     // width
      dim,                     // height
      "X",
      this.renderer.layers.uiLayer,
      () => {                 // onClick action
        this.p.shared.sceneManager.change("menu");
      }
    );
    console.log('Registering pause button UI element:', btn);

    this.registerUI(btn);

  }

  update() {
    const r = this.p.shared.renderer;
    const player = this.p.shared.player;
    const dt = this.p.shared.timing.delta;

    this.recentlyLaunchedScene = isNaN(this.sceneFrameCount) || this.sceneFrameCount < 10;

    this.recentlyChangedScene = (this.sceneFrameCount - this.lastSceneChangeFrameNumber) < 5;

    // 1. apply entity forces
    for (const entity of this.entities) {
      entity.applyForces(dt);
      for (const p of entity.physicsParticles) {
        if (p) {
          const cx = Math.floor(p.pos.x);
          const cy = Math.floor(p.pos.y);
          const current = this.getCurrent(cx, cy);
          if (current) {
            const t = this.p.millis() * 0.001;
            const amp = 0.2;
            const tilePhase = (x, y) => {
              return ((x * 12.9898 + y * 78.233) * 43758.5453) % (2 * Math.PI);
            };

            let dx = current.dx;
            let dy = current.dy;

            if (!current.levelDefinitionCurrent) {
              const phase = tilePhase(cx, cy);
              const wobbleX = 1 + amp * Math.sin(t + phase);
              const wobbleY = 1 + amp * Math.cos(t + phase);
              dx = current.dx * wobbleX;
              dy = current.dy * wobbleY;
            }

            entity.onCurrent(p, { ...current, dx, dy });
          }
        }
      }
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

  registerUI(element) {
    this.uiElements.push(element);
  }

  registerEntity(entity) {
    this.entities.push(entity);
    entity.setScene(this);
    if (typeof entity.initAmbientEntity === "function") {
      entity.initAmbientEntity();
    }
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

  onMousePressed(x, y) {
    // above was an attempt at converting to internal coords, fails on portrait, also think it shouldnt live here - should live in renderer
    let [internalX, internalY] = this.renderer.toLayerCoords('uiLayer', x, y);

    console.log('BaseScene onMousePressed at:', x, y, '-> internal:', internalX, internalY);
    for (const el of this.uiElements) {
      if (el.mousePressed?.(internalX, internalY)) return;   // allow UI to consume the click
    }
  }

  draw() {
    this.sceneFrameCount++;
    if (this.renderer.layerDirty.uiLayer) {
      const uiLayer = this.renderer.layers.uiLayer;
      for (const el of this.uiElements) {
        el.draw(uiLayer);
        // console.log('Drawing UI element:', el);
      }
    }
  }

  cleanup() {
    this.Debug.log('level', `🧹 ${this.constructor.name} cleanup`);
    this.sceneFrameCount = 0;
    this.recentlyLaunchedScene = true;
    this.recentlyChangedScene = true;
    this.lastSceneChangeFrameNumber = 0;
    for (const entity of this.entities) {
      entity.cleanup();
    }
    this.entities.length = 0;
    this.uiElements.length = 0;
    this.tileLookup = null;
    this.currentsLookup = null;
    this.physicsWorld = null;
    this.physicsSolver = null;
    this.levelData = null;
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
    for (const el of this.uiElements) {
      el.onResize?.(this.renderer.layers.uiLayer);
    }
  }

  onActionStart(action) {
    const player = this.p.shared.player;
    player?.onActionStart?.(action);
    // if (action === "pause") this.p.shared.sceneManager.change("menu");
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
    // const paddingPx = H * scale;

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