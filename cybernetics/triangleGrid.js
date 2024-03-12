class TriangleGrid {
    constructor(myColors, canvasSize) {
        this.myColors = myColors;
        this.numCells = 10;
        this.canvasSize = canvasSize;
        this.cellSize = this.canvasSize / this.numCells;
        this.mode = 0;
        this.modifier = 0.0;
        this.triangles = [];
        this.generateTriangles();
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

    generateTriangles() {
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                let x = i * this.cellSize + this.cellSize / 2;
                let y = j * this.cellSize + this.cellSize / 2;
                let rotation = this.calculateRotation(x, y);
                let c = color(this.myColors["brickRed"]);
                this.triangles.push({ x, y, rotation, c });
            }
        }
        this.rotateTriangles();
        this.colorTriangles();
    }

    rotateTriangles() {
        // Calculate the rotation needed for the triangle on the bottom row of the first column
        let targetRotation = QUARTER_PI; //random(0, PI + HALF_PI);

        // Get the current rotation of the triangle on the bottom row of the first column
        let currentRotation = this.triangles[this.numCells - 1].rotation;

        // Calculate the rotation difference
        let rotationDifference = targetRotation - currentRotation;

        // Adjust rotation for all triangles in the array
        for (let triangle of this.triangles) {
            triangle.rotation += rotationDifference;
        }
    }

    colorTriangles() {
        let position = this.numCells - 1;
        for (let i = this.numCells - 1; i <= this.numCells * (this.numCells - 1); i+= this.numCells-1) {
            this.triangles[i].c = this.myColors["goldenYellow"];
        }

        for (let i = 0; i < 100; i++) {
            if (position >= 0 && position < this.triangles.length) {
                this.triangles[position].c = this.myColors["teal"];
                if (position == this.numCells * (this.numCells - 1)) {
                    i = 100;
                } else {
                    // Get the current triangle's rotation in degrees
                    let rotation = Math.floor(degrees(this.triangles[position].rotation));
                    if (rotation == -45) {
                        position -= this.numCells + 1;
                    }
                    if (rotation == 0) {
                        position -= 1;
                    }
                    if (rotation == 45) {
                        position += this.numCells - 1;
                    }
                    if (rotation == 90) {
                        position += this.numCells;
                    }
                    if (rotation == 135) {
                        position += this.numCells + 1;
                    }
                    if (rotation == 180) {
                        position += 1;
                    }
                    if (rotation == -90) {
                        position -= this.numCells;
                    }
                    if (rotation == 225) {
                        position -= this.numCells - 1;
                    }
                }
            }

            // Ensure the position stays within bounds
            position = constrain(position, 0, this.triangles.length - 1);
        }
    }

    calculateRotation(x, y) {
        let noiseScale = 0.005;
        let noiseValue = 0.7 * noise(x * noiseScale, y * noiseScale) + 0.3 * 0.25;
        let angle = map(noiseValue, 0, 1, 0, 360);
        angle = Math.floor(angle / 45) * 45;
        return radians(angle);
    }

    in() {
        this.static();
        this.modifier += 0.1;
        if (this.modifier >= 1.0) {
            this.mode = 1;
        }
    }

    out() {
        this.static();
        this.modifier -= 0.1;
        if (this.modifier <= 0.0) {
            this.mode = 0;
        }
    }

    static() {
        let scale = 0.25;
        let point = 0.35;
        let cSize = this.modifier * this.cellSize
        for (let t of this.triangles) {
            push();
            translate(t.x, t.y);
            rotate(this.modifier * t.rotation + PI);
            fill(t.c);
            triangle(
                -cSize * scale,
                -cSize * scale,
                cSize * scale,
                -cSize * scale,
                0,
                cSize * point
            );
            pop();
        }
    }
}
