// try multiple flow fields for diffent colors
// show the noise
// match the colors
// show the data
// repeat
//mouse edits flow maps differently (plus, minus) or turns trails on / off?

class Droplet {
    constructor(x, y, parent, c, grid) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.heading = 0;
        this.targetHeading = 0;
        this.dampening = 0.2;
        this.speed = 1;
        this.scaleTarget = 2;
        this.scale = 0;
        this.timer = random(500, 5000);
        this.amp = random(2, 8);
        this.osc;
        this.c = c;
        this.grid = grid;
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.parent.modifier * PI);
        fill(this.c);
        // circle(0, 0, this.parent.cellSize * this.scale);
        circle(0, 0, 1);
        pop();
    }

    update() {
        this.osc = sin(millis() / this.timer);
        this.scaleTarget = this.osc * this.amp;
        this.scale += (this.scaleTarget - this.scale) * this.dampening;
        let i = Math.floor(this.x / this.parent.numCells);
        let j = Math.floor(this.y / this.parent.numCells);
        this.targetHeading = this.grid[i][j].rotation;
        this.heading = (this.targetHeading - this.heading) * this.dampening;
        this.y += this.speed * cos(this.heading);
        this.x += this.speed * sin(this.heading);
        if (this.x > this.parent.canvasSize) {
            this.x = random(0, this.parent.canvasSize);
            this.scale = 0;
        }
        if (this.y > this.parent.canvasSize) {
            this.y = random(0, this.parent.canvasSize);
            this.scale = 0;
        }
        if (this.x < 0) {
            this.x = random(0, this.parent.canvasSize);
            this.scale = 0;
        }
        if (this.y < 0) {
            this.y = random(0, this.parent.canvasSize);
            this.scale = 0;
        }
    }
}

class FlowField extends Grid {
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 100);
        this.grids = [];
        for (let i = 0; i < 4; i++) {
            let offset = random(100000);
            let grid = this.generateNodes(offset);
            this.normaliseNodes(grid);
            this.rotateNodes(
                grid,
                int(random(0, this.numCells - 1)),
                int(random(0, this.numCells - 1)),
                random(-TWO_PI, TWO_PI)
            );
            this.grids.push(grid);
        }
        this.mapLow = 0;
        this.mapHigh = TWO_PI;
        this.osc = 0;
        this.nodes = [];
        this.counter = 0;

        for (let i = 0; i < 4 * this.numCells; i++) {
            let c = this.myColors["teal"];
            if (i % 4 == 1) {
                c = this.myColors["brickRed"];
            } else if (i % 4 == 2) {
                c = this.myColors["goldenYellow"];
            } else if (i % 4 == 3) {
                c = this.myColors["plumPurple"];
            }

            this.nodes.push(
                new Droplet(
                    random(this.cellSize, this.canvasSize - this.cellSize),
                    random(this.cellSize, this.canvasSize - this.cellSize),
                    this,
                    c,
                    this.grids[i % 4]
                )
            );
        }
    }

    generateNodes(offset) {
        let grid = Array.from({ length: this.numCells }, () => Array(this.numCells).fill(1));
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                let x = i * this.cellSize + this.cellSize / 2;
                let y = j * this.cellSize + this.cellSize / 2;
                let hint = this.calculateHint(i, j);
                let targetRotation = this.calculateRotation(x, y, offset);
                let rotation = targetRotation;
                let c = color(this.myColors["brickRed"]);
                let onPath = false;
                grid[i][j] = { x, y, rotation, c, onPath, hint, targetRotation };
            }
        }
        return grid;
    }

    calculateHint(x, y) {
        // Calculate the distance from cell (x, y) to the top right corner
        let dx = this.numCells - 1 - x; // x-coordinate difference to top right corner
        let dy = 0 - y; // y-coordinate difference to top right corner
        // Calculate the angle from the cell to the top right corner using arctangent (atan2)
        let angle = Math.atan2(dy, dx);
        return angle;
    }

    rotateNodes(grid, x, y, targetRotation) {
        let currentRotation = grid[x][y].rotation;

        // Calculate the rotation difference
        let rotationDifference = targetRotation - currentRotation;

        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                grid[i][j].rotation += rotationDifference;
            }
        }
    }

    normaliseNodes(grid) {
        let max = -100;
        let min = 100;
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                if (grid[i][j].rotation > max) {
                    max = grid[i][j].rotation;
                }

                if (grid[i][j].rotation < min) {
                    min = grid[i][j].rotation;
                }
            }
        }
        let mult = 1 / (max - min);
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                grid[i][j].rotation = map(grid[i][j].rotation, min, max, -TWO_PI, TWO_PI);
            }
        }
    }

    calculateRotation(x, y, offset) {
        let noiseScale = 0.01;
        let noiseValue = noise((x + offset) * noiseScale, (y + offset) * noiseScale);
        return noiseValue;
    }

    calculateHint(x, y) {
        let dx = this.numCells - 1 - x;
        let dy = 0 - y;
        let angle = Math.atan2(dy, dx);
        return angle;
    }

    static() {
        rectMode(CENTER);
        // this.counter += 0.1;
        // let k = int(this.counter) % 4;
        // for (let i = 0; i < this.numCells; i++) {
        //     for (let j = 0; j < this.numCells; j++) {
        //         push();
        //         translate(this.grids[k][i][j].x, this.grids[k][i][j].y);
        //         fill(map(this.grids[k][i][j].rotation, -PI, PI, 0, 255));
        //         square(0, 0, this.cellSize);
        //         pop();
        //     }
        // }

        for (let n of this.nodes) {
            n.update();
            n.draw();
        }
    }
}
