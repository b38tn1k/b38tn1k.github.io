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

function keyPressed() {
  if (key == 'i') {
    saveImage();
  }
  if (key == 'w') {
    playerY--;
    generate();
  }
  if (key == 's') {
    playerY++;
    generate();
  }
  if (key == 'a') {
    playerX--;
    generate();
  }
  if (key == 'd') {
    playerX++;
    generate();
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
  console.log('yay');
  drawMap();
}

let mapCanvas;
let bg;
let fg;

function drawMap() {
  bg = rcol();
  fg = rcol();
  noStroke();
  mapCanvas = createGraphics(window.innerWidth, window.innerHeight);

  mapCanvas.background(bg);

  while (fg==bg){
    fg = rcol();
  }
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

let sprite;
function makeSprite() {
  sprite = createGraphics(window.innerWidth, window.innerHeight);
  sprite.background = bg;
  let sc = rcol();
  while (sc==bg){
    sc = rcol();
  }
  sprite.fill(sc);
  sprite.stroke(sc);
  let x = 0;
  let y = 0;
  let invLength = 5.0;
  let invHeight = 8.0;
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
}

let playerX= 10;
let playerY = 10;
function generate() {
  image(mapCanvas, 0, 0);
  image (sprite, playerX*pixelSize, playerY*pixelSize);
}


var canvas;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  smooth(8);
  pixelDensity(2);
  background(rcol());
  newMap();
  makeSprite();
  generate();
  console.log('hi');
}

function mouseClicked() {
}

function draw() {
}

window.onresize = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  console.log(w, ' ', h)
  canvas.size(w,h);
  width = w;
  height = h;
  newMap();
  generate();
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
