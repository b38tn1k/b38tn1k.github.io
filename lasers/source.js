var widthOnTwo, heightOnTwo;
var graph, graphX, graphY, graphW, graphH, graphW2, graphH2;
var plan, planX, planY;
var world, worldX, worldY;
var origin, originX, originY;
var target;

class LIDAR {
  constructor(x, y) {
    this.x = int(x);
    this.y = int(y);
    this.dx = 0;
    this.dy = 0;
    this.alpha = 0;
    this.alphaIncrement = PI / 3.234334235;
    this.alphaIncSlider = createSlider(0, PI, PI / 3.234334235, 0.1);
    this.alphaIncSlider.position(graphX + 5, graphY + 30);
    this.alphaIncSlider.style('width', '100px');
    this.scansPerFrame = 2;
    this.spfSlider = createSlider(0, 10, 1, 1);
    this.spfSlider.position(graphX + 5, graphY + 50);
    this.spfSlider.style('width', '100px');
    this.locomotionSpeed = 2;
    this.radius = 10;
    this.scanRanSlider = createSlider(2, 100, 9, 1);
    this.scanRanSlider.position(graphX + 5, graphY + 10);
    this.scanRanSlider.style('width', '100px');
    this.scanRange = 9;
    this.target = [int(x), int(y)];
    this.pathfinding = true;
    this.path = [];
    this.free = [];
    this.occ = [];
    this.lidarLines = [];
  }

  keepOnScreen(){
    if (this.x > world.width) {
      this.x = world.width;
      this.dx -= 1;
    } else if (this.x < 0) {
      this.x = 0;
      this.dx += 1;
    }
    if (this.y > world.height) {
      this.y = world.height;
      this.dy -= 1;
    } else if (this.y < 0) {
      this.y = 0;
      this.dy += 1;
    }
  }

  goDown() {
    if (world.get(this.x, this.y + this.locomotionSpeed + this.radius)[0] == 0) {
      this.y += this.locomotionSpeed;
      this.dy += this.locomotionSpeed;
    }
  }

  goLeft() {
    if (world.get(this.x - this.locomotionSpeed - this.radius, this.y)[0] == 0) {
      this.x -= this.locomotionSpeed;
      this.dx -= this.locomotionSpeed;
    }
  }

  goUp() {
    if (world.get(this.x, this.y - this.locomotionSpeed - this.radius)[0] == 0) {
      this.y -= this.locomotionSpeed;
      this.dy -= this.locomotionSpeed;
    }
  }

  goRight() {
    if (world.get(this.x + this.locomotionSpeed + this.radius, this.y)[0] == 0) {
      this.x += this.locomotionSpeed;
      this.dx += this.locomotionSpeed;
    }
  }

  checkInputsAndDrive(world) {
    if (keyIsDown(DOWN_ARROW)){
      this.goDown();
      this.pathfinding = false;
    }
    if (keyIsDown(LEFT_ARROW)){
      this.goLeft();
      this.pathfinding = false;
    }
    if (keyIsDown(UP_ARROW)){
      this.goUp();
      this.pathfinding = false;
    }
    if (keyIsDown(RIGHT_ARROW)){
      this.goRight();
      this.pathfinding = false;
    }
  }

  clear() {
    this.alphaIncSlider.remove();
    this.scanRanSlider.remove();
    this.spfSlider.remove();
  }

  scan(world, graph) {
    this.alphaIncrement = this.alphaIncSlider.value();
    this.scanRange = this.scanRanSlider.value();
    this.scansPerFrame = this.spfSlider.value();
    let occ = [];
    let free = [];
    this.alpha += this.alphaIncrement;
    for (let i = 0; i < this.scansPerFrame; i++) {
      this.alpha += TWO_PI / this.scansPerFrame;
      let xInc = sin(this.alpha) * this.radius;
      let yInc = cos(this.alpha) * this.radius;
      let x = this.x;
      let y = this.y;
      let c;
      for (let i = 0; i < this.scanRange; i++) {
        c = world.get(int(x), int(y)); // IRL lidar would give a range, have to convert polar to cart using r and theta. doing it here just slows down FPS. assume perfect GPS :-P
        if (c[0] != 0) {
          occ.push([int(x), int(y)]);
          let xx = x;
          let yy = y;
          for (let t = 0; t < max(world.width, world.height); t++) {
            if ((graph.get(xx, yy)[1] == 50) || (graph.get(xx, yy)[0] == 255)) {
              occ.push([int(xx), int(yy)]);
              xx += xInc;
              yy += yInc;
            }
          }
          break;
        } else {
          if (x > 0 && x < world.width && y > 0 && y < world.height) {
            free.push([int(x), int(y)]);
          }
        }
        x += xInc;
        y += yInc;
      }
      this.lidarLines.push([this.x, this.y, x, y])
    }
    return [occ, free];
  }

  updateGraph(graph, occ, free) {
    for (let i = 0; i < free.length; i++) {
      this.free.push([int(free[i][0]/this.radius) * this.radius, int(free[i][1]/this.radius) * this.radius]);
    }
    for (let i = 0; i < occ.length; i++) {
      this.occ.push([int(occ[i][0]/this.radius) * this.radius, int(occ[i][1]/this.radius) * this.radius]);
    }
    this.occ = setifyArrOfArr(this.occ, this.occ.length);
    this.free = setifyArrOfArr(this.free, this.free.length);
    let toRemove = [];
    for (let i = 0; i < this.occ.length; i++) {
      for (let j = 0; j < this.free.length; j++) {
        if ((this.free[j][0] == this.occ[i][0]) && (this.free[j][1] == this.occ[i][1])){
          toRemove.push(i);
        }
      }
    }
    for (let i = 0; i < toRemove.length; i++) {
      this.occ = this.occ.slice(i);
    }

  }

  update(world, graph) {
    this.keepOnScreen();
    this.checkInputsAndDrive(world);
    let res = this.scan(world, graph);
    this.updateGraph(graph, res[0], res[1]);
    if (this.pathfinding) {
      this.goToTarget();
    }

  }

  draw(x = 0, y = 0) {
    let rx = this.x + x;
    let ry = this.y + y;
    stroke(0, 255, 0);
    for (let i = 0; i < this.lidarLines.length; i++) {
      line(this.lidarLines[i][0], this.lidarLines[i][1], this.lidarLines[i][2], this.lidarLines[i][3])
    }
    this.lidarLines = [];
    stroke(0);
    fill(100);
    square(rx - this.radius, ry - this.radius, this.radius * 2);
    fill(100, 255, 40);
    circle(rx, ry, this.radius);
    if (this.pathfinding) {
      plan.image(target, this.target[0], this.target[1]);
    }
    let cen = this.radius/2;
    for (let i = 0; i < this.free.length; i++) {
      if (graph.get(this.free[i][0], this.free[i][1])[1] == 255) {
        graph.fill(0, 255, 0);
        graph.square(this.free[i][0], this.free[i][1], this.radius);
      } else {
        graph.fill(0, 255, 0);
        graph.square(this.free[i][0], this.free[i][1], this.radius);
        graph.fill(0, 255, 200);
        graph.square(this.free[i][0], this.free[i][1], cen);
      }
    }
    for (let i = 0; i < this.occ.length; i++) {
      graph.fill(255, 0, 0);
      graph.square(this.occ[i][0], this.occ[i][1], this.radius);
    }
  }

  goToTarget() {
    if (this.x == this.target[0] && this.y == this.target[1]) {
      this.pathfinding = false;
      return;
    }
    // has the target location been seen before?
    // let c = graph.get(this.target[0], this.target[1]);
    // let seen = (c[0] > 50);
    let deltaX = (this.target[0] - this.x);
    let deltaY = (this.target[1] - this.y);
    plan.line(this.x, this.y, this.target[0], this.target[1]);


    // basic
    let r02 = 0;

    if (deltaX > r02) {
      this.goRight();
    }
    if (deltaX < -r02) {
      this.goLeft();
    }
    if (deltaY > r02) {
      this.goDown();
    }
    if (deltaY < -r02) {
      this.goUp();
    }

    plan.line(this.x, this.y, this.target[0], this.target[1]);
  }

  setTarget(x, y) {
    this.pathfinding = true;
    this.target = [x, y];
  }
}

function setifyArrOfArr(arr, len) {
  if (len > 0) {
    let tempSSet = new Set();
    for (let i = 0; i < len; i++) {
      tempSSet.add(JSON.stringify(arr[i]));
    }
    let cleaned = Array.from(tempSSet);
    arr = [];
    for (let i = 0; i < cleaned.length; i++) {
      arr.push(JSON.parse(cleaned[i]))
    }
  }
  return arr;
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
  if ((graphY == 0 && mouseX < graphX) || (graphY > 0 && mouseY < graphY)) {
    let tx = int(mouseX/myLidar.radius) * myLidar.radius
    let ty = int(mouseY/myLidar.radius) * myLidar.radius
    myLidar.setTarget(tx, ty);
    targetX = tx + graphX;
    targetY = ty + graphY;
  }
}

function inrange(x, y, tx, ty, r){
  return ((x - tx) ** 2 + (y - ty) ** 2 < r**2);
}

function createWorld() {
  // world.background(0);
  let r = 0.01;
  let wh2 = world.height/2;
  let ww2 = world.width/2;
  let rad = max(wh2, ww2) * 0.2;
  for (var j = 0; j < world.height; j++) {
    for (var i = 0; i < world.width; i++) {
      let value = noise(r*i, r*j);
      if (inrange(i, j, ww2, wh2, rad)) {
        value -= 0.3;
      }
      if (value > 0.6) {
        world.set(i, j, 255);
      }
    }
  }
  world.updatePixels();
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  widthOnTwo = floor(windowWidth / 2);
  heightOnTwo = floor(windowHeight / 2);
  let ratio = width / height;
  if (ratio >= 1) {
    world = createGraphics(widthOnTwo, height);
    worldX = 0;
    worldY = 0;
    graph = createGraphics(widthOnTwo, height);
    plan = createGraphics(widthOnTwo, height);
    graphX = widthOnTwo;
    graphY = 0;
  } else {
    world = createGraphics(width, heightOnTwo);
    worldX = 0;
    worldY = 0;
    graph = createGraphics(width, heightOnTwo);
    plan = createGraphics(width, heightOnTwo);
    graphX = 0;
    graphY = heightOnTwo;
  }
  graphW = graph.width/2;
  graphH = graph.height/2;
  graphW2 = graph.width/4;
  graphH2 = graph.height/4;
  world.pixelDensity(1);
  origin = createGraphics(60, 60);
  origin.stroke(0, 0, 255);
  origin.strokeWeight(4);
  origin.line(30, 0, 30, 60);
  origin.line(0, 30, 60, 30);
  target = createGraphics(60, 60);
  target.stroke(255, 0, 255);
  target.strokeWeight(4);
  target.line(30, 0, 30, 60);
  target.line(0, 30, 60, 30);
  graph.noStroke();
  graph.background(50);
  graph.rectMode(CENTER);
  plan.imageMode(CENTER);
  plan.stroke(255, 0, 255);
  plan.strokeWeight(5);
  createWorld();
  myLidar.clear();
  myLidar = new LIDAR(world.width/2, world.height/2);
}

function setup() {
  frameRate(15);
  pixelDensity(1);
  myLidar = new LIDAR(100, 100);
  setupScreen();
  textAlign(LEFT, CENTER);
}

function draw() {
  background(50);
  fill(0);
  rect(worldX, worldY, world.width, world.height);
  myLidar.update(world, graph);
  myLidar.draw();
  let x = graphX - myLidar.dx/2 + graphW2;
  let y = graphY - myLidar.dy/2 + graphH2
  image(graph, x, y, graphW, graphH);
  plan.image(origin, myLidar.x, myLidar.y);
  image(plan, x, y, graphW, graphH);
  plan.clear();
  image(world, worldX, worldY);
  text('RANGE', graphX + 110, graphY + 10 + textSize());
  text('RATE', graphX + 110, graphY + 30+ textSize());
  text('# LASER', graphX + 110, graphY + 50+ textSize());
  text('EXTREME VALUES WILL KILL FPS: ' + frameRate().toFixed(2), graphX + 5, graphY + 80+ textSize());
}
