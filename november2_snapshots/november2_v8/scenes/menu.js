import { BaseScene } from '../core/BaseScene.js';
import { WobbleText } from '../components/WobbleText.js';
import { MyButton } from '../components/myButton.js';
import { Plankton } from '../entities/plankton.js';

export class MenuScene extends BaseScene {
    constructor(p) {
        super(p);
        this.title = null;

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
        // this.createTextTitle();
        this.addLevelButtons();
        r.reset();
    }

    createTextTitle() {
        const font = this.p.shared.mainFont;
        const uiLayer = this.renderer.layers.uiLayer;
        const baseWidth = this.renderer.layers.uiLayer.width;
        const baseHeight = this.renderer.layers.uiLayer.height;
        const baseSize = Math.min(baseHeight, baseWidth) / 8;
        this.title.push(new WobbleText(
            this.p,
            font,
            "THE ANENOME",
            baseWidth / 2,   // x
            // baseHeight / 3 - baseSize * 1.3,  // y
            baseHeight / 3 - baseSize,  // y
            baseSize,   // size
            this.renderer.layers.entitiesLayer,
            {
                centered: true,
                outlineOffset: 1,
            }
        ));
        this.title.push(new WobbleText(
            this.p,
            font,
            "OF MY",
            baseWidth / 2,   // x
            // baseHeight / 3 - baseSize * 0.8,  // y
            baseHeight / 3 - baseSize * 0.5,  // y
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
            baseHeight / 3 + (2 * baseSize / 3),  // y
            baseSize * 1.6,   // size
            this.renderer.layers.entitiesLayer,
            {
                centered: true,
                outlineOffset: 1,
            }
        ))
    }

    onResize(w, h) {
        super.onResize(w, h);
        this.title = [];
        // this.createTextTitle();
        // this.title.forEach(t => t.onResize?.(this.renderer.layers.entitiesLayer));
    }

    addLevelButtons(
        labels = ["I", "II", "III"],
        startY = 0.55,
        endY = 0.90
    ) {
        const layer = this.renderer.layers.uiLayer;
        const W = layer.width;
        const H = layer.height;

        // Vertical layout band
        const bandTop = startY * H;
        const bandBottom = endY * H;
        const bandHeight = bandBottom - bandTop;

        // -----------------------------
        // PLAY BUTTON (top of band)
        // -----------------------------
        const playWidth = W * 0.32;
        const playHeight = bandHeight * 0.22;
        const playX = (W - playWidth) / 2;
        const playY = bandTop + bandHeight * 0.30 - playHeight / 2;

        const playBtn = new MyButton(
            playX,
            playY,
            playWidth,
            playHeight,
            "PLAY",
            layer,
            () => this.p.shared.sceneManager.change("level1"),
            this.p
        );
        this.registerUI(playBtn);

        // -----------------------------
        // CHAPTER BUTTONS (row beneath PLAY)
        // -----------------------------
        const count = labels.length;
        if (count === 0) return;

        // How wide the row is allowed to span
        const rowWidth = W * 0.65;

        const chapterBtnHeight = bandHeight * 0.16;
        const chapterBtnWidth = (rowWidth / count) * 0.7;

        const totalButtonsWidth = chapterBtnWidth * count;
        const totalPad = rowWidth - totalButtonsWidth;
        const pad = totalPad / (count + 1);

        // Center horizontally
        const chapterRowStartX = (W - rowWidth) / 2 + pad;

        // Vertical placement of chapter row
        const chaptersY = bandTop + bandHeight * 0.75 - chapterBtnHeight / 2;

        labels.forEach((label, i) => {
            const x = chapterRowStartX + i * (chapterBtnWidth + pad);

            const btn = new MyButton(
                x,
                chaptersY,
                chapterBtnWidth,
                chapterBtnHeight,
                label,
                layer,
                () => this.p.shared.sceneManager.change("chapter" + (i + 1)),
                this.p
            );

            this.registerUI(btn);
        });

        // level edit button
        if (true) {
            const lastElement = this.uiElements[this.uiElements.length - 1];
            const x = lastElement.x + lastElement.w - lastElement.h;
            const y = lastElement.y + lastElement.h * 2;
            const w = lastElement.h;
            const h = lastElement.h;
            const label = "/";
            const btn = new MyButton(
                x,
                y,
                w,
                h,
                label,
                layer,
                () => this.p.shared.sceneManager.change('jsonInput'),
                this.p
            );
            // btn.backgroundColor = this.p.shared.chroma.enemy;

            this.registerUI(btn);

        }


    }

    onKeyPressed(key, keyCode) {
        super.onKeyPressed(key, keyCode);
        // this.p.shared.sceneManager.change('jsonInput');

        // this.p.shared.sceneManager.change('level1');
        // this.p.shared.sceneManager.change('test');
        // this.p.shared.sceneManager.change('endStory');
    }

    update() {
        const [r, player, dt] = super.update();
        if (this.recentlyLaunchedScene || this.recentlyChangedScene) {
            r.markDirty('backgroundLayer');
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

            for (let t of this.title) {
                t.draw(layers.entitiesLayer);
            }
            for (const entity of this.entities) {
                entity.draw(layers.entitiesLayer, layers.ambientTexture);
            }
            layers.entitiesLayer.fill(this.p.shared.chroma.player);
            layers.entitiesLayer.noStroke();
            layers.entitiesLayer.textAlign(layers.entitiesLayer.CENTER, layers.entitiesLayer.CENTER);
            layers.uiLayer.noFill();
            layers.uiLayer.stroke(0);
            layers.uiLayer.textAlign(layers.uiLayer.CENTER, layers.uiLayer.CENTER);

            let textSize = layers.uiLayer.width / 10;
            layers.entitiesLayer.textSize(textSize);
            layers.uiLayer.textSize(textSize);

            const textX = layers.uiLayer.width / 2;
            let anchory = layers.uiLayer.height / 12;

            layers.entitiesLayer.text("THE ANEMONE", textX, anchory);
            layers.uiLayer.text("THE ANEMONE", textX, anchory);

            anchory += layers.uiLayer.height / 8;

            textSize = layers.uiLayer.width / 15;
            layers.entitiesLayer.textSize(textSize);
            layers.uiLayer.textSize(textSize);

            layers.entitiesLayer.text("OF MY", textX, anchory);
            layers.uiLayer.text("OF MY", textX, anchory);
            anchory += layers.uiLayer.height / 8;

            textSize = layers.uiLayer.width / 7;
            layers.entitiesLayer.textSize(textSize);
            layers.uiLayer.textSize(textSize);

            layers.entitiesLayer.text("ANEMONE", textX, anchory);
            layers.uiLayer.text("ANEMONE", textX, anchory);

            super.draw();
        });
    }

    cleanup() {
        this.Debug.log('level', "🧹 Menu cleanup");
        this.p.shared.ui.show();
        super.cleanup();
        this.title = null;
        this.renderer.markDirty('backgroundLayer');
        this.renderer.markDirty('uiLayer');
        this.renderer.markDirty('entitiesLayer');
        this.renderer.markDirty('uiLayer');
    }
}