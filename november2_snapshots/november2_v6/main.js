import { createTiming } from './core/timing.js';
import { createRenderer } from './core/renderer.js';
import { registerControls } from './core/controls.js';
import { registerSystemEvents, setupCanvasWithAdaptation, initializeCanvasPostSetup } from './core/system.js';
import { createSceneManager } from './core/sceneManager.js';
import { createGameState } from './core/state.js';
import { Debug } from './core/debug.js';
import { createUI } from './core/ui.js';
import { Settings } from './config/settings.js';
import { parseLevel } from './core/parseLevel.js';
import {applyChromaMapWithDisable} from './core/utils.js';

import { MenuScene } from './scenes/menu.js';
import { ArtSceneOne } from './scenes/story1.js';
import { ChapterScene } from './scenes/chapter.js';
import { Level1Scene } from './scenes/level1.js';
import { GameOverScene } from './scenes/gameover.js';

import { Player } from './entities/player.js';


export const mainSketch = (p) => {
  p.shared = {};
  p.shared.assets = {};

  p.preload = () => {
    // p.shared.mainFont = p.loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
    p.shared.mainFont = p.loadFont('./assets/found/Patrick_Hand/PatrickHand-Regular.ttf');
    // p.shared.mainFont = p.loadFont('./assets/found/Comic_Neue/ComicNeue-Regular.ttf');
    p.shared.levels = p.loadJSON('./config/levels.json');
    p.shared.chroma = p.loadJSON('./config/chroma.json');
    p.shared.assets['storyAssets'] = {};
    p.shared.assets.storyAssets['bg1'] = p.loadImage('./assets/created/raw/story_bg_1.png');
    p.shared.assets.storyAssets['bg2'] = p.loadImage('./assets/created/raw/story_bg_2.png');
    p.shared.assets.storyAssets['bg3'] = p.loadImage('./assets/created/raw/story_bg_3.png');
    p.shared.assets.storyAssets['ssP1'] = p.loadImage('./assets/created/raw/pink_sprite_sheet_scaled.png');
    p.shared.assets.storyAssets['ssY1'] = p.loadImage('./assets/created/raw/yellow_sprite_sheet_scaled.png');

    // p.shared.assets.logo = p.loadImage('./assets/created/logo1.png');
  };

  p.setup = async () => {
    p.shared.Debug = Debug;
    p.shared.settings = Settings
    p.shared.timing = createTiming(p);

    applyChromaMapWithDisable(p, p.shared.chroma);
    // let colorCount = Object.keys(p.shared.chroma).length
    // let colorAngle = 255 / colorCount;
    // p.colorMode(p.HSL, 255);
    // let hue = 0;
    // let saturation = 255;
    // let level = 128;
    // for (let k in p.shared.chroma) {
    //   p.shared.chroma[k] = p.color(hue, saturation, level);
    //   hue += colorAngle;
    // }
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
``
    // Register scenes
    // this.p.shared.levels.level2;
    p.shared.sceneManager.register('menu', MenuScene);
    p.shared.sceneManager.register('story1', ArtSceneOne);
    p.shared.sceneManager.register('chapter1', ChapterScene, {levels: [1, 2, 3]});
    p.shared.sceneManager.register('chapter2', ChapterScene, {levels: [4, 5]});
    p.shared.sceneManager.register('chapter3', ChapterScene, {levels: [6, 7]});
    p.shared.sceneManager.register('chapter4', ChapterScene, {levels: [8, 9]});

    p.shared.sceneManager.register('level1', Level1Scene, { level: p.shared.levels.level1, nextScene: 'level2', chapter: 'chapter1' });
    p.shared.sceneManager.register('level2', Level1Scene, { level: p.shared.levels.level2, nextScene: 'level3', chapter: 'chapter1' });
    p.shared.sceneManager.register('level3', Level1Scene, { level: p.shared.levels.level3, nextScene: 'level4', chapter: 'chapter1' });
    p.shared.sceneManager.register('level4', Level1Scene, { level: p.shared.levels.testLevel, nextScene: 'menu', chapter: 'chapter2' });
    p.shared.sceneManager.continue = true;

    // p.shared.sceneManager.register('gameover', GameOverScene);    // Start with menu
    p.shared.sceneManager.change('menu');

    // final canvas initialization
    initializeCanvasPostSetup(p);
  };       

  p.draw = () => {
    // if (p.shared.sceneManager.continue) {
      p.shared.timing.update();
    // }
    

    const { renderer, sceneManager } = p.shared;
    if (!renderer || !sceneManager) return;

    while (p.shared.timing.shouldStep()) {
      sceneManager.update();
    }
    sceneManager.draw(p.shared.timing.getAlpha());
  };

};

new p5(mainSketch);