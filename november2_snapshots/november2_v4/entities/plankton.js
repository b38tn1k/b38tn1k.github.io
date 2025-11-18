import { BaseEntity } from '../core/BaseEntity.js';

const BODY_RADIUS = 0.4;
const BODY_MASS = 0.5;

// planktons are single particle animals that float in open water

export class Plankton extends BaseEntity {
    constructor(p) {
        super(p);

        this.size = 0.1;
        this.speed = p.shared.settings.ambientSpeed;
        this.sinkancy = p.shared.settings.ambientSinkancy;
        this.baseBuoyancy = p.shared.settings.ambientBuoyancy;
        this.restlessness = p.random() * 6 + 1;

        this.mainPhysicsParticle = this.createPhysicsParticle(
            0, 0,      // x,y
            1,         // mass
            true,      // main
            false      // fixed
        );

        this.mainPhysicsParticle.updateRadii(BODY_RADIUS, this.size);
        this.mainPhysicsParticle.addForce(this.p.random(-1, 1) * this.speed, this.p.random(-1, 1) * this.speed);

        const root = this.mainPhysicsParticle;
        root.mass = BODY_MASS;
    }

    initAmbientEntity() {
        if (!this.scene || !this.scene.levelData) return;

        const { cols, rows } = this.scene.levelData;

        let tries = 0;
        const maxTries = 200;

        while (tries++ < maxTries) {
            const x = Math.floor(Math.random() * cols);
            const y = Math.floor(Math.random() * rows);

            const tile = this.scene.getTile(x, y);

            // open water: NOT solid, NOT boundary
            if (!tile || !tile.solid) {
                // use center of tile
                this.worldPos.x = x + 0.5;
                this.worldPos.y = y + 0.5;
                this.visible = true;

                // set physics particle position
                if (this.mainPhysicsParticle) {
                    const mp = this.mainPhysicsParticle;
                    mp.pos.x = this.worldPos.x;
                    mp.pos.y = this.worldPos.y;
                    mp.prevPos.x = this.worldPos.x;
                    mp.prevPos.y = this.worldPos.y;
                }

                return;
            }
        }

        console.warn("⚠️ Plankton could not find valid spawn after many tries");
    }

    onActionStart(action) {
        if (this.moving[action] !== undefined) this.moving[action] = true;
        this.Debug?.log('player', `Started ${action}`);
    }

    onActionEnd(action) {
        if (this.moving[action] !== undefined) this.moving[action] = false;
        this.Debug?.log('player', `Ended ${action}`);
    }

    applyPerlinFlow(mp, dt) {
        const s = 15;             // spatial scale
        const t = this.p.millis() * 0.0002; // time scale

        const nx = this.p.noise(mp.pos.x * s, mp.pos.y * s, t);
        const ny = this.p.noise(mp.pos.x * s + 100, mp.pos.y * s + 100, t);

        const fx = this.p.map(nx, 0, 1, -1, 1) * this.speed;
        const fy = this.p.map(ny, 0, 1, -1, 1) * this.speed;

        mp.addForce(fx * 0.2, fy * 0.2);   // scale down for gentleness
    }

    applyForces(dt) {
        super.applyForces(dt);

        const mp = this.mainPhysicsParticle;
        if (!mp) return;

        // 1. Perlin-flow vector field (secondary perlin layer, looks cooler but is a bit more overhead)
        this.applyPerlinFlow(mp, dt);

        // 2. Very small restlessness impulse (optional)
        if (this.p.shared.timing.every(this.restlessness)) {
            mp.addForce(
                this.p.random(-this.speed, this.speed),
                this.p.random(-this.speed, this.speed)
            );
        }
    }


    postPhysics() {
        const mp = this.mainPhysicsParticle;
        if (!mp) return;
        this.worldPos.x = mp.pos.x;
        this.worldPos.y = mp.pos.y;
        this.pxSize = this.size * this.scene.mapTransform.tileSizePx;
    }

    draw(layer) {
        if (!this.visible || !this.scene) return;
        const { x, y } = this.scene.worldToScreen(this.worldPos);
        layer.fill(this.p.shared.chroma.ambient);
        layer.noStroke();
        layer.circle(x, y, this.pxSize);
    }
}