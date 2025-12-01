#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform sampler2D ambientTexture;
uniform sampler2D currentTexture;
uniform vec2 uResolution;
uniform float uTime;

uniform vec4 uChromaPlayer;
uniform vec4 uChromaTerrain;
uniform vec4 uChromaVegetation;
uniform vec4 uChromaStaticVegetation;
uniform vec4 uChromaCurrent;
uniform vec4 uChromaBackground;
uniform vec4 uChromaAmbient;
uniform vec4 uChromaEnemy;

uniform int skipTexture;

varying vec2 vTexCoord;

// --------------------------------------------------------
// Utility noise functions
// --------------------------------------------------------
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}


float voronoi(vec2 x) {
  vec2 n = floor(x);
  vec2 f = fract(x);
  float md = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = vec2(hash(n + g), hash(n + g + 1.23));
      vec2 r = g + o - f;
      float d = dot(r, r);
      md = min(md, d);
    }
  }
  return sqrt(md);
}

// --------------------------------------------------------
// Worley-style caustics helpers for water
// --------------------------------------------------------
float length2(vec2 p) {
  return dot(p, p);
}

float worleyWater(vec2 p) {
  // Squared distance to nearest jittered lattice point
  float d = 1e30;
  for (int xo = -1; xo <= 1; ++xo) {
    for (int yo = -1; yo <= 1; ++yo) {
      vec2 tp = floor(p) + vec2(float(xo), float(yo));
      // Use existing 2D noise as jitter
      float j = noise(tp);
      d = min(d, length2(p - tp - j));
    }
  }
  // Shape into a bright caustic band
  return 3.0 * exp(-4.0 * abs(2.5 * d - 1.0));
}

float fworleyWater(vec2 p) {
  // Layered Worley patterns, animated over time
  float w1 = worleyWater(p * 5.0 + vec2(0.05 * uTime, 0.0));
  float w2 = worleyWater(p * 50.0 + vec2(0.12, -0.10 * uTime));
  float w3 = worleyWater(p * -10.0 + vec2(0.0, 0.03 * uTime));

  float t = w1 * sqrt(w2) * sqrt(sqrt(w3));
  return sqrt(sqrt(sqrt(max(t, 0.0))));
}

// --------------------------------------------------------
// Wave interference helpers (screen-space wave bands)
// --------------------------------------------------------
float wavedx(vec2 position, vec2 direction, float time, float freq) {
  float x = dot(direction, position) * freq + time;
  return exp(sin(x) - 1.0);
}

float getWaves2D(vec2 position, float time) {
  float iter = 0.0;
  float phase = 6.0;
  float speed = 0.7; // slower than reference
  float weight = 1.0;
  float w = 0.0;
  float ws = 0.0;

  for (int i = 0; i < 5; i++) {
    vec2 dir = vec2(sin(iter), cos(iter));
    float res = wavedx(position, dir, speed * time, phase);
    w += res * weight;
    ws += weight;
    iter += 12.0;
    weight *= 0.75;
    phase *= 1.18;
    speed *= 1.05;
  }
  return w / ws;
}

// Octave-like sum of two wave fields (inspired by sea_octave)
float sea_octaveWater(vec2 uv, float choppy, float time) {
  float wA = getWaves2D(uv * choppy, time);
  float wB = getWaves2D(uv, time);
  return wA + wB;
}

// --------------------------------------------------------
// Nebula-style soft field (inspired by volumetric fractal)
// --------------------------------------------------------
float nebulaLayer(vec2 uv, float time) {
  // Lift 2D UV into a pseudo-3D orbit space
  vec3 p = vec3((uv - 0.5) * 3.0, 0.7);
  p.z += time * 0.3;

  float accum = 0.0;
  float glow = 0.0;
  vec3 pp = p;

  // Low iteration count compared to reference to keep it cheap
  for (int i = 0; i < 8; i++) {
    pp = abs(pp) / dot(pp, pp) - 0.7;
    float lenP = length(pp);
    accum += lenP;
    glow += exp(-abs(lenP - 0.25) * 4.0);
  }

  // Normalize and clamp to a soft 0..1 band
  float a = accum / 8.0;
  float g = glow * 0.25;

  // Combine into a smooth "foggy" field, less dotty than Worley alone
  float field = g / (1.0 + a * a);
  return clamp(field, 0.0, 1.0);
}

// --------------------------------------------------------
// Lightweight volumetric band (inspired by fractal tunnel)
// --------------------------------------------------------
float volumetricBand(vec2 uv, float time) {
  // Screen-space to "ray" space
  vec2 cuv = uv - 0.5;
  cuv.y *= uResolution.y / uResolution.x;
  vec3 dir = normalize(vec3(cuv * 0.5, 1.0));

  // Scrolling origin similar to the reference
  vec3 from = vec3(1.0, 0.5, 0.5);
  from += vec3(time * 1.0, time * 0.5, -1.5);
  float tile = 0.85;
  from = mod(from, tile) - tile * 0.5;

  float s = 0.1;
  float fade = 1.0;
  float accum = 0.0;

  const int VOL_STEPS = 10;
  const int ORBIT_ITERS = 6;
  for (int r = 0; r < VOL_STEPS; r++) {
    vec3 p = from + s * dir * 0.5;

    float a = 0.0;
    float pa = 0.0;
    for (int i = 0; i < ORBIT_ITERS; i++) {
      p = abs(p) / dot(p, p) - 0.7;
      a += abs(p.x + p.y + p.z);
      pa += exp(-abs(length(p) - 0.2) * 3.0);
    }

    a *= a * a;
    accum += a * fade;

    fade *= 0.73;
    s += 0.12;
  }

  accum /= float(VOL_STEPS);

  // Very gentle scaling to avoid overpowering the base
  float field = accum * 0.0025;
  return clamp(field, 0.0, 1.0);
}

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
                   0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb); // smootherstep for softer transitions
  return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 rgb2hsv(vec3 c) {
  float maxC = max(c.r, max(c.g, c.b));
  float minC = min(c.r, min(c.g, c.b));
  float delta = maxC - minC;

  float h = 0.0;
  if (delta > 0.00001) {
    if (maxC == c.r) {
      h = (c.g - c.b) / delta;
    } else if (maxC == c.g) {
      h = 2.0 + (c.b - c.r) / delta;
    } else {
      h = 4.0 + (c.r - c.g) / delta;
    }
    h /= 6.0;
    if (h < 0.0)
      h += 1.0;
  }

  float s = maxC <= 0.0 ? 0.0 : (delta / maxC);
  float v = maxC;

  return vec3(h, s, v);
}

// --------------------------------------------------------
// Chroma snapping and classification
// --------------------------------------------------------
vec4 snapChroma(vec4 maskColor) {
  float dPlayer = distance(maskColor.rgb, uChromaPlayer.rgb);
  float dEnemy = distance(maskColor.rgb, uChromaEnemy.rgb);
  float dTerrain = distance(maskColor.rgb, uChromaTerrain.rgb);
  float dBackground = distance(maskColor.rgb, uChromaBackground.rgb);
  float dCurrents = distance(maskColor.rgb, uChromaCurrent.rgb);
  float dAmbient = distance(maskColor.rgb, uChromaAmbient.rgb);

  float minD = dPlayer;
  vec4 snapped = uChromaPlayer;

  if (dEnemy < minD) {
    minD = dEnemy;
    snapped = uChromaEnemy;
  }
  if (dTerrain < minD) {
    minD = dTerrain;
    snapped = uChromaTerrain;
  }
  if (dBackground < minD) {
    minD = dBackground;
    snapped = uChromaBackground;
  }
  if (dCurrents < minD) {
    minD = dCurrents;
    snapped = uChromaCurrent;
  }
  if (dAmbient < minD) {
    minD = dAmbient;
    snapped = uChromaAmbient;
  }

  return snapped;
}

void classifyMask(vec4 snapped, out bool isTerrain, out bool isBackground,
                  out bool isCurrent, out bool isPlayer, out bool isEnemy,
                  out bool isAmbient, out bool isVegetation,
                  out bool isStaticVegetation) {
  float eps = 0.01;

  isTerrain = distance(snapped.rgb, uChromaTerrain.rgb) < eps;
  isBackground = distance(snapped.rgb, uChromaBackground.rgb) < eps;
  isCurrent = distance(snapped.rgb, uChromaCurrent.rgb) < eps;
  isPlayer = distance(snapped.rgb, uChromaPlayer.rgb) < eps;
  isEnemy = distance(snapped.rgb, uChromaEnemy.rgb) < eps;
  isAmbient = distance(snapped.rgb, uChromaAmbient.rgb) < eps;
  isVegetation = distance(snapped.rgb, uChromaVegetation.rgb) < eps;
  isStaticVegetation = distance(snapped.rgb, uChromaStaticVegetation.rgb) < eps;
}

// --------------------------------------------------------
// Player outline detection
// --------------------------------------------------------
bool isPlayerAt(vec2 uv) {
  float eps = 0.05;
  vec4 mc = texture2D(tex0, uv);
  return distance(mc.rgb, uChromaPlayer.rgb) < eps;
}

bool isPlayerEdge(vec2 uv) {
  // Sample surrounding texels; if any are player but this one is not,
  // we consider this pixel part of the outline.
  float o = 1.0 / 380.0;

  vec2 offsets[8];
  offsets[0] = vec2(-o, 0.0);
  offsets[1] = vec2(o, 0.0);
  offsets[2] = vec2(0.0, -o);
  offsets[3] = vec2(0.0, o);
  offsets[4] = vec2(-o, -o);
  offsets[5] = vec2(o, -o);
  offsets[6] = vec2(-o, o);
  offsets[7] = vec2(o, o);

  for (int i = 0; i < 8; i++) {
    if (isPlayerAt(uv + offsets[i])) {
      return true;
    }
  }
  return false;
}

vec4 renderPlayerOutline() { return vec4(0.0, 0.0, 0.0, 1.0); }

// --------------------------------------------------------
// Player shader  vibrant pink starfish with speckles
// --------------------------------------------------------
vec4 renderPlayerStarfish(vec2 uv) {
  vec2 p = uv;

  // Base vibrant starfish color
  vec3 basePink = vec3(1.00, 0.25, 0.65);

  // Radial starfish style darkening toward center
  vec2 center = vec2(0.5, 0.5);
  float dist = distance(p, center);
  float radial = smoothstep(0.8, 0.2, dist);
  vec3 starfishColor = mix(basePink * 1.3, basePink * 0.8, radial);

  // Purple speckles using layered noise
  float speck1 = noise(p * 40.0 + uTime * 0.4);
  float speck2 = noise(p * 90.0 - uTime * 0.3);
  float speckMask = smoothstep(0.75, 0.88, speck1 + speck2 * 0.5);

  vec3 purple = vec3(0.55, 0.20, 0.85);
  starfishColor = mix(starfishColor, purple, speckMask * 0.7);

  // Tiny bright sparkles
  float spark = noise(p * 120.0 + uTime * 1.1);
  spark = smoothstep(0.92, 0.97, spark);
  starfishColor += vec3(1.0, 0.6, 1.0) * spark * 0.3;

  return vec4(starfishColor, 1.0);
}

vec3 blur9(sampler2D tex, vec2 uv, float px) {
  vec3 sum = vec3(0.0);

  sum += texture2D(tex, uv + vec2(-px, -px)).rgb * 1.0;
  sum += texture2D(tex, uv + vec2(0.0, -px)).rgb * 2.0;
  sum += texture2D(tex, uv + vec2(px, -px)).rgb * 1.0;

  sum += texture2D(tex, uv + vec2(-px, 0.0)).rgb * 2.0;
  sum += texture2D(tex, uv).rgb * 4.0;
  sum += texture2D(tex, uv + vec2(px, 0.0)).rgb * 2.0;

  sum += texture2D(tex, uv + vec2(-px, px)).rgb * 1.0;
  sum += texture2D(tex, uv + vec2(0.0, px)).rgb * 2.0;
  sum += texture2D(tex, uv + vec2(px, px)).rgb * 1.0;

  return sum / 16.0;
}

// --------------------------------------------------------
// Ambient shader atlas textured organisms
// --------------------------------------------------------
vec4 renderAmbientLayer(vec2 uv) {
  // Mask provides only color family, not structure
  vec3 maskColor = texture2D(ambientTexture, uv).rgb;
  vec3 baseHsv = rgb2hsv(maskColor);
  float hueSeed = baseHsv.x;

  vec2 p = uv;

  // Multi scale Voronoi for cell boundaries
  float v1 =
      voronoi(p * 420.0 + vec2(uTime * 0.53, -uTime * 0.72)); // large cells
  float v2 =
      voronoi(p * 900.0 + vec2(uTime * 0.13, -uTime * 0.22)); // medium cells
  float v3 = voronoi(p * 1520.0 +
                     vec2(uTime * 0.13, -uTime * 0.22)); // animated micro cells

  // Convert Voronoi distances into bright vein edges
  float veinsCoarse = 1.0 - smoothstep(0.14, 0.26, v1);
  float veinsMedium = 1.0 - smoothstep(0.06, 0.16, v2);
  float veinsFine = 1.0 - smoothstep(0.03, 0.09, v3);

  // Dendritic fbm pattern to break symmetry and give branching
  float dendritic = fbm(p * 9.0 + vec2(uTime * 0.05, uTime * 0.02));
  dendritic = smoothstep(0.52, 0.75, dendritic);

  // Final vein mask, clamped to [0,1]
  float veins =
      clamp(veinsCoarse + 0.6 * veinsMedium + 0.4 * veinsFine + 0.9 * dendritic,
            0.0, 1.0);

  // Membrane interior  softer fill inside cells
  float membrane = smoothstep(0.18, 0.75, v1);

  // Slow pigment blotches to avoid flat regions
  float blotch = fbm(p * 3.0 + vec2(uTime * 0.03, -uTime * 0.02));

  // High frequency micro noise for tiny texture
  float micro = noise(p * 180.0 + uTime * 0.2);
  float grain = noise(p * 260.0);

  // Hue is driven by mask plus structural variation
  float h = hueSeed;
  h += veins * 0.08;  // veins shift hue slightly
  h -= blotch * 0.05; // blotches pull hue back
  h = fract(h);

  // Saturation drifts toward richer colors
  float s = mix(baseHsv.y, 0.9, 0.7);

  // Value is brighter along membranes and slightly modulated by blotches
  float v = 0.70 + membrane * 0.25 + blotch * 0.05;

  vec3 col = hsv2rgb(vec3(h, s, v));

  // Apply structural shading
  col *= mix(0.4, 2.0, veins); // veins pop as bright ridges
  col *= 0.9 + micro * 0.2;    // micro variation

  // Darken with grain to avoid neon look
  col -= grain * 0.06;

  // Iridescence (Option B): angle-based thin-film shimmer
  vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
  vec3 normalApprox = normalize(vec3(
      noise(p * 220.0 + uTime * 0.1) - noise(p * 220.0 - uTime * 0.1),
      noise(p * 180.0 - uTime * 0.15) - noise(p * 180.0 + uTime * 0.15), 0.15));

  float ndotv = clamp(dot(normalApprox, viewDir), 0.0, 1.0);
  float film = sin((ndotv * 28.0) + uTime * 1.4) * 0.5 + 0.5;

  vec3 iridA = hsv2rgb(vec3(fract(hueSeed + 0.10), 0.85, 1.00));
  vec3 iridB = hsv2rgb(vec3(fract(hueSeed + 0.55), 0.90, 0.95));

  vec3 iridescence = mix(iridA, iridB, film);
  col = mix(col, iridescence, 0.28);
  float px = 1.0 / 1024.0; // Increase/decrease for blur strength
  vec3 blurred = blur9(ambientTexture, uv, px);
  col = mix(col, blurred, 0.5);
  return vec4(col, 1.0);
}

// --------------------------------------------------------
// Water shader  background and currents
// --------------------------------------------------------
vec4 renderWater(vec2 uv) {
  // Depth: top of the screen is brighter, deeper is darker
  float depth = 1.0 - uv.y;

  // Worley caustics in screen space (kept as a subtle accent)
  vec2 worleyUv = uv * (uResolution / 1800.0);
  float worleyRaw = fworleyWater(worleyUv);

  // Soft fbm base to look more like uniform water, with Worley as subtle accent
  float base1 = fbm(uv * vec2(6.0, 3.0) + vec2(uTime * 0.08, -uTime * 0.04));
  float base2 = fbm(uv * vec2(14.0, 7.0) + vec2(-uTime * 0.05, uTime * 0.02));
  float t = mix(base1, base2, 0.5);

  // Wave bands layered on top (sea_octave-inspired, but softened)
  vec2 waveSpace = (uv - vec2(0.5, 0.7)) * vec2(6.0, 3.5);
  float wavesRaw = sea_octaveWater(waveSpace, 0.5, uTime * 0.6);
  // Normalize and clamp wave energy to a gentle range
  float waves = clamp(wavesRaw * 0.35, 0.0, 2.0);

  // Base field is fbm + octave waves; Worley used only as a subtle accent
  float combinedBase = t * (0.75 + 0.25 * waves);

  // Extract only the very brightest Worley ridges, scaled way down
  float worleyAccent = smoothstep(0.72, 0.98, worleyRaw) * 0.07;

  // Final combined caustic field: mostly smooth, very lightly modulated by Worley
  float combined = combinedBase + worleyAccent;

  // Flatten contrast further; strongly discourage distinct clover/bubble edges
  combined = smoothstep(0.45, 0.98, combined);

  // Add a soft radial-ish gradient similar to the reference
  combined *= exp(-length2(abs(0.7 * uv - 1.0)));

  // Lightweight volumetric band contribution (deep tunnel-ish glow)
  float volBand = volumetricBand(uv, uTime * 0.005 + 0.25);

  // Nebula-style soft field to further break up circles into larger, foggier patches
  float nebula = nebulaLayer(uv, uTime * 0.2);

  // Base water color (blue-turquoise, reference-inspired)
  vec3 worleyColor = combined * vec3(0.1, 1.1 * combined, pow(combined, 0.5 - combined));

  // Blend in a broad, soft nebula term to reduce tight circular hotspots
  vec3 nebulaColor = vec3(0.02, 0.35, 0.65) * (combined * 0.6 + nebula * 0.8);
  worleyColor = mix(worleyColor, nebulaColor, 0.6);

  // Add a subtle volumetric band tint (deep, slightly bluer glow)
  worleyColor += vec3(0.0, 0.40, 0.90) * volBand * 0.4;

  // Gentle depth gradient so the bottom still feels deeper
  vec3 deepColor = vec3(0.02, 0.10, 0.12);
  vec3 shallowColor = vec3(0.15, 0.70, 0.65);
  vec3 depthColor = mix(deepColor, shallowColor, depth);

  // Blend depth gradient with caustic/nebula/volumetric field
  vec3 waterColor = mix(depthColor, worleyColor, 0.6);

  // Subtle volumetric-like light shafts (inspired by buffer/post pass)
  const int NUM_SHAFT_SAMPLES = 16;
  vec2 lightPos = vec2(0.5, -0.1); // "above" the scene
  vec2 dirToLight = uv - lightPos;
  vec2 stepUv = dirToLight / float(NUM_SHAFT_SAMPLES);

  vec2 rayUv = uv;
  float illuminationDecay = 1.0;
  float decay = 0.94;
  float shaftAccum = 0.0;

  for (int i = 0; i < NUM_SHAFT_SAMPLES; i++) {
    rayUv -= stepUv;
    // Sample the same caustic pattern along the ray
    float s = fworleyWater(rayUv * (uResolution / 2000.0));
    shaftAccum += s * illuminationDecay;
    illuminationDecay *= decay;
  }

  float shafts = shaftAccum / float(NUM_SHAFT_SAMPLES);
  waterColor += shafts * vec3(0.05, 0.18, 0.24) * 0.4;

  // Optional subtle fog with depth to keep the background from blowing out
  float fogAmount = smoothstep(0.55, 1.1, uv.y);
  vec3 fogColor = vec3(0.35, 0.75, 0.80);
  waterColor = mix(waterColor, fogColor, fogAmount * 0.25);

  // === Current Vector Field (A + B Combo, Alpha modulated) ===
  vec4 currSample = texture2D(currentTexture, uv);
  vec3 curr = currSample.rgb;
  float flowAlpha = currSample.a;

  // Decode flow back to [-1, 1]
  vec2 flow = curr.rg * 2.0 - 1.0;
  float flowSpeed = curr.b;

  // Flow should vanish where alpha = 0
  flow *= flowAlpha;
  flowSpeed *= flowAlpha;

  // --- Flowlines (A) ---
  vec2 advectUv = uv + flow * 0.015 * (0.3 + depth);
  float flowCaustic = fbm(advectUv * 8.0 + uTime * 0.6);
  flowCaustic = smoothstep(0.6, 1.0, flowCaustic);
  waterColor += vec3(0.12, 0.20, 0.22) * flowCaustic * 0.6 * flowSpeed * flowAlpha;

  // --- Flow particles (B) ---
  vec2 particleUv = uv - flow * uTime * 0.08;
  particleUv = fract(particleUv * 12.0);
  float particleSeed = noise(particleUv * 25.0);
  // Higher threshold and narrower band -> fewer, subtler dots
  float particleMask = smoothstep(0.90, 0.99, particleSeed);
  waterColor += vec3(0.10, 0.25, 0.35) * particleMask * 0.45 * flowAlpha;

  return vec4(waterColor, 1.0);
}

// --------------------------------------------------------
// Tunnel-style rock helpers (triangle noise inspired)
// --------------------------------------------------------
vec3 tri3(vec3 x) {
  return abs(fract(x) - 0.5);
}

// 2D -> pseudo-3D rock surface pattern: layered triangle noise
float tunnelSurf(vec2 p) {
  // Lift 2D into a curved 3D space
  vec3 q = vec3(p * 2.3, p.x * 0.5 + p.y * 0.8);

  // Triangle-based banding plus sinusoidal warping (range roughly [0,1])
  float n1 = dot(tri3(q * 0.5 + tri3(q * 0.25).yzx), vec3(0.333));
  float n2 = sin(q.x * 1.5 + sin(q.y * 2.0 + sin(q.z * 2.5))) * 0.25 + 0.25;

  return clamp(n1 + n2, 0.0, 1.0);
}

// --------------------------------------------------------
// Terrain shader  cave rock
// --------------------------------------------------------
float rockHeight(vec2 p) {
  // Base fbm height
  float n1 = fbm(p * 2.0);
  float n2 = fbm(p * 5.0 + vec2(3.1, 7.3));
  float n3 = fbm(p * 12.0 - vec2(5.4, 1.7));
  float base = n1 * 0.5 + n2 * 0.3 + n3 * 0.1;

  // Tunnel-like surfacing inspired by triangle noise field
  float surf = tunnelSurf(p);

  // Pebble noise still adds small-scale variation
  float pebble = noise(p * 25.0) * 0.2 + noise(p * 60.0) * 0.8;

  // Blend: fbm shapes + tunnel waves + pebbles
  float height = base * 0.65 + surf * 0.55 + pebble * 0.35;
  return clamp(height, 0.0, 1.0);
}

vec3 rockNormal(vec2 p) {
  float epsN = 0.001;

  // Sample the full rockHeight field so normals track the final shape
  float hL = rockHeight(p + vec2(-epsN, 0.0));
  float hR = rockHeight(p + vec2(epsN, 0.0));
  float hD = rockHeight(p + vec2(0.0, -epsN));
  float hU = rockHeight(p + vec2(0.0, epsN));

  vec3 normal = normalize(vec3(hL - hR, hD - hU, 0.04));
  return normal;
}

vec4 renderTerrain(vec2 uv) {
  vec2 p = uv;

  float height = rockHeight(p);
  vec3 normal = rockNormal(p);

  // Tunnel-style surface field (same as used in height)
  float surf = tunnelSurf(p);

  // Light direction
  vec3 lightDir = normalize(vec3(-0.4, 0.6, 0.7));
  float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);

  // Ambient occlusion: deeper pockets (low surf) get darker
  float aoBase = smoothstep(0.05, 0.7, height);
  float ao = aoBase * (0.7 + 0.3 * (1.0 - surf));

  // Cave palette with cooler, water-tinted rock similar to inspiration
  vec3 darkRock = vec3(0.16, 0.15, 0.20);
  vec3 midRock = vec3(0.34, 0.32, 0.40);
  vec3 lightRock = vec3(0.78, 0.82, 0.90);

  // Base color from height and lighting
  vec3 rockColor = mix(darkRock, midRock, height);
  rockColor = mix(rockColor, lightRock, diffuse * 1.05);

  // Subtle cool water tint toward deeper areas
  vec3 waterTint = vec3(0.15, 0.30, 0.40);
  float cavityFactor = (1.0 - height) * (0.4 + 0.6 * (1.0 - surf));
  rockColor = mix(rockColor, rockColor * waterTint, cavityFactor * 0.35);

  // Surface grit
  float grit = noise(p * 40.0);
  rockColor += grit * 0.08;

  // Pebble shading (reduced strength so large-scale rock patterns stay dominant)
  float pebble = noise(p * 25.0) * 0.2 + noise(p * 60.0) * 0.8;
  float pebbleShade = smoothstep(0.55, 0.85, pebble);
  rockColor -= vec3(0.10, 0.09, 0.08) * pebbleShade * 0.25;

  // Moisture streaks on vertical surfaces
  float wet = fbm(p * vec2(1.0, 6.0) + vec2(0.0, -uTime * 0.08));
  wet = smoothstep(0.65, 0.95, wet);
  rockColor += vec3(0.08, 0.12, 0.16) * wet * 0.18;

  // Apply ambient occlusion
  rockColor *= (0.68 + ao * 0.38);

  // ---- Grey Pebbles Layer (dampened) ----
  float pebbleN = noise(p * 55.0) * 0.4 + noise(p * 120.0) * 0.6;
  float pebbleMask = smoothstep(0.55, 0.8, pebbleN) * 0.7;
  vec3 greyA = vec3(0.42, 0.44, 0.50);
  vec3 greyB = vec3(0.72, 0.76, 0.84);
  vec3 greyPebble = mix(greyA, greyB, noise(p * 22.0));
  greyPebble *= 0.8 + height * 0.2;
  rockColor = mix(rockColor, greyPebble, pebbleMask);

  // ---- Moss Layer (subtler, mostly in occluded areas) ----
  float mossFibers = fbm(p * vec2(6.0, 25.0) + vec2(0.0, 0.2));
  float mossMask = smoothstep(0.45, 0.70, mossFibers);
  mossMask *= (ao * 0.9 + 0.1);
  mossMask *= (wet * 1.1);
  vec3 mossA = vec3(0.10, 0.65, 0.14);
  vec3 mossB = vec3(0.16, 0.75, 0.21);
  vec3 mossColor = mix(mossA, mossB, noise(p * 8.0));
  rockColor = mix(rockColor, mossColor, mossMask * 1.5);

  // ---- Directional Strata Layer with tunnel curvature influence ----
  float strata = sin(p.y * 20.0 + surf * 3.0 + noise(p * 4.0) * 1.5);
  float strataMask = smoothstep(-0.15, 0.45, strata);
  vec3 strataColor = mix(vec3(0.36, 0.34, 0.38),
                         vec3(0.58, 0.56, 0.62),
                         noise(p * 3.0));
  float strataAmount = strataMask * (0.18 + ao * 0.35);
  rockColor = mix(rockColor, strataColor, strataAmount);

  return vec4(rockColor, 1.0);
}

// --------------------------------------------------------
// Main
// --------------------------------------------------------
void main() {
  vec2 uv = vTexCoord;
  vec4 maskColor = texture2D(tex0, uv);

  if (skipTexture == 1) {
    gl_FragColor = maskColor;
    return;
  }

  // Snap to nearest chroma key
  vec4 snapped = snapChroma(maskColor);

  // Classify
  bool isPlayer;
  bool isTerrain;
  bool isVegetation;
  bool isStaticVegetation;
  bool isCurrent;
  bool isBackground;
  bool isAmbient;
  bool isEnemy;

  classifyMask(snapped, isTerrain, isBackground, isCurrent, isPlayer, isEnemy,
               isAmbient, isVegetation, isStaticVegetation);

  bool isSnapped = true;

  // Player outline
  // if (!isPlayer && isPlayerEdge(uv)) {
  //   isSnapped = false;
  //   gl_FragColor = renderPlayerOutline();
  //   // return;
  // }

  // isAmbient = true;

  // Player fill
  if (isPlayer) {
    isSnapped = false;
    gl_FragColor = renderPlayerStarfish(uv);
    // return;
  }

  // Ambient plankton
  if (isAmbient) {
    isSnapped = false;
    gl_FragColor = renderAmbientLayer(uv);
    // return;
  }

  // Background water and currents
  if (isBackground) {
    isSnapped = false;
    gl_FragColor = renderWater(uv);
    // return;
  }

  // Terrain
  if (isTerrain) {
    isSnapped = false;
    gl_FragColor = renderTerrain(uv);
    // return;
  }

  // if (isVegetation || isStaticVegetation) {
  //   isSnapped = false;
  //   gl_FragColor = renderPlayerStarfish(uv);
  //   // return;
  // }

  // Fallback: pass through snapped color
  if (isSnapped) {
    gl_FragColor = snapped;
  }
  return;
}