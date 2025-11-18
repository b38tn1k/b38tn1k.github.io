#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform vec2 uResolution;
uniform float uTime;

uniform vec4 uChromaPlayer;
uniform vec4 uChromaEnemy;
uniform vec4 uChromaTerrain;
uniform vec4 uChromaCurrents;
uniform vec4 uChromaBackground;
uniform vec4 uChromaAmbient;

bool exitEarly = false;

varying vec2 vTexCoord;

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

void main() {
  vec2 uv = vTexCoord;
  vec4 maskColor = texture2D(tex0, uv);

  // Force maskColor to snap to one of the known chroma keys.
  float dPlayer = distance(maskColor.rgb, uChromaPlayer.rgb);
  float dEnemy = distance(maskColor.rgb, uChromaEnemy.rgb);
  float dTerrain = distance(maskColor.rgb, uChromaTerrain.rgb);
  float dBackground = distance(maskColor.rgb, uChromaBackground.rgb);
  float dCurrents = distance(maskColor.rgb, uChromaCurrents.rgb);
  float dAmbient = distance(maskColor.rgb, uChromaAmbient.rgb);

  float minD = dPlayer;
  vec4 snapped = uChromaPlayer;
  if (dPlayer < minD) {
    minD = dPlayer;
    snapped = uChromaPlayer;
  }
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
    snapped = uChromaCurrents;
  }
  if (dAmbient < minD) {
    minD = dAmbient;
    snapped = uChromaAmbient;
  }
  maskColor = snapped;

  // IDENTIFY MASKED REGIONS AND FLAG THEM FOR CUSTOM RENDERING
  float eps = 0.05;
  bool isTerrain = distance(maskColor.rgb, uChromaTerrain.rgb) < eps;
  bool isBackground = distance(maskColor.rgb, uChromaBackground.rgb) < eps;
  bool isCurrents = distance(maskColor.rgb, uChromaCurrents.rgb) < eps;
  bool isPlayer = distance(maskColor.rgb, uChromaPlayer.rgb) < eps;
  bool isEnemy = distance(maskColor.rgb, uChromaEnemy.rgb) < eps;
  bool isAmbient = distance(maskColor.rgb, uChromaAmbient.rgb) < eps;

  if (exitEarly) {
    gl_FragColor = maskColor;
    return;
  }

  // Player outline detection
  // Sample surrounding texels; if any are player but this one is not, draw
  // black outline
  if (!isPlayer) {
    float o = 1.0 / 380.0; // slightly larger radius for thicker outline

    vec2 offsets[8];
    offsets[0] = vec2(-o, 0.0);
    offsets[1] = vec2(o, 0.0);
    offsets[2] = vec2(0.0, -o);
    offsets[3] = vec2(0.0, o);

    // Diagonals for thicker silhouette
    offsets[4] = vec2(-o, -o);
    offsets[5] = vec2(o, -o);
    offsets[6] = vec2(-o, o);
    offsets[7] = vec2(o, o);

    bool nearPlayer = false;
    for (int i = 0; i < 8; i++) {
      vec4 mc = texture2D(tex0, uv + offsets[i]);
      if (distance(mc.rgb, uChromaPlayer.rgb) < eps) {
        nearPlayer = true;
      }
    }

    if (nearPlayer) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
  }
  if (isPlayer) {

    // -----------------------------------------
    // Vibrant Starfish Shader (Pink + Speckles)
    // -----------------------------------------

    vec2 p = uv;

    // Base vibrant starfish color
    vec3 basePink = vec3(1.00, 0.25, 0.65);

    // Radial starfish-style darkening toward center
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

    gl_FragColor = vec4(starfishColor, 1.0);
    return;
  }

  if (isBackground || isCurrents) {

    vec2 p = uv;

    // Depth: top of the screen is brighter, deeper is darker
    float depth = 1.0 - uv.y;

    // Large-area wavy distortion for underwater feel
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

    // God-ray beams from a point above the screen
    vec2 lightPos = vec2(0.5, 1.3);
    vec2 toLight = lightPos - uv;
    float distToLight = length(toLight);
    float angle = atan(toLight.y, toLight.x);

    float rayBands = sin(angle * 18.0 + uTime * 0.7);
    float rayMask = smoothstep(0.0, 0.6, rayBands);
    float rayFalloff = exp(-distToLight * 3.0);

    float godRays = rayMask * rayFalloff;
    waterColor += vec3(0.22, 0.45, 0.50) * godRays * 0.35;
    // Fog falloff with depth (distant water gets hazy and brighter)
    float fogAmount = smoothstep(0.55, 1.1, uv.y);
    vec3 fogColor = vec3(0.35, 0.75, 0.80);
    waterColor = mix(waterColor, fogColor, fogAmount * 0.5);

    gl_FragColor = vec4(waterColor, 1.0);
    return;
  }

  if (isTerrain) {

    // ----------------------------
    // Natural Cave Rock Shader
    // ----------------------------

    vec2 p = uv;

    // Base noise layers for cave shape
    float n1 = fbm(p * 2.0);
    float n2 = fbm(p * 5.0 + vec2(3.1, 7.3));
    float n3 = fbm(p * 12.0 - vec2(5.4, 1.7));
    float pebble = noise(p * 25.0) * 0.4 + noise(p * 60.0) * 0.2;

    // Combined rock height map
    float height = n1 * 0.5 + n2 * 0.3 + n3 * 0.1 + pebble * 0.4;

    // Derive normals from height field (cheap normal mapping)
    float epsN = 0.001;
    float hL = fbm((p + vec2(-epsN, 0.0)) * 2.0);
    float hR = fbm((p + vec2(epsN, 0.0)) * 2.0);
    float hD = fbm((p + vec2(0.0, -epsN)) * 2.0);
    float hU = fbm((p + vec2(0.0, epsN)) * 2.0);
    vec3 normal = normalize(vec3(hL - hR, hD - hU, 0.03));

    // Light direction (tuned for cave mood)
    vec3 lightDir = normalize(vec3(-0.4, 0.6, 0.7));

    // Lambert shading
    float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);

    // Ambient occlusion: darken creases naturally
    float ao = smoothstep(0.0, 0.5, height);

    // Cave palette
    vec3 darkRock = vec3(0.30, 0.28, 0.24);
    vec3 midRock = vec3(0.55, 0.50, 0.40);
    vec3 lightRock = vec3(0.82, 0.78, 0.65);

    // Base color from height
    vec3 rockColor = mix(darkRock, midRock, height);
    rockColor = mix(rockColor, lightRock, diffuse * 1.1);

    // Add surface grit
    float grit = noise(p * 40.0);
    rockColor += grit * 0.12;
    float pebbleShade = smoothstep(0.55, 0.85, pebble);
    rockColor -= vec3(0.12, 0.10, 0.09) * pebbleShade * 0.4;

    // Add moisture streaks on vertical surfaces
    float wet = fbm(p * vec2(1.0, 6.0) + vec2(0.0, -uTime * 0.1));
    wet = smoothstep(0.65, 0.95, wet);
    rockColor += vec3(0.10, 0.15, 0.18) * wet * 0.15;

    // Apply ambient occlusion
    rockColor *= (0.70 + ao * 0.35);

    gl_FragColor = vec4(rockColor, 1.0);
  } else {
    // Pass through other colors unchanged
    gl_FragColor = maskColor;
  }
}