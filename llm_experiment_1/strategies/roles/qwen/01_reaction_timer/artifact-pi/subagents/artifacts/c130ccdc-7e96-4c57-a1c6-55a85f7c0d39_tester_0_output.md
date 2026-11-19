Now let me inspect the code paths for each bug systematically.

## Verification Report: Reaction Timer Fixes in `index.html`

---

### Bug 1 (CRITICAL) — False-start timer leak

**Fix check: `clearTimeout(waitTimer)` and `isGo = false` BEFORE error message**

In the `handleClick` function, the false-start path (lines ~280–295):
```javascript
if (body.classList.contains('state-ready') && !isGo) {
  e.preventDefault();
  clearTimeout(waitTimer);        // ← cleared first
  isGo = false;                    // ← set immediately after
  isProcessing = true;
  clearMessage();                  // ← Bug 3 fix here too
  var falseMsg = document.createElement('div');
  falseMsg.className = 'false-start-msg';
  falseMsg.textContent = '⚠️ Too early! ...';
  msgArea.appendChild(falseMsg);   // ← message appended LAST
  isProcessing = false;
  return;
}
```

| Check | Status |
|-------|--------|
| `clearTimeout(waitTimer)` called in false-start path | ✅ PASS |
| `isGo = false` set in false-start path | ✅ PASS |
| Both execute **before** message is appended | ✅ PASS (order: clear → reset flag → clear old msg → append new) |
| `return` prevents fall-through to reaction handler | ✅ PASS |

**Evidence:** Source lines 280–295. The timer is killed before any DOM manipulation, and the guard `isProcessing = true` prevents race conditions during message display.

---

### Bug 2 (MAJOR) — Intermediate results-screen flashing

**Fix check: `showReactionResult()` does NOT call `showScreen(resultsScreen)`**

I searched for all calls to `showScreen`:
- `showScreen(idleScreen)` — in `startGame()` ✅
- `showScreen(readyScreen)` — in `nextTrial()` ✅
- `showScreen(resultsScreen)` — only in `finishGame()` ✅

In `showReactionResult()`, the function:
1. Creates/reuses `rt-display` and `rt-unit` elements via `document.createElement('div')` and appends them to **`readyScreen`** (not a separate results screen).
2. Sets body state to `'go'` (green background) — preserving the stimulus visual.
3. Fades in the overlay, waits 1 second, fades out, then calls `callback()`.

```javascript
function showReactionResult(rt, callback) {
  isProcessing = true;
  // ... creates rtDiv/unitDiv and appends to readyScreen:
  if (!rtDiv) {
    rtDiv = document.createElement('div');
    rtDiv.id = 'rt-display';
    readyScreen.appendChild(rtDiv);   // ← overlay on readyScreen, NOT resultsScreen
  }
  // ... sets body state to 'go' (keeps green stimulus visible)
  setTimeout(function() {
    // fade out
    isProcessing = false;
    callback();                         // ← only place advancement happens
  }, 1000);
}
```

| Check | Status |
|-------|--------|
| `showReactionResult()` does NOT call `showScreen(resultsScreen)` | ✅ PASS |
| Overlay elements appended to `readyScreen` | ✅ PASS |
| Body state stays `'go'` (green) during overlay | ✅ PASS |
| Delay is ~1 second (1000ms) | ✅ PASS |
| `finishGame()` is the **only** place results screen built + shown | ✅ PASS |

---

### Bug 3 (MODERATE) — False-start message accumulation

**Fix check: `clearMessage()` called before appending new false-start message**

In the false-start path of `handleClick`:
```javascript
clearMessage();                              // ← clears msgArea.innerHTML = ''
var falseMsg = document.createElement('div');
falseMsg.className = 'false-start-msg';
msgArea.appendChild(falseMsg);              // ← only one message at a time
```

| Check | Status |
|-------|--------|
| `clearMessage()` called before appending new message | ✅ PASS |
| `clearMessage()` sets `msgArea.innerHTML = ''` (full DOM clear) | ✅ PASS |
| No accumulation possible (old messages wiped first) | ✅ PASS |

---

### Additional Checks: New Issues from the Fix

**Check 4a: Dynamic elements (`rt-display`, `rt-unit`) appended to correct parent**

- First trial: neither exists → `readyScreen.appendChild(rtDiv)` and `readyScreen.appendChild(unitDiv)` ✅
- Subsequent trials: element already exists → `rtDiv.style.opacity = '0'` and `rtDiv.classList.remove('show')` (reuse path) ✅
- Elements are never removed from DOM, only toggled via opacity/visibility ✅

**Check 4b: No double-callback invocation**

- `callback()` is called **once** inside the `setTimeout(fn, 1000)` in `showReactionResult()`.
- The callback is either `nextTrial()` or `finishGame()` (mutually exclusive via `if/else` in `handleClick`).
- `isProcessing = true` at start of `showReactionResult()` prevents any concurrent clicks. ✅

**Check 4c: State transition integrity**

Flow for each trial:
1. `nextTrial()` → `setBodyState('ready')` (red) + `showScreen(readyScreen)` + starts timer
2. Timer fires → `goSignal()` → `isGo = true`, `setBodyState('go')` (green)
3. User clicks → `handleClick` sees `isGo === true` → records RT → calls `showReactionResult(rt, callback)`
4. `showReactionResult()` keeps `setBodyState('go')` for 1s → fades overlay → calls callback
5. Callback: if more trials → `nextTrial()` (resets inner circle styles, clears message); else → `finishGame()`

One observation (not a bug): **`clearMessage()` is NOT called inside `showReactionResult()`**. If a user gets a false start on trial N and successfully reacts on trial N+1 before the old false-start message would be cleared (it's only cleared in `nextTrial()` at the top), the old false-start message would briefly coexist with the RT overlay. In practice this is unlikely to manifest because `showReactionResult` takes 1 second — by then, either the user has moved on to a new trial (which clears the message) or the old message is still visible during the RT feedback. This is a **minor UX issue** but not the originally-reported Bug 3.

---

### Summary Table

| Defect | Check | Result |
|--------|-------|--------|
| Bug 1: Timer leak | `clearTimeout` + `isGo=false` before message, with early `return` | ✅ PASS |
| Bug 2: Screen flash | No `showScreen(resultsScreen)` in result path; overlay on readyScreen; `finishGame()` sole builder of results | ✅ PASS |
| Bug 3: Message accumulation | `clearMessage()` called before append | ✅ PASS |
| New: DOM elements | `rt-display`/`rt-unit` created once, reused via opacity toggle | ✅ PASS |
| New: No double-callback | Single `callback()` in setTimeout; `isProcessing` guard active | ✅ PASS |
| Observation | Old false-start message may briefly linger during RT overlay (minor UX) | ⚠️ Minor issue noted, not original defect |

---

### Acceptance Report