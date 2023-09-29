

/**
* @description The function drawS(x, y, w, h) draws a rectangle with the given 
* dimensions, using the lines: (x + w, y + h), (x + w, y + h/2), (x + w, y + h/2), 
* (x, y + h/2), and (x, y).
* 
* @param x - The `x` input parameter defines the starting point of the line segment.
* 
* @param { integer } y - The `y` input parameter in the `drawS` function defines the 
* starting point of the horizontal line segment.
* 
* @param { number } w - The `w` input parameter in the `drawS` function specifies 
* the width of the line segments that are drawn.
* 
* @param { number } h - The `h` input parameter in the `drawS` function determines 
* the height of the rectangle.
*/
function drawS(x, y, w, h) {
    line(x + w, y + h, x, y + h);
    line(x + w, y + h, x + w, y + h / 2);
    line(x + w, y + h / 2, x, y + h / 2);
    line(x, y + h / 2, x, y);
    line(x + w, y, x, y);
}

/**
* @description The function drawI(x, y, w, h) draws a line from (x + w / 2, y) to 
* (x + w / 2, y + h).
* 
* @param x - The `x` input parameter sets the starting point of the line.
* 
* @param y - The `y` input parameter in the `drawI` function determines the starting 
* point of the line.
* 
* @param { integer } w - The `w` input parameter in the `drawI` function specifies 
* the width of the line to be drawn.
* 
* @param h - The `h` input parameter in the `drawI` function specifies the height 
* of the line segment to be drawn.
*/
function drawI(x, y, w, h) {
    line(x + w / 2, y, x + w / 2, y + h);
}

/**
* @description The function drawG(x, y, w, h) draws a rectangular shape with the 
* given dimensions, using six lines to form its boundaries.
* 
* @param { number } x - The `x` input parameter specifies the starting point of the 
* line.
* 
* @param y - The `y` input parameter in the `drawG` function specifies the starting 
* point of the vertical lines.
* 
* @param w - The `w` input parameter specifies the width of the rectangle.
* 
* @param h - The `h` input parameter in the `drawG` function determines the height 
* of the rectangle.
*/
function drawG(x, y, w, h) {
    line(x, y + h, x + w, y + h);
    line(x, y + h, x, y);
    line(x, y, x + w, y);
    line(x + w, y + h / 2, x + w, y + h);
    line(x + w / 2, y + h / 2, x + w, y + h / 2);
}

/**
* @description The function drawM(x, y, w, h) draws a square with vertices at (x, y 
* + h), (x, y), (x + w / 2, y + h / 2), and (x + w, y).
* 
* @param x - The `x` input parameter specifies the starting point of the line.
* 
* @param { number } y - The `y` input parameter in the `drawM` function specifies 
* the starting point of the horizontal line segment.
* 
* @param w - The `w` input parameter in the `drawM` function specifies the width of 
* the rectangle.
* 
* @param { integer } h - The `h` input parameter in the `drawM` function specifies 
* the height of the rectangle.
*/
function drawM(x, y, w, h) {
    line(x, y + h, x, y);
    line(x, y, x + w / 2, y + h / 2);
    line(x + w / 2, y + h / 2, x + w, y);
    line(x + w, y, x + w, y + h);
}

/**
* @description The function drawA(x, y, w, h) draws a rectangle with rounded corners. 
* It creates three lines: two vertical lines and one horizontal line. The horizontal 
* line is centered at (x + w / 2, y) and has a length of w. The two vertical lines 
* are centered at (x, y + h) and (x + w, y + h) with a height of h.
* 
* @param { number } x - The `x` input parameter defines the starting point of the 
* line segment.
* 
* @param { number } y - The `y` input parameter in the `drawA` function determines 
* the starting point of the horizontal line segment that is drawn.
* 
* @param w - The `w` input parameter specifies the width of the rectangle to be drawn.
* 
* @param h - The `h` input parameter in the `drawA` function specifies the height 
* of the rectangle.
*/
function drawA(x, y, w, h) {
    line(x, y + h, x + w / 2, y);
    line(x + w / 2, y, x + w, y + h);
    line(x + w / 4, y + h / 2, x + (w * 3) / 4, y + h / 2);
}

/**
* @description The function drawP(x, y, w, h) draws a rectangle with vertical sides 
* of length w and horizontal sides of length h, centered at (x, y).
* 
* @param x - The `x` input parameter defines the starting point of the line segment.
* 
* @param { number } y - The `y` input parameter in the `drawP` function defines the 
* starting point of the vertical line segment.
* 
* @param w - The `w` input parameter specifies the width of the rectangle.
* 
* @param h - The `h` input parameter in the `drawP` function determines the height 
* of the rectangle.
*/
function drawP(x, y, w, h) {
    line(x, y, x, y + h);
    line(x, y, x + w, y);
    line(x + w, y, x + w, y + h / 2);
    line(x, y + h / 2, x + w, y + h / 2);
}

/**
* @description The function drawL(x, y, w, h) draws a line segment from (x, y) to 
* (x, y + h) and another from (x, y + h) to (x + w * 0.5, y + h).
* 
* @param x - The `x` input parameter sets the starting point of the line.
* 
* @param y - The `y` input parameter in the `drawL` function determines the starting 
* point of the line.
* 
* @param w - The `w` input parameter specifies the width of the line segment.
* 
* @param h - The `h` input parameter in the `drawL` function specifies the height 
* of the line segment.
*/
function drawL(x, y, w, h) {
    line(x, y, x, y + h);
    line(x, y + h, x + w * 0.5, y + h);
}

/**
* @description The function drawN(x, y, w, h) draws a rectangle with corners at (x, 
* y + h), (x, y), (x + w, y + h), and (x + w, y).
* 
* @param x - The `x` input parameter draws a line.
* 
* @param y - The `y` input parameter in the `drawN` function determines the starting 
* point of the vertical line segment.
* 
* @param w - The `w` input parameter specifies the width of the rectangle.
* 
* @param h - The `h` input parameter in the `drawN` function specifies the height 
* of the rectangle to be drawn.
*/
function drawN(x, y, w, h) {
    line(x, y + h, x, y);
    line(x, y, x + w, y + h);
    line(x + w, y + h, x + w, y);
}

/**
* @description The function drawT(x, y, w, h) draws two lines: one from (x, y) to 
* (x + w, y) and another from (x + w / 2, y) to (x + w / 2, y + h).
* 
* @param x - The `x` input parameter sets the starting point of the line.
* 
* @param y - The `y` input parameter draws a line from `x` to `x + w`.
* 
* @param { integer } w - The `w` input parameter in the `drawT` function specifies 
* the width of the line segment that is being drawn.
* 
* @param { number } h - The `h` input parameter in the `drawT` function determines 
* the height of the line segment that connects the midpoint of the right side of the 
* rectangle to the bottom of the rectangle.
*/
function drawT(x, y, w, h) {
    line(x, y, x + w, y);
    line(x + w / 2, y, x + w / 2, y + h);
}

class Loading extends Mode {
/**
* @description This constructor function sets up the layout of a text display on a 
* canvas, including calculating the position and size of each character and setting 
* up the background color.
*/
    constructor() {
        super();
        this.trigger = 0;
        const charWidth = min(windowWidth / 10, windowHeight / 10);
        const spacer = min(windowWidth / 40, windowHeight / 40);
        const charHeight = min(windowWidth / 10, windowHeight / 10);
        const startX = (windowWidth - (charWidth * 5 + 1.75 * spacer)) / 2; // Center 5 characters
        const startY = windowHeight / 2 - charHeight * 2; // windowH eight / 2 - charHeight * 0.5

        this.middleX = (windowWidth - charWidth) / 2;
        this.middleY = (windowHeight - charHeight) / 2;
        this.ratio = 1.0;
        this.letterPos = [];
        this.letterPos.push([startX, startY, charWidth, charHeight]);
        this.letterPos.push([
            startX + charWidth + spacer / 2,
            startY,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 2 + spacer,
            startY,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 3 + spacer * 2,
            startY,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 4 + spacer * 3,
            startY,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX,
            startY + charHeight * 1.5,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth + spacer * 1.5,
            startY + charHeight * 1.5,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 2 + spacer,
            startY + charHeight * 1.5,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 3 + 2 * spacer,
            startY + charHeight * 1.5,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 4 + spacer * 3,
            startY + charHeight * 1.5,
            charWidth,
            charHeight
        ]);
        this.transparentBG = getColor('background').levels;
        this.transparentBG[3] = 0;
        this.transparentBG = color(this.transparentBG);
    }
/**
* @description The function "mouseReleased(event)" returns true.
* 
* @param event - The `event` input parameter is passed to the function when the mouse 
* button is released.
* 
* @returns { boolean } - The output returned by the function "mouseReleased(event)" 
* is "true".
*/
    mouseReleased(event) {
        return true;
    }

/**
* @description This function returns true when the specified mouse button is pressed.
* 
* @param mouseButton - The `mouseButton` input parameter in the `mousePressed(mouseButton)` 
* function specifies the mouse button that was pressed.
* 
* @returns { boolean } - The output returned by this function is "true".
*/
    mousePressed(mouseButton) {
        return true;
    }

/**
* @description The function mouseWheel(event) allows the wheel event to pass through 
* and returns true.
* 
* @param { object } event - The `event` input parameter is passed to the function 
* and contains information about the event that triggered the function's execution.
* 
* @returns { boolean } - The function mouseWheel(event) returns the value true.
*/
    mouseWheel(event) {
        return true;
    }

/**
* @description The function drawTitle() draws the letters of the title in a specific 
* position using the lerp() function to smoothly move the letters from the starting 
* position to the final position.
*/
    drawTitle() {
        drawS(
            lerp(this.letterPos[0][0], this.middleX, this.ratio),
            lerp(this.letterPos[0][1], this.middleY, this.ratio),
            this.letterPos[0][2],
            this.letterPos[0][3]
        );
        drawI(
            lerp(this.letterPos[1][0], this.middleX, this.ratio),
            lerp(this.letterPos[1][1], this.middleY, this.ratio),
            this.letterPos[1][2],
            this.letterPos[1][3]
        );
        drawG(
            lerp(this.letterPos[2][0], this.middleX, this.ratio),
            lerp(this.letterPos[2][1], this.middleY, this.ratio),
            this.letterPos[2][2],
            this.letterPos[2][3]
        );
        drawM(
            lerp(this.letterPos[3][0], this.middleX, this.ratio),
            lerp(this.letterPos[3][1], this.middleY, this.ratio),
            this.letterPos[3][2],
            this.letterPos[3][3]
        );
        drawA(
            lerp(this.letterPos[4][0], this.middleX, this.ratio),
            lerp(this.letterPos[4][1], this.middleY, this.ratio),
            this.letterPos[4][2],
            this.letterPos[4][3]
        );
        drawP(
            lerp(this.letterPos[5][0], this.middleX, this.ratio),
            lerp(this.letterPos[5][1], this.middleY, this.ratio),
            this.letterPos[5][2],
            this.letterPos[5][3]
        );
        drawL(
            lerp(this.letterPos[6][0], this.middleX, this.ratio),
            lerp(this.letterPos[6][1], this.middleY, this.ratio),
            this.letterPos[6][2],
            this.letterPos[6][3]
        );
        drawA(
            lerp(this.letterPos[7][0], this.middleX, this.ratio),
            lerp(this.letterPos[7][1], this.middleY, this.ratio),
            this.letterPos[7][2],
            this.letterPos[7][3]
        );
        drawN(
            lerp(this.letterPos[8][0], this.middleX, this.ratio),
            lerp(this.letterPos[8][1], this.middleY, this.ratio),
            this.letterPos[8][2],
            this.letterPos[8][3]
        );
        drawT(
            lerp(this.letterPos[9][0], this.middleX, this.ratio),
            lerp(this.letterPos[9][1], this.middleY, this.ratio),
            this.letterPos[9][2],
            this.letterPos[9][3]
        );
    }

/**
* @description The `draw()` function controls the animation of a scrolling background 
* with a grid. It adjusts the frame rate based on the desired frame rate and the 
* current frame rate, and decrements a ratio value to control the scrolling.
*/
    draw() {
        frameRate(highFrameRate);
        background(getColor('background'));
        if (frameCount > 20) {
            const baseDecrement = 0.05;
            const desiredFrameRate = highFrameRate; // adjust this to the frame rate you designed the animation for
            const currentFrameRate = frameRate();
            const decrement =
                baseDecrement * (desiredFrameRate / currentFrameRate);

            if (this.ratio > 0) {
                this.ratio -= decrement;
                stroke(getColor('outline'));
            } else {
                if (this.trigger == 0) {
                    this.trigger = frameCount + 30;
                }
                scrollBoard(1.0);
                let colorRatio = (frameCount - (this.trigger - 30)) / 30.0;
                let interpColor = lerpColor(
                    getColor('background'),
                    getColor('gridline'),
                    colorRatio
                );
                drawGrid(interpColor);
                interpColor = lerpColor(
                    getColor('outline'),
                    this.transparentBG,
                    colorRatio
                ); // hard coded transparent onyx
                stroke(interpColor);
            }
        } else {
            stroke(getColor('outline'));
        }
        this.drawTitle();

        if (frameCount > this.trigger && this.trigger != 0) {
            this.modeHandOff = APPLICATION;
        }
    }
}

