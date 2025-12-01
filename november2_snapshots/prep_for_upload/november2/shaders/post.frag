#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform float uTime;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord;

  vec3 col = texture2D(tex0, uv).rgb;

  float px = 1.0 / 1024.0;

  float dx = length(
      texture2D(tex0, uv + vec2( px, 0.0)).rgb -
      texture2D(tex0, uv + vec2(-px, 0.0)).rgb
  );
  float dy = length(
      texture2D(tex0, uv + vec2(0.0,  px)).rgb -
      texture2D(tex0, uv + vec2(0.0, -px)).rgb
  );
  float edge = clamp(dx + dy, 0.0, 1.0);

  float satAmt = mix(0.3, 1.5, edge);
  float lightAmt = mix(1.15, 0.95, edge);

  float maxc = max(col.r, max(col.g, col.b));
  float minc = min(col.r, min(col.g, col.b));
  float delta = maxc - minc;

  float h = 0.0;
  if (delta > 0.0001) {
      if (maxc == col.r) {
          h = mod(((col.g - col.b) / delta), 6.0);
      } else if (maxc == col.g) {
          h = ((col.b - col.r) / delta) + 2.0;
      } else {
          h = ((col.r - col.g) / delta) + 4.0;
      }
  }
  h /= 6.0;

  float s = (maxc <= 0.0) ? 0.0 : delta / maxc;
  float v = maxc;

  s *= satAmt;
  v *= lightAmt;

  float c = v * s;
  float hh = (h * 6.0);
  float x = c * (1.0 - abs(mod(hh, 2.0) - 1.0));
  vec3 rgb1;

  if (hh < 1.0) rgb1 = vec3(c, x, 0.0);
  else if (hh < 2.0) rgb1 = vec3(x, c, 0.0);
  else if (hh < 3.0) rgb1 = vec3(0.0, c, x);
  else if (hh < 4.0) rgb1 = vec3(0.0, x, c);
  else if (hh < 5.0) rgb1 = vec3(x, 0.0, c);
  else             rgb1 = vec3(c, 0.0, x);

  float m = v - c;
  vec3 finalCol = rgb1 + vec3(m);

  // ---- STARRY NIGHT SWIRL FIELD (Option 1) ----
  float swirlScale = 0.002;
  float swirlFreq  = 14.0;
  float swirlTime  = uTime * 0.25;

  vec2 swirlVec = vec2(
      sin(uv.y * swirlFreq + swirlTime),
      cos(uv.x * swirlFreq - swirlTime)
  ) * swirlScale;

  vec3 swirlCol = texture2D(tex0, uv + swirlVec).rgb;

  // apply swirl BEFORE vignette/diffusion
  finalCol = mix(finalCol, swirlCol, 0.35);

  // ---- VIGNETTE + SOFT DIFFUSION (Option B influence) ----
  // Compute a small blur for diffusion
  vec3 blur =
      texture2D(tex0, uv + vec2(-px, -px)).rgb * 0.15 +
      texture2D(tex0, uv + vec2( px, -px)).rgb * 0.15 +
      texture2D(tex0, uv + vec2(-px,  px)).rgb * 0.15 +
      texture2D(tex0, uv + vec2( px,  px)).rgb * 0.15 +
      texture2D(tex0, uv).rgb             * 0.8;

  // Distance-based vignette (0 at center, 1 at edges)
  vec2 centered = uv - vec2(0.5, 0.5);
  float dist = length(centered) * 1.0;        // scale vignette strength
  float vignette = clamp(dist, 0.0, 1.0);

  // Increase diffusion toward edges
  vec3 diffused = mix(finalCol, blur, vignette * 0.55);

  // Darken edges slightly
  float edgeDarken = mix(1.0, 0.78, vignette);
  finalCol = diffused * edgeDarken;

  gl_FragColor = vec4(finalCol, 1.0);
}