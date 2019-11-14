let colors = ['#0f0', '#ff0', '#0ff', '#f0f', '#fff', '#f00', '#00f', '#0f0'];
let gameMap = [];
let mapWidth = 200;
let mapHeight;
let pixelSize = 5;
let shootNow = false;
let mapCanvas = null;
let bg;
let fg;
let obstacle = 0.55;
let showtext = true;
let my_sprite;
let spriteWidth = 8.0;
let spriteHeight = 5.0;
let playerX= 10;
let playerY = 10;
let canvas;
let tc;
let bullets = [];
let frenemies = [];
let frenemyCount = 10;
let direction = [1, 0, 0, 0];
let rearCannon = true;
let herd;
let showScores = false;
let bulldozer = false;
let drawFlag = false;
let timelapse = false;
let timer = 0;
let timeInterval = 100; //every 10 seconds :-)


function setDrawFlag() {
  drawFlag = true;
}

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

function keyPressed() {
  if (key == 't') {
    timelapse = ! timelapse;
    print("hey");
  }
  if (key == 'h') {
    showScores = false;
    tc = rcol();
    while ((tc == bg) || (tc == fg)) {
      tc = rcol();
    }
    showtext = true;
  } else {
    showtext = false;
  }
  if (key == 'i') {
    saveImage();
  }
  if (key == 'b') {
    bulldozer = !bulldozer;
  }
  if (key == ' ') {
    // console.log('shoot');
    shootNow = true;
  }
  if (key == 'c') {
    rearCannon = !rearCannon;
  }
  if (key == 'l') {
    showtext = false;
    tc = rcol();
    while ((tc == bg) || (tc == fg)) {
      tc = rcol();
    }
    showScores = !showScores;
  }
}

function saveImage() {
  var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  save(timestamp+".png");
}

function newMap() {
  let noiseScale = 0.03;
  mapWidth = width / pixelSize;
  // pixelSize = width / mapWidth;
  mapHeight = (height / pixelSize) + 2
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
      if (gameMap[i][j] > obstacle) {
        mapCanvas.square(i*pixelSize, j*pixelSize, pixelSize);
      }
    }
  }
  noStroke();
}

function makeSprite(){
  my_sprite = null;
  let sc = rcol();
  while (sc==bg){
    sc = rcol();
  }
  my_sprite = genSprite(spriteWidth, spriteHeight, sc);
}

function genSprite(spriteWidth, spriteHeight, sc) {
  // let spriteWidth = 8.0;
  // let spriteHeight = 5.0;
  let sprite = createGraphics((spriteWidth+2)*pixelSize, spriteHeight*2*pixelSize);
  sprite.background = bg;
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

function placePlayer() {
  playerX = int(random(10, mapWidth-10));
  playerY = int(random(10, mapHeight-10));
  while (gameMap[playerX][playerY] > obstacle+0.1) {
    playerX = int(random(10, mapWidth-10));
    playerY = int(random(10, mapHeight-10));
    // console.log(playerX);
    // console.log(playerY);
  }
  // console.log(gameMap[playerX][playerY]);
}

window.onresize = function() {
  width = window.innerWidth;
  height = window.innerHeight;
  mapCanvas.remove();
  my_sprite.remove();
  for (var i = 0; i < frenemyCount; i++) {
    frenemies[i].clean();
  }
  canvas = null;
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  newMap();
  makeSprite();
  placePlayer();
  herd = new Herd(20);
  frenemies = herd.herd;
};

function deviceTurned() {
  canvas = null;
  canvas = createCanvas(window.innerWidth, window.innerHeight);
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  smooth(8);
  pixelDensity(2);
  background(rcol());
  newMap();
  makeSprite();
  herd = new Herd(20);
  frenemies = herd.herd;
  tc = rcol();
  while ((tc == bg) || (tc == fg)) {
    tc = rcol();
  }
  // console.log('hi');
}

function draw() {
  clear();
  frameRate(8);
  //update
  let prevX = playerX;
  let prevY = playerY;
  let one = 1;
  if (keyIsDown(17)){
    one = 2; //ehhh
  }

  if ((keyIsDown(UP_ARROW)) || (keyIsDown(87))) {
    playerY-=one;
    if (rearCannon == true) {
      direction = [1, 0, 0, 0];
    } else {
      direction = [0, 1, 0, 0];
    }
  }
  if ((keyIsDown(DOWN_ARROW)) || (keyIsDown(83))) {
    playerY+=one;
    if (rearCannon == true) {
      direction = [0, 1, 0, 0];
    } else {
      direction = [1, 0, 0, 0];
    }
  }
  if ((keyIsDown(LEFT_ARROW)) || (keyIsDown(65))) {
    playerX-=one;
    if (rearCannon == true) {
      direction = [0, 0, 1, 0];
    } else {
      direction = [0, 0, 0, 1];
    }
  }
  if ((keyIsDown(RIGHT_ARROW)) || (keyIsDown(68))) {
    playerX+=one;
    if (rearCannon == true) {
      direction = [0, 0, 0, 1];
    } else {
      direction = [0, 0, 1, 0];
    }
  }
  if (keyIsDown(82)) {
    my_sprite.remove();
    makeSprite();
  }

  //figure out center of sprite and stop it from escaping
  let spriteCenterX = playerX + spriteWidth/2+1;
  let spriteCenterY = playerY + spriteHeight-1;
  if (gameMap[spriteCenterX][spriteCenterY] > obstacle) {
    if (bulldozer == false) {
      playerX = prevX;
      playerY = prevY;
    } else {
      gameMap[spriteCenterX][spriteCenterY] = 0;
      gameMap[spriteCenterX+1][spriteCenterY] = 0;
      gameMap[spriteCenterX-1][spriteCenterY] = 0;
      gameMap[spriteCenterX][spriteCenterY+1] = 0;
      gameMap[spriteCenterX][spriteCenterY-1] = 0;
      setDrawFlag();
    }
  }
  if (keyIsDown(16)) {
    gameMap[spriteCenterX][spriteCenterY] = 1;
    setDrawFlag();
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
      herd.checkShot(bullets[i].x, bullets[i].y, bullets[i].counter);
      bullets[i].update();
    }
    let tempBullets = [];
    for (var i = 0; i < bullets.length; i++){
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
  herd.update(spriteCenterX, spriteCenterY);
  //draw
  mapCanvas.remove();
  if (drawFlag == true) {drawMap();}
  image(mapCanvas, 0, 0);
  drawFlag = false;
  image (my_sprite, playerX*pixelSize, playerY*pixelSize);
  herd.draw();
  if (bullets.length > 0) {
    for (var i = 0; i < bullets.length; i++){
      bullets[i].draw();
    }
  }
  if (showScores == true) {
    herd.showLog();
  }
  noStroke();
  if (bulldozer == true) {
    fill(tc);
    textSize(20);
    text("BULLDOZER", width - 200, 50);
  }
  if (timelapse == true) {
    if (timer % timeInterval == 0) {
      saveImage();
    } else {
      fill(tc);
      textSize(20);
      text("TIMELAPSING", width - 200, 100);
    }
  }
  if (keyIsDown(86)) {
    fill(rcol());
    textSize(200);
    text("VERSION\nYES", 50, 250);
  }
  timer++;
  if (showtext == true) {
    strokeWeight(5);
    stroke(fg);
    fill(tc);
    rect(45, 5, 1320, 300);
    fill(bg);
    rect(45, 320, 350, 280);
    noStroke();
    let s = '[WASD] to move\nHold [LEFT CONTROL] to go faster\n[LEFT SHIFT] to build\n[SPACE] to shoot\n[B] for Bulldozer Mode\n[C] to switch cannon direction\n[R] for a new sprite\n[L] for logging\n[H] to see this again\nPress any key to play';
    let t = 'YOU ARE THE BIG ONE\nYOU FLOAT IN LUMPY SPACE WITH THE LITTLE ONES\nWHEN A LITTLE ONE DIES,\nTHE TWO OLDEST HAVE A BABY\nSOMETIMES THEY MUTATE';
    textSize(50);
    text(t, 50, 50);
    fill(tc);
    textSize(20);
    text(s, 50, 350);
  }
}

class Frenemy {
  constructor() {
    this.color = rcol();
    this.stuck = 0;
    while (this.color==bg){
      this.color = rcol();
    }
    this.behaviourThresh = 0.98; // just to slow everyone down
    this.x = int(random(10, mapWidth-10));
    this.y = int(random(10, mapHeight-10));
    this.alive = true;
    while (gameMap[this.x][this.y] > obstacle) {
      this.x = int(random(10, mapWidth-10));
      this.y = int(random(10, mapHeight-10));
    }
    this.counter = 0;
    this.width = 5.0;
    this.height = 3.0;
    this.sprite = genSprite(this.width, this.height, this.color);
    this.xrand = int(random(-2, 2));
    this.yrand = int(random(-2, 2));
    this.builder = random(-1, 1); // liklihood to make walls vs liklihood to shoot and destroy
    this.evader = random(-1, 1); //liklihood to move towards player/ away
    this.seeker = random(-1, 1); //likleihood to cling to edges / float in empty space
    this.purpose = random(2) + 1; // the uppoer bound on how far they might travel
    this.direction = [0, 0, 0, 0];
    this.bulldozer = false;
    this.dozer_count = 0;
  }

  inherit(builder, evader,seeker,purpose, color) {
    this.clean();
    this.color = color
    this.sprite = genSprite(5.0, 3.0, this.color);
    this.builder = builder;
    this.purpose = purpose;
  }

  builderBehaviour(){
    if ((this.direction[0] == 0) && (this.direction[1] == 0) && (this.direction[2] == 0) && (this.direction[3] == 0)) {
      if (random() > 0.5) {
        this.direction = [1, 0, 0, 0]
      } else {
        this.direction = [0, 1, 0, 0]
      }
    }
    if ((-1.0 * random()) > this.builder) {
      //either shoot or bulldozer?
      // if (coin() == true) {
      this.bulldozer = true;
      this.dozer_count = 2;
      // } else {
      bullets.push(new Bullet(this.x, this.y, this.direction));
      // }
    }
    if (random() < this.builder) {
      gameMap[this.x][this.y] = 1;
      setDrawFlag();
    }
  }

  clean() {
    this.sprite.remove();
    this.sprite = null;
  }

  checkShot(x, y) {
      if ((x > this.x) && (x < (this.x + 5))){
        if ((y > this.y) && (y < (this.y + 6))){
          this.alive = false;
        }
      }
  }

  checkTouch(x, y) {
    if ((x > this.x-spriteWidth) && (x < (this.x + spriteWidth))){
      if ((y > this.y - spriteHeight) && (y < (this.y + spriteHeight))){
        this.alive = false;
        return true;
      }
    }
    return false;
  }

  randomWalk() {
    if (this.counter%int(random(3, (5*this.purpose))) == 0) {
      if (this.dozer_count <= 0) {
        this.bulldozer = false;
      } else {
        this.dozer_count--;
      }
      this.direction = [0, 0, 0, 0];
      this.xrand = int(random(-2, 2));
      this.yrand = int(random(-2, 2));
      if (this.yrand > 0) {this.direction[0] = 1}
      if (this.yrand < 0) {this.direction[1] = 1}
      if (this.xrand > 0) {this.direction[2] = 1}
      if (this.xrand < 0) {this.direction[3] = 1}
    }
    this.counter ++;
    this.x += this.xrand;
    this.y += this.yrand;
  }

  update() {
    if (this.stuck >=300){
      this.x = int(random(10, mapWidth-10));
      this.y = int(random(10, mapHeight-10));
      while (gameMap[this.x][this.y] > obstacle+0.1) {
        this.x = int(random(10, mapWidth-10));
        this.y = int(random(10, mapHeight-10));
      }
      this.stuck = 0;
    }
    this.x = int(this.x);
    this.y = int(this.y);
    let prevx = this.x;
    let prevy = this.y;
    //start motion with a random random walk
    this.randomWalk();
    if (random() > this.behaviourThresh){
      this.builderBehaviour();
    }
    if (this.x < this.width) {this.x = this.width;}
    if (this.x > mapWidth-3*this.width) {this.x = mapWidth-3*this.width;}
    if (this.y < this.width) {this.y = this.width;}
    if (this.y > mapHeight - 3*this.width) {this.y = mapHeight - 3*this.width;}
    let centerx = this.x + this.width;
    let centery = this.y + int(this.height/2);
     if ((gameMap[centerx][centery] > obstacle)||(gameMap[this.x][this.y] > obstacle)) {
      if (this.bulldozer == false){
        this.stuck++;
        this.x = prevx;
        this.y = prevy;
      } else {
        gameMap[centerx][centery] = 0;
        gameMap[centerx+1][centery+1] = 0;
        gameMap[centerx-1][centery-1] = 0;
        gameMap[centerx+1][centery-1] = 0;
        gameMap[centerx-1][centery+1] = 0;
        gameMap[centerx][centery+1] = 0;
        gameMap[centerx][centery-1] = 0;
        gameMap[centerx+1][centery] = 0;
        gameMap[centerx-1][centery] = 0;
        // drawMap;
      }
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
    this.counter = 0;
    while (this.col== bg){
      this.col = rcol();
    }
  }
  update() {
    this.counter++;
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
          if ((this.x > 2) && (this.x < mapWidth-2) && (this.y > 2) && (this.y < mapHeight-2)){
            gameMap[this.x+1][this.y-1] = 0;
            gameMap[this.x-1][this.y-1] = 0;
            gameMap[this.x-1][this.y+1] = 0;
            gameMap[this.x-1][this.y] = 0;
            gameMap[this.x][this.y-1] = 0;

            gameMap[this.x+1][this.y+1] = 0;
            gameMap[this.x][this.y+1] = 0;
            gameMap[this.x+1][this.y] = 0;
          }
        }
        setDrawFlag();
      }
    }
  }
  draw() {
    fill(this.col);
    stroke(this.col);
    square(this.x*pixelSize, this.y*pixelSize, pixelSize);
  }
}

class Herd {
  constructor(count) {
    this.mutation_liklihood = 0.3;
    this.count = count
    this.herd = [];
    for (var i = 0; i < count; i++) {
      this.herd.push(new Frenemy())
    }
  }
  showLog() {
    noStroke();
    fill(color('#666'));
    rect(0, 0, 500, 22 * this.count);
    rect(0, 22 * this.count, 500, 100);
    fill(color('#fff'));
    textSize(15);
    let t = "Lump\t\t\tIntent\t\t\t\t\tCreativity\t\tEvader\t\t\t\t\t\tSeeker\t\tDozer\t\t\tAge"
    text(t, 10, 20);
    let f = 0;
    for (var i = 0; i < this.count; i++) {
      fill(color(this.herd[i].color));
      t =  " " +nf(i, 2) + "\t\t\t\t\t" + nfp(this.herd[i].purpose, 2, 2) + '\t\t\t\t\t' + nfp(this.herd[i].builder, 2, 2)+ '\t\t\t\t' + nfp(this.herd[i].evader, 2, 2)+ '\t\t\t\t\t' + nfp(this.herd[i].seeker, 2, 2)+ '\t\t\t' + this.herd[i].bulldozer+ '\t\t\t' + this.herd[i].counter;
      f = 20 + (i + 1) * 20;
      text(t, 10, f);
    }
    f += 30;
    fill(color('#fff'));
    t = "Intent is how confident a little one moves in a direction\nCreativity can also be destructive\nStrong Evaders will move away from the big one as the weak approach\nSeekers will find shelter near structures\nDozer Mode is Dozer Mode"
    text(t, 10, f);


  }
  checkShot(x, y, armed) {
    if (armed > 5) {
      for (var k = 0; k < this.count; k++) {
        this.herd[k].checkShot(x, y)
      }
    }
  }
  update(x, y) {
    for (var i = 0; i < this.count; i++) {
      if (this.herd[i].alive == false) {
        this.herd[i].clean();
        this.herd[i] = new Frenemy();
        let mum = this.herd[0];
        let mum2 = this.herd[1];
        for (var t = 0; t < this.count; t++) {
          if (this.herd[t].counter > mum.counter) {
            mum = this.herd[t];
          } else if (this.herd[t].counter > mum2.counter) {
            mum2 = this.herd[t];
          }
        }
        let newColor = lerpColor(color(mum.color), color(mum2.color), 0.5);
        // mutations are similarily weighted but not codependant
        if (random() > this.mutation_liklihood) {
          newColor = lerpColor(color(newColor), color(rcol()), 0.5);
        }
        if (random() > this.mutation_liklihood) {
          mum.builder = random(-1, 1);
        }
        let purpose = (mum.purpose + mum2.purpose)/2.0;
        if (random() > this.mutation_liklihood) {
          purpose = this.purpose = random(2) + 1;
        }
        this.herd[i].inherit(mum.builder, 0, 0,purpose, newColor);
      }
      this.herd[i].update();
      //player is global
      if (this.herd[i].checkTouch(x, y) == true) {
        my_sprite.remove();
        makeSprite();
      }
    }
  }
  draw() {
    for (var i = 0; i < this.count; i++) {
      this.herd[i].draw();
    }
  }

}
