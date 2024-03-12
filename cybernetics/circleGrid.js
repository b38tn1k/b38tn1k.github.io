class CircleGrid {
    /**
     * @description sets instance variables and initializes objects, including myColors,
     * canvasSize, numCells, cellSize, mode, and modifier.
     * 
     * @param { array } myColors - 1D array of colors that define the appearance of each
     * cell in the game, with each element in the array specifying the color of a particular
     * cell.
     * 
     * @param { integer } canvasSize - size of the canvas that the code will operate on,
     * which is used to calculate the size of each cell in the grid.
     */
    constructor(myColors, canvasSize) {
        this.myColors = myColors;
        this.numCells = 10;
        this.canvasSize = canvasSize;
        this.cellSize = this.canvasSize / this.numCells;
        this.mode = 0;
        this.modifier = 0.0;
    }

    /**
     * @description is a utility function that adapts to the current state, performing
     * appropriate actions based on the mode parameter.
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
     * @description updates a modifier variable and changes its value depending on a
     * condition, then calls `static()` method.
     */
    in() {
        this.modifier += 0.1;
        if (this.modifier >= 1.0) {
            this.mode = 1;
            // setTimeout(() => {frameRate(1);}, 1000);
        }
        this.static();
    }

    /**
     * @description modifies the value of an object's `modifier` property by subtracting
     * a fraction (0.1) and sets its `mode` property to 0 if the modified value is below
     * 0.
     */
    out() {
        this.modifier -= 0.1;
        if (this.modifier <= 0.0) {
            this.mode = 0;
        }
        this.static();
    }

    /**
     * @description draws circles at coordinates based on cell size and canvas size. It
     * calculates distances from the center of the canvas, uses those distances to calculate
     * radii of outer and inner circles, and draws the circles using modifier color.
     */
    static() {
        rectMode(CENTER);
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                // Calculate center of current cell
                let x = i * this.cellSize + this.cellSize / 2;
                let y = j * this.cellSize + this.cellSize / 2;

                // Calculate distance from center of canvas
                let d = dist(x, y, this.canvasSize / 2, this.canvasSize / 2);

                // Calculate radius of outer circle
                let outerRadius = map(
                    d,
                    0,
                    this.canvasSize / 2,
                    (this.cellSize * 0.25) / 2,
                    (this.cellSize * 0.75) / 2
                );

                // Calculate radius of inner circle (starts at 33% of outer circle)
                let innerRadius = map(d, 0, this.canvasSize / 2, outerRadius * 0.9, outerRadius * 0.33);

                // Draw outer circle
                fill(this.myColors["brickRed"]);
                square(x, y, this.modifier * outerRadius * 1.75, 5);

                // Draw inner circle
                fill(this.myColors["teal"]);
                square(x, y, this.modifier * innerRadius * 1.75, 5);
            }
        }
    }
}
