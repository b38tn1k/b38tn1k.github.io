
var widthOnTwo, heightOnTwo;

function keyPressed() {
  if (key == ' ') {
    console.log('bang');
  }
  if (keyCode == DOWN_ARROW) {

    return;
  } else if (keyCode == LEFT_ARROW) {

    return;
  } else if (keyCode == UP_ARROW) {

    return;
  } else if (keyCode == RIGHT_ARROW) {

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
  head1.x = 0.3 * width
  head1.start = 0.3 * width
  head1.y = 0.25 * height

  head2.x = 0.3 * width
  head2.start = 0.3 * width
  head2.y = 0.5 * height

  head3.x = 0.3 * width
  head3.start = 0.3 * width
  head3.y = 0.75 * height

  head1.v = camSpeed;

  head2.forward = 0.8 * camSpeed;
  head2.backward = -2 * camSpeed;
  head2.v = head2.forward;

  head3.v = camSpeed;
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
  ellipse(x + bodyWidth + lensRadius / 2, y + bodyHeight / 2, lensRadius, lensRadius);

  // draw the viewfinder
  fill(255);
  rect(x + bodyWidth + viewfinderOffset, y + bodyHeight / 2 - viewfinderHeight / 2, viewfinderWidth, viewfinderHeight);
  fill(0);
  textSize(16);

  // draw the film winder and shutter button
  fill(200);
  ellipse(x + bodyWidth / 2, y - h / 4, w / 5, w / 5);
  ellipse(x + bodyWidth / 2, y + h + h / 4, w / 5, w / 5);
}

function drawLightbulb(x, y, w, h, on = true) {
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

function drawMonitor(xCenter, yCenter, w, h, screen_fill = 'red') {
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
  fill(screen_fill);
  noStroke();
  rect(xCenter, yCenter, screenWidth, screenHeight);

  // draw the screen border
  stroke(screen_fill);
  strokeWeight(screenBorder);
  noFill();
  rect(xCenter, yCenter, screenWidth, screenHeight);

  // draw the monitor stand
  fill(50);
  stroke(0);
  strokeWeight(2);
  rect(xCenter, yCenter + h / 2 + h / 8, w / 3, h / 4);
  rect(xCenter, yCenter + h / 2 + h / 16, w / 3, h / 8);
  rectMode(CORNER);
}


let boxSize;
let scrollSpeed;
let currentY;
let lightOn = false;
let boxes = [];
let FPS = 15;
let head1 = {};
let head2 = {};
let head3 = {};
let camSpeed = 10;

function setup() {

  frameRate(FPS);
  setInterval(toggleLight, 1000);
  setupScreen();
  textSize(18);
  textAlign(CENTER, CENTER);
}

function toggleLight() {
  lightOn = !lightOn; // toggle the lightOn variable between true and false
}

function drawSpar(x_start, x_end, y_pos, height) {
  rectMode(CORNER);
  const centerX = (x_end - x_start) / 2;

  // Draw the spar
  fill("darkgrey")
  const sparWidth = x_end - x_start;
  rect(x_start, y_pos - height/2, sparWidth, height);
  fill("grey")
  height = height * 0.8;
  rect(x_start, y_pos - height/2, sparWidth, height);
}

function drawHead(x, y, w, h) {
  rectMode(CENTER);
  fill("darkgrey")
  rect(x, y, w, h);
  
  let camera_y_space = 0.8 * h;
  let camera_height = h / 6;
  let camera_width = camera_height/3;
  let camera_x = x + w/2;
  for (let cy = (-camera_y_space/2); cy < camera_y_space/2; cy += camera_y_space/3){
    fill("black")
    rect(camera_x, y + cy, camera_width, camera_height);
    fill("cyan")
    rect(camera_x + camera_width/2, y + cy, camera_width, 0.6*camera_height);
  }
  rectMode(CORNER);
}

function draw() {
  clear();
  let monitorX = min(height, width) * 0.1;
  let monitorDims = min(height, width) * 0.15;
  for (let i = 0.25; i < 1.0; i += 0.25) {
    drawMonitor(monitorX, i * height, monitorDims, monitorDims, "grey");
    drawSpar(0.2 * width, 0.95 * width, i * height, monitorDims);
  }

  drawHead(head1.x, head1.y, monitorDims, 0.6 * monitorDims);
  drawHead(head2.x, head2.y, monitorDims, 0.6 * monitorDims);
  drawHead(head3.x, head3.y, monitorDims, 0.6 * monitorDims);

  head1.x += head1.v;
  if ((head1.x >=0.8 * width) || (head1.x < head1.start)) {
    head1.v = -head1.v;
  }
  if (head1.v < 0) {
    text("LEFT SIDE", monitorX, 0.25 * height);
  } else {
    text("RIGHT SIDE", monitorX, 0.25 * height);
  }


  if (head2.x >=0.8 * width) {
    head2.v = head2.backward;
  }
  if (head2.x < head2.start) {
    head2.v = head2.forward;
  }


  head2.x += head2.v;

  text("STITCH", monitorX, 0.5 * height);


  text("MOUSE DRIVEN", monitorX, 0.75 * height);
  head3.x = mouseX;
  if (head3.x >=0.8 * width) {
    head3.x = 0.8 * width;
  }
  if (head3.x < head3.start) {
    head3.x = head3.start;
  }


}




{/* <iframe class='embeddedblocks' style="width:100%; zoom:1.0; height:1000px; overflow: hidden;"  scrolling="no" src="https://b38tn1k.com/rsigma/astitchintime/"></iframe> */ }