export function createTiming(p) {
  const timing = {
    delta: 0,
    lastTime: 0,
    accumulator: 0,
    step: 1 / p.shared.settings.fps,
    elapsed: 0,

    update() {
      const now = p.millis() / 1000;
      this.delta = now - this.lastTime;
      this.lastTime = now;

      // Prevent spiral of death if a frame stalls
      if (this.delta > 0.25) this.delta = 0.25;

      this.accumulator += this.delta;
      this.elapsed += this.delta;
    },

    shouldStep() {
      if (this.accumulator >= this.step) {
        this.accumulator -= this.step;
        return true;
      }
      return false;
    },

    getAlpha() {
      // interpolation factor for rendering between fixed steps
      return this.accumulator / this.step;
    },

    every(seconds) {
      // helper for periodic events
      return Math.floor(this.elapsed / seconds) !== Math.floor((this.elapsed - this.delta) / seconds);
    },
  };

  p.shared.timing = timing;
  return timing;
}