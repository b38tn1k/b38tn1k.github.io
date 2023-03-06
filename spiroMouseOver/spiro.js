var colors = ['#0f0', '#ff0', '#0ff', '#f0f'];
function rcol() {
  return colors[(int(random(colors.length)))];
};

function rcolsub(colors,len) {
  return colors[(random(len))];
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

function compass(xf, yf, radius, angle) {
  var x = xf + (radius * sin(angle));
  var y = yf + (radius * cos(angle));
  var forReturn = [x, y];
  return forReturn;
}

function saveImage() {
  var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  save(timestamp+".png");
}


function generate() {
  clear();
  var mybg = rcol();
  background(mybg);
  var c1 = rcol();
  var c2 = rcol();
  while (c1 == mybg) {
    c1 = rcol();
  }
  while (c2 == c1) {
    c2 = rcol();
  }
  for (var i = 0; i < 1; i++) {
    spiro(min(window.innerWidth, window.innerHeight), min(window.innerWidth, window.innerHeight), c1, c2);
  }
}

function spiro(r1, r2, c1, c2) {

  push();
  translate(width/2, height/2);
  var thickness = 1;
  var rad1 = random(r1);
  var rad2 = random(r2);
  var twopi = 2*PI;
  var per = randint(10);
  noStroke();
  //int c1 = rcol();
  //int c2 = rcol();
  //float normRad = sqrt(width*width + height*height);
  var normRad = rad1 + rad2;
  var j = 0;
  for (var i = 0; i < twopi; i+=0.0001) {
      normRad = rad1 + rad2;
      j+= random(0.001, 0.008);
      var coords1 = compass(0, 0, rad1 + rad2*sin(per*i), i);
      var coords2 = compass(coords1[0], coords1[1], rad2, j);
      var dist = sqrt(coords2[0]*coords2[0] + coords2[1]*coords2[1]);
      var lerper = (dist/normRad);
      thickness = lerp(-10, 10, lerper);
      fill(lerpColor(color(c1), color(c2), lerper*0.5));
      ellipse(coords2[0], coords2[1], thickness, thickness);
    }
  pop();
}

function spirally() {
  var count1 = 4;
  var count2 = 500;
  noStroke();
  while (count2 >=100) {
    var c1 = rcol();
    var c2 = rcol();
    var twopi = 2*PI;
    for (var k = 0; k < twopi; k+= PI/count1) {
      println(k);
      push();
      translate(width/2, height/2);
      rotate(k);


      var orad = count2;
      var rad = orad;
      var erad = 5;

      for (var i = 0; i < twopi; i+=(PI/rad)) {
        fill (lerpColor(color(c1), color(c2), (rad/orad)));
        var coords = compass(0, 0, rad, i);
        ellipse(coords[0], coords[1], erad, erad);
        rad --;
        erad += 0.1;
      }
      pop();
    }
    count1*=1.2;
    count2-=50;
  }
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  smooth(8);
  pixelDensity(2);
  background(0);
  generate();
  noStroke();
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

// window.onresize = function() {
//   var w = window.innerWidth;
//   var h = window.innerHeight;
//   console.log(w, ' ', h)
//   canvas.size(w,h);
//   width = w;
//   height = h;
//   generate();
// };

function touchStarted(){
  generate();
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
