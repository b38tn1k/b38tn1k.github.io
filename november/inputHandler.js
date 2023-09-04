class InputHandler {
/**
* @description The function constructor(dims, offX, offY) initializes an object with 
* properties and methods related to a compass.
* 
* @param { object } dims - The `dims` input parameter provides the dimensions of the 
* viewport.
* 
* @param [offX=100] - The `offX` input parameter shifts the origin of the coordinate 
* system horizontally by 100 pixels.
* 
* @param [offY=100] - The `offY` input parameter sets the initial position of the 
* component on the Y-axis.
*/
  constructor(dims, offX=100, offY=100) {
    this.originY = dims.h - offX;
    if (dims.isTouchDevice == true) {
      this.originX = dims.w - offY;
    } else {
      this.originX = dims.cx;
    }
    this.x = 0;
    this.y  = 0;
    this.on = false;
    this.listenerTracker = false;
    this.listenerOn = false;
    this.cardinals = [radians(0), radians(90), radians(180), radians(270)];
    this.prevOn = false;
    this.prevA = 0;
  }
/**
* @description The function facing(sprite) determines the direction of the sprite 
* based on its angle relative to the caller.
* 
* @param { object } sprite - The `sprite` input parameter is used to determine the 
* direction of movement based on the angle between the current sprite and the sprite 
* being checked.
* 
* @returns { string } - The output returned by this function is a string indicating 
* the direction of the sprite relative to the current sprite, based on the angle 
* between the two sprites.
*/
  facing(sprite){
    let a = this.angleTo(sprite);
    let dir = 'unk';
    if (a >= 0) {
      dir = 'up';
    } else {
      dir = 'down';
    }
    if (a > radians(-45) && a < radians(45)) {
      dir = 'left';
    } else if (a > radians(135) || a < radians(-135)) {
      dir = 'right';
    }
    return dir;
  }
/**
* @description The function sets a change listener, establishing a reference to the 
* "on" method as the listener tracker and setting the listenerOn flag to true.
*/
  setChangeListener() {
    this.listenerOn = true;
    this.listenerTracker = this.on;
  }
/**
* @description This function checks if a listener is on or off and returns a boolean 
* value indicating whether the listener is currently on or off.
* 
* @returns { boolean } - The output returned by this function is a boolean value 
* indicating whether the listener is on or off. If the listener is on and the 
* listenerTracker is set to "on", the output will be false.
*/
  hasChanged() {
    let result = true;
    if (this.listenerOn == true) {
      if (this.listenerTracker == this.on) {
        result = false;
      } else {
        result = true;
        this.listenerOn = false;
      }
    } else {
      result = true;
    }
    return result;
  }
/**
* @description The function `checkToClose(sprite)` checks if the given sprite is 
* within a distance of 2 pixels from the current sprite, based on their x and y coordinates.
* 
* @param { object } sprite - The `sprite` input parameter is passed to the function 
* and used to compare the position of the current sprite with the position of the 
* sprite being checked.
* 
* @returns { boolean } - The output returned by the function is a boolean value, 
* specifically `flag`, which is set to `true` if the distance between the current 
* position of the sprite and the specified position of the `sprite` parameter is 
* less than or equal to 2 in both the x and y directions.
*/
  checkToClose(sprite) {
    let flag = false;
    if ((abs(this.x - sprite.tx) <= 2) && (abs(this.y - sprite.ty) <= 2)) {
      flag = true;
    }
    return flag;
  }
/**
* @description The `update()` function updates the values of `this.x`, `this.y`, and 
* `this.on` based on the mouse position and whether the mouse button is pressed.
*/
  update() {
    this.x = mouseX;
    this.y = mouseY;
    this.on = mouseIsPressed;
    if (this.prevOn != this.on) {
      this.originX = this.x;
      this.originY = this.y;
    }
    this.prevOn = this.on;
  }

/**
* @description The `angleToSprite` function calculates the angle between the current 
* position of the object and the position of the given sprite, in radians.
* 
* @param { object } sprite - The `sprite` input parameter provides the position of 
* the sprite to be used in the calculation of the angle.
* 
* @returns { number } - The output returned by the `angleToSprite` function is the 
* angle, in radians, between the sprite's position and the object's position.
*/
  angleToSprite(sprite){
    let dx = sprite.tx - this.x;
    let dy = sprite.ty - this.y;
    return atan2(dy, dx);
  }
/**
* @description The function `angleTo(sprite)` calculates and returns the previous 
* angle of the sprite relative to the origin or the current angle of the sprite if 
* it is touch device.
* 
* @param sprite - The `sprite` input parameter in the `angleTo()` function is used 
* to specify the sprite for which the angle is to be calculated.
* 
* @returns { number } - The output returned by the `angleTo()` function is the 
* previous angle of the sprite, calculated based on the current angle and the touch 
* device status. In case the touch device is not supported, the previous angle is 
* calculated based on the sprite's angle.
*/
  angleTo(sprite){
    if (this.checkToClose(sprite) == false) {
      if (G.dims.isTouchDevice == true) {
        this.prevA = this.angleToOrigin();
      } else {
        this.prevA = this.angleToSprite(sprite);
      }
    }
    return this.prevA;
  }
/**
* @description Calculates the angle between the line segment connecting the object's 
* origin and its current position, and the x-axis.
* 
* @returns { number } - The output returned by the `angleToOrigin()` function is the 
* angle in radians between the object's current position and its origin, calculated 
* using the `atan2()` function.
*/
  angleToOrigin() {
    let dx = this.originX - this.x;
    let dy = this.originY - this.y;
    return atan2(dy, dx);
  }
/**
* @description The function `getUnitVector(sprite)` returns a unit vector based on 
* the sprite's position and orientation. It checks if the sprite is close to the 
* origin or not, and if it is a touch device or not, then it returns the unit vector 
* accordingly.
* 
* @param { object } sprite - The `sprite` input parameter is passed to the function 
* and used to determine the unit vector.
* 
* @returns { array } - The output returned by this function is a unit vector. Depending 
* on the device type, the function returns either the unit vector from the origin 
* or the unit vector from the sprite, based on the value of G.dims.isTouchDevice.
*/
  getUnitVector(sprite) {
    if (this.checkToClose(sprite) == false) {
      if (G.dims.isTouchDevice == true) {
        return this.getUnitVectorFromOrigin();
      } else {
        return this.getUnitVectorFromSprite(sprite);
      }
    } else {
      return ([0, 0]);
    }
  }
/**
* @description The function "getUnitVectorFromSprite" calculates and returns a unit 
* vector based on the angle between the current sprite and the given sprite.
* 
* @param { object } sprite - The `sprite` input parameter provides the reference to 
* the sprite for which the unit vector is to be obtained.
* 
* @returns { array } - The output returned by this function is an array of two 
* numbers, [i, j], where i is the x-component and j is the y-component of the unit 
* vector that points from the origin to the sprite.
*/
  getUnitVectorFromSprite(sprite) {
    let i = -1 * cos(this.angleToSprite(sprite));
    let j = -1 * sin(this.angleToSprite(sprite));
    return [i, j];
  }
/**
* @description The function gets unit vector from origin.
* 
* @returns { array } - The output returned by the function `getUnitVectorFromOrigin()` 
* is an array of two elements, `i` and `j`, representing the unit vector from the 
* origin to the current position of the object, with `i` representing the component 
* of the vector along the x-axis and `j` representing the component along the y-axis.
*/
  getUnitVectorFromOrigin() {
    let i = -1 * cos(this.angleTo(this.originX, this.originY));
    let j = -1 * sin(this.angleTo(this.originX, this.originY));
    return [i, j];
  }
};

