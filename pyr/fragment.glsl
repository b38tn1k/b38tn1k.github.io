precision mediump float;

uniform sampler2D uTex;
uniform sampler2D uTopTex;
uniform float uTime;
uniform float uMixFactor; // Mixing factor: 0.0 for just stipple, 1.0 for just random
varying vec2 vTexCoord;

// Pseudo-random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float pattern(float luminance) {
    float scale = 200.0;
    vec2 noise = vec2(random(vTexCoord + uTime), random(vTexCoord - uTime));
    float row = floor(vTexCoord.y * scale);
    float offset = mod(row, 2.0) * 0.5;

    vec2 posStipple = mod(vTexCoord * scale + vec2(offset, 0.0), 1.0);
    vec2 posRandom = mod(vTexCoord * scale + noise, 1.0);
    vec2 pos = mix(posStipple, posRandom, uMixFactor);
    
    // Apply logarithmic scaling to the distance function
    return step(0.5, distance(pos, vec2(0.5)) / (0.1 + log(2.0 - luminance)));
}


void main() {
    float epsilon = 0.1;
    vec4 col = texture2D(uTex, vTexCoord);
    float luminance = dot(col.rgb, vec3(0.299, 0.587, 0.114));
    
    // Calculate stipple effect
    if (col.r > 1.0 - epsilon) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        float stipple = pattern(luminance);
        gl_FragColor = vec4(vec3(stipple), 1.0);
    }

    // Multiply blending with topTexture
    vec4 topColor = texture2D(uTopTex, vTexCoord);

    gl_FragColor.rgb *= topColor.rgb;
}
