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

function toggleToPlay() {
  if (G.state == START_BANNER) {
    G.state = PLAY_GAME;
  }
}
function mousePressed() {
  toggleToPlay();
  let currentActive = -1;
  if (keyIsDown(SHIFT) == false) {
    for (let i = 0; i < G.level.npcs.length; i++) {
      if (G.level.npcs[i].clickable == true) {
        let clickOn = bounded(G.level.npcs[i].bbox, mouseX, mouseY);
        if (clickOn.complete == true) {
          G.level.npcs[i].active = !G.level.npcs[i].active;
          currentActive = i;
          break;
        }
      }
    }
    for (let i = 0; i < G.level.npcs.length; i++) {
      if (G.level.npcs[i].clickable == true) {
        if (i != currentActive) {
          G.level.npcs[i].active = false;
        }
      }
    }
  } else {
    for (let i = 0; i < G.level.npcs.length; i++) {
      if (G.level.npcs[i].clickable == true) {
        let clickOn = bounded(G.level.npcs[i].bbox, mouseX, mouseY);
        if (clickOn.complete == true) {
          currentActive = G.level.npcs.length;
          let spr = addSingleSprite(G.level, G.level.npcTags[i], mouseX/width, mouseY/height);
          spr.active = true;
          break;
        }
      }
    }
    for (let i = 0; i < G.level.npcs.length; i++) {
      if (G.level.npcs[i].clickable == true) {
        if (i != currentActive) {
          G.level.npcs[i].active = false;
        }
      }
    }
  }

}

function keyPressed() {
  toggleToPlay();
  if (key == 'p') {
    saveImage();
  }
  if (key == 'r') {
    backupLayout()
  }
}

function backupLayout() {
  for (let i = 0; i < G.level.npcs.length; i++) {
    console.log(G.level.npcTags[i], G.level.npcs[i].x, G.level.npcs[i].y);
  }
  for (let i = 0; i < G.level.npcs.length; i++) {
    let myString = "spr = addSingleSprite(level, '";
    myString += G.level.npcTags[i];
    myString += "' , 0.4, 0.5);";
    myString += "spr.current.tx = ";
    myString += String(int(G.level.npcs[i].x));
    myString += ";";
    myString += "spr.current.ty = ";
    myString += String(int(G.level.npcs[i].y));
    myString += ";";
    console.log(myString);
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
  G.graphLayers.clear();
  // shader(G.shader);
  fill(255);
  noStroke();
}

function setupGame() {
  G.dims = new Dimensions();
  G.player = new PlayerCharacter(); // resolution, column, start, end
  G.loaders['player-noboots-down'] = splitSheet(G.loaders['humanoid2'], 64, 0, 0, 4);
  G.loaders['player-noboots-up'] = splitSheet(G.loaders['humanoid2'], 64, 1, 0, 4);
  G.loaders['player-boots-down'] = splitSheet(G.loaders['humanoid2'], 64, 2, 0, 4);
  G.loaders['player-boots-up'] = splitSheet(G.loaders['humanoid2'], 64, 3, 0, 4);
  G.loaders['player-noboots-left'] = splitSheet(G.loaders['humanoid2'], 64, 4, 0, 4);
  G.loaders['player-noboots-right'] = splitSheet(G.loaders['humanoid2'], 64, 5, 0, 4);
  G.loaders['player-boots-left'] = splitSheet(G.loaders['humanoid2'], 64, 6, 0, 4);
  G.loaders['player-boots-right'] = splitSheet(G.loaders['humanoid2'], 64, 7, 0, 4);
  G.loaders['player-stuck'] = splitSheet(G.loaders['humanoid2'], 64, 8, 0, 4);
  G.loaders['computer'] = splitSheet(G.loaders['computer'], 96, 0, 0, 1);
  G.loaders['worker'] = splitSheet(G.loaders['worker'], 60, 0, 0, 1);
  G.player.addAnimation(8, G.loaders['player-noboots-up'], 'up', [0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-noboots-down'], 'down',[0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-noboots-left'], 'left',[0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-noboots-right'], 'right',[0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-boots-up'], 'up', [0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-boots-down'], 'down',[0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-boots-left'], 'left',[0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-boots-right'], 'right',[0, 4], 0);
  G.player.addAnimation(8, G.loaders['player-stuck'], 'stuck');
  G.player.setCollectionRate(0.8);
  G.player.emptyInventory();
  G.player.backupInventory();
  // LEVEL SETUP
  G.levelSetup.push(factory); // starving man
  G.level = G.levelSetup[G.levelPointer]();
  G.level.drawStatics();
}

function preload() {
  G = new Globals();
  let c = loadStrings('assets/NES.hex', function(){for (let i = 0; i < c.length; i++) {G.colors.push(color('#' + c[i]));};});
  // sprites
  G.loaders['humanoid2'] = loadImage('assets/humanoid2red.png');
  G.loaders['computer'] = loadImage('assets/megaComputer.png');
  G.loaders['vogui'] = loadImage('assets/robotnikvogui.png');
  G.loaders['URarm'] = loadImage('assets/UR-generic.png');
  G.loaders['mobileManipulator'] = loadImage('assets/mobileManipulator.png');
  G.loaders['table'] = loadImage('assets/table.png');
  G.loaders['worker'] = loadImage('assets/worker.png');
  // fonts and logos
  G.loaders['font'] = loadFont('assets/Lato-Regular.ttf');
  // maps
  G.loaders['lab'] = loadImage('assets/lab.png');
}

function setup() {
  createCanvas(0, 0);
  setupScreen();
  setupGame();
  imageMode(CENTER);
  rectMode(CENTER);
  pixelDensity(1);
  frameRate(30);
  document.getElementById('logoSplash').remove();
}

function draw() {
  G.graphLayers.clear();
  G.inputs.update();
  G.player.update(G.level, G.inputs);
  G.level.update(G.player, G.inputs);
  G.level.draw();
  G.player.draw();
  G.graphLayers.draw();
}
