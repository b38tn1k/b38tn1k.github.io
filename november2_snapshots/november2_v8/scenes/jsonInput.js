// imports.js
import { BaseScene } from '../core/BaseScene.js';
import { MyButton } from '../components/myButton.js';
import { Level1Scene } from './level1.js';

export class JsonInputScene extends BaseScene {
    constructor(p, opts = {}) {
        super(p);
        this.textArea = null;
        this.cleaned = false;
        this.onSubmit = opts.onSubmit || null;
    }

    init() {
        this.levelData = this.p.shared.parseLevel(this.p.shared.levels.menu, this.p);
        super.init();                 // we still get renderer, UI layer, dt, etc.

        const uiLayer = this.renderer.layers.uiLayer;
        this.addInGameMenuButtons();
        this.p.shared.player.deactivate();
        if (this.friend) this.friend.deactivate();

        // ---------- DOM Text Area ----------
        this.textArea = this.p.createElement('textarea');
        this.textArea.attribute('spellcheck', 'false');
        this.textArea.style('position', 'absolute');
        this.textArea.style('left', '10%');
        this.textArea.style('top', '20%');
        this.textArea.style('width', '80%');
        this.textArea.style('height', '50%');
        this.textArea.style('padding', '12px');
        this.textArea.style('border', '2px solid #444');
        this.textArea.style('outline', 'none');
        this.textArea.style('resize', 'none');
        this.textArea.value(JSON.stringify(this.p.shared.levels.demo, null, 2));

        // ---------- Submit Button ----------
        const btnSubmit = new MyButton(
            uiLayer.width * 0.60,
            uiLayer.height * 0.8,
            uiLayer.width * 0.25,
            uiLayer.height * 0.08,
            "Play",
            uiLayer,
            () => {
                const text = this.textArea.value();
                this.submitJSON(text);
            },
            this.p
        );
        this.registerUI(btnSubmit);

        this.buttons = { btnSubmit };
    }

    safeClean(raw) {
        // strip control chars except \n, \t
        const printable = raw.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '');
        const trimmed = printable.trim();
        return trimmed;
    }

    submitJSON(text) {
        try {
            const parsed = JSON.parse(text);

            // dynamic name so multiple demos are possible
            const sceneName = 'DEMOSCENE';

            this.p.shared.sceneManager.register(
                sceneName,
                Level1Scene,
                { level: parsed, nextScene: 'menu', chapter: sceneName }
            );

            console.log("Registered new dynamic scene:", sceneName);

            // switch into it immediately?
            this.p.shared.sceneManager.change(sceneName);

        } catch (err) {
            console.warn("Invalid JSON:", err);
        }
    }

    onResize(w, h) {
        super.onResize(w, h);

        const uiLayer = this.renderer.layers.uiLayer;
        const rect = {
            x: uiLayer.width * 0.1,
            y: uiLayer.height * 0.2,
            w: uiLayer.width * 0.8,
            h: uiLayer.height * 0.5
        };

        this.textArea.style('left', rect.x + 'px');
        this.textArea.style('top', rect.y + 'px');
        this.textArea.style('width', rect.w + 'px');
        this.textArea.style('height', rect.h + 'px');

        this.buttons.btnSubmit.x = uiLayer.width * 0.60;
        this.buttons.btnSubmit.y = uiLayer.height * 0.8;
        this.buttons.btnSubmit.updateBounds();
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
                this.drawWorldBoundary(layers.worldLayer);
            }
            for (const entity of this.entities) {
                entity.draw(layers.entitiesLayer, layers.ambientTexture);
            }
            super.draw();
        });
    }

    cleanup() {
        if (this.textArea) {
            this.textArea.remove();
            this.textArea = null;
        }
        super.cleanup();
    }
}