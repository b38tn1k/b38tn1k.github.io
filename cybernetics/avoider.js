// Function to interpolate color based on grid level
function lerpGridColor(level, maxLevel, colorLow, colorHigh) {
    // Normalize the level value to a range between 0 and 1
    let normalizedLevel = level / maxLevel;
    // Interpolate color based on normalized level
    return lerpColor(colorLow, colorHigh, normalizedLevel);
}

function decimalToBinaryArray(number) {
    // Convert the number to its binary representation
    let binaryString = number.toString(2);

    // Pad the binary string with leading zeros to ensure it's at least 8 bits long
    binaryString = binaryString.padStart(8, "0");

    // Extract the lowest 8 bits if the binary representation is longer
    if (binaryString.length > 8) {
        binaryString = binaryString.slice(-8);
    }

    // Split the binary string into an array of individual digits
    let binaryArray = binaryString.split("").map(Number);

    return binaryArray;
}

const PLAYING = 1;
const GAMEOVER = 2;

class Avoider extends Grid {
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 100);
        this.xCells = this.numCells;
        this.yCells = this.numCells;
        this.grid = Array.from({ length: this.xCells }, () => Array(this.yCells).fill(1));
        this.gridOutline = Array.from({ length: this.xCells }, () => Array(this.yCells).fill(1));
        this.maxLevel = 7;
        this.createTerrain();
        this.colorStrings = ["goldenYellow", "plumPurple", "mustardYellow", "peachCoral"];
        // this.normaliseTerrain();
        this.quantiseTerrain();
        this.carveTerrain();
        this.coverToggle = true;
        this.coverCounter = 0;
        this.canvasSizeOn2 = this.canvasSize * 0.5;
        this.canvasSizeOn4 = this.canvasSize * 0.25;
        this.canvasSizeOn3 = this.canvasSize * 0.33;
        this.scroller = 0;
        this.gamemode = PLAYING;
        this.enemies = [];
        this.enemyBullets = [];
        this.score = 0;
        this.enemyStarterCount = 1;
        this.maxEnemies = 4;
        this.boom = 0;
        let b = 10;
        this.plane = {
            x: this.canvasSizeOn2,
            y: this.canvasSize * 0.75,
            speed: this.cellSize,
            leftborder: b * this.cellSize,
            rightborder: this.canvasSize - b * this.cellSize,
            topborder: b * this.cellSize,
            bottomborder: this.canvasSize - b * this.cellSize,
            weaponCooldown: 0,
            bullets: [],
            bulletSpeed: 10,
        };
        this.createEnemy(100, 100);
        this.countDownToExit = 100;
    }

    static() {
        if (this.gamemode === PLAYING) {
            this.readInput();
            this.scroller += 1;
            if (this.scroller >= this.grid.length) {
                this.scroller = 0;
            }
            this.updateEnemies();
            this.updatePlane();
        } else {
            this.countDownToExit -= 1;
            if (this.countDownToExit < 10) {
                this.modifier -= 0.1;
            }
            this.boom += this.cellSize/4;
            fill("#FF0000");
            circle(this.plane.x, this.plane.y, this.boom * this.modifier);
            if (this.countDownToExit == 0) {
                this.returnToPreviousMode = true;
            }
        }
        this.drawMap(this.scroller, this.numCells);
        this.drawEnemies();
        this.drawPlane();
        this.drawScore();
        if (this.enemies.length < this.enemyStarterCount) {
            this.createEnemy(this.canvasSizeOn2, -this.cellSize);
        }
    }

    drawScore() {
        rectMode(CENTER);
        fill(this.myColors["powderBlue"]);
        let x = this.cellSize * (this.numCells - 20);
        let y = this.cellSize * 2;
        rect(this.cellSize * (this.numCells - 20), this.cellSize * 2, this.cellSize * 16, this.cellSize * 2);
        let j = 0;
        let score = decimalToBinaryArray(this.score);
        for (let i = -7; i < 8; i += 2) {
            if (score[j] == 0) {
                fill(this.myColors["navyBlue"]);
            } else {
                fill("#FF0000");
            }
            j += 1;
            square(x + i * this.cellSize, y, this.cellSize * 0.75);
        }
    }

    updatePlane() {
        if (this.plane.weaponCooldown > 0) {
            this.plane.weaponCooldown -= 1;
        }
        let keep = [];
        for (let i = 0; i < this.plane.bullets.length; i++) {
            let b = this.plane.bullets[i];
            b.y -= this.plane.bulletSpeed;
            if (b.y > 0) {
                keep.push(b);
            }
        }
        this.plane.bullets = keep;
    }

    createEnemy(x, y, c = null) {
        let e = {};
        if (c == null) {
            e.color = this.colorStrings[Math.floor(Math.random() * this.colorStrings.length)];
        } else {
            e.color = c;
        }
        e.x = x;
        e.min = random(10 * this.cellSize, x);
        e.max = constrain(x + (x - e.min), x, this.canvasSize - 10 * this.cellSize);
        e.f = random(200, 1000);
        e.off = random(-TWO_PI, TWO_PI);
        e.y = y;
        e.speed = 5; //(random() + 0.5) * this.cellSize;
        e.alive = true;
        e.weaponCooldown = random(17, 23);
        e.coolDown = 0;
        e.bulletSpeed = random(5, 7);
        e.speed = e.bulletSpeed * random(0.2, 0.8);
        this.enemies.push(e);
    }

    enemyShoot(e) {
        this.enemyBullets.push({ x: e.x, y: e.y, s: e.bulletSpeed, l: 50 });
    }

    updateEnemies() {
        let keep = [];
        for (let e of this.enemies) {
            e.y += e.speed;
            e.x = map(sin(millis() / e.f + e.off), -1, 1, e.min, e.max);

            e.coolDown -= 1;
            if (e.coolDown <= 0) {
                this.enemyShoot(e);
                e.coolDown = e.weaponCooldown;
            }
            for (let b of this.plane.bullets) {
                if (dist(e.x, e.y, b.x, b.y) <= this.cellSize) {
                    e.alive = false;
                    this.score += 1;
                }
            }

            if (e.y >= this.canvasSize - this.cellSize) {
                e.alive = false;
            }

            if (e.alive == true) {
                keep.push(e);
            } else {
                this.enemyStarterCount += 1;
                this.enemyStarterCount = min(this.enemyStarterCount, this.maxEnemies);
            }
        }
        this.enemies = keep;
        keep = [];
        for (let b of this.enemyBullets) {
            b.y += b.s;
            b.l -= 1;
            if (b.y < this.canvasSize - this.cellSize && b.l > 0) {
                keep.push(b);
            }

            if (dist(this.plane.x, this.plane.y, b.x, b.y) < this.cellSize) {
                this.gamemode = GAMEOVER;
            }
        }
        this.enemyBullets = keep;
    }

    drawEnemies() {
        let scale = 0.25;
        let point = 0.35;
        let cSize = this.modifier * this.cellSize * 5;
        for (let e of this.enemies) {
            fill(this.myColors[e.color]);
            push();
            translate(e.x, e.y);
            rotate(this.modifier * TWO_PI);
            triangle(-cSize * scale, -cSize * scale, cSize * scale, -cSize * scale, 0, cSize * point);
            pop();
        }
        // fill(this.myColors["mustardYellow"]);
        fill("#FF0000");
        for (let b of this.enemyBullets) {
            square(b.x, b.y, this.cellSize);
        }
    }

    drawPlane() {
        // fill(this.myColors["mustardYellow"]);
        fill("#FF0000");
        for (let b of this.plane.bullets) {
            square(b.x, b.y, this.cellSize);
        }
        fill(this.myColors["powderBlue"]);
        push();
        translate(this.plane.x, this.plane.y);
        rotate(this.modifier * PI);
        let scale = 0.25;
        let point = 0.35;
        let cSize = this.modifier * this.cellSize * 10;

        triangle(-cSize * scale, -cSize * scale, cSize * scale, -cSize * scale, 0, cSize * point);
        pop();
    }

    shootPlane() {
        this.plane.bullets.push({ x: this.plane.x, y: this.plane.y });
    }

    readInput() {
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
        if (keyIsDown(32)) {
            if (this.plane.weaponCooldown == 0) {
                this.plane.weaponCooldown += 5;
                this.shootPlane();
            }
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
        let twoDim = dim * 2;
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
        let cc1 = [];
        let cc2 = [];
        for (let i = 0; i <= this.maxLevel; i++) {
            let c = lerpGridColor(i, this.maxLevel, this.myColors["forestGreen"], this.myColors["sageGreen"]);
            cc1.push(c);
            c = lerpGridColor(i, this.maxLevel, this.myColors["sageGreen"], this.myColors["navyBlue"]);
            cc2.push(c);
        }
        for (let i = 10; i < this.xCells - 10; i++) {
            if (i % 2 == 0) {
                for (let j = 0; j < this.yCells; j++) {
                    let jj = jIndices[j];
                    if (jj % 2 == 0) {
                        let cellColor = cc1[this.grid[i][jj] + 1];
                        let cellColor2 = cc2[this.grid[i][jj] + 1];
                        push();
                        translate(i * this.cellSize + off, j * this.cellSize + off);
                        rotate(this.modifier * HALF_PI);
                        if (this.gridOutline[i][jj] != -1) {
                            fill(this.myColors["lightOrange"]);
                        } else {
                            fill(cellColor2);
                        }
                        square(0, 0, twoDim, radius);
                        if (this.gridOutline[i][jj] != -1) {
                            fill(this.myColors["navyBlue"]);
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
                    fill(this.myColors["navyBlue"]);
                    square(0, 0, dim, radius);
                    pop();
                }
            }
        }
    }
}
