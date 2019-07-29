var colors = ['#0f0', '#ff0', '#0ff', '#f0f'];
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
  if (key == 's') {
    saveImage();
  } else {
    generate();
  }
}

function saveImage() {
  var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  save(timestamp+".png");
}

function generate() {
  background(0);
  noStroke();
  //flower(width/4, height/2);
  flower(width/2, height/3);
  //flower(3*width/4, height/2);


}

function flower(x, y) {
  var radius = int(random(80, 400));
  var centerbit = random(0.2, 0.8);

  //leafs
  for (var i = 0; i < random(5); i++) {

    ellipseMode(CORNER);
    var angle = randint(-30);
    var tip = int(random(radius/5, radius/3));
    var leafw = random(0.3, 0.5);
    var leafy = int(random((y + radius/2), height - radius));
    //right
    if (coin()) {
      push();
      translate(x, leafy);
      rotate(radians(angle));
      fill('#0f0');
      ellipse(0, 0, tip, leafw*tip);
      fill('#0f7');
      ellipse(0, 0, tip, leafw*tip*centerbit);
      pop();
    }

    if (coin()) {
      //left
      angle = randint(30) + 180;
      tip = tip = int(random(radius/5, radius/3));
      leafy = int(random((y + radius/2), height - radius));
      leafw = random(0.3, 0.5);
      push();
      translate(x, leafy);
      rotate(radians(angle));
      fill('#0f0');
      ellipse(0, 0, tip, leafw*tip);
      fill(255, 255, 255, 40);
      ellipse(0, 0, tip, leafw*tip*centerbit);
      pop();
    }
  }

  // the stem
  var stemwidth = int(random(4, 10));
  fill('#0f0');
  rect(x, y, stemwidth, height);

  // petals
  ellipseMode(CENTER);
  var petalCount = int(random(4, 20));
  var petalAngle = 180/petalCount;
  var colorcount = int(random(1, 4));
  var thisFlower = [rcol(), rcol(), rcol(), rcol(), rcol()];
  for (var i = 180; i >= 0; i-=petalAngle) {
    fill(rcolsub(thisFlower, colorcount));
    push();
    translate(x, y);
    rotate(radians(i));
    ellipse(0, 0, radius, radius/petalCount);
    ellipse(0, 0, radius/petalCount, radius);
    fill(255, 255, 255, 40);
    ellipse(0, 0, radius, centerbit*(radius/petalCount));
    ellipse(0, 0, centerbit*(radius/petalCount), radius);
    pop();
  }
  // the pollen bit
  var pollen = int(random(1.2*radius/petalCount, radius/2));
  fill(rcol());
  ellipse(x, y, pollen, pollen);
  fill(255, 255, 255, 40);
  var pollenCount = int(random(5, 40));
  var px;
  var py;
  for (var i = 0; i < pollenCount; i++) {
    px = random(x - pollen/3, x + pollen/3);
    py = random(y - pollen/3, y + pollen/3);
    //if ((sqrt(px-x)*(px-x) + (py-y)*(py-y)) < pollen) {
      ellipse(px, py, 5, 5);
    //}
  }
}

var canvas;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  smooth(8);
  pixelDensity(2);
  background(0);
  generate();
  noStroke();
  console.log('hi');
}

function mouseClicked() {
  // flower(mouseX, mouseY);
 // invader(mouseX, mouseY, 10, 6.0, 8.0);
}

function draw() {
  //generate();
}

window.onresize = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  console.log(w, ' ', h)
  canvas.size(w,h);
  width = w;
  height = h;
  generate();
};
function touchStarted(){
  flower(mouseX, mouseY);
  // generate();
  // return false;
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
