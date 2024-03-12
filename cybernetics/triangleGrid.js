class TriangleGrid {
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
    constructor(myColors, canvasSize) {
        this.myColors = myColors;
        this.numCells = 10;
        this.canvasSize = canvasSize;
        this.cellSize = this.canvasSize / this.numCells;
        this.mode = 0;
        this.modifier = 0.0;
        this.triangles = [];
        this.generateTriangles();
    }

    /**
     * @description determines which action to perform based on the current mode and
     * performs it.
     */
    draw() {
        noStroke();
        switch (this.mode) {
            case 0:
                break;
            case 1:
                this.static();
                break;
            case 2:
                this.in();
                break;
            case 3:
                this.out();
                break;
            default:
                break;
        }
    }

    /**
     * @description iterates through a grid of cells, calculates the rotation and color
     * of each cell, and adds them to an array of triangles for rendering.
     */
    generateTriangles() {
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                let x = i * this.cellSize + this.cellSize / 2;
                let y = j * this.cellSize + this.cellSize / 2;
                let rotation = this.calculateRotation(x, y);
                let c = color(this.myColors["brickRed"]);
                this.triangles.push({ x, y, rotation, c });
            }
        }
        this.rotateTriangles();
        this.colorTriangles();
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
    }

    /**
     * @description modifies the color of each triangle in an array of triangles based
     * on a rotation angle, constraining the position to within the bounds of the array.
     */
    colorTriangles() {
        let position = this.numCells - 1;
        for (let i = this.numCells - 1; i <= this.numCells * (this.numCells - 1); i+= this.numCells-1) {
            this.triangles[i].c = this.myColors["goldenYellow"];
        }

        for (let i = 0; i < 100; i++) {
            if (position >= 0 && position < this.triangles.length) {
                this.triangles[position].c = this.myColors["teal"];
                if (position == this.numCells * (this.numCells - 1)) {
                    i = 100;
                } else {
                    // Get the current triangle's rotation in degrees
                    let rotation = Math.floor(degrees(this.triangles[position].rotation));
                    if (rotation == -45) {
                        position -= this.numCells + 1;
                    }
                    if (rotation == 0) {
                        position -= 1;
                    }
                    if (rotation == 45) {
                        position += this.numCells - 1;
                    }
                    if (rotation == 90) {
                        position += this.numCells;
                    }
                    if (rotation == 135) {
                        position += this.numCells + 1;
                    }
                    if (rotation == 180) {
                        position += 1;
                    }
                    if (rotation == -90) {
                        position -= this.numCells;
                    }
                    if (rotation == 225) {
                        position -= this.numCells - 1;
                    }
                }
            }

            // Ensure the position stays within bounds
            position = constrain(position, 0, this.triangles.length - 1);
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
        let noiseScale = 0.005;
        let noiseValue = 0.7 * noise(x * noiseScale, y * noiseScale) + 0.3 * 0.25;
        let angle = map(noiseValue, 0, 1, 0, 360);
        angle = Math.floor(angle / 45) * 45;
        return radians(angle);
    }

    /**
     * @description updates a parameter `static`, then increments and checks if the
     * `modifier` value exceeds 1, switching to mode 1 when that occurs.
     */
    in() {
        this.static();
        this.modifier += 0.1;
        if (this.modifier >= 1.0) {
            this.mode = 1;
        }
    }

    /**
     * @description reduces the modifier by 0.1 and sets mode to 0 when the modifier
     * reaches or is less than 0.
     */
    out() {
        this.static();
        this.modifier -= 0.1;
        if (this.modifier <= 0.0) {
            this.mode = 0;
        }
    }

    /**
     * @description generates high-quality documentation for given code by rotating and
     * scaling triangles based on modifier and cell size values, and filling them with
     * color based on their center points.
     */
    static() {
        let scale = 0.25;
        let point = 0.35;
        let cSize = this.modifier * this.cellSize
        for (let t of this.triangles) {
            push();
            translate(t.x, t.y);
            rotate(this.modifier * t.rotation + PI);
            fill(t.c);
            triangle(
                -cSize * scale,
                -cSize * scale,
                cSize * scale,
                -cSize * scale,
                0,
                cSize * point
            );
            pop();
        }
    }
}
