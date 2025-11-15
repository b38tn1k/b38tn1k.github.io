// ideas for alex:
// - we could do like a ping pong shader effect between two framebuffers for some effects, this would allow effects over groups of layers
// - I have some ideas how to do multi-color effects with regions, for like coral layers etc.. could be dont with additional textures or maybe even in shader code
// - I think a edge detection style thing, in the final post process, might be cool to give a bit of a drawn feel, is also just an interesting thing to implement and I think you would appreciate the elegance of how edge detection can work


// Fallbacks for default shaders
const vsDefault = `
#ifdef GL_ES
  precision mediump float;
#endif

attribute vec4 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  gl_Position = aPosition;
}
`;

const fsDefault = `
#ifdef GL_ES
  precision mediump float;
#endif

uniform sampler2D tex0;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y);
  gl_FragColor = texture2D(tex0, uv);
}
`;



export async function createRenderer(p) {

  const renderer = {
    layers: {},
    shaders: {},
    shader_components: {},
    activeShader: null,
    activePostShader: 'default',
    layerDirty: {},
    layerNames: ['backgroundLayer', 'worldLayer', 'entitiesLayer'], // 'uiLayer' excluded from main layers
    _pendingShaders: {},
    _shaderCache: new Map(),
    frameCount: 0,
    frameThreshold: 1,
    Debug: p.shared.Debug,
    base: null,

    async init() {
      // Create all major drawing layers (no shader layers)
      this.base = p.createGraphics(p.width, p.height, p.WEBGL);
      this.base.noStroke();
      this.layerNames.forEach(layerName => {
        this.layers[layerName] = p.createGraphics(p.width / p.shared.settings.graphicsScaling, p.height / p.shared.settings.graphicsScaling);
        this.layerDirty[layerName] = true;
        this.layers[layerName].textFont(p.shared.mainFont);
        this.layers[layerName].textAlign(p.CENTER, p.CENTER);
        this.layers[layerName].textSize(this.layers[layerName].width / 40);
      });
      this.layers['uiLayer'] = p.createGraphics(p.width, p.height);
      this.layerDirty['uiLayer'] = true;
      this.layers['uiLayer'].textFont(p.shared.mainFont);
      this.layers['uiLayer'].textAlign(p.CENTER, p.CENTER);
      this.layers['uiLayer'].textSize(this.layers['uiLayer'].width / 40);

      await this.loadShader('default', './shaders/default.vert', './shaders/default.frag');
      await this.loadShader('chroma', './shaders/chroma.vert', './shaders/chroma.frag');

      // we could be stacking these as like the texture level shaders

      // await this.loadShader('player', './shaders/player.vert', './shaders/player.frag');
      // await this.loadShader('enemy', './shaders/enemy.vert', './shaders/enemy.frag');
      // await this.loadShader('terrain', './shaders/terrain.vert', './shaders/terrain.frag');
      // await this.loadShader('background', './shaders/background.vert', './shaders/background.frag');


      // then there could be a final layer mastering one also - water color effect would be nice

      // 2d sampler canvas for voroni tile source for coral variation in color etc
    },

    colorToVec4(c) {
      return [
        p.red(c) / 255,
        p.green(c) / 255,
        p.blue(c) / 255,
        p.alpha(c) / 255
      ];
    },

    applyPostShader(shaderName = 'default') {

      if (p.shared.settings.enableShaders === false) {
        shaderName = 'default';
      }
      const shader = this.shaders[shaderName];
      if (!shader) {
        this.Debug.log('renderer', '[WARN]', `⚠️ Post shader "${shaderName}" not found.`);
        return;
      }

      p.shader(shader);
      try {
        shader.setUniform('tex0', this.base);
        shader.setUniform('uResolution', [p.width, p.height]);
        shader.setUniform('uTime', p.millis() / 1000.0);

        const chroma = p.shared.chroma;
        shader.setUniform('uChromaPlayer', this.colorToVec4(chroma.player));
        shader.setUniform('uChromaEnemy', this.colorToVec4(chroma.enemy));
        shader.setUniform('uChromaAmbient', this.colorToVec4(chroma.ambient));
        shader.setUniform('uChromaTerrain', this.colorToVec4(chroma.terrain));
        shader.setUniform('uChromaBackground', this.colorToVec4(chroma.background));
        // shader.setUniform('uChromaUI', this.colorToVec4(chroma.ui));
        shader.setUniform('uChromaCurrents', this.colorToVec4(chroma.current));

      } catch (err) {
        console.error('Error setting shader uniforms:', err);
        // Ignore errors if uniforms don't exist
      }

      p.push();
      p.translate(-p.width / 2, -p.height / 2);
      p.rectMode(p.CORNER);
      p.rect(0, 0, p.width, p.height);
      p.pop();


    },

    drawScene(drawFn) {
      this.frameCount++;
      // this.updateUniforms(p);

      for (const [name, layer] of Object.entries(this.layers)) {
        if (this.layerDirty[name]) {
          layer.clear();
          layer.noStroke();
          this.Debug.log('renderer', `🖌️ Redrawing layer: "${name}"`);
          if (layer._renderer?.GL) {
            layer.drawingContext.disable(layer.drawingContext.DEPTH_TEST);
          }
        }

        // Only apply deferred shaders after a few frames have passed since reset
        if (this._pendingShaders[name] && this.frameCount > this.frameThreshold) {
          this.Debug.log('renderer', `Applying Shader: "${name}"`);
          const shaderName = this._pendingShaders[name];
          const shader = this.shaders[shaderName];
          if (shader && layer._renderer?.GL) {
            this.createAndApplyShader(name, shaderName);
          }
        }
      }

      // Let scene draw into layers
      drawFn();

      // Mark all layers clean after draw
      for (const name in this.layerDirty) {
        this.layerDirty[name] = false;
      }

      this.Debug.log('renderer', `Compositing layers onto main canvas at frame ${this.frameCount} - ${p.frameCount}`);
      // Composite onto main canvas

      // this.base.clear();
      // const chroma = p.shared.chroma;
      // const bg = chroma.background;
      // this.base.background(bg[0], bg[1], bg[2], bg[3]);
      this.base.background(p.shared.chroma.background);

      // p.clear();

      const scaleFactor = p.shared.settings.graphicsScaling;
      this.base.image(this.layers.backgroundLayer, -p.width / 2, -p.height / 2, p.width, p.height);
      this.base.image(this.layers.worldLayer, -p.width / 2, -p.height / 2, p.width, p.height);
      this.base.image(this.layers.entitiesLayer, -p.width / 2, -p.height / 2, p.width, p.height);
      // this.base.image(this.layers.uiLayer, -p.width / 2, -p.height / 2, p.width, p.height);

      // this was an early idea, I think need to rework for multiple shaders  the 'texture level' shaders and a final pass shader
      // we might need to think on additional texture shaders required
      this.applyPostShader(this.activePostShader);
      p.resetShader();
      p.image(this.layers.uiLayer, -p.width / 2, -p.height / 2, p.width, p.height);

      // Check renderer readiness
      if (!this.ready && Object.keys(this._pendingShaders).length === 0) {
        this.ready = true;
        this.Debug.log('renderer', '✅ Renderer fully initialized with shaders');
      }
    },

    //// END OF FUN STUFF ////

    resize(w, h) {
      this.base.resizeCanvas(w, h);
      const scaling = p.shared.settings.graphicsScaling
      Object.entries(this.layers).forEach(([name, layer]) => {
        layer.resizeCanvas(w / scaling, h / scaling);


        this.layerDirty[name] = true; // mark dirty after resize
        this.Debug.log('renderer', `🔄 Resized layer "${name}" to (${w / scaling}, ${h / scaling})`);
      });
    },

    reset() {
      for (const [name, layer] of Object.entries(this.layers)) {
        layer.clear();
        layer.noStroke();
        if (layer._renderer?.GL) {
          layer.drawingContext.disable(layer.drawingContext.DEPTH_TEST);
        }
        this.layerDirty[name] = true; // mark everything dirty for next draw
      }
      this.activeShader = this.shaders.default;
      // this.updateUniforms(p);
      this.frameCount = 0;
      this.Debug.log('renderer', '🔄 Renderer reset, frame counter cleared');
    },

    use(shaderName = 'default') {
      this.activePostShader = shaderName;
    },

    markDirty(layerName) {
      if (!this.layers[layerName]) {
        this.Debug.log('renderer', '[WARN]', `⚠️ Tried to mark unknown layer dirty: "${layerName}". Creating a new layer.`);
        this.layers[layerName] = p.createGraphics(p.width, p.height);
      }
      this.layerDirty[layerName] = true;
    },

    markClean(layerName) {
      if (!this.layers[layerName]) {
        this.Debug.log('renderer', '[WARN]', `⚠️ Tried to mark unknown layer clean: "${layerName}". Creating a new layer.`);
        this.layers[layerName] = p.createGraphics(p.width, p.height);
      }
      this.layerDirty[layerName] = false;
    },

    async loadShader(name, vertPath, fragPath) {
      try {
        const [vert, frag] = await Promise.all([
          fetch(vertPath).then(res => (res.ok ? res.text() : vsDefault)),
          fetch(fragPath).then(res => (res.ok ? res.text() : fsDefault)),
        ]);
        this.shader_components[name] = { "vert": vert, "frag": frag };
        this.shaders[name] = p.createShader(vert, frag);
        this.Debug.log('renderer', `🎨 Loaded shader: ${name}`);
      } catch (err) {
        this.Debug.log('renderer', '[WARN]', `⚠️ Shader load failed (${name}), using buiLayerlt-in defaults`, err);
        this.shaders[name] = p.createShader(vsDefault, fsDefault);
      }
    },

    getOrCreateShader(shaderName, layer) {
      const shaderComp = this.shader_components[shaderName];
      if (!shaderComp) {
        this.Debug.log('renderer', '[WARN]', `⚠️ Shader components for "${shaderName}" not found.`);
        return null;
      }
      // Obtain WebGL context from the layer
      const gl = layer?._renderer?.GL;
      if (!gl) {
        this.Debug.log('renderer', '[WARN]', `⚠️ WebGL context not found for layer; cannot create shader "${shaderName}".`);
        return null;
      }
      // Assign a unique context ID if not already assigned
      if (!gl.__context_id) {
        gl.__context_id = Math.random().toString(36).substr(2, 9);
      }
      const contextId = gl.__context_id;
      // Compose a cache key unique per shader and WebGL context
      const cacheKey = `${shaderName}_${contextId}`;
      if (this._shaderCache.has(cacheKey)) {
        this.Debug.log('renderer', `♻️ Reusing cached shader "${shaderName}" for context.`);
        return this._shaderCache.get(cacheKey);
      }
      try {
        const newShader = layer.createShader(shaderComp.vert, shaderComp.frag);
        this._shaderCache.set(cacheKey, newShader);
        this.Debug.log('renderer', `🎨 Created and cached new shader "${shaderName}" for context.`);
        return newShader;
      } catch (err) {
        this.Debug.log('renderer', '[WARN]', `💥 Failed to create shader "${shaderName}" for context`, err);
        return null;
      }
    }

  };

  await renderer.init();
  p.shared.renderer = renderer;
  return renderer;
}