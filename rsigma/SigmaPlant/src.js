/*INSPIRATION: 
https://www.vestaboard.com/
https://www.etsy.com/listing/741800169/grand-central-station-clock-and-ceiling
https://www.ladismantler.com/porsche-911-993-carrera-s-gun-metal-gray-rare-instrument-gauges-5-pcs-set-oem/
HIGHLIGHTING RELATED / CONNECTED Components in proportionality
*/
function deviceTurned() {
    setupScreen();
}

/**
* @description The function windowResized() triggers the setupScreen() function.
*/
function windowResized() {
    setupScreen();
}

/**
* @description The function `mouseReleased` checks if the user has released the mouse 
* button and performs the action `mode.mouseReleased()` if the button was held for 
* more than a certain duration and the mouse position has moved less than 20 pixels 
* from the previous position.
*/
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

/**
* @description The function `keyPressed()` checks for keyboard input and performs 
* corresponding actions based on the pressed key:
* 
* 	- Spacebar: saves the serialized plant.
* 	- 'l': loads a plant from an object using `JSONloader`.
* 	- 'z': undoes the current zoom level.
* 	- 'r': redoes the current zoom level.
* 	- 'p': logs information about the active plant and the number of plants in the session.
*/
function keyPressed() {
    if (keyboardRequiresFocus == false) {
        if (key === ' ') {
            sess.saveSerializedPlant();
          }
          if (key === 'l') {
              sess.loadFromObject(JSONloader);
          }
          if (key === 'z') {
            sess.doUndo(globalZoom);
          }
          if (key === 'r') {
            sess.doRedo(globalZoom);
          }
          if (key === 'p') {
            console.log("FEATURES IN ACTIVE PLANT:");
            sess.plant.logPlant();
            console.log("NUMBER OF PLANTS:", sess.plants.length);
            for (let plant of sess.plants) {
                if (plant) {
                    console.log(plant.mode);
                } else {
                    console.log(plant);
                }
                
            }
          }
    }
  }

/**
* @description The function `mousePressed()` records the current time in milliseconds, 
* stores the previous mouse position, and calls the `fpsEvent()` function.
*/
function mousePressed() {
    fpsEvent();
    mousePressTime = millis();
    mouseOldPos = createVector(mouseX, mouseY);
    mode.mousePressed(mouseButton);
}

/**
* @description The function preload() loads JSON files 'assets/colors.json', 
* 'assets/themes4.json', and 'test.json' using the loadJSON() function, and assigns 
* the loaded data to variables themes and JSONloader.
*/
function preload() {
    loadJSON('assets/colors.json', loadColors);
    themes = loadJSON('assets/themes4.json');
    // JSONloader = loadJSON('sandwich.json');
    JSONloader = loadJSON('test2.json');
}

/**
* @description The function setupScreen() sets up the canvas element by:
* 
* 	- Creating a canvas with specified width and height.
* 	- Disabling user selection.
* 	- Setting the background color.
* 	- Setting the frame rate to high.
* 	- Recording the time of the last input.
*/
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

/**
* @description The function `mouseWheel(event)` calls the `mouseWheel()` method of 
* the `mode` object, passing the `event` parameter.
* 
* @param event - The `event` input parameter in the `mouseWheel()` function is used 
* to pass the mouse wheel event object to the `mode.mouseWheel()` method.
*/
function mouseWheel(event) {
    mode.mouseWheel(event);
}

/**
* @description The function touchMoved() triggers the mode.touchMoved() method.
* 
* @returns {  } - The output returned by the function "touchMoved" is "false".
*/
function touchMoved() {
    mode.touchMoved();
    return false;
}

/**
* @description This function sets up the game by creating instances of the Loading 
* and Session classes, setting up the menu, and initializing the theme and screen.
*/
function setup() {
    mode = new Loading();
    sess = new Session();
    setupMenu();
    setTheme(COLOR_THEME);
    setupScreen();
}

/**
* @description The function `draw` checks the time since the last input and adjusts 
* the frame rate accordingly. If the mouse is pressed, it updates the last input time.
*/
function draw() {
    if (millis() - lastInputTime > inputTimeout) {
        frameRate(lowFrameRate);
    }
    if (mouseIsPressed) {
        lastInputTime = millis();
    }
    clear();

    sess.plant.isActive

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

/**
* @description The function isTouchDevice() checks if the current device is a 
* touch-enabled device.
* 
* @returns { boolean } - The output returned by the function is a boolean value, 
* indicating whether the device is a touch device or not. The function checks if the 
* 'ontouchstart' property is present in the window object or if the navigator.maxTouchPoints 
* property is defined.
*/
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
