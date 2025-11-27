import { PhysicsWorld } from './PhysicsWorld.js';
import { PhysicsSolver } from './PhysicsSolver.js';
import { GeometryTools } from './geometryTools.js';
import { SceneDrawingMixin } from './SceneDrawingMixin.js';
import { generateCurrents } from './generateCurrents.js';
import { MyButton } from '../components/myButton.js';

import { Grass } from '../entities/grass.js';
import { Friend } from '../entities/friend.js';
import { Spikes } from '../entities/spikes.js';
import { PathFollower } from "../entities/pathFollower.js";

const PLAYING = 0;
const COMPLETED = 1;
const FAILED = 2;


export class BaseScene {
  constructor(p, opts = {}) {
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
    this.nextScene = opts.nextScene || null;
    this.levelGoal = {};
    this.useTextureLayer = 1.0;
    this.gameState = PLAYING;
    this.friend = null;
    this.transitionTimer = 0;
    this.desaturateAmount = 0;

  }

  init() {
    this.gameState = PLAYING;
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
      this.drawCurrentsUniformTexture();
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

      this.levelGoal = this.levelData.goal;
      if (this.levelGoal) {
        const goalEntity = new Friend(this.p);
        this.friend = goalEntity;
        goalEntity.reset({ x: this.levelGoal.x + 0.5, y: this.levelGoal.y + 0.5 });
        this.registerEntity(goalEntity);
      }

      for (const entity of this.levelData.entities) {
        switch (entity.type) {
          case 'grass':
            for (let i = 0; i < (entity.count || 1); i++) {
              const grass = new Grass(this.p, entity);
              this.registerEntity(grass);
            }
            break;

          case 'pathFollower':
            let newLegend = entity.ch + "_pathfollower";
            let res = this.getEntity(newLegend);
            if (res === null) {
              res = new PathFollower(this.p);
              this.registerEntity(res);
            }
            res.legend = newLegend;
            res.addToPath({ x: entity.x, y: entity.y });
            break;
        }
      }

      for (const hazard of this.levelData.hazards) {
        // this.Debug.log('level', hazard);
        switch (hazard.type) {
          case 'spike':
            const spike = new Spikes(this.p, hazard);
            this.registerEntity(spike);
            break;
        }
      }

    }
    const r = this.p.shared.renderer;
    r.reset();
    this.registerEntity(player);
    return [r, player];
  }

  drawCurrentsUniformTexture() {
    const targetLayer = this.renderer.layers.currentTexture;
    const downscale = 0.02;
    const layer = this.p.createGraphics(Math.round(targetLayer.width * downscale), Math.round(targetLayer.height * downscale));
    const minDX = this.levelData.currentExtrema.minDX;
    const maxDX = this.levelData.currentExtrema.maxDX;
    const minDY = this.levelData.currentExtrema.minDY;
    const maxDY = this.levelData.currentExtrema.maxDY;
    // this.Debug.log('level', minDX, maxDX, minDY, maxDY);
    // step thought this.levelData.currents and draw to layer
    for (const c of this.levelData.currents) {
      if (c.levelDefinitionCurrent) {
        const screenPos = this.worldToScreen({ x: c.x, y: c.y });
        const tileSize = this.mapTransform.tileSizePx;
        const r = Math.floor(this.p.map(c.dx, minDX, maxDX, 0, 255));
        const g = Math.floor(this.p.map(c.dy, minDY, maxDY, 0, 255));
        const b = 128; // neutral
        layer.noStroke();
        layer.fill(r, g, b);
        layer.circle(screenPos.x * downscale, screenPos.y * downscale, tileSize * downscale * .8);
      }
    }
    targetLayer.imageMode(this.p.CORNER);
    targetLayer.smooth();
    targetLayer.elt.getContext('2d').imageSmoothingEnabled = true;
    targetLayer.image(layer, 0, 0, targetLayer.width, targetLayer.height);
    layer.remove();
  }

  addInGameMenuButtons() {
    // Main Menu Button
    const dim = 0.025 * this.renderer.layers.uiLayer.width;
    const btn = new MyButton(
      this.renderer.layers.uiLayer.width - dim - this.padding, // x (with 10px padding)
      this.padding,                     // y
      dim,                     // width
      dim,                     // height
      "x",
      this.renderer.layers.uiLayer,
      () => {                 // onClick action
        this.p.shared.sceneManager.change("menu");
      }, this.p
    );
    btn.backgroundColor = this.p.shared.chroma.player;
    btn.fontColor = this.p.color(255);

    this.registerUI(btn);

  }

  sortEntitiesToRenderOrder() {
    //todo

  }

  positionChecking(player) {
    if (player.worldPos.x - this.levelGoal.x < 1.0 && player.worldPos.x - this.levelGoal.x > -1.0 &&
      player.worldPos.y - this.levelGoal.y < 1.0 && player.worldPos.y - this.levelGoal.y > -1.0) {
      this.Debug.log('level', 'Level complete!');
      this.updateGameState(COMPLETED);
    }
    for (const entity of this.entities) {
      if (!entity.hazard) continue;

      if (entity.checkCollisionWithPlayer?.(player)) {
        console.warn('⚠️ Player hit hazard:', entity);
        player.onHazard?.(entity);
        if (player.health <= 0) {
          this.updateGameState(FAILED);
        }
      }
    }
  }

  updateGameState(newState) {
    let isUpdate = this.gameState != newState;
    this.gameState = newState;

    if (newState === COMPLETED && isUpdate) {
      this.transitionUntil = this.p.millis() + 1500;
    }

    if (newState === FAILED && isUpdate) {
      this.transitionUntil = this.p.millis() + 1000;
    }
  }

  update() {

    const r = this.p.shared.renderer;
    const player = this.p.shared.player;
    const dt = this.p.shared.timing.delta;

    this.recentlyLaunchedScene = isNaN(this.sceneFrameCount) || this.sceneFrameCount < 10;

    this.recentlyChangedScene = (this.sceneFrameCount - this.lastSceneChangeFrameNumber) < 5;

    switch (this.gameState) {
      case PLAYING:
        break;
      case COMPLETED:
        player.ready = false;
        let dir = this.friend.moveLongWays();
        const r = Math.floor(this.p.map(dir.x, -1, 1, 0, 255));
        const g = Math.floor(this.p.map(dir.y, -1, 1, 0, 255));
        const b = 128; // neutral

        this.renderer.layers.currentTexture.background(r, g, b, 50);

        if (this.p.millis() >= this.transitionUntil) {
          if (this.nextScene) {
            this.p.shared.sceneManager.change(this.nextScene);
          } else {
            this.Debug.log('level', 'No next scene defined.');
          }
        }
        break;

      case FAILED:
        player.ready = false;
        this.desaturateAmount += 1;
        if (this.p.millis() >= this.transitionUntil) {
          this.cleanup();
          this.init();
        }
        break;
    }

    this.updateGame(r, player, dt);

    return [r, player, dt];
  }

  updateGame(r, player, dt) {
    this.positionChecking(player);

    // 1. apply entity forces
    for (const entity of this.entities) {
      entity.applyForces(dt);
      for (const prt of entity.physicsParticles) {
        if (prt) {
          const cx = Math.floor(prt.pos.x);
          const cy = Math.floor(prt.pos.y);
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

            entity.onCurrent(prt, { ...current, dx, dy });
          }
        }
      }
    }

    // 2. gather root particles (for example, each entity exposes mainPhysicsParticle)
    const roots = [];
    for (const entity of this.entities) {
      if (entity.mainPhysicsParticle && entity.active) {
        roots.push(entity.mainPhysicsParticle);
      }
    }

    // 3. step the physics
    if (roots.length > 0) {
      this.physicsSolver.step(dt, roots);
    }

    // 4. post-physics entity updates
    for (const entity of this.entities) {
      if (entity.active) {
        entity.postPhysics(dt);
      }
    }
  }

  registerUI(element) {
    this.uiElements.push(element);
  }

  getEntity(legend) {
    for (const entity of this.entities) {
      if (entity.legend === legend) return entity;
    }
    return null;
  }

  registerEntity(entity) {
    this.entities.push(entity);
    entity.setScene(this);
    entity.init();
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
    // let [internalX, internalY] = this.renderer.toLayerCoords('uiLayer', x, y);
    let internalX = this.p.correctedMouseX;
    let internalY = this.p.correctedMouseY;

    this.Debug.log('level', 'BaseScene onMousePressed at:', x, y, '-> internal:', internalX, internalY);
    for (const el of this.uiElements) {
      if (el.mousePressed?.(internalX, internalY)) return;   // allow UI to consume the click
    }
  }

  onTouchStarted(x, y) {
    let internalX = this.p.correctedMouseX;
    let internalY = this.p.correctedMouseY;

    this.Debug.log('level', 'BaseScene onMousePressed at:', x, y, '-> internal:', internalX, internalY);
    for (const el of this.uiElements) {
      if (el.mousePressed?.(internalX, internalY)) return;   // allow UI to consume the click
    }

  }

  draw() {
    this.sceneFrameCount++;

    // this.renderer.layers.uiLayer.fill(255);
    // this.renderer.layers.uiLayer.circle(this.p.mouseX, this.p.mouseY, 25); // DEBUG: show mouse position
    // this.renderer.layers.uiLayer.fill(255, 0, 0);
    // this.renderer.layers.uiLayer.circle(this.p.correctedMouseX, this.p.correctedMouseY, 25); // DEBUG: show mouse position

    if (this.renderer.layerDirty.uiLayer) {
      const uiLayer = this.renderer.layers.uiLayer;
      const shaderLayer = this.renderer.layers.entitiesLayer;
      for (const el of this.uiElements) {
        el.draw(uiLayer, shaderLayer);
        // this.Debug.log('level', 'Drawing UI element:', el);
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
      this.Debug.log('level', 'Cleaned up entity:', entity);
    }
    this.entities.length = 0;
    this.uiElements.length = 0;
    this.tileLookup = null;
    this.currentsLookup = null;
    this.physicsWorld = null;
    this.physicsSolver = null;
    this.levelData = null;
    this.Debug.log('level', `🧹 ${this.constructor.name} cleanup - done`);
    this.desaturateAmount = 0;
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

    const paddingPx = 20 + Math.floor(Math.min(W, H) * scale);
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