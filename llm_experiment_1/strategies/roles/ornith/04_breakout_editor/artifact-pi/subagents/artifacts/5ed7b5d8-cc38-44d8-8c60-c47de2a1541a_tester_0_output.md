Verification complete. `index.html` remains at 967 lines (unmodified); only my test file was added.

## Result: PASS

### Evidence

**1. Line 555 now computes the paddle midpoint correctly**
```js
const hit0 = (ball.x - (left + right) / 2) / (paddle.w / 2); // -1..1
```
Correct `(left + right) / 2` form. The buggy `left + right / 2` does **not** appear anywhere in `index.html` (confirmed via `grep` → "NOT present anywhere").

**2. Focused VM reproduction (real `updateBallPaddle` from the shipped file, ball driven into the paddle):**
| Hit | `vx` | `vy` | Verdict |
|-----|------|------|---------|
| center (0) | 0 | −6 | straight up ✓ |
| right edge (1) | +5.196 | −3.0 | deflects right ✓ |
| left edge (−1) | −5.196 | −3.0 | deflects left ✓ |

All 8 physics/assertion checks PASS, including the critical distinctness: `left.vx < center.vx < right.vx`. The values differ by a distinct amount per hit position — direction is correctly controlled.

**3. Discrimination probe** — the buggy formula at true-center gives `hit0 = −2.773`, which would deflect the ball the *wrong way*, confirming the test discriminates and the fix corrects it.

### Notes / residual risks
- `index.html` is unmodified (read-only; only `test_paddle.cjs` was created).
- **Test limitation (stateful sandbox):** The IIFE's `updateBallPaddle` mutates its *own* bound `ball`/`paddle` objects. The simulation drives those via accessor references, so each `run()` re-mutates the shared IIFE ball. Because the fixture was already launched/stepped once at init, the first call sees `speed` already clamped to `MAX_SPEED` (9.5); on subsequent same-speed calls the speed is already at the clamped value and the bounce recomputes cleanly. This is why all three runs used the correct `speed=6` baseline and produced correct, *distinct* results — but I could not independently re-verify the "first call from a truly fresh ball" scenario. The physics is correct regardless.
- No browser automation was used (unavailable), per constraints. The collision path was executed by running the actual shipped inline JS in a Node vm sandbox with stubbed DOM/canvas/localStorage — genuine execution, not string matching.