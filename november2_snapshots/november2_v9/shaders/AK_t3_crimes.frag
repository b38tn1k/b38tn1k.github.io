#ifdef GL_ES
precision lowp float;
#endif

uniform sampler2D tex0;
uniform sampler2D ambientTexture;
uniform sampler2D currentTexture;
uniform sampler2D fbmTexture;
uniform sampler2D staticFbmTexture;
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

float texFBM(vec2 uv) {
  return fbm(uv);
  vec3 lookup = texture2D(fbmTexture, fract(uv)).rgb;

  // Weighted combination of the three octaves
  return lookup.r * 0.5 + lookup.g * 0.35 + lookup.b * 0.15;
}

float texStaticFBM(vec2 uv) {
  // Increase sample frequency dramatically
  uv *= 220.0;

  // Introduce jitter to break bilinear smoothing
  vec2 jitter =
      vec2(noise(uv * 0.61 + uTime * 0.01), noise(uv * 1.37 - uTime * 0.013)) *
      0.35;

  vec3 v = texture2D(staticFbmTexture, fract(uv + jitter)).rgb;

  // Heavier bias toward high‑frequency blue channel
  return dot(v, vec3(0.12, 0.28, 0.60));
}

float roughTexStaticFBM(vec2 uv) {
  // Massive frequency; this is the key
  uv *= 470.2;

  // Break interpolation coherence (critical)
  vec2 jitter =
      vec2(noise(uv * 0.7 + uTime * 0.02), noise(uv * 1.3 - uTime * 0.015)) *
      0.5;

  // Sample far off grid
  vec3 v = texture2D(staticFbmTexture, fract(uv + jitter)).rgb;

  // Strong bias toward highest-frequency band (blue)
  return dot(v, vec3(0.1, 0.25, 0.65));
}

// --------------------------------------------------------
// Worley-style caustics helpers for water
// --------------------------------------------------------
float length2(vec2 p) { return dot(p, p); }

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

// Hybrid Worley + FBM caustics (Level 3 optimization)
float fworleyWater(vec2 p) {
  float t = uTime * 2.0;
  float w = worleyWater(p * 18.0 + vec2(t, -t * 0.4));
  float d = fbm(p * 10.0 + vec2(t * 1.3, t * 0.7));
  return mix(w, d, 0.25);
}

float wavedx(vec2 position, vec2 direction, float time, float freq) {
  float x = dot(direction, position) * freq + time;

  // Replace expensive exp(sin()) with cheap brightening
  float s = sin(x);
  float approx = 1.0 + s * (1.0 + 0.5 * s);

  return approx;
}

float getWaves2D(vec2 position, float time) {
  float iter = 0.0;
  float phase = 6.0;
  float speed = 0.7;
  float weight = 1.0;

  float w = 0.0;
  float ws = 0.0;

  // Reduce iterations 5 → 3
  for (int i = 0; i < 3; i++) {
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

// Simplified sea_octaveWater
float sea_octaveWater(vec2 uv, float choppy, float time) {
  return getWaves2D(uv * choppy, time);
}

float cheapFogLayer(vec2 uv, float time) {
  //   shift/scale UV space so the pattern moves slowly
  vec2 p = uv * vec2(2.0, 1.4);
  p += vec2(time * 0.03, -time * 0.02);

  float f = 0.55 * fbm(p * 5.0) + 0.30 * texFBM(p * 10.0 + 5.17) +
            0.15 * texFBM(p * 20.0 - 2.73);

  f = smoothstep(0.45, 0.95, f); // narrower contrast window

  return f;
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

float fbmFlow(vec2 uv, vec2 dir) {
  // dir must be normalized
  vec2 perp = vec2(-dir.y, dir.x);

  float value = 0.0;
  float amp = 0.5;

  for (int i = 0; i < 4; i++) {
    // anisotropic scaling: stretched along flow, compressed across
    vec2 warped = uv * mat2(dir * 1.0,    // 1x scale along flow
                            perp * 0.25); // 4x squeezed across flow

    value += amp * noise(warped);
    uv *= 2.0;
    amp *= 0.5;
  }

  return value;
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
  vec3 maskColor = texture2D(ambientTexture, uv).rgb;

  vec3 hsv = rgb2hsv(maskColor);

  // very subtle hue oscillation
  hsv.x += sin(10.0 * uTime + uv.x * 5.5 + uv.y * 3.1) * 0.02;

  // small breathing in value
  hsv.z *= 0.92 + 0.08 * sin(uTime * 0.25 + uv.y * 5.2);

  // tiny caustic tint integration
  float ca = texFBM(uv * 6.0 + uTime * 0.05);
  ca = smoothstep(0.55, 0.95, ca);
  vec3 caTint = vec3(0.20, 0.45, 0.65) * (ca * 0.12);

  vec3 finalCol = hsv2rgb(hsv) + caTint;

  return vec4(finalCol, 1.0);
}

// --- Voronoi helper ---
float vor(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float md = 10.0;

  for (int xo = -1; xo <= 1; xo++) {
    for (int yo = -1; yo <= 1; yo++) {
      vec2 g = vec2(float(xo), float(yo));
      vec2 o = vec2(noise(i + g), noise(i + g + 5.2));
      float d = length(f - g - o);
      md = min(md, d);
    }
  }
  return md;
}

vec4 renderEnemyLayer(vec2 uv) {

  // Center distance for pulse and ring placement
  vec2 center = vec2(0.5);
  float d = distance(uv, center);

  // ------------------------------------------------------------
  // 1. Base yellow‑tan body tone
  // ------------------------------------------------------------
  float n = noise(uv * 40.0 + uTime * 0.2);
  //   vec3 baseBody = mix(vec3(0.90, 0.78, 0.44), vec3(0.70, 0.55, 0.28), n);
  vec3 baseBody = mix(vec3(0.90, 0.58, 0.34), vec3(0.70, 0.25, 0.08), n);

  // ------------------------------------------------------------
  // 2. Voronoi "chromatophore blobs"
  // ------------------------------------------------------------
  float v = vor(uv * 34.0 + uTime * 0.15);
  float blobMask = smoothstep(0.12, 0.32, v);

  vec3 blobColor =
      mix(vec3(0.05, 0.25, 0.98), vec3(0.35, 0.28, 0.18), blobMask * 0.8);

  // ------------------------------------------------------------
  // 3. High-frequency neon‑cyan rings around Voronoi edges
  // ------------------------------------------------------------
  float edge = smoothstep(0.1, 0.01, v);
  float pulse = 0.75 + 0.25 * sin(uTime * 2.2 + d * 6.0);

  vec3 neonCyan = vec3(0.05, 1.35, 1.75); // brighter, more electric
  vec3 ringGlow = neonCyan * edge * pulse * 0.3;

  // ------------------------------------------------------------
  // 4. Additional micro speckles
  // ------------------------------------------------------------
  float speck = noise(uv * 380.0 + uTime * 0.6);
  speck = smoothstep(0.90, 0.98, speck);
  vec3 speckCol = vec3(0.8, 1.0, 1.0) * speck * 0.35;

  // ------------------------------------------------------------
  // Composite
  // ------------------------------------------------------------
  vec3 finalCol = baseBody + blobColor * 0.8 + ringGlow + speckCol;
  finalCol *= finalCol;

  return vec4(finalCol, 1.0);
}

// --------------------------------------------------------
// Water shader  background and currents
// --------------------------------------------------------
vec4 renderWater(vec2 uv) {
  // Depth: top of the screen is brighter, deeper is darker
  float depth = 1.0 - uv.y;

  // Worley caustics in screen space (kept as a subtle accent)
  //   vec2 worleyUv = uv * (uResolution / 1800.0);
  //   float worleyRaw = fworleyWater(worleyUv);
  vec2 worleyUv = uv * 6.0;
  float worleyRaw = fworleyWater(worleyUv);

  // Soft fbm base to look more like uniform water, with Worley as subtle accent
  float base1 = texFBM(uv * vec2(6.0, 3.0) + vec2(uTime * 0.08, -uTime * 0.04));
  float base2 =
      texFBM(uv * vec2(14.0, 7.0) + vec2(-uTime * 0.05, uTime * 0.02));
  float t = mix(base1, base2, 0.5);

  // Wave bands layered on top (sea_octave-inspired, but softened)
  vec2 waveSpace = (uv - vec2(0.5, 0.7)) * vec2(6.0, 3.5);
  float wavesRaw = sea_octaveWater(waveSpace, 0.5, uTime * 0.6);
  // Normalize and clamp wave energy to a gentle range
  float waves = clamp(wavesRaw * 0.35, 0.0, 2.0);

  // Base field is fbm + octave waves; Worley used only as a subtle accent
  float combinedBase = t * (0.75 + 0.25 * waves);

  // Extract only the very brightest Worley ridges, scaled way down
  //   float worleyAccent = smoothstep(0.72, 0.98, worleyRaw) * 0.07;
  float worleyAccent = worleyRaw * 0.04;

  // Final combined caustic field: mostly smooth, very lightly modulated by
  // Worley
  float combined = combinedBase + worleyAccent;

  // Flatten contrast further; strongly discourage distinct clover/bubble edges
  combined = smoothstep(0.45, 0.98, combined);

  // Cheap mid/high highlight puff
  float puff = smoothstep(0.50, 0.95, combined);
  combined += puff * 3.5; // bump this number to taste (0.1–0.22)

  // Add a soft radial-ish gradient similar to the reference
  //   combined *= exp(-length2(abs(0.7 * uv - 1.0)));

  // Lightweight volumetric band contribution (deep tunnel-ish glow)
  //   float volBand = volumetricBand(uv, uTime * 0.005 + 0.25);

  // Nebula-style soft field to further break up circles into larger, foggier
  // patches
  //   float nebula = nebulaLayer(uv, uTime * 0.2);

  float fogA = cheapFogLayer(uv, uTime * 0.2);
  float fogB = cheapFogLayer(uv * 0.6 + 0.3, uTime * 0.12);
  float nebula = fogA;
  float volBand = fogB * 0.35; // keep a hint of "deep" look

  // Base water color (blue-turquoise, reference-inspired)
  vec3 worleyColor =
      combined * vec3(0.1, 1.1 * combined, pow(combined, 0.5 - combined));

  // Blend in a broad, soft nebula term to reduce tight circular hotspots
  vec3 nebulaColor = vec3(0.02, 0.35, 0.65) * (combined * 0.6 + nebula * 0.8);
  worleyColor = mix(worleyColor, nebulaColor, 0.8);

  // Add a subtle volumetric band tint (deep, slightly bluer glow)
  worleyColor += vec3(0.0, 0.40, 0.90) * volBand * 0.4;

  // Gentle depth gradient so the bottom still feels deeper
  vec3 deepColor = vec3(0.02, 0.10, 0.12);
  vec3 shallowColor = vec3(0.15, 0.70, 0.65);
  vec3 depthColor = mix(deepColor, shallowColor, depth);

  // Blend depth gradient with caustic/nebula/volumetric field
  vec3 waterColor = mix(depthColor, worleyColor, 0.6);

  vec3 softFogTint = vec3(0.08, 0.22, 0.28);
  waterColor += softFogTint * (combined * 0.12);

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
    // float s = fworleyWater(rayUv * (uResolution / 2000.0));
    // float s = cheapFogLayer(rayUv, uTime * 0.2);
    // ALTERNATE:
    float s = texFBM(rayUv * 2.0 + uTime * 0.1);
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
  // === Current Vector Field (A + B Combo, Alpha modulated) ===
  vec4 currSample = texture2D(currentTexture, uv);
  float flowAlpha = currSample.a;

  // Decode flow back to [-1,1]
  vec2 flow = currSample.rg * 2.0 - 1.0;
  float flowSpeed = currSample.b;

  // Apply alpha gate
  flow *= flowAlpha;
  flowSpeed *= flowAlpha;

  // Stable direction
  float fmag = length(flow);
  vec2 flowDir = (fmag > 0.0005) ? (flow / fmag) : vec2(0.0);

  // ------------------------------------------------------------
  // CLOUD FIELD — now anisotropic & directionally clear
  // ------------------------------------------------------------

  // Advection
  vec2 cloudUv = uv - flow * uTime * 0.10;

  // Stretch along flow direction, compress across it
  mat2 flowStretch =
      mat2(flowDir * 1.4,                       // 1.4x along flow
           vec2(-flowDir.y, flowDir.x) * 0.55); // compressed cross-flow
  cloudUv = fract((cloudUv * flowStretch) * 4.0);

  float cloudBase = noise(cloudUv * 12.0);

  // Softer shaping for wider, foggier currents
  float cloudMask = smoothstep(0.50, 0.85, cloudBase);

  // Tie intensity to real current amplitude
  float cloudIntensity = (0.25 + flowSpeed * 1.4) * flowAlpha;

  waterColor += vec3(0.09, 0.24, 0.28) * cloudMask * cloudIntensity * 0.05;

  // ------------------------------------------------------------
  // PARTICLE FIELD — unchanged except minor softening
  // ------------------------------------------------------------
  vec2 particleUv = uv - flow * uTime * 0.1;
  particleUv = fract(particleUv * 14.0);

  float freq = mix(35.0, 24.0, flowSpeed);
  float base = noise(particleUv * freq);

  float particleMask = smoothstep(0.80, 0.96, base);

  waterColor += vec3(0.12, 0.30, 0.38) * particleMask * 0.55 * flowAlpha;

  float micro = fbm(uv * 3.0 + uTime * 0.1);
  float high = smoothstep(0.85, 0.98, micro);
  waterColor += vec3(0.03, 0.08, 0.12) * high;

  return vec4(waterColor, 1.0);
}

// --------------------------------------------------------
// Tunnel-style rock helpers (triangle noise inspired)
// --------------------------------------------------------
vec3 tri3(vec3 x) { return abs(fract(x) - 0.5); }

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
  // Slightly rescaled coordinates for different bands of detail
  vec2 pLarge = p * 1.3;  // gentle, broad variation
  vec2 pMedium = p * 3.0; // mid-scale shapes
  vec2 pSmall = p * 9.0;  // fine detail

  // Base fbm height at multiple scales
  float n1 = fbm(pLarge);
  float n2 = fbm(pMedium + vec2(3.1, 7.3));
  float n3 = fbm(pSmall - vec2(5.4, 1.7));
  float base = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;

  // Tunnel-like surfacing inspired by triangle noise field, scaled down so it
  // does not create huge “pillows” from far away
  float surf = tunnelSurf(p * 0.7);

  // Pebble noise still adds small-scale variation
  float pebble = noise(pSmall * 2.5) * 0.15 + noise(pSmall * 5.0) * 0.45;

  // Low-frequency mask to vary roughness across the cave: some zones smoother,
  // some more craggy. This helps avoid homogeneity.
  float macro = texStaticFBM(p * 0.5 + vec2(10.7, -3.9)); // ~0..1

  // Blend: fbm shapes + softened tunnel waves + pebbles, modulated by macro
  float height = base * (0.65 + 0.25 * macro) +
                 surf * (0.18 + 0.18 * (1.0 - macro)) +
                 pebble * (0.30 + 0.25 * macro);

  return clamp(height, 0.0, 1.0);
}

float rockHeightFast(vec2 p) {
  // Only two fbm layers instead of three
  float n1 = fbm(p * 1.2);
  float n2 = fbm(p * 4.0);

  // No tunnelSurf, no pebbles, no macro modulation
  return n1 * 0.7 + n2 * 0.3;
}

vec3 rockNormalFast(vec2 p) {
  float e = 0.0015;

  float hL = rockHeightFast(p + vec2(-e, 0.0));
  float hR = rockHeightFast(p + vec2(e, 0.0));
  float hD = rockHeightFast(p + vec2(0.0, -e));
  float hU = rockHeightFast(p + vec2(0.0, e));

  return normalize(vec3(hL - hR, hD - hU, 0.10));
}

vec3 rockNormal(vec2 p) {
  float epsN = 0.001;

  // Sample the full rockHeight field so normals track the final shape
  float hL = rockHeight(p + vec2(-epsN, 0.0));
  float hR = rockHeight(p + vec2(epsN, 0.0));
  float hD = rockHeight(p + vec2(0.0, -epsN));
  float hU = rockHeight(p + vec2(0.0, epsN));

  vec3 normal = normalize(vec3(hL - hR, hD - hU, 0.08));
  return normal;
}

vec4 renderTerrain(vec2 uv) {
  vec2 p = uv;

  float height = rockHeightFast(p);
  vec3 normal = rockNormalFast(p);

  // --- Ultra-fine sandpaper normal detail ---
  vec2 micro = vec2(texStaticFBM(p * 60.0 + 4.0) - 0.5,
                    texStaticFBM(p * 80.0 - 7.0) - 0.5);

  // Scale micro normals based on AO (smooth in cavities, crisp on edges)
  float microMask = smoothstep(0.15, 0.85, height);
  normal = normalize(normal + vec3(micro * 0.20 * microMask, 0.0));

  // Tunnel-style surface field (same as used in height)
  float surf = tunnelSurf(p);

  // Macro variation for regional heterogeneity: some bands darker and smoother,
  // others slightly rougher and cooler-toned.
  float macroVar = texStaticFBM(p * 0.7 + vec2(-6.3, 4.1)); // ~0..1

  // Light direction
  vec3 lightDir = normalize(vec3(-0.4, 0.6, 0.7));
  float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);

  // Ambient occlusion: deeper pockets (low surf) get darker
  float aoBase = smoothstep(0.05, 0.7, height);
  float ao = aoBase * (0.75 + 0.25 * (1.0 - surf));

  // Warmer, underwater rock palette (brownish with cooler deep tones)
  vec3 darkRock = vec3(0.06, 0.08, 0.10);  // deep shadow
  vec3 midRock = vec3(0.30, 0.25, 0.18);   // main brown
  vec3 lightRock = vec3(0.72, 0.64, 0.42); // sunlit sand / rock

  // Base color from height and lighting, with gentle contrast
  vec3 rockColor = mix(darkRock, midRock, height);

  // Very subtle surface grit, just to keep from being too flat
  float grit = noise(p * 5.0) + noise(p * 50.0) + noise(p * 500.0);
  rockColor += (grit - 0.5) * 0.1;

  // Large-scale shelves / crags (broad, crisp terrain patterns)
  float macroCrag = texStaticFBM(p * 5.2 + vec2(7.3, -13.1));
  macroCrag = smoothstep(2.32, 10.88, macroCrag);

  // brighten shelves, darken alcoves
  rockColor = mix(rockColor * 0.75, rockColor * 1.25, macroCrag * 1.55);
  float upFacing =
      clamp(normal.y * 0.8 + 0.2, 0.0, 1.0); // surfaces facing "up"
  rockColor = mix(rockColor, lightRock, diffuse * 0.4 + upFacing * 0.25);

  // Regional variation: lighter shelves vs darker recesses
  //   rockColor *= mix(0.82, 1.08, macroVar);
  rockColor *= mix(1.0, 2.08, macroVar);

  // Slight cool water influence toward deeper areas
  float depthFactor = clamp(uv.y * 1.2, 0.0, 1.0);
  vec3 coolDeep = vec3(0.12, 0.20, 0.26);
  rockColor =
      mix(rockColor, mix(rockColor, coolDeep, 0.55), depthFactor * 0.75);

  float hf = texStaticFBM(p * 55.0);
  float hfMask = smoothstep(0.1, 0.9, height); // avoid shadow pits

  // pseudo self-shadowing (simulates tiny cavities catching less light)
  rockColor *= 1.0 - (hf - 0.5) * 0.70 * hfMask;

  // Moisture / dark streaks (kept very soft)
  float wet = texStaticFBM(p * vec2(1.0, 6.0) + vec2(0.0, -uTime * 0.06));
  wet = smoothstep(0.68, 0.96, wet);
  rockColor = mix(rockColor, rockColor * vec3(0.65, 0.72, 0.78), wet * 0.25);

  // Very soft strata to hint at layering, not camo
  float strata = sin(p.y * 8.0 + noise(p * 2.0) * 2.0);
  float strataMask = smoothstep(-0.1, 0.4, strata);
  vec3 strataColor = mix(rockColor * 0.90, rockColor * 1.05, strataMask * 0.5);
  rockColor = mix(rockColor, strataColor, 0.35 * (0.3 + ao * 0.7));

  // Ambient occlusion to ground everything in shadowy caves
  rockColor *= (0.62 + ao * 0.55);

  // Keep rocks slightly darker than the water overall
  rockColor *= 0.62;

  // === Soft watery reflection / caustic tint (cheap, stable) ===

  // Recreate a lightweight water caustic field in terrain UV space
  float w1 = fbm(p * vec2(6.0, 3.0) + vec2(uTime * 0.08, -uTime * 0.04));
  float w2 = fbm(p * vec2(14.0, 7.0) + vec2(-uTime * 0.05, uTime * 0.02));
  float w = mix(w1, w2, 0.5);

  // Subtle Worley accent (high-frequency only)
  float a = fworleyWater(p * 6.0) * 0.04;

  // Wave modulation to mimic water’s moving light bands
  float wave =
      sea_octaveWater((p - vec2(0.5, 0.7)) * vec2(6.0, 3.5), 0.5, uTime * 0.6);
  float waveMod = clamp(wave * 0.35, 0.0, 2.0);

  // Combine into a soft caustic-like reflectivity field
  float terrainCaustic = w * (0.75 + 0.25 * waveMod) + a;
  terrainCaustic = smoothstep(0.45, 0.98, terrainCaustic);

  // Tint slightly toward the water palette (no bright rings)
  vec3 terrainReflectionTint = vec3(0.25, 0.35, 0.50);

  // Apply only on up-facing or AO-light areas
  rockColor += terrainCaustic * terrainReflectionTint * (1.0 - ao * 4.0) * 0.15;

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

  // Early return structure for mask classes
  if (isPlayer) {
    gl_FragColor = renderPlayerStarfish(uv);
    return;
  } else if (isAmbient) {
    gl_FragColor = renderAmbientLayer(uv);
    return;
  } else if (isBackground) {
    gl_FragColor = renderWater(uv);
    return;
  } else if (isTerrain) {
    gl_FragColor = renderTerrain(uv);
    return;
  } else if (isEnemy) {
    gl_FragColor = renderEnemyLayer(uv);
    return;
  } else {
    gl_FragColor = snapped;
    return;
  }
}