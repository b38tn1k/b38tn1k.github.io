
var player;

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lastFrame = 80;
    this.currentFrame = 0;
    this.spriteSheet = makeGhostSpriteSheet(80, 60, this.lastFrame);
    this.width = this.spriteSheet.width / this.lastFrame;
    this.height = this.spriteSheet.height;
  }
  draw () {
    this.currentFrame += 1;
    if (this.currentFrame == this.lastFrame) {
      this.currentFrame = 0;
    }
    // console.log(this.currentFrame);
    image(this.spriteSheet, this.x, this.y, this.width, this.height, this.width * this.currentFrame, 0, this.width, this.height);
  }
  moveUp(speed = 1) {
    this.y -= speed;
  }
  moveDown(speed = 1) {
    this.y += speed;
  }
  moveLeft(speed = 1) {
    this.x -= speed;
  }
  moveRight(speed = 1) {
    this.x += speed;
  }
}

function makeGhostSpriteSheet(w, h, frames) {
  let spS = createGraphics(w, h);
  spS.fill(255);
  spS.noStroke();
  spS.circle(w>>1, h>>1, w>>1);
  spS.rect(w>>2, h>>1, w>>1, h>>2);
  spS.circle(w/3, (3 * h)/4, w/6);
  spS.circle(w>>1, (3 * h)/4, w/6);
  spS.circle((2 * w)/3, (3 * h)/4, w/6);
  spS.erase();
  spS.circle((w * 4)/10, (h * 9)/20, 10);
  spS.circle((w * 6)/10, (h * 9)/20, 10);
  spS.noErase();
  let sheet = createGraphics(w * frames, (3*h)/2);
  let bob = 0;
  sheet.fill(100, 100, 100, 100);
  sheet.noStroke();
  for (let i = 0; i < frames; i++) {
    bob = sin((i / frames + 1) * PI);
    sheet.image(spS, i*w, bob * 10.0);
    sheet.ellipse(w/2 + i*w, h, w/2 + (4.0 * bob), h/6 - (2.0 * bob));
  }
  return sheet;

}


function keyPressed() {
  if (key == ' ') {
    console.log('bang');
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
  player = new Player(windowWidth>>1, windowHeight>>1);
}

function setup() {
  imageMode(CENTER);
  setupScreen();
}

function draw() {
  clear();
  if (keyIsDown(DOWN_ARROW)){
    player.moveDown();
  }
  if (keyIsDown(LEFT_ARROW)){
    player.moveLeft();
  }
  if (keyIsDown(UP_ARROW)){
    player.moveUp();
  }
  if (keyIsDown(RIGHT_ARROW)){
    player.moveRight();
  }
  player.draw();

}
