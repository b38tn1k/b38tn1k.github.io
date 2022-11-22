var G;
var loaders = {};

function deviceTurned() {
  setupScreen();
  rebuildLevel();
}

function windowResized() {
  setupScreen();
  rebuildLevel();
}

function keyPressed() {
  if (key == 'p') {
    saveImage();
  }
  if (key == 'f') {
    G.player.addItem('food');
  }
  if (key == 'b') {
    G.player.addItem('boot');
  }
  if (key == 'n') {
    G.player.subtractItem('boot');
  }
}

function saveImage() {
  var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  save(timestamp+".png");
}

function setupScreen() {
  resizeCanvas(windowWidth, windowHeight);
  G.updated = true;
  G.dims = new Dimensions();
  G.graphLayers = new LayerHandler(G.dims);
  G.graphLayers.setupLayers();
  G.inputs = new InputHandler(G.dims);
  G.UIElements = new UIElements();
  G.graphLayers.clear();
  shader(G.shader);
  fill(255);
  noStroke();
}

function setupGame() {
  G.dims = new Dimensions();
  G.player = new PlayerCharacter(); // resolution, column, start, end
  // G.player.addAnimation(7, splitSheet(G.loaders['player-boots'], 64, 8, 1, 8), 'up', [0, 4], 0);
  // G.player.addAnimation(7, splitSheet(G.loaders['player-boots'], 64, 10, 1, 8), 'down',[0, 4], 0);
  // G.player.addAnimation(8, splitSheet(G.loaders['player-boots'], 64, 9, 0, 8), 'left',[0, 4], 0);
  // G.player.addAnimation(8, splitSheet(G.loaders['player-boots'], 64, 11, 0, 8), 'right',[0, 4], 0);
  G.loaders['player-noboots-down'] = splitSheet(G.loaders['humanoid2'], 64, 0, 0, 4);
  G.loaders['player-noboots-up'] = splitSheet(G.loaders['humanoid2'], 64, 1, 0, 4);
  G.loaders['player-boots-down'] = splitSheet(G.loaders['humanoid2'], 64, 2, 0, 4);
  G.loaders['player-boots-up'] = splitSheet(G.loaders['humanoid2'], 64, 3, 0, 4);
  G.loaders['player-noboots-left'] = splitSheet(G.loaders['humanoid2'], 64, 4, 0, 4);
  G.loaders['player-noboots-right'] = splitSheet(G.loaders['humanoid2'], 64, 5, 0, 4);
  G.loaders['player-boots-left'] = splitSheet(G.loaders['humanoid2'], 64, 6, 0, 4);
  G.loaders['player-boots-right'] = splitSheet(G.loaders['humanoid2'], 64, 7, 0, 4);

  G.player.addAnimation(8, G.loaders['player-noboots-up'], 'up', [0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-noboots-down'], 'down',[0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-noboots-left'], 'left',[0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-noboots-right'], 'right',[0, 4], 0);

  G.player.addAnimation(8, G.loaders['player-boots-up'], 'up', [0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-boots-down'], 'down',[0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-boots-left'], 'left',[0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-boots-right'], 'right',[0, 4], 0);

  G.player.companion.addAnimation(8, splitSheet(G.loaders['possum'], 48, 0, 0, 8), 'left');
  G.player.companion.addAnimation(8, splitSheet(G.loaders['possum'], 48, 1, 0, 8), 'right');
  G.player.companion.addAnimation(8, splitSheet(G.loaders['possum'], 48, 2, 0, 8), 'up');
  G.player.companion.addAnimation(8, splitSheet(G.loaders['possum'], 48, 3, 0, 8), 'down');
  G.player.companion.addAnimation(8, splitSheet(G.loaders['possum'], 48, 4, 0, 8), 'idle');
  G.player.companion.setCollectionRate(0.4);
  G.player.companion.goal = 'food';
  G.player.companion.update();
  G.player.companion.play();
  G.player.setCollectionRate(0.8);
  G.player.addItem('food', 1);
  G.player.addItem('boot', 0);
  G.player.addItem('toy', 1);
  G.player.addItem('bead', 0);
  G.player.emptyInventory();
  G.player.backupInventory();
  // LEVEL SETUP
  G.levelSetup.push(level0);
  G.levelSetup.push(level1);
  G.levelSetup.push(level2);
  G.levelSetup.push(level3);
  G.levelSetup.push(level4);
  G.levelSetup.push(level5);
  G.levelSetup.push(level6);
  G.levelSetup.push(level7);

  G.levelSetup.push(finalLevel);
  G.levelSetup.push(testLevel);
  G.level = G.levelSetup[G.levelPointer]();
  G.level.drawStatics();
}

function preload() {
  G = new Globals();
  let c = loadStrings('assets/NES.hex', function(){for (let i = 0; i < c.length; i++) {G.colors.push(color('#' + c[i]));};});
  G.shader = loadShader('shader.vert', 'shader.frag');
  // sprites
  G.loaders['player-boots'] = loadImage('assets/boots.png');
  G.loaders['humanoid2'] = loadImage('assets/humanoid2.png');
  G.loaders['humanoid1'] = loadImage('assets/humanoid1.png');
  G.loaders['slumeY'] = loadImage('assets/slume_yellow_idle.png');
  G.loaders['slume-idle'] = loadImage('assets/BlueSlumeIdlef.png');
  G.loaders['slume-death'] = loadImage('assets/BlueSlumeDeath.png');
  G.loaders['slume-death'] = loadImage('assets/BlueSlumeDeath.png');
  G.loaders['spider'] = loadImage('assets/spider.png');
  G.loaders['rat'] = loadImage('assets/ratf.png');
  G.loaders['possum'] = loadImage('assets/possum.png');
  // UI
  G.loaders['compass'] = loadImage('assets/compass.png');
  G.loaders['unk'] = loadImage('assets/mysteryTexture.png');
  G.loaders['food'] = loadImage('assets/carrot.png');
  G.loaders['toy'] = loadImage('assets/toy.png');
  G.loaders['boot'] = loadImage('assets/boot.png');
  G.loaders['bead'] = loadImage('assets/bead.png');
  // pickups
  G.loaders['chest'] = loadImage('assets/chest.png');
  // font
  G.loaders['font'] = loadFont('assets/Lato-Regular.ttf');
  // maps
  G.loaders['grass'] = loadImage('assets/grasslands.png');
  G.loaders['desert'] = loadImage('assets/desert.png');
  G.loaders['snow'] = loadImage('assets/snow.png');
  G.loaders['temple'] = loadImage('assets/temple.png');
}

function setup() {
  createCanvas(0, 0, WEBGL);
  perspective(PI / 3.0, width / height, 0.1, 500);
  setupScreen();
  setupGame();
  imageMode(CENTER);
  rectMode(CENTER);
  pixelDensity(1);
  frameRate(30);
}

function draw() {
  // console.log(G.graphLayers.getLayerNames());
  G.graphLayers.clear();
  G.inputs.update();
  G.UIElements.update(G.player, G.inputs);
  G.player.update(G.level, G.inputs);
  G.level.update(G.player, G.inputs);
  G.level.draw();
  G.player.draw();
  G.graphLayers.draw();
  G.UIElements.draw();
  if (G.transitionFlag == true) {
    G.transitionFlag = false;
    transitionLevel();
  }
  //splitSheet(src, res, row, start, end)
  // G.UIElements.layer.g.image(splitSheet(G.loaders['humanoid2'], 64, 0, 0, 4), width/2, height/2);
  // image(splitSheet(G.loaders['grass'], 64, 5, 0, 3), 200, 200);
}
