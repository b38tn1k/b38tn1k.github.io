class InvaderGrid {
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
        this.canvasSize = canvasSize;
        this.cellSize = this.canvasSize / 200;
        this.mode = 0;
        this.modifier = 0.0;
        this.sqrtNumInv = 10;
        this.numInvaders = this.sqrtNumInv * this.sqrtNumInv;
        this.geoIncrement = this.canvasSize / (this.sqrtNumInv + 1);
        this.invaders = [];
        for (let i = 0; i < this.numInvaders; i++) {
            this.invaders.push(this.invader());
        }
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
            this.modifier = 1.0;
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
            this.modifier = 0.0;
        }
        this.static();
    }

    static() {
        rectMode(CENTER);
        let theColors = ["teal", "brickRed", "goldenYellow"];
        let x = 0;
        let y = 0;
        let counter = 0;
        // Drawing part
        for (let i = 0; i < this.sqrtNumInv; i++) {
            x += this.geoIncrement;
            y = 0;
            for (let j = 0; j < this.sqrtNumInv; j++) {
                y += this.geoIncrement;
                let invader = this.invaders[counter];
                let grid = invader.grid;
                let threshold = invader.threshold;
                let invLength = invader.length;
                let invHeight = invader.height;
                fill(this.myColors[theColors[counter%theColors.length]]);

                for (let isMirrored of [false, true]) {
                    for (let i = 0; i < invLength; i++) {
                        for (let j = 0; j < invHeight; j++) {
                            if (grid[isMirrored ? invLength - i - 1 : i][j] > threshold) {
                                const xPos = x + (isMirrored ? i : i - invLength) * this.cellSize;
                                const yPos = y + j * this.cellSize - Math.floor(invHeight / 2) * this.cellSize;
                                push();
                                translate(xPos, yPos);
                                rotate(this.modifier * PI);
                                square(0, 0, this.modifier * (this.cellSize + 1));
                                pop();
                            }
                        }
                    }
                }
                counter += 1;
            }
        }
    }

    randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    invader() {
        //crab 8 x 11
        //squid 8 x 8
        //octopus 8 x 12
        let invLength = this.randomInRange(5, 7);
        let invHeight = this.randomInRange(8, 8);
        fill(255);
        stroke(255);

        let maxVal = 0.0;
        let sum = 0;
        let count = 0;
        const grid = Array.from({ length: invLength }, (_, i) =>
            Array.from({ length: invHeight }, (_, j) => {
                let val = Math.random() * 2;
                val += Math.sin((Math.PI * 90 * i) / invLength / 180);
                val += Math.sin((Math.PI * 180 * j) / invHeight / 180);

                maxVal = Math.max(maxVal, val);
                return val;
            })
        );

        // Normalizing and calculating the threshold
        grid.forEach((row) =>
            row.forEach((cell, j) => {
                const normalizedCell = cell / maxVal;
                row[j] = normalizedCell;
                sum += normalizedCell;
                count++;
            })
        );
        const threshold = sum / count;
        return { grid: grid, threshold: threshold, length: invLength, height: invHeight };
    }
}
