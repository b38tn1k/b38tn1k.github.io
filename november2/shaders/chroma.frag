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
  return vec4(maskColor, 1.0);
  // vec3 baseHsv = rgb2hsv(maskColor);
  // float hueSeed = baseHsv.x;

  // vec2 p = uv;

  // // Multi scale Voronoi for cell boundaries
  // float v1 =
  //     voronoi(p * 420.0 + vec2(uTime * 0.53, -uTime * 0.72)); // large cells
  // float v2 =
  //     voronoi(p * 900.0 + vec2(uTime * 0.13, -uTime * 0.22)); // medium cells
  // float v3 = voronoi(p * 1520.0 +
  //                    vec2(uTime * 0.13, -uTime * 0.22)); // animated micro cells

  // // Convert Voronoi distances into bright vein edges
  // float veinsCoarse = 1.0 - smoothstep(0.14, 0.26, v1);
  // float veinsMedium = 1.0 - smoothstep(0.06, 0.16, v2);
  // float veinsFine = 1.0 - smoothstep(0.03, 0.09, v3);

  // // Dendritic fbm pattern to break symmetry and give branching
  // float dendritic = fbm(p * 9.0 + vec2(uTime * 0.05, uTime * 0.02));
  // dendritic = smoothstep(0.52, 0.75, dendritic);

  // // Final vein mask, clamped to [0,1]
  // float veins =
  //     clamp(veinsCoarse + 0.6 * veinsMedium + 0.4 * veinsFine + 0.9 * dendritic,
  //           0.0, 1.0);

  // // Membrane interior  softer fill inside cells
  // float membrane = smoothstep(0.18, 0.75, v1);

  // // Slow pigment blotches to avoid flat regions
  // float blotch = fbm(p * 3.0 + vec2(uTime * 0.03, -uTime * 0.02));

  // // High frequency micro noise for tiny texture
  // float micro = noise(p * 180.0 + uTime * 0.2);
  // float grain = noise(p * 260.0);

  // // Hue is driven by mask plus structural variation
  // float h = hueSeed;
  // h += veins * 0.08;  // veins shift hue slightly
  // h -= blotch * 0.05; // blotches pull hue back
  // h = fract(h);

  // // Saturation drifts toward richer colors
  // float s = mix(baseHsv.y, 0.9, 0.7);

  // // Value is brighter along membranes and slightly modulated by blotches
  // float v = 0.70 + membrane * 0.25 + blotch * 0.05;

  // vec3 col = hsv2rgb(vec3(h, s, v));

  // // Apply structural shading
  // col *= mix(0.4, 2.0, veins); // veins pop as bright ridges
  // col *= 0.9 + micro * 0.2;    // micro variation

  // // Darken with grain to avoid neon look
  // col -= grain * 0.06;

  // // Iridescence (Option B): angle-based thin-film shimmer
  // vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
  // vec3 normalApprox = normalize(vec3(
  //     noise(p * 220.0 + uTime * 0.1) - noise(p * 220.0 - uTime * 0.1),
  //     noise(p * 180.0 - uTime * 0.15) - noise(p * 180.0 + uTime * 0.15), 0.15));

  // float ndotv = clamp(dot(normalApprox, viewDir), 0.0, 1.0);
  // float film = sin((ndotv * 28.0) + uTime * 1.4) * 0.5 + 0.5;

  // vec3 iridA = hsv2rgb(vec3(fract(hueSeed + 0.10), 0.85, 1.00));
  // vec3 iridB = hsv2rgb(vec3(fract(hueSeed + 0.55), 0.90, 0.95));

  // vec3 iridescence = mix(iridA, iridB, film);
  // col = mix(col, iridescence, 0.28);
  // float px = 1.0 / 1024.0; // Increase/decrease for blur strength
  // vec3 blurred = blur9(ambientTexture, uv, px);
  // col = mix(col, blurred, 0.5);
  // return vec4(col, 1.0);
}

// --------------------------------------------------------
// Water shader  background and currents
// --------------------------------------------------------
vec4 renderWater(vec2 uv) {
  vec2 p = uv;

  // Depth  top of the screen is brighter, deeper is darker
  float depth = 1.0 - uv.y;

  // Large-area wavy distortion
  float wave1 = sin(p.y * 10.0 + uTime * 1.5) * 0.015;
  float wave2 = sin(p.x * 14.0 + uTime * 1.2) * 0.015;
  p.x += wave1;
  p.y += wave2;

  // Perlin-flow style caustics using fbm
  vec2 flowUv = p * 6.0;
  float n1 = fbm(flowUv + vec2(uTime * 0.4, uTime * 0.2));
  float n2 = fbm(flowUv * 1.7 - vec2(uTime * 0.3, uTime * 0.5));
  float caustics = smoothstep(0.6, 1.1, n1 + 0.5 * n2);

  // Base water color
  vec3 deepColor = vec3(0.02, 0.10, 0.12);
  vec3 midColor = vec3(0.05, 0.35, 0.45);
  vec3 shallowColor = vec3(0.15, 0.70, 0.65);

  // Depth-based color blend
  vec3 waterColor = mix(deepColor, midColor, depth);
  waterColor = mix(waterColor, shallowColor, depth * 0.5);

  // Apply caustic highlights
  waterColor += caustics * 0.35;

  // God-ray beams
  vec2 lightPos = vec2(0.5, 1.3);
  vec2 toLight = lightPos - uv;
  float distToLight = length(toLight);
  float angle = atan(toLight.y, toLight.x);

  float rayBands = sin(angle * 18.0 + uTime * 0.7);
  float rayMask = smoothstep(0.0, 0.6, rayBands);
  float rayFalloff = exp(-distToLight * 3.0);

  float godRays = rayMask * rayFalloff;
  waterColor += vec3(0.22, 0.45, 0.50) * godRays * 0.35;

  // Fog falloff with depth
  float fogAmount = smoothstep(0.55, 1.1, uv.y);
  vec3 fogColor = vec3(0.35, 0.75, 0.80);
  waterColor = mix(waterColor, fogColor, fogAmount * 0.5);

  // === Current Vector Field (A + B + D Combo, Alpha modulated) ===
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
  waterColor +=
      vec3(0.12, 0.20, 0.22) * flowCaustic * 0.6 * flowSpeed * flowAlpha;

  // --- Flow particles (B) ---
  vec2 particleUv = uv - flow * uTime * 0.08;
  particleUv = fract(particleUv * 12.0);
  float particleSeed = noise(particleUv * 25.0);
  float particleMask = smoothstep(0.8, 0.95, particleSeed);
  waterColor += vec3(0.10, 0.25, 0.35) * particleMask * 0.8 * flowAlpha;

  return vec4(waterColor, 1.0);
}

// --------------------------------------------------------
// Terrain shader  cave rock
// --------------------------------------------------------
float rockHeight(vec2 p) {
  float n1 = fbm(p * 2.0);
  float n2 = fbm(p * 5.0 + vec2(3.1, 7.3));
  float n3 = fbm(p * 12.0 - vec2(5.4, 1.7));
  float pebble = noise(p * 25.0) * 0.2 + noise(p * 60.0) * 0.8;
  float height = n1 * 0.5 + n2 * 0.3 + n3 * 0.1 + pebble * 0.4;
  return height;
}

vec3 rockNormal(vec2 p) {
  float epsN = 0.001;
  float hL = fbm((p + vec2(-epsN, 0.0)) * 2.0);
  float hR = fbm((p + vec2(epsN, 0.0)) * 2.0);
  float hD = fbm((p + vec2(0.0, -epsN)) * 2.0);
  float hU = fbm((p + vec2(0.0, epsN)) * 2.0);

  vec3 normal = normalize(vec3(hL - hR, hD - hU, 0.03));
  return normal;
}

vec4 renderTerrain(vec2 uv) {
  vec2 p = uv;

  float height = rockHeight(p);
  vec3 normal = rockNormal(p);

  // Light direction
  vec3 lightDir = normalize(vec3(-0.4, 0.6, 0.7));
  float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);

  // Ambient occlusion
  float ao = smoothstep(0.0, 0.5, height);

  // Cave palette
  vec3 darkRock = vec3(0.30, 0.28, 0.24);
  vec3 midRock = vec3(0.55, 0.50, 0.40);
  vec3 lightRock = vec3(0.82, 0.78, 0.65);

  // Base color from height
  vec3 rockColor = mix(darkRock, midRock, height);
  rockColor = mix(rockColor, lightRock, diffuse * 1.1);

  // Surface grit
  float grit = noise(p * 40.0);
  rockColor += grit * 0.12;

  // Pebble shading
  float pebble = noise(p * 25.0) * 0.2 + noise(p * 60.0) * 0.8;
  float pebbleShade = smoothstep(0.55, 0.85, pebble);
  rockColor -= vec3(0.12, 0.10, 0.09) * pebbleShade * 0.4;

  // Moisture streaks on vertical surfaces
  float wet = fbm(p * vec2(1.0, 6.0) + vec2(0.0, -uTime * 0.1));
  wet = smoothstep(0.65, 0.95, wet);
  rockColor += vec3(0.10, 0.15, 0.18) * wet * 0.15;

  // Apply ambient occlusion
  rockColor *= (0.70 + ao * 0.35);

  // ---- Grey Pebbles Layer ----
  float pebbleN = noise(p * 55.0) * 0.4 + noise(p * 120.0) * 0.6;
  float pebbleMask = smoothstep(0.55, 0.8, pebbleN);
  vec3 greyA = vec3(0.45, 0.45, 0.50);
  vec3 greyB = vec3(0.75, 0.75, 0.82);
  vec3 greyPebble = mix(greyA, greyB, noise(p * 22.0));
  greyPebble *= 0.8 + height * 0.2;                     
  rockColor = mix(rockColor, greyPebble, pebbleMask);

  // ---- Moss Layer ----
  float mossFibers = fbm(p * vec2(6.0, 25.0) + vec2(0.0, 0.2));
  float mossMask = smoothstep(0.45, 0.70, mossFibers);
  mossMask *= (ao * 0.8 + 0.2);    
  mossMask *= (wet * 1.2);         
  vec3 mossA = vec3(0.10, 0.75, 0.15);
  vec3 mossB = vec3(0.18, 0.80, 0.22);
  vec3 mossColor = mix(mossA, mossB, noise(p * 8.0));
  rockColor = mix(rockColor, mossColor, mossMask * 3.0);

  // ---- Directional Strata Layer ----
  float strata = sin(p.y * 20.0 + noise(p * 4.0) * 1.5);
  float strataMask = smoothstep(-0.2, 0.4, strata);
  vec3 strataColor = mix(vec3(0.45, 0.42, 0.35),
                         vec3(0.60, 0.55, 0.48),
                         noise(p * 3.0));
  float strataAmount = strataMask * (0.2 + ao * 0.4);
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

  // Snap to nearest color from the chroma key map
  // see config / chroma.json for various colors used / disabled
  vec4 snapped = snapChroma(maskColor);

  //you can see how I map the colors in core/utils.js -> applyChromaMapWithDisable
  // we could all the color layers that are active and try to evenly space them over the color wheel
  // so that we can be confident that each color is as different as possible for better segmentation and sampling.
  // idk if this is a common idea, just what I cam up with thinkning about how we could do shader textures, and then thinking about chroma-keying and green screens

  // Classify
  // based on the incoming snapped color, decide what sort of texture is valid to draw
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

  // draw the texture based on that classification
  // the functions here define the textures for each

  // Player fill
  if (isPlayer) {
    isSnapped = false;
    gl_FragColor = renderPlayerStarfish(uv);
    // return;
  }

  // Ambient plankton
  // the ambient layer also uses the ambient texture canvas, which can be sampled for colors, with the main text0 just providing the shape
  if (isAmbient) {
    isSnapped = false;
    gl_FragColor = renderAmbientLayer(uv);
    // return;
  }

  // Background water and currents
  // again, using another texture to provide informaiton about the currents - direction and strength come from currentTexture RGB channels
  
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

  // I have vegetation turned off for now, so just ignore it. it is the same color as background anyway.

  // if (isVegetation || isStaticVegetation) {
  //   isSnapped = false;
  //   gl_FragColor = renderPlayerStarfish(uv);
  //   // return;
  // }

  // Fallback: pass through snapped color (anything that is unclassifiable)
  if (isSnapped) {
    gl_FragColor = snapped;
  }
  return;
}