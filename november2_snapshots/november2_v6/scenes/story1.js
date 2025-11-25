import { BaseScene } from '../core/BaseScene.js';
import { WobbleText } from '../components/WobbleText.js';
import { MyButton } from '../components/myButton.js';

export class ArtSceneOne extends BaseScene {
    constructor(p) {
        super(p);
        this.title = null;
        this.fullScreenArt = {};
        this.fullScreenArt['scene1'] = [p.shared.assets.storyAssets['bg1'], p.shared.assets.storyAssets['bg2'], p.shared.assets.storyAssets['bg3']];
        this.sprites = {};
        this.sprites['scene1'] = {
            pink: p.shared.assets.storyAssets['ssP1'],
            yellow: p.shared.assets.storyAssets['ssY1'],
            pinkPosition: { x: 0.8, y: 0.8 },
            yellowPosition: { x: 0.6, y: 0.8 }
        };
    }

    init() {
        super.init();
        this.p.shared.ui.hide();
        const r = this.renderer;
        const player = this.p.shared.player;
        player.deactivate();
        r.reset();
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
        r.drawScene(() => {
            super.draw();
            this.sceneOne(entitiesLayer, textureLayer);

        });
    }

    sceneOne(entitiesLayer, textureLayer) {
        entitiesLayer.background(this.p.shared.chroma.ambient);
        textureLayer.imageMode(this.p.CENTER);
        const bgImages = this.fullScreenArt['scene1'];
        const N = bgImages.length;
        const cycle = Math.floor(this.p.frameCount / 30);
        const idx = cycle % (2 * (N - 1));
        const pingPong = idx < N ? idx : (2 * (N - 1) - idx);
        const bgImage = bgImages[pingPong];
        textureLayer.image(bgImage, this.p.width / 2, this.p.height / 2, this.p.width, this.p.height);

        // on top of texture
        const spriteSheet = this.sprites['scene1'].pink;
        const frameWidth = spriteSheet.width / 3;
        const frameHeight = spriteSheet.height;
        const animCycle = Math.floor(this.p.frameCount / 10);
        const pingIdx = animCycle % (2 * (3 - 1));
        const frameIdx = pingIdx < 3 ? pingIdx : (2 * (3 - 1) - pingIdx);
        textureLayer.imageMode(this.p.CENTER);
        textureLayer.image(spriteSheet, this.p.width * this.sprites['scene1'].pinkPosition.x, this.p.height * this.sprites['scene1'].pinkPosition.y, frameWidth, frameHeight, frameIdx * frameWidth, 0, frameWidth, frameHeight);

        const yellowSheet = this.sprites['scene1'].yellow;
        const yFrameWidth = yellowSheet.width / 3;
        const yFrameHeight = yellowSheet.height;
        const yCycle = Math.floor(this.p.frameCount / 10);
        const yPing = yCycle % (2 * (3 - 1));
        const yAnim = yPing < 3 ? yPing : (2 * (3 - 1) - yPing);
        textureLayer.imageMode(this.p.CENTER);
        textureLayer.image(
            yellowSheet,
            this.p.width * this.sprites['scene1'].yellowPosition.x,
            this.p.height * this.sprites['scene1'].yellowPosition.y,
            yFrameWidth,
            yFrameHeight,
            yAnim * yFrameWidth,
            0,
            yFrameWidth,
            yFrameHeight
        );
    }

    cleanup() {
        this.Debug.log('level', "🧹 Story cleanup");
        this.p.shared.ui.show();
        super.cleanup();
        this.renderer.layers.entitiesLayer.clear();
    }
}