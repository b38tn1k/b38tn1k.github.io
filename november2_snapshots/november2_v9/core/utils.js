// Assigns HSL-distributed colors, then remaps disabled groups to background
// Distribute hue only across enabled chroma keys, collapse disabled to background
export function applyChromaMapWithDisable(p, disableMap) {
  const chroma = p.shared.chroma;

  // 1. Collect enabled keys
  const enabledKeys = Object.keys(chroma).filter(k => disableMap[k]);

  // 2. Compute hue spacing only using enabled set
  const count = enabledKeys.length || 1;
  const angle = 255 / count;

  p.colorMode(p.HSL, 255);

  let hue = 0;
  const saturation = 255;
  const lightness = 128;

  // 3. Assign HSL colors only to enabled keys
  for (let key of enabledKeys) {
    chroma[key] = p.color(hue, saturation, lightness);
    hue += angle;
  }

  p.colorMode(p.RGB, 255);

  // 4. Determine background (assumed always present)
  const backgroundColor = chroma["background"];

  // 5. Collapse disabled keys to background
  for (let key in chroma) {
    if (!disableMap[key]) {
      chroma[key] = backgroundColor;
    }
  }
}