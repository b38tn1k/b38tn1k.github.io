import { BaseScene } from '../core/BaseScene.js';

export class MenuScene extends BaseScene {
    constructor(p) {
        super(p);
    }

    init() {
        super.init();
        this.Debug.log('level', "📜 Menu initialized");
        this.p.shared.ui.hide();
        const r = this.renderer;
        const player = this.p.shared.player;
        player.deactivate();
        r.reset();
    }

    onKeyPressed(key, keyCode) {
        this.Debug.log('level', `Key pressed in Menu: ${key} (${keyCode})`);
        this.p.shared.sceneManager.change('level1');
    }

    update() {
        const r = this.renderer;
        // Menu rarely changes, but mark UI dirty for blinking text or animation
        r.markDirty('uiLayer');
        r.markDirty('backgroundLayer');
    }

    draw() {
        const r = this.renderer;
        const layers = r.layers;
        r.use('chroma');

        r.drawScene(() => {
            // Background layer
            this.drawRainbowBar(layers.worldLayer);

            // UI layer (text)
            if (r.layerDirty.uiLayer) {
                const chroma = this.p.shared.chroma;
                const pc = chroma.ui;
                layers.uiLayer.fill(pc[0], pc[1], pc[2], pc[3]);
                layers.uiLayer.textAlign(this.p.CENTER, this.p.CENTER);
                layers.uiLayer.textSize(layers.uiLayer.width / 60);
                layers.uiLayer.text("Main Menu\nPress any key to start", layers.uiLayer.width / 2, layers.uiLayer.height / 2);
            }
        });
    }

    cleanup() {
        this.Debug.log('level', "🧹 Menu cleanup");
        this.p.shared.ui.show();
    }
}