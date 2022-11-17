// anything in here better have a good reason to be here
function returnTrue() {
  return true;
}
function returnFalse() {
  return false;
}
function bounded(env, x, y) { // envelope = [x1, y1, x2, y2]
  if (!env) {
    env = [0, 0, 0, 0];
    console.log('no bbox!');
  }
  let result = {}
  result.horizontal = (x == constrain(x, env[0], env[2]));
  result.vertical = (y == constrain(y, env[1], env[3]));
  result.onLeft = (x < (env[0] + (env[2] - env[0])/2));
  result.onTop = (y < (env[1] + (env[3] - env[1])/2));
  result.complete = result.vertical && result.horizontal;
  return(result);
}
function splitSheet(src, res, row, start, end){
  let sx = start * res;
  let sy = row * res;
  let sw = (end - start) * res;
  let sh = res;
  let img = createImage(sw, sh);
  img.copy(src, sx, sy, sw, sh, 0, 0, sw, sh);
  return img;
}
function rebuildLevel() {
  G.level = null;
  G.level = G.levelSetup[G.levelPointer]();
  G.level.drawStatics();
  G.player.reOrigin();
  G.player.recoverInventory();
}
function showColors() {
  function colorString(levels) {
    return String(levels[0]) + ', ' + String(levels[1]) + ', ' + String(levels[2])
  }
  colorDiv = createDiv();
  colorDiv.position(0, 0);
  colorDiv.style('background-color', '#FFFFFF');
  for (let i = 0; i < G.colors.length; i++) {
    let levels = G.colors[i].levels;
    colorDiv.html('<span style="color:rgb(' + colorString(levels) + ')">' + i + '    ■ </span>' , true);
    // colorDiv.html(i + '    ■ </span>', true);
    if (i % 10 == 0 && i != 0) {
      colorDiv.html('<br><br>', true);
    }
  }
}

function transitionLevel() {
  G.levelPointer += 1;
  G.level.shutDown();
  G.levelPointer = constrain(G.levelPointer, 0, G.levelSetup.length-1);
  G.level = null;
  G.level = G.levelSetup[G.levelPointer]();
  G.level.drawStatics();
  G.player.reOrigin();
  G.player.backupInventory();
  G.player.makeEntry = true;
}

class Globals {
  constructor(){
    this.graphLayers;
    this.dims;
    this.inputs;
    this.colors = []; // alwayyyys
    this.loaders = {};
    this.updated = true; //control FPS when I get there
    this.player;
    this.UIElements;
    this.level;
    this.levelSetup = [];
    this.levelPointer = 0;
    this.triggerRadius = 100;
  }
}
