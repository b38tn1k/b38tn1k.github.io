// core/sceneManager.js
import { BaseScene } from './BaseScene.js';

export function createSceneManager(p) {
  const manager = {
    scenes: {},
    current: null,
    Debug: p.shared.Debug,
    continue: true,

    register(name, SceneClass, options = {}) {
      // Instantiate the scene class with p
      this.scenes[name] = new SceneClass(p, options);
    },

    onResize(w, h) {
      if (this.current?.onResize) this.current.onResize(w, h);
    },

    change(name) {
      const next = this.scenes[name];
      if (!next) {
        this.Debug.log('system', '[WARN]', `⚠️ Scene "${name}" not found`);
        return;
      }

      if (this.current?.cleanup) this.current.cleanup(p);
      this.current = next;
      this.Debug.log('system', `🎬 Switched to scene: ${name}`);
      this.current.init?.(p);
    },

    update() {
      if (this.current?.update) this.current.update(p);
    },

    draw() {
      // if (p.shared.isPortrait) {
      //   p.shared.renderer.drawScene(() => {
      //       p.background(p.shared.chroma.background);
      //       // p.fill(p.shared.chroma.player);
      //       // p.noStroke();
      //       // p.textAlign(p.CENTER, p.CENTER);
      //       // // layers.uiLayer.noFill();
      //       // // layers.uiLayer.stroke(0);
      //       // // layers.uiLayer.textAlign(layers.uiLayer.CENTER, layers.uiLayer.CENTER);
      //       // let textSize = p.width/10;
      //       // p.textSize(textSize);
      //       // // layers.uiLayer.textSize(textSize);

      //       // const textX = p.width / 2;
      //       // let anchory = p.height / 12;

      //       // p.text("ROTATE PLZ", textX, anchory);
      //       // // layers.uiLayer.text("THE ANEMONE", textX, anchory);
      //   });

      //   return;
      // }

      // if (p.frameCount <= 20) {
      //   p.shared.renderer.drawScene(() => {
      //     p.background(p.shared.chroma.background);
      //   });
      // } else {
      if (this.current?.draw) this.current.draw(p);
      // }
    },
  };

  p.shared.sceneManager = manager;
  return manager;
}