let colors = ['#0f0', '#ff0', '#0ff', '#f0f', '#fff', '#f00', '#00f', '#0f0'];
let gameMap = [];
let mapWidth = 195;
let mapHeight;
let pixelSize = 5;
let shootNow = false;
let mapCanvas = null;
let bg;
let fg;
let obstacle = 0.55;
let showHelp = true;
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
let herd1;
let herd2;
let herd3;
let herd4;
let showScores = false;
let bulldozer = false;
let drawFlag = false;
let timelapse = false;
let timer = 0;
let timeInterval = 100; //every 10 seconds :-)
let spriteIndicator = 10;


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
    spriteIndicator = 8;
    showScores = false;
    tc = rcol();
    while ((tc == bg) || (tc == fg)) {
      tc = rcol();
    }
    showHelp = true;
  } else {
    showHelp = false;
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
    showHelp = false;
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
  let noiseScale = 0.05;
  mapWidth = width / pixelSize;
  // pixelSize = width / mapWidth;
  mapHeight = (height / pixelSize) + 2
  for (var i = 0; i < mapWidth; i++) {
    gameMap[i] = []
    let iVal = 0
    let border = 0.1;
    if (i < border*mapWidth) {
      iVal = (1.0 - i/(border*mapWidth));
      iVal = iVal/3;
    }
    if (i > (1.0 - border)*mapWidth) {
      iVal = (1.0 - (mapWidth - i)/(mapWidth/(100*border)));
      iVal = iVal/3;
    }

    for (var j = 0; j < mapHeight; j++) {
      let noiseVal = noise(i*noiseScale, j*noiseScale);
      let jVal = 0
      if (j < border*mapHeight) {
        jVal = (1.0 - j/(border*mapHeight));
        jVal = jVal/3;
      }
      if (j > (1.0 - border)*mapHeight) {
        jVal = (1.0 - (mapHeight - j)/(mapHeight/(100*border)));
        jVal = jVal/3;
      }
      gameMap[i][j] = ((noiseVal) + iVal + jVal);
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
      // test
      // mapCanvas.fill(lerpColor(color("#fff"), color("#000"), gameMap[i][j]))
      // mapCanvas.stroke(lerpColor(color("#fff"), color("#000"), gameMap[i][j]))
      // mapCanvas.square(i*pixelSize, j*pixelSize, pixelSize);
      // test
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
  while (gameMap[playerX][playerY] > obstacle/2) {
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
  canvas = null;
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  newMap();
  makeSprite();
  placePlayer();
  herd1 = new Herd(5);
  herd2 = new Herd(5);
  herd3 = new Herd(5);
  herd4 = new Herd(5);
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
  herd1 = new Herd(5);
  herd2 = new Herd(5);
  herd3 = new Herd(5);
  herd4 = new Herd(5);
  tc = rcol();
  while ((tc == bg) || (tc == fg)) {
    tc = rcol();
  }
  // console.log('hi');
}

function draw() {
  try {
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
    if (typeof gameMap != "undefined") {
      if (gameMap[spriteCenterX][spriteCenterY] > obstacle) {
        if (bulldozer == false) {
          playerX = prevX;
          playerY = prevY;
        } else {
          try {
            if (typeof gameMap != "undefined") {
              gameMap[spriteCenterX][spriteCenterY] = 0;
              gameMap[spriteCenterX+1][spriteCenterY] = 0;
              gameMap[spriteCenterX-1][spriteCenterY] = 0;
              gameMap[spriteCenterX][spriteCenterY+1] = 0;
              gameMap[spriteCenterX][spriteCenterY-1] = 0;
            }
          } catch(err) {
            console.log(err);
          }
          setDrawFlag();
        }
      }
    }
    if (keyIsDown(16)) {
      if (typeof gameMap != "undefined") {
        gameMap[spriteCenterX][spriteCenterY] = 1;
      }
      setDrawFlag();
    }
    if (keyIsDown(32)) {
      //shoot
      if (shootNow == true) {
        bullets.push(new Bullet(spriteCenterX, spriteCenterY, direction));
        shootNow = false;
      }
    }
    if (showHelp == false && spriteIndicator >=0) {
      spriteIndicator--;
      my_sprite.remove();
      makeSprite();
    }

    if (playerX < 0) {playerX = 0;}
    if (playerX > mapWidth-spriteWidth) {playerX = mapWidth-spriteWidth;}
    if (playerY < 0) {playerY = 0;}
    if (playerY > mapHeight - 1.5*spriteHeight) {playerY = mapHeight - 1.5*spriteHeight;}

    if (bullets.length > 0) {
      for (var i = 0; i < bullets.length; i++){
        herd1.checkShot(bullets[i].x, bullets[i].y, bullets[i].counter);
        herd2.checkShot(bullets[i].x, bullets[i].y, bullets[i].counter);
        herd3.checkShot(bullets[i].x, bullets[i].y, bullets[i].counter);
        herd4.checkShot(bullets[i].x, bullets[i].y, bullets[i].counter);
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
    herd1.update(spriteCenterX, spriteCenterY);
    herd2.update(spriteCenterX, spriteCenterY);
    herd3.update(spriteCenterX, spriteCenterY);
    herd4.update(spriteCenterX, spriteCenterY);
    //draw
    mapCanvas.remove();
    if (drawFlag == true) {drawMap();}
    image(mapCanvas, 0, 0);
    drawFlag = false;
    image (my_sprite, playerX*pixelSize, playerY*pixelSize);
    herd1.draw();
    herd2.draw();
    herd3.draw();
    herd4.draw();
    if (bullets.length > 0) {
      for (var i = 0; i < bullets.length; i++){
        bullets[i].draw();
      }
    }
    if (showScores == true) {
      let start = herd1.showLog();
      start = herd2.showLog(start);
      start = herd3.showLog(start);
      start = herd4.showLog(start);
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
      text("VERSION\nPOOP", 50, 250);
    }
    timer++;
    if (showHelp == true) {
      strokeWeight(5);
      stroke(fg);
      fill(tc);
      rect(45, 5, 1320, 300);
      fill(bg);
      rect(45, 320, 350, 280);
      noStroke();
      let s = '[WASD] to move\nHold [LEFT CONTROL] to go faster\n[LEFT SHIFT] to build\n[SPACE] to shoot\n[B] for Bulldozer Mode\n[C] to switch cannon direction\n[R] for a new sprite\n[L] for logging\n[H] to see this again\nPress any key to play';
      let t = 'YOU ARE THE BIG ONE\nYOU FLOAT IN LUMPY SPACE WITH THE LITTLE ONES\nWHEN A LITTLE ONE DIES,\nTHE TRIBE ELDERS HAVE A BABY\nSOMETIMES THEY MUTATE';
      textSize(50);
      text(t, 50, 50);
      fill(tc);
      textSize(20);
      text(s, 50, 350);
    }
  } catch(err) {
    console.log(err);
    console.log(":-p");
  }
}

class Frenemy {
  constructor(offset) {
    this.color = rcol();
    this.stuck = 0;
    while (this.color==bg){
      this.color = rcol();
    }
    this.behaviourThresh = 0.95; // just to slow everyone down
    this.x = int(random(10, mapWidth-10));
    this.y = int(random(10, mapHeight-10));
    this.alive = true;
    if (typeof gameMap != "undefined") {
      while (gameMap[this.x][this.y] > obstacle) {
        this.x = int(random(10, mapWidth-10));
        this.y = int(random(10, mapHeight-10));
      }
    }
    this.counter = offset;
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
    this.builddozer = false;
    this.builder_count = 0;
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

      this.bulldozer = true;
      this.builder_count = 2;
      // } else {
      if (coin() == true) {
        bullets.push(new Bullet(this.x, this.y, this.direction));
      }
      // }
    }
    if (random() < this.builder) {
      // gameMap[this.x][this.y] = 1;
      let centerx = this.x + this.width;
      let centery = this.y + int(this.height * 0.5);
      if (centerx < 0) {centerx = 0;}
      if (centerx > mapWidth-2) {centerx = mapWidth-2;}
      if (centery < 2) {centery = 2;}
      if (centery > mapHeight-2) {centery = mapHeight-2;}
      try{
        if (typeof gameMap != "undefined") {
          gameMap[centerx+1][centery+1] += 0.3;
          gameMap[centerx-1][centery-1] += 0.3;
          gameMap[centerx+1][centery-1] += 0.3;
          gameMap[centerx-1][centery+1] += 0.3;
          gameMap[centerx][centery+1] += 0.3;
          gameMap[centerx][centery-1] += 0.3;
          gameMap[centerx+1][centery] += 0.3;
          gameMap[centerx-1][centery] += 0.3;
          gameMap[centerx][centery] += 1;
        }
      } catch(err) {
        console.log(err);
      }
      setDrawFlag();
      this.builder_count = 2;
      this.builddozer = true;
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
        if (this.builder_count <= 0) {
          this.bulldozer = false;
          this.builddozer = false;
        } else {
          this.builder_count--;
        }
        this.direction = [0, 0, 0, 0];
        this.xrand = int(random(-2, 2));
        this.yrand = int(random(-2, 2));
        if (this.yrand > 0) {this.direction[0] = 1}
        if (this.yrand < 0) {this.direction[1] = 1}
        if (this.xrand > 0) {this.direction[2] = 1}
        if (this.xrand < 0) {this.direction[3] = 1}
        if (this.behaviourThresh < random()){
          if (coin() == true) {
            // Evader Behavior
            if (this.evader > 0) {
              this.xrand = (this.x - playerX)/abs((this.x - playerX));
              this.yrand = (this.y - playerY)/abs((this.y - playerY));
            } else {
              this.xrand = -1.0*(this.x - playerX)/abs((this.x - playerX));
              this.yrand = -1.0*(this.y - playerY)/abs((this.y - playerY));
            }
          } else {
            // Seeker Behavior
            let posX;
            let negX;
            let posY;
            let negY;
            let countXpos = 0;
            let countXneg = 0;
            let countYpos = 0;
            let countYneg = 0;
            if (typeof gameMap != "undefined") {
              for (let i = this.x; i < mapWidth-10; i+=2) {
                if (gameMap[i][this.y] > obstacle) {
                  break;
                }
                countXpos++;
              }
              for (let i = this.x; i > 10; i-=2) {
                if (gameMap[i][this.y] > obstacle) {
                  break;
                }
                countXneg++;
                if (countXneg > countXpos) {break;}
              }
              for (let i = this.y; i < mapHeight-10; i+=2) {
                if (gameMap[this.x][i] > obstacle) {
                  break;
                }
                countYpos++;
              }
              for (let i = this.y; i > 10; i-=2) {
                if (gameMap[this.x][i] > obstacle) {
                  break;
                }
                countYneg++;
                if (countYneg > countYpos) {break;}
              }
            }
            if (this.seeker > 0) {
              this.xrand = (countXpos - countXneg) / abs((countXpos - countXneg));
              this.yrand = (countYpos - countYneg) / abs((countYpos - countYneg));
            } else {
              this.xrand = -1 * (countXpos - countXneg) / abs((countXpos - countXneg));
              this.yrand = -1 * (countYpos - countYneg) / abs((countYpos - countYneg));
            }
            // walk to walls / away

          }
        }
      }
      this.counter ++;
      this.x += this.xrand;
      this.y += this.yrand;
  }

  update() {
    if (this.counter > 5000) {this.alive=false;} //die of old age eventually
    if (this.stuck >=100){
      this.bulldozer = true;
      // is this cheating?
      if(this.builder >= -1.0) {
        this.builder -= 0.1;
      }
    }
    this.x = int(this.x) || 0;
    this.y = int(this.y) || 0;
    let prevx = this.x;
    let prevy = this.y;
    //start motion with a random random walk
    this.randomWalk();
    if (random() > this.behaviourThresh){
      this.builderBehaviour();
    }
    let centerx = 10;
    let centery = 10;
    try {
      // if (typeof(gameMap[this.x][this.y]) == 'undefined') {
      //   console.log('gameMap error');
      //   return;
      // }
      if (this.x < 2*this.width) {this.x = 2*this.width;}
      if (this.x > mapWidth-3*this.width) {this.x = mapWidth-3*this.width;}
      if (this.y < 2*this.width) {this.y = 2*this.width;}
      if (this.y > mapHeight - 3*this.width) {this.y = mapHeight - 3*this.width;}
      this.x = int(this.x) || 0;
      this.y = int(this.y) || 0;
      centerx = int(this.x + this.width);
      centery = int(this.y + int(this.height/2));
      centerx = int(centerx) || this.x;
      centery = int(centery) || this.y;
      if (centerx < 10) {centerx = 10;}
      if (centerx > mapWidth-10) {centerx = mapWidth-10;}
      if (centery < 10) {centery = 10;}
      if (centery > mapHeight-10) {centery = mapHeight-10;}
      // console.log(gameMap[centerx][centery]);
      // console.log(gameMap[this.x][this.y]);
      // console.log(this.x, this.y, centerx, centery);
      if (typeof gameMap != "undefined") {
        if ((gameMap[centerx][centery] > obstacle)||(gameMap[this.x][this.y] > obstacle)) {
          if (this.bulldozer == false){
            this.stuck++;
            this.x = prevx;
            this.y = prevy;
          } else {
            gameMap[centerx][centery] -=0.3;
            gameMap[centerx+1][centery+1] -=0.3;
            gameMap[centerx-1][centery-1] -=0.3;
            gameMap[centerx+1][centery-1] -=0.3;
            gameMap[centerx-1][centery+1] -=0.3;
            gameMap[centerx][centery+1] -=0.3;
            gameMap[centerx][centery-1] -=0.3;
            gameMap[centerx+1][centery] -=0.3;
            gameMap[centerx-1][centery] -=0.3;
          }
        }
        if (this.builddozer == true) {
          gameMap[centerx][centery] *= 1.5;
          gameMap[centerx+1][centery+1] *= 1.5;
          gameMap[centerx-1][centery-1] *= 1.5;
          gameMap[centerx+1][centery-1] *= 1.5;
          gameMap[centerx-1][centery+1] *= 1.5;
          gameMap[centerx][centery+1] *= 1.5;
          gameMap[centerx][centery-1] *= 1.5;
          gameMap[centerx+1][centery] *= 1.5;
          gameMap[centerx-1][centery] *= 1.5;
        }
      }
      setDrawFlag();
      if ((this.x != prevx) && (this.y !=prevy) ) {this.stuck = 0;}
    } catch(err) {
      console.log(this.x, this.y); //probably somehow not an object
      console.log(centerx, centery); //probably somehow not an object
      console.log(err); //probably somehow not an object
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
      let posVal = 0;
      // if (typeof(gameMap[this.x][this.y]) == 'undefined') {
      //   console.log('gameMap error');
      //   return;
      // }
      this.x = int(this.x);
      this.y = int(this.y);
      if (typeof gameMap != "undefined") {
              if (typeof gameMap[int(this.x)][int(this.y)] != "undefined") {
                posVal = gameMap[int(this.x)][int(this.y)];
              }          
      }
      if (typeof gameMap != "undefined") {
        if (gameMap[this.x][this.y]>obstacle) {
          gameMap[this.x][this.y] -=0.2;

          this.health--;
          if (this.health == 0) {
            if ((this.x > 2) && (this.x < mapWidth-2) && (this.y > 2) && (this.y < mapHeight-2)){
              try {
                gameMap[this.x+1][this.y-1] -= 0.2;
                gameMap[this.x-1][this.y-1] -= 0.2;
                gameMap[this.x-1][this.y+1] -= 0.2;
                gameMap[this.x-1][this.y] -= 0.2;
                gameMap[this.x][this.y-1] -= 0.2;
                gameMap[this.x+1][this.y+1] -= 0.2;
                gameMap[this.x][this.y+1] -= 0.2;
                gameMap[this.x+1][this.y] -= 0.2;
              } catch(err) {
                console.log(err);
              }
            }
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
      this.herd.push(new Frenemy(i))
    }
  }
  showLog(start=10) {
    noStroke();
    fill(color('#000'));
    rect(0, start - 10, 500, 22 * (this.count + 1));
    rect(0, start + (22 * this.count), 500, 120);
    fill(color('#fff'));
    textSize(15);
    let t;
    if (start == 10) {
      t = "Lump\t\t\tIntent\t\t\t\t\tCreativity\t\tEvader\t\t\t\t\t\tSeeker\t\tDozer\t\t\tAge"
      text(t, start, 20);
    }
    let f = 0;
    for (var i = 0; i < this.count; i++) {
      fill(color(this.herd[i].color));
      t =  " " +nf(i, 2) + "\t\t\t\t\t" + nfp(this.herd[i].purpose, 2, 2) + '\t\t\t\t\t' + nfp(this.herd[i].builder, 2, 2)+ '\t\t\t\t' + nfp(this.herd[i].evader, 2, 2)+ '\t\t\t\t\t' + nfp(this.herd[i].seeker, 2, 2)+ '\t\t\t' + (this.herd[i].bulldozer ||this.herd[i].builddozer )+ '\t\t\t' + this.herd[i].counter;
      f = start + (20 + (i + 1) * 20);
      text(t, 10, f);
    }
    f += 30;
    let end = f-5;
    fill(color('#fff'));
    t = "Intent is how confident a little one moves in a direction\nCreativity can also be destructive\nStrong Evaders will move away from the big one as the weak approach\nSeekers will find shelter near structures\nDozer Mode is Dozer Mode"
    text(t, 10, f);
    return end
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
        this.herd[i] = new Frenemy(i);
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

function touchStarted(){
  showHelp = false;
}
