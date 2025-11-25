import { BaseScene } from '../core/BaseScene.js';
import { WobbleText } from '../components/WobbleText.js';
import { MyButton } from '../components/myButton.js';

export class MenuScene extends BaseScene {
    constructor(p) {
        super(p);
        this.title = null;
    }

    init() {
        super.init();
        this.p.shared.ui.hide();
        const r = this.renderer;
        const player = this.p.shared.player;
        player.deactivate();

        this.title = [];
        this.createTextTitle();
        this.addLevelButtons();
        r.reset();
    }

    createTextTitle() {
        const font = this.p.shared.mainFont;
        const uiLayer = this.renderer.layers.uiLayer;
        const baseWidth = this.renderer.layers.uiLayer.width;
        const baseHeight = this.renderer.layers.uiLayer.height;
        const baseSize = baseHeight / 6
        this.title.push(new WobbleText(
            this.p,
            font,
            "THE ANENOME",
            baseWidth / 2,   // x
            baseHeight / 3 - baseSize * 1.3,  // y
            baseSize,   // size
            this.renderer.layers.entitiesLayer,
            {
                centered: true,
                outlineOffset: 2,
            }
        ));
        this.title.push(new WobbleText(
            this.p,
            font,
            "OF MY",
            baseWidth / 2,   // x
            baseHeight / 3 - baseSize * 0.8,  // y
            baseSize / 2,   // size
            this.renderer.layers.entitiesLayer,
            {
                centered: true,
                outlineOffset: 1,
            }
        ))

        this.title.push(new WobbleText(
            this.p,
            font,
            "ANEMONE",
            baseWidth / 2,   // x
            baseHeight / 3 + baseSize / 2,  // y
            baseSize * 1.6,   // size
            this.renderer.layers.entitiesLayer,
            {
                centered: true,
                outlineOffset: 2,
            }
        ))
    }

    onResize(w, h) {
        super.onResize(w, h);
        this.title.forEach(t => t.onResize?.(this.renderer.layers.entitiesLayer));
    }

    addLevelButtons(labels = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"]) {
        const layer = this.renderer.layers.uiLayer;
        const W = layer.width;
        const H = layer.height;

        const rowWidth = W * 0.5;          // row = 1/3 total width
        const btnHeight = H * 0.10;         // 10% screen height
        const y = H * (2 / 3);                // bottom third

        const count = labels.length;
        const padding = rowWidth * 0.05;    // 5% relative internal spacing
        const totalPadding = padding * (count - 1);

        const availableWidth = rowWidth - totalPadding;
        const btnWidth = availableWidth / count;

        // center the whole row
        const originX = (W - rowWidth) / 2;

        labels.forEach((label, i) => {
            const x = originX + i * (btnWidth + padding);

            const btn = new MyButton(
                x,
                y,
                btnWidth,
                btnHeight,
                label,
                this.renderer.layers.uiLayer,
                () => {
                    // selectable action — replace as needed
                    this.p.shared.sceneManager.change("chapter" + (i + 1));
                }
            );

            this.registerUI(btn);
        });
    }

    onKeyPressed(key, keyCode) {
        super.onKeyPressed(key, keyCode);
        this.p.shared.sceneManager.change('story1');
        // this.p.shared.sceneManager.change('test');
    }

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
        // r.use('chroma');

        r.drawScene(() => {
            super.draw();
            for (let t of this.title) {
                t.draw(layers.entitiesLayer);
            }

        });
    }

    cleanup() {
        this.Debug.log('level', "🧹 Menu cleanup");
        this.p.shared.ui.show();
        super.cleanup();
        this.title = null;
    }
}