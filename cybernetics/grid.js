class Grid {
    /**
     * @description Initializes common properties for subclasses.
     *
     * @param { array } myColors - 1D array of colors that define the appearance of each
     * cell in the game.
     *
     * @param { integer } canvasSize - Size of the canvas that the code will operate on,
     * used to calculate the size of each cell in the grid.
     */
    constructor(myColors, canvasSize, numCells) {
        this.myColors = myColors;
        this.canvasSize = canvasSize;
        this.mode = 0;
        this.modifier = 0.0;
        this.numCells = numCells;
        this.cellSize = this.canvasSize / this.numCells;
    }

    /**
     * @description Utility function that adapts to the current state, performing
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
     * @description Updates a modifier variable and changes its value depending on a
     * condition, then calls `static()` method.
     */
    in() {
        this.modifier += 0.05;
        if (this.modifier >= 1.0) {
            this.modifier = 1.0;
            this.mode = 1;
        }
        this.static();
    }

    /**
     * @description Modifies the value of the modifier property by subtracting
     * a fraction (0.1) and sets the mode property to 0 if the modified value is below 0.
     */
    out() {
        this.modifier -= 0.1;
        if (this.modifier <= 0.0) {
            this.mode = 0;
            this.modifier = 0.0;
        }
        this.static();
    }
}
