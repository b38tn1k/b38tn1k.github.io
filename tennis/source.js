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

let shapes = [];

class Shape {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
  }
  
  update() {
    // Move the shape
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Bounce off the edges
    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
    }
  }
  
  display() {
    // Draw the shape
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

// function preload() {
//   globalPlayers = loadStrings('t12Players.txt');
// }


function setupScreen() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('user-select', 'none');
  cnv.style('-webkit-user-select', 'none');
  cnv.style('-moz-user-select', 'none');
  cnv.style('-ms-user-select', 'none');
  frameRate(highFrameRate);
  let colors = []
  colors.push(color(179, 204, 102, 100)); // Light Yellow-Green (75% opacity)
  colors.push(color(153, 179, 77, 100));  // Medium Yellow-Green (75% opacity)
  colors.push(color(128, 153, 51, 100));  // Dark Yellow-Green (75% opacity)

  if (shapes.length < 20) {
    // Create initial shapes
    for (let i = 0; i < 20; i++) {
      const x = random(width);
      const y = random(height);
      const size = random(50, 200);
      // Define three muted yellow-green colors
      const c = random(colors); // Two random colors
      
      shapes.push(new Shape(x, y, size, c));
    }
  }
}

function setup() {
  setupScreen();
  availability = new Availability();
  scheduler = new Scheduler();
  
}

function draw() {
  clear();
    // Update and display shapes
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      
      shape.update();
      shape.display();
    }

  switch (mode) {
      case AVAILABILITY:
          scheduler.generated = false;
          availability.draw(cnv);
          break;
      case SCHEDULER:
        scheduler.draw(availability);
          break;
      default: // NO_CHANGE
          break;
  }
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}
