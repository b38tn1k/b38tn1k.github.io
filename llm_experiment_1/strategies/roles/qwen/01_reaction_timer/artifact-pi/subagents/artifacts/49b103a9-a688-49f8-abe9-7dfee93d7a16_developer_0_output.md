All three fixes are verified. Here's what was changed:

**Bug 1 (CRITICAL — timer leak):** Added `clearTimeout(waitTimer)` and `isGo = false` in the false-start handler before showing the error message. This prevents the pending goSignal from firing after a false start.

**Bug 2 (MAJOR — flashing results):** Rewrote `showReactionResult()` to display RT + rating as an overlay on the current green (go) screen for 1 second via dynamically-created/hidden DOM elements, then auto-proceeds to the next trial or final results via callback. Removed all calls to `showScreen(resultsScreen)` from this function — it only fires once in `finishGame()` after all 5 trials. Also fixed `finishGame()` which was blank (only set progress bar) — now builds chart, stats, and trial list before showing results.

**Bug 3 (MODERATE — message accumulation):** Added `clearMessage()` call before appending a new false-start message in the handler, preventing multiple error messages from piling up.

---