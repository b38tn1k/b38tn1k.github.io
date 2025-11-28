import { BaseScene } from '../core/BaseScene.js';
import { SpriteAnimator, BackgroundAnimator } from '../core/AnimationToolkit.js';

export class ArtSceneOne extends BaseScene {
    constructor(p) {
        super(p);
        this.counter = 0;
        this.title = null;
        this.fullScreenArt = {};
        this.fullScreenArt['scene1'] = [p.shared.assets.storyAssets['bg1'], p.shared.assets.storyAssets['bg2'], p.shared.assets.storyAssets['bg3']];
        // i want the transparent one to zoom in and out over the solid one
        this.fullScreenArt['scene2'] = [p.shared.assets.storyAssets['bgStorm'], p.shared.assets.storyAssets['bgStormTrans']];
        this.sprites = {};
        this.sprites['scene1'] = {
            pink: p.shared.assets.storyAssets['ssheetPink'],
            yellow: p.shared.assets.storyAssets['ssheetYellow'],
            pinkPosition: { x: 0.7, y: 0.8 },
            yellowPosition: { x: 0.6, y: 0.8 }
        };
        // these sprites are different drawing variants in each frame, rather than a continuous animation

        this.sprites['scene2'] = {
            lightening: p.shared.assets.storyAssets['ssheetLightening'], // 2 rows, 3 pre row
            waves: p.shared.assets.storyAssets['ssheetWaves'], // 2 rows of 2
        };
        this.lightningInstances = [];
        this.waveInstances = [];
        this.yellowExit = null;
        this.waveInstances3 = [];
        this.bgAnim = new BackgroundAnimator(this.p);
        this.spriteAnim = new SpriteAnimator(this.p);
        this.audioTrack = 'story1';
    }


    drawFade(layer, alpha) {
        layer.push();
        layer.noStroke();
        layer.fill(0, alpha);
        layer.rect(0, 0, this.p.width, this.p.height);
        layer.pop();
    }

    onResize(w, h) {
        super.onResize(w, h);
        this.title = [];
        this.borderGraphic.resizeCanvas(w, h);
        this.borderGraphic.clear();
        this.drawOrganicBorder(this.borderGraphic);
        // this.createTextTitle();
        // this.title.forEach(t => t.onResize?.(this.renderer.layers.entitiesLayer));
    }

    init() {
        this.levelData = this.p.shared.parseLevel(this.p.shared.levels.menu, this.p);
        const [r, player] = super.init();
        this.p.shared.ui.hide();
        player.deactivate();
        this.friend.deactivate();

        r.reset();
        this.startFrame = this.p.frameCount;
        this.counter = 0;
        const Lcount = 3;
        this.lightningInstances = Array.from({ length: Lcount }, (_, i) => {
            const baseX = ((i + 0.5) / Lcount) * this.p.width;
            const jitterX = (Math.random() - 0.5) * (this.p.width * 0.1);
            return {
                x: baseX + jitterX,
                y: this.p.height * 0.1 + Math.random() * (this.p.height * 0.3),
                frameOffset: Math.floor(Math.random() * 60)
            };
        });
        const Wcount = 5;
        this.waveInstances = Array.from({ length: Wcount }, (_, i) => {
            const baseX = ((i + 0.5) / Wcount) * this.p.width;
            const jitterX = (Math.random() - 0.5) * (this.p.width * 0.1);
            return {
                x: baseX + jitterX,
                y: this.p.height * 0.6 + Math.random() * (this.p.height * 0.25),
                speed: -0.2 + Math.random() * 0.4,
                frameOffset: Math.floor(Math.random() * 40)
            };
        });
        this.yellowExit = {
            x: this.p.width * this.sprites['scene1'].yellowPosition.x,
            y: this.p.height * this.sprites['scene1'].yellowPosition.y,
            vx: -this.p.width * 0.003,
            vy: -this.p.height * 0.003,
            rotation: 0
        };
        const W3count = 6;
        this.waveInstances3 = Array.from({ length: W3count }, () => ({
            x: Math.random() * this.p.width,
            y: Math.random() * this.p.height,
            vx: -1.0 - Math.random() * 0.5,
            vy: -0.5 - Math.random() * 0.3,
            frameOffset: Math.floor(Math.random() * 40)
        }));
        this.borderGraphic = this.p.createGraphics(this.p.width, this.p.height);
        this.drawOrganicBorder(this.borderGraphic);
        this.p.shared.audio.play(this.audioTrack, { stopOthers: true });
    }

    drawOrganicBorder(layer) {
        const p = this.p;
        const col = p.shared.chroma.terrain;

        // --- Compute original (non-zoomed) background bounds using bg1 as reference ---
        const img = this.fullScreenArt['scene1'][0];
        const iw = img.width;
        const ih = img.height;
        const vw = p.width;
        const vh = p.height;
        const imgRatio = iw / ih;
        const viewRatio = vw / vh;

        let scale;
        if (imgRatio > viewRatio) {
            scale = vw / iw;
        } else {
            scale = vh / ih;
        }

        const padding = 0.1;
        const drawW = iw * scale * (1 - padding);
        const drawH = ih * scale * (1 - padding);

        const cx = vw / 2;
        const cy = vh / 2;

        const left = cx - drawW / 2;
        const right = cx + drawW / 2;
        const top = cy - drawH / 2;
        const bottom = cy + drawH / 2;

        const noiseScale = 0.5;
        const wobble = 22;
        const t = p.frameCount * 0.01;
        const step = 10;

        layer.push();
        layer.noStroke();
        layer.fill(col);

        // ---- TOP BORDER (screen top to image top) ----
        layer.beginShape();
        // outer edge: full screen width at y=0
        layer.vertex(0, 0);
        layer.vertex(vw, 0);
        // inner, wobbly edge: from right to left
        for (let x = vw; x >= 0; x -= step) {
            let innerY;
            if (x < left || x > right) {
                // outside image span: straight to top edge
                innerY = top;
            } else {
                const n = p.noise(x * noiseScale, t) - 0.5;
                innerY = top + n * wobble;
            }
            layer.vertex(x, innerY);
        }
        layer.endShape(p.CLOSE);

        // ---- BOTTOM BORDER (image bottom to screen bottom) ----
        layer.beginShape();
        // outer edge: full screen width at y=vh
        layer.vertex(vw, vh);
        layer.vertex(0, vh);
        // inner, wobbly edge: from left to right
        for (let x = 0; x <= vw; x += step) {
            let innerY;
            if (x < left || x > right) {
                innerY = bottom;
            } else {
                const n = p.noise(x * noiseScale, t + 20) - 0.5;
                innerY = bottom + n * wobble;
            }
            layer.vertex(x, innerY);
        }
        layer.endShape(p.CLOSE);

        // ---- LEFT BORDER (screen left to image left) ----
        layer.beginShape();
        // outer edge: full screen height at x=0
        layer.vertex(0, 0);
        layer.vertex(0, vh);
        // inner, wobbly edge: from bottom to top
        for (let y = vh; y >= 0; y -= step) {
            let innerX;
            if (y < top || y > bottom) {
                innerX = left;
            } else {
                const n = p.noise(y * noiseScale, t + 40) - 0.5;
                innerX = left + n * wobble;
            }
            layer.vertex(innerX, y);
        }
        layer.endShape(p.CLOSE);

        // ---- RIGHT BORDER (image right to screen right) ----
        layer.beginShape();
        // outer edge: full screen height at x=vw
        layer.vertex(vw, vh);
        layer.vertex(vw, 0);
        // inner, wobbly edge: from top to bottom
        for (let y = 0; y <= vh; y += step) {
            let innerX;
            if (y < top || y > bottom) {
                innerX = right;
            } else {
                const n = p.noise(y * noiseScale, t + 60) - 0.5;
                innerX = right + n * wobble;
            }
            layer.vertex(innerX, y);
        }
        layer.endShape(p.CLOSE);

        layer.pop();
    }


    // onKeyPressed(key, keyCode) {
    //     super.onKeyPressed(key, keyCode);
    //     this.p.shared.sceneManager.change('test');
    // }

    update() {
        const r = this.renderer;
        if (this.recentlyLaunchedScene || this.recentlyChangedScene) {
            r.markDirty('backgroundLayer');
            r.markDirty('uiLayer');
        }
        r.markDirty('entitiesLayer');
    }

    draw() {
        const r = this.renderer;
        const layers = r.layers;
        const entitiesLayer = layers.entitiesLayer;
        const textureLayer = layers.ambientTexture;

        // compute elapsed time in seconds at 30FPS
        const elapsedSec = (this.p.frameCount - this.startFrame) / 30;

        r.drawScene(() => {
            super.draw();
            this.storyLogic(elapsedSec, entitiesLayer, textureLayer);


        });
    }

    storyLogic(elapsedSec, entitiesLayer, textureLayer) {
        if (elapsedSec < 6) {
            // ---- Scene 1 ----
            this.sceneOne(entitiesLayer, textureLayer);
            entitiesLayer.imageMode(this.p.CORNER);
            entitiesLayer.image(this.borderGraphic, 0, 0);

        } else if (elapsedSec < 9) {
            // ---- Scene 2 ----
            this.sceneTwo(entitiesLayer, textureLayer);
            entitiesLayer.imageMode(this.p.CORNER);
            entitiesLayer.image(this.borderGraphic, 0, 0);

        } else if (elapsedSec < 18) {
            // ---- Scene 3 ----
            this.sceneThree(entitiesLayer, textureLayer);

            // fade between 16s → 17s
            const fadeT = this.p.constrain(
                (elapsedSec - 16) / (17 - 16),
                0, 1
            );
            this.drawFade(textureLayer, fadeT * 255);

            entitiesLayer.imageMode(this.p.CORNER);
            entitiesLayer.image(this.borderGraphic, 0, 0);

        } else {
            // ---- End ----
            this.p.shared.sceneManager.change('level1level');
        }
    }

    sceneTwo(entitiesLayer, textureLayer) {
        entitiesLayer.background(this.p.shared.chroma.ambient);
        textureLayer.imageMode(this.p.CENTER);
        const bgImages = this.fullScreenArt['scene2'];
        const solidBg = bgImages[0];
        const transBg = bgImages[1];
        this.bgAnim.drawAspectCorrect(textureLayer, solidBg, this.p.shared.chroma.terrain);

        // zooming transparent layer
        const scaleFactor = 1 + 0.05 * Math.sin(this.p.frameCount * 0.05);
        textureLayer.push();
        // textureLayer.translate(this.p.width / 2, this.p.height / 2);
        textureLayer.scale(scaleFactor);
        textureLayer.imageMode(this.p.CENTER);
        this.bgAnim.drawAspectCorrect(textureLayer, transBg);
        textureLayer.pop();

        this.spriteAnim.drawLightning(textureLayer, this.sprites['scene2'].lightening, this.lightningInstances, 3, 2, 5);
        this.spriteAnim.drawWaveGrid(textureLayer, this.sprites['scene2'].waves, this.waveInstances, 2, 2, 10);
    }

    sceneOne(entitiesLayer, textureLayer) {
        entitiesLayer.background(this.p.shared.chroma.ambient);
        textureLayer.imageMode(this.p.CENTER);
        this.bgAnim.drawPingPong(textureLayer, this.fullScreenArt['scene1'], 30);
        this.spriteAnim.drawPingPong(textureLayer, this.sprites['scene1'].pink, this.sprites['scene1'].pinkPosition, 3, 10);
        this.spriteAnim.drawPingPong(textureLayer, this.sprites['scene1'].yellow, this.sprites['scene1'].yellowPosition, 3, 10);
    }

    sceneThree(entitiesLayer, textureLayer) {
        entitiesLayer.background(this.p.shared.chroma.ambient);
        textureLayer.imageMode(this.p.CENTER);

        this.bgAnim.drawPingPong(textureLayer, this.fullScreenArt['scene1'], 30);
        this.spriteAnim.drawPingPong(textureLayer, this.sprites['scene1'].pink, this.sprites['scene1'].pinkPosition, 3, 10);

        this.yellowExit.x += this.yellowExit.vx;
        this.yellowExit.y += this.yellowExit.vy;
        this.yellowExit.rotation += 0.02;

        textureLayer.push();
        textureLayer.translate(this.yellowExit.x, this.yellowExit.y);
        textureLayer.rotate(this.yellowExit.rotation);

        const yellowSheet = this.sprites['scene1'].yellow;
        const yw = yellowSheet.width / 3;
        const yh = yellowSheet.height;
        textureLayer.image(
            yellowSheet,
            0, 0,
            yw, yh,
            0, 0, yw, yh
        );
        textureLayer.pop();

        this.spriteAnim.drawWaveGrid(textureLayer, this.sprites['scene2'].waves, this.waveInstances3, 2, 2, 10);
    }

    cleanup() {
        this.Debug.log('level', "🧹 Story cleanup");

        // stop audio
        this.p.shared.audio.stop(this.audioTrack);
        this.p.shared.audio.stopAll?.();

        // clear sprite instances
        this.lightningInstances.length = 0;
        this.waveInstances.length = 0;
        this.waveInstances3.length = 0;
        this.yellowExit = null;

        // graphics cleanup
        if (this.borderGraphic) {
            this.borderGraphic.remove();
            this.borderGraphic = null;
        }

        // clear layers
        this.renderer.layers.entitiesLayer.clear();
        this.renderer.layers.ambientTexture.clear?.();
        this.renderer.layers.worldLayer.clear?.();

        // reset counters
        this.counter = 0;
        this.startFrame = 0;

        // ensure tint doesn't leak
        // this.renderer.layers.entitiesLayer.noTint?.();
        // this.renderer.layers.ambientTexture.noTint?.();

        // deactivate actors if needed
        // this.friend?.deactivate?.();
        // this.p.shared.player?.deactivate?.();

        super.cleanup();
    }
}