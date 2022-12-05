function drawStartEnd(particles) {
  fill(255, 0, 0);
  circle(particles[0].x, particles[0].y, 5);
  circle(particles[particles.length-1].x, particles[particles.length-1].y, 5);
}

function draw2DParticles(particles, particleCursor){
  noStroke();
  for (let i = 0; i < particles.length; i++) {
    noStroke();
    fill(255);
    if (i == particleCursor) {
      fill(255, 0, 0);
    }
    circle(particles[i].x, particles[i].y, 5)
    fill(255, 255, 255, 10);
    circle(particles[i].x, particles[i].y, APPROX_SPRING_LENGTH);
  }
}

function draw2DCurve(particles) {
  stroke(255);
  noFill();
  beginShape();
  curveVertex(particles[0].x, particles[0].y);
  for (let i = 0; i < particles.length; i++) {
    curveVertex(particles[i].x, particles[i].y);
  }
  curveVertex(particles[particles.length-1].x, particles[particles.length-1].y);
  endShape();
}
