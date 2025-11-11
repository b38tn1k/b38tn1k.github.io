#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
varying vec2 vTexCoord;

void main() {
    vec2 uv = vec2(vTexCoord.x, vTexCoord.y);

    // Pixelation
    float pixelSize = 1028.0;
    uv = floor(uv * pixelSize) / pixelSize;
    
    // Bit Crusher
    vec4 color = texture2D(tex0, uv);
    color.r = floor(color.r * 8.0) / 7.0;
    color.g = floor(color.g * 8.0) / 7.0;
    color.b = floor(color.b * 4.0) / 3.0;

    // Bloom
    float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    if (brightness > 0.7) {
        color.rgb += vec3(0.1, 0.1, 0.1) * (brightness - 0.7);
    }
    // Desaturation
    float gray = dot(color.rgb, vec3(0.3, 0.59, 0.11));
    color.rgb = mix(color.rgb, vec3(gray), 0.2);

    gl_FragColor = color;
}