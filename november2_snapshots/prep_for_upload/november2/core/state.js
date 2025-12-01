// core/state.js
export function createGameState() {
  const state = {
    running: true,
    score: 0,
    level: 1,
    paused: false,
    settings: {},

    togglePause() {
      this.paused = !this.paused;
      // console.log(this.paused ? "⏸️ Paused" : "▶️ Resumed");
    },
  };

  return state;
}