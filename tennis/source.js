function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function keyPressed() {
}

function mousePressed() {
}


function setupScreen() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('user-select', 'none');
  cnv.style('-webkit-user-select', 'none');
  cnv.style('-moz-user-select', 'none');
  cnv.style('-ms-user-select', 'none');
  frameRate(highFrameRate);
}

function setup() {
  setupScreen();
  availability = new Availability();
}

function draw() {
  clear();
  switch (mode) {
      case AVAILABILITY:
          availability.draw(cnv);
          break;
      case SCHEDULER:
          break;
      default: // NO_CHANGE
          break;
  }
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}
