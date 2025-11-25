// Spikes.js
import { BaseEntity } from '../core/BaseEntity.js';

export class Spikes extends BaseEntity {
    constructor(p, config) {
        super(p);

        // hazards are non-physics, static
        this.mainPhysicsParticle = null;
        this.hazard = true;

        // up / down / left / right from hazardLegend
        this.direction = config.direction || "up";

        // tile-relative size (slightly smaller than full tile)
        this.size = 1.0;
        this.pxSize = 1; // will be updated in init

        // position in world units (tile center)
        this.worldPos = { x: config.x + 0.5, y: config.y + 0.5 };

        // ensure shared asset cache exists
        if (!p.shared.assets) {
            p.shared.assets = {};
        }

        // create shared spike texture once, then reuse
        if (!p.shared.assets.spikeTexture) {
            const g = p.createGraphics(64, 64);
            g.pixelDensity(1);
            g.noSmooth();
            g.elt.getContext("2d").imageSmoothingEnabled = false;

            g.clear();
            g.noStroke();
            g.fill(p.shared.chroma.enemy);

            // Base spike shape in absolute canvas coordinates
            g.beginShape();

            // wider base (centered horizontally)
            g.vertex(8, 60);     // x=32-24
            g.vertex(12, 64);     // x=32-24
            g.vertex(52, 64);    // x=32+24
            g.vertex(56, 60);    // x=32+24

            // right barbs
            g.vertex(48, 42);
            g.vertex(40, 44);
            g.vertex(36, 36);

            // primary tip (center top)
            g.vertex(32, 8);

            // left barbs
            g.vertex(28, 36);
            g.vertex(24, 44);
            g.vertex(16, 42);

            g.endShape(p.CLOSE);
            g.fill(p.shared.chroma.terrain);

            g.beginShape();

            // wider base (centered horizontally)
            g.vertex(8, 54);     // x=32-24
            g.vertex(24, 64);     // x=32-24
            g.vertex(32, 48);     // x=32-24
            g.vertex(56, 54);    // x=32+24

            // right barbs
            g.vertex(48, 42);
            g.vertex(40, 44);
            g.vertex(36, 36);

            // left barbs
            g.vertex(28, 36);
            g.vertex(24, 44);
            g.vertex(16, 42);

            g.endShape(p.CLOSE);

            p.shared.assets.spikeTexture = g;
        }

        // all spikes reference the same graphics object
        this.g = p.shared.assets.spikeTexture;
    }

    cleanup() {
        super.cleanup();
        // if (this.g) {
        //     this.g.remove();
        //     this.g = null;
        // }
    }

    init(scene) {
        this.scene = scene;
        this.pxSize = this.size * this.scene.mapTransform.tileSizePx;
    }

    generateArt() {
        const p = this.p;
        const g = this.g;
        g.clear();
        g.push();
        g.translate(32, 32);
        g.noStroke();
        g.fill(this.p.shared.chroma.enemy);   // bright, readable in debug

        // draw a simple triangular spike pointing 'up',
        // rotation is applied in draw()
        g.beginShape();
        g.vertex(-22, 20);
        g.vertex(22, 20);
        g.vertex(0, -20);
        g.endShape(p.CLOSE);

        g.pop();
    }

    draw(layer) {
        if (!this.scene) return;

        const p = this.p;
        const { x, y } = this.scene.worldToScreen(this.worldPos);
        const dims = this.pxSize;

        layer.push();
        layer.translate(x, y);

        switch (this.direction) {
            case "up":
                layer.rotate(0);
                break;
            case "down":
                layer.rotate(p.PI);
                break;
            case "left":
                layer.rotate(-p.HALF_PI);
                break;
            case "right":
                layer.rotate(p.HALF_PI);
                break;
        }

        layer.imageMode(p.CENTER);
        layer.image(this.g, 0, 0, dims, dims);
        layer.pop();
    }

    checkCollisionWithPlayer(player) {
        const box = this.getAABB?.();
        if (!box) return false;

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
        const half = this.size * 0.5;
        return {
            x: this.worldPos.x - half,
            y: this.worldPos.y - half,
            w: this.size,
            h: this.size
        };
    }
}