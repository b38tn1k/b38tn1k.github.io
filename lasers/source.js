var widthOnTwo, heightOnTwo;
var graph, graphX, graphY;
var plan, planX, planY;
var world, worldX, worldY;
var origin, originX, originY;
var target;
var bg;

class LIDAR {
  constructor(x, y) {
    this.x = int(x);
    this.y = int(y);
    this.dx = 0;
    this.dy = 0;
    this.alpha = 0;
    this.alphaIncrement = PI / 5.234334235;
    this.scansPerFrame = 1;
    this.locomotionSpeed = 2;
    this.radius = 10;
    this.scanRange = 100;
    this.target = [int(x), int(y)];
    this.pathfinding = true;
    this.path = [];
    this.free = [];
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

  scan(world, graph, draw=true) {
    let occ = [];
    let free = [];
    for (let i = 0; i < this.scansPerFrame; i++) {
      this.alpha += this.alphaIncrement;
      let xInc = sin(this.alpha);
      let yInc = cos(this.alpha);
      let x = this.x;
      let y = this.y;
      let c;
      stroke(0, 255, 0);
      for (let i = 0; i < this.scanRange; i++) {
        c = world.get(int(x), int(y));
        if (draw) {
          point(x, y);
        }
        if (c[0] != 0) {
          occ.push([int(x), int(y)]);
          let xx = x;
          let yy = y;
          for (let t = 0; t < max(world.width, world.height); t++) {
            if (graph.get(xx, yy)[1] == 50) {
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
    }
    this.updateAndDrawGraph(graph, occ, free);
  }

  updateAndDrawGraph(graph, oc, fre) {
    let occ = [];
    let free = [];
    let cen = this.radius/2;
    for (let i = 0; i < fre.length; i++) {
      free.push([int(fre[i][0]/this.radius) * this.radius, int(fre[i][1]/this.radius) * this.radius]);
    }
    free = setifyArrOfArr(free, free.length);
    for (let i = 0; i < oc.length; i++) {
      occ.push([int(oc[i][0]/this.radius) * this.radius, int(oc[i][1]/this.radius) * this.radius]);
    }
    this.free.push(...free)
    this.free = setifyArrOfArr(this.free, this.free.length);
    occ = setifyArrOfArr(occ, occ.length);
    for (let i = 0; i < free.length; i++) {
      if (graph.get(free[i][0], free[i][1])[1] == 255) {
        graph.fill(0, 255, 0);
        graph.square(free[i][0], free[i][1], this.radius);
      } else {
        graph.fill(0, 255, 0);
        graph.square(free[i][0], free[i][1], this.radius);
        graph.fill(0, 255, 200);
        graph.square(free[i][0], free[i][1], cen);
      }
    }
    for (let i = 0; i < occ.length; i++) {
      graph.fill(255, 0, 0);
      graph.square(occ[i][0], occ[i][1], this.radius);
      let xInc = sin(this.alpha) * this.radius;
      let yInc = cos(this.alpha) * this.radius;
    }
  }

  update(world, graph) {
    this.keepOnScreen();
    this.checkInputsAndDrive(world);
    this.scan(world, graph);
    if (this.pathfinding) {
      this.goToTarget();
    }
  }

  draw(x = 0, y = 0) {
    let rx = this.x + x;
    let ry = this.y + y;
    stroke(0);
    fill(100);
    square(rx - this.radius, ry - this.radius, this.radius * 2);
    fill(100, 255, 40);
    circle(rx, ry, this.radius);
    if (this.pathfinding) {
      plan.image(target, this.target[0], this.target[1]);
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

    plan.line(this.x, this.y, this.target[0], this.target[1]);


    // basic
    let r02 = 0;
    let deltaX = (this.target[0] - this.x);
    let deltaY = (this.target[1] - this.y);
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
  world.background(0);
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
  bg = createGraphics(windowWidth, windowHeight);
  bg.background(0);
  bg.noStroke();
  bg.fill(50);
  if (ratio >= 1) {
    world = createGraphics(widthOnTwo, height);
    worldX = 0;
    worldY = 0;
    graph = createGraphics(widthOnTwo, height);
    plan = createGraphics(widthOnTwo, height);
    graphX = widthOnTwo;
    graphY = 0;
    bg.rect(0, 0, widthOnTwo, height);
  } else {
    world = createGraphics(width, heightOnTwo);
    worldX = 0;
    worldY = 0;
    graph = createGraphics(width, heightOnTwo);
    plan = createGraphics(width, heightOnTwo);
    graphX = 0;
    graphY = heightOnTwo;
    bg.rect(0, 0, width, heightOnTwo);
  }
  world.pixelDensity(1);
  origin = createGraphics(60, 60);
  origin.stroke(0, 0, 255);
  origin.strokeWeight(5);
  origin.line(30, 0, 30, 60);
  origin.line(0, 30, 60, 30);
  originX = graphX + graph.width/2 -  30;
  originY = graphY + graph.height/2 - 30;
  target = createGraphics(60, 60);
  target.stroke(255, 0, 255);
  target.strokeWeight(5);
  target.line(30, 0, 30, 60);
  target.line(0, 30, 60, 30);
  graph.noStroke();
  graph.background(50);
  graph.rectMode(CENTER);
  plan.imageMode(CENTER);
  plan.stroke(255, 0, 255);
  plan.strokeWeight(5);
  createWorld();
  myLidar = new LIDAR(world.width/2, world.height/2);
}

function setup() {
  frameRate(15);
  pixelDensity(1);
  setupScreen();
}

function draw() {
  background(50);
  image(graph, graphX - myLidar.dx, graphY - myLidar.dy);
  image(plan, graphX - myLidar.dx, graphY - myLidar.dy);
  plan.clear();
  image(world, worldX, worldY)
  image(origin, originX, originY);
  myLidar.draw();
  myLidar.update(world, graph);
}
