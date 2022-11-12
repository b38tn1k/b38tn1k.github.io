var G;
var loaders = {};

function deviceTurned() {
  setupScreen();
  // dummyLayout();
  G.player.refreshLayout();
  G.levels[G.levelPointer].refreshLayout();
}

function windowResized() {
  setupScreen();
  // dummyLayout();
  G.player.refreshLayout();
  G.levels[G.levelPointer].refreshLayout();
}

function keyPressed() {
  if (key == 's') {
    saveImage();
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
  G.inputs = new InputHandler(G.dims);
  G.UIElements = new UIElements();
  G.graphLayers.clear();
}

function setupGame() {
  G.dims = new Dimensions();
  G.player = new PlayerCharacter(); // resolution, column, start, end
  G.player.addAnimation(7, splitSheet(G.loaders['player-boots'], 64, 8, 1, 8), 'up', [0, 4], 0);
  G.player.addAnimation(8, splitSheet(G.loaders['player-boots'], 64, 9, 0, 8), 'left',[0, 4], 0);
  G.player.addAnimation(7, splitSheet(G.loaders['player-boots'], 64, 10, 1, 8), 'down',[0, 4], 0);
  G.player.addAnimation(8, splitSheet(G.loaders['player-boots'], 64, 11, 0, 8), 'right',[0, 4], 0);
  G.player.setCollectionRate(0.4);
  G.player.addInventoryItem('food', 3);
  G.player.addInventoryItem('boots');
  G.player.addInventoryItem('toys');
  level0();
}

function preload() {
  G = new Globals();
  let c = loadStrings('assets/NES.hex', function(){for (let i = 0; i < c.length; i++) {G.colors.push(color('#' + c[i]));};});
  G.loaders['player-boots'] = loadImage('assets/boots.png');
  G.loaders['player-no-boots'] = loadImage('assets/noboots.png');
  G.loaders['slume-idle'] = loadImage('assets/BlueSlumeIdle.png');
  G.loaders['slume-death'] = loadImage('assets/BlueSlumeDeath.png');
  G.loaders['slume-death'] = loadImage('assets/BlueSlumeDeath.png');
  G.loaders['compass'] = loadImage('assets/compass.png');
  G.loaders['agulha'] = loadImage('assets/agulha.png');
  G.loaders['windrose'] = loadImage('assets/windrose.png');
  G.loaders['unk'] = loadImage('assets/mysteryTexture.png');
  G.loaders['font'] = loadFont('assets/Lato-Regular.ttf');
  G.loaders['grass'] = loadImage('assets/grass.png');
  G.loaders['path'] = loadImage('assets/path.png');
  G.loaders['food'] = loadImage('assets/carrot.png');
  G.loaders['controlOrigin'] = loadImage('assets/controlOrigin.png');
}

function setup() {
  createCanvas(0, 0, P2D);
  setupScreen();
  setupGame();
  imageMode(CENTER);
  rectMode(CENTER);
  pixelDensity(1);
  frameRate(30);
  // dummyLayout();
}

function draw() {
  G.graphLayers.clear();
  G.inputs.update();
  G.UIElements.update(G.player, G.inputs);
  G.player.update(G.levels[G.levelPointer], G.inputs);
  G.levels[G.levelPointer].update(G.player, G.inputs);
  G.player.draw();
  G.levels[G.levelPointer].draw();
  G.graphLayers.draw();
  G.UIElements.draw();
}
