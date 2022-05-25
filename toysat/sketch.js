var starfield, starX, starY;
var mySat, buttonColors, buttonLookup;
var menuBar, widthOnTwo, menuHeight;
var testing = true;

class RCSSat {

  constructor(x, y, a, wh, mb) {
    // properties
    this.x = x;
    this.y = y;
    this.a = a;
    this.vx = 0;
    this.vy = 0;
    this.va = 0;
    this.ax = 0;
    this.ay = 0;
    this.aa = 0;
    this.dims = wh;
    this.d = sqrt(wh*wh + wh*wh);
    this.mass = 100;
    this.mass_units = 100;
    this.empty_mass = 20;
    this.prop = {}
    this.prop.active = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.prop.coords = [];
    this.prop.cartesian_direction = [];
    this.prop.angular_direction = [];
    this.prop.duration = 20; // frames
    this.prop.fuel_decrement = 1/(this.prop.duration - 1);
    this.prop.force = 1; // newtons I guess but does it really matter
    // graphics
    this.setupGraphics(mb);
  }

  setupGraphics(mb){
    this.graphics = {};
    this.graphics.telem = {};
    this.graphics.telem.w = mb.width / 100;
    this.graphics.telem.h = mb.height *0.25;
    this.graphics.telem.y = windowHeight - 0.6*mb.height;
    this.graphics.telem.bary = this.graphics.telem.y - this.graphics.telem.h/2
    this.graphics.telem.textx = 2 * this.graphics.telem.w;
    this.graphics.telem.texty = this.graphics.telem.y - (textSize() + 1);
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
    this.prop.cartesian_direction.push(-1);
    this.prop.angular_direction.push(-1);
    // boosters
    this.graphics.sat.sprite.rectMode(CORNER);
    //top left
    this.graphics.sat.sprite.fill(buttonColors[1]);
    this.graphics.sat.sprite.square(this.graphics.vars.minor, 0, this.graphics.vars.minor);
    this.prop.coords.push([this.graphics.vars.minor, 0]);
    this.prop.cartesian_direction.push(1);
    this.prop.angular_direction.push(0);
    // top right
    this.graphics.sat.sprite.fill(buttonColors[2]);
    this.graphics.sat.sprite.square(this.dims-2*this.graphics.vars.minor, 0, this.graphics.vars.minor);
    this.prop.coords.push([this.dims-2*this.graphics.vars.minor, 0]);
    this.prop.cartesian_direction.push(1);
    this.prop.angular_direction.push(1);
    // right top
    this.graphics.sat.sprite.fill(buttonColors[3]);
    this.graphics.sat.sprite.square(this.dims-this.graphics.vars.minor, this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([this.dims-this.graphics.vars.minor, this.graphics.vars.minor]);
    this.prop.cartesian_direction.push(2);
    this.prop.angular_direction.push(0);
    // right bottom
    this.graphics.sat.sprite.fill(buttonColors[4]);
    this.graphics.sat.sprite.square(this.dims-this.graphics.vars.minor, this.dims-2*this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([this.dims-this.graphics.vars.minor, this.dims-2*this.graphics.vars.minor]);
    this.prop.cartesian_direction.push(2);
    this.prop.angular_direction.push(1);
    // bottom right
    this.graphics.sat.sprite.fill(buttonColors[5]);
    this.graphics.sat.sprite.square(this.dims-2*this.graphics.vars.minor, this.dims-this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([this.dims-2*this.graphics.vars.minor, this.dims-this.graphics.vars.minor]);
    this.prop.cartesian_direction.push(3);
    this.prop.angular_direction.push(0);
    //bottom left
    this.graphics.sat.sprite.fill(buttonColors[6]);
    this.graphics.sat.sprite.square(this.graphics.vars.minor, this.dims-this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([this.graphics.vars.minor, this.dims-this.graphics.vars.minor]);
    this.prop.cartesian_direction.push(3);
    this.prop.angular_direction.push(1);
    // left bottom
    this.graphics.sat.sprite.fill(buttonColors[7]);
    this.graphics.sat.sprite.square(0, this.dims-2*this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([0, this.dims-2*this.graphics.vars.minor]);
    this.prop.cartesian_direction.push(4);
    this.prop.angular_direction.push(0);
    // left top
    this.graphics.sat.sprite.fill(buttonColors[8]);
    this.graphics.sat.sprite.square(0, this.graphics.vars.minor, this.graphics.vars.minor);
    this.prop.coords.push([0, this.graphics.vars.minor]);
    this.prop.cartesian_direction.push(4);
    this.prop.angular_direction.push(1);
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
    rect(0, this.graphics.telem.bary, (this.graphics.telem.w) * this.empty_mass, this.graphics.telem.h);
    rectMode(CENTER);
    stroke(0);
    strokeWeight(1);
    noFill();
    for (let i = 0; i < this.mass_units; i++){
      rect(fuelX, this.graphics.telem.y, this.graphics.telem.w, this.graphics.telem.h);
      fuelX += this.graphics.telem.w;
    }
    noStroke();
    fill(0);
    let vxstring = 'Vx: ' + String(this.vx.toFixed(2)) + ' p/fr   ';
    let vystring = 'Vy: ' + String((-1 * this.vy).toFixed(2)) + ' p/fr   ';
    let vastring = 'Va: ' + String(this.va.toFixed(2)) + ' rad/fr   ';
    let fuelstring = 'Mass: ' + String((this.mass).toFixed(2)) + ' Fuel: ' + String((this.mass - this.empty_mass).toFixed(2)) + ' Dry: ' + this.empty_mass + '   ';
    let textX = this.graphics.telem.textx;
    text(vxstring, textX, this.graphics.telem.texty);
    textX += textWidth(vxstring);
    text(vystring, textX, this.graphics.telem.texty);
    textX += textWidth(vystring);
    text(vastring, textX, this.graphics.telem.texty);
    textX += textWidth(vastring);
    text(fuelstring, textX, this.graphics.telem.texty);
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
        if (this.prop.cartesian_direction[i] == 1) {
          this.graphics.thrusters.sprite.rect(this.graphics.thrusters.offset+this.prop.coords[i][0], this.graphics.thrusters.offset+this.prop.coords[i][1], this.graphics.vars.minor, -3*this.graphics.vars.minor);
        } else if (this.prop.cartesian_direction[i] == 2) {
          this.graphics.thrusters.sprite.rect(this.graphics.thrusters.offset+this.prop.coords[i][0], this.graphics.thrusters.offset+this.prop.coords[i][1], 4*this.graphics.vars.minor, this.graphics.vars.minor);
        } else if (this.prop.cartesian_direction[i] == 3) {
          this.graphics.thrusters.sprite.rect(this.graphics.thrusters.offset+this.prop.coords[i][0], this.graphics.thrusters.offset+this.prop.coords[i][1], this.graphics.vars.minor, 4*this.graphics.vars.minor);
        } else if (this.prop.cartesian_direction[i] == 4) {
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
  }

  move(dx, dy, da){
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

  update() {
    // update craft velocity for any active propulsion and geometry
    for (let i = 0; i < this.prop.active.length; i++){
      this.prop.active[i] = max(this.prop.active[i]-1, 0);
      if (this.prop.active[i] > 0) {
        this.mass -= this.prop.fuel_decrement;
        if (this.prop.cartesian_direction[i] == 1) {
          this.vy += (this.prop.force / this.mass) * (this.prop.duration - this.prop.active[i]); // (f / m) * delta(t)
        } else if (this.prop.cartesian_direction[i] == 2) {
          this.vx -= (this.prop.force / this.mass) * (this.prop.duration - this.prop.active[i]);
        } else if (this.prop.cartesian_direction[i] == 3) {
          this.vy -= (this.prop.force / this.mass) * (this.prop.duration - this.prop.active[i]);
        } else if (this.prop.cartesian_direction[i] == 4) {
          this.vx += (this.prop.force / this.mass) * (this.prop.duration - this.prop.active[i]);
        }
        if (this.prop.angular_direction[i] == 1) {
          this.va += (this.prop.force / (this.mass * this.d)) * (this.prop.duration - this.prop.active[i]); // assume point mass cause we are in 2D anyway
        } else if (this.prop.angular_direction[i] == 0) {
          this.va -= (this.prop.force / (this.mass * this.d)) * (this.prop.duration - this.prop.active[i]);
        }
      }
    }
    // convert vx, vy, va to screen coords
    let dt = 1; // just incase I wanna change it
    let angle = this.a + this.va * dt
    let sx = (this.vx * cos(angle) + this.vy * sin(angle)) * dt;
    let sy = (this.vy * cos(angle) + this.vx * sin(angle)) * dt;
    this.move(sx, sy, this.va * dt);
  }

  setPropulsionVectors(i){
    if (i == 0) { // clean up once I get physics down
      this.vx = 0;
      this.vy = 0;
      this.va = 0;
      this.mass = 101;
    }
    if (this.mass > this.empty_mass && i < this.prop.active.length) {
      if (this.prop.active[i] == 0){
        this.prop.active[i] = this.prop.duration;
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
  menuBar = createGraphics(windowWidth, min(0.1*windowHeight, 100));
  menuBar.background(100, 100, 100);

  menuHeight = windowHeight - menuBar.height/2;
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
    if ('1234567890'.indexOf(key) != -1) {
      mySat.a = '1234567890'.indexOf(key) * 0.2 * PI;
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
  makeStarfield();
  buttonColors = [color('#FF0000'), color('#66FF00'), color('#1974D2'), color('#08E8DE'), color('#FFF000'), color('#FFAA1D'), color('#FF007F'), color('#7D11E1'), color('#D0FF00')];
  buttonLookup = [];
  for (let i = 0; i < buttonColors.length; i++){
    buttonLookup.push(buttonColors[i].levels)
  }
  makeMenuBar();
  mySat = new RCSSat(windowWidth/2, windowHeight/2, 0, 100, menuBar);
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
