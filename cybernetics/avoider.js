// Function to interpolate color based on grid level
/**
 * @description interpolates a color value based on a given level and maximum level,
 * normalizing the level to a range between 0 and 1 before interpolating the color
 * from `colorLow` and `colorHigh`.
 * 
 * @param { `Float`. } level - level of detail in the grid, with lower values indicating
 * a coarser grid and higher values indicating a finer grid.
 * 
 * 		- `level`: A number representing the current level of detail in the grid color
 * interpolation. The value ranges from 0 to `maxLevel`.
 * 		- `maxLevel`: An integer denoting the maximum possible value for the `level` parameter.
 * 		- `colorLow`: A color value representing the lowest interpolated color at a given
 * `level`.
 * 		- `colorHigh`: A color value representing the highest interpolated color at a
 * given `level`.
 * 
 * 
 * @param { number } maxLevel - maximum value of the levels in the grid, which is
 * used to normalize the level value provided in the function.
 * 
 * @param { `rgb` or 32-bit float color value. } colorLow - lower-end color value of
 * the interpolation range.
 * 
 * 		- `colorLow`: A hexadecimal color code representing a low value for interpolation.
 * 
 * 
 * @param { color value. } colorHigh - higher-quality color value used for interpolation
 * when the `level` parameter is close to 1, providing a gradual transition between
 * the two colors.
 * 
 * 		- `colorLow`: The low color value used for interpolation (deserialized)
 * 		- `colorHigh`: The high color value used for interpolation (deserialized)
 * 
 * 
 * @returns { object } a interpolated color between two specified colors based on a
 * normalized level value ranging from 0 to 1.
 */
function lerpGridColor(level, maxLevel, colorLow, colorHigh) {
    // Normalize the level value to a range between 0 and 1
    let normalizedLevel = level / maxLevel;
    // Interpolate color based on normalized level
    return lerpColor(colorLow, colorHigh, normalizedLevel);
}

/**
 * @description converts a decimal number to its binary representation as an array
 * of digits, ensuring the length of the binary representation is at least 8 bits.
 * 
 * @param { integer } number - decimal value to be converted into its binary representation.
 * 
 * @returns { array } an array of 8 binary digits representing the input decimal number.
 */
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
    /**
     * @description sets up a `Sprite` game object with basic functionality such as grid
     * generation, terrain normalization, quantization, and carving, as well as enemy
     * spawning and scorekeeping.
     * 
     * @param { array } myColors - 4 colors of the grid, which are used to define the
     * terrain and other elements in the game.
     * 
     * @param { integer } canvasSize - 2D canvas size of the game environment, which
     * determines the size of the grid, the placement of the plane and enemies, and other
     * aspects of the game's layout.
     */
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

    /**
     * @description updates game elements based on the game mode and state, including
     * reading input, updating enemies, plane, score, and creating new enemies if necessary.
     */
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

    /**
     * @description generates a binary representation of a score and renders it as
     * rectangles on the canvas, using different colors for zero and non-zero values.
     */
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

    /**
     * @description updates the weapon cooldown and moves bullets downward based on their
     * speed, retaining only those that have not exceeded the y-axis.
     */
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

    /**
     * @description generates a new enemy based on parameters x and y, with optional
     * customization options c for color and weapon cooldown. It creates an object
     * representing the enemy with properties like position, size, speed, color, weapon,
     * and others. The enemy is added to the list of enemies in the code.
     * 
     * @param { number } x - 2D position of the enemy to be created within the game canvas.
     * 
     * @param { number } y - vertical position of the enemy object in the game world,
     * where it is generated and added to the `enemies` array.
     * 
     * @param { null } c - color of the enemy to be created if it is provided, or a random
     * color if it is not provided.
     */
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

    /**
     * @description adds a new bullet to the `enemyBullets` array based on the enemy's
     * current position, velocity, and acceleration.
     * 
     * @param { object } e - 2D coordinate of an enemy object that is being shot, and its
     * properties are added to the `this.enemyBullets` array.
     */
    enemyShoot(e) {
        this.enemyBullets.push({ x: e.x, y: e.y, s: e.bulletSpeed, l: 50 });
    }

    /**
     * @description updates the positions, velocities, and cooldowns of enemies on the
     * screen. It also checks for collisions with bullets and planes, and removes enemies
     * that have reached the bottom of the canvas or are dead.
     */
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

    /**
     * @description creates shapes representing enemies and bullet objects in a grid-based
     * game, using scaling and rotation to position them correctly.
     */
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

    /**
     * @description draws a plane with a mustard yellow color followed by powder blue,
     * using quadratic curves to create the shape.
     */
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

    /**
     * @description pushes a new bullet object onto the plane's bullets array at its
     * current position (x, y).
     */
    shootPlane() {
        this.plane.bullets.push({ x: this.plane.x, y: this.plane.y });
    }

    /**
     * @description listens to key presses and executes corresponding actions on an
     * aircraft object, including moving left/right/up/down and shooting a weapon with a
     * cooldown system.
     */
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

    /**
     * @description maps values from a grid between 0 and 1 to a specified level within
     * a range, based on a given grid size.
     */
    quantiseTerrain() {
        for (let i = 0; i < this.xCells; i++) {
            for (let j = 0; j < this.yCells; j++) {
                this.grid[i][j] = int(map(this.grid[i][j], 0, 1.0, 0, this.maxLevel));
            }
        }
    }

    /**
     * @description normalises the values in a 2D grid by dividing each cell's value by
     * the minimum and maximum values in the grid, and then subtracting the minimum value
     * and scaling the result by a constant factor.
     */
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

    /**
     * @description takes two input parameters `x` and `y`, returns a noise value at those
     * coordinates, smooths the transition at top and bottom edges using nearest-neighbor
     * interpolation.
     * 
     * @param { double/float. } x - 2D spatial position at which to evaluate the noise
     * value, and it is multiplied by a scaling factor of 0.02 to determine the size of
     * the noise.
     * 
     * 		- `x`: The noise scale factor for the x-axis, set to 0.02.
     * 		- `y`: The noise scale factor for the y-axis, used in the calculations for the
     * top and bottom smooth transitions.
     * 
     * 
     * @param { number } y - 2D position in the noisy texture and determines the scaling
     * factor for the noise generation at each pixel location.
     * 
     * @returns { `float`. } a noise value between 0 and 1, calculated based on two random
     * variables.
     * 
     * 		- `noiseScale`: A constant representing the scaling factor for noise generation,
     * set to 0.02 in the code snippet.
     * 		- `noiseValue`: The generated noise value, calculated using a noise formula that
     * takes into account the input variables `x` and `y`.
     * 		- `overlap`: An optional parameter indicating a range of pixels around the edges
     * where smoothing occurs. When `overlap` is present, it sets the size of the overlap
     * area to 100 pixels.
     * 		- `nf2`: An optional output variable representing the second-order noise value
     * calculated at each pixel location within the overlap area. Its presence and
     * calculation depend on whether there is a smooth transition at the top or bottom
     * edge of the image.
     * 		- `blendFactor`: A floating-point value ranging from 0 to 1, used for blending
     * the output values with the noiseValue when smoothing occurs at edges. When `overlap`
     * is present, the blend factor is calculated as (1 - (y - this.yCells)) / overlap.
     * Otherwise, it's set to 1.
     * 		- `y`: The position of the pixel for which the noise value is generated, ranging
     * from 0 to `this.yCells`.
     */
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

    /**
     * @description generates noise values for a grid of cells based on a specified pattern
     * and replaces them in the grid.
     */
    createTerrain() {
        for (let i = 0; i < this.xCells; i++) {
            for (let j = 0; j < this.yCells; j++) {
                this.grid[i][j] = this.getNoiseValue(i, j);
            }
        }
    }

    /**
     * @description iterates through a grid, checking the values of adjacent cells and
     * replacing them with the value of the original cell if the neighbors are valid, or
     * -1 otherwise.
     */
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

    /**
     * @description checks if a given cell has a neighboring cell with a different value
     * within the grid's bounds, returning true if such a cell is found and false otherwise.
     * 
     * @param { number } i - 2D coordinate of the cell being checked for neighbors.
     * 
     * @param { number } j - 2D coordinate of the cell to check for neighbors, which is
     * used to determine the position of the cell in the grid to check for surrounding cells.
     * 
     * @returns { boolean } a boolean value indicating whether there exists a neighboring
     * cell with a different value.
     */
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

    /**
     * @description reduces the X-coordinate of an object called "plane" by its speed
     * value and constrains it within the left and right borders of the plane, based on
     * its current X position.
     */
    planeLeft() {
        this.plane.x -= this.plane.speed;
        this.plane.x = constrain(this.plane.x, this.plane.leftborder, this.plane.rightborder);
    }
    /**
     * @description moves the plane to its right border based on its speed and constrains
     * its position within the boundary of the plane canvas.
     */
    planeRight() {
        this.plane.x += this.plane.speed;
        this.plane.x = constrain(this.plane.x, this.plane.leftborder, this.plane.rightborder);
    }

    /**
     * @description reduces the `y` component of an object's position by its `speed`
     * value, then constrains it within the object's top and bottom boundaries.
     */
    planeUp() {
        this.plane.y -= this.plane.speed;
        this.plane.y = constrain(this.plane.y, this.plane.topborder, this.plane.bottomborder);
    }
    /**
     * @description updates the Y-coordinate of a plane by adding its speed and constraining
     * it to the top and bottom borders.
     */
    planeDown() {
        this.plane.y += this.plane.speed;
        this.plane.y = constrain(this.plane.y, this.plane.topborder, this.plane.bottomborder);
    }

    /**
     * @description generates high-quality documentation for given code by drawing a
     * two-dimensional grid of cells, using different fill colors based on the value of
     * each cell's `gridOutline` property.
     * 
     * @param { integer } start - 2D coordinates of the top-left corner of the map area
     * to be drawn.
     * 
     * @param { integer } h - horizontal distance to be covered by each cell's grid
     * pattern, starting from the top left corner of the canvas and moving rightward.
     */
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
