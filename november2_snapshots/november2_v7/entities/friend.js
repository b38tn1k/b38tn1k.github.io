import { BaseEntity } from '../core/BaseEntity.js';

const ROOT_RADIUS = 0.15;
const STEM_SEG_LENGTH = 0.40;
const FROND_SPREAD = 0.32;
const FROND_HEIGHT = 0.38;

const SPRING_K = 2.0;
const SPRING_DAMP = 1.0;

const FROND_MASS = 2;
const STEM_MASS = 4;
const ROOT_MASS = 12;

export class Friend extends BaseEntity {
    constructor(p) {
        super(p);

        this.size = 1.0;
        this.ambientCurrentScale = 0.5;
        // this.color = p.color('#40E0D0');
        this.color = p.color('#E0D040');

        this.speed = 20;
        this.speed = p.shared.settings.playerSpeed/2 || 20;
        this.sinkancy = p.shared.settings.playerSinkancy || 30;
        this.buoyancy = p.shared.settings.playerBuoyancy || -12.5;
        this.baseBuoyancy = p.shared.settings.playerBuoyancy || -12.5;

        this.away = {x: this.speed, y: this.speed};

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
        // stem1.springRestoringForce = true;

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

    cleanup() {
        // intentional no-op
    }

    onCurrent(particle, current) {
        particle.addForce(current.dx, current.dy);
        // if (current.levelDefinitionCurrent) {
        //     // this.p.shared.timing.getOsc(0.5, 0.5, 1000) 
        //     particle.addForce(current.dx, current.dy);
        // } else {
        //     particle.addForce(current.dx * this.ambientCurrentScale, current.dy * this.ambientCurrentScale);
        // }
    }

    applyForces(dt) {
        // if (this.moving.sink) {
        //     this.baseBuoyancy = this.sinkancy;
        // } else {
        //     this.baseBuoyancy = this.buoyancy;
        // }
        const idleYOsc = this.p.shared.timing.getOsc(0, 5, 1000);
        const idleXOsc = this.p.shared.timing.getOsc(0, 5, 1200);
        const mp = this.mainPhysicsParticle;
        // mp.addForce(0, idleYOsc);
        for (const c of mp.children) {
            c.cascadeForce(idleXOsc, idleYOsc, 1.0);
        }

        super.applyForces(dt);
        
        if (!mp) return;

    }

    postPhysics() {
        const mp = this.mainPhysicsParticle;
        if (!mp) return;

        // this.worldPos.x = mp.pos.x;
        // this.worldPos.y = mp.pos.y;
        mp.pos.x = this.worldPos.x;
        mp.pos.y = this.worldPos.y;
        this.pxSize = this.size * this.scene.mapTransform.tileSizePx;
    }

    moveLongWays () {
        let dx = 0;
        let dy = 0;
        const { x, y } = this.scene.worldToScreen(this.worldPos);
        if (x < this.p.width / 2) dx = this.speed;
        if (x > this.p.width / 2) dx = -this.speed;
        if (y < this.p.height / 2) dy = this.speed;
        if (y > this.p.height / 2) dy = -this.speed;

        this.worldPos.x += dx;
        this.worldPos.y += dy;
        return {x: dx/this.speed, y: dy/this.speed};
    }

    draw(layer, texture) {
        if (!this.visible || !this.scene) return;
        const { x, y } = this.scene.worldToScreen(this.worldPos);

        layer.noFill();
        layer.stroke(this.p.shared.chroma.ambient);
        layer.strokeWeight(this.p.shared.settings.playerStrokeWeight * layer.width || 8);

        texture.noFill();
        texture.stroke(this.color);
        texture.strokeWeight(this.p.shared.settings.playerStrokeWeight * layer.width * 2 || 10);

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

            texture.bezier(
                sp.x, sp.y,       // start
                c1.x, c1.y,       // control 1
                c2.x, c2.y,       // control 2
                ep.x, ep.y        // end
            );
        }


    }
}