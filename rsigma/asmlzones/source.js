function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
}

function drawGrid() {
  push();
  let gridSpacing = width * 0.05; // 5% of window width
  for (let x = -width; x < width; x += gridSpacing) {
    for (let y = -height; y < height; y += gridSpacing) {
      line(x, -height, x, height);
      line(-width, y, width, y);
    }
  }
  pop();
}

function drawCylinders() {
  push();
  // Bottom Cylinder
  
  translate(0, height * 0.125, 0); // 12.5% of window height
  rotateX(-90);
  cylinder(width * 0.15, height * 0.125); // 15% of window width, 12.5% of window height
  
  // Middle Cylinder
  translate(0, -height * 0.125, 0);
  cylinder(width * 0.10, height * 0.125); // 10% of window width, 12.5% of window height

  // Top Cylinder
  translate(0, -height * 0.125, 0);
  cylinder(width * 0.05, height * 0.125); // 5% of window width, 12.5% of window height
  pop();
}

function draw() {
  fill(0);
  stroke(0, 255, 0)
  rotateX(60); // Adjust the rotation for a good view
  drawGrid();
  drawCylinders();
}
