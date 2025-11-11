// core/debug.js
export const Debug = {
  enabled: true, // master switch

  // Optional subsystem toggles
  flags: {
    controls: false,
    renderer: false,
    system: true,
    player: true,
    level: true,
  },

  log(subsystem, ...args) {
    if (this.enabled && this.flags[subsystem]) {
      console.log(`[${subsystem.toUpperCase()}]`, ...args);
    }
  },

  toggleAll(state) {
    this.enabled = state;
  },

  toggle(subsystem, state) {
    this.flags[subsystem] = state;
  }
};