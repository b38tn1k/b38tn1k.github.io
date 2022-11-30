var IDLE = 0;
var BUILDING = 1;

class spWeb {
  constructor() {
    this.strands = [];
    this.state = IDLE;
    this.showHandles = false;
  }

  buildStrand(x, y, start = null) {
    let p1;
    if (start == null) {
      p1 = new Particle(x, y, 0, true);
    } else {
      p1 = start;
    }
    let p2 = new Particle(x, y, 0);
    let newStrand = new Strand(p1, p2);
    newStrand.building = true;
    newStrand.createParticles();
    newStrand.createSpringMesh();
    this.strands.push(newStrand);
    return newStrand;
  }

  addStrand(p1, p2) {
    let newStrand = new Strand(p1, p2);
    newStrand.createParticles();
    newStrand.createSpringMesh();
    this.strands.push(newStrand);
    return newStrand;
  }

  update() {
    for (let i = 0; i < this.strands.length; i++) {
      this.strands[i].update();
    }
  }

  mouseClickEvent(x, y) {
    let survey = this.findClosestParticles(x, y);
    let surveyCounter = 0;
    for (let i = 0; i < survey.length; i++) {
      surveyCounter += int(survey[i].selected);
    }
    if (this.state == IDLE){
      if (surveyCounter == 0) {
        this.buildStrand(x, y);
        this.state = BUILDING;
      } else if (keyIsDown(SHIFT) == true) {
        let p1;
        for (let i = 0; i < survey.length; i++) {
          if (survey[i].selected == true) {
            p1 = survey[i].particle;
            break;
          }
        }
        this.buildStrand(x, y, p1);
        this.state = BUILDING;

      }

    } else if (this.state == BUILDING) {

      let p1 = this.strands.pop().start;
      let p2;
      if (surveyCounter <= 1) {
        p2 = new Particle(x, y, 0, true);
      } else {
        for (let i = 0; i < survey.length; i++) {
          if (survey[i].selected == true) {
            p2 = survey[i].particle;
            break;
          }
        }
      }
      this.addStrand(p1, p2);
      this.state = IDLE;
    }

  }

  findClosestParticles(x, y) {
    let result = [];
    for (let i = 0; i < this.strands.length; i++) {
      result.push(this.strands[i].findClosestParticle(x, y));
    }
    return result;
  }

  draw() {
    for (let i = 0; i < this.strands.length; i++) {
      this.strands[i].draw2DCurve();
      if (this.showHandles == true) {
        this.strands[i].draw2DParticles();
        this.strands[i].drawStartEnd();
      }

    }
  }

};

class Strand {
  constructor(start, end) {
    this.particles = [];
    this.springs = [];
    // avoid using this VV, use particles.length
    this.particleCount = 5; // need to add to this as webs grow / shrink, 5 enough to start?
    // avoid using this ^^, use particles.length
    this.start = start;
    this.end = end;
    this.particleCursor = -1;
    this.approxSpringLength = 40;
    this.building = false;
  }

  drawStartEnd() {
    fill(255, 0, 0);
    circle(this.particles[0].x, this.particles[0].y, 5);
    circle(this.particles[this.particles.length-1].x, this.particles[this.particles.length-1].y, 5);
  }

  draw2DParticles(){
    noStroke();
    for (let i = 0; i < this.particles.length; i++) {
      noStroke();
      fill(255);
      if (i == this.particleCursor) {
        fill(255, 0, 0);
      }
      circle(this.particles[i].x, this.particles[i].y, 5)
      fill(255, 255, 255, 10);
      circle(this.particles[i].x, this.particles[i].y, this.approxSpringLength);

    }
  }

  draw2DCurve() {
    stroke(255);
    noFill();
    beginShape();
    curveVertex(this.particles[0].x, this.particles[0].y);
    for (let i = 0; i < this.particles.length; i++) {
      curveVertex(this.particles[i].x, this.particles[i].y);
    }
    curveVertex(this.particles[this.particles.length-1].x, this.particles[this.particles.length-1].y);
    endShape();
  }

  findClosestParticle(x, y){
    let xPercent = (x - this.start.x)/(this.end.x - this.start.x);
    let yPercent = (y - this.start.y)/(this.end.y - this.start.y);
    xPercent = constrain(xPercent, 0, 1);
    yPercent = constrain(yPercent, 0, 1);
    let xGuess = int(this.particles.length * xPercent);
    let yGuess = int(this.particles.length * yPercent);
    let avGuess = int((xGuess + yGuess)/2) + 1;
    avGuess = constrain(avGuess, 0, this.particles.length-1);
    // further filtering
    let avGuessM1 = constrain(avGuess-1, 0, avGuess);
    let avGuessP1 = constrain(avGuess+1, avGuess, this.particles.length-1);
    let guessSpace = [avGuessM1, avGuess, avGuessP1];
    let distances = [];
    for (let i = 0; i < guessSpace.length; i++) {
      let target = this.particles[guessSpace[i]];
      let myHypot = sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
      distances.push(myHypot);
    }
    let hypot = min(distances);
    let selected = false;
    if (hypot > this.approxSpringLength) {
      this.particleCursor = -1;
      selected = false;
    } else {
      this.particleCursor = avGuess -1 + distances.indexOf(hypot);
      selected = true;
    }
    let result = {}
    result.selected = selected;
    result.particle = this.particles[this.particleCursor];
    return result;
  }

  createParticles(){
    // for 2D X and Y increments
    if (this.building == false) {
      let strandLength = pointHypot(this.start, this.end);
      this.particleCount = ceil(strandLength/this.approxSpringLength);
    }
    let xInc = (this.end.x - this.start.x) / this.particleCount;
    let yInc = (this.end.y - this.start.y) / this.particleCount;
    // the start anchor
    this.particles.push(this.start);
    // the particles equally spaced along the line;
    for (let i=1; i < this.particleCount; i++) {
      let currentParticleX = this.start.x + (xInc * i);
      let currentParticleY = this.start.y + (yInc * i);
      this.particles.push(new Particle (currentParticleX, currentParticleY))
    }
    this.particles.push(this.end);
    // this.particles[0].fixed = true;
    // this.particles[this.particles.length-1].fixed = true;
  }
  createSpringMesh() {
    for (let i=0; i < this.particles.length-1; i++) {
      this.springs.push(new Spring (this.particles[i], this.particles[i+1]));
    }
  }

  update() {
    for (let i=0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
    if (mouseIsPressed && this.particleCursor != -1) {
      if (this.particles[this.particleCursor].fixed == false) {
        this.particles[this.particleCursor].x += 0.2*(mouseX - this.particles[this.particleCursor].x);
        this.particles[this.particleCursor].y += 0.2*(mouseY - this.particles[this.particleCursor].y);
      }
    } else {
      this.particleCursor = -1;
    }
    for (let i=0; i < this.springs.length; i++) {
      this.springs[i].update();
    }
    if (this.building == true) {
      this.end.x = mouseX;
      this.end.y = mouseY;

    }
  }
};

function pointHypot(p1, p2) {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  let h = sqrt(dx**2 + dy**2);
  return h;
}

class Point {
  constructor (x=0, y=0, z=0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Particle extends Point{
  constructor (x=0, y=0, z=0, fixed=false) {
    super(x, y, z);
    this.v = new Point();
    this.mass = 1.0;
    this.dampening = 0.9;
    this.returnK = 0.1;
    this.fixed = fixed;
  }
  addForce(fx, fy) {
    this.v.x += (fx / this.mass);
    this.v.y += (fy / this.mass);
  }
  update() {
    this.v.x *= this.dampening;
    this.v.y *= this.dampening;
    if (this.fixed == false) {
      this.x += this.v.x;
      this.y += this.v.y;
    }
  }
};

class Spring {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.k = 0.5;
    this.restLength = sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
  }

  update() {
    let dx = this.p1.x - this.p2.x;
    let dy = this.p1.y - this.p2.y;
    let dh = pointHypot(this.p1, this.p2);
    if (dh > 0.01) {
      let stretch = dh - this.restLength;
      let rForce = this.k * stretch;
      let fx = (dx / dh) * rForce;
      let fy = (dy / dh) * rForce;
      this.p1.addForce(-fx, -fy);
      this.p2.addForce(fx, fy);
    }
  }
}
