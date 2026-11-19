Both bugs fixed cleanly. Here's the summary:

**Bug 1 — Double Speed (line 279):** Removed the `/ 2` divisor on `tickInterval`. The comment claimed "half-interval to reduce stutter" but this effectively doubles game speed. Changed to plain `setTimeout(tick, tickInterval)`.

**Bug 2 — Body color gradient (lines 496–498):** Replaced ~10 lines of redundant variable churn (`t2`, `ci`, `nextCi`, `f`) plus a no-op `if/else` block with the three-line simplification using `Math.min(Math.floor(t2 * BODY_COLORS.length), BODY_COLORS.length - 1)` as index. The `nextCi` was never used, and the `if (f > 0)` branch always selected from `BODY_COLORS` directly without any interpolation — so it was dead code.

No game logic, rendering of eyes/tongue, overlays, or CSS was modified.