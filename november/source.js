function keyPressed() {
  if (key == ' ') {
    console.log('bang');
  }
  if (keyCode == DOWN_ARROW){

  return;
  }  else if (keyCode == LEFT_ARROW){

  return;
  }  else if (keyCode == UP_ARROW){

  return;
  }  else if (keyCode == RIGHT_ARROW){

  return;
  }
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {

}

function setupScreen() {
  resizeCanvas(windowWidth, windowHeight);
  checkIsTouchDevice();
  if (isTouchDevice === true){
    gGraphics['base'] = {}
    gGraphics['base']['g'] = createGraphics(max(width, height), min(width, height));
    gGraphics['base']['rot'] = (width < height ? radians(90) : 0);
    gGraphics['base']['trans'] = (width < height ? [height/2, (-width)/2] : [width/2, height/2]);
  } else {
    gGraphics['base'] = {};
    gGraphics['base']['g'] = createGraphics(width, height);
    gGraphics['base']['rot'] = 0;//radians(90);
    gGraphics['base']['trans'] = [width/2, height/2];
  }
  visualUserAgentCheck();
}

function preload() {
  // let c = loadStrings('NES.hex', function(){unpackColors(c);});
  let c = loadStrings('NES.hex', function(){for (let i = 0; i < c.length; i++) {gColors.push(color('#' + c[i]));};});
}

function unpackColors(c) {
  for (let i = 0; i < c.length; i++) {
    gColors.push(color('#' + c[i]));
  }
}

function setup() {
  gGraphics['canvas'] = createCanvas(0, 0, P2D);
  setupScreen();
  imageMode(CENTER);
  pixelDensity(1);
}

function draw() {
  if (gUpdated == true) {
    clear();
  }
  // update updateables
  for (let key in updateAbles) {
    updateAbles[key].update();
  }

  // draw graphic layers to base
  for (let key in updateAbles) {
    if ('drawable' in updateAbles[key]) {
      gGraphics['base']['g'].image(updateAbles[key].g, 0, 0);
    }
  }

  // draw base layer
  push();
  rotate(gGraphics['base']['rot']);
  translate(gGraphics['base']['trans'][0], gGraphics['base']['trans'][1]);
  image(gGraphics['base']['g'], 0, 0);
  pop();
}
