#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform vec2 uResolution;
uniform float uTime;

uniform vec4 uChromaPlayer;
uniform vec4 uChromaEnemy;
uniform vec4 uChromaTerrain;
uniform vec4 uChromaBackground;
uniform vec4 uChromaUI;

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
  float dUI = distance(maskColor.rgb, uChromaUI.rgb);

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
  if (dUI < minD) {
    minD = dUI;
    snapped = uChromaUI;
  }
  maskColor = snapped;

  // IDENTIFY MASKED REGIONS AND FLAG THEM FOR CUSTOM RENDERING
  float eps = 0.05;
  bool isTerrain = distance(maskColor.rgb, uChromaTerrain.rgb) < eps;
  bool isBackground = distance(maskColor.rgb, uChromaBackground.rgb) < eps;
  bool isPlayer = distance(maskColor.rgb, uChromaPlayer.rgb) < eps;
  bool isEnemy = distance(maskColor.rgb, uChromaEnemy.rgb) < eps;
  bool isUI = distance(maskColor.rgb, uChromaUI.rgb) < eps;

  if (isBackground) {

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
    vec3 deepColor = vec3(0.02, 0.08, 0.18);
    vec3 midColor = vec3(0.05, 0.22, 0.42);
    vec3 shallowColor = vec3(0.10, 0.35, 0.55);

    // Depth-based color blend
    vec3 waterColor = mix(deepColor, midColor, depth);
    waterColor = mix(waterColor, shallowColor, depth * 0.5);

    // Apply caustic highlights
    waterColor += caustics * 0.25;

    // God-ray beams from a point above the screen
    vec2 lightPos = vec2(0.5, 1.3);
    vec2 toLight = lightPos - uv;
    float distToLight = length(toLight);
    float angle = atan(toLight.y, toLight.x);

    float rayBands = sin(angle * 18.0 + uTime * 0.7);
    float rayMask = smoothstep(0.0, 0.6, rayBands);
    float rayFalloff = exp(-distToLight * 3.0);

    float godRays = rayMask * rayFalloff;
    waterColor += vec3(0.12, 0.20, 0.30) * godRays * 0.3;
    // Fog falloff with depth (distant water gets hazy and brighter)
    float fogAmount = smoothstep(0.3, 1.0, uv.y);
    vec3 fogColor = vec3(0.20, 0.40, 0.60);
    waterColor = mix(waterColor, fogColor, fogAmount * 0.5);

    gl_FragColor = vec4(waterColor, 1.0);
    return;
  }
   
    gl_FragColor = maskColor;

}