import { BaseScene } from '../core/BaseScene.js';

export class GameOverScene extends BaseScene {
    init() {
        super.init();
        this.Debug.log('level', "Game Over");
        this.p.shared.ui.hide();
        const r = this.p.shared.renderer;
        const player = this.p.shared.player;
        player.deactivate();
        r.reset();
    }

    onActionStart(action) {
        if (action === "pause") this.p.shared.sceneManager.change("menu");
    }

    onKeyPressed(key, keyCode) {
        if (this.p.keyIsPressed && this.p.key === 'm') {
            this.p.shared.sceneManager.change('menu');
        }
    }

    update() {
        const r = this.p.shared.renderer;
        r.markDirty('uiLayer');
        r.markDirty('backgroundLayer');
    }

    draw() {
        const r = this.p.shared.renderer;
        const layers = r.layers;
        r.use('chroma');

        r.drawScene(() => {
            // UI layer (text)
            if (r.layerDirty.uiLayer) {
                layers.uiLayer.textAlign(this.p.CENTER, this.p.CENTER);
                layers.uiLayer.textSize(layers.uiLayer.width / 60);
                const chroma = this.p.shared.chroma;
                const pc = chroma.ui;
                layers.uiLayer.fill(pc[0], pc[1], pc[2], pc[3]);
                layers.uiLayer.text(`Game Over\nPress ${this.p.shared.controls.map.pause} for Menu`, layers.uiLayer.width / 2, layers.uiLayer.height / 2);
            }
        });
    }

    cleanup() {
        this.Debug.log('level', "🧹 Game Over cleanup");
    }

    constructor(p) {
        super(p);
    }
}