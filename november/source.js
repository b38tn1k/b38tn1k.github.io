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
  if (isTouchDevice() === true){
    gGraphics['base'] = createGraphics(max(windowWidth, windowHeight), min(windowWidth, windowHeight));
    gGraphics['base-transform'] = windowWidth > windowHeight ? radians(90) : 0;
  } else {
    gGraphics['base'] = createGraphics(windowWidth, windowHeight);
    gGraphics['base-transform'] = 0;
  }
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
}

function draw() {
  if (isTouchDevice() === true){
    bigCText('MOBILE TOUCH DEVICE', 64, gGraphics['base']);
  } else {
    bigCText('NOT MOBILE', 64, gGraphics['base']);
  }

  // draw graphic layers
  push();
  rotate(gGraphics['base-transform']);
  image(gGraphics['base'], 0, 0);
  pop();
}
