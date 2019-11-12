var colors = ['#0f0', '#ff0', '#0ff', '#f0f', '#fff', '#f00', '#00f', '#0f0'];
function rcol() {
  return colors[(int(random(colors.length)))];
};

function rcolsub(thecolors) {
  return thecolors[int(random(thecolors.length))];
};

function coin() {
  return random(1) > .5;
}

function randint(x) {
  return (random(x));
}
var shootNow = false;
function keyPressed() {
  showtext = false;
  if (key == 'i') {
    saveImage();
  }
  if (key == ' ') {
    // console.log('shoot');
    shootNow = true;
  }
}

function saveImage() {
  var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  save(timestamp+".png");
}

let gameMap = [];
var mapWidth = 200;
var mapHeight;
var pixelSize;


function newMap() {
  let noiseScale = 0.02;
  mapWidth = 200
  pixelSize = window.innerWidth / mapWidth
  mapHeight = (window.innerHeight / pixelSize) + 2
  for (var i = 0; i < mapWidth; i++) {
    gameMap[i] = []
    for (var j = 0; j < mapHeight; j++) {
      let noiseVal = noise(i*noiseScale, j*noiseScale);
      gameMap[i][j] = (noiseVal);
    }
  }
  // console.log('yay');
  drawMap(newColor=true);
  placePlayer();
}

let mapCanvas;
let bg;
let fg;
let obstacle = 0.6;

function shuffleColors() {
  bg = rcol();
  fg = rcol();
  while (fg==bg){
    fg = rcol();
  }
}
function drawMap(newColor=false) {
  if (newColor == true) {shuffleColors();}
  noStroke();
  mapCanvas = createGraphics(window.innerWidth, window.innerHeight);
  mapCanvas.background(bg);
  mapCanvas.fill(fg);
  mapCanvas.stroke(fg);
  for (var i = 0; i < mapWidth; i++) {
    for (var j = 0; j < mapHeight; j++) {
      if (gameMap[i][j] > 0.6) {
        mapCanvas.square(i*pixelSize, j*pixelSize, pixelSize);
      }
    }
  }
  image(mapCanvas, 0, 0);

}
var showtext = true;
let my_sprite;
let spriteWidth = 8.0;
let spriteHeight = 5.0;
function makeSprite(){
  my_sprite = genSprite(spriteWidth, spriteHeight);
}
function genSprite(spriteWidth, spriteHeight) {
  // let spriteWidth = 8.0;
  // let spriteHeight = 5.0;
  let sprite = createGraphics(window.innerWidth, window.innerHeight);
  sprite.background = bg;
  let sc = rcol();
  while (sc==bg){
    sc = rcol();
  }
  sprite.fill(sc);
  sprite.stroke(sc);
  let x = 0;
  let y = 0;
  let invLength = spriteHeight;
  let invHeight = spriteWidth;
  var grid = new Array();
  var max = 0.0;
  //generate
  for (var i = 0; i < invLength; i++) {
    grid[i] = new Array();
    for (var j = 0; j < invHeight; j++) {
      // probability of pixel decreases radiating from grid[6][4]
      // random component
      //grid[i][j] = 0;
      grid[i][j] = random(2);
      // increase density towards horizontal center
      grid[i][j] = grid[i][j] + sin(radians(90*i/invLength));
      // increase density towards vertical center
      grid[i][j] = grid[i][j] + sin(radians(180*(j/invHeight)));
      // reduce density near eye areas

      // end of generating
      if (grid[i][j] > max) {
        max = grid[i][j];
      }
    }
  }
  //scale and prepare for threshold
  var sum = 0;
  var count = 0;
  for (var i = 0; i < invLength; i++) {
    for (var j = 0; j < invHeight; j++) {
      grid[i][j] = grid[i][j]/max;
      sum += grid[i][j];
      count++;
    }
  }
  var average = sum/count;
  var threshhold = average;
  var xpos = 0;
  var ypos = 0;
  for (var i = 0; i < invLength; i++) {
    for (var j = 0; j < invHeight; j++) {
      if (grid[i][j] > threshhold) {
        sprite.rect(xpos, ypos, pixelSize, pixelSize);
      }
      ypos += pixelSize;
    }
    ypos = 0;
    xpos += pixelSize;
  }
  var invlen = int(invLength) - 1;
  for (var i = 0; i < invLength; i++) {
    for (var j = 0; j < invHeight; j++) {
      if (grid[invlen- i][j] > threshhold) {
        sprite.rect(xpos, ypos, pixelSize, pixelSize);
      }
      ypos += pixelSize;
    }
    ypos = 0;
    xpos += pixelSize;
  }
  return sprite;
}

let playerX= 10;
let playerY = 10;

function placePlayer() {
  playerX = int(random(10, mapWidth-10));
  playerY = int(random(10, mapHeight-10));
  while (gameMap[playerX][playerY] > obstacle) {
    playerX = int(random(10, mapWidth-10));
    playerY = int(random(10, mapHeight-10));
    // console.log(playerX);
    // console.log(playerY);
  }
  // console.log(gameMap[playerX][playerY]);
}



var canvas;
let tc;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  smooth(8);
  pixelDensity(2);
  background(rcol());
  newMap();
  makeSprite();
  makeFrenemies();
  tc = rcol();
  while ((tc == bg) || (tc == fg)) {
    tc = rcol();
  }
  // console.log('hi');
}

function mouseClicked() {
}

class Frenemy {
  constructor() {
    this.x = int(random(10, mapWidth-10));
    this.y = int(random(10, mapHeight-10));
    this.alive = true;
    while (gameMap[this.x][this.y] > obstacle) {
      this.x = int(random(10, mapWidth-10));
      this.y = int(random(10, mapHeight-10));
    }
    this.counter = 0;
    this.sprite = genSprite(5.0, 3.0);
    this.xrand = int(random(-2, 2));
    this.yrand = int(random(-2, 2));
  }

  checkShot(x, y) {
    if ((x > this.x) && (x < (this.x + 5))){
      if ((y > this.y) && (y < (this.y + 6))){
        this.alive = false;
      }
    }
  }

  update() {
    //start with a random random walk
    if (this.counter%int(random(3, 5)) == 0) {
      this.xrand = int(random(-2, 2));
      this.yrand = int(random(-2, 2));
    }
    this.counter ++;
    let prevx = this.x;
    let prevy = this.y;
    this.x += this.xrand;
    this.y += this.yrand;
    if (this.x < 0) {this.x = 0;}
    if (this.x > mapWidth-spriteWidth) {this.x = mapWidth-spriteWidth;}
    if (this.y < 0) {this.y = 0;}
    if (this.y > mapHeight - 1.5*spriteHeight) {this.y = mapHeight - 1.5*spriteHeight;}
    if ((gameMap[this.x][this.y] > obstacle)||(gameMap[this.x+5][this.y+6] > obstacle)||(gameMap[this.x+5][this.y] > obstacle)||(gameMap[this.x][this.y+6] > obstacle)) {
      this.x = prevx;
      this.y = prevy;
    }
  }

  draw() {
    image(this.sprite, this.x*pixelSize, this.y*pixelSize);
  }
}

class Bullet {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.alive = true;
    this.health = 5;
    this.col = rcol();
    while (this.col== bg){
      this.col = rcol();
    }
  }
  update() {

    this.y = this.y + this.direction[0];
    this.y = this.y - this.direction[1];
    this.x = this.x + this.direction[2];
    this.x = this.x - this.direction[3];
    // console.log(this.x, this.y);
    if (this.x < 0 || this.y < 0 || this.x >= mapWidth || this.y >= mapHeight) {
      this.alive = false
      // console.log('bye');
    }
    if (this.health == 0) {
      this.alive = false;
    }
    if (this.alive == true){
      if (gameMap[this.x][this.y]>obstacle) {
        gameMap[this.x][this.y] = 0;

        this.health--;
        if (this.health == 0) {
          gameMap[this.x+1][this.y-1] = 0;
          gameMap[this.x-1][this.y+1] = 0;
          gameMap[this.x+1][this.y+1] = 0;
          gameMap[this.x-1][this.y-1] = 0;
          gameMap[this.x][this.y-1] = 0;
          gameMap[this.x-1][this.y] = 0;
          gameMap[this.x][this.y+1] = 0;
          gameMap[this.x+1][this.y] = 0;
        }
        drawMap();
      }
    }
  }
  draw() {
    fill(this.col);
    stroke(this.col);
    square(this.x*pixelSize, this.y*pixelSize, pixelSize);
  }
}

function makeFrenemies() {
  frenemies = [];
  for (var i = 0; i < frenemyCount; i++) {
    frenemies.push(new Frenemy())
  }
}

let bullets = [];
let frenemies = [];
let frenemyCount = 5;
let direction = [1, 0, 0, 0];
function draw() {
  frameRate(10);
  //update
  let prevX = playerX;
  let prevY = playerY;

  if ((keyIsDown(UP_ARROW)) || (keyIsDown(87))) {
    playerY--;
    direction = [1, 0, 0, 0];
  }
  if ((keyIsDown(DOWN_ARROW)) || (keyIsDown(83))) {
    playerY++;
    direction = [0, 1, 0, 0];
  }
  if ((keyIsDown(LEFT_ARROW)) || (keyIsDown(65))) {
    playerX--;
    direction = [0, 0, 1, 0];
  }
  if ((keyIsDown(RIGHT_ARROW)) || (keyIsDown(68))) {
    playerX++;
    direction = [0, 0, 0, 1];
  }

  if (keyIsDown(82)) {
    makeSprite();
  }

  //figure out center of sprite and stop it from escaping
  let spriteCenterX = playerX + spriteWidth/2+1;
  let spriteCenterY = playerY + spriteHeight-1;
  if (gameMap[spriteCenterX][spriteCenterY] > obstacle) {
    playerX = prevX;
    playerY = prevY;
  }
  if (keyIsDown(16)) {
    gameMap[spriteCenterX][spriteCenterY] = 1;
    drawMap();
  }
  if (keyIsDown(32)) {
    //shoot
    if (shootNow == true) {
      bullets.push(new Bullet(spriteCenterX, spriteCenterY, direction));
      shootNow = false;
    }
  }

  if (playerX < 0) {playerX = 0;}
  if (playerX > mapWidth-spriteWidth) {playerX = mapWidth-spriteWidth;}
  if (playerY < 0) {playerY = 0;}
  if (playerY > mapHeight - 1.5*spriteHeight) {playerY = mapHeight - 1.5*spriteHeight;}
  if (bullets.length > 0) {
    for (var i = 0; i < bullets.length; i++){
      for (var k = 0; k < frenemyCount; k++) {
        frenemies[k].checkShot(bullets[i].x, bullets[i].y)
      }
      bullets[i].update();
    }
    let tempBullets = [];
    for (var i = 0; i < bullets.length; i++){
      // console.log(bullets[i].alive);
      if (bullets[i].alive == true){
        tempBullets.push(bullets[i]);
      }
        // and javacript deals with the rest??
    }
    bullets = [];
    for (var i = 0; i < tempBullets.length; i++){
      bullets[i] = tempBullets[i];
    }
  }
  for (var i = 0; i < frenemyCount; i++) {
    if (frenemies[i].alive == false) {
      frenemies[i] = new Frenemy();
    }
    frenemies[i].update();
  }
  //draw
  image(mapCanvas, 0, 0);
  image (my_sprite, playerX*pixelSize, playerY*pixelSize);
  for (var i = 0; i < frenemyCount; i++) {
    frenemies[i].draw();
  }
  if (bullets.length > 0) {
    for (var i = 0; i < bullets.length; i++){
      bullets[i].draw();
    }
  }
  if (showtext == true) {
    fill(tc);
    let s = 'WASD to move\nLEFT SHIFT to build\nSPACE to shoot\nR for a new sprite\nRefresh to see this again...\nPress the any key';
    textSize(50);
    text(s, 50, 50);
  }
}

window.onresize = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  // console.log(w, ' ', h)
  canvas.size(w,h);
  width = w;
  height = h;
  newMap();
  makeSprite();
  placePlayer();
  makeFrenemies();
};

function touchStarted(){
}

function touchMoved(){
  return false;
}
function touchEnded(){
  // return false;
}
function deviceTurned() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
}
