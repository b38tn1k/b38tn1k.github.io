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
      //   });
        
      //   return;
      // }
      if (this.current?.draw) this.current.draw(p);
    },
  };

  p.shared.sceneManager = manager;
  return manager;
}