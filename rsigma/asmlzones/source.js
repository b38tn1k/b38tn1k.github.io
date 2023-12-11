/**
* @description The function `setup()` initializes the canvas and sets up the drawing
* context for WebGL rendering using the following steps:
* 
* 1/ Creates a canvas of windowWidth x windowHeight size.
* 2/ Sets the drawing mode to DEGREES.
*/
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
}

/**
* @description This function draws a grid of lines on the canvas using the `line` method.
*/
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

/**
* @description This function draws three cylinders of different sizes at different
* positions within the drawing area using the `cylinder` method.
*/
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

/**
* @description The `draw()` function clears the canvas to black (fill(0)), sets the
* stroke color to green (stroke(0%, 255%, 0%) and then rotates the canvas by 60
* degrees before drawing grid lines (using drawGrid()) and cylindrical shapes using
* the drawCylinder() function.
*/
function draw() {
  fill(0);
  stroke(0, 255, 0)
  rotateX(60); // Adjust the rotation for a good view
  drawGrid();
  drawCylinders();
}
