import { BaseEntity } from '../core/BaseEntity.js';

const ROOT_RADIUS = 0.15;
const STEM_SEG_LENGTH = 0.40;
const FROND_SPREAD = 0.32;
const FROND_HEIGHT = 0.38;

const SPRING_K = 1.2;
const SPRING_DAMP = 0.99;

const FROND_MASS = 1;
const STEM_MASS = 4;
const ROOT_MASS = 12;

export class Player extends BaseEntity {
    constructor(p) {
        super(p);

        this.size = 1.0;
        this.ambientCurrentScale = 0.5;
        this.health = 100;

        this.speed = 40;
        this.speed = p.shared.settings.playerSpeed || 40;
        this.sinkancy = p.shared.settings.playerSinkancy || 30;
        this.buoyancy = p.shared.settings.playerBuoyancy || -12.5;
        this.baseBuoyancy = p.shared.settings.playerBuoyancy || -12.5;
        this.ready = false;

        this.moving = {
            moveLeft: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            sink: false
        };

        // -------------------------------
        // Root (center of tile)
        // -------------------------------
        this.mainPhysicsParticle = this.createPhysicsParticle(
            0, 0,      // x,y
            1,         // mass
            true,      // main
            false      // fixed
        );

        this.mainPhysicsParticle.updateRadii(ROOT_RADIUS, this.size);

        const root = this.mainPhysicsParticle;
        root.mass = ROOT_MASS;
        this.frond_particle_indexes = [];

        // -------------------------------
        // Stem: 2 upward segments
        // -------------------------------
        const stem1 = root.createChild(0, -STEM_SEG_LENGTH, STEM_SEG_LENGTH);
        stem1.springK = SPRING_K;
        stem1.springDamping = SPRING_DAMP;
        stem1.mass = STEM_MASS;
        stem1.updateRadii(ROOT_RADIUS, this.size);

        const stem2 = stem1.createChild(0, -STEM_SEG_LENGTH, STEM_SEG_LENGTH);
        stem2.springK = SPRING_K;
        stem2.springDamping = SPRING_DAMP;
        stem2.updateRadii(ROOT_RADIUS, this.size);

        const tip = stem2; // fronds attach here

        this.physicsParticles.push(stem1, stem2);

        // -------------------------------
        // Fronds (fan shape: left, middle, right)
        // -------------------------------
        const frondOffsets = [
            { x: -FROND_SPREAD, y: -FROND_HEIGHT },
            { x: 0, y: -FROND_HEIGHT * 1.2 },
            { x: FROND_SPREAD, y: -FROND_HEIGHT }
        ];

        for (const off of frondOffsets) {
            const frond = tip.createChild(off.x, off.y, FROND_HEIGHT);
            frond.springK = SPRING_K * 0.8;     // slightly softer
            frond.springDamping = SPRING_DAMP;
            frond.mass = FROND_MASS;
            frond.updateRadii(ROOT_RADIUS, this.size);

            this.physicsParticles.push(frond);

            this.frond_particle_indexes.push([
                this.physicsParticles.indexOf(root),
                this.physicsParticles.indexOf(tip),
                this.physicsParticles.indexOf(frond)
            ]);
        }

        // Label debug
        let i = 0;
        for (const p of this.physicsParticles) p.label = `anen_${i++}`;
    }

    reset(spawn = { x: 0, y: 0 }) {
        super.reset(spawn);
        this.ready = false;
        this.health = 100;
    }

    onHazard(hazard) {
        this.health = 0;
        // this.Debug?.log('player', `Player hit hazard at (${hazard.worldPos.x}, ${hazard.worldPos.y}), health now ${this.health}`);
        for (const action in this.moving) {
            this.moving[action] = false;
        }
        // this.Debug?.log('player', `Player hit hazard at (${hazard.worldPos.x}, ${hazard.worldPos.y})`);
    }

    cleanup() {
        // intentional no-op
    }

    onCurrent(particle, current) {
        if (this.health <= 0) return;
        if (current.levelDefinitionCurrent) {
            // this.p.shared.timing.getOsc(0.5, 0.5, 1000) 
            particle.addForce(current.dx, current.dy);
        } else {
            particle.addForce(current.dx * this.ambientCurrentScale, current.dy * this.ambientCurrentScale);
        }
    }

    onActionStart(action) {
        if (this.health <= 0) return;
        if (this.moving[action] !== undefined) {
            this.moving[action] = true;
            this.ready = true;
        }
        this.Debug?.log('player', `Started ${action}`);
    }

    onActionEnd(action) {
        if (this.moving[action] !== undefined) this.moving[action] = false;
        this.Debug?.log('player', `Ended ${action}`);
    }

    applyForces(dt) {
        if (!this.ready) return;
        if (this.health <= 0) return;

        if (this.moving.sink) {
            this.baseBuoyancy = this.sinkancy;
        } else {
            this.baseBuoyancy = this.buoyancy;
        }

        super.applyForces(dt);
        const mp = this.mainPhysicsParticle;
        if (!mp) return;

        // Horizontal control
        // if (this.moving.moveLeft) mp.addForce(-this.speed, 0);
        // if (this.moving.moveRight) mp.addForce(+this.speed, 0);

        // Vertical control
        // if (this.moving.sink) mp.addForce(0, this.sinkancy);
    }

    postPhysics() {
        if (this.health <= 0) return;
        const mp = this.mainPhysicsParticle;
        if (!mp) return;

        if (this.ready) {
            this.worldPos.x = mp.pos.x;
            this.worldPos.y = mp.pos.y;
        } else {
            mp.pos.x = this.worldPos.x;
            mp.pos.y = this.worldPos.y
        }


        this.pxSize = this.size * this.scene.mapTransform.tileSizePx;
    }

    draw(layer) {
        if (!this.visible || !this.scene) return;
        const { x, y } = this.scene.worldToScreen(this.worldPos);

        // const chroma = this.p.shared.chroma;
        // const pc = chroma.player;
        layer.noFill();
        layer.stroke(this.p.shared.chroma.player);
        layer.strokeWeight(this.p.shared.settings.playerStrokeWeight * layer.width || 8);

        for (const indexes of this.frond_particle_indexes) {
            const sp = this.scene.worldToScreen(this.physicsParticles[indexes[0]].pos); // start
            const mp = this.scene.worldToScreen(this.physicsParticles[indexes[1]].pos); // mid
            const ep = this.scene.worldToScreen(this.physicsParticles[indexes[2]].pos); // end

            // Direction from start to end
            const dx = ep.x - sp.x;
            const dy = ep.y - sp.y;

            // Length of frond (for curvature scaling)
            const len = Math.sqrt(dx * dx + dy * dy);

            // Perpendicular normal (dx,dy) rotated 90deg
            const nx = -dy / len;
            const ny = dx / len;

            // Bend amount — tune this for more/less curve
            const curvature = len * 0.25;  // 0.2–0.35 works well

            // Control points: mid ± perpendicular offset
            const c1 = { x: mp.x + nx * curvature, y: mp.y + ny * curvature };
            const c2 = { x: mp.x - nx * curvature, y: mp.y - ny * curvature };

            // Final Bézier draw
            layer.bezier(
                sp.x, sp.y,       // start
                c1.x, c1.y,       // control 1
                c2.x, c2.y,       // control 2
                ep.x, ep.y        // end
            );
        }
        layer.noStroke();
    }
}