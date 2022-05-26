var starfield, starX, starY;
var mySat, buttonColors, buttonLookup;
var menuBar, widthOnTwo, heightOnTwo, menuHeight;
var testing = true;

//  1________1
// 4|        |2
//  |        |
// 4|________|2
//   3       3

//  1________2
// 8|        |3
//  |        |
// 7|________|4
//   6       5

class RCSSat {

  constructor(x, y, a, wh, mb) {
    // properties
    this.x = x;
    this.y = y;
    this.a = a;
    this.vx = 0;
    this.vy = 0;
    this.vn = 0; // heading, vh to confusable with vn
    this.vf = 0;
    this.va = 0;
    this.dims = wh;
    this.d = sqrt(wh*wh + wh*wh);
    this.mass = 100;
    this.massUnits = 100;
    this.emptyMass = 20;
    this.prop = {}
    this.prop.active = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.prop.coords = [];
    this.prop.cartesianDirection = [];
    this.prop.angularDirection = [];
    this.prop.duration = 20; // frames
    this.prop.fuelDecrement = 1/(this.prop.duration);
    this.prop.force = 5; // random value that makes sat move enough to be interesting
    // graphics
    this.setupGraphics(mb);
  }

  stop() {
    // P = m * v = F * t
    // t = (m * v) / F
    let controlEfforts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let vfControlEffort = (this.vf * this.mass) / (this.prop.force);
    // Using the two booster things that will oppose motion
    // and spliting control effort between them
    // they output the same force, time is abs, pos
    vfControlEffort = round(vfControlEffort)/2;
    vfControlEffort = int(abs(vfControlEffort));
    if (this.vf < 0) {
      controlEfforts[1] += vfControlEffort;
      controlEfforts[2] += vfControlEffort;
    } else {
      controlEfforts[5] += vfControlEffort;
      controlEfforts[6] += vfControlEffort;
    }
    let vnControlEffort = (this.vn * this.mass) / (this.prop.force);
    vnControlEffort = round(vnControlEffort)/2;
    vnControlEffort = int(abs(vnControlEffort));
    if (this.vn > 0) {
      controlEfforts[3] += vnControlEffort;
      controlEfforts[4] += vnControlEffort;
    } else {
      controlEfforts[8] += vnControlEffort;
      controlEfforts[7] += vnControlEffort;
    }
    let vaControlEffort = (this.va * this.mass * this.d) / this.prop.force;
    vaControlEffort = round(vaControlEffort)/2;
    vaControlEffort = int(abs(vaControlEffort));
    if (this.va > 0) {
      controlEfforts[1] += vaControlEffort;
      controlEfforts[5] += vaControlEffort;
    } else {
      controlEfforts[2] += vaControlEffort;
      controlEfforts[6] += vaControlEffort;
    }
    // set thrusters to STOP :-P
    for (let i = 0; i < controlEfforts.length; i++) {
      this.prop.active[i] = controlEfforts[i];
    }
  }

  setupGraphics(mb){
    this.graphics = {};
    this.graphics.showBreadcrumbs = false;
    this.graphics.breadcrumbs = createGraphics(windowWidth, windowHeight);
    this.graphics.breadcrumbs.stroke(255);
    this.graphics.telem = {};
    this.graphics.telem.w = mb.width / 100;
    this.graphics.telem.h = mb.height *0.25;
    this.graphics.telem.y = windowHeight - 0.6*mb.height;
    this.graphics.telem.bary = this.graphics.telem.y - this.graphics.telem.h/2
    this.graphics.telem.textx = 2 * this.graphics.telem.w;
    this.graphics.telem.texty = this.graphics.telem.y - this.graphics.telem.h;
    this.graphics.sat = {};
    this.graphics.sat.sprite = createGraphics(this.dims, this.dims);
    this.graphics.thrusters = {};
    this.graphics.thrusters.sprite = createGraphics(2*this.dims, 2*this.dims);
    this.graphics.thrusters.sprite.rectMode(CORNER);
    this.graphics.thrusters.offset = this.dims/2;
    this.graphics.vars = {};
    this.graphics.vars.major = 0.9 * this.dims;
    this.graphics.vars.minor = 0.1 * this.dims;
    this.graphics.sat.sprite.stroke(0);
    this.graphics.sat.sprite.strokeWeight(2);
    this.graphics.sat.sprite.rectMode(CENTER);
    // body
    this.graphics.sat.sprite.fill(100, 100, 100);
    this.graphics.sat.sprite.square(this.dims/2, this.dims/2, this.dims-2*this.graphics.vars.major);
    // directionality
    let trix = this.dims/2;
    let triy = 2*this.graphics.vars.minor
    this.graphics.sat.sprite.fill(50, 50, 50);
    this.graphics.sat.sprite.triangle(trix, triy, trix - this.graphics.vars.minor, triy + 2*this.graphics.vars.minor, trix + this.graphics.vars.minor, triy + 2*this.graphics.vars.minor);
    trix = trix + this.graphics.vars.minor;
    triy = triy + 2*this.graphics.vars.minor;
    this.graphics.sat.sprite.fill(100, 100, 100);
    this.graphics.sat.sprite.triangle(trix, triy, trix + 2 * this.graphics.vars.minor, triy + this.graphics.vars.minor, trix, triy + 2*this.graphics.vars.minor);

    // this.graphics.sat.sprite.triangle(this.dims/2 + this.graphics.vars.minor, 4*this.graphics.vars.minor, this.dims/2 + this.graphics.vars.minor, 4*this.graphics.vars.minor - this.graphics.vars.minor, 4*this.graphics.vars.minor, );
    // CG
    this.graphics.sat.sprite.fill(buttonColors[0]);
    this.graphics.sat.sprite.circle(this.dims/2, this.dims/2, this.graphics.vars.minor);
    this.prop.coords.push([this.dims/2, this.dims/2]);
    this.prop.cartesianDirection.push(-1);
    this.prop.angularDirection.push(-1);
    // boosters
    this.graphics.sat.sprite.rectMode(CORNER);
    //top left
    this.graphics.sat.sprite.fill(buttonColors[1]);
    this.graphics.sat.sprite.square(this.graphics.vars.minor, 0, this.graphics.vars.minor);
    this.prop.coords.push([this.graphics.vars.minor, 0]);
    this.prop.cartesianDirection.push(1);
    this.prop.angularDirection.push(0);
    // top right
    this.graphics.sat.sprite.fill(buttonColors[2]);
    this.graphics.sat.sprite.square(this.dims-2*this.graphics.vars.minor, 0, this.graphics.vars.minor);
    this.prop.coords.push([this.dims-2*this.graphics.vars.minor, 0]);
    this.prop.cartesianDirection.push(1);
    this.prop.angularDirection.push(1);
    // right top
    this.graphics.sat.sprite.fill(buttonColors[3]);
    this.graphics.sat.sprite.square(this.dims-this.graphics.vars.minor, this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([this.dims-this.graphics.vars.minor, this.graphics.vars.minor]);
    this.prop.cartesianDirection.push(2);
    this.prop.angularDirection.push(0);
    // right bottom
    this.graphics.sat.sprite.fill(buttonColors[4]);
    this.graphics.sat.sprite.square(this.dims-this.graphics.vars.minor, this.dims-2*this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([this.dims-this.graphics.vars.minor, this.dims-2*this.graphics.vars.minor]);
    this.prop.cartesianDirection.push(2);
    this.prop.angularDirection.push(1);
    // bottom right
    this.graphics.sat.sprite.fill(buttonColors[5]);
    this.graphics.sat.sprite.square(this.dims-2*this.graphics.vars.minor, this.dims-this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([this.dims-2*this.graphics.vars.minor, this.dims-this.graphics.vars.minor]);
    this.prop.cartesianDirection.push(3);
    this.prop.angularDirection.push(0);
    //bottom left
    this.graphics.sat.sprite.fill(buttonColors[6]);
    this.graphics.sat.sprite.square(this.graphics.vars.minor, this.dims-this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([this.graphics.vars.minor, this.dims-this.graphics.vars.minor]);
    this.prop.cartesianDirection.push(3);
    this.prop.angularDirection.push(1);
    // left bottom
    this.graphics.sat.sprite.fill(buttonColors[7]);
    this.graphics.sat.sprite.square(0, this.dims-2*this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([0, this.dims-2*this.graphics.vars.minor]);
    this.prop.cartesianDirection.push(4);
    this.prop.angularDirection.push(0);
    // left top
    this.graphics.sat.sprite.fill(buttonColors[8]);
    this.graphics.sat.sprite.square(0, this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([0, this.graphics.vars.minor]);
    this.prop.cartesianDirection.push(4);
    this.prop.angularDirection.push(1);
  }

  drawTelemetry(){
    let fuelX = this.graphics.telem.w/2;
    rectMode(CORNER);
    noStroke();
    fill(100, 100, 100);
    rect(0, this.graphics.telem.bary, windowWidth, this.graphics.telem.h);
    fill(50, 255, 100);
    rect(0, this.graphics.telem.bary, (this.graphics.telem.w) * this.mass, this.graphics.telem.h);
    fill(100, 100, 100);
    rect(0, this.graphics.telem.bary, (this.graphics.telem.w) * this.emptyMass, this.graphics.telem.h);
    rectMode(CENTER);
    stroke(0);
    strokeWeight(1);
    noFill();
    for (let i = 0; i < this.massUnits; i++){
      rect(fuelX, this.graphics.telem.y, this.graphics.telem.w, this.graphics.telem.h);
      fuelX += this.graphics.telem.w;
    }
    noStroke();
    fill(0);
    let vhstring = 'V heading: ' + (-1 * this.vf).toFixed(2) + '   ';
    let vnstring = 'V normal: ' + (this.vn).toFixed(2) + '   ';
    let vxstring = 'V x: ' + this.vx.toFixed(2) + '   ';
    let vystring = 'V y: ' + (-1 * this.vy).toFixed(2) + '   ';
    let vastring = 'V a: ' + this.va.toFixed(2) + '   ';
    let fuelstring = 'Mass: ' + (this.mass).toFixed(2) + ' Fuel: ' + (this.mass - this.emptyMass).toFixed(2) + ' Dry: ' + this.emptyMass + '   ';
    let screenstring = 'Screen: X ' + this.x.toFixed(2) + ' Y ' + this.y.toFixed(2) + ' A ' + this.a.toFixed(2);
    let textX = this.graphics.telem.textx;
    text(vhstring, textX, this.graphics.telem.texty);
    textX += textWidth(vhstring);
    text(vnstring, textX, this.graphics.telem.texty);
    textX += textWidth(vnstring);
    text(vxstring, textX, this.graphics.telem.texty);
    textX += textWidth(vxstring);
    text(vystring, textX, this.graphics.telem.texty);
    textX += textWidth(vystring);
    text(vastring, textX, this.graphics.telem.texty);
    textX += textWidth(vastring);
    text(fuelstring, textX, this.graphics.telem.texty);
    textX += textWidth(fuelstring);
    text(screenstring, textX, this.graphics.telem.texty);
  }

  drawSprites(x, y, a){
    push();
    translate(x, y);
    rotate(a);
    image(this.graphics.thrusters.sprite, 0, 0);
    image(this.graphics.sat.sprite, 0, 0);
    pop();
  }

  setupThrusterTexture(){
    this.graphics.thrusters.sprite.clear()
    for (let i = 1; i < 9; i++){
      if (this.prop.active[i] > 0){
        this.graphics.thrusters.sprite.fill(255, 255, 255);
        if (this.prop.cartesianDirection[i] == 1) {
          this.graphics.thrusters.sprite.rect(this.graphics.thrusters.offset+this.prop.coords[i][0], this.graphics.thrusters.offset+this.prop.coords[i][1], this.graphics.vars.minor, -3*this.graphics.vars.minor);
        } else if (this.prop.cartesianDirection[i] == 2) {
          this.graphics.thrusters.sprite.rect(this.graphics.thrusters.offset+this.prop.coords[i][0], this.graphics.thrusters.offset+this.prop.coords[i][1], 4*this.graphics.vars.minor, this.graphics.vars.minor);
        } else if (this.prop.cartesianDirection[i] == 3) {
          this.graphics.thrusters.sprite.rect(this.graphics.thrusters.offset+this.prop.coords[i][0], this.graphics.thrusters.offset+this.prop.coords[i][1], this.graphics.vars.minor, 4*this.graphics.vars.minor);
        } else if (this.prop.cartesianDirection[i] == 4) {
          this.graphics.thrusters.sprite.rect(this.graphics.thrusters.offset+this.prop.coords[i][0], this.graphics.thrusters.offset+this.prop.coords[i][1], -4*this.graphics.vars.minor, this.graphics.vars.minor);
        }
      }
    }
  }

  draw(){
    this.setupThrusterTexture();
    this.drawSprites(this.x, this.y, this.a);
    if (this.x > windowWidth - this.dims) {
      this.drawSprites(this.x - windowWidth, this.y, this.a);
    }
    if (this.x < this.dims) {
      this.drawSprites(this.x + windowWidth, this.y, this.a);
    }
    if (this.y < this.dims) {
      this.drawSprites(this.x, this.y + windowHeight, this.a);
    }
    if (this.y > windowHeight - this.dims) {
      this.drawSprites(this.x, this.y - windowHeight, this.a);
    }
    if (this.graphics.showBreadcrumbs) {
      image(this.graphics.breadcrumbs, widthOnTwo, heightOnTwo);
    }
  }

  drawBreadcrumbs(x1, y1, x2, y2) {
    this.graphics.breadcrumbs.line(x1, y1, x2, y2);
    if (x1 > windowWidth - this.dims) {
      this.graphics.breadcrumbs.line(x1-windowWidth, y1, x2-windowWidth, y2);
    }
    if (x1 < this.dims) {
      this.graphics.breadcrumbs.line(x1+windowWidth, y1, x2+windowWidth, y2);
    }
    if (y1 > windowHeight - this.dims) {
      this.graphics.breadcrumbs.line(x1, y1-windowHeight, x2, y2-windowHeight);
    }
    if (y1 < this.dims) {
      this.graphics.breadcrumbs.line(x1, y1+windowHeight, x2, y2+windowHeight);
    }
  }

  move(dx, dy, da){
    if (this.graphics.showBreadcrumbs) {
      this.drawBreadcrumbs(this.x, this.y, this.x + dx, this.y + dy);
    }
    this.x += dx;
    this.y += dy;
    this.a += da;


    // keep in view
    if (this.x > windowWidth + this.dims/2) {
      this.x -= windowWidth;
    }
    if (this.x <= -this.dims/2) {
      this.x += windowWidth;
    }
    if (this.y > windowHeight + this.dims/2) {
      this.y -= windowHeight;
    }
    if (this.y < -this.dims/2) {
      this.y += windowHeight;
    }
  }

  reset() {
    this.vn = 0;
    this.vf = 0;
    this.va = 0;
    this.vx = 0;
    this.vy = 0;
    this.mass = 100;
    this.x = windowWidth/2;
    this.y = windowHeight/2 - menuBar.height;
    this.a = 0;
    this.prop.active = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.graphics.breadcrumbs.clear();
  }

  update() {
    // update craft velocity for any active propulsion and geometry
    let dt = 1; // just incase I wanna change it
    let updateDynamics = false;
    for (let i = 0; i < this.prop.active.length; i++){
      if (this.prop.active[i] > 0) {
        updateDynamics = true;
        this.mass -= this.prop.fuelDecrement;
        if (this.prop.cartesianDirection[i] == 1) {
          this.vf += (this.prop.force / this.mass) * dt; // v = vi + a * delta(t) = vi + f / m * delta(t)
        } else if (this.prop.cartesianDirection[i] == 2) {
          this.vn -= (this.prop.force / this.mass) * dt;
        } else if (this.prop.cartesianDirection[i] == 3) {
          this.vf -= (this.prop.force / this.mass) * dt;
        } else if (this.prop.cartesianDirection[i] == 4) {
          this.vn += (this.prop.force / this.mass) * dt;
        }
        if (this.prop.angularDirection[i] == 1) {
          this.va += (this.prop.force / (this.mass * this.d)) * dt; // assume point mass cause we are in 2D anyway
        } else if (this.prop.angularDirection[i] == 0) {
          this.va -= (this.prop.force / (this.mass * this.d)) * dt;
        }
      }
      this.prop.active[i] = max(this.prop.active[i]-1, 0);
    }
    // convert vx, vy, va to screen coords
    if (this.a < -PI) { // for a relaxed brain
      this.a += 2*PI;
    }
    if (this.a > PI) {
      this.a -= 2*PI;
    }
    if (updateDynamics) {
      let headingAngle = this.a + this.va * dt // a = ai + w * deltat(t)
      let normalAngle = headingAngle + PI/2; // rotated
      this.vx = this.vn * cos(headingAngle) + this.vf * cos(normalAngle);
      this.vy = this.vn * sin(headingAngle) + this.vf * sin(normalAngle);

    }

    this.move(this.vx * dt, this.vy * dt, this.va * dt);
  }

  setPropulsionVectors(i, propDuration=this.prop.duration){
    if (i == 0) {
      this.stop();
    } else if (this.mass > this.emptyMass && i < this.prop.active.length) {
      if (this.prop.active[i] == 0){
        this.prop.active[i] = propDuration;
      }
    }
  }
}

function drawStars(c, r, w, star=false){
  starfield.stroke(c);
  starfield.strokeWeight(w);
  let density = r * starfield.width * starfield.height;
  for (let i = 0; i < density; i++) {
    if (star) {
      let sx = random(starfield.width);
      let sy = random(starfield.height);
      let shine = random(w+1, w+5);
      starfield.strokeWeight(1);
      starfield.line(sx - shine, sy, sx + shine, sy);
      starfield.line(sx, sy - shine, sx, sy + shine);
      starfield.strokeWeight(w);
      starfield.point(sx, sy);
    } else {
      starfield.point(random(starfield.width), random(starfield.height));
    }
  }
}

function makeStarfield() {
  starfield = createGraphics(windowWidth, windowHeight);
  starX = windowWidth / 2;
  starY = windowHeight / 2;
  starfield.background(color('#373a62'));
  drawStars(color('#25274c'), 0.02, 2);
  drawStars(color('#434c67'), 0.008, 2);
  drawStars(color('#7c7d99'), 0.005, 2);
  drawStars(color('#747c96'), 0.00005, 4, true);
}

function makeMenuBar(){
  menuBar = createGraphics(windowWidth, min(0.15*windowHeight, 100));
  menuBar.background(100, 100, 100);
  menuHeight = windowHeight - menuBar.height/2 - 1;
  let controlString = 'qwertdsgf';
  let tButtonOffset = windowWidth / buttonColors.length;
  let tButtonX = 0;
  for (let i = 0; i < buttonColors.length; i++){
    menuBar.fill(buttonColors[i]);
    menuBar.square(tButtonX, menuBar.height/2, tButtonOffset);
    menuBar.fill(0);
    menuBar.text(String(controlString[i]), tButtonX + tButtonOffset/2 - textWidth(String(controlString[i])), menuBar.height*0.8);
    tButtonX += tButtonOffset;
  }
}

function keyPressed() {
  // testing
  if (testing) {
    if (key == 'm') {
      mySat.mass = 20;
    }
    if (key == 'b') {
      mySat.va = 0.1;
    }
    if ('12345678'.indexOf(key) != -1) {
      mySat.a = '12345678'.indexOf(key) * 0.25 * PI;
    }
  }

  for (let i = 0; i < 'qwertdsgf'.length; i++){
    if (key === 'qwertdsgf'[i]) {
      mySat.setPropulsionVectors(i);
      return;
    }
  }
   if (keyCode == DOWN_ARROW){
    mySat.setPropulsionVectors(1);
    mySat.setPropulsionVectors(2);
    return;
  }  else if (keyCode == LEFT_ARROW){
    mySat.setPropulsionVectors(3);
    mySat.setPropulsionVectors(4);
    return;
  }  else if (keyCode == UP_ARROW){
    mySat.setPropulsionVectors(5);
    mySat.setPropulsionVectors(6);
    return;
  }  else if (keyCode == RIGHT_ARROW){
    mySat.setPropulsionVectors(7);
    mySat.setPropulsionVectors(8);
    return;
  } else if (key == 'a') {
    mySat.setPropulsionVectors(1);
    mySat.setPropulsionVectors(5);
    return;
  } else if (key == 'z') {
    mySat.setPropulsionVectors(2);
    mySat.setPropulsionVectors(6);
    return;
  } else if (key == ' ') {
    mySat.graphics.breadcrumbs.clear();
    mySat.graphics.showBreadcrumbs = !mySat.graphics.showBreadcrumbs;
    return;
  } else if (key == 'm') {
    mySat.reset();
    return;
  }
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  pixelColor = get(mouseX, mouseY);
  // check buttons based on color
  for (let i = 0; i < buttonColors.length; i++){
    let match = true;
    for (let j = 0; j < 3; j++) {
      if (buttonLookup[i][j] == pixelColor[j] && match == true) {
        match = true;
      } else {
        match = false;
      }
    }
    if (match) {
      mySat.setPropulsionVectors(i);
      return;
    }
  }
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
  makeStarfield();
  buttonColors = [color('#FF0000'), color('#66FF00'), color('#1974D2'), color('#08E8DE'), color('#FFF000'), color('#FFAA1D'), color('#FF007F'), color('#7D11E1'), color('#D0FF00')];
  buttonLookup = [];
  for (let i = 0; i < buttonColors.length; i++){
    buttonLookup.push(buttonColors[i].levels)
  }
  makeMenuBar();
  mySat = new RCSSat(windowWidth/2, windowHeight/2 - menuBar.height, 0, 100, menuBar);
}

function setup() {
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  rectMode(CENTER);
  frameRate(25);
  setupScreen();
}

function draw() {
  image(starfield, starX, starY);
  mySat.draw();
  mySat.update();
  image(menuBar, widthOnTwo, menuHeight)
  mySat.drawTelemetry();
}
