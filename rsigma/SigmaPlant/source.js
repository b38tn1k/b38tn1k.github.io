function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    menu.activate();
    menu.setPosition(mouseX, mouseY);
  }

  if (mouseButton === LEFT && menu.isActive == true) {
    menu.handleMousePress();
  }
}

function preload() {
  loadJSON('colors.json', loadColors);
  themes = loadJSON('themes.json');
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  background(getColor('background'));
  frameRate(lowFrameRate);
  lastInputTime = millis();
}

function mouseWheel(event) {
  zoom -= event.deltaY * 0.001;
  zoom = constrain(zoom, 0.5, 4);
  fpsEvent();
}

function setup() {
  setupMenu();
  setupScreen();
}

function draw() {
  if (millis() - lastInputTime > inputTimeout) {
    frameRate(lowFrameRate);
  } else {
    frameRate(highFrameRate);
  }
  clear();
  background(getColor('background'));
  scrollBoard();
  drawGrid();

  if (menu.isActive) {
    menu.display();
  }

}

document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
});
