function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mouseReleased() {
  const mouseHoldDuration = millis() - mousePressTime;

  if (mouseHoldDuration > mouseHoldDurationValue && dist(mouseX, mouseY, mouseOldPos.x, mouseOldPos.y) < 20 && plant.isActive == false) {
    menu.activate();
    menu.setPosition(mouseX, mouseY);
  }
  fpsEvent();
}

function mousePressed() {
  fpsEvent();
  mousePressTime = millis();
  mouseOldPos = createVector(mouseX, mouseY);
  if (mouseButton === RIGHT && menu.isActive == false) {
    setTimeout(() => {
      menu.activate();
      menu.setPosition(mouseX, mouseY);
    }, 100);
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
  loadJSON('assets/colors.json', loadColors);
  themes = loadJSON('assets/themes4.json');
  // robotoMono = loadFont('/assets/Roboto_Mono/static/RobotoMono-Medium.ttf');
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
  setTheme(COLOR_THEME);
  setupScreen();
}

function draw() {
  textSize(myTextSize);
  if (millis() - lastInputTime > inputTimeout) {
    frameRate(lowFrameRate);
  }
  if (mouseIsPressed) {
    lastInputTime = millis();
  }
  clear();
  scrollBoard();
  drawGrid();
  plant.update(zoom)
  menu.display();
  noStroke();
  fill(255);
  textSize(12);
  text('FPS: ' + int(frameRate()).toString(), windowWidth - 75, 50);

}

document.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});
