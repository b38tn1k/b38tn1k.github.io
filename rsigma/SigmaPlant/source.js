function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  fpsEvent();
  if (mouseButton === RIGHT) {
    menu.activate();
    menu.setPosition(mouseX, mouseY);
  }

  if (mouseButton === LEFT && menu.isActive == false) {
    plant.handleMousePress();
  }

  if (mouseButton === LEFT && menu.isActive == true) {
    const pressed = menu.handleMousePress();
    if (pressed === false) {
      menu.dismiss();
    }
  }
}

function preload() {
  loadJSON('colors.json', loadColors);
  themes = loadJSON('themes2.json');
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  background(getColor('background'));
  frameRate(lowFrameRate);
  lastInputTime = millis();
}

function mouseWheel(event) {
  if (menu.isActive == false && plant.isActive == false) {
    zoom -= event.deltaY * 0.001;
    zoom = constrain(zoom, 0.2, 2);
    fpsEvent();
  }
}

function setup() {
  setupPlant();
  setupMenu();
  setupScreen();
}

function draw() {
  textSize(myTextSize);
  if (millis() - lastInputTime > inputTimeout) {
    frameRate(lowFrameRate);
  } else {
    frameRate(highFrameRate);
  }
  clear();
  background(getColor('background'));
  scrollBoard();
  drawGrid();
  plant.update(zoom)

  // for (let i = 0; i < stations.length; i++) {
    
  //   stations[i].display(zoom);
  // }

  if (menu.isActive) {
    menu.display();
  }

}

document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
});
