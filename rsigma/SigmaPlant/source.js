function deviceTurned() {
    setupScreen();
}

function windowResized() {
    setupScreen();
}

function mouseReleased() {
    const mouseHoldDuration = millis() - mousePressTime;
    if (
        mouseHoldDuration > mouseHoldDurationValue &&
        dist(mouseX, mouseY, mouseOldPos.x, mouseOldPos.y) < 20
    ) {
        mode.mouseReleased();
    }
    fpsEvent();
}

function keyPressed() {
    if (keyboardRequiresFocus == false) {
        if (key === ' ') {
            sess.saveSerializedPlant();
          }
          if (key === 'l') {
              sess.loadFromObject(JSONloader);
          }
          if (key === 'z') {
            sess.doUndo();
          }
    }
  }

function mousePressed() {
    fpsEvent();
    mousePressTime = millis();
    mouseOldPos = createVector(mouseX, mouseY);
    mode.mousePressed(mouseButton);
}

function preload() {
    loadJSON('assets/colors.json', loadColors);
    themes = loadJSON('assets/themes4.json');
    JSONloader = loadJSON('sandwich.json');
}

function setupScreen() {
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('user-select', 'none');
    cnv.style('-webkit-user-select', 'none');
    cnv.style('-moz-user-select', 'none');
    cnv.style('-ms-user-select', 'none');
    background(getColor('background'));
    frameRate(highFrameRate);
    lastInputTime = millis();
}

function mouseWheel(event) {
    mode.mouseWheel(event);
}

function touchMoved() {
    mode.touchMoved();
    return false;
}

function setup() {
    mode = new Loading();
    sess = new Session();
    setupMenu();
    setTheme(COLOR_THEME);
    setupScreen();
}

function draw() {
    if (millis() - lastInputTime > inputTimeout) {
        frameRate(lowFrameRate);
    }
    if (mouseIsPressed) {
        lastInputTime = millis();
    }
    clear();

    mode.draw(cnv);
    switch (mode.modeHandOff) {
        case APPLICATION:
            mode = new Application();
            break;
        case LANDING:
            mode = new Loading();
            break;
        default: // NO_CHANGE
            break;
    }
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
