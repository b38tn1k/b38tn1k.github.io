
var player;
var bgTexture, bgX, bgY;

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
    if (this.y > windowHeight * 0.2) {
      this.y -= speed;
    } else {
      bgY += speed;
    }
  }
  moveDown(speed = 1) {
    if (this.y < windowHeight * 0.9) {
      this.y += speed;
    } else {
      bgY -= speed;
    }
  }
  moveLeft(speed = 1) {
    if (this.x > windowWidth * 0.1) {
      this.x -= speed;
    } else {
      bgX += speed;
    }
  }
  moveRight(speed = 1) {
    if (this.x < windowWidth * 0.9) {
      this.x += speed;
    } else {
      bgX -= speed;
    }
  }
  moveWithPress(x, y, speed = 1){
    let dx = this.x - x;
    let dy = this.y - y;
    let angle = atan2(dy, dx);
    //sohcahtoa
    // sin(angle) * h = 0
    if (((this.x - cos(angle) * speed) < windowWidth * 0.9) && ((this.x - cos(angle) * speed) > windowWidth * 0.1)) {
      this.x += cos(angle) * speed;
    } else {
      bgX -= cos(angle) * speed;
    }

    if (((this.y  - sin(angle) * speed)< windowHeight * 0.9) && ((this.y  - sin(angle) * speed) > windowHeight * 0.2)) {
      this.y += sin(angle) * speed;
    } else {
      bgY -= sin(angle) * speed;
    }

    // this.y += sin(angle) * speed;
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
  spS.circle((w * 4)/10, (h * 9)/20, 3);
  spS.circle((w * 6)/10, (h * 9)/20, 3);
  let sheet = createGraphics(w * frames, (3*h)/2);
  let bob = 0;
  sheet.fill(0, 0, 0, 40);
  sheet.noStroke();
  for (let i = 0; i < frames; i++) {
    bob = sin((i / frames + 1) * PI);
    sheet.image(spS, i*w, bob * 10.0);
    sheet.ellipse(w/2 + i*w, h, w/2 + (4.0 * bob), h/6 - (2.0 * bob));
    sheet.ellipse(w/2 + i*w, h, w/3 + (4.0 * bob), h/9 - (2.0 * bob));
    sheet.ellipse(w/2 + i*w, h, w/5 + (4.0 * bob), h/11 - (2.0 * bob));
  }
  return sheet;
}

function makeBackgroundTexture() {
  bgTexture = createGraphics(2*windowWidth, 2*windowHeight);
  bgX = windowWidth;
  bgY = windowHeight;
  // draw grass clumps
  bgTexture.noStroke();
  bgTexture.fill(100, 150, 100);
  let startX, startY, width, length;
  for (let i = 0; i < (bgTexture.width * bgTexture.height) / 20000; i++) {
    startX = random(bgTexture.width);
    startY = random(bgTexture.height);
    width = random(3, 7);
    length = random(10, 30);
    for (let j = 0; j < length; j++) {
      bgTexture.triangle(startX, startY, random(startX, startX + width), startY - random(5, 10) * sin((j / length) * PI), startX + width, startY);
      startX += width;
      width = random(3, 7);
    }
  }
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
  // console.log(mouseX, mouseY)
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
}

function setupGame() {
  player = new Player(windowWidth>>1, windowHeight>>1);
  makeBackgroundTexture();
}

function setup() {
  imageMode(CENTER);
  setupScreen();
  setupGame();
}

function draw() {
  clear();
  bgX = min(bgX, bgTexture.width >> 1);
  bgX = max(bgX, 0);
  bgY = min(bgY, bgTexture.height >> 1);
  bgY = max(bgY, 0);
  image(bgTexture, bgX, bgY);
  let cameraCenter = true;

  if (keyIsDown(DOWN_ARROW)){
    player.moveDown();
    cameraCenter = false;
  }
  if (keyIsDown(LEFT_ARROW)){
    player.moveLeft();
    cameraCenter = false;
  }
  if (keyIsDown(UP_ARROW)){
    player.moveUp();
    cameraCenter = false;
  }
  if (keyIsDown(RIGHT_ARROW)){
    player.moveRight();
    cameraCenter = false;
  }
  if (mouseIsPressed === true) {
    player.moveWithPress(mouseX, mouseY);
    cameraCenter = false;
  }
  player.draw();
  if (cameraCenter === true) {
    // console.log(bgX, (windowWidth))
    if (bgX > 0 && bgX < windowWidth){
      if (int(player.x) <= windowWidth >> 1) {
        player.x += 1;
        bgX += 1;
      } else {
        player.x -= 1;
        bgX -= 1;
      }
    }
    if (bgY > 0 && bgY < windowHeight){
      if (int(player.y) <= windowHeight >> 1) {
        player.y += 1;
        bgY += 1;
      } else {
        player.y -= 1;
        bgY -= 1;
      }
    }
  }
}
