import { BaseEntity } from '../core/BaseEntity.js';

const ROOT_RADIUS = 0.4;
const ROOT_MASS = 2;
const STEM_SEG_LENGTH = 1.5;
const SPRING_K = .35;
const SPRING_DAMP = 0.29;
const STEM_MASS = 2;
const SOFT_FACTOR = 0.15;

// grass is a type of vegetation that grows in shallow water

export class Grass extends BaseEntity {
    constructor(p, config) {
        super(p);

        this.size = 0.1;
        this.speed = p.shared.settings.ambientSpeed;
        this.sinkancy = p.shared.settings.ambientSinkancy;
        this.baseBuoyancy = p.shared.settings.ambientBuoyancy;
        this.color = p.shared.chroma.ambient;
        this.x = config.x + Math.random() * 0.5;
        this.y = config.y + 1;
        this.worldPos.x = this.x;
        this.worldPos.y = this.y;
        this.visible = true;
        this.direction = config.direction || "up";
        this.bladeWidth = 0.002 + p.random() * 0.002;
        this.bladeHeight = 0.75 + p.random() * 0.5;
        this.left = Math.random() < 0.5;
        this.curve = 0.2 + 0.2 * Math.random();

        this.mainPhysicsParticle = this.createPhysicsParticle(
            this.x, this.y,      // x,y
            1,         // mass
            true,      // main
            false      // fixed
        );

        this.mainPhysicsParticle.updateRadii(ROOT_RADIUS, this.size);
        this.mainPhysicsParticle.addForce(this.p.random(-1, 1) * this.speed, this.p.random(-1, 1) * this.speed);

        const root = this.mainPhysicsParticle;
        root.mass = ROOT_MASS;
        // root.springRestoringForce = true;

        switch (this.direction) {
            case "up":
                const tip = root.createChild(0, this.bladeHeight * -STEM_SEG_LENGTH * 2, this.bladeHeight * STEM_SEG_LENGTH * 2);
                tip.springK = 0.35;
                tip.springDamping = 0.6;
                tip.mass = STEM_MASS;
                tip.updateRadii(ROOT_RADIUS, this.size);
                tip.softFactor = 0.01;
                // tip.springRestoringForce = true;
                tip.maxStretch = STEM_SEG_LENGTH * 1.5;
                this.physicsParticles.push(tip);
                break;
        }

    }

    cleanup() {
        super.cleanup();
    }

    applyForces(dt) {
        super.applyForces(dt);

        const mp = this.mainPhysicsParticle;
        if (!mp) return;

        const idleYOsc = this.p.shared.timing.getOsc(0, 5, 1000);
        const idleXOsc = this.p.shared.timing.getOsc(0, 5, 1200);
        // mp.addForce(0, idleYOsc);
        for (const c of mp.children) {
            c.cascadeForce(idleXOsc, idleYOsc, 1.0);
        }

        // const tip = this.physicsParticles[0];
        // const dx = tip.pos.x - mp.pos.x;
        // const dy = tip.pos.y - mp.pos.y;
        // const dist = Math.sqrt(dx * dx + dy * dy);
        // if (dist > tip.maxStretch) {
        //     const ratio = tip.maxStretch / dist;
        //     tip.pos.x = mp.pos.x + dx * ratio;
        //     tip.pos.y = mp.pos.y + dy * ratio;
        // }
    }

    onCurrent(particle, current) {
        if (current.levelDefinitionCurrent) {
            // this.p.shared.timing.getOsc(0.5, 0.5, 1000)
            particle.addForce(current.dx, current.dy);
            for (const c of particle.children) {
                c.cascadeForce(current.dx, current.dy, 1.0);
            }
        }
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

    draw(layer, texture) {
        if (!this.visible || !this.scene) return;
        const rootPos = this.mainPhysicsParticle.pos;
        const tipPos = this.physicsParticles[1].pos;
        const sp = this.scene.worldToScreen(rootPos);
        const ep = this.scene.worldToScreen(tipPos);
        const mx = (sp.x + ep.x) * 0.5;
        const my = (sp.y + ep.y) * 0.5;
        const dx = ep.x - sp.x;
        const dy = ep.y - sp.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const curvature = len * this.curve;
        let c1 = { x: mx + nx * curvature, y: my + ny * curvature };
        let c2 = { x: mx - nx * curvature, y: my - ny * curvature };
        if (this.left) {
            c1 = { x: mx - nx * curvature, y: my - ny * curvature };
            c2 = { x: mx + nx * curvature, y: my + ny * curvature };
        }

        // const { x, y } = this.scene.worldToScreen(this.worldPos);
        // console.log("drawing grass", this.worldPos, x, y);
        const dims = Math.floor(this.pxSize * 6);
        const strokeW = this.bladeWidth * layer.width || 4;
        layer.noFill();
        layer.stroke(this.color);
        layer.strokeWeight(strokeW);

        texture.stroke(50, 100, 25);
        texture.strokeWeight(strokeW * 4);

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