All checks pass. The file is complete, self-contained, and verified.

## What I built

A single self-contained offline `index.html` (17.7 KB) implementing a polished Snake game in the project directory.

**Features delivered:**
- **Controls**: Arrow keys + WASD to steer
- **Food/growth/scoring**: Food spawns off the snake body; eating grows the snake and increments score (shown live)
- **Wall collision** (out of bounds) and **self collision** (looping into your own body) → game over. Self-collision correctly allows moving into the tail's vacating cell unless eating.
- **Pause/resume** (Space) and **restart** (Enter or the overlay button)
- **Increasing difficulty**: step interval = `max(60ms, 140 − 7·score)`, so it speeds up with each food eaten
- **Rendering**: centered 480×480 canvas (20×20 grid, 24px cells), gradient snake body, eyes that follow direction, glowing food, start screen, pause overlay, and game-over overlay
- **High score** persisted via `localStorage` (safe under private-mode guards)
- **Sound**: tiny WebAudio blips (eat/pause/game-over), toggleable, unlocked on first click — no external assets

**Design decisions:** 140 ms base step, 60 ms floor, 7 ms/food; fixed-timestep loop with an accumulator + frame-skew clamp for smooth, stable speed across refresh rates; reversed-steering blocked (including queued double-turns) to avoid self-inflicted instant death.

**Verification performed** (browser unavailable, so source/runtime checks):
- Inline JS parses and executes cleanly under stubbed browser APIs (`Final parse & run: OK`)
- Logic simulation: straight-run wall death confirmed; spiral self-collision triggers death; 180° reversal is blocked; eat → score++ + interval drops to `max(60, 140−7·score)`; `spawnFood()` always loops until off-body (verified across a long no-collision run); no food ever overlaps the body
- Structural scan: `<!DOCTYPE>`, inline `<style>`/`<script>`, canvas/score/best/overlay/button/keydown/Space/Enter all present; **zero** external script tags or `http(s)` style/asset references → truly offline; file opens directly via `file://`
- Existing files left intact; temporary test files removed

**Residual risks:** No in-browser execution was possible in this environment (by design), so visual layout/positioning is validated by structure and logic, not by live rendering. All game mechanics verified via headless simulation.