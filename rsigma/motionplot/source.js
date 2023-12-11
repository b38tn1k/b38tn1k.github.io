
var widthOnTwo, heightOnTwo;

/**
* @description This function listens for keyboard events and logs "bang" to the
* console when the space bar is pressed or the arrow keys are clicked.
* 
* @returns {  } This function has multiple conditional statements that check the
* `key` and `keyCode` variables. If any of the conditions are met (e.g., `key == '
* '`), the `console.log('bang');` statement is executed.
*/
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

/**
* @description This function initializes the screen settings for a device turn on
* or startup event.
* 
* @returns { any } The output returned by the `deviceTurned()` function is undefined.
*/
function deviceTurned() {
  setupScreen();
}

/**
* @description This function registers an event listener for the "resize" event on
* the window object and calls the "setupScreen" function when the window is resized.
* 
* @returns { any } The output returned by the `windowResized()` function is `undefined`,
* as the function does not return a value.
*/
function windowResized() {
  setupScreen();
}

/**
* @description The function `mousePressed` logs the current mouse coordinates (x and
* y values) to the console whenever the mouse button is pressed.
* 
* @returns { any } The `mousePressed()` function logs the current mouse position (x
* and y coordinates) to the console using `console.log()`.
* 
* The output returned by this function is:
* 
* `mouseX: undefined mouseY: undefined`
* 
* Explanation:
* 
* 	- `mouseX` and `mouseY` are not defined or specified anywhere inside the function
* so they return `undefined`.
*/
function mousePressed() {
  console.log(mouseX, mouseY)

}

/**
* @description This function sets up the canvas dimensions and variables for the
* canvas's size.
* 
* @returns {  } The output of the `setupScreen` function is not defined or null
* because the function does not return any value.
*/
function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
}

/**
* @description This function sets up the screen.
* 
* @returns { any } The function `setup()` does not return any value as it is undefined.
* The function only contains an infinite recursive call to `setup Screen();` and no
* explicit return statement.
*/
function setup() {

  setupScreen();
}

/**
* @description The `draw()` function does nothing as it is currently empty.
* 
* @returns {  } The function `draw` does not return any value explicitly. When a
* function does not return anything explicitly and does not contain an error or
* exception thrown within its body as per ECMAScript standards the function will
* default return the undefined value if used like f(x) where 'x' may be a variable
* but when this value is assigned to something with no default assignment semantic
* then the variable takes a undefine value and if not taken it gets discarded/lost
* or just lost because nothing has captured/stored that particular returned value .
*/
function draw() {

}
