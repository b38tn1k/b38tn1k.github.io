// link to the 3 paragraphs

/**
 * @description sets various animation parameters based on a given integer value,
 * ranging from 1 to 3, which correspond to different visual effects for the "wwdeliver"
 * animations canvas.
 * 
 * @param { number } n - 1 of 3 predefined animations to be applied to the `wwdeliver`
 * animations array, with each value correspondent to a specific animation configuration.
 */
function zoomGridSetting(n) {
    switch (n) {
        case 1:
            animations["wwdeliver"].easeX = 0;
            animations["wwdeliver"].easeY = animations["wwdeliver"].canvasSize;
            animations["wwdeliver"].easeORS = 0.5;
            animations["wwdeliver"].easeORE = 0.375;
            animations["wwdeliver"].easeIRS = 0.25;
            animations["wwdeliver"].easeIRE = 0.5;
            break;
        case 2:
            animations["wwdeliver"].easeX = animations["wwdeliver"].canvasSize / 2;
            animations["wwdeliver"].easeY = animations["wwdeliver"].canvasSize / 2;
            animations["wwdeliver"].easeORS = 0.5;
            animations["wwdeliver"].easeORE = 0.2;
            animations["wwdeliver"].easeIRS = 0.8;
            animations["wwdeliver"].easeIRE = 0.25;
            break;
        case 3:
            animations["wwdeliver"].easeX = animations["wwdeliver"].canvasSize;
            animations["wwdeliver"].easeY = 0;
            animations["wwdeliver"].easeORS = 0.5;
            animations["wwdeliver"].easeORE = 0.375;
            animations["wwdeliver"].easeIRS = 0.25;
            animations["wwdeliver"].easeIRE = 0.5;
            break;
    }
}

class ZoomGrid extends Grid {
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
        super(myColors, canvasSize, 10);
        this.targetX = this.canvasSize;
        this.targetY = 0;
        this.easeX = this.targetX;
        this.easeY = this.targetY;
        this.outerRatioStart = 0.5;
        this.outerRatioEnd = 0.375;
        this.innerRadiusStart = 0.25;
        this.innerRadiusEnd = 0.5;
        this.easeORS = 0.5;
        this.easeORE = 0.375;
        this.easeIRS = 0.25;
        this.easeIRE = 0.5;
    }

    /**
     * @description draws circles at coordinates based on cell size and canvas size. It
     * calculates distances from the center of the canvas, uses those distances to calculate
     * radii of outer and inner circles, and draws the circles using modifier color.
     */
    static() {
        rectMode(CENTER);
        this.targetX += (this.easeX - this.targetX) * 0.05;
        this.targetY += (this.easeY - this.targetY) * 0.05;
        this.outerRatioStart += (this.easeORS - this.outerRatioStart) * 0.05;
        this.outerRatioEnd += (this.easeORE - this.outerRatioEnd) * 0.05;
        this.innerRadiusStart += (this.easeIRS - this.innerRadiusStart) * 0.05;
        this.innerRadiusEnd += (this.easeIRE - this.innerRadiusEnd) * 0.05;
        let timeNow = (sin(millis() / 1000)) / 2.0;
        let tx =  this.targetX +  this.cellSize * timeNow;
        let ty = this.targetY +  this.cellSize * timeNow;

        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                // Calculate center of current cell
                let x = i * this.cellSize + this.cellSize / 2;
                let y = j * this.cellSize + this.cellSize / 2;
                if (mouseX > 0 && mouseX < this.canvasSize && mouseY > 0 && mouseY < this.canvasSize) {
                    this.easeX = mouseX;
                    this.easeY = mouseY;
                    this.easeORS = 0.5;
                    this.easeORE = 0.2;
                    this.easeIRS = 0.8;
                    this.easeIRE = 0.25;
                }

                let d = dist(x, y, tx, ty);
                let outerRadius = map(
                    d,
                    0,
                    this.canvasSize / 2,
                    this.cellSize * this.outerRatioStart,
                    this.cellSize * this.outerRatioEnd
                );

                // Calculate radius of inner circle (starts at 33% of outer circle)
                let innerRadius = map(
                    d,
                    0,
                    this.canvasSize / 2,
                    outerRadius * this.innerRadiusStart,
                    outerRadius * this.innerRadiusEnd
                );
                // d = dist(mouseX, mouseY, x, y);

                // Calculate radius of inner circle (starts at 33% of outer circle)

                push();
                translate(x, y);
                // Draw outer circle
                fill(this.myColors["brickRed"]);
                rotate(this.modifier * HALF_PI);
                square(0, 0, this.modifier * outerRadius * 1.75, 5);

                // Draw inner circle
                fill(this.myColors["teal"]);
                square(0, 0, this.modifier * innerRadius * 1.75, 5);
                pop();
            }
        }
    }
}
