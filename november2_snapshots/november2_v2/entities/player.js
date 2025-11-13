import { BaseEntity } from '../core/BaseEntity.js';

const ROOT_RADIUS = 0.15;    // collision radius in tiles
const STEM_SEG_LENGTH = 0.20;    // each stem segment
const FROND_SPREAD = 0.32;    // horizontal fan spread
const FROND_HEIGHT = 0.28;    // how high the fronds sit
const SPRING_K = 2.0;           // mid stiffness, stable
const SPRING_DAMP = 0.90;    // high damping for underwater
const FROND_MASS = 1.0;
const STEM_MASS = 1.5;
const ROOT_MASS = 2.0;

export class Player extends BaseEntity {
    constructor(p) {
        super(p);

        this.size = 1.0;

        this.speed = 40;
        this.sinkancy = 30;

        // Global upward drift for whole anemone
        this.baseBuoyancy = -10;

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

        const stem2 = stem1.createChild(0, -STEM_SEG_LENGTH, STEM_SEG_LENGTH);
        stem2.springK = SPRING_K;
        stem2.springDamping = SPRING_DAMP;

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

    onActionStart(action) {
        if (this.moving[action] !== undefined) this.moving[action] = true;
        this.Debug?.log('player', `Started ${action}`);
    }

    onActionEnd(action) {
        if (this.moving[action] !== undefined) this.moving[action] = false;
        this.Debug?.log('player', `Ended ${action}`);
    }

    applyForces(dt) {
        super.applyForces(dt);
        const mp = this.mainPhysicsParticle;
        if (!mp) return;

        // Horizontal control
        if (this.moving.moveLeft) mp.addForce(-this.speed, 0);
        if (this.moving.moveRight) mp.addForce(+this.speed, 0);

        // Vertical control
        if (this.moving.sink) mp.addForce(0, this.sinkancy);
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

        layer.noFill();
        const chroma = this.p.shared.chroma;
        const pc = chroma.player;
        layer.stroke(pc[0], pc[1], pc[2], pc[3]);
        layer.strokeWeight(4);

        // for (const particle of this.physicsParticles) {
        //     const pos = this.scene.worldToScreen(particle.pos);
        //     layer.circle(pos.x, pos.y, 5);
        // }

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


    }
}