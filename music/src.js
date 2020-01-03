let colors = ['#0f0', '#ff0', '#0ff', '#f0f'];
let canvas;
let releases = [];

function preload(){
  let index = 0;
  releases[index++] = new MusicRelease('wo1f.jpg');
  releases[index++] = new MusicRelease('arduino_algo.jpg');
  releases[index++] = new MusicRelease('arduino_dino.jpg');
  releases[index++] = new MusicRelease('dmca_2ndvar13ty.jpg');
  releases[index++] = new MusicRelease('new_desk.jpg');
}

class MusicRelease {
  constructor(image) {
    this.coverImage = loadImage(image);
    this.workingImage = this.coverImage;

  }
  draw(x, y) {
    imageMode(CENTER);
    this.workingImage.resize(350, 0);
    image(this.workingImage, x, y);
  }
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
}



function saveImage() {
  var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  save(timestamp+".png");
}

function generate() {
  background(0);
  noStroke();
  let divs = releases.length;
  divs = 6;
  let ratios = [0.17, 0.66, 1.5, 6] //x on y
  let screenRatio = width/height;
  let closestIndex = 0;
  let closestVal = 100.0;
  for (let i = 0; i < ratios.length; i++){
    if (abs(screenRatio - ratios[i]) < closestVal){
      closestVal = abs(screenRatio - ratios[i]);
      closestIndex = i;
    }
  }
  let cols = closestIndex + 1;
  console.log(cols);
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  smooth(8);
  pixelDensity(2);
  background(0);
  generate();
  noStroke();
  console.log('hi');
  generate();
}

function mouseClicked() {
}

function draw() {
  //generate();
}

window.onresize = function() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas = createCanvas(window.innerWidth, window.innerHeight);
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
