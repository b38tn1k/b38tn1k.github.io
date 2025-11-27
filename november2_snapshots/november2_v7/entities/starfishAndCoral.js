import { BaseEntity } from '../core/BaseEntity.js';

// starfish and coral grow on rocks and other solid surfaces, the do not move and have no physics particles

export class StarFishAndCoral extends BaseEntity {
    constructor(p) {
        super(p);
        if (!p.shared.assets) p.shared.assets = {};
        if (!p.shared.assets.ambientShapes) p.shared.assets.ambientShapes = {};

        const shapeTypes = ['starfish', 'coral', 'anemone', 'seaCucumber'];
        // const colorTypes = ['striped', 'spotted', 'gradient', 'concentric', 'turing'];
        const colorTypes = ['striped', 'spotted', 'gradient', 'concentric'];//, 'turing'];


        this.colorType = p.random(colorTypes);
        // console.log('selected color type:', this.colorType);

        this.mainPhysicsParticle = null;
        this.reefColors = [
            p.color('#FF40D9'),   // coral pink (existing)
            p.color('#14D2C8'),   // turquoise reef (existing)
            p.color('#B4FF6E'),   // lime-yellow biolume (existing)
            p.color('#DC5AFF'),   // violet sea sponge (existing)
            p.color('#FFA52D'),   // orange anthias (existing)

            p.color('#FF77E9'),   // bright candy coral
            p.color('#1AE0FF'),   // electric aqua
            p.color('#6BFF92'),   // mint biolume
            p.color('#A675FF'),   // lavender reef glow
            p.color('#FF6B3D'),   // hot reef ember
            p.color('#21B39A'),   // deep teal seagrass
            p.color('#FFD366')    // warm sand-light highlight
        ];
        this.color = p.random(this.reefColors);
        this.color2 = p.random(this.reefColors);
        this.color3 = p.random(this.reefColors);
        this.myColors = [this.color, this.color2, this.color3];
        if (!p.shared.assets) p.shared.assets = {};
        if (!p.shared.assets.ambientShapes) p.shared.assets.ambientShapes = {};

        this.targetCount = 3;
        this.shapeTexture = [];

        for (let i = 0; i < this.targetCount; i++) {
            let shapeType = p.random(shapeTypes);
            let cached = p.shared.assets.ambientShapes[shapeType];
            // console.log(p.shared.assets, cached);
            if (!cached) {
                const g = p.createGraphics(64, 64);
                g.pixelDensity(1);
                g.noSmooth();
                g.elt.getContext('2d').imageSmoothingEnabled = false;
                this.drawShapeInto(g, shapeType);
                p.shared.assets.ambientShapes[shapeType] = g;
                cached = g;
            }
            this.shapeTexture[i] = cached;
        }

        this.colorTexture = p.createGraphics(64, 64);
        this.colorTexture.pixelDensity(1);
        this.colorTexture.noSmooth();
        this.colorTexture.elt.getContext('2d').imageSmoothingEnabled = false;
        this.size = 0.3 + Math.random() * 0.5;
        this.pxSize = 10;
        this.generateArt();

        this.positions = [];
    }

    init() {
        if (!this.scene || !this.scene.levelData) return;

        const { cols, rows } = this.scene.levelData;
        this.positions.length = 0;

        this.generateArt();
        this.pxSize = this.size * this.scene.mapTransform.tileSizePx;

        // 1. Collect all solid tiles
        const solidTiles = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const tile = this.scene.getTile(x, y);
                if (tile && tile.solid) {
                    solidTiles.push({ x, y });
                }
            }
        }

        if (solidTiles.length === 0) {
            console.warn("⚠️ No solid tiles found for ambient entities");
            return;
        }

        // 2. Pick up to N positions from the solid tile list
        const max = Math.min(this.targetCount, solidTiles.length);

        for (let i = 0; i < max; i++) {
            const pick = this.p.random(solidTiles);   // p5's random(array) picker
            this.positions.push({
                x: pick.x + Math.random(),
                y: pick.y + Math.random(),
                size: 0.5 + Math.random() * 0.5
            });
        }

        this.visible = this.positions.length > 0;
    }


    cleanup() {
        super.cleanup();
        this.shapeTexture = null;
        if (this.colorTexture) {
            this.colorTexture.remove();
            this.colorTexture = null;
        }
    }

    drawShapeInto(g, shapeKey) {
        g.clear();
        g.push();
        g.noStroke();
        switch (shapeKey) {
            case 'starfish':
                this.drawStarfish(g);
                break;
            case 'coral':
                this.drawCoral(g);
                break;
            case 'anemone':
                this.drawAnemone(g);
                break;
            case 'seaCucumber':
                this.drawSeaCucumber(g);
                break;
        }
        g.pop();
    }

    generateArt() {
        const p = this.p;
        const gColor = this.colorTexture;
        gColor.clear();
        gColor.noStroke();
        // === DRAW COLOR PATTERN ===
        switch (this.colorType) {
            case 'striped':
                this.drawStriped(gColor);
                break;
            case 'spotted':
                this.drawSpotted(gColor);
                break;
            case 'gradient':
                this.drawGradient(gColor);
                break;
            case 'concentric':
                this.drawConcentric(gColor);
                break;
            case 'turing':
                this.drawTuringNoise(gColor);
                break;
        }
    }

    drawStarfish(g) {
        const p = this.p;
        g.push();
        g.translate(32, 32);
        g.noStroke();
        g.fill(this.p.shared.chroma.ambient);
        const arms = 5;
        const radiusOuter = 26;
        const radiusInner = 10;

        g.beginShape();
        for (let i = 0; i < arms * 2; i++) {
            const angle = (p.TWO_PI / (arms * 2)) * i;
            const r = i % 2 === 0 ? radiusOuter : radiusInner;
            g.vertex(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        g.endShape(p.CLOSE);
        g.pop();
    }

    drawCoral(g) {
        const p = this.p;
        g.push();
        g.noStroke();
        g.translate(32, 32);
        g.fill(this.p.shared.chroma.ambient);
        for (let i = 0; i < 14; i++) {
            const a = p.random(p.TWO_PI);
            const len = p.random(15, 30);
            const w = p.random(6, 12);
            g.push();
            g.rotate(a);
            g.rect(0, -w / 2, len, w, w * 0.6);
            g.pop();
        }
        g.pop();
    }

    drawAnemone(g) {
        const p = this.p;
        g.push();
        g.translate(32, 32);
        g.noStroke();

        g.stroke(this.p.shared.chroma.ambient);
        g.strokeWeight(3);
        g.noFill();

        const tentacles = 22;
        for (let i = 0; i < tentacles; i++) {
            const angle = (p.TWO_PI / tentacles) * i;
            const len = p.random(18, 32);

            g.push();
            g.rotate(angle);
            g.beginShape();
            // root at center
            g.vertex(0, 0);
            // control points and tip in local coords
            g.bezierVertex(
                len * 0.25, -len * 0.3,   // first control
                len * 0.6, -len * 0.8,   // second control
                len, -len          // tip
            );
            g.endShape();
            g.pop();
        }

        // optional central body
        g.noStroke();
        g.fill(this.p.shared.chroma.ambient);
        g.circle(0, 0, 14);

        g.pop();
    }

    // drawSeaCucumber(g) {
    //     const p = this.p;
    //     g.fill(this.p.shared.chroma.ambient);
    //     g.noStroke();
    //     g.ellipse(32, 32, 54, 28);
    // }

    drawSeaCucumber(g) {
        const p = this.p;
        g.fill(this.p.shared.chroma.ambient);
        g.noStroke();

        // body
        g.beginShape();
        g.vertex(10, 28);
        g.bezierVertex(10, 16, 54, 16, 54, 28);
        g.bezierVertex(54, 40, 10, 40, 10, 28);
        g.endShape(p.CLOSE);

        // little pod feet
        g.ellipse(18, 40, 6, 3);
        g.ellipse(28, 40, 6, 3);
        g.ellipse(38, 40, 6, 3);
        g.ellipse(48, 40, 6, 3);
    }

    drawStriped(g) {
        const p = this.p;
        g.push();
        g.background(this.myColors[0]);

        g.translate(32, 32);
        g.rotate(Math.random() * p.TWO_PI);

        // draw stripes centered, so they stay inside the 64×64 area
        g.rectMode(p.CENTER);
        g.noStroke();

        for (let i = -32; i < 32; i += 6) {
            g.fill(this.myColors[((i + 32) / 6) % this.myColors.length]);
            g.rect(0, i, 64, 6);
        }

        g.pop();
    }

    drawSpotted(g) {
        const p = this.p;
        g.background(this.myColors[0]);
        g.noStroke();
        for (let i = 0; i < 40; i++) {
            g.fill(this.reefColors[i % this.reefColors.length]);
            g.circle(p.random(64), p.random(64), p.random(4, 10));
        }
    }

    drawGradient(g) {
        const p = this.p;
        g.background(this.myColors[0]);
        g.noStroke();
        for (let y = 0; y < 64; y++) {
            const amt = y / 63;
            g.stroke(p.lerpColor(this.color, this.color2, amt));
            g.line(0, y, 64, y);
        }
    }

    drawConcentric(g) {
        const p = this.p;
        g.background(this.color);
        g.noStroke();
        for (let r = 32; r > 0; r -= 4) {
            g.fill(p.lerpColor(this.color, this.color2, r / 28));
            g.circle(32, 32, r * 2);
        }
    }

    drawTuringNoise(g) {
        const p = this.p;
        g.background(this.myColors[0]);
        g.noStroke();
        for (let y = 0; y < 64; y++) {
            for (let x = 0; x < 64; x++) {
                const n = p.noise(x * 0.012, y * 0.012);
                g.stroke(n > 0.5 ? this.color : this.color2);
                g.point(x, y);
            }
        }
    }

    draw(layer, texture) {
        if (!this.visible || !this.scene) return;
        let dims = Math.floor(this.pxSize);
        layer.imageMode(this.p.CENTER);
        // texture.imageMode(this.p.CENTER);
        let i = 0;
        for (let pos of this.positions) {
            const { x, y } = this.scene.worldToScreen(pos);
            layer.image(this.shapeTexture[i], x, y, dims, dims);
            texture.image(this.colorTexture, x, y, dims, dims);
            i++;
            dims = Math.floor(dims * 0.9);
        }

    }
}