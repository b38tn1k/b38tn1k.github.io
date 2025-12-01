#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform sampler2D ambientTexture;
uniform sampler2D currentTexture;
uniform sampler2D fbmTexture;
uniform sampler2D staticFbmTexture;
uniform vec2 uResolution;
uniform float uTime;
uniform float desaturateAmount;

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

float texFBM(vec2 uv) {
  vec3 lookup = texture2D(fbmTexture, fract(uv)).rgb;

  // Weighted combination of the three octaves
  return lookup.r * 0.5 + lookup.g * 0.35 + lookup.b * 0.15;
}

vec3 applyHueShift(vec3 rgb, float shift) {
  // convert to YIQ (cheap hue space)
  float Y = dot(rgb, vec3(0.299, 0.587, 0.114));
  float I = dot(rgb, vec3(0.596, -0.275, -0.321));
  float Q = dot(rgb, vec3(0.212, -0.523, 0.311));

  float s = sin(shift);
  float c = cos(shift);

  float I2 = I * c - Q * s;
  float Q2 = I * s + Q * c;

  // back to RGB
  return vec3(Y + 0.956 * I2 + 0.621 * Q2, Y - 0.272 * I2 - 0.647 * Q2,
              Y - 1.106 * I2 + 1.703 * Q2);
}

void main() {
  // texture coordinates from 0.0 to 1.0
  vec2 uv = vec2(vTexCoord.x, vTexCoord.y);
  // RGBA pixel @ current uv
  vec4 color = texture2D(tex0, uv);
  // one step in texture coordinates given the resolution
  vec2 texel = 1.0 / uResolution;
  // so we can see a neighbor pixel by going like this:
  // vec4 neighbor = texture2D(tex0, uv + vec2(texel.x, texel.y));
  // becasue we have GL_CLAMP_TO_EDGE wrapping mode,
  // we don't have to worry about going out of bounds

  // do some edge detction for sharpening and bloom
  vec3 blr = texture2D(tex0, uv + vec2(-texel.x, 0)).rgb * 0.25 +
             texture2D(tex0, uv + vec2(texel.x, 0)).rgb * 0.25 +
             texture2D(tex0, uv + vec2(0, -texel.y)).rgb * 0.25 +
             texture2D(tex0, uv + vec2(0, texel.y)).rgb * 0.25;

  vec3 detail = color.rgb - blr;
  color.rgb += detail * 0.35;

  float bright = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
  float bloom = smoothstep(0.6, 1.0, bright);

  color.rgb += vec3(0.05, 0.10, 0.15) * bloom;

  // so... vignette region-ing
  // float vignetteAoi = 0.05;
  // float borderX = smoothstep(vignetteAoi, 0.0, uv.x) + smoothstep(0.05,
  // 0.0, 1.0 - uv.x); float borderY = smoothstep(vignetteAoi, 0.0, uv.y) +
  // smoothstep(0.05, 0.0, 1.0 - uv.y);
  // // but wouldnt that make the vingette different in pixels based on the
  // screen size ratio?
  // yes, so lets move to pixel coorindates
  vec2 px = vTexCoord * uResolution;
  float vignettePixels = 20.0; // pixels
  float bx = smoothstep(vignettePixels, 0.0, px.x) +
             smoothstep(vignettePixels, 0.0, uResolution.x - px.x);

  float by = smoothstep(vignettePixels, 0.0, px.y) +
             smoothstep(vignettePixels, 0.0, uResolution.y - px.y);

  float vig = clamp((bx + by) * 0.5, 0.0, 1.0);
  color.rgb *= (1.0 - vig);

  float grey = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(color.rgb, vec3(grey), desaturateAmount);
  gl_FragColor = color;
}
