
var widthOnTwo, heightOnTwo;

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
  console.log(mouseX, mouseY)

}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
}


function drawCamera(x, y, w, h) {
  // calculate some dimensions
  const bodyWidth = w * 0.7;
  const bodyHeight = h;
  const lensRadius = w * 0.2;
  const viewfinderWidth = w * 0.3;
  const viewfinderHeight = h * 0.5;
  const viewfinderOffset = w * 0.05;
  
  // draw the camera body
  fill(50);
  stroke(0);
  strokeWeight(2);
  rect(x, y, bodyWidth, bodyHeight);
  
  // draw the lens
  fill(150);
  ellipse(x + bodyWidth + lensRadius/2, y + bodyHeight/2, lensRadius, lensRadius);
  
  // draw the viewfinder
  fill(255);
  rect(x + bodyWidth + viewfinderOffset, y + bodyHeight/2 - viewfinderHeight/2, viewfinderWidth, viewfinderHeight);
  fill(0);
  textSize(16);
  
  // draw the film winder and shutter button
  fill(200);
  ellipse(x + bodyWidth/2, y - h/4, w/5, w/5);
  ellipse(x + bodyWidth/2, y + h + h/4, w/5, w/5);
}

function drawLightbulb(x, y, w, h, on=true) {
  // calculate some dimensions
  const bulbWidth = w * 0.8;
  const bulbHeight = h * 0.8;
  const filamentWidth = w * 0.1;
  const filamentHeight = h * 0.3;
  const baseWidth = w * 0.4;
  const baseHeight = h * 0.2;

  // set the fill color to yellow if on, otherwise gray
  if (on) {
    fill(255, 255, 0);
  } else {
    fill(128);
  }

  // draw the bulb shape
  ellipse(x, y, bulbWidth, bulbHeight);

  // set the fill color to dark gray
  fill(64);

  // draw the filament if the bulb is on
  if (on) {
    rect(x - filamentWidth / 2, y - filamentHeight / 2, filamentWidth, filamentHeight);
  }

  // draw the base
  rect(x - baseWidth / 2, y + bulbHeight / 2, baseWidth, baseHeight);
}

let boxSize;
let scrollSpeed;
let currentY;
let lightOn = false;
let boxes = [];
let FPS = 15;

function setup() {
  setupScreen();
  frameRate(FPS);
  setInterval(toggleLight, 1000);
  boxSize = height * 0.05;
  currentY = boxSize;
  scrollSpeed = boxSize / FPS;
  currentY = boxSize;
  for (let i = 0; i < height/boxSize + 1; i++) {
    boxes.push((i % 2 == 0) ? "black" : "red");
  }
  
}

function toggleLight() {
  lightOn = !lightOn; // toggle the lightOn variable between true and false
}


function draw() {
  drawLightbulb(width*0.8, height*0.15, width*0.05, width*0.05, lightOn);
  drawCamera(width*0.7, height*0.25, width*0.15, width*0.1);
  drawLightbulb(width*0.8, height*0.25 + width*0.1 + height * 0.1, width*0.05, width*0.05, lightOn);

  drawLightbulb(width*0.2, height*0.25 + width*0.1 + height * 0.1, width*0.05, width*0.05, !lightOn);
  drawCamera(width*0.3, height*0.25, -width*0.15, width*0.1)
  drawLightbulb(width*0.2, height*0.15, width*0.05, width*0.05, !lightOn);

  fill(lightOn ? "black" : "red");
  rect(width*0.3, height*0.25 + width*0.05 - boxSize/2, boxSize, boxSize);

  fill(lightOn ? "red" : "black");
  rect(width*0.7-boxSize, height*0.25 + width*0.05 - boxSize/2, boxSize, boxSize);


  // loop through and draw the boxes
  for (let i = 0; i < boxes.length; i++) {
    fill(boxes[i]);
    rect(0, i * boxSize - currentY, boxSize, boxSize);
    fill(boxes[i] == "black" ? "red" : "black");
    rect(width-boxSize, i * boxSize - currentY, boxSize, boxSize);
  }

  // update the scroll position
  currentY += scrollSpeed;

  if (currentY >= boxSize) {
    boxes.shift();
    boxes.push((boxes[boxes.length - 1] == "black") ? "red" : "black");
    currentY -= boxSize;
  }

}
