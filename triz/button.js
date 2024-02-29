class Button {
    /**
     * @description This constructor function takes four arguments: `x`, `y`, `w`, and
     * `h`. It sets the following properties of an object:
     * 
     * 	- `this.x`: The value of `x` is assigned to the `x` property of the object.
     * 	- `this.y`: The value of `y` is assigned to the `y` property of the object.
     * 	- `this.w`: The value of `w` is assigned to the `w` property of the object.
     * 	- `this.h`: The value of `h` is assigned to the `h` property of the object.
     * 	- `this.action`: The value of `action` is undefined.
     * 	- `this.debugMode`: The value of `debugMode` is set to `true`.
     * 
     * @param { number } x - In this constructor, `x` is a parameter that sets the value
     * of the `x` property of the object being constructed.
     * 
     * @param { number } y - The `y` input parameter in the constructor defines the
     * starting position of the rectangle's y-axis.
     * 
     * @param { number } w - In this constructor, `w` is the width of the rectangle. It
     * is used to initialize the `w` property of the object being created, which is a
     * field in the class that represents the width of the rectangle.
     * 
     * @param { number } h - The `h` input parameter in the constructor function defines
     * the height of the `Node` object. It is used to set the `h` property of the object,
     * which represents the vertical distance from the top of the node to the bottom.
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.action;
        this.debugMode = true;
    }

    /**
     * @description This function updates the visual representation of an object by drawing
     * a rectangle at its position with the specified width and height, depending on the
     * `debugMode` variable. If `debugMode` is true, the rectangle will be drawn with a
     * thick red border, otherwise it will have no fill or stroke.
     */
    update() {
        if (this.debugMode) {
            stroke(255, 0, 0);
            noFill();
            rect(this.x, this.y, this.w, this.h);
            noStroke();
        }
    }

    /**
     * @description This function checks if a mouse event occurred within a rectangular
     * area defined by the `x`, `y`, `w`, and `h` properties of an object. If the mouse
     * position is within the bounds of the rectangle, the function returns `true`.
     * Otherwise, it returns `false`.
     * 
     * @param { integer } mouseX - In the provided function, `mouseX` is a parameter that
     * represents the horizontal coordinate of the mouse pointer position relative to the
     * element. It is used to check whether the mouse pointer is within the boundaries
     * of the element.
     * 
     * @param { number } mouseY - In the provided code snippet, the `mouseY` input parameter
     * checks whether the mouse pointer is within the specified range of the element's
     * y-coordinate. Specifically, it checks whether the mouse pointer is located between
     * the element's top border and bottom border. If the mouse pointer falls within this
     * range, the function returns `true`, indicating that the mouse button was clicked
     * inside the element. Otherwise, it returns `false`.
     * 
     * @returns { boolean } The `checkMouse` function takes two parameters `mouseX` and
     * `mouseY`, which are the coordinates of the mouse position relative to the component.
     * The function checks if the mouse position falls within the bounds of the component,
     * specifically within the range of the x-coordinate and y-coordinate of the component's
     * size.
     * 
     * If the mouse position is within the component's boundaries, the function returns
     * `true`. Otherwise, it returns `false`.
     * 
     * In summary, the function checks if the mouse is hovering over the component, and
     * if so, returns `true`, otherwise it returns `false`.
     */
    checkMouse(mouseX, mouseY) {
        if (mouseX >= this.x && mouseX <= this.x + this.w && mouseY >= this.y && mouseY <= this.y + this.h) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description This function handles a mouse click event by checking if the mouse
     * position is within a certain range, and if so, executing an action (or function).
     * The function takes in two parameters: `mouseX` and `mouseY`, which represent the
     * coordinates of the mouse position on the screen.
     * 
     * @param { number } mouseX - In the `handleClick()` function, the `mouseX` input
     * parameter represents the x-coordinate of the mouse click position. It is used to
     * determine whether a click event has occurred within a specific area of the element
     * or widget. The value of `mouseX` is passed as an argument to the `checkMouse()`
     * function, which performs the actual check for a click event.
     * 
     * @param { number } mouseY - In the provided code snippet, `mouseY` is a parameter
     * passed to the `handleClick()` function that represents the Y coordinate of the
     * mouse event. It is used in conjunction with `mouseX` to determine the position of
     * the click event within the element being listened to. The `handleClick()` function
     * performs an action (passed through the `action` variable) if the mouse click occurs
     * within a certain range of coordinates.
     */
    handleClick(mouseX, mouseY) {
        if (this.checkMouse(mouseX, mouseY)) {
            if (this.action){
                this.action();
            }
        }
    }

    /**
     * @description This function changes the `debugMode` property of the object it's
     * defined in, by flipping its value from true to false (or vice versa) depending on
     * the current value.
     */
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
    }
}
