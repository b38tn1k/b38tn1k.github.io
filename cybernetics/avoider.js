// Function to interpolate color based on grid level
function lerpGridColor(level, maxLevel, colorLow, colorHigh) {
    // Normalize the level value to a range between 0 and 1
    let normalizedLevel = level / maxLevel;
    // Interpolate color based on normalized level
    return lerpColor(colorLow, colorHigh, normalizedLevel);
}

class Avoider extends Grid {
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 100);
        this.xCells = this.numCells;
        this.yCells = this.numCells;
        this.grid = Array.from({ length: this.xCells }, () => Array(this.yCells).fill(1));
        this.gridOutline = Array.from({ length: this.xCells }, () => Array(this.yCells).fill(1));
        this.maxLevel = 7;
        this.createTerrain();
        // this.normaliseTerrain();
        this.quantiseTerrain();
        this.carveTerrain();
        this.coverToggle = true;
        this.coverCounter = 0;
        this.canvasSizeOn2 = this.canvasSize * 0.5;
        this.canvasSizeOn4 = this.canvasSize * 0.25;
        this.canvasSizeOn3 = this.canvasSize * 0.33;
        this.scroller = 0;
        let b = 10;
        this.plane = {
            x: this.canvasSizeOn2,
            y: this.canvasSize * 0.75,
            speed: this.cellSize,
            leftborder: b * this.cellSize,
            rightborder: this.canvasSize - b * this.cellSize,
            topborder: b * this.cellSize,
            bottomborder: this.canvasSize - b * this.cellSize,
        };
    }

    static() {
        this.drawMap(this.scroller, this.numCells);
        this.scroller += 1;
        if (this.scroller >= this.grid.length) {
            this.scroller = 0;
        }
        push();
        translate(this.plane.x, this.plane.y);
        rotate(this.modifier * PI);
        let scale = 0.25;
        let point = 0.35;
        let cSize = this.modifier * this.cellSize * 10;
        fill(this.myColors["powderBlue"]);
        triangle(-cSize * scale, -cSize * scale, cSize * scale, -cSize * scale, 0, cSize * point);
        pop();
        if (keyIsDown(LEFT_ARROW)) {
            this.planeLeft();
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.planeRight();
        }
        if (keyIsDown(UP_ARROW)) {
            this.planeUp();
        }

        if (keyIsDown(DOWN_ARROW)) {
            this.planeDown();
        }
    }

    quantiseTerrain() {
        for (let i = 0; i < this.xCells; i++) {
            for (let j = 0; j < this.yCells; j++) {
                this.grid[i][j] = int(map(this.grid[i][j], 0, 1.0, 0, this.maxLevel));
            }
        }
    }

    normaliseTerrain() {
        let max = 0;
        let min = 1;
        for (let i = 0; i < this.xCells; i++) {
            for (let j = 0; j < this.yCells; j++) {
                if (this.grid[i][j] > max) {
                    max = this.grid[i][j];
                }

                if (this.grid[i][j] < min) {
                    min = this.grid[i][j];
                }
            }
        }
        let mult = 1 / (max - min);
        for (let i = 0; i < this.xCells; i++) {
            for (let j = 0; j < this.yCells; j++) {
                this.grid[i][j] -= min;
                this.grid[i][j] *= mult;
            }
        }
    }

    getNoiseValue(x, y) {
        let noiseScale = 0.02;
        let noiseValue = noise(x * noiseScale, y * noiseScale);
        let overlap = 100;

        // Smooth transition at the top edge
        if (y < overlap) {
            let nf2 = noise(x * noiseScale, (y + this.yCells + 3) * noiseScale);
            if (y * 2 < overlap) {
                noiseValue = max(noiseValue, nf2);
            } else {
                let blendFactor = y / overlap;
                noiseValue = blendFactor * noiseValue + (1 - blendFactor) * nf2;
            }
        }

        // Smooth transition at the bottom edge
        if (y > this.yCells - overlap) {
            let nf2 = noise(x * noiseScale, (y - this.yCells - 1) * noiseScale);

            if (2 * (this.yCells - y) < overlap) {
                noiseValue = max(noiseValue, nf2);
            } else {
                let blendFactor = (this.yCells - y) / overlap;
                noiseValue = blendFactor * noiseValue + (1 - blendFactor) * nf2;
            }
        }

        return noiseValue;
    }

    // getNoiseValue(x, y) {
    //     let noiseScale = 0.02;
    //     let noiseValue = noise(x * noiseScale, y * noiseScale);
    //     let overlap = 20
    //     if (y < overlap) {
    //         noiseValue = ((y/overlap)) * noiseValue + (1-(y/overlap)) * noise(x * noiseScale, (y + this.yCells) * noiseScale);
    //     }

    //     if (y > this.yCells - overlap) {
    //         let v = this.yCells - y;
    //         noiseValue = (v/overlap) * noiseValue + (1-(v/overlap)) * noise(x * noiseScale, (y - this.yCells) * noiseScale);
    //     }
    //     return noiseValue;
    // }

    createTerrain() {
        for (let i = 0; i < this.xCells; i++) {
            for (let j = 0; j < this.yCells; j++) {
                this.grid[i][j] = this.getNoiseValue(i, j);
            }
        }
    }

    carveTerrain() {
        for (let i = 0; i < this.xCells; i++) {
            for (let j = 0; j < this.yCells; j++) {
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
                if (x >= 0 && x < this.xCells && y >= 0 && y < this.yCells && this.grid[x][y] > val) {
                    return true; // Neighboring cell differs in value
                }
            }
        }
        return false; // All neighboring cells have the same value
    }

    planeLeft() {
        this.plane.x -= this.plane.speed;
        this.plane.x = constrain(this.plane.x, this.plane.leftborder, this.plane.rightborder);
    }
    planeRight() {
        this.plane.x += this.plane.speed;
        this.plane.x = constrain(this.plane.x, this.plane.leftborder, this.plane.rightborder);
    }

    planeUp() {
        this.plane.y -= this.plane.speed;
        this.plane.y = constrain(this.plane.y, this.plane.topborder, this.plane.bottomborder);
    }
    planeDown() {
        this.plane.y += this.plane.speed;
        this.plane.y = constrain(this.plane.y, this.plane.topborder, this.plane.bottomborder);
    }

    drawMap(start, h) {
        rectMode(CENTER);
        let off = this.cellSize / 2;
        let dim = this.modifier * this.cellSize * 0.8;
        let radius = dim / 4;
        let jIndices = [];
        for (let j = start; j < start + h; j++) {
            let v = j;
            if (v >= this.yCells) {
                v -= this.yCells;
            }
            jIndices.push(v);
        }
        jIndices.reverse();
        for (let i = 10; i < this.xCells - 10; i++) {
            if (i % 2 == 0) {
                for (let j = 0; j < this.yCells; j++) {
                    let jj = jIndices[j];
                    if (jj % 2 == 0) {
                        let cellColor = lerpGridColor(
                            this.grid[i][jj] + 1,
                            this.maxLevel,
                            this.myColors["forestGreen"],
                            this.myColors["goldenYellow"]
                        );
                        let cellColor2 = lerpGridColor(
                            this.grid[i][jj] + 1,
                            this.maxLevel,
                            this.myColors["sageGreen"],
                            this.myColors["navyBlue"]
                        );
                        push();
                        translate(i * this.cellSize + off, j * this.cellSize + off);
                        rotate(this.modifier * HALF_PI);
                        if (this.gridOutline[i][jj] != -1) {
                            fill(this.myColors["darkGoldenOrange"]);
                        } else {
                            fill(cellColor2);
                        }
                        square(0, 0, dim * 2, radius);
                        if (this.gridOutline[i][jj] != -1) {
                            fill(this.myColors["brickRed"]);
                            square(0, 0, dim, radius);
                        } else {
                            fill(cellColor);
                            square(0, 0, dim, radius);
                        }
                        pop();
                    }
                }
            }
        }

        for (let i = 10; i < this.xCells - 11; i++) {
            for (let j = 0; j < this.yCells; j++) {
                let jj = jIndices[j];
                if (this.gridOutline[i][jj] != -1) {
                    push();
                    translate(i * this.cellSize + off, j * this.cellSize + off);
                    rotate(this.modifier * HALF_PI);
                    fill(this.myColors["brickRed"]);
                    square(0, 0, dim, radius);
                    pop();
                }
            }
        }
    }
}
