Everything is verified. Let me compile the final acceptance report.

## Summary

I created `index.html` — a complete, self-contained, offline playable Snake game. During validation I discovered and fixed **one real bug** that I introduced while editing: the initial snake array was built with body segments *ahead* of the head (wrong for a head-at-index-0 layout), which would have made the snake crash into itself on the very first move when moving right. I corrected the layout so the body sits behind the head (`cx-1, cx-2`), which also makes the "tail vacates on non-eating moves" collision logic correct.

### Verification performed
- **JS syntax:** extracted the `<script>` and ran `node --check` → SYNTAX_OK.
- **Document structure:** DOCTYPE, `<head>`, `<body>`, `<canvas>`, `</html>` all present and closed.
- **Feature checklist (21 checks):** arrows + WASD, Space/P pause, Enter restart, restart button, Pause overlay, `requestAnimationFrame`/`cancelAnimationFrame` loop, localStorage read+write for best score, canvas 2d + `fillRect`, score/best/level elements, `MIN_INTERVAL` speed floor, `Math.random` food spawn, no external/CDN/http/link/script/src assets.
- **Logic simulation (deterministic):**
  - Forward move: head advances, tail vacates, length constant ✓
  - Wall collision on all 4 edges ✓
  - Self collision when body blocks path ✓
  - Eating grows snake by 1 and increases score ✓
  - Head is at index 0 ✓
  - Reverse prevention: moving RIGHT blocks LEFT turn, UP allowed ✓
  - Speed scaling: 150ms → 70ms as score rises, floored at 60ms ✓

### Remaining defects / limitations
- No browser verification possible in this environment (per constraints); validation was via source inspection, syntax check, and logic simulation.
- `REVERSE` helper object maps UP→DOWN etc.; `tryChangeDir` blocks reversing relative to `lastKeyDir`. This is standard and correct for this grid (diagonal/straight-ahead never reverses into self).