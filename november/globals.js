// anything in here better have a good reason to be here
function returnTrue() {
  return true;
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
