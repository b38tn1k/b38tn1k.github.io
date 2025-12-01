import { createTiming } from './core/timing.js';
import { createRenderer } from './core/renderer.js';
import { registerControls } from './core/controls.js';
import { registerSystemEvents, setupCanvasWithAdaptation, initializeCanvasPostSetup } from './core/system.js';
import { createSceneManager } from './core/sceneManager.js';
import { createAudioManager } from './core/audio.js';
import { createGameState } from './core/state.js';
import { Debug } from './core/debug.js';
import { createUI } from './core/ui.js';
import { Settings } from './config/settings.js';
import { parseLevel } from './core/parseLevel.js';
import { applyChromaMapWithDisable } from './core/utils.js';


import { MenuScene } from './scenes/menu.js';
import { ArtSceneOne } from './scenes/story1.js';
import { ArtSceneTwo } from './scenes/story2.js';
import { ChapterScene } from './scenes/chapter.js';
import { TutorialScene } from './scenes/tutorial.js';
import { Level1Scene } from './scenes/level1.js';
import { GameOverScene } from './scenes/gameover.js';
import { JsonInputScene } from './scenes/jsonInput.js';


import { Player } from './entities/player.js';


export const mainSketch = (p) => {
  p.shared = {};
  p.shared.assets = {};

  p.shared.tweens = [];

  p.shared.tween = function (obj, setter, target, duration = 300, onFinish = null) {
    let startValue;

    // Unified getter resolution
    const fn = obj[setter];
    if (typeof fn === 'function') {
      // Handle known p5.sound getters
      if (setter === 'setVolume') {
        startValue = obj.getVolume();
      } else if (setter === 'freq') {
        startValue = obj.freq();
      } else if (setter === 'pan') {
        startValue = obj.getPan();
      } else if (setter === 'setRate') {
        startValue = obj.getRate();
      } else {
        console.warn('Tween: Unknown setter:', setter);
        return;
      }

      // Normalize AudioParam-like wrappers
      if (startValue && typeof startValue === 'object' && typeof startValue.value === 'number') {
        startValue = startValue.value;
      }

    } else {
      // numeric property
      startValue = obj[setter];
    }

    if (!isFinite(startValue)) {
      console.warn('Tween: startValue is non-finite for', obj, setter, startValue);
      return;
    }

    const startTime = p.millis();

    p.shared.tweens.push({
      obj,
      setter,
      startValue,
      target,
      duration,
      startTime,
      onFinish
    });
  };

  p.preload = () => {
    // p.shared.mainFont = p.loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
    // p.shared.mainFont = p.loadFont('./assets/found/Patrick_Hand/PatrickHand-Regular.ttf');
    p.shared.mainFont = p.loadFont('./assets/found/Rubik_Bubbles/RubikBubbles-Regular.ttf');

    // p.shared.mainFont = p.loadFont('./assets/found/Comic_Neue/ComicNeue-Regular.ttf');
    p.shared.levels = p.loadJSON('./config/levels.json');
    p.shared.chroma = p.loadJSON('./config/chroma.json');
    p.shared.assets['textures'] = {};
    // p.shared.assets['textures']['rocks'] = p.loadImage('./assets/created/peruRocks.png');
    p.shared.assets['textures']['patterned_waves'] = p.loadImage('./assets/created/waves_patterned.png');
    p.shared.assets['storyAssets'] = {};
    p.shared.assets.storyAssets['bg1'] = p.loadImage('./assets/created/raw/story_bg_1.png');
    p.shared.assets.storyAssets['bg2'] = p.loadImage('./assets/created/raw/story_bg_2.png');
    p.shared.assets.storyAssets['bg3'] = p.loadImage('./assets/created/raw/story_bg_3.png');
    p.shared.assets.storyAssets['ssheetPink'] = p.loadImage('./assets/created/raw/pink_sprite_sheet_scaled.png');
    p.shared.assets.storyAssets['ssheetYellow'] = p.loadImage('./assets/created/raw/yellow_sprite_sheet_scaled.png');
    p.shared.assets.storyAssets['ssheetLightening'] = p.loadImage('./assets/created/raw/lightening_scaled.png');
    p.shared.assets.storyAssets['ssheetWaves'] = p.loadImage('./assets/created/raw/waves_scaled.png');
    p.shared.assets.storyAssets['bgStorm'] = p.loadImage('./assets/created/raw/storm_bg_scaled.png');
    p.shared.assets.storyAssets['bgStormTrans'] = p.loadImage('./assets/created/raw/storm_bg_trans_scaled.png');
    p.shared.assets['gameIllustrationAssets'] = {};
    p.shared.assets['gameIllustrationAssets'] ['friend'] = p.loadImage('./assets/created/raw/friendTexture2.png');
    p.shared.assets.audio = {};
    p.shared.assets.audio['story1'] = p.loadSound('./assets/created/anemone_script1.mp3');
    p.shared.assets.audio['story2'] = p.loadSound('./assets/created/anemone_script2.mp3');
    p.shared.assets.audio['noise_wave'] = p.loadSound('./assets/created/noise_wave.mp3');
    p.shared.assets.audio['ohno'] = p.loadSound('./assets/created/ohno.mp3');
    p.shared.assets.audio['theme'] = p.loadSound('./assets/created/meadowhawk.mp3');

    // p.shared.assets.logo = p.loadImage('./assets/created/logo1.png');
  };

  p.setup = async () => {
    p.shared.Debug = Debug;
    p.shared.settings = Settings
    p.shared.timing = createTiming(p);
    p.shared.audio = createAudioManager(p);

    applyChromaMapWithDisable(p, p.shared.chroma);
    p.colorMode(p.RGB, 255);

    setupCanvasWithAdaptation(p);

    p.pixelDensity(p.shared.settings.pixelDensity);
    p.frameRate(p.shared.settings.fps);
    p.textFont(p.shared.mainFont);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(p.width / 30);



    p.shared.parseLevel = parseLevel;
    p.shared.state = createGameState();
    p.shared.renderer = await createRenderer(p);
    p.shared.sceneManager = createSceneManager(p);
    p.shared.ui = createUI(p);
    p.shared.player = new Player(p);


    registerSystemEvents(p);
    registerControls(p);
    p.shared.audio.register('story1', p.shared.assets.audio['story1']);
    p.shared.audio.register('story2', p.shared.assets.audio['story2']);
    p.shared.audio.register('noise_wave', p.shared.assets.audio['noise_wave']);
    p.shared.audio.register('ohno', p.shared.assets.audio['ohno']);
    p.shared.audio.register('theme', p.shared.assets.audio['theme']);
    // p5.soundOut.output.gain.value = 0;   // mute immediately
    p.userStartAudio();
    p.shared.audio.warmAll();

    // Register scenes
    // this.p.shared.levels.level2;
    p.shared.sceneManager.register('menu', MenuScene);
    
    p.shared.sceneManager.register('chapter1', ChapterScene, { levels: [1, 2, 3] });
    p.shared.sceneManager.register('chapter2', ChapterScene, { levels: [4, 5, 6, 7] });
    p.shared.sceneManager.register('chapter3', ChapterScene, { levels: [8, 9, 10, 11] });

    p.shared.sceneManager.register('level1', ArtSceneOne);
    p.shared.sceneManager.register('level1level', TutorialScene, { level: p.shared.levels.level1, nextScene: 'level2', chapter: 'chapter1' });
    p.shared.sceneManager.register('level2', Level1Scene, { level: p.shared.levels.level2, nextScene: 'level3', chapter: 'chapter1' });
    p.shared.sceneManager.register('level3', Level1Scene, { level: p.shared.levels.level3, nextScene: 'level4', chapter: 'chapter1' });

    p.shared.sceneManager.register('level4', Level1Scene, { level: p.shared.levels.level4, nextScene: 'level5', chapter: 'chapter2' });
    p.shared.sceneManager.register('level5', Level1Scene, { level: p.shared.levels.level5, nextScene: 'level6', chapter: 'chapter2' });
    p.shared.sceneManager.register('level6', Level1Scene, { level: p.shared.levels.level5b, nextScene: 'level7', chapter: 'chapter2' });
    p.shared.sceneManager.register('level7', Level1Scene, { level: p.shared.levels.level6, nextScene: 'level8', chapter: 'chapter2' });

    p.shared.sceneManager.register('level8', Level1Scene, { level: p.shared.levels.level7, nextScene: 'level9', chapter: 'chapter3' });
    p.shared.sceneManager.register('level9', Level1Scene, { level: p.shared.levels.level8, nextScene: 'level10', chapter: 'chapter3' });
    p.shared.sceneManager.register('level10', Level1Scene, { level: p.shared.levels.level9, nextScene: 'level11', chapter: 'chapter3' });
    p.shared.sceneManager.register('level11', Level1Scene, { level: p.shared.levels.level10, nextScene: 'endStory', chapter: 'chapter3' });

    p.shared.sceneManager.register('endStory', ArtSceneTwo); // this is the last scene, needs audio

    p.shared.sceneManager.register('jsonInput', JsonInputScene);


    p.shared.sceneManager.continue = true;

    p.shared.sceneManager.change('menu');
    // p.shared.sceneManager.change('level1level');

    // final canvas initialization
    initializeCanvasPostSetup(p);
    document.getElementById('landing_fg').style.opacity = '0';
    p.shared.mainCanvas.class('ready');

    p.shared.audio.enableThemeFilter();
    p.shared.audio.disableThemeFilter();
    p.shared.audio.disableThemeFilter();
    p.shared.audio.disableThemeFilter();
  };

  p.draw = () => {
    // if (p.shared.sceneManager.continue) {
    p.shared.timing.update();
    // }

    for (let i = p.shared.tweens.length - 1; i >= 0; i--) {
      const t = p.shared.tweens[i];
      const now = p.millis();
      const elapsed = now - t.startTime;

      const u = Math.min(elapsed / t.duration, 1);
      const value = p.lerp(t.startValue, t.target, u);

      // apply new value
      const fn = t.obj[t.setter];

      if (typeof fn === 'function') {
        // p5.sound unified setter call
        fn.call(t.obj, value);
      } else {
        // plain numeric assignment
        t.obj[t.setter] = value;
      }

      if (u >= 1) {
        if (t.onFinish) t.onFinish();
        p.shared.tweens.splice(i, 1);
      }
    }


    const { renderer, sceneManager } = p.shared;
    if (!renderer || !sceneManager) return;

    while (p.shared.timing.shouldStep()) {
      sceneManager.update();
    }
    sceneManager.draw(p.shared.timing.getAlpha());
  };

};

new p5(mainSketch);