let spriteSheet;
let cols = 27; // default grid
let rows = 34;
let borderX = 0;
let borderY = 0;
let frameWidth, frameHeight;

function preload() {
  spriteSheet = loadImage('104487.png');
}

function setup() {
  createCanvas(spriteSheet.width / 3, spriteSheet.height / 3);
  noSmooth();
  textFont('monospace');
  frameWidth = spriteSheet.width / cols;
  frameHeight = spriteSheet.height / rows;
}

function draw() {
  background(255);
  pixelDensity(2);
  image(spriteSheet, 0, 0, width, height); // draw scaled-down image
  drawGridOverlay();
  drawInfoText();
}

function drawGridOverlay() {
  stroke(0, 0, 255, 120);
  noFill();
  
  let scaleX = width / spriteSheet.width;
  let scaleY = height / spriteSheet.height;

  for (let i = 0; i <= cols; i++) {
    let x = borderX + i * frameWidth * scaleX;
    line(x, borderY, x, height - borderY);
  }
  
  for (let j = 0; j <= rows; j++) {
    let y = borderY + j * frameHeight * scaleY;
    line(borderX, y, width - borderX, y);
  }
}

function drawInfoText() {
  fill(0);
  noStroke();
  textSize(40); // doubled from 20
  text(`Cols: ${cols}  Rows: ${rows}`, 10, height - 50);
  text(`Frame: ${nf(frameWidth, 0, 2)} x ${nf(frameHeight, 0, 2)} px`, 10, height - 10);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) cols = max(1, cols - 1);
  if (keyCode === RIGHT_ARROW) cols++;
  if (keyCode === UP_ARROW) rows++;
  if (keyCode === DOWN_ARROW) rows = max(1, rows - 1);

  if (key === 'a') borderX = max(0, borderX - 1);
  if (key === 'd') borderX++;
  if (key === 'w') borderY = max(0, borderY - 1);
  if (key === 's') borderY++;

  frameWidth = spriteSheet.width / cols;
  frameHeight = spriteSheet.height / rows;
}