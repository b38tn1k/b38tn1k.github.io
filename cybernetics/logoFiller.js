class RoamingPixel {
    /**
     * @description initializes a `Particle` object with randomly generated position,
     * velocity, and size, while ensuring the particle does not leave the canvas boundaries
     * or collide with itself.
     * 
     * @param { object } p - 4D particle object that contains the position, size, rotation,
     * and other parameters of the particles being generated, which are then used to
     * define the properties of the generated particles.
     */
    constructor(p) {
        this.p = p;
        this.x = random(0, p.canvasSize);
        this.y = random(0, p.canvasSize);
        // this.hypot = dist(this.x, this.y, this.p.canvasSizeOn2, this.p.canvasSizeOn2);
        // while (this.hypot > this.p.canvasSizeOn4) {
        //     this.x = random(0, p.canvasSize);
        //     this.y = random(0, p.canvasSize);
        //     this.hypot = dist(this.x, this.y, this.p.canvasSizeOn2, this.p.canvasSizeOn2);
        // }
        this.tx = random(0, this.p.canvasSize);
        this.ty = random(0, this.p.canvasSize);
        this.h = random(-TWO_PI, TWO_PI);
        this.th = random(-TWO_PI, TWO_PI);
        this.h = this.th + random(-QUARTER_PI, QUARTER_PI);
        this.s = 0.3;
        this.maxS = 2;
        // this.dim = Math.floor(random(1, 4)) * p.cellSize;
        this.dim = p.cellSize;
        this.r = this.dim * 0.2;
        this.damp = 0.02;
        this.damp2 = 0.2;
        this.rotationInertia = random(-2, 2);
    }

    /**
     * @description randomly generates a pair of coordinates within a specified range,
     * setting the position's x-coordinate and y-coordinate and maintaining the reference
     * to its parent container's canvas size.
     * 
     * @param { number } x - 2D position of a point within a canvas, where `this.p.canvasSizeOn4`
     * and `this.p.canvasSizeOn2` are configuration options defining the size of the
     * canvas, which is then used to randomly generate the position of the point within
     * the canvas.
     * 
     * @param { integer } y - 2D position of an entity or shape in the canvas, where the
     * entity's or shape's `x` position is determined by the `x` parameter passed to the
     * function and its `y` position is set randomly within a range defined by the
     * `canvasSizeOn4` variable.
     */
    setXY(x, y) {
        this.x = random(this.p.canvasSizeOn4, this.p.canvasSizeOn2 + this.p.canvasSizeOn4);
        this.y = random(this.p.canvasSizeOn4, this.p.canvasSizeOn2 + this.p.canvasSizeOn4);
        this.tx = x;
        this.ty = y;
    }

    /**
     * @description calculates the distance between an object and a point in polar
     * coordinates. It takes two arguments: the object's x and y positions, and the point's
     * x and y positions.
     * 
     * @param { 2D vector point coordinate location. } n - 2D point for which the distance
     * from the current position is to be calculated.
     * 
     * 		- `x`: The x-coordinate of `n`.
     * 		- `y`: The y-coordinate of `n`.
     * 
     * 
     * @returns { number } the distance between the object and the specified point in pixels.
     */
    distanceTo(n) {
        return dist(this.x, this.y, n.x, n.y);
    }

    /**
     * @description reduces the difference between its input and output by a factor
     * determined by `damp`, resulting in a smooth movement.
     * 
     * @param { number } i - Δx position of the oscillator at time `t`.
     * 
     * @param { integer } j - 3-dimensional vector that is added to the current position
     * of the object to be moved.
     * 
     * @returns { number } a value computed as the product of the difference between `i`
     * and `j`, multiplied by a damping factor `this.damp`.
     */
    dampedMove(i, j) {
        let res = (i - j) * this.damp;
        return res;
    }

    /**
     * @description updates an object's speed value by adding a portion of its damping
     * value, then caps the new value at the maximum allowed by the `maxS` parameter.
     * 
     * @param { number } p - 1-based multiplier for the speed increase, with larger values
     * resulting in faster movement and smaller values resulting in slower movement.
     */
    increaseSpeed(p = 1) {
        this.s += this.damp2;
        this.s = min(this.s, this.maxS);
    }

    /**
     * @description reduces the speed of an object based on a damping factor and a minimum
     * speed threshold.
     * 
     * @param { number } p - 2nd damping term coefficient for the velocity, which is used
     * to update the vehicle's speed value.
     */
    decreaseSpeed(p = 1) {
        this.s -= this.damp2;
        this.s = max(this.s, 0.5);
    }

    /**
     * @description calculates the distance between two points, `x` and `y`, using the
     * haversine formula, based on their coordinates `this.x` and `this.y`.
     * 
     * @param { number } x - 2D position of the first point in the distance calculation.
     * 
     * @param { number } y - 2nd point in space for which the distance to the 1st point
     * (`x`) is calculated.
     * 
     * @returns { number } the hypotenuse of the distance rectangle formed by the two
     * input points.
     */
    hypotTo(x, y) {
        return dist(x, y, this.x, this.y);
    }

    /**
     * @description calculates the angle between two points in a 2D coordinate system
     * using the atan2 function.
     * 
     * @param { number } x - coordinates of a point on the line connecting the `this`
     * object to the target point.
     * 
     * @param { float. } y - 2D coordinates of the point in question, which are used to
     * calculate the angle between it and the origin.
     * 
     * 		- `this.y - y`: This is the difference between the current instance's `y` value
     * and the given `y` value.
     * 		- `this.x - x`: This is the difference between the current instance's `x` value
     * and the given `x` value.
     * 
     * 
     * @returns { angle measurement in radians. } the angle between the given point and
     * the origin, measured in radians.
     * 
     * 		- The output is a mathematical function that takes two input parameters, x and
     * y.
     * 		- The function returns the angle between the lines starting from the point (x,
     * y) and ending at the point (0, 0).
     * 		- The output is a scalar value that ranges from -π to π.
     */
    angleAway(x, y) {
        return atan2(this.y - y, this.x - x);
    }

    /**
     * @description updates the position and rotation of an entity based on its inertia
     * and external forces, such as gravity and oscillations. It also updates the entity's
     * distance from its anchor point.
     */
    update() {
        this.th += radians(this.rotationInertia);
        this.h += this.dampedMove(this.th, this.h);
        this.x += this.dampedMove(this.tx, this.x);
        this.y += this.dampedMove(this.ty, this.y);
        // this.x += sin(millis() / this.f1) * this.cellSize;
        // this.y += Math.cos(millis() / this.f2) * this.cellSize;
        this.hypot = dist(this.x, this.y, this.p.canvasSizeOn2, this.p.canvasSizeOn2);
    }

    /**
     * @description scales an element based on its size ratio compared to a given reference
     * size, and rotates it by a certain angle using transformations. It then renders a
     * square of a specified size and color within the transformed space.
     */
    draw() {
        let scale;
        // if (this.hypot > this.p.canvasSizeOn2) {
        //     scale = 0;
        // } else {
        //     scale = 1.5 * (1 - this.hypot / this.p.canvasSizeOn2);
        // }
        scale = (1 - this.hypot / (this.p.canvasSize * 0.65));
        scale *= this.p.modifier;
        push();
        translate(this.x, this.y);
        rotate(this.h + this.p.modifier * TWO_PI);
        square(0, 0, max(1, this.dim * scale), this.r * this.p.modifier);
        pop();
    }

    /**
     * @description prints various values related to an object `this` to the console.
     */
    log() {
        console.log("tx", this.tx, "ty", this.ty, "th", this.th);
        console.log("x ", this.x, "y ", this.y, "h ", this.h);
    }
}

class Logo extends Grid {
    /**
     * @description sets up the necessary variables and initializes an array of pixels
     * for a logo displayed on a canvas of specified size, with cell size also specified.
     * 
     * @param { array } myColors - 2D array of color values that define the logo's pixels.
     * 
     * @param { number } canvasSize - 2D canvas size of the roaming pixels game, which
     * determines the number of pixels on the game board and the size of each pixel.
     */
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 50);
        this.canvasSizeOn2 = canvasSize / 2;
        this.canvasSizeOn4 = canvasSize / 4;
        this.image = logo;
        this.scaleX = this.image.width / this.canvasSize;
        this.scaleY = this.image.height / this.canvasSize;
        this.nodes = [];
        this.counter = 0;
        for (let i = 0; i < this.canvasSize; i += this.cellSize) {
            for (let j = 0; j < this.canvasSize; j += this.cellSize) {
                let a = this.mapToImageAlpha(i, j);
                if (a != 0) {
                    let n = new RoamingPixel(this);
                    n.setXY(i, j);
                    this.nodes.push(n);
                }
            }
        }
    }

    /**
     * @description maps a coordinate (x, y) within an image to an alpha value, constraining
     * the coordinate within the image bounds and returning the alpha value of the
     * corresponding pixel color.
     * 
     * @param { number } x - 2D coordinates of a point within the image, and is multiplied
     * by the `scaleX` variable to obtain the x-coordinates of the corresponding pixel
     * in the image.
     * 
     * @param { integer } y - vertical coordinate of the point on the image, which is
     * multiplied by the scale factor to obtain the equivalent pixel location in the image.
     * 
     * @returns { `alpha` value. } an alpha value between 0 and 1, calculated based on
     * the position of a pixel in the input image and the scale factors of the image.
     * 
     * 		- `alphaValue`: A value representing the alpha channel (transparency) of the
     * image, with values ranging from 0 (completely transparent) to 1 (opaque).
     */
    mapToImageAlpha(x, y) {
        let imageX = x * this.scaleX;
        let imageY = y * this.scaleY;
        imageX = constrain(imageX, 0, this.image.width - 1);
        imageY = constrain(imageY, 0, this.image.height - 1);
        let pixelColor = this.image.get(imageX, imageY);
        let alphaValue = alpha(pixelColor);
        return alphaValue;
    }

    /**
     * @description updates the nodes and drawing them on the canvas with different colors
     * based on their position and a modular counter.
     */
    static() {
        let modder = 20;
        let number = 1;
        let maxHypot = this.canvasSize;
        if (mouseX > 0 && mouseX < this.canvasSize && mouseY > 0 && mouseY < this.canvasSize) {
            number = int(map(mouseX, 0, this.canvasSize, 1, 50));
            modder  = int(map(mouseX, 0, this.canvasSize, 20, 5));
            maxHypot = map(mouseY, this.canvasSize, 0, this.cellSize * 3, this.canvasSize);
        }

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].update();
        }
        this.counter += 1;
        if (this.counter % modder == 0) {
            for (let i = 0; i < number; i++) {
                let randomChoice1 = Math.floor(random(this.nodes.length));
                let i = this.nodes[randomChoice1];

                let randomChoice2 = Math.floor(random(this.nodes.length));
                let j = this.nodes[randomChoice2];
                let dif = i.distanceTo(j);
                while (dif > maxHypot) {
                    randomChoice2 = Math.floor(random(this.nodes.length));
                    j = this.nodes[randomChoice2];
                    dif = i.distanceTo(j);
                }
                let [tx, ty, th] = [i.tx, i.ty, i.th];
                i.tx = j.tx;
                i.ty = j.ty;
                i.th = j.th;
                j.tx = tx;
                j.ty = ty;
                j.th = th;
            }
        }

        for (let i = 0; i < this.nodes.length; i++) {
            if (i % 2 == 0) {
                fill(this.myColors["brickRed"]);
            } else {
                fill(this.myColors["teal"]);
            }
            this.nodes[i].draw();
        }

        // for (let i = 0; i < this.canvasSize; i += this.cellSize) {
        //     for (let j = 0; j < this.canvasSize; j += this.cellSize) {
        //         let a = this.mapToImageAlpha(i, j);
        //         if (a != 0) {
        //             square(i, j, this.cellSize);
        //         }
        //     }
        // }
    }
}
