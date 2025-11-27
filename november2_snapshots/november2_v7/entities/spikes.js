// Spikes.js
import { BaseEntity } from '../core/BaseEntity.js';

export class Spikes extends BaseEntity {
    constructor(p, config) {
        super(p);

        // hazards are non-physics, static
        this.mainPhysicsParticle = null;
        this.hazard = true;
        this.variation = Math.floor(Math.random() * 4);

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

        if (!p.shared.assets.spikeTexture) {
            p.shared.assets.spikeTexture = [];

        }

        // create shared spike texture once, then reuse
        if (!p.shared.assets.spikeTexture[this.variation]) {
            let g;
            if (this.variation === 0) g = this.variant1();
            else if (this.variation === 1) g = this.variant2();
            else if (this.variation === 2) g = this.variant3();
            else g = this.variant4();
            p.shared.assets.spikeTexture[this.variation] = g;
        }

        // all spikes reference the same graphics object
        this.g = p.shared.assets.spikeTexture[this.variation];
    }

    variant1() {
        const g = this.p.createGraphics(64, 64);
        g.pixelDensity(1);
        g.noSmooth();
        g.elt.getContext("2d").imageSmoothingEnabled = false;

        g.clear();
        g.noStroke();
        g.fill(this.p.shared.chroma.enemy);

        // Base spike shape in absolute canvas coordinates
        g.beginShape();

        // wider base (centered horizontally)
        g.vertex(8, 60);     // x=32-24
        g.vertex(12, 64);     // x=32-24
        g.vertex(22, 54);     // x=32-24
        g.vertex(32, 58);     // x=32-24
        g.vertex(52, 64);    // x=32+24
        g.vertex(56, 60);    // x=32+24

        // right barbs
        g.vertex(48, 42);
        g.vertex(40, 54);
        g.vertex(36, 36);

        // primary tip (center top)
        g.vertex(32, 8);

        // left barbs
        g.vertex(28, 36);
        g.vertex(24, 44);
        g.vertex(16, 42);

        g.endShape(this.p.CLOSE);
        g.fill(this.p.shared.chroma.terrain);

        g.beginShape();

        // wider base (centered horizontally)
        g.vertex(8, 54);     // x=32-24
        g.vertex(24, 64);     // x=32-24
        g.vertex(28, 64);     // x=32-24
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

        g.endShape(this.p.CLOSE);
        return g;
    }

    variant2() {
        const g = this.p.createGraphics(64, 64);
        g.pixelDensity(1);
        g.noSmooth();
        g.elt.getContext("2d").imageSmoothingEnabled = false;

        g.clear();
        g.noStroke();

        // Main spike slightly left-shifted
        g.fill(this.p.shared.chroma.enemy);
        g.beginShape();
        g.vertex(10, 60);
        g.vertex(16, 64);
        g.vertex(24, 48);
        g.vertex(28, 36);
        g.vertex(22, 22);
        g.vertex(26, 12);
        g.vertex(30, 8);
        g.endShape(this.p.CLOSE);

        // Right small spike
        g.beginShape();
        g.vertex(40, 64);
        g.vertex(46, 60);
        g.vertex(48, 48);
        g.vertex(44, 36);
        g.vertex(46, 28);
        g.endShape(this.p.CLOSE);

        // terrain base
        g.fill(this.p.shared.chroma.terrain);
        g.beginShape();
        g.vertex(8, 58);
        g.vertex(52, 58);
        g.vertex(56, 64);
        g.vertex(4, 64);
        g.endShape(this.p.CLOSE);

        return g;
    }

    variant3() {
        const g = this.p.createGraphics(64, 64);
        g.pixelDensity(1);
        g.noSmooth();
        g.elt.getContext("2d").imageSmoothingEnabled = false;

        g.clear();
        g.noStroke();
        g.fill(this.p.shared.chroma.enemy);

        // multiple thin spikes tightly packed
        const bases = [14, 20, 26, 32, 38, 44, 50];
        for (let b of bases) {
            g.beginShape();
            g.vertex(b - 2, 64);
            g.vertex(b + 2, 64);
            g.vertex(b, 48);
            g.vertex(b + (Math.random()*4 - 2), 30);
            g.vertex(b + (Math.random()*6 - 3), 16);
            g.endShape(this.p.CLOSE);
        }

        // terrain connector
        g.fill(this.p.shared.chroma.terrain);
        g.beginShape();
        g.vertex(10, 58);
        g.vertex(54, 58);
        g.vertex(58, 64);
        g.vertex(6, 64);
        g.endShape(this.p.CLOSE);

        return g;
    }

    variant4() {
        const g = this.p.createGraphics(64, 64);
        g.pixelDensity(1);
        g.noSmooth();
        g.elt.getContext("2d").imageSmoothingEnabled = false;

        g.clear();
        g.noStroke();

        // terrain lump/outcrop
        g.fill(this.p.shared.chroma.terrain);
        g.beginShape();
        g.vertex(12, 64);
        g.vertex(52, 64);
        g.vertex(56, 56);
        g.vertex(48, 48);
        g.vertex(32, 44);
        g.vertex(18, 48);
        g.vertex(8, 56);
        g.endShape(this.p.CLOSE);

        // small stud-like spikes
        g.fill(this.p.shared.chroma.enemy);
        const studs = [
            {x:20,y:48}, {x:28,y:46}, {x:36,y:46}, {x:44,y:48},
            {x:26,y:52}, {x:38,y:52}
        ];

        for (let s of studs) {
            g.beginShape();
            g.vertex(s.x - 2, s.y);
            g.vertex(s.x + 2, s.y);
            g.vertex(s.x, s.y - 8);
            g.endShape(this.p.CLOSE);
        }

        return g;
    }

    cleanup() {
        super.cleanup();
        // if (this.g) {
        //     this.g.remove();
        //     this.g = null;
        // }
    }

    init() {
        // this.scene = scene;
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
        const nudge = dims * 0.25;

        layer.push();
        switch (this.direction) {
            case "up":
                layer.translate(x, y + nudge);
                layer.rotate(0);
                break;
            case "down":
                layer.translate(x, y - nudge);
                layer.rotate(p.PI);
                break;
            case "left":
                layer.translate(x + nudge, y);
                layer.rotate(-p.HALF_PI);
                break;
            case "right":
                layer.translate(x - nudge, y);
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