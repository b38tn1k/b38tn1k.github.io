import { PhysicsParticle } from '../core/PhysicsParticle.js';

export class BaseEntity {
  constructor(p) {
    this.p = p;
    this.scene = null;
    this.worldPos = { x: 0, y: 0 };
    this.visible = false;
    this.size = 1; // in world units (tiles)
    this.Debug = p.shared.Debug;
    this.mainPhysicsParticle = null;
    this.physicsParticles = []; // kept only for rendering order; solver walks child graph
    this.baseBuoyancy = 0;      // default buoyancy for floating entities
    this.active = true;
    this.useMemoryTethers = true;
    this.legend = null; 
  }

  createPhysicsParticle(x, y, mass = 1, main = false, fixed = false) {
    const physicsParticle = new PhysicsParticle(x, y, mass, main, fixed);
    if (main) {
      this.mainPhysicsParticle = physicsParticle;
    }
    this.physicsParticles.push(physicsParticle);
    return physicsParticle;
  }

  setScene(scene) {
    this.scene = scene;
  }

  cleanup() {
    this.mainPhysicsParticle = null;
    this.physicsParticles.length = 0;
  }

  onCurrent(particle, current) {
    particle.addForce(current.dx, current.dy);
  }

  init(){
    //no-op
  }

  applyForces(dt) {
    // default global buoyancy support
    if (!this.mainPhysicsParticle) return;
    if (this.baseBuoyancy !== 0) {
      const mp = this.mainPhysicsParticle;
      mp.addForce(0, this.baseBuoyancy);
      for (const child of mp.children) {
        child.addForce(0, this.baseBuoyancy * 0.5);
      }
    }
  }

  reset(spawn = { x: 0, y: 0 }) {
    this.visible = true;
    this.active = true;
    this.worldPos.x = spawn.x;
    this.worldPos.y = spawn.y;
    this.visible = true;
    this.Debug?.log('entity', `Entity reset to world (${spawn.x}, ${spawn.y})`);

    if (!this.mainPhysicsParticle) return;

    // place root at spawn
    this.mainPhysicsParticle.pos.x = spawn.x;
    this.mainPhysicsParticle.pos.y = spawn.y;
    this.mainPhysicsParticle.vel.x = 0;
    this.mainPhysicsParticle.vel.y = 0;
    this.mainPhysicsParticle.prevPos.x = spawn.x;
    this.mainPhysicsParticle.prevPos.y = spawn.y;

    const stack = [...this.mainPhysicsParticle.children];
    while (stack.length > 0) {
      const c = stack.pop();
      c.vel.x = 0;
      c.vel.y = 0;
      c.pos.x = this.mainPhysicsParticle.pos.x + c.offsets.x;
      c.pos.y = this.mainPhysicsParticle.pos.y + c.offsets.y;
      c.prevPos.x = c.pos.x;
      c.prevPos.y = c.pos.y;
      c.force.x = 0;
      c.force.y = 0;  

      stack.push(...c.children);
    }
  }

  update(dt) {
    if (!this.visible) return;
    // Entities no longer perform physics here.
  }

  postPhysics() {
    if (!this.mainPhysicsParticle) return;
    this.worldPos.x = this.mainPhysicsParticle.pos.x;
    this.worldPos.y = this.mainPhysicsParticle.pos.y;
  }

  draw(layer) {
    if (!this.visible || !this.scene) return;

    const { x, y } = this.scene.worldToScreen(this.worldPos);
    const pxSize = this.size * this.scene.mapTransform.tileSizePx;

    layer.noStroke();
    layer.fill(180, 180, 180);
    layer.rect(x, y, pxSize, pxSize);
  }

  deactivate() {
    this.visible = false;
    this.active = false;
  }

  activate() {
    this.visible = true;
    this.active = true;
  }
}