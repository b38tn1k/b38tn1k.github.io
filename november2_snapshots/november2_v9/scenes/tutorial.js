import { Level1Scene } from './level1.js';
import { MyButton } from '../components/myButton.js';

export class TutorialScene extends Level1Scene {
    constructor(p, opts) {
        super(p, opts);
        this.p = p;
        this.level = opts.level;
    }

    init() {
        super.init();
    }
    drawUICallback(uiLayer, entitiesLayer) {
        uiLayer.textAlign(this.p.CENTER, this.p.CENTER);
        uiLayer.textSize(uiLayer.width / 30);
        uiLayer.fill(100, 100, 255);
        uiLayer.noStroke();
        uiLayer.text("HOLD SPACE TO SINK", uiLayer.width/2, uiLayer.height/3 - uiLayer.textSize()/2);
        uiLayer.text("LET GO AND DRIFT", uiLayer.width/2, uiLayer.height/3 + uiLayer.textSize()/2);
        entitiesLayer.rectMode(this.p.CENTER);
        entitiesLayer.fill(this.p.shared.chroma.terrain);
        entitiesLayer.noStroke();
        const textWidth = 1.2* (uiLayer.textWidth("HOLD SPACE TO SINK")/2);
        const textHeight = uiLayer.textSize() * 1.7;
        entitiesLayer.ellipse(entitiesLayer.width/2, entitiesLayer.height/3, textWidth * 2, textHeight * 2);
    }

    draw() {
        super.draw();
        const ui = this.p.shared.renderer.layers.uiLayer;
    }
}