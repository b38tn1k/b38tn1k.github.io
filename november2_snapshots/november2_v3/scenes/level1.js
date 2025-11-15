import { BaseScene } from '../core/BaseScene.js';

export class Level1Scene extends BaseScene {
    constructor(p) {
        super(p);
        this.p = p;
    }

    init() {
        const level = this.p.shared.levels.level1;
        this.levelData = this.p.shared.parseLevel(level, this.p);
        const [r, player] = super.init();
        this.Debug.log('level', "🎮 Level 1 started");

    }

    onKeyPressed(key, keyCode) {
        super.onKeyPressed(key, keyCode);
        if (this.p.keyIsPressed && this.p.key === 'l') {
            this.p.shared.sceneManager.change('gameover');
        }
    }

    update() {
        const [r, player, dt] = super.update();
        r.markDirty('uiLayer');
        if (this.recentlyLaunchedScene || this.recentlyChangedScene) {
            this.Debug.log('level', "Marking worldLayer dirty due to recent scene launch/change");
            r.markDirty('worldLayer');
        }
        r.markDirty('entitiesLayer');
    }

    draw() {
        const r = this.p.shared.renderer;
        const ui = this.p.shared.ui;
        const player = this.p.shared.player;
        const layers = r.layers;
        r.use('chroma');
        r.drawScene(() => {
            if (this.recentlyLaunchedScene || this.recentlyChangedScene) {

                // this.drawTerrainBlocking(layers.worldLayer);

                this.drawTerrainOrganic(layers.worldLayer, {
                    noiseScale: 3.5,
                    noiseAmp: 0.4,
                    cornerSmooth: 0.45
                });

                this.drawWorldBoundary(layers.worldLayer);

                this.drawCurrentsLayer(layers.worldLayer);
            }

            player.draw(layers.entitiesLayer);
            ui.draw(layers.uiLayer);
        });
    }

    cleanup() {
        console.log("🧹 Level 1 cleanup");
        const player = this.p.shared.player;
        player.visible = false;
    }
}