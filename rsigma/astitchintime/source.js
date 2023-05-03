
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

function drawMonitor(xCenter, yCenter, w, h) {
  // calculate some dimensions
  const monitorPadding = w * 0.05;
  const screenPadding = w * 0.1;
  const screenBorder = w * 0.02;
  const screenWidth = w - screenPadding * 2;
  const screenHeight = h - screenPadding * 2;
  
  // draw the monitor body
  fill(50);
  stroke(0);
  strokeWeight(2);
  rectMode(CENTER);
  rect(xCenter, yCenter, w, h);
  
  // draw the monitor screen
  fill('red');
  noStroke();
  rect(xCenter, yCenter, screenWidth, screenHeight);
  
  // draw the screen border
  stroke(255, 0, 0);
  strokeWeight(screenBorder);
  noFill();
  rect(xCenter, yCenter, screenWidth, screenHeight);
  
  // draw the monitor stand
  fill(50);
  stroke(0);
  strokeWeight(2);
  rect(xCenter, yCenter + h/2 + h/8, w/3, h/4);
  rect(xCenter, yCenter + h/2 + h/16, w/3, h/8);
  rectMode(CORNER);
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
  clear();
  drawLightbulb(width - 3.5 * boxSize, 9 * boxSize, boxSize, boxSize, lightOn);
  drawCamera(width - 3.5 * boxSize, 5 * boxSize, 2*boxSize, 2*boxSize);
  drawLightbulb(width - 3.5 * boxSize, 3 * boxSize, width*0.05, width*0.05, lightOn);

  drawLightbulb(3.5 * boxSize, 9 * boxSize, boxSize, boxSize, !lightOn);
  drawCamera(3.5 * boxSize, 5 * boxSize, -2*boxSize, 2*boxSize);
  drawLightbulb(3.5 * boxSize, 3 * boxSize, boxSize, boxSize, !lightOn);

  let x1 = 5*boxSize;
  let y1 = 5.5 * boxSize;
  let x2 = width - 5 * boxSize;
  let y2 = 5.5 * boxSize;

  let xe1 = width*0.5;
  let ye1 = height*0.75;
  let xe2 = width*0.5;
  let ye2 = height*0.75;

  noFill();

  // first line
  beginShape();
  vertex(x1, y1);
  curveVertex(x1, y1);
  curveVertex(x1, (y1 + ye1) / 2);
  curveVertex(xe1, (y1 + ye1) / 2);
  curveVertex(xe1, ye1);
  vertex(xe1, ye1);
  endShape();

  // second line
  beginShape();
  vertex(x2, y2);
  curveVertex(x2, y2);
  curveVertex(x2, (y2 + ye2) / 2);
  curveVertex(xe2, (y2 + ye2) / 2);
  curveVertex(xe2, ye2);
  vertex(xe2, ye2);
  endShape();
  
  x1 -= boxSize;
  fill(lightOn ? "black" : "red");
  rect(x1, y1, boxSize, boxSize);

  fill(lightOn ? "red" : "black");
  rect(x2, y2, boxSize, boxSize);

  drawMonitor(xe2, ye2, width * 0.15, width * 0.15);


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




{/* <iframe class='embeddedblocks' style="width:100%; zoom:1.0; height:1000px; overflow: hidden;"  scrolling="no" src="https://b38tn1k.com/rsigma/astitchintime/"></iframe> */}