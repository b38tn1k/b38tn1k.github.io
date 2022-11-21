#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D texture;
float mix = 0.4;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec4 col = texture2D(texture, uv);
  vec4 sepia = texture2D(texture, uv);
  sepia.r = col.r * 0.393 + col.g * 0.769 + col.b * 0.189;
  sepia.g = col.r * 0.349 + col.g * 0.686 + col.b * 0.168;
  sepia.b = col.r * 0.272 + col.g * 0.534 + col.b * 0.131;
  col.r = mix * col.r + (1.0 - mix) * sepia.r;
  col.g = mix * col.g + (1.0 - mix) * sepia.g;
  col.b = mix * col.b + (1.0 - mix) * sepia.b;
  gl_FragColor = col;
}
