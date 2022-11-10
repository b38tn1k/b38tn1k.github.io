// anything in here better have a good reason to be here
function returnTrue() {
  return true;
}
function bounded(env, x, y) { // envelope = [x1, y1, x2, y2]
  let result = {}
  result.horizontal = (x == constrain(x, env[0], env[2]));
  result.vertical = (y == constrain(y, env[1], env[3]));
  result.onLeft = (x < (env[0] + (env[2] - env[0])/2));
  result.onTop = (y < (env[1] + (env[3] - env[1])/2));
  result.complete = result.vertical && result.horizontal;
  return(result);
}
class Globals {
  constructor(){
    this.gLayers;
    this.dims;
    this.inputs;
    this.colors = []; // alwayyyys
    this.loaders = {};
    this.updated = true; //control FPS when I get there
    this.player;
    this.scroller;
    this.UIElements;
  }
}
