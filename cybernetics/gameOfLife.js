class GOL extends Grid {
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 50);
        this.grid = this.createGrid();
        this.counter = 0;
        this.mod = 50;
        this.ratio = 1.0;
        this.inc = 1/this.mod;
    }

    static() {
        rectMode(CENTER);
        this.counter += 1;
        this.ratio -= this.inc;
        for (let i = 0; i < this.numCells; i++) {
            for (let j = 0; j < this.numCells; j++) {
                fill(this.myColors['brickRed']);
                if (this.grid[i][j] === 1) {
                    fill(this.myColors['brickRed']); // Alive cell color
                    square(i * this.cellSize, j * this.cellSize, this.cellSize, 5);
                } else if (this.grid[i][j] === 2) {
                    fill(this.myColors['teal']); // Pre-death cell color
                    square(i * this.cellSize, j * this.cellSize, this.cellSize * this.ratio, 5);
                } else if (this.grid[i][j] === 3) {
                    fill(this.myColors['brickRed']);
                    square(i * this.cellSize, j * this.cellSize, this.cellSize * (1 - this.ratio), 5);
                }
            }
        }
        if (this.counter % this.mod == 0) {
            this.updateGrid();
            this.ratio = 1.0;
        }
    }

    createGrid() {
        // Create a 2D array to represent the grid of cells
        let grid = new Array(this.numCells);
        for (let i = 0; i < this.numCells; i++) {
            grid[i] = new Array(this.numCells);
            for (let j = 0; j < this.numCells; j++) {
                // Initialize each cell randomly as alive (1) or dead (0)
                grid[i][j] = Math.random() > 0.5 ? 1 : 0;
            }
        }
        return grid;
    }

    updateGrid() {
        // Create a copy of the grid to store the updated states
        let newGrid = new Array(this.numCells);
        for (let i = 0; i < this.numCells; i++) {
            newGrid[i] = new Array(this.numCells);
            for (let j = 0; j < this.numCells; j++) {
                let neighbors = this.countNeighbors(i, j);
                // Apply Game of Life rules to update cell state
                if (this.grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                    newGrid[i][j] = 2; // Cell enters pre-death state
                } else if (this.grid[i][j] === 0 && neighbors === 3) {
                    newGrid[i][j] = 3; // Any dead cell with exactly three live neighbors becomes a live cell
                } else if (this.grid[i][j] === 3) {
                    newGrid[i][j] = 1; // Pre-death cell dies
                } else if (this.grid[i][j] === 2) {
                    newGrid[i][j] = 0; // Pre-death cell dies
                } else {
                    newGrid[i][j] = this.grid[i][j]; // Otherwise, the cell state remains the same
                }
            }
        }
        this.grid = newGrid; // Update the grid with the new states
    }

    countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let nx = (x + i + this.numCells) % this.numCells;
                let ny = (y + j + this.numCells) % this.numCells;
                count += min(this.grid[nx][ny], 1);
            }
        }
        count -= this.grid[x][y]; // Exclude the current cell from the count
        return count;
    }
}
