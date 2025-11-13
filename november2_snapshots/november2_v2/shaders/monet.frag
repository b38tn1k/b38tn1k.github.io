#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform vec2 uResolution;
varying vec2 vTexCoord;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

// Simple hash-based noise
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// UV warp to form large cell-like regions
vec2 cellWarp(vec2 uv, float scale, float strength) {
    vec2 cell = floor(uv * scale);
    vec2 offset = vec2(noise(cell), noise(cell + 1.3)) - 0.5;
    return uv + offset * (strength / scale);
}

void main() {
    vec2 uv = vTexCoord;
    vec2 texel = 1.0 / uResolution;

    float scale = 2.0*uResolution[0];
    // --- Warp UV to cell-like pattern ---
    uv = cellWarp(uv, scale, 0.5); // scale controls blob density

    // --- Large kernel painterly smoothing (5x5 average) ---
    vec4 col = vec4(0.0);
    for (float x = -2.0; x <= 2.0; x++) {
        for (float y = -2.0; y <= 2.0; y++) {
            vec2 offset = vec2(x, y) * texel * 1.5;
            col += texture2D(tex0, uv + offset);
        }
    }
    col /= 25.0;

    // --- Posterization (fewer tones = chunkier regions) ---
    col.rgb = floor(col.rgb * 6.0) / 6.0;

    // --- Subtle hue jitter for variation ---
    float hueShift = (rand(uv * 30.0) - 0.5) * 0.1;
    col.rg += vec2(hueShift * 0.3, hueShift * -0.3);

    // --- Canvas texture overlay (fine noise) ---
    float canvas = rand(uv * 1000.0) * 0.05;
    col.rgb += canvas;

    // --- Gentle highlight bloom ---
    float brightness = dot(col.rgb, vec3(0.299, 0.587, 0.114));
    if (brightness > 0.7) {
        col.rgb += vec3(0.12, 0.1, 0.08) * (brightness - 0.7);
    }

    gl_FragColor = vec4(col.rgb, 1.0);
}