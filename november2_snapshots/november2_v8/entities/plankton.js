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
        this.restlessness = p.random() * 3 + 1;
        const reefColors = [
            p.color('#FF40D9'),   // coral pink
            p.color('#14D2C8'),   // turquoise reef
            p.color('#B4FF6E'),   // lime-yellow biolume
            p.color('#DC5AFF'),   // violet sea sponge
            p.color('#FFA52D')    // orange anthias

        ];
        this.color = p.random(reefColors);
        this.color2 = p.random(reefColors);

        this.mainPhysicsParticle = this.createPhysicsParticle(
            0, 0,      // x,y
            3,         // mass
            true,      // main
            false      // fixed
        );

        this.mainPhysicsParticle.updateRadii(BODY_RADIUS, this.size);
        this.mainPhysicsParticle.addForce(this.p.random(-1, 1) * this.speed, this.p.random(-1, 1) * this.speed);

        const root = this.mainPhysicsParticle;
        root.mass = BODY_MASS;

        this.shapeTexture = p.createGraphics(64, 64);
        this.shapeTexture.pixelDensity(1);
        this.shapeTexture.noSmooth();
        this.shapeTexture.elt.getContext('2d').imageSmoothingEnabled = false;

        this.colorTexture = p.createGraphics(64, 64);
        this.colorTexture.pixelDensity(1);
        this.colorTexture.noSmooth();
        this.colorTexture.elt.getContext('2d').imageSmoothingEnabled = false;
        this.generateArt();
    }

    init() {
        if (!this.scene || !this.scene.levelData) return;

        const { cols, rows } = this.scene.levelData;

        let tries = 0;
        const maxTries = 200;
        this.generateArt();

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

    cleanup() {
        super.cleanup();
        if (this.shapeTexture) {
            this.shapeTexture.remove();
            this.shapeTexture = null;
        }
        if (this.colorTexture) {
            this.colorTexture.remove();
            this.colorTexture = null;
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

    generateArt() {
        // https://b38tn1k.github.io/#demos/lumpy-space
        function randomInRange(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        function invader(layer, layer2, x, y, pixelSize, scolor, tcolor, rcolor) {
            //crab 8 x 11
            //squid 8 x 8
            //octopus 8 x 12
            let invLength = randomInRange(2, 4);
            let invHeight = randomInRange(3, 5);
            layer.fill(scolor);
            layer.stroke(scolor);
            layer2.fill(tcolor);
            layer2.stroke(tcolor);

            let maxVal = 0.0;
            let sum = 0;
            let count = 0;
            const grid = Array.from({ length: invLength }, (_, i) =>
                Array.from({ length: invHeight }, (_, j) => {
                    let val = Math.random() * 2;
                    val += Math.sin(Math.PI * 90 * i / invLength / 180);
                    val += Math.sin(Math.PI * 180 * j / invHeight / 180);

                    maxVal = Math.max(maxVal, val);
                    return val;
                })
            );

            // Normalizing and calculating the threshold
            grid.forEach(row => row.forEach((cell, j) => {
                const normalizedCell = cell / maxVal;
                row[j] = normalizedCell;
                sum += normalizedCell;
                count++;
            }));
            const threshold = sum / count;

            // Drawing part
            for (let isMirrored of [false, true]) {
                for (let i = 0; i < invLength; i++) {
                    for (let j = 0; j < invHeight; j++) {
                        if (grid[isMirrored ? invLength - i - 1 : i][j] > threshold) {
                            const xPos = x + (isMirrored ? i : i - invLength) * pixelSize;
                            const yPos = y + j * pixelSize - Math.floor(invHeight / 2) * pixelSize;
                            if (i % 2 == 0) {
                                layer2.fill(tcolor);
                                layer2.stroke(tcolor);
                            } else {
                                layer2.fill(rcolor);
                                layer2.stroke(rcolor); 
                            }
                            layer.rect(xPos, yPos, pixelSize, pixelSize);
                            layer2.rect(xPos, yPos, pixelSize, pixelSize);
                        }
                    }
                }
            }
        }
        invader(this.shapeTexture, this.colorTexture, this.shapeTexture.width / 2, this.shapeTexture.height / 2, 4, this.p.shared.chroma.ambient, this.color, this.color2);
        // this.shapeTexture

    }

    draw(layer, texture) {
        if (!this.visible || !this.scene) return;
        const { x, y } = this.scene.worldToScreen(this.worldPos);
        const dims = Math.floor(this.pxSize * 6);
        layer.imageMode(this.p.CENTER);
        layer.image(this.shapeTexture, x, y, dims, dims);
        texture.imageMode(this.p.CENTER);
        texture.image(this.colorTexture, x, y, dims, dims);

        // this.colorTexture
        // texture.rectMode(this.p.CENTER);
        // texture.noStroke();
        // texture.fill(this.color);
        // texture.circle(x, y, dims/2);

        // layer.fill(this.p.shared.chroma.ambient);
        // layer.noStroke();
        // layer.circle(x, y, this.pxSize);
    }
}