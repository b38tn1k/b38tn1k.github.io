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
    this.theta = 0;
    this.thetaDFrame = PI / 3.234334235;
    this.laserCount = 2;
    this.robotSpeed = 2;
    this.robotRadius = 10;
    this.scanRange = 9;
    this.pathTarget = [int(x), int(y)];
    this.navigating = true;
    this.path = [];
    this.free = [];
    this.occ = [];
    this.scaleArray = [];
    // graphics
    this.lidarLines = [];
    this.thetaDSlider = createSlider(0, PI, PI / 3.234334235, 0.1);
    this.thetaDSlider.position(graphX + 5, graphY + 30);
    this.thetaDSlider.style('width', '100px');
    this.laserCSlider = createSlider(0, 10, 1, 1);
    this.laserCSlider.position(graphX + 5, graphY + 50);
    this.laserCSlider.style('width', '100px');
    this.scanRanSlider = createSlider(2, 100, 9, 1);
    this.scanRanSlider.position(graphX + 5, graphY + 10);
    this.scanRanSlider.style('width', '100px');
  }

  goToTarget() {
    if ((this.x == this.pathTarget[0] && this.y == this.pathTarget[1]) || this.path.length == 0) {
      this.navigating = false;
      return;
    }
    // has the target location been seen before?
    // let c = graph.get(this.pathTarget[0], this.pathTarget[1]);
    // let seen = (c[0] > 50);
    let next = this.path.pop();
    if (world.get(next[0], next[1])[0] == 0) {
      this.x = next[0];
      this.y = next[1];
      this.dx -= next[2];
      this.dy -= next[3];

    }
  }

  setTarget(x, y) {
    x = this.scaleToGraph(x);
    y = this.scaleToGraph(y);
    this.navigating = true;
    this.pathTarget = [x, y];
    this.path = [];
    let deltaX = (x - this.x);
    let deltaY = (y - this.y);
    let hypot = this.scaleToGraph(sqrt(deltaX ** 2 + deltaY ** 2));
    let angle = 0;
    if (deltaX != 0) {
      angle = atan(deltaY / deltaX);
    }
    let initialPathLength = hypot / this.robotSpeed;
    let vx, vy;
    let cangle = cos(angle);
    let sangle = sin(angle);
    for (let i = 0; i < initialPathLength; i++) {
      if (x <= this.x) {
        vx = this.robotSpeed * cangle;
        vy = this.robotSpeed * sangle;
      } else {
        vx = -1 * this.robotSpeed * cangle;
        vy = -1 * this.robotSpeed * sangle;
      }
      this.path.push([parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2)), parseFloat(vx.toFixed(2)), parseFloat(vy.toFixed(2))]);
      x += vx;
      y += vy;
    }
    this.path.push([this.x, this.y, 0, 0]);
    this.path = setifyArrOfArr(this.path);
  }

  scan(world, graph) {
    this.thetaDFrame = this.thetaDSlider.value();
    this.scanRange = this.scanRanSlider.value();
    this.laserCount = this.laserCSlider.value();
    let occ = [];
    let free = [];
    let x, y, xInc, yInc, c;
    this.theta += this.thetaDFrame;
    let laserArrangement = TWO_PI / this.laserCount;
    for (let i = 0; i < this.laserCount; i++) {
      this.theta += laserArrangement;
      xInc = sin(this.theta) * this.robotRadius;
      yInc = cos(this.theta) * this.robotRadius;
      x = this.x;
      y = this.y;
      for (let i = 0; i < this.scanRange; i++) {
        // IRL lidar would give a range and theta,
        // I would have to convert polar to cart using r and theta
        // and then convert from robot coord to global coord, shifting map to fit new areas
        // In this case, the global cartesian coords are how I access the world map already
        // converting them to local polar only to convert back to globa cart will just impact FPS
        c = world.get(int(x), int(y));
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
      this.free.push([this.scaleToGraph(free[i][0]), this.scaleToGraph(free[i][1])]);
    }
    for (let i = 0; i < occ.length; i++) {
      this.occ.push([this.scaleToGraph(occ[i][0]), this.scaleToGraph(occ[i][1])]);
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
    if (this.navigating) {
      this.goToTarget();
    }
    this.checkInputsAndDrive(world);
    let res = this.scan(world, graph);
    this.updateGraph(graph, res[0], res[1]);
  }

  draw(x = 0, y = 0) {
    plan.clear();
    let rx = this.x + x;
    let ry = this.y + y;
    stroke(0, 255, 0);
    for (let i = 0; i < this.lidarLines.length; i++) {
      line(this.lidarLines[i][0], this.lidarLines[i][1], this.lidarLines[i][2], this.lidarLines[i][3])
    }
    this.lidarLines = [];
    stroke(0);
    fill(100);
    square(rx - this.robotRadius, ry - this.robotRadius, this.robotRadius * 2);
    fill(100, 255, 40);
    circle(rx, ry, this.robotRadius);

    let cen = this.robotRadius >> 1;
    for (let i = 0; i < this.free.length; i++) {
      if (graph.get(this.free[i][0], this.free[i][1])[1] == 255) {
        graph.fill(0, 255, 0);
        graph.square(this.free[i][0], this.free[i][1], this.robotRadius);
      } else {
        graph.fill(0, 255, 0);
        graph.square(this.free[i][0], this.free[i][1], this.robotRadius);
        graph.fill(0, 255, 200);
        graph.square(this.free[i][0], this.free[i][1], cen);
      }
    }
    for (let i = 0; i < this.occ.length; i++) {
      graph.fill(255, 0, 0);
      graph.square(this.occ[i][0], this.occ[i][1], this.robotRadius);
    }
    if (this.navigating) {
      plan.image(target, this.pathTarget[0], this.pathTarget[1]);
      for (let i = 0; i < this.path.length; i++) {
        plan.stroke(0, 255, 255);
        if (i % 2 == 0) {
          plan.stroke(255, 0, 255);
        }
        plan.point(this.path[i][0], this.path[i][1]);
      }
    }
    plan.image(origin, myLidar.x, myLidar.y);
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
    if (world.get(this.x, this.y + this.robotSpeed + this.robotRadius)[0] == 0) {
      this.y += this.robotSpeed;
      this.dy += this.robotSpeed;
    }
  }

  goLeft() {
    if (world.get(this.x - this.robotSpeed - this.robotRadius, this.y)[0] == 0) {
      this.x -= this.robotSpeed;
      this.dx -= this.robotSpeed;
    }
  }

  goUp() {
    if (world.get(this.x, this.y - this.robotSpeed - this.robotRadius)[0] == 0) {
      this.y -= this.robotSpeed;
      this.dy -= this.robotSpeed;
    }
  }

  goRight() {
    if (world.get(this.x + this.robotSpeed + this.robotRadius, this.y)[0] == 0) {
      this.x += this.robotSpeed;
      this.dx += this.robotSpeed;
    }
  }

  scaleToGraph(val) {
    if (this.scaleArray.length == 0) {
      let x = max(windowWidth, windowHeight);
      for (let i = 0; i < x; i++) {
        this.scaleArray.push((int(i/this.robotRadius) * this.robotRadius))
      }
    }
    return (this.scaleArray[int(val)]);
  }

  checkInputsAndDrive(world) {
    if (keyIsDown(DOWN_ARROW)){
      this.goDown();
      this.navigating = false;
    }
    if (keyIsDown(LEFT_ARROW)){
      this.goLeft();
      this.navigating = false;
    }
    if (keyIsDown(UP_ARROW)){
      this.goUp();
      this.navigating = false;
    }
    if (keyIsDown(RIGHT_ARROW)){
      this.goRight();
      this.navigating = false;
    }
  }

  clear() {
    this.thetaDSlider.remove();
    this.scanRanSlider.remove();
    this.laserCSlider.remove();
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
    myLidar.setTarget(mouseX, mouseY);
  }
}

function inrange(x, y, tx, ty, r){
  return ((x - tx) ** 2 + (y - ty) ** 2 < r**2);
}

function createWorld() {
  // world.background(0);
  let r = 0.01;
  let wh2 = world.height >> 1;
  let ww2 = world.width >> 1;
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
  widthOnTwo = windowWidth >> 1;
  heightOnTwo = windowHeight >> 1;
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
  graphW = graph.width >> 1;
  graphH = graph.height >> 1;
  graphW2 = graph.width >> 2;
  graphH2 = graph.height >> 2;
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
  noStroke();
}

function setup() {
  frameRate(15);
  pixelDensity(1);
  myLidar = new LIDAR(100, 100);
  setupScreen();
  textAlign(LEFT, CENTER);
}

function draw() {
  // background(50);
  fill(0);
  rect(worldX, worldY, world.width, world.height);
  myLidar.update(world, graph);
  myLidar.draw();
  fill(50);
  rect(graphX, graphY, world.width, world.height);
  let x = graphX - (int(myLidar.dx) >> 1) + graphW2;
  let y = graphY - (int(myLidar.dy) >> 1) + graphH2
  image(graph, x, y, graphW, graphH);
  image(plan, x, y, graphW, graphH);
  image(world, worldX, worldY);
  fill(255);
  text('RANGE', graphX + 110, graphY + 10 + textSize());
  text('RATE', graphX + 110, graphY + 30+ textSize());
  text('# LASER', graphX + 110, graphY + 50+ textSize());
  text('EXTREME VALUES WILL KILL FPS: ' + frameRate().toFixed(2), graphX + 5, graphY + 80+ textSize());
}
