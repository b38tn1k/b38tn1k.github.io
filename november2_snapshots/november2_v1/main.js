import { createTiming } from './core/timing.js';
import { createRenderer } from './core/renderer.js';
import { registerControls } from './core/controls.js';
import { registerSystemEvents, setupCanvasWithAdaptation, initializeCanvasPostSetup } from './core/system.js';
import { createSceneManager } from './core/sceneManager.js';
import { createGameState } from './core/state.js';
import { Debug } from './core/debug.js';
import { createUI } from './core/ui.js';
import { Settings } from './config/settings.js';
import { parseLevel } from '../core/parseLevel.js';

import { MenuScene } from './scenes/menu.js';
import { Level1Scene } from './scenes/level1.js';
import { GameOverScene } from './scenes/gameover.js';

import { Player } from './entities/player.js';


export const mainSketch = (p) => {
  p.shared = {};

  p.preload = () => {
    // Load any built-in or custom font to satisfy WebGL text
    p.shared.mainFont = p.loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
    p.shared.levels = p.loadJSON('./config/levels.json');
  };

  p.setup = async () => {
    p.shared.Debug = Debug;
    p.shared.settings = Settings
    p.shared.timing = createTiming(p);

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

    // Register scenes
    p.shared.sceneManager.register('menu', MenuScene);
    p.shared.sceneManager.register('level1', Level1Scene);
    p.shared.sceneManager.register('gameover', GameOverScene);    // Start with menu
    p.shared.sceneManager.change('menu');

    // final canvas initialization
    initializeCanvasPostSetup(p);
  };

  p.draw = () => {
    p.shared.timing.update();

    const { renderer, sceneManager } = p.shared;
    if (!renderer || !sceneManager) return;

    while (p.shared.timing.shouldStep()) {
      sceneManager.update();
    }
    sceneManager.draw(p.shared.timing.getAlpha());
  };

};

new p5(mainSketch);