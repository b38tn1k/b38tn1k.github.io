// mechanics
var PARTICLE_MASS = 5.0;
var DAMPENING = 0.97;
var GRAVITY = 0.009;
var K = 0.5;
var APPROX_SPRING_LENGTH = 40;
var MOUSE_DAMPENER = 1.0;
// states
var IDLE = 0;
var BUILDING = 1;

function pointHypot(p1, p2) {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  let h = sqrt(dx**2 + dy**2);
  return h;
}

class spWeb {
  constructor() {
    this.strands = [];
    this.state = IDLE;
    this.showHandles = true;
  }

  toggleDebug() {
    this.showHandles = ! this.showHandles;
  }

  buildStrand(x, y, start = null) {
    let p1;
    if (start == null) {
      p1 = new Particle(x, y, true);
    } else {
      p1 = start;
    }
    let p2 = new Particle(x, y);
    let newStrand = new Strand(p1, p2);
    newStrand.state = BUILDING;
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
    // find any and all near particles
    let survey = this.findClosestParticles(x, y);
    let surveyCounter = 0;
    for (let i = 0; i < survey.length; i++) {
      surveyCounter += int(survey[i].selected);
    }
    if (this.state == IDLE){
      if (surveyCounter == 0) { // if no nearby particles, build a new strand
        this.buildStrand(x, y);
        this.state = BUILDING;
      } else if (keyIsDown(SHIFT) == true) {
        //if there are nearby particles and the shift key is down, start a new strand from p1, the selected strand
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
      // if state is already building we are closing a strand.
      let p1 = this.strands.pop().start; // we rebuild the entire strand on close, using the same start point.
      let p2;
      if (surveyCounter <= 1) {
        p2 = new Particle(x, y, true); // only particles in the survey are ones that belong to the current strand, make a strand fixed on both ends
      } else {
        for (let i = 0; i < survey.length; i++) { // particles from other strands present, connect strands
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
      result.push(this.strands[i].findClosestParticle(x, y)); // actual math done on strand level. and it needs work!
    }
    return result;
  }

  draw() {
    for (let i = 0; i < this.strands.length; i++) {
      draw2DCurve(this.strands[i].particles);
      if (this.showHandles == true) {
        draw2DParticles(this.strands[i].particles, this.strands[i].particleCursor);
        drawStartEnd(this.strands[i].particles);
        drawClosest(this.strands[i]);
      }
    }
  }

};

class Strand {
  constructor(start, end) {
    this.particles = [];
    this.springs = [];
    this.start = start;
    this.end = end;
    this.particleCursor = -1;
    this.state = IDLE;
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
      let myHypot = pointHypot(new Point(x, y), target);
      distances.push(myHypot);
    }
    let hypot = min(distances);
    let selected = false;
    if (hypot > APPROX_SPRING_LENGTH) {
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

  createParticles(){ // called when rebuilding a strand after building.
    // for 2D X and Y increments
    let strandLength = pointHypot(this.start, this.end);
    let particleCount = ceil(strandLength/APPROX_SPRING_LENGTH);
    let xInc = (this.end.x - this.start.x) / particleCount;
    let yInc = (this.end.y - this.start.y) / particleCount;
    // the start anchor
    this.particles.push(this.start);
    // the particles equally spaced along the line;
    for (let i=1; i < particleCount; i++) {
      let currentParticleX = this.start.x + (xInc * i);
      let currentParticleY = this.start.y + (yInc * i);
      this.particles.push(new Particle (currentParticleX, currentParticleY))
    }
    this.particles.push(this.end);
  }

  createSpringMesh() { // Particle: *, Spring: =, Mesh: *=*=* ... =*=*
    for (let i=0; i < this.particles.length-1; i++) {
      this.springs.push(new Spring (this.particles[i], this.particles[i+1]));
    }
  }

  pullWithMouse() {
    if (this.particles[this.particleCursor].fixed == false) {
      this.particles[this.particleCursor].x += MOUSE_DAMPENER * (mouseX - this.particles[this.particleCursor].x);
      this.particles[this.particleCursor].y += MOUSE_DAMPENER * (mouseY - this.particles[this.particleCursor].y);
    }
  }

  continueBuilding() {
    this.end.x = mouseX;
    this.end.y = mouseY;
    let hypot = pointHypot(this.start, this.end);
    let requiredParticles = ceil(hypot / (APPROX_SPRING_LENGTH));
    while (this.particles.length < requiredParticles) {
      let prevPoint = this.particles.slice(-2)[0];
      let newX = (this.end.x + prevPoint.x)/2;
      let newY = (this.end.y + prevPoint.y)/2;
      this.particles.push(new Particle (mouseX, mouseY));
      this.end.x = newX;
      this.end.y = newY;
      this.end.v.x = 0;
      this.end.v.y = 0;
      this.end = this.particles.slice(-1)[0];
      this.springs.push(new Spring (this.particles.slice(-2)[0], this.particles.slice(-2)[1]));
    }
  }

  update() {
    if (mouseIsPressed && this.particleCursor != -1) {
      this.pullWithMouse(); //mouseX, mouseY are global
    } else {
      this.particleCursor = -1;
    }
    if (this.state == BUILDING) {
      this.continueBuilding();
    }
    for (let i=0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
    for (let i=0; i < this.springs.length; i++) {
      this.springs[i].update();
    }
  }
};



class Point {
  constructor (x=0, y=0) {
    this.x = x;
    this.y = y;
  }
}

class Particle extends Point{
  constructor (x=0, y=0, fixed=false) {
    super(x, y);
    this.v = new Point();
    this.fixed = fixed;
  }
  addGravity() {
    this.v.y += GRAVITY;
  }
  addForce(fx, fy) {
    this.v.x += (fx / PARTICLE_MASS);
    this.v.y += (fy / PARTICLE_MASS);
  }
  update() {
    this.addGravity();
    this.v.x *= DAMPENING;
    this.v.y *= DAMPENING;
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
    this.restLength = pointHypot(p1, p2);
  }

  currentLength() {
    return pointHypot(this.p1, this.p2);
  }

  update() {
    let dx = this.p1.x - this.p2.x;
    let dy = this.p1.y - this.p2.y;
    let dh = pointHypot(this.p1, this.p2);
    if (dh > 0.01) {
      let stretch = dh - this.restLength;
      let rForce = K * stretch;
      let fx = (dx / dh) * rForce;
      let fy = (dy / dh) * rForce;
      this.p1.addForce(-fx, -fy);
      this.p2.addForce(fx, fy);
    }
  }
}
