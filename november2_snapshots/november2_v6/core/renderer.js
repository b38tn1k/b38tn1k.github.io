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
    layerNames: ['backgroundLayer', 'worldLayer', 'entitiesLayer', 'uiLayer', 'ambientTexture', 'currentTexture'],
    _pendingShaders: {},
    _shaderCache: new Map(),
    frameCount: 0,
    frameThreshold: 1,
    Debug: p.shared.Debug,
    base: null,

    async init() {
      console.log(p.width, p.height);
      if (p.height < 640) {
        p.shared.isPortrait = true;
        p.shared.settings.graphicsScaling = 1;
      }
      // Create all major drawing layers
      // base: 2D composite buffer
      this.base = p.createGraphics(p.width, p.height);
      this.base.noStroke();
      this.base.pixelDensity(1);
      this.base.noSmooth();

      // postBuffer: single WEBGL buffer for dual-pass shader pipeline
      this.postBuffer = p.createGraphics(p.width, p.height, p.WEBGL);
      this.postBuffer.noStroke();
      this.postBuffer.textureWrap(this.postBuffer.CLAMP);

      // Dual-pass shader names
      this.textureShaderName = 'chroma';   // first pass
      this.postShaderName = 'default';     // second pass (can be set to null to disable)

      this.layerNames.forEach(layerName => {
        this.Debug.log('renderer', `Creating layer: "${layerName}"`);
        const scale = p.shared.settings.graphicsScaling;
        this.layers[layerName] = p.createGraphics(Math.floor(p.width / scale), Math.floor(p.height / scale));
        this.layerDirty[layerName] = true;
        this.layers[layerName].textFont(p.shared.mainFont);
        this.layers[layerName].textAlign(p.CENTER, p.CENTER);
        this.layers[layerName].textSize(this.layers[layerName].width / 40);
        this.layers[layerName].pixelDensity(1);
        this.layers[layerName].noSmooth();
        this.layers[layerName].elt.getContext('2d').imageSmoothingEnabled = false;
      });

      // await this.loadShader('default', './shaders/testing_and_old/monet.vert', './shaders/testing_and_old/monet.frag');
      // await this.loadShader('default', './shaders/testing_and_old/nes.vert', './shaders/testing_and_old/nes.frag');
      await this.loadShader('default', './shaders/post.vert', './shaders/post.frag');
      await this.loadShader('chroma', './shaders/chroma.vert', './shaders/chroma.frag');

    },

    colorToVec4(c) {
      return [
        p.red(c) / 255,
        p.green(c) / 255,
        p.blue(c) / 255,
        p.alpha(c) / 255
      ];
    },

    setCommonPostUniforms(shader, sourceTexture) {
      try {
        shader.setUniform('tex0', sourceTexture);
        shader.setUniform('ambientTexture', this.layers.ambientTexture);
        shader.setUniform('currentTexture', this.layers.currentTexture);
        shader.setUniform('uResolution', [p.width, p.height]);
        shader.setUniform('uTime', p.millis() / 1000.0);
        shader.setUniform('skipTexture', 0);

        const chroma = p.shared.chroma;
        shader.setUniform('uChromaPlayer', this.colorToVec4(chroma.player));
        shader.setUniform('uChromaTerrain', this.colorToVec4(chroma.terrain));
        shader.setUniform('uChromaVegetation', this.colorToVec4(chroma.vegetation));
        shader.setUniform('uChromaStaticVegetation', this.colorToVec4(chroma.staticVegetation));
        shader.setUniform('uChromaCurrent', this.colorToVec4(chroma.current));
        shader.setUniform('uChromaBackground', this.colorToVec4(chroma.background));
        shader.setUniform('uChromaAmbient', this.colorToVec4(chroma.ambient));
        shader.setUniform('uChromaEnemy', this.colorToVec4(chroma.enemy));
        
        
        
      } catch (err) {
        console.error('Error setting post shader uniforms:', err);
      }
    },

    runDualPass() {
      const w = p.width;
      const h = p.height;

      // If shaders are disabled, just blit base to the screen
      if (p.shared.settings.enableShaders === false) {
        p.image(this.base, -w / 2, -h / 2, w, h);
        return;
      }

      // 1) First pass: base (2D) -> postBuffer (WEBGL) with textureShaderName
      const texName = this.textureShaderName;
      const textureShader = texName ? this.getOrCreateShader(texName, this.postBuffer) : null;

      if (!textureShader) {
        // Fallback: no shader, draw base directly
        p.image(this.base, -w / 2, -h / 2, w, h);
        return;
      }

      this.postBuffer.shader(textureShader);
      this.setCommonPostUniforms(textureShader, this.base);

      this.postBuffer.push();
      this.postBuffer.resetMatrix();
      this.postBuffer.noStroke();
      this.postBuffer.rectMode(p.CORNER);
      this.postBuffer.translate(-w / 2, -h / 2);
      this.postBuffer.rect(0, 0, w, h);
      this.postBuffer.pop();

      // 2) Second pass: postBuffer -> screen with postShaderName (optional)
      const postName = this.postShaderName;
      if (!postName) {
        // No post-processing shader: draw postBuffer to screen
        p.image(this.postBuffer, -w / 2, -h / 2, w, h);
        return;
      }

      const postShader = this.getOrCreateShader(postName, p);
      if (!postShader) {
        p.image(this.postBuffer, -w / 2, -h / 2, w, h);
        return;
      }

      p.shader(postShader);
      this.setCommonPostUniforms(postShader, this.postBuffer);

      p.push();
      p.translate(-w / 2, -h / 2);
      p.rectMode(p.CORNER);
      p.noStroke();
      p.rect(0, 0, w, h);
      p.pop();

      p.resetShader();
    },

    drawScene(drawFn) {
      this.frameCount++;
      // this.updateUniforms(p);

      for (const [name, layer] of Object.entries(this.layers)) {
        if (this.layerDirty[name]) {
          layer.clear();
          layer.noStroke();
          // this.Debug.log('renderer', `🖌️ Redrawing layer: "${name}"`);
          // if (layer._renderer?.GL) {
          //   layer.drawingContext.disable(layer.drawingContext.DEPTH_TEST);
          // }
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

      // Composite onto base (2D)
      this.base.background(p.shared.chroma.background);
      const scaleFactor = p.shared.settings.graphicsScaling;
      this.base.image(this.layers.backgroundLayer, 0, 0, p.width, p.height);
      this.base.image(this.layers.worldLayer, 0, 0, p.width, p.height);
      this.base.image(this.layers.entitiesLayer, 0, 0, p.width, p.height);

      // Run dual-pass shader pipeline to draw to the main canvas
      this.runDualPass();

      // UI on top
      p.image(this.layers.uiLayer, -p.width / 2, -p.height / 2, p.width, p.height);
      // p.image(this.layers.currentTexture, -p.width / 2, -p.height / 2, p.width, p.height);
      // p.image(this.layers.worldLayer, -p.width / 2, -p.height / 2, p.width, p.height);
      

      // Check renderer readiness
      if (!this.ready && Object.keys(this._pendingShaders).length === 0) {
        this.ready = true;
        this.Debug.log('renderer', '✅ Renderer fully initialized with shaders');
      }
    },


    //// END OF FUN STUFF ////

    resize(w, h) {
      this.base.resizeCanvas(w, h);
      if (this.postBuffer) {
        this.postBuffer.resizeCanvas(w, h);
      }
      const scaling = p.shared.settings.graphicsScaling
      Object.entries(this.layers).forEach(([name, layer]) => {
        layer.resizeCanvas(Math.floor(w / scaling), Math.floor(h / scaling));
        this.layerDirty[name] = true; // mark dirty after resize
        this.Debug.log('renderer', `🔄 Resized layer "${name}" to (${Math.floor(w / scaling)}, ${Math.floor(h / scaling)})`);
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
      if (this.postBuffer) {
        this.postBuffer.clear();
      }
      this.activeShader = this.shaders.default;
      // this.updateUniforms(p);
      this.frameCount = 0;
      this.Debug.log('renderer', '🔄 Renderer reset, frame counter cleared');
      this.Debug.log('renderer', 'Base Dims:', p.width, p.height, 'Layer Dims:', this.layers.entitiesLayer.width, this.layers.entitiesLayer.height);
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
        // this.Debug.log('renderer', `♻️ Reusing cached shader "${shaderName}" for context.`);
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
    },

    toLayerCoords(layerName, globalX, globalY) {
      const layer = this.layers[layerName];
      if (!layer) {
        this.Debug.log('renderer', '[WARN]', `⚠️ Unknown layer "${layerName}" passed to toLayerCoords.`);
        return [globalX, globalY];
      }

      const scaling = p.shared.settings.graphicsScaling || 1;

      // 1. Undo the graphics scaling (screen → internal canvas space)
      let x1 = globalX / scaling;
      let y1 = globalY / scaling;

      // 2. Undo portrait rotation if active
      // (System sets p.shared.isPortrait during resize)
      if (p.shared.isPortrait) {
        const oldX = x1;
        const oldY = y1;

        // canvas was rotated 90° clockwise visually,
        // so invert by rotating 90° counter-clockwise
        x1 = oldY;
        y1 = layer.height - oldX;
      }

      // 3. Clamp to layer bounds for safety
      x1 = Math.max(0, Math.min(layer.width, x1));
      y1 = Math.max(0, Math.min(layer.height, y1));

      return [x1, y1];
    }

  };

  await renderer.init();
  p.shared.renderer = renderer;
  return renderer;
}
