import { BaseScene } from '../core/BaseScene.js';
import { WobbleText } from '../components/WobbleText.js';
import { MyButton } from '../components/myButton.js';

export class ChapterScene extends BaseScene {
    constructor(p, opts) {
        super(p);
        this.title = null;
        this.levelLabels = opts.levels;
        console.log('chapter levels', this.levelLabels);
    }

    init() {
        super.init();
        this.p.shared.ui.hide();
        const r = this.renderer;
        const player = this.p.shared.player;
        player.deactivate();
        this.title = [];
        this.addInGameMenuButtons();
        this.addLevelButtons();
        r.reset();
    }

    onResize(w, h) {
        super.onResize(w, h);
        this.title.forEach(t => t.onResize?.(this.renderer.layers.entitiesLayer));
    }

    addLevelButtons() {
        const layer = this.renderer.layers.uiLayer;
        const W = layer.width;
        const H = layer.height;

        const rowWidth = W * 0.5;          // row = 1/3 total width
        const btnHeight = H * 0.10;         // 10% screen height
        const y = H * (2 / 3);                // bottom third

        const count = this.levelLabels.length;
        const padding = rowWidth * 0.05;    // 5% relative internal spacing
        const totalPadding = padding * (count - 1);

        const availableWidth = rowWidth - totalPadding;
        const btnWidth = availableWidth / count;

        // center the whole row
        const originX = (W - rowWidth) / 2;

        this.levelLabels.forEach((level, i) => {
            const x = originX + i * (btnWidth + padding);

            const btn = new MyButton(
                x,
                y,
                btnWidth,
                btnHeight,
                "Level " + level,
                this.renderer.layers.uiLayer,
                () => {
                    // selectable action — replace as needed
                    this.p.shared.sceneManager.change("level" + (level));
                }
            );

            this.registerUI(btn);
        });
    }

    update() {
        const r = this.renderer;
        super.update();
        if (this.recentlyLaunchedScene || this.recentlyChangedScene) {
            r.markDirty('backgroundLayer');
        }
        r.markDirty('uiLayer');
    }

    draw() {
        const r = this.renderer;
        const layers = r.layers;
        // r.use('chroma');

        r.drawScene(() => {
            super.draw();
            for (let t of this.title) {
                t.draw(layers.entitiesLayer);
            }
            this.p.shared.ui.draw(layers.uiLayer);
            super.draw();

        });
    }

    cleanup() {
        this.Debug.log('level', "🧹 Chaptercleanup");
        this.p.shared.ui.show();
        super.cleanup();
        this.title = null;
    }
}