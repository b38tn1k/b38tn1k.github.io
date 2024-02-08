#ifdef GL_ES
precision mediump float;
#endif

#define PIXHEIGHT 4.0
#define BLURSPREAD 0.5
#define SEPIAMIX 0.3
#define BLOOMMIX 0.2
#define CURVE 5.
#define PI 3.14159265
#define SLOPACITY 1.
#define VIG 75.
#define NOISEAMOUNT 0.1
#define BRIGHTNESS 1.1
varying vec2 fragCoord;
uniform sampler2D texture;
uniform vec3 res;
uniform vec2 texelSize;
uniform vec2 randomNumbers;
uniform float sinWave;

vec2 curveMap(vec2 uv) {
  uv = uv * 2.0 - 1.0;
  vec2 off = abs(uv.yx) / vec2(CURVE, CURVE);
  uv = uv + uv * off * off;
  uv = uv * 0.5 + 0.5;
  return uv;
}

vec4 sepiaIze(vec4 arg) {
  vec4 sepia = arg;
  vec4 result = arg;
  sepia.r = arg.r * 0.393 + arg.g * 0.769 + arg.b * 0.189;
  sepia.g = arg.r * 0.349 + arg.g * 0.686 + arg.b * 0.168;
  sepia.b = arg.r * 0.272 + arg.g * 0.534 + arg.b * 0.131;
  result.r = SEPIAMIX * arg.r + (1.0 - SEPIAMIX) * sepia.r;
  result.g = SEPIAMIX * arg.g + (1.0 - SEPIAMIX) * sepia.g;
  result.b = SEPIAMIX * arg.b + (1.0 - SEPIAMIX) * sepia.b;
  return result;
}

vec4 sLGen(float uvC, float resolution){
    float intensity = sin(uvC * resolution * PI * 10.);
    intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
    return vec4(vec3(pow(intensity, SLOPACITY)), 1.0);
}

vec4 applyScanLines(vec4 myVec, vec2 uv, vec3 res) {
  myVec *= sLGen(uv.x, res.y);
  myVec *= sLGen(uv.y, res.x);
  return myVec;
}

float rand(vec2 co, vec2 randomNumbers){
    return NOISEAMOUNT * fract(sin(dot(co, randomNumbers)) * 43758.5453);
}

vec4 aberationPattern(float uvC, float resolution) {
  float intensity = sin(uvC * resolution * PI * 10.);
  intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
  return vec4(1., 1. ,1. , pow(intensity, SLOPACITY));
}

vec4 chromaA(vec4 myVec, sampler2D texture, vec2 uv, vec2 offs, vec3 res, float sinWave) {
  vec4 aberationLayer = texture2D(texture, uv);
  offs *= sinWave;
  aberationLayer.r = (texture2D(texture, uv + offs).r + texture2D(texture, uv - offs).r) * 0.5;
  aberationLayer.g = (texture2D(texture, uv + offs).g + texture2D(texture, uv - offs).g) * 0.5;
  aberationLayer.b = (texture2D(texture, uv + offs).b + texture2D(texture, uv - offs).b) * 0.5;
  aberationLayer *= aberationPattern(uv.x, res.y);
  aberationLayer *= aberationPattern(uv.y, res.x);
  float mix = 0.25;
  myVec = (1. - mix) * myVec + mix * aberationLayer;
  return myVec;
}

void main() {
  vec2 uv = fragCoord;
  vec2 offset = texelSize * BLURSPREAD;
  uv.y = 1.0 - uv.y;
  uv = curveMap(uv);
  vec4 col = texture2D(texture, uv);
  vec4 blur = texture2D(texture, uv);
  col = chromaA(col, texture, uv, 2.*texelSize, res, sinWave);
  blur = chromaA(blur, texture, uv, 2.*texelSize, res, sinWave);

  blur += rand(uv, randomNumbers);
  col += rand(uv, randomNumbers);
  blur = applyScanLines(blur, uv, res);
  // col = applyScanLines(col, uv, res);
  blur += texture2D(texture, uv + vec2(-offset.x, -offset.y));
  blur += texture2D(texture, uv + vec2(0.0, -offset.y));
  blur += texture2D(texture, uv + vec2(offset.x, -offset.y));
  blur += texture2D(texture, uv + vec2(-offset.x, 0.0));
  blur += texture2D(texture, uv + vec2(offset.x, 0.0));
  blur += texture2D(texture, uv + vec2(-offset.x, offset.y));
  blur += texture2D(texture, uv + vec2(0.0, offset.y));
  blur += texture2D(texture, uv + vec2(offset.x, offset.y));
  blur /= 9.0;
  blur = sepiaIze(blur);
  col = sepiaIze(col);
  float avg = blur.r + blur.g + blur.b;
  avg = avg/3.;
  vec4 bloom = mix(col, blur, clamp(avg*(1.0 + BLOOMMIX), 0.0, 1.0));
  vec2 VigUV2 = abs(uv * 2.0 - 1.0);
  vec2 u = VIG / res.xy * 0.5;
  u = smoothstep(vec2(0), u, 1.0 - VigUV2);
  bloom = bloom *u.x * u.y;
  bloom *= BRIGHTNESS;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0){
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
      gl_FragColor = bloom;
  }
}
