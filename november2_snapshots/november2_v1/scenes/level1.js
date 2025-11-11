import { BaseScene } from '../core/BaseScene.js';

export class Level1Scene extends BaseScene {
    constructor(p) {
        super(p);
        this.p = p;
    }

    init() {
        super.init();
        this.Debug.log('level', "🎮 Level 1 started");
        const level = this.p.shared.levels.level1;
        this.levelData = this.p.shared.parseLevel(level, this.p);
        this.computeMapTransform(this.levelData);

        // const this.spawn = levels.level1.this.spawn || { x: 0, y: 0 };
        const player = this.p.shared.player;
        this.Debug.log('level', `Level 1 this.spawn point at (${this.levelData.spawn.x}, ${this.levelData.spawn.y})`);
        // const spawnPx = this.worldToScreen(this.levelData.spawn);
        // this.Debug.log('level', `Level 1 this.spawn point at (${spawnPx.x}, ${spawnPx.y})`);
        // console.log("Spawning player at:", spawnPx);
        player.setScene(this);
        player.reset(this.levelData.spawn);

        const r = this.p.shared.renderer;
        r.reset();
    }

    onResize(w, h) {
        super.onResize(w, h);
        this.Debug.log('level', `🔄 Level 1 onResize called: ${w}x${h}`);
        this.computeMapTransform(this.levelData);

    }

    onActionStart(action) {
        const player = this.p.shared.player;
        player?.onActionStart?.(action);
        if (action === "pause") this.p.shared.sceneManager.change("menu");
    }

    onActionEnd(action) {
        const player = this.p.shared.player;
        player?.onActionEnd?.(action);
    }

    onKeyPressed(key, keyCode) {
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

        r.use('nes');
        r.drawScene(() => {
            if (this.recentlyLaunchedScene || this.recentlyChangedScene) {
                // this.drawBlockingBackground(layers.worldLayer, this.tiles);
                this.drawBlockingBackgroundTransformed(layers.worldLayer, this.levelData.tiles);
            }

            // this.drawRainbowBar(layers.worldLayer);
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