import { BaseScene } from '../core/BaseScene.js';
import { MyButton } from '../components/myButton.js';
import { Plankton } from '../entities/plankton.js';

export class ChapterScene extends BaseScene {
    constructor(p, opts) {
        super(p);
        this.title = null;
        this.levelLabels = opts.levels;
        this.columns = 3;
    }

    init() {
        this.levelData = this.p.shared.parseLevel(this.p.shared.levels.menu, this.p);
        const [r, player] = super.init();

        for (let i = 0; i < 30; i++) {
            const plankton = new Plankton(this.p);
            this.registerEntity(plankton);
        }
        this.p.shared.ui.hide();
        player.deactivate();
        this.friend.deactivate();

        this.title = [];
        this.addInGameMenuButtons();
        this.addLevelButtons();
        r.reset();
    }

    onResize(w, h) {
        super.onResize(w, h);
        this.title.forEach(t => t.onResize?.(this.renderer.layers.entitiesLayer));
    }

    // addLevelButtons() {
    //     const layer = this.renderer.layers.uiLayer;
    //     const W = layer.width;
    //     const H = layer.height;

    //     const rowWidth = W * 0.85;          // row = 1/3 total width
    //     const btnHeight = H * 0.07;         // 10% screen height
    //     const y = H /2 - btnHeight;                // bottom third

    //     const count = this.levelLabels.length;
    //     const padding = rowWidth * 0.1;    // 5% relative internal spacing
    //     const totalPadding = padding * (count - 1);

    //     const availableWidth = rowWidth - totalPadding;
    //     const btnWidth = availableWidth / count;

    //     // center the whole row
    //     const originX = (W - rowWidth) / 2;

    //     this.levelLabels.forEach((level, i) => {
    //         const x = originX + i * (btnWidth + padding);

    //         const btn = new MyButton(
    //             x,
    //             y,
    //             btnWidth,
    //             btnHeight,
    //             "Level " + level,
    //             this.renderer.layers.uiLayer,
    //             () => {
    //                 // selectable action — replace as needed
    //                 this.p.shared.sceneManager.change("level" + (level));
    //             },
    //             this.p
    //         );

    //         this.registerUI(btn);
    //     });
    // }

    addLevelButtons() {
        const layer = this.renderer.layers.uiLayer;
        const W = layer.width;
        const H = layer.height;

        // --- Configurable ---
        const columns = this.columns;
        const colCount = Math.min(columns, this.levelLabels.length);
        const total = this.levelLabels.length;

        // Compute rows needed
        const rows = Math.ceil(total / columns);

        // Button sizing
        const rowWidth = W * 0.85;
        const btnHeight = H * 0.07;

        // Vertical layout: center the grid block
        const totalHeight = rows * btnHeight + (rows - 1) * (btnHeight * 0.3);
        const originY = (H - totalHeight) / 2;

        const horizontalPadding = rowWidth * 0.05;
        const colTotalPadding = horizontalPadding * (colCount - 1);
        const btnWidth = (rowWidth - colTotalPadding) / colCount;
        const originX = (W - rowWidth) / 2;

        for (let i = 0; i < total; i++) {
            const level = this.levelLabels[i];
            const row = Math.floor(i / columns);
            const col = i % columns;

            const x = originX + col * (btnWidth + horizontalPadding);
            const y = originY + row * (btnHeight * 2.0); // 1.3 gives vertical spacing

            const btn = new MyButton(
                x,
                y,
                btnWidth,
                btnHeight,
                "Level " + level,
                this.renderer.layers.uiLayer,
                () => this.p.shared.sceneManager.change("level" + level),
                this.p
            );

            this.registerUI(btn);
        }
    }

    update() {
        const [r, player, dt] = super.update();
        if (this.recentlyLaunchedScene || this.recentlyChangedScene) {
            // r.markDirty('backgroundLayer');
            r.markDirty('uiLayer');
        }
        r.markDirty('entitiesLayer');
        r.markDirty('uiLayer');
    }

    draw() {
        const r = this.renderer;
        const layers = r.layers;
        r.drawScene(() => {
            if (this.recentlyLaunchedScene || this.recentlyChangedScene) {
                this.drawCurrentsUniformTexture();
                this.drawWorldBoundary(layers.worldLayer);
            }
            for (const entity of this.entities) {
                entity.draw(layers.entitiesLayer, layers.ambientTexture);
            }
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