import { ArtSceneOne } from './story1.js';

export class ArtSceneTwo extends ArtSceneOne {
    constructor(p) {
        super(p);
        this.audioTrack = 'story2';
    }

    storyLogic(elapsedSec, entitiesLayer, textureLayer) {
        if (elapsedSec < 6) {
            // ---- Scene 1 ----
            this.sceneOne(entitiesLayer, textureLayer);
            entitiesLayer.imageMode(this.p.CORNER);
            entitiesLayer.image(this.borderGraphic, 0, 0);
        } else if (elapsedSec < 8) {
            this.sceneOne(entitiesLayer, textureLayer);
            const fadeT = this.p.constrain(
                (elapsedSec - 6) / (8 - 6),
                0, 1
            );
            this.drawFade(textureLayer, fadeT * 255);
            entitiesLayer.imageMode(this.p.CORNER);
            entitiesLayer.image(this.borderGraphic, 0, 0);
        } else {
            // ---- End ----
            this.p.shared.sceneManager.change('menu');
        }
    }

}