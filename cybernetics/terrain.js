// Function to interpolate color based on grid level
function lerpGridColor(level, maxLevel, colorLow, colorHigh) {
    // Normalize the level value to a range between 0 and 1
    let normalizedLevel = level / maxLevel;
    // Interpolate color based on normalized level
    return lerpColor(colorLow, colorHigh, normalizedLevel);
}

function wrapAngle(a) {
    if (a < 0) {
        a += TWO_PI;
    }

    if (a > TWO_PI) {
        a -= TWO_PI;
    }
}

function exploreGridUncovered(planeX, planeY, coverToggle, gridUncovered) {
    let targetX = planeX;
    let targetY = planeY;

    // Initialize queue for BFS
    let queue = [{ x: planeX, y: planeY }];

    // Set to store visited cells
    let visited = new Set();

    // Perform BFS
    while (queue.length > 0) {
        // Dequeue a cell
        let { x, y } = queue.shift();

        // Check if the cell is within bounds and not visited
        if (x >= 0 && x < gridUncovered.length && y >= 0 && y < gridUncovered[x].length && !visited.has(`${x},${y}`)) {
            // Mark the cell as visited
            visited.add(`${x},${y}`);

            // Check if the cell is not equal to the coverToggle
            if (gridUncovered[x][y] !== coverToggle) {
                // Set the target position to the first unexplored cell found
                targetX = x;
                targetY = y;
                break; // Stop exploring once the target is found
            }

            // Enqueue neighboring cells
            enqueueNeighbors(queue, x, y);
        }
    }

    // Return the target position
    return { targetX, targetY };
}

function enqueueNeighbors(queue, x, y) {
    // Define relative directions for neighboring cells (up, down, left, right)
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    // Enqueue neighboring cells
    for (let [dx, dy] of directions) {
        queue.push({ x: x + dx, y: y + dy });
    }
}

class Terrain extends Grid {
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 101);
        this.grid = Array.from({ length: this.numCells }, () => Array(this.numCells).fill(1));
        this.gridOutline = Array.from({ length: this.numCells }, () => Array(this.numCells).fill(1));
        this.gridUncovered = Array.from({ length: this.numCells }, () => Array(this.numCells).fill(false));
        this.maxLevel = 7;
        this.createTerrain();
        this.normaliseTerrain();
        this.normaliseTerrain();
        this.quantiseTerrain();
        this.carveTerrain();
        this.coverToggle = true;
        this.coverCounter = 0;
        this.plane = {
            targetX: this.canvasSize / 2,
            targetY: this.canvasSize / 2,
            targetI: int(this.numCells / 2),
            targetJ: int(this.numCells / 2),
            x: this.canvasSize / 2,
            y: this.canvasSize / 2,
            rotation: 0,
            targetRotation: 0,
            speed: 3,
        };
        this.canvasSizeOn2 = this.canvasSize * 0.5;
        this.canvasSizeOn4 = this.canvasSize * 0.25;
        this.canvasSizeOn3 = this.canvasSize * 0.33;
        this.points = [];
        let increment = (this.canvasSize / 5) * this.cellSize;
        this.gridUncovered[this.plane.targetI][this.plane.targetJ] = this.coverToggle;
    }

    static() {
        this.drawMap();
        push();
        translate(this.plane.x, this.plane.y);
        rotate(this.plane.rotation * this.modifier - HALF_PI);
        let scale = 0.25;
        let point = 0.35;
        let cSize = this.modifier * this.cellSize * 10;
        fill(this.myColors["powderBlue"]);
        triangle(-cSize * scale, -cSize * scale, cSize * scale, -cSize * scale, 0, cSize * point);
        pop();

        // this.plane.targetX = this.canvasSizeOn2 + this.canvasSizeOn2 * sin(millis() / 1000);
        // this.plane.targetY = this.canvasSizeOn2 + this.canvasSizeOn3 * sin(millis() / 7000);

        if (mouseX > 0 && mouseX < this.canvasSize && mouseY > 0 && mouseY < this.canvasSize) {
            let hypot = dist(this.plane.x, this.plane.y, mouseX, mouseY);
            if (hypot > 10 * this.cellSize) {
                this.plane.targetX = mouseX;
                this.plane.targetY = mouseY;
            } else {
                this.plane.targetX = this.plane.x;
                this.plane.targetY = this.plane.y;
                // this.plane.targetX = mouseX + sin(millis() / 1000) * 9 * this.cellSize;
                // this.plane.targetY = mouseY + cos(millis() / 2000) * 9 * this.cellSize;
                // this.plane.targetX = constrain(this.plane.targetX, 0, this.canvasSize);
                // this.plane.targetY = constrain(this.plane.targetY, 0, this.canvasSize);
            }
        } else {
            if (this.gridUncovered[this.plane.targetI][this.plane.targetJ] == this.coverToggle) {
                let res = exploreGridUncovered(
                    Math.floor(this.plane.x / this.cellSize),
                    Math.floor(this.plane.y / this.cellSize),
                    this.coverToggle,
                    this.gridUncovered
                );
                this.plane.targetI = res.targetX;
                this.plane.targetJ = res.targetY;
                this.plane.targetX = res.targetX * this.cellSize;
                this.plane.targetY = res.targetY * this.cellSize;
            }
        }

        let hypot = dist(this.plane.x, this.plane.y, this.plane.targetX, this.plane.targetY);
        let dx = this.plane.targetX - this.plane.x;
        let dy = this.plane.targetY - this.plane.y;
        if (!(dx == 0 && dy == 0)) {
            this.plane.targetRotation = Math.atan2(dy, dx);
            this.plane.rotation += (this.plane.targetRotation - this.plane.rotation) * 0.8;
            this.plane.x += (dx / hypot) * this.plane.speed;
            this.plane.y += (dy / hypot) * this.plane.speed;
            this.plane.x = constrain(this.plane.x, 0, this.canvasSize);
            this.plane.y = constrain(this.plane.y, 0, this.canvasSize);
        }

        let xP = Math.floor(this.plane.x / this.cellSize);
        let yP = Math.floor(this.plane.y / this.cellSize);
        this.discoverCell(xP, yP, 15);
    }

    discoverCell(x, y, radius) {
        // Iterate over the cells within the circular region
        for (let i = x - radius; i <= x + radius; i++) {
            for (let j = y - radius; j <= y + radius; j++) {
                // Check if the current cell is within the circular region
                if (this.isWithinCircle(i, j, x, y, radius)) {
                    // Mark the cell as true if it's within the circle and within the bounds of the grid
                    if (i >= 0 && i < this.gridUncovered.length && j >= 0 && j < this.gridUncovered[i].length) {
                        if (this.gridUncovered[i][j] != this.coverToggle) {
                            this.gridUncovered[i][j] = this.coverToggle;
                            this.coverCounter += 1;
                        }
                    }
                }
            }
        }
        if (this.coverCounter >= this.numCells * this.numCells - 2) {
            this.coverCounter = 0;
            this.coverToggle = !this.coverToggle;
        }
    }

    isWithinCircle(x, y, centerX, centerY, radius) {
        // Calculate the distance between the current cell and the center of the circle
        let distanceSquared = (x - centerX) ** 2 + (y - centerY) ** 2;

        // Check if the distance is less than or equal to the square of the radius
        return distanceSquared <= radius ** 2;
    }

    quantiseTerrain() {
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                this.grid[i][j] = int(map(this.grid[i][j], 0, 1.0, 0, this.maxLevel));
            }
        }
    }

    normaliseTerrain() {
        let max = 0;
        let min = 1;
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                if (this.grid[i][j] > max) {
                    max = this.grid[i][j];
                }

                if (this.grid[i][j] < min) {
                    min = this.grid[i][j];
                }
            }
        }
        let mult = 1 / (max - min);
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                this.grid[i][j] -= min;
                this.grid[i][j] *= mult;
            }
        }
    }

    getNoiseValue(x, y) {
        // let noiseScale = 0.02;
        let noiseScale = 0.02;
        let noiseValue = noise(x * noiseScale, y * noiseScale);
        return noiseValue;
    }

    createTerrain() {
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                this.grid[i][j] = this.getNoiseValue(i, j);
            }
        }
    }

    carveTerrain() {
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                if (this.checkNeighbors(i, j)) {
                    this.gridOutline[i][j] = this.grid[i][j];
                } else {
                    this.gridOutline[i][j] = -1;
                }
            }
        }
    }

    checkNeighbors(i, j) {
        let val = this.grid[i][j];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // Skip the current cell
                let x = i + dx;
                let y = j + dy;
                // Check if the neighboring cell is within the grid bounds and has the same value
                if (x >= 0 && x < this.numCells && y >= 0 && y < this.numCells && this.grid[x][y] > val) {
                    return true; // Neighboring cell differs in value
                }
            }
        }
        return false; // All neighboring cells have the same value
    }

    drawMap() {
        rectMode(CENTER);
        let off = this.cellSize / 2;
        let dim = this.modifier * this.cellSize * 0.8;
        let radius = dim / 4;
        for (let i = 0; i < this.numCells; i++) {
            if (i % 2 == 0) {
                for (let j = 0; j < this.numCells; j++) {
                    if (j % 2 == 0) {
                        let cellColor = lerpGridColor(
                            this.grid[i][j] + 1,
                            this.maxLevel,
                            this.myColors["forestGreen"],
                            this.myColors["goldenYellow"]
                        );
                        let cellColor2 = lerpGridColor(
                            this.grid[i][j] + 1,
                            this.maxLevel,
                            // this.myColors["goldenYellow"],
                            // this.myColors["teal"]
                            this.myColors["sageGreen"],
                            this.myColors["navyBlue"]
                        );
                        push();
                        translate(i * this.cellSize + off, j * this.cellSize + off);
                        rotate(this.modifier * HALF_PI);
                        if (this.gridUncovered[i][j]) {
                            if (this.gridOutline[i][j] != -1) {
                                fill(this.myColors["darkGoldenOrange"]);
                            } else {
                                fill(cellColor2);
                            }
                            square(0, 0, dim * 2, radius);
                        }
                        if (this.gridOutline[i][j] != -1) {
                            fill(this.myColors["brickRed"]);
                            square(0, 0, dim, radius);
                        } else {
                            if (this.gridUncovered[i][j]) {
                                fill(cellColor);
                                square(0, 0, dim, radius);
                            }
                        }

                        pop();
                    }
                }
            }
        }

        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                // if (i % 2 == 0 && j % 2 == 0) {
                if (this.gridOutline[i][j] != -1) {
                    if (this.gridUncovered[i][j]) {
                        push();
                        translate(i * this.cellSize + off, j * this.cellSize + off);
                        rotate(this.modifier * HALF_PI);
                        fill(this.myColors["brickRed"]);
                        square(0, 0, dim, radius);
                        pop();
                    }
                }
                // }
            }
        }
    }
}
