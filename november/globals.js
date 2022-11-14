// anything in here better have a good reason to be here
function returnTrue() {
  return true;
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
function splitSheet(src, res, col, start, end){
  let sx = start * res;
  let sy = col * res;
  let sw = (end - start) * res;
  let sh = res;
  let img = createImage(sw, sh);
  img.copy(src, sx, sy, sw, sh, 0, 0, sw, sh);
  return img;
}

function transitionLevel() {
  G.levelPointer += 1;
  let old = G.levelPointer;
  G.levelPointer = constrain(G.levelPointer, 0, G.levels.length-1);
  G.levels[G.levelPointer].drawStatics();
  G.player.reOrigin();
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
    this.levels = [];
    this.levelPointer = 0;
    this.triggerRadius = 100;
  }
}
