// anything in here better have a good reason to be here
function returnTrue() {
  return true;
}
function bounded(env, x, y) {
  let result = {}
  // console.log(env); // x, y, x2, y2;
  result.horizontal = (x == constrain(x, env[0], env[2]));
  result.vertical = (y == constrain(y, env[1], env[3]));
  result.complete = result.vertical && result.horizontal;
  let midX = env[0] + (env[2] - env[0])/2;
  let midY = env[1] + (env[3] - env[1])/2;
  result.onLeft = (x < midX);
  result.onTop = (y < midY);
  // console.log(result);
  return(result);
}
class Globals {
  constructor(){
    this.gLayers;
    this.dims;
    this.inputs;
    this.debugTools;
    this.colors = []; // alwayyyys
    this.loaders = {};
    this.updated = true; //control FPS when I get there
  }
}
