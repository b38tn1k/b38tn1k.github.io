const TEXT_WIDTH_MULTIPLIER = 1.5;
const TIGHT_DIM_GAP_PERCENT = 0.2;
const LOW_MID_DIM_GAP_PERCENT = 0.4;
const MID_DIM_GAP_PERCENT = 0.6;
const TAB_GROUP_BORDER = 40;

class Geometry extends Introspector {
/**
* @description The `constructor` function initializes an object with several properties 
* related to the board and screen positions, dimensions, and animation.
* 
* @param x - The `x` input parameter sets the initial board position of the cart.
* 
* @param { number } y - The `y` input parameter in the `constructor` function sets 
* the initial `y` position of the board.
* 
* @param { number } width - The `width` input parameter sets the width of the board.
* 
* @param { number } height - The `height` input parameter sets the height of the board.
*/
    constructor(x, y, width, height) {
        super();
        this.bCart = createVector(x, y); // board position
        this.bCartOld = createVector(x, y); // board position
        this.sCart = createVector(x, y); // screen position
        this.bDims = { w: width, h: height }; // board dims
        this.sDims = { w: 0, h: 0 }; // screen dims
        this.sMids = { w: 0, h: 0 }; // screen middle
        this.aDims = { w: width, h: height }; //animation dims
        this.manualOnScreen = false; // force is on screen with 'true'
    }

/**
* @description The function `clearBDims()` sets the width and height properties of 
* the object to zero, if animation is required.
*/
    clearBDims() {
        // set to 0 for animation if required
        this.bDims = { w: 0, h: 0 };
    }

/**
* @description The function `checkMouseOver` checks if the mouse is within the 
* boundaries of the game canvas.
* 
* @param { number } mouseX - The `mouseX` input parameter determines the horizontal 
* position of the mouse cursor within the canvas.
* 
* @param { number } mouseY - The `mouseY` input parameter determines the vertical 
* position of the mouse cursor relative to the game canvas.
* 
* @returns { boolean } - The output returned by the function is a boolean value 
* indicating whether the given mouse position is within the boundaries of the game 
* canvas.
*/
    checkMouseOver(mouseX, mouseY) {
        let inXRange =
            mouseX >= this.sCart.x && mouseX <= this.sCart.x + this.sDims.w;
        let inYRange =
            mouseY >= this.sCart.y && mouseY <= this.sCart.y + this.sDims.h;
        return inXRange && inYRange;
    }

/**
* @description The function `getIsOffLeft()` checks if the cart's x-position plus 
* the dims' width is less than zero.
* 
* @returns { boolean } - The output returned by this function is a boolean value 
* indicating whether the cart's x-position plus the dims' width is less than zero.
*/
    get isOffLeft() {
        return (this.sCart.x + this.sDims.w < 0);
    }

/**
* @description The function `isOffRight()` returns a boolean value indicating whether 
* the cart's x-coordinate is greater than the window width.
* 
* @returns { boolean } - The output returned by the function `getIsOffRight()` is a 
* boolean value, specifically `true` if the cart's x-coordinate is greater than the 
* window width, and `false` otherwise.
*/
    get isOffRight() {
        return (this.sCart.x > windowWidth)
    }

/**
* @description The function `getIsOffTop()` checks whether the sum of the current 
* cart position `y` and the dimensions height `h` is less than zero.
* 
* @returns { boolean } - The output returned by the `isOffTop()` function is a boolean 
* value, indicating whether the top edge of the sprite is below the top edge of the 
* game screen. The function calculates this by checking if the sum of the sprite's 
* y position and height is less than zero.
*/
    get isOffTop() {
        return (this.sCart.y + this.sDims.h < 0);
    }

/**
* @description The function `get isOffBottom()` checks if the cart's y-coordinate 
* is greater than the window height, indicating that the cart is off the bottom of 
* the window.
* 
* @returns { boolean } - The output returned by the `isOffBottom()` function is a 
* boolean value indicating whether the cart's y-position is greater than the window 
* height.
*/
    get isOffBottom() {
        return (this.sCart.y > windowHeight);
    }

/**
* @description The function `getOffDirection()` returns an object with four properties: 
* `left`, `right`, `top`, and `bottom`.
* 
* @returns { object } - The output returned by the `getOffDirection()` function is 
* an object with four properties: `left`, `right`, `top`, and `bottom`, each property 
* indicating whether the corresponding edge is off.
*/
    get offDirection () {
        return {left: this.isOffLeft, right: this.isOffRight, top: this.isOffTop, bottom: this.isOffBottom};
    }

/**
* @description The function getIsOnScreen returns a boolean value indicating whether 
* the object is currently on the screen.
* 
* @returns { boolean } - The output returned by this function is a boolean value 
* indicating whether the object is on screen or not.
*/
    get isOnScreen() {
        // big boolean in screen space to see if object is onscreen
        return (
            (this.sCart.x < windowWidth &&
                this.sCart.x + this.sDims.w > 0 &&
                this.sCart.y < windowHeight &&
                this.sCart.y + this.sDims.h > 0) ||
            this.manualOnScreen // and the manual force
        );
    }

/**
* @description The function `update(zoom)` adjusts the position and size of the game 
* board and its midpoint based on the given zoom value.
* 
* @param zoom - The `zoom` input parameter scales the game board and its dimensions 
* by a factor of its value.
*/
    update(zoom) {
        this.sCart = boardToScreen(this.bCart.x, this.bCart.y);
        this.sDims.w = this.bDims.w * zoom;
        this.sDims.h = this.bDims.h * zoom;
        this.sMids.w = this.sDims.w >> 1;
        this.sMids.h = this.sDims.h >> 1;
    }
}

class ParentDefinedGeometry extends Geometry {
/**
* @description The function constructor(x, y, size) initializes an object with the 
* following properties:
* 
* 	- bCart and sCart are createVector(0, 0)
* 	- bSqrDim, sSqrDim, and sSqrDimOn2 are set to size
* 	- bDims and sDims are set to { w: bSqrDim, h: bSqrDim } and { w: sSqrDim, h: 
* sSqrDim } respectively
* 	- bOffset is set to createVector(0, 0)
* 	- calculateOffsets() is called.
* 
* @param x - The `x` input parameter sets the width of the bounding square.
* 
* @param { number } y - The `y` input parameter in the `constructor` function sets 
* the position of the top-left corner of the bounding box.
* 
* @param { number } size - The `size` input parameter sets the dimensions of the 
* bounding square.
*/
    constructor(x, y, size) {
        super(x, y, size, size);
        // this.bCart = createVector(x, y);
        // this.sCart = createVector(0, 0);
        this.bSqrDim = size;
        this.static = true;
        this.sSqrDim = size;
        this.sSqrDimOn2 = size / 2;
        this.bDims = { w: this.bSqrDim, h: this.bSqrDim };
        this.sDims = { w: this.sSqrDim, h: this.sSqrDim };
        this.bOffset = createVector(0, 0);
        this.calculateOffsets();
    }

/**
* @description This function sets the width of the bounding dimensions (bDims) based 
* on the given text size (myTextSize), text width multiplier (textWidthMultiplier), 
* and data.
* 
* @param { number } myTextSize - The `myTextSize` input parameter specifies the 
* desired width of the text.
* 
* @param { number } textWidthMultiplier - The `textWidthMultiplier` input parameter 
* multiplies the width of the text.
* 
* @param { string } data - The `data` input parameter is used to retrieve the width 
* of the text, which is then multiplied by the `textWidthMultiplier` to set the width 
* of the bounding dimensions.
*/
    setBDimsWidth(myTextSize, textWidthMultiplier, data) {
        textSize(myTextSize);
        let wa = textWidth(data) * textWidthMultiplier;

        if (this.bDims.w != wa) {
            wa = max(wa, this.bSqrDim);
            this.bDims.w = wa;
            this.calculateOffsets();
        }
    }

/**
* @description The function `calculateOffsets()` adjusts the offset values of the 
* object based on the position of the cart. If the cart is at x=1.0, the offset.x 
* is set to -bDims.w. If the cart is at x=0.5, the offset.x is set to -bDims.w/2.
*/
    calculateOffsets() {
        if (this.bCart.x === 1.0) {
            this.bOffset.x = -this.bDims.w;
        }
        if (this.bCart.x === 0.5) {
            this.bOffset.x = -this.bDims.w / 2;
        }
        if (this.bCart.y === 1.0) {
            this.bOffset.y = -this.bDims.h;
        }
    }

/**
* @description The function `update(zoom, gp)` updates the position of an object's 
* sprite based on the given zoom factor and the position of the game object (gp).
* 
* @param { number } zoom - The `zoom` input parameter scales the dimensions of the 
* `this.sDims` and `this.sMids` variables by its value.
* 
* @param { object } gp - The `gp` input parameter provides the global position 
* (cartesian coordinates) of the bounding box that the function should update.
*/
    update(zoom, gp) {
        this.sDims.w = this.bDims.w * zoom;
        this.sDims.h = this.bDims.h * zoom;
        this.sMids.w = this.sDims.w >> 1;
        this.sMids.h = this.sDims.h >> 1;
        this.sSqrDim = this.sDims.h;
        this.sSqrDimOn2 = this.sSqrDim / 2;
        if (this.static == true) {
            const xs =
                gp.sCart.x +
                (this.bCart.x * gp.aDims.w + this.bOffset.x) * zoom;
            const ys =
                gp.sCart.y +
                (this.bCart.y * gp.aDims.h + this.bOffset.y) * zoom;
            this.sCart = createVector(xs, ys);
        } else {
            const xd =
                gp.sCart.x + this.bCart.x * gp.sDims.w + this.bOffset.x * zoom;
            const yd =
                gp.sCart.y + this.bCart.y * gp.sDims.h + this.bOffset.y * zoom;
            this.sCart = createVector(xd, yd);
        }
    }

/**
* @description The `getCenter()` function calculates and returns the center of the 
* square, given the position of the square and its size.
* 
* @returns { object } - The output returned by the `getCenter()` function is a 
* `createVector()` object with `clickX` and `clickY` coordinates, calculated as the 
* sum of `this.sCart.x` and `this.sSqrDimOn2`, and `this.sCart.y` and `this.sSqrDimOn2`, 
* respectively.
*/
    getCenter() {
        const clickY = this.sCart.y + this.sSqrDimOn2;
        const clickX = this.sCart.x + this.sSqrDimOn2;
        return createVector(clickX, clickY);
    }
}

