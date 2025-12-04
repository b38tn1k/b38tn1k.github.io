// core/controls.js

export async function registerControls(p) {
  const Debug = p.shared.Debug;
  if (!p.shared) p.shared = {};
  if (!p.shared.debounce) p.shared.debounce = {};
  if (!p.shared.debounce.controls) p.shared.debounce.controls = {};
  // Load key mapping from JSON
  const response = await fetch('./config/controls.json');
  const res = await response.json();
  const keyMap = res.keyMap || res;
  p.shared.controls = { map: keyMap, state: {}, lastPressed: {} };

  const delay = res.debounceTime || 50;

  function normalizeKey(k) {
    if (!k) return k;
    if (k === '\u00A0') return ' '; // NBSP → normal space
    if (k.length === 1) return k.toLowerCase();
    return k;
  }

  function debounceControl(keyId, fn) {
    clearTimeout(p.shared.debounce.controls[keyId]);
    p.shared.debounce.controls[keyId] = setTimeout(fn, delay);
  }

  function routeEvent(p, eventName, key, keyCode) {
    const scene = p.shared?.sceneManager?.current;
    const player = p.shared?.player;
    const handlers = [scene, player];
    p.correctedMouseX = p.mouseX;
    p.correctedMouseY = p.mouseY;

    if (eventName === 'onTouchStarted' || eventName === 'onTouchEnded') {
      const sinkKeys = p.shared.controls.map.sink;  // array
      const sinkKey = sinkKeys[0];                  // string, e.g. "s"
      key = sinkKey;
      keyCode = sinkKey.charCodeAt(0);
    }

    // Support both character keys and physical-key identification
    const normKey = normalizeKey(key);
    const physicalKey = (keyCode === 32 ? 'Space' : null);

    const actions = Object.entries(p.shared.controls.map)
      .filter(([_, keys]) =>
        keys.includes(normKey) ||
        (physicalKey && keys.includes(physicalKey))
      )
      .map(([action]) => action);

    for (const handler of handlers) {
      if (!handler) continue;

      // raw key event
      handler[eventName]?.(key, keyCode);

      // mapped action events
      for (const action of actions) {
        if (eventName === 'onKeyPressed' || eventName === 'onTouchStarted')
          handler.onActionStart?.(action);
        if (eventName === 'onKeyReleased' || eventName === 'onTouchEnded')
          handler.onActionEnd?.(action);
      }
    }
  }

  function setKeyState(key, isDown) {
    const normKey = normalizeKey(key);
    for (const action in keyMap) {
      if (
        keyMap[action].includes(normKey) ||
        keyMap[action].includes('Space')
      ) {
        p.shared.controls.state[action] = isDown;
      }
    }
  }

  p.mousePressed = () => debounceControl('mousePressed', () => {
    Debug.log('controls', `Mouse pressed at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMousePressed', p.mouseX, p.mouseY);
  });

  p.mouseReleased = () => debounceControl('mouseReleased', () => {
    Debug.log('controls', `Mouse released at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMouseReleased', p.mouseX, p.mouseY);
  });

  p.mouseMoved = () => debounceControl('mouseMoved', () => {
    Debug.log('controls', `Mouse moved to (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMouseMoved', p.mouseX, p.mouseY);
  });

  p.mouseDragged = () => debounceControl('mouseDragged', () => {
    Debug.log('controls', `Mouse dragged at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onMouseDragged', p.mouseX, p.mouseY);
  });

  p.touchStarted = () => debounceControl('touchStarted', () => {
    Debug.log('controls', `Touch started at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onTouchStarted', p.mouseX, p.mouseY);
  });

  p.touchEnded = () => debounceControl('touchEnded', () => {
    Debug.log('controls', `Touch ended at (${p.mouseX}, ${p.mouseY})`);
    routeEvent(p, 'onTouchEnded', p.mouseX, p.mouseY);
  });

  p.keyPressed = () => {
    const raw = p.key;
    const key = normalizeKey(raw);
    const keyCode = p.keyCode;
    Debug.log('controls', `Key pressed: ${key} (${keyCode})`);
    setKeyState(key, true);
    routeEvent(p, 'onKeyPressed', key, keyCode);
    // record last press time
    p.shared.controls.lastPressed[key] = performance.now();
  };

  p.keyReleased = () => {
    const raw = p.key;
    const key = normalizeKey(raw);
    const keyCode = p.keyCode;
    const releaseTime = performance.now();
    const debounceKey = `keyReleased_${key}`;

    debounceControl(debounceKey, () => {
      if (releaseTime < (p.shared.controls.lastPressed[key] || 0)) return;

      Debug.log('controls', `Key released: ${key} (${keyCode})`);
      setKeyState(key, false);
      routeEvent(p, 'onKeyReleased', key, keyCode);
    });
  };
  // allow querying if a mapped control is active
  p.shared.controls.isActive = (action) => !!p.shared.controls.state[action];
}