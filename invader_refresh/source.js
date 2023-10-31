
var widthOnTwo, heightOnTwo;

function keyPressed() {
  if (key == ' ') {
    console.log('bang');
  }
  if (keyCode == DOWN_ARROW){

  return;
  }  else if (keyCode == LEFT_ARROW){

  return;
  }  else if (keyCode == UP_ARROW){

  return;
  }  else if (keyCode == RIGHT_ARROW){

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
  console.log(mouseX, mouseY)

}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
}

function setup() {

  setupScreen();
}

function draw() {
  clear();
  invader(windowWidth/2, windowHeight/2, 16, 8, 8)
  frameRate(2)
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function invader(x, y, pixelSize) {
  //crab 8 x 11
  //squid 8 x 8
  //octopus 8 x 12
  invLength = randomInRange(5, 7);
  invHeight = randomInRange(8, 8);
  fill(255);
  stroke(255);

  let maxVal = 0.0;
  let sum = 0;
  let count = 0;
  const grid = Array.from({ length: invLength }, (_, i) => 
    Array.from({ length: invHeight }, (_, j) => {
      let val = Math.random() * 2;
      val += Math.sin(Math.PI * 90 * i / invLength / 180);
      val += Math.sin(Math.PI * 180 * j / invHeight / 180);

      maxVal = Math.max(maxVal, val);
      return val;
    })
  );

  // Normalizing and calculating the threshold
  grid.forEach(row => row.forEach((cell, j) => {
    const normalizedCell = cell / maxVal;
    row[j] = normalizedCell;
    sum += normalizedCell;
    count++;
  }));
  const threshold = sum / count;

  // Drawing part
  for (let isMirrored of [false, true]) {
    for (let i = 0; i < invLength; i++) {
      for (let j = 0; j < invHeight; j++) {
        if (grid[isMirrored ? invLength - i - 1 : i][j] > threshold) {
          const xPos = x + (isMirrored ? i : i - invLength) * pixelSize;
          const yPos = y + j * pixelSize - Math.floor(invHeight / 2) * pixelSize;
          rect(xPos, yPos, pixelSize, pixelSize);
        }
      }
    }
  }
}
