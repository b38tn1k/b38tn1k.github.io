var starfield, starX, starY;
var mySat, buttonColors, buttonLookup;
var widthOnTwo, heightOnTwo;
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

  constructor(x, y, a, wh) {
    this.x = x;
    this.y = y;
    this.a = a;
    this.vx = 0;
    this.vy = 0;
    this.vn = 0;
    this.vf = 0; // heading, vh to confusable with vn
    this.va = 0;
    this.model = {}
    this.model.dims = wh;
    this.model.d = sqrt(wh*wh + wh*wh);
    this.model.mass = 100;
    this.model.massMax = 100;
    this.model.massMin = 20;
    this.model.active = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.model.coords = [];
    this.model.cartesianDirection = [];
    this.model.angularDirection = [];
    this.model.duration = 20; // frames
    this.model.fuelDecrement = 1/(this.model.duration);
    this.model.force = 5; // random value that makes sat move enough to be interesting
    // graphics
    this.setupGraphics();
  }

  stop() {
    // P = m * v = F * t
    // t = (m * v) / F
    let controlEfforts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let vfControlEffort = (this.vf * this.model.mass) / (this.model.force);
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
    let vnControlEffort = (this.vn * this.model.mass) / (this.model.force);
    vnControlEffort = round(vnControlEffort)/2;
    vnControlEffort = int(abs(vnControlEffort));
    if (this.vn > 0) {
      controlEfforts[3] += vnControlEffort;
      controlEfforts[4] += vnControlEffort;
    } else {
      controlEfforts[8] += vnControlEffort;
      controlEfforts[7] += vnControlEffort;
    }
    let vaControlEffort = (this.va * this.model.mass * this.model.d) / this.model.force;
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
      this.model.active[i] = controlEfforts[i];
    }
  }

  setupGraphics(){
    this.g = {};
    this.g.vars = {};
    this.g.vars.major = 0.9 * this.model.dims;
    this.g.vars.minor = 0.1 * this.model.dims;
    // breadcrumbs
    this.g.breadcrumbs = {}
    this.g.breadcrumbs.show = false;
    this.g.breadcrumbs.image = createGraphics(windowWidth, windowHeight);
    this.g.breadcrumbs.image.stroke(255);
    // information overlay
    this.g.telem = {};
    this.g.telem.textOffset = int(2 * this.g.vars.minor);
    this.g.telem.fg = {};
    this.g.telem.fg.w = 2*this.g.vars.minor;
    this.g.telem.fg.h = windowHeight / 106;
    this.g.telem.fg.y = this.g.telem.fg.h * 3;
    this.g.telem.fg.x = windowWidth - 3*this.g.vars.minor;
    this.g.telem.buttons = createGraphics(windowWidth, windowHeight);
    this.g.telem.buttons.ellipseMode(CORNER);
    this.g.telem.buttons.textAlign(LEFT, CENTER);
    let controlString = 'qwertdsgf';
    let buttonY = this.g.telem.textOffset + 8 * textSize();
    let buttonGap = 3*this.g.vars.minor;
    let buttonSize = 4*this.g.vars.minor;
    let textX = 2*this.g.telem.fg.w + this.g.telem.textOffset + this.g.vars.minor;
    for (let i = 0; i < buttonColors.length; i++){
      this.g.telem.buttons.fill(buttonColors[i]);
      if (i == 0) {
        this.g.telem.buttons.ellipse(this.g.telem.textOffset, buttonY, buttonSize, this.g.telem.fg.w);
      } else {
        this.g.telem.buttons.rect(this.g.telem.textOffset, buttonY, buttonSize, this.g.telem.fg.w);
      }
      this.g.telem.buttons.fill(255);
      this.g.telem.buttons.text(String(controlString[i]), textX, buttonY + 2*textSize()/3);
      buttonY += buttonGap;
    }
    this.g.telem.cartesian = buttonY;
    // 5 & 6
    this.g.telem.buttons.fill(200);
    this.g.telem.buttons.rect(this.g.telem.textOffset, buttonY, buttonSize, this.g.telem.fg.w);
    this.g.telem.buttons.fill(255);
    this.g.telem.buttons.text('^', textX, buttonY + 2*textSize()/3);
    buttonY += buttonGap;
    // 2 & 1
    this.g.telem.buttons.fill(201);
    this.g.telem.buttons.rect(this.g.telem.textOffset, buttonY, buttonSize, this.g.telem.fg.w);
    this.g.telem.buttons.fill(255);
    this.g.telem.buttons.text('v', textX, buttonY + 2*textSize()/3);
    buttonY += buttonGap;
    // 7 & 8
    this.g.telem.buttons.fill(202);
    this.g.telem.buttons.rect(this.g.telem.textOffset, buttonY, buttonSize, this.g.telem.fg.w);
    this.g.telem.buttons.fill(255);
    this.g.telem.buttons.text('>', textX, buttonY + 2*textSize()/3);
    buttonY += buttonGap;
    // 3 & 4
    this.g.telem.buttons.fill(203);
    this.g.telem.buttons.rect(this.g.telem.textOffset, buttonY, buttonSize, this.g.telem.fg.w);
    this.g.telem.buttons.fill(255);
    this.g.telem.buttons.text('<', textX, buttonY + 2*textSize()/3);
    buttonY += buttonGap;
    // 2 & 6
    this.g.telem.angular = buttonY;
    this.g.telem.buttons.fill(204);
    this.g.telem.buttons.rect(this.g.telem.textOffset, buttonY, buttonSize, this.g.telem.fg.w);
    this.g.telem.buttons.fill(255);
    this.g.telem.buttons.text('a: cw', textX, buttonY + 2*textSize()/3);
    // 1 & 5
    buttonY += buttonGap;
    this.g.telem.buttons.fill(205);
    this.g.telem.buttons.rect(this.g.telem.textOffset, buttonY, buttonSize, this.g.telem.fg.w);
    this.g.telem.buttons.fill(255);
    this.g.telem.buttons.text('z: ccw', textX, buttonY + 2*textSize()/3);
    buttonY += buttonGap;
    // oh man
    this.g.sat = {};
    this.g.sat.sprite = createGraphics(this.model.dims, this.model.dims);
    this.g.thrusters = {};
    this.g.thrusters.sprite = createGraphics(2*this.model.dims, 2*this.model.dims);
    this.g.thrusters.sprite.rectMode(CORNER);
    this.g.thrusters.offset = this.model.dims/2;
    this.g.sat.sprite.stroke(0);
    this.g.sat.sprite.strokeWeight(2);
    this.g.sat.sprite.rectMode(CENTER);
    // body
    this.g.sat.sprite.fill(100, 100, 100);
    this.g.sat.sprite.square(this.model.dims/2, this.model.dims/2, this.model.dims-2*this.g.vars.major);
    // directionality
    let trix = this.model.dims/2;
    let triy = 2*this.g.vars.minor
    this.g.sat.sprite.fill(50, 50, 50);
    this.g.sat.sprite.triangle(trix, triy, trix - this.g.vars.minor, triy + 2*this.g.vars.minor, trix + this.g.vars.minor, triy + 2*this.g.vars.minor);
    trix = trix + this.g.vars.minor;
    triy = triy + 2*this.g.vars.minor;
    this.g.sat.sprite.fill(100, 100, 100);
    this.g.sat.sprite.triangle(trix, triy, trix + 2 * this.g.vars.minor, triy + this.g.vars.minor, trix, triy + 2*this.g.vars.minor);
    // this.g.sat.sprite.triangle(this.model.dims/2 + this.g.vars.minor, 4*this.g.vars.minor, this.model.dims/2 + this.g.vars.minor, 4*this.g.vars.minor - this.g.vars.minor, 4*this.g.vars.minor, );
    // CG
    this.g.sat.sprite.fill(buttonColors[0]);
    this.g.sat.sprite.circle(this.model.dims/2, this.model.dims/2, this.g.vars.minor);
    this.model.coords.push([this.model.dims/2, this.model.dims/2]);
    this.model.cartesianDirection.push(-1);
    this.model.angularDirection.push(-1);
    // boosters
    this.g.sat.sprite.rectMode(CORNER);
    //top left
    this.g.sat.sprite.fill(buttonColors[1]);
    this.g.sat.sprite.square(this.g.vars.minor, 0, this.g.vars.minor);
    this.model.coords.push([this.g.vars.minor, 0]);
    this.model.cartesianDirection.push(1);
    this.model.angularDirection.push(0);
    // top right
    this.g.sat.sprite.fill(buttonColors[2]);
    this.g.sat.sprite.square(this.model.dims-2*this.g.vars.minor, 0, this.g.vars.minor);
    this.model.coords.push([this.model.dims-2*this.g.vars.minor, 0]);
    this.model.cartesianDirection.push(1);
    this.model.angularDirection.push(1);
    // right top
    this.g.sat.sprite.fill(buttonColors[3]);
    this.g.sat.sprite.square(this.model.dims-this.g.vars.minor, this.g.vars.minor, this.g.vars.minor);
    this.model.coords.push([this.model.dims-this.g.vars.minor, this.g.vars.minor]);
    this.model.cartesianDirection.push(2);
    this.model.angularDirection.push(0);
    // right bottom
    this.g.sat.sprite.fill(buttonColors[4]);
    this.g.sat.sprite.square(this.model.dims-this.g.vars.minor, this.model.dims-2*this.g.vars.minor, this.g.vars.minor);
    this.model.coords.push([this.model.dims-this.g.vars.minor, this.model.dims-2*this.g.vars.minor]);
    this.model.cartesianDirection.push(2);
    this.model.angularDirection.push(1);
    // bottom right
    this.g.sat.sprite.fill(buttonColors[5]);
    this.g.sat.sprite.square(this.model.dims-2*this.g.vars.minor, this.model.dims-this.g.vars.minor, this.g.vars.minor);
    this.model.coords.push([this.model.dims-2*this.g.vars.minor, this.model.dims-this.g.vars.minor]);
    this.model.cartesianDirection.push(3);
    this.model.angularDirection.push(0);
    //bottom left
    this.g.sat.sprite.fill(buttonColors[6]);
    this.g.sat.sprite.square(this.g.vars.minor, this.model.dims-this.g.vars.minor, this.g.vars.minor);
    this.model.coords.push([this.g.vars.minor, this.model.dims-this.g.vars.minor]);
    this.model.cartesianDirection.push(3);
    this.model.angularDirection.push(1);
    // left bottom
    this.g.sat.sprite.fill(buttonColors[7]);
    this.g.sat.sprite.square(0, this.model.dims-2*this.g.vars.minor, this.g.vars.minor);
    this.model.coords.push([0, this.model.dims-2*this.g.vars.minor]);
    this.model.cartesianDirection.push(4);
    this.model.angularDirection.push(0);
    // left top
    this.g.sat.sprite.fill(buttonColors[8]);
    this.g.sat.sprite.square(0, this.g.vars.minor, this.g.vars.minor);
    this.model.coords.push([0, this.g.vars.minor]);
    this.model.cartesianDirection.push(4);
    this.model.angularDirection.push(1);

  }

  drawTelemetry(){
    // fuel and mass gauge
    rectMode(CORNER);
    noStroke();
    fill(50, 255, 100);
    rect(this.g.telem.fg.x, this.g.telem.fg.y, this.g.telem.fg.w, this.g.telem.fg.h * this.model.massMax);
    fill(100, 100, 100);
    rect(this.g.telem.fg.x, this.g.telem.fg.y, this.g.telem.fg.w, this.g.telem.fg.h * (this.model.massMax - this.model.mass));
    fill(100, 100, 100);
    rect(this.g.telem.fg.x, this.g.telem.fg.y + this.g.telem.fg.h * (this.model.massMax - this.model.massMin), this.g.telem.fg.w, this.g.telem.fg.h * (this.model.massMin));
    stroke(0);
    strokeWeight(1);
    noFill();
    let fuelY = this.g.telem.fg.y;
    for (let i = 0; i < this.model.massMax; i++){
      rect(this.g.telem.fg.x, fuelY, this.g.telem.fg.w, this.g.telem.fg.h);
      fuelY += this.g.telem.fg.h;
    }
    // telem vals
    rectMode(CENTER);
    noStroke();
    fill(255);
    let vhstring = 'V heading: ' + (-1 * this.vf).toFixed(2) + '   ';
    let vnstring = 'V normal: ' + (this.vn).toFixed(2) + '   ';
    let vxstring = 'V x: ' + this.vx.toFixed(2) + '   ';
    let vystring = 'V y: ' + (-1 * this.vy).toFixed(2) + '   ';
    let vastring = 'V a: ' + this.va.toFixed(2) + '   ';
    let fuelstring = 'Mass: ' + (this.model.mass).toFixed(2) + ' Fuel: ' + (this.model.mass - this.model.massMin).toFixed(2) + ' Dry: ' + this.model.massMin + '   ';
    let screenstring = 'Screen: X: ' + this.x.toFixed(2) + ' Y: ' + this.y.toFixed(2) + ' A: ' + this.a.toFixed(2);
    let texty = this.g.telem.textOffset;
    text(vhstring, this.g.telem.textOffset, texty);
    texty += textSize() + 1;
    text(vnstring, this.g.telem.textOffset, texty);
    texty += textSize() + 1;
    text(vxstring, this.g.telem.textOffset, texty);
    texty += textSize() + 1;
    text(vystring, this.g.telem.textOffset, texty);
    texty += textSize() + 1;
    text(vastring, this.g.telem.textOffset, texty);
    texty += textSize() + 1;
    text(fuelstring, this.g.telem.textOffset, texty);
    texty += textSize() + 1;
    text(screenstring, this.g.telem.textOffset, texty);
    // buttons
    image(this.g.telem.buttons, widthOnTwo, heightOnTwo);
  }

  drawSprites(x, y, a){
    push();
    translate(x, y);
    rotate(a);
    image(this.g.thrusters.sprite, 0, 0);
    image(this.g.sat.sprite, 0, 0);
    pop();
  }

  setupThrusterTexture(){
    this.g.thrusters.sprite.clear()
    for (let i = 1; i < 9; i++){
      if (this.model.active[i] > 0){
        this.g.thrusters.sprite.fill(255, 255, 255);
        if (this.model.cartesianDirection[i] == 1) {
          this.g.thrusters.sprite.rect(this.g.thrusters.offset+this.model.coords[i][0], this.g.thrusters.offset+this.model.coords[i][1], this.g.vars.minor, -3*this.g.vars.minor);
        } else if (this.model.cartesianDirection[i] == 2) {
          this.g.thrusters.sprite.rect(this.g.thrusters.offset+this.model.coords[i][0], this.g.thrusters.offset+this.model.coords[i][1], 4*this.g.vars.minor, this.g.vars.minor);
        } else if (this.model.cartesianDirection[i] == 3) {
          this.g.thrusters.sprite.rect(this.g.thrusters.offset+this.model.coords[i][0], this.g.thrusters.offset+this.model.coords[i][1], this.g.vars.minor, 4*this.g.vars.minor);
        } else if (this.model.cartesianDirection[i] == 4) {
          this.g.thrusters.sprite.rect(this.g.thrusters.offset+this.model.coords[i][0], this.g.thrusters.offset+this.model.coords[i][1], -4*this.g.vars.minor, this.g.vars.minor);
        }
      }
    }
  }

  draw(){
    this.setupThrusterTexture();
    this.drawSprites(this.x, this.y, this.a);
    if (this.x > windowWidth - this.model.dims) {
      this.drawSprites(this.x - windowWidth, this.y, this.a);
    }
    if (this.x < this.model.dims) {
      this.drawSprites(this.x + windowWidth, this.y, this.a);
    }
    if (this.y < this.model.dims) {
      this.drawSprites(this.x, this.y + windowHeight, this.a);
    }
    if (this.y > windowHeight - this.model.dims) {
      this.drawSprites(this.x, this.y - windowHeight, this.a);
    }
    if (this.g.breadcrumbs.show) {
      image(this.g.breadcrumbs.image, widthOnTwo, heightOnTwo);
    }
    this.drawTelemetry();
  }

  drawBreadcrumbs(x1, y1, x2, y2) {
    this.g.breadcrumbs.image.line(x1, y1, x2, y2);
    if (x1 > windowWidth - this.model.dims) {
      this.g.breadcrumbs.image.line(x1-windowWidth, y1, x2-windowWidth, y2);
    }
    if (x1 < this.model.dims) {
      this.g.breadcrumbs.image.line(x1+windowWidth, y1, x2+windowWidth, y2);
    }
    if (y1 > windowHeight - this.model.dims) {
      this.g.breadcrumbs.image.line(x1, y1-windowHeight, x2, y2-windowHeight);
    }
    if (y1 < this.model.dims) {
      this.g.breadcrumbs.image.line(x1, y1+windowHeight, x2, y2+windowHeight);
    }
  }

  move(dx, dy, da){
    if (this.g.breadcrumbs.show) {
      this.drawBreadcrumbs(this.x, this.y, this.x + dx, this.y + dy);
    }
    this.x += dx;
    this.y += dy;
    this.a += da;


    // keep in view
    if (this.x > windowWidth + this.model.dims/2) {
      this.x -= windowWidth;
    }
    if (this.x <= -this.model.dims/2) {
      this.x += windowWidth;
    }
    if (this.y > windowHeight + this.model.dims/2) {
      this.y -= windowHeight;
    }
    if (this.y < -this.model.dims/2) {
      this.y += windowHeight;
    }
  }

  reset() {
    this.vn = 0;
    this.vf = 0;
    this.va = 0;
    this.vx = 0;
    this.vy = 0;
    this.model.mass = 100;
    this.x = windowWidth/2;
    this.y = windowHeight/2;
    this.a = 0;
    this.model.active = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.g.breadcrumbs.image.clear();
  }

  update() {
    // update craft velocity for any active propulsion and geometry
    let dt = 1; // just incase I wanna change it
    let updateDynamics = false;
    for (let i = 0; i < this.model.active.length; i++){
      if (this.model.active[i] > 0) {
        updateDynamics = true;
        this.model.mass -= this.model.fuelDecrement;
        if (this.model.cartesianDirection[i] == 1) {
          this.vf += (this.model.force / this.model.mass) * dt; // v = vi + a * delta(t) = vi + f / m * delta(t)
        } else if (this.model.cartesianDirection[i] == 2) {
          this.vn -= (this.model.force / this.model.mass) * dt;
        } else if (this.model.cartesianDirection[i] == 3) {
          this.vf -= (this.model.force / this.model.mass) * dt;
        } else if (this.model.cartesianDirection[i] == 4) {
          this.vn += (this.model.force / this.model.mass) * dt;
        }
        if (this.model.angularDirection[i] == 1) {
          this.va += (this.model.force / (this.model.mass * this.model.d)) * dt; // assume point mass cause we are in 2D anyway
        } else if (this.model.angularDirection[i] == 0) {
          this.va -= (this.model.force / (this.model.mass * this.model.d)) * dt;
        }
      }
      this.model.active[i] = max(this.model.active[i]-1, 0);
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

  setPropulsionVectors(i, propDuration=this.model.duration){
    if (i == 0) {
      this.stop();
    } else if (this.model.mass > this.model.massMin && i < this.model.active.length) {
      if (this.model.active[i] == 0){
        this.model.active[i] = propDuration;
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

function keyPressed() {
  // testing
  if (testing) {
    if (key == 'm') {
      mySat.model.mass = 20;
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
    mySat.setPropulsionVectors(2);
    mySat.setPropulsionVectors(6);
    return;
  } else if (key == 'z') {
    mySat.setPropulsionVectors(1);
    mySat.setPropulsionVectors(5);
    return;
  } else if (key == ' ') {
    mySat.g.breadcrumbs.image.clear();
    mySat.g.breadcrumbs.show = !mySat.g.breadcrumbs.show;
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
  let val = 200;
  if (pixelColor[0] == val && pixelColor[1] == pixelColor[2]) {
    mySat.setPropulsionVectors(5);
    mySat.setPropulsionVectors(6);
    return;
  }
  val += 1;
  if (pixelColor[0] == val && pixelColor[1] == pixelColor[2]) {
    mySat.setPropulsionVectors(1);
    mySat.setPropulsionVectors(2);
    return;
  }
  val += 1;
  if (pixelColor[0] == val && pixelColor[1] == pixelColor[2]) {
    mySat.setPropulsionVectors(7);
    mySat.setPropulsionVectors(8);
    return;
  }
  val += 1;
  if (pixelColor[0] == val && pixelColor[1] == pixelColor[2]) {
    mySat.setPropulsionVectors(3);
    mySat.setPropulsionVectors(4);
    return;
  }
  val += 1;
  if (pixelColor[0] == val && pixelColor[1] == pixelColor[2]) {
    mySat.setPropulsionVectors(2);
    mySat.setPropulsionVectors(6);
    return;
  }
  val += 1;
  if (pixelColor[0] == val && pixelColor[1] == pixelColor[2]) {
    mySat.setPropulsionVectors(1);
    mySat.setPropulsionVectors(5);
    return;
  }
  val += 1;

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
  mySat = new RCSSat(windowWidth/2, windowHeight/2, 0, 100);
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
}
