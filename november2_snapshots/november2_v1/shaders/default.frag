#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vec2(vTexCoord.x, vTexCoord.y);
  gl_FragColor = texture2D(tex0, uv);
}