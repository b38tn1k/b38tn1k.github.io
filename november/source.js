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
    gGraphics['base'] = createGraphics(max(width, height), min(width, height));
    gGraphics['base-rotate'] = (width < height ? radians(90) : 0);
    console.log(width, height, gGraphics['base'].width, gGraphics['base'].height)
    gGraphics['base-translate'] = (width < height ? [height/2, (-width)/2] : [width/2, height/2]);
  } else {
    gGraphics['base'] = createGraphics(width, height);
    gGraphics['base-rotate'] = 0;//radians(90);
    gGraphics['base-translate'] = [width/2, height/2];
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
  imageMode(CENTER);
  pixelDensity(1);
}

function draw() {
  if (gUpdated == true) {
    clear();
    drawTestPattern(gGraphics['base']);
  }
  if (isTouchDevice() === true){
    bigCText('MOBILE-ISH', 64, gGraphics['base']);
  } else {
    bigCText('NOT MOBILE', 64, gGraphics['base']);
  }

  // draw graphic layers
  push();
  rotate(gGraphics['base-rotate']);
  translate(gGraphics['base-translate'][0], gGraphics['base-translate'][1]);
  image(gGraphics['base'], 0, 0);
  pop();
}
