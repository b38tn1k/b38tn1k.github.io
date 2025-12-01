import { BaseEntity } from '../core/BaseEntity.js';
import { generateFish } from './fishGenerator.js';

const BODY_RADIUS = 0.4;
const BODY_MASS = 2;


export class PathFollower extends BaseEntity {
    constructor(p, opts = {}) {
        super(p);
        this.size = .9;
        this.pxSize = 1;
        this.speed = p.shared.settings.enemySpeed;
        this.sinkancy = p.shared.settings.ambientSinkancy;
        this.baseBuoyancy = p.shared.settings.ambientBuoyancy;
        this.restlessness = p.random() * 3 + 1;
        this.color = p.shared.chroma.enemy;
        this.visible = true;
        this.hazard = opts.hazard;
        this.playerAngle = 0;
        // console.log(this.hazard, opts);

        this.mainPhysicsParticle = this.createPhysicsParticle(
            0, 0,      // x,y
            3,         // mass
            true,      // main
            false      // fixed
        );

        this.mainPhysicsParticle.updateRadii(BODY_RADIUS, this.size);
        // no initial drift; let path control take over first
        this.mainPhysicsParticle.mass = BODY_MASS;

        this.path = [];
        this.currentPathIndex = 0;
        this.pathDirection = 1;

        this.worldPos.x = 0;
        this.worldPos.y = 0;

        this.shapeTexture = p.createGraphics(128, 128);
        this.shapeTexture.pixelDensity(1);
        this.shapeTexture.noSmooth();
        this.shapeTexture.elt.getContext('2d').imageSmoothingEnabled = false;

        this.colorTexture = p.createGraphics(128, 128);
        this.colorTexture.pixelDensity(1);
        this.colorTexture.noSmooth();
        this.colorTexture.elt.getContext('2d').imageSmoothingEnabled = false;

        if (this.hazard) {
            generateFish(p, this.shapeTexture, this.colorTexture, p.shared.chroma.ambient, p.shared.chroma.enemy);
        } else {
            generateFish(p, this.shapeTexture, this.colorTexture, p.shared.chroma.ambient, p.shared.chroma.ambient);
        }


    }

    addToPath(point) {
        this.path.push(point);
        this.worldPos.x = point.x;
        this.worldPos.y = point.y;
        this.mainPhysicsParticle.pos.x = point.x;
        this.mainPhysicsParticle.pos.y = point.y;
        this.mainPhysicsParticle.prevPos.x = point.x;
        this.mainPhysicsParticle.prevPos.y = point.y;
        // console.log(this.worldPos);
        // console.log(this.path);
    }

    cleanup() {
        super.cleanup();
        this.path = [];
        if (this.shapeTexture) {
            const gl = this.shapeTexture._renderer?.GL;
            const tex = this.shapeTexture._renderer?.texture;

            if (gl && tex) {
                gl.deleteTexture(tex);
            }

            this.shapeTexture.remove();
            this.shapeTexture = null;
        }
        if (this.colorTexture) {
            const gl = this.colorTexture._renderer?.GL;
            const tex = this.colorTexture._renderer?.texture;

            if (gl && tex) {
                gl.deleteTexture(tex);
            }

            this.colorTexture.remove();
            this.colorTexture = null;
        }
    }

    onCurrent(particle, current) {
        if (current.levelDefinitionCurrent) {
            const mult = 2.0;//= this.p.shared.timing.getOsc(0.5, 0.5, 1000);
            particle.addForce(current.dx * mult, current.dy * mult);
            for (const c of particle.children) {
                const fs = c.forceScale || 1.0;
                c.cascadeForce(current.dx * fs, current.dy * fs, fs);
            }
        }
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

    applyFinWiggle(mp, dt) {
        // gentle orthogonal oscillation for swimming motion
        const t = this.p.millis() * 0.001;
        const wiggleAmp = this.speed * 0.4;
        const wiggleFreq = 4 + this.restlessness * 0.4;

        // construct a perpendicular unit vector to approximate direction
        const vx = mp.vel.x;
        const vy = mp.vel.y;
        const mag = Math.sqrt(vx * vx + vy * vy) + 0.0001;

        // perpendicular vector (vy, -vx)
        const nx = vy / mag;
        const ny = -vx / mag;

        const w = Math.sin(t * wiggleFreq) * wiggleAmp;
        mp.addForce(nx * w, ny * w);
    }

    seekNextWaypoint(mp, dt) {
        if (this.path.length < 2) return;

        const target = this.path[this.currentPathIndex];
        const dx = target.x - mp.pos.x;
        const dy = target.y - mp.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const arriveDist = 0.2;

        if (dist < arriveDist) {
            this.currentPathIndex += this.pathDirection;

            if (this.currentPathIndex >= this.path.length) {
                this.currentPathIndex = this.path.length - 2;
                this.pathDirection = -1;
            } else if (this.currentPathIndex < 0) {
                this.currentPathIndex = 1;
                this.pathDirection = 1;
            }
            return;
        }

        const inv = 1.0 / (dist + 0.0001);
        const nx = dx * inv;
        const ny = dy * inv;

        const strength = this.speed * 2.2; // stronger steering bias
        mp.addForce(nx * strength, ny * strength);

        const correction = 0.05;
        mp.addForce(nx * correction, ny * correction);
    }

    applyForces(dt) {
        super.applyForces(dt);

        const mp = this.mainPhysicsParticle;
        if (!mp) return;

        // 1. Perlin-flow vector field (secondary perlin layer, looks cooler but is a bit more overhead)
        this.applyPerlinFlow(mp, dt);
        this.applyFinWiggle(mp, dt);
        this.seekNextWaypoint(mp, dt);
    }


    postPhysics() {
        const mp = this.mainPhysicsParticle;
        if (!mp) return;
        this.pxSize = this.size * this.scene.mapTransform.tileSizePx;
        this.worldPos.x = mp.pos.x;
        this.worldPos.y = mp.pos.y;
    }

    checkCollisionWithPlayer(player) {
        if (this.hazard === false) return false;
        const box = this.getAABB?.();
        if (!box) return false;
        if (player.physicsParticles && player.physicsParticles.length > 0) {
            for (const p of player.physicsParticles) {
                const px = p.pos.x;
                const py = p.pos.y;
                if (
                    px >= box.x &&
                    px <= box.x + box.w &&
                    py >= box.y &&
                    py <= box.y + box.h
                ) {
                    return true;
                }
            }
        }
        const px = player.worldPos.x;
        const py = player.worldPos.y;
        return (
            px >= box.x &&
            px <= box.x + box.w &&
            py >= box.y &&
            py <= box.y + box.h
        );
    }

    // simple AABB for hit detection, tile-sized
    getAABB() {
        const half = this.size;
        return {
            x: this.worldPos.x - half,
            y: this.worldPos.y - half,
            w: this.size,
            h: this.size
        };
    }

    draw(layer, texture) {
        if (!this.visible || !this.scene) return;
        const { x, y } = this.scene.worldToScreen(this.worldPos);
        // const { x, y } = this.scene.worldToScreen({x: 10, y: 1});

        const player = this.p.shared.player;
        if (player) {
            const playerDx = player.worldPos.x - this.worldPos.x;
            const playerDy = player.worldPos.y - this.worldPos.y;
            const playerDist = Math.sqrt(playerDx * playerDx + playerDy * playerDy);
            if (playerDist > 1.0) {
                this.playerAngle = Math.atan2(playerDy, playerDx);
            }
        }

        const dims = 2 * Math.floor(this.pxSize);

        layer.push();
        layer.translate(x, y);
        layer.rotate(this.playerAngle);
        layer.image(this.shapeTexture, 0, 0, dims, dims);
        // layer.translate(-x, -y);
        layer.pop();

        texture.push();
        texture.translate(x, y);
        texture.rotate(this.playerAngle);
        texture.image(this.colorTexture, 0, 0, dims, dims);
        // texture.translate(-x, -y);
        texture.pop();

        // for (let point of this.path) {
        //     const { x, y } = this.scene.worldToScreen(point);
        //     const dims = Math.floor(this.pxSize * 6);
        //     layer.fill(this.color);
        //     texture.fill(this.color);
        //     layer.circle(x, y, dims);
        //     texture.circle(x, y, dims);
        //     // console.log("Drawing path point at:", point, x, y);
        // }
    }
}