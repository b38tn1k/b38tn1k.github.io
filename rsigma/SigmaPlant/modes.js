class Mode {
/**
* @description Constructor initializes two properties:
* 
* 	- `modeHandOff` to `NO_CHANGE`
* 	- `ready` to `false`
*/
    constructor() {
        this.modeHandOff = NO_CHANGE;
        this.ready = false;
    }
/**
* @description The function mouseReleased(event) triggers when the user releases the 
* mouse button.
* 
* @param event - event is passed as an argument to the function and provides information 
* about the mouse release event that triggered the function call.
*/
    mouseReleased(event) {}

/**
* @description mousePressed(mouseButton) activates when a mouse button is pressed.
* 
* @param mouseButton - The `mouseButton` input parameter in the `mousePressed()` 
* function indicates the specific mouse button that was pressed.
*/
    mousePressed(mouseButton) {}

/**
* @description The function mouseWheel(event) handles the mouse wheel event.
* 
* @param event - The `event` input parameter in the `mouseWheel(event)` function is 
* a JavaScript event object that contains information about the mouse wheel event.
*/
    mouseWheel(event) {}

/**
* @description The function "draw()" is a method that is expected to draw something, 
* but its implementation is left unspecified.
*/
    draw() {}

/**
* @description The function touchMoved() monitors and responds to user gestures on 
* touch-sensitive devices.
*/
    touchMoved() {}
}

