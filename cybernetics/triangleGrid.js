/**
 * @description searches through an array and returns the index of the smallest element.
 *
 * @param { array } arr - array whose smallest element is to be found.
 *
 * @returns { integer } the index of the smallest element in the given array.
 */
function indexOfSmallest(arr) {
    if (arr.length === 0) {
        return -1; // Return -1 if the array is empty
    }

    let minIndex = 0; // Assume the first element is the smallest
    let minValue = arr[0]; // Initialize the minimum value

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < minValue) {
            // If the current element is smaller than the minimum value,
            // update the minimum value and its index
            minIndex = i;
            minValue = arr[i];
        }
    }

    return minIndex; // Return the index of the smallest element
}

/**
 * @description takes in `level`, `maxLevel`, `colorLow`, and `colorHigh` parameters
 * and interpolates a color between two provided colors based on the normalized level
 * value between 0 and 1.
 *
 * @param { number } level - 0-1 value that is used to interpolate the color output.
 *
 * @param { number } maxLevel - maximum value of the normalized level that can be
 * interpolated between `colorLow` and `colorHigh`.
 *
 * @param { object } colorLow - low-valued color used for interpolation in the
 * `lerpColor()` function.
 *
 * @param { "Color" } colorHigh - higher-quality color that the function will interpolate
 * between based on the normalized level value.
 *
 * 		- `colorHigh`: An instance of the `Vec3` class, representing a color in a
 * three-dimensional space. It is used for interpolation purposes and can have any
 * valid value within the range of a 3D color representation.
 *
 *
 * @returns { `RGBA` value. } a tri-colored gradient resulting from interpolating
 * between two given colors based on a normalized level value.
 *
 * 		- The `normalizedLevel` value ranges between 0 and 1, representing the level of
 * interpolation applied to the color values.
 * 		- The `colorLow` and `colorHigh` arguments provide the starting and ending colors,
 * respectively, for the interpolation.
 * 		- The function uses the `lerpColor` function internally to perform the interpolation,
 * which takes two color values and returns a new color value based on their proportions.
 */
function lerpTriColor(level, maxLevel, colorLow, colorHigh) {
    // Normalize the level value to a range between 0 and 1
    let normalizedLevel = level / maxLevel;
    // Interpolate color based on normalized level
    return lerpColor(colorLow, colorHigh, normalizedLevel);
}

class TriangleGrid extends Grid {
    /**
     * @description initializes member variables and generates a grid of triangles for visualization.
     *
     * @param { array } myColors - 10 colors that will be used to generate triangles in
     * the function.
     *
     * @param { integer } canvasSize - 2D size of the canvas on which the triangulated
     * shape will be rendered, and is used to calculate the size of each cell in the
     * triangular mesh.
     */
    // constructor(myColors, canvasSize, loader) {
    /**
     * @description sets properties and initializes objects for a Canvas class, including
     * `myColors`, `canvasSize`, `numCells`, `cellSize`, `mode`, and `triangles`. It also
     * calls the `generateTriangles()` function.
     *
     * @param { array } myColors - 16 colors of a Mona Lisa image to be generated and
     * displayed on a canvas using this constructor.
     *
     * @param { integer } canvasSize - size of the canvas where the grid will be drawn.
     */
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 20);
        this.triangles = [];
        this.myColors["hero"] = this.myColors["goldenYellow"];
        this.myColors["ideal"] = this.myColors["powderBlue"];
        this.generateTriangles();
        this.mapLow = 0;
        this.mapHigh = TWO_PI;
        this.osc = 0;
    }

    /**
     * @description iterates through a grid of cells, calculates the rotation and color
     * of each cell, and adds them to an array of triangles for rendering.
     */
    generateTriangles() {
        // let maxHypot = dist(0, 0, this.numCells, this.numCells);
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                let x = i * this.cellSize + this.cellSize / 2;
                let y = j * this.cellSize + this.cellSize / 2;
                // let hypot = dist(i, j, this.numCells, 0);
                // let ratio = hypot/maxHypot;
                let hint = this.calculateHint(i, j);
                let targetRotation = this.calculateRotation(x, y);
                let rotation = targetRotation;
                let c = color(this.myColors["brickRed"]);
                let onPath = false;
                this.triangles.push({ x, y, rotation, c, onPath, hint, targetRotation });
            }
        }
        this.rotateTriangles();
        this.colorTriangles();
    }

    /**
     * @description calculates the angle from a cell to the top right corner using the
     * differences between the x- and y-coordinates of the cell and the top right corner.
     *
     * @param { integer } x - 1D coordinate of a cell in a grid.
     *
     * @param { integer } y - 2nd coordinate of the point to calculate the distance from,
     * in the top right corner.
     *
     * @returns { angle measurement in radians. } an angle in radians measured from the
     * top-right corner of the grid.
     *
     * 	The output of the function is an angle in radians.
     */
    calculateHint(x, y) {
        // Calculate the distance from cell (x, y) to the top right corner
        let dx = this.numCells - 1 - x; // x-coordinate difference to top right corner
        let dy = 0 - y; // y-coordinate difference to top right corner
        // Calculate the angle from the cell to the top right corner using arctangent (atan2)
        let angle = Math.atan2(dy, dx);
        return angle;
    }

    /**
     * @description adjusts the rotations of all triangles in an array based on a target
     * rotation value, calculating the rotation difference and applying it to each
     * triangle's rotation value.
     */
    rotateTriangles() {
        // Calculate the rotation needed for the triangle on the bottom row of the first column
        let targetRotation = QUARTER_PI; //random(0, PI + HALF_PI);

        // Get the current rotation of the triangle on the bottom row of the first column
        let currentRotation = this.triangles[this.numCells - 1].rotation;

        // Calculate the rotation difference
        let rotationDifference = targetRotation - currentRotation;

        // Adjust rotation for all triangles in the array
        for (let triangle of this.triangles) {
            triangle.rotation += rotationDifference;
        }
        // let myTris = [];
        // for (let triangle of this.triangles) {
        //     myTris.push(triangle.rotation);
        // }
        // Create a JSON object
        // let jsonData = {
        //     triangles: myTris,
        // };
        // saveJSON(jsonData, "triangles.json");
    }

    /**
     * @description modifies the color of each triangle in an array of triangles based
     * on a rotation angle, constraining the position to within the bounds of the array.
     */
    colorTriangles(steps=100) {
        let position = this.numCells - 1;
        let rotations = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        let colors = [
            "peachCoral",
            "plumPurple",
            "brickRed",
            "burntSienna",
            "plumPurple",
            "peachCoral",
            "lightOrange",
            "darkGoldenOrange",
            "brickRed",
            "darkGoldenOrange",
        ];

        for (let t of this.triangles) {
            t.onPath = false;
            let rotation = Math.floor(degrees(t.rotation));
            if (rotation < 0) {
                rotation += 360;
            }
            if (rotation > 360) {
                rotation -= 360;
            }

            for (let i = 0; i < rotations.length; i++) {
                if (rotation < rotations[i] + 22.5 && rotation >= rotations[i] - 22.5) {
                    let rot = rotation;
                    while (rot > 45) {
                        rot -= 45;
                    }
                    t.c = lerpTriColor(rot, 45, this.myColors[colors[i]], this.myColors[colors[i + 1]]);
                }
            }
        }

        for (let i = this.numCells - 1; i <= this.numCells * (this.numCells - 1); i += this.numCells - 1) {
            this.triangles[i].c = this.myColors["ideal"];
        }
        rotations = [0, 45, 90, 135, 180, 225, 270, 315];

        let directions = [
            -1,
            this.numCells - 1,
            this.numCells,
            this.numCells + 1,
            1,
            -(this.numCells - 1),
            -this.numCells,
            -(this.numCells + 1),
        ];

        let breakFlag = false
        // for (let i = 0; i < 10; i++) {
        for (let i = 0; i < steps; i++) {
            if (position >= 0 && position < this.triangles.length - 1) {
                this.triangles[position].c = this.myColors["hero"];
                this.triangles[position].onPath = true;
                if (position == this.numCells * (this.numCells - 1)) {
                    i = 100;
                } else if (position % this.numCells == 0) {
                    i = 100;
                } else if (
                    position % this.numCells == this.numCells - 1 &&
                    position > (this.numCells / 2) * this.numCells
                ) {
                    i = 100;
                } else if (position > (this.numCells - 1) * this.numCells) {
                    i = 100;
                } else if (position < this.numCells / 2) {
                    i = 100;
                } else {
                    // Get the current triangle's rotation in degrees
                    let rotation = Math.floor(degrees(this.triangles[position].rotation));
                    if (rotation < 0) {
                        rotation += 360;
                    }

                    if (rotation < rotations[0] + 22.5 || rotation >= rotations[0] + 360 - 22.5) {
                        position += directions[0];
                    }
                    for (let i = 1; i < rotations.length; i++) {
                        if (rotation < rotations[i] + 22.5 && rotation >= rotations[i] - 22.5) {
                            position += directions[i];
                        }
                    }
                }
            }

            // Ensure the position stays within bounds
            position = constrain(position, 0, this.triangles.length - 1);
            if (breakFlag) {
                i = 101;
            }
        }
    }

    /**
     * @description generates a rotational value based on two input values, `x` and `y`,
     * using a noise scaling factor `noiseScale` and a noise function `noise()`. The
     * generated angle is then floored and multiplied by 45 to produce a range of 0-360
     * degrees.
     *
     * @param { number } x - 2D position of an object in a noise function used for
     * simulating the rotation of an object.
     *
     * @param { integer } y - 2D coordinate of a point in the noise space, which is used
     * to compute the rotation angle for that point based on the `noiseValue`.
     *
     * @returns { `Angles` value. } an angular value in the range of 0 to 360 degrees,
     * rounded to the nearest 45 degrees.
     *
     * 		- The function returns a value in radians, representing the angle of rotation
     * in the XY plane.
     * 		- The `noiseValue` variable is generated using a noise function, which takes two
     * inputs (x and y) and outputs a value between 0 and 1. This value is then multiplied
     * by 0.7 to determine the scale factor for the noise.
     * 		- The `angle` variable is computed by mapping the `noiseValue` value to a range
     * of 0 to 360 degrees using the `map()` function. This ensures that the angle of
     * rotation falls within a specific range.
     * 		- The `angle` variable is then floored using the `Math.floor()` function, and
     * the result is multiplied by 45 to convert it into a more convenient format for use
     * in subsequent calculations or transformations.
     */
    calculateRotation(x, y) {
        // let noiseScale = 0.005;
        let noiseScale = 0.1;
        let noiseValue = 0.7 * noise(x * noiseScale, y * noiseScale) + 0.3 * 0.25;
        let angle = map(noiseValue, 0, 1, 0, TWO_PI);
        // angle = Math.floor(degrees(angle) / 45) * 45;
        return angle;
    }

    /**
     * @description detects whether a mouse cursor is above a specific path on a 2D grid
     * by comparing the cursor position to the positions of the elements in the path. It
     * returns a boolean value indicating whether the cursor is above the path.
     *
     * @returns { boolean } a boolean value indicating whether the mouse is above a
     * specific path in a grid.
     */
    mouseAbovePath() {
        let my = Math.floor((mouseX / this.canvasSize) * this.numCells);
        let mx = Math.floor((mouseY / this.canvasSize) * this.numCells);
        let index = my * this.numCells + mx;
        // this.triangles[index].c = color(0);
        let xPath = null;
        let yPath = null;
        for (let i = 0; i < this.numCells; i++) {
            const pos = mx + this.numCells * i;
            if (this.triangles[pos].onPath == true) {
                // this.triangles[pos].c = color(0);
                xPath = this.triangles[pos];
            }
        }
        for (let i = (my - 1) * this.numCells; i < my * this.numCells; i++) {
            const pos = i + this.numCells;
            if (this.triangles[pos].onPath == true) {
                // this.triangles[pos].c = color(0);
                yPath = this.triangles[pos];
            }
        }
        let res = [-1, -1];
        if (xPath != null) {
            res[0] = xPath.x - mouseX > 0;
            res[1] = res[0];
        }
        if (yPath != null) {
            res[1] = yPath.y - mouseY > 0;
            if (res[0] == -1) {
                res[0] = res[1];
            }
        }

        if (res[0] == -1) {
            return false;
        } else {
            return res[0] && res[1];
        }
    }

    oscillateTriangles() {
        for (let t of this.triangles) {
            t.rotation = this.osc * t.targetRotation + (1 - this.osc) * t.hint;
            // t.rotation = t.targetRotation;
        }
    }

    /**
     * @description generates high-quality documentation for given code by rotating and
     * scaling triangles based on modifier and cell size values, and filling them with
     * color based on their center points.
     */
    static() {
        this.osc = (sin(millis() / 2000));
        rectMode(CENTER);
        if (mouseX > 0 && mouseX < this.canvasSize && mouseY > 0 && mouseY < this.canvasSize) {
            let root = 10 * this.canvasSize;
            let above = this.mouseAbovePath();
            for (let t of this.triangles) {
                let d = dist(t.x, t.y, mouseX, mouseY) / root;
                if (above == true) {
                    t.rotation -= d * d;
                    t.targetRotation -= d * d;
                } else {
                    t.rotation += d * d;
                    t.targetRotation += d * d;
                }
                // t.c = this.myColors["brickRed"];
            }
        } else {
            this.oscillateTriangles();
        }
        // let osc = (sin(millis() / 1000));
        // let osc = 0.002 * sin(millis() / 1000);
        // for (let t of this.triangles) {
        //     t.rotation += osc;
        // }
        // this.rotateTriangles();
        this.rotateTriangles();
        this.colorTriangles(100);

        let scale = 0.25;
        let point = 0.35;
        let cSize = this.modifier * this.cellSize;
        let counter = 0;
        let dim = this.cellSize * 0.75;
        let min = 10000;
        let max = -1000;
        for (let t of this.triangles) {
            if (t.rotation < 0) {
                t.rotation += TWO_PI;
            }
            if (t.rotation > TWO_PI) {
                t.rotation -= TWO_PI;
            }
            push();
            translate(t.x, t.y);
            if (t.c == this.myColors["hero"]) {
                rotate(this.modifier * t.rotation + PI);
                fill(t.c);
                scale = 0.25;
                point = 0.35;
                strokeWeight(this.cellSize * 0.1);
                stroke(t.c);
                triangle(-cSize * scale, -cSize * scale, cSize * scale, -cSize * scale, 0, cSize * point);
            } else if (t.c == this.myColors["ideal"]) {
                rotate(this.modifier * QUARTER_PI + PI);
                fill(t.c);
                scale = 0.25;
                point = 0.35;
                strokeWeight(this.cellSize * 0.1);
                stroke(t.c);
                triangle(-cSize * scale, -cSize * scale, cSize * scale, -cSize * scale, 0, cSize * point);
            } else {
                if (counter % 3 == 0) {
                    rotate(this.modifier * PI);
                    // fill(t.c);
                    fill(this.myColors["brickRed"]);
                    rotate(this.modifier * t.rotation + PI);
                    square(0, 0, this.modifier * this.cellSize * 0.75, 5);
                    fill(this.myColors["teal"]);
                    // let d = map(sin(2*t.rotation), this.mapLow, this.mapHigh, 0.25, 0.6);
                    let d = map(sin(2 * t.rotation), 0, 1, 0.25, 0.6);
                    rotate(this.modifier * t.rotation - PI);
                    square(0, 0, this.modifier * this.cellSize * d, 5);
                    if (t.rotation > max) {
                        max = t.rotation;
                    }
                    if (t.rotation < min) {
                        min = t.rotation;
                    }
                } else {
                    rotate(this.modifier * t.rotation + PI);
                    // fill(this.myColors["hero"]);
                    // circle(0, dim / 5, dim / 2);
                    // fill(this.myColors["brickRed"]);
                    // circle(0, -dim / 5, dim / 2);
                    strokeWeight(this.cellSize * 0.05);
                    if (counter % 3 == 1) {
                        stroke(this.myColors["teal"]);
                    }
                    if (counter % 3 == 2) {
                        stroke(this.myColors["brickRed"]);
                    }
                    noFill();
                    // fill(t.c)
                    scale = 0.15 * this.modifier;
                    point = 0.45 * this.modifier;
                    triangle(-cSize * scale, -cSize * scale, cSize * scale, -cSize * scale, 0, cSize * point);
                }
                // strokeWeight(this.cellSize * 0.05);
                // stroke(t.c);
                // noFill();
                // // fill(t.c)
                // scale = 0.15;
                // point = 0.5;
                // triangle(-cSize * scale, -cSize * scale, cSize * scale, -cSize * scale, 0, cSize * point);
            }

            noStroke();
            pop();
            counter += 1;
        }
        this.mapLow = min;
        this.mapHigh = max;
    }
}
