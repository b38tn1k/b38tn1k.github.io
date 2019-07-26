var colors = ['#0f0', '#ff0', '#0ff', '#f0f'];
function rcol() {
  return colors[(int(random(colors.length)))];
  return('#0f0');
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

function saveImage() {
  var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  save(timestamp+".png");
}

function generate() {
  background(0);
  noStroke();
  var vert = int(height/150);
  var hor = int(width / 150);

  for (var j = 0; j < vert; j++) {
    for (var i = 0; i < 25; i++) {
      fill(rcol());
      invader(i*(width/hor) + width/(2*hor), j*(height/vert) + height/(2*vert), 10, random(5.0, 7.0), 8.0);
    }
  }
}

function invader(x, y, pixelSize, invLength, invHeight) {
  invLength = float(int(invLength));
  invHeight = float(int(invHeight));
  //crab 8 x 11
  //squid 8 x 8
  //octopus 8 x 12
  //float invLength = 4.0; // use these to calculate translation later
  //float invLength = 6.0; // use these to calculate translation later
  //float invHeight = 8.0;
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
      //print(nf(grid[i][j], 1, 2));
      //print(" ");
    }
    //print("\n");
  }
  var average = sum/count;
  var threshhold = average;
  var xpos = 0;
  var ypos = 0;
  push();
  translate(x - pixelSize*int(invLength), y - pixelSize*int(invHeight/2));
  //translate(x, y);
  //translate etc
  for (var i = 0; i < invLength; i++) {
    for (var j = 0; j < invHeight; j++) {
      if (grid[i][j] > threshhold) {
        rect(xpos, ypos, pixelSize, pixelSize);
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
        rect(xpos, ypos, pixelSize, pixelSize);
      }
      ypos += pixelSize;
    }
    ypos = 0;
    xpos += pixelSize;
  }
  pop();
}

var canvas;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  smooth(8);
  pixelDensity(2);
  background(0);
  generate();
  noStroke();
}

function mouseClicked() {
 invader(mouseX, mouseY, 10, 6.0, 8.0);
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
