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

bool exitEarly = false;

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
                  out bool isCurrents, out bool isPlayer, out bool isEnemy,
                  out bool isAmbient) {
  float eps = 0.05;

  isTerrain = distance(snapped.rgb, uChromaTerrain.rgb) < eps;
  isBackground = distance(snapped.rgb, uChromaBackground.rgb) < eps;
  isCurrents = distance(snapped.rgb, uChromaCurrent.rgb) < eps;
  isPlayer = distance(snapped.rgb, uChromaPlayer.rgb) < eps;
  isEnemy = distance(snapped.rgb, uChromaEnemy.rgb) < eps;
  isAmbient = distance(snapped.rgb, uChromaAmbient.rgb) < eps;
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

// --------------------------------------------------------
// Ambient plankton shader  atlas textured organisms
// --------------------------------------------------------
vec4 renderAmbientPlankton(vec2 uv) {
  vec2 p = uv;

  // 1. Sample sprite from ambient texture atlas
  vec4 sprite = texture2D(ambientTexture, uv);

  // If this pixel is not part of a sprite, discard.
  if (sprite.a < 0.01) {
    discard;
  }

  vec3 col = sprite.rgb;

  // 2. Subtle UV wobble  micro swimming motion
  float wobbleX = sin(uTime * 1.3 + p.y * 12.0) * 0.004;
  float wobbleY = cos(uTime * 1.7 + p.x * 10.0) * 0.004;
  vec2 wobUv = uv + vec2(wobbleX, wobbleY);

  col = texture2D(ambientTexture, wobUv).rgb;

  // 3. Slow hue drift  organic color breathing
  float t = uTime * 0.15;
  float angle = sin(t + uv.x * 3.0) * 0.25;

  float s = sin(angle);
  float c = cos(angle);
  mat3 hue =
      mat3(vec3(0.299 + 0.701 * c + 0.168 * s, 0.587 - 0.587 * c + 0.330 * s,
                0.114 - 0.114 * c - 0.497 * s),
           vec3(0.299 - 0.299 * c - 0.328 * s, 0.587 + 0.413 * c + 0.035 * s,
                0.114 - 0.114 * c + 0.292 * s),
           vec3(0.299 - 0.300 * c + 1.250 * s, 0.587 - 0.588 * c - 1.050 * s,
                0.114 + 0.886 * c - 0.203 * s));

  col = hue * col;

  // 4. Reef tinting
  vec3 reefTint1 = vec3(0.10, 0.65, 0.75);
  vec3 reefTint2 = vec3(0.95, 0.45, 0.65);
  vec3 reefTint3 = vec3(0.60, 0.85, 0.50);

  float sel = noise(uv * 20.0);
  vec3 targetTint = sel < 0.33 ? reefTint1 : sel < 0.66 ? reefTint2 : reefTint3;

  col = mix(col, targetTint, 0.12);

  // 5. Bioluminescent micro sparkles
  float spark = noise(uv * 120.0 + uTime * 1.3);
  spark = smoothstep(0.93, 0.98, spark);
  vec3 glow = vec3(0.7, 0.9, 1.0) * spark * 0.25;
  col += glow;

  // 6. Soft global pulse  breathing
  float pulse = sin(uTime * 1.7 + uv.x * 4.0 + uv.y * 6.0) * 0.5 + 0.5;
  col *= 0.85 + pulse * 0.15;

  // 7. Slight darkening toward plankton edges
  float edge = smoothstep(0.05, 0.20, sprite.a);
  col *= edge * 1.05;

  // 8. Edge soften into background  feather fade
  float edgeFade = smoothstep(0.0, 0.25, sprite.a);
  vec3 bgColor = uChromaBackground.rgb;
  col = mix(bgColor, col, edgeFade);

  return vec4(col, 1.0);
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

  return vec4(rockColor, 1.0);
}

// --------------------------------------------------------
// Main
// --------------------------------------------------------
void main() {
  vec2 uv = vTexCoord;
  vec4 maskColor = texture2D(tex0, uv);

  if (exitEarly) {
    gl_FragColor = maskColor;
    return;
  }

  // Snap to nearest chroma key
  vec4 snapped = snapChroma(maskColor);

  // Classify
  bool isTerrain;
  bool isBackground;
  bool isCurrents;
  bool isPlayer;
  bool isEnemy;
  bool isAmbient;
  bool isSnapped = true;
  classifyMask(snapped, isTerrain, isBackground, isCurrents, isPlayer, isEnemy,
               isAmbient);

  // Player outline
  // if (!isPlayer && isPlayerEdge(uv)) {
  //   isSnapped = false;
  //   gl_FragColor = renderPlayerOutline();
  //   // return;
  // }

  // Player fill
  if (isPlayer) {
    isSnapped = false;
    gl_FragColor = renderPlayerStarfish(uv);
    // return;
  }

  // Ambient plankton
  if (isAmbient) {
    isSnapped = false;
    gl_FragColor = renderAmbientPlankton(uv);
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

  // Fallback: pass through snapped color
  if (isSnapped) {
    gl_FragColor = snapped;
  }
  return;
}