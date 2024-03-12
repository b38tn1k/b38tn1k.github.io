class CircleGrid {
    constructor(myColors, canvasSize) {
        this.myColors = myColors;
        this.numCells = 10;
        this.canvasSize = canvasSize;
        this.cellSize = this.canvasSize / this.numCells;
        this.mode = 0;
        this.modifier = 0.0;
    }

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

    in() {
        this.modifier += 0.1;
        if (this.modifier >= 1.0) {
            this.mode = 1;
            // setTimeout(() => {frameRate(1);}, 1000);
        }
        this.static();
    }

    out() {
        this.modifier -= 0.1;
        if (this.modifier <= 0.0) {
            this.mode = 0;
        }
        this.static();
    }

    static() {
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
                ellipse(x, y, this.modifier * outerRadius * 2, this.modifier * outerRadius * 2);

                // Draw inner circle
                fill(this.myColors["teal"]);
                ellipse(x, y, this.modifier * innerRadius * 2, this.modifier * innerRadius * 2);
            }
        }
    }
}
