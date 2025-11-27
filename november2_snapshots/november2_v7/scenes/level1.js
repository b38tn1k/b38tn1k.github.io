import { BaseScene } from '../core/BaseScene.js';
import { Plankton } from '../entities/plankton.js';
import { StarFishAndCoral } from '../entities/starfishAndCoral.js';

export class Level1Scene extends BaseScene {
    constructor(p, opts) {
        super(p, opts);
        this.p = p;
        this.level = opts.level;
    }

    init() {
        // const level = this.p.shared.levels.level2;
        this.levelData = this.p.shared.parseLevel(this.level, this.p);
        const [r, player] = super.init();

        for (let i = 0; i < 30; i++) {
            const plankton = new Plankton(this.p);
            this.registerEntity(plankton);
        }

        for (let i = 0; i < 20; i++) {
            const coral = new StarFishAndCoral(this.p);
            this.registerEntity(coral);
        }
        this.addInGameMenuButtons();
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
        
        r.drawScene(() => {
            if (this.recentlyLaunchedScene || this.recentlyChangedScene) {
                // this.drawTerrainBlocking(layers.worldLayer);
                this.drawCurrentsUniformTexture();
                // this.drawCurrentsLayer(layers.worldLayer, { skipGenerated: true });
                // this.drawCurrentsLayer(layers.worldLayer, { skipGenerated: false });
                this.drawTerrainOrganic(layers.worldLayer, {
                    noiseScale: 3.5,
                    noiseAmp: 0.4,
                    cornerSmooth: 0.45
                });
                this.drawWorldBoundary(layers.worldLayer);
                // this.drawWorldGrid(layers.worldLayer);
            }
            for (const entity of this.entities) {
                entity.draw(layers.entitiesLayer, layers.ambientTexture);
            }
            ui.draw(layers.uiLayer);
            
            super.draw();
        });

    }
}