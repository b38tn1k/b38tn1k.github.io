let spriteSheet;
let cols = 22;
let rows = 41;
let cellWidth = 124;
let cellHeight = 93;
let currentFrame = 0;
let frameDelay = 4;
let frameCounter = 0;

function preload() {
  spriteSheet = loadImage('104487.png');
}

function setup() {
  createCanvas(cellWidth, cellHeight);
  noSmooth();
  textFont('monospace');
}

function draw() {
  background(255);
  pixelDensity(2);

  let col = currentFrame % cols;
  let row = Math.floor(currentFrame / cols);
  let sx = col * cellWidth;
  let sy = row * cellHeight;

  image(spriteSheet, 0, 0, width, height, sx, sy, cellWidth, cellHeight);
  drawInfoText();

  frameCounter++;
  if (frameCounter >= frameDelay) {
    currentFrame = (currentFrame + 1) % (cols * rows);
    frameCounter = 0;
  }
}

function drawInfoText() {
  fill(0);
  noStroke();
  textSize(34);
}