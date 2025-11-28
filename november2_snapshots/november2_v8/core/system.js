function systemEventDeviceTurned(p) {
  if (!p.shared) p.shared = {};
  if (!p.shared.debounce) p.shared.debounce = {};

  clearTimeout(p.shared.debounce.deviceTimer);
  p.shared.debounce.deviceTimer = setTimeout(() => {
    if (p.onDeviceTurned) p.onDeviceTurned({ angle, type });
    systemEventWindowResized(p);
  }, p.shared.settings.debounceTime);
}

function resizeHandler(p, cascade = true) {

  const isPortrait = window.innerHeight > window.innerWidth;
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  // let canvasW, canvasH;

  if (isPortrait) {
    p.shared.isPortrait = true;
    // canvasW = screenH;
    // canvasH = screenW;
    p.shared.Debug.log('system', '📱 Portrait mode detected');
  } else {
    p.shared.isPortrait = false;
    // canvasW = screenW;
    // canvasH = screenH;
    p.shared.Debug.log('system', '🖥️ Landscape mode detected');
  }

  p.resizeCanvas(screenW, screenH);
  // applyCanvasStyles(p.shared.mainCanvas?.elt, {
  //   screenW,
  //   screenH,
  //   portrait: p.shared.isPortrait,
  // });

  p.shared.viewport = { width: screenW, height: screenH };
  if (cascade) {
    p.shared.renderer.resize(screenW, screenH);
    p.shared.sceneManager.onResize(screenW, screenH);
  }
  p.shared.Debug.log('system', `Window resized to ${screenW}x${screenH}`);

}

function systemEventWindowResized(p) {
  if (!p.shared) p.shared = {};
  if (!p.shared.debounce) p.shared.debounce = {};

  clearTimeout(p.shared.debounce.resizeTimer);
  p.shared.debounce.resizeTimer = setTimeout(() => {
    resizeHandler(p);
  }, p.shared.settings.debounceTime);
}

function applyCanvasStyles(canvasElt, { screenW, screenH, portrait }) {
  if (!canvasElt) return;
  const s = canvasElt.style;
  s.position = 'absolute';
  s.top = '0';
  s.left = '0';
  s.margin = '0';
  s.padding = '0';
  s.display = 'block';

  if (portrait) {
    s.transform = 'rotate(90deg)';
    s.transformOrigin = 'top left';
    s.translate = `${screenW}px 0`;
  } else {
    s.transform = '';
    s.transformOrigin = '';
    s.translate = '0';
  }
}

export function setupCanvasWithAdaptation(p) {
  const isPortrait = window.innerHeight > window.innerWidth;
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  // p.shared.isPortrait = isPortrait;
  p.shared.mainCanvas = p.createCanvas(screenW, screenH, p.WEBGL);
  resizeHandler(p, false);
}

export function initializeCanvasPostSetup(p) {
  systemEventWindowResized(p);
}

export function registerSystemEvents(p) {
  window.addEventListener('resize', () => systemEventWindowResized(p));
  window.addEventListener('orientationchange', () => systemEventDeviceTurned(p));
  screen.orientation?.addEventListener('change', () => systemEventDeviceTurned(p));

  window.addEventListener('focus', () => p.onWindowFocus?.());
  window.addEventListener('blur', () => p.onWindowBlur?.());
}