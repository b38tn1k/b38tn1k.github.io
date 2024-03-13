class Maze {
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
        this.numCells = 43;
        this.canvasSize = canvasSize;
        this.cellSize = this.canvasSize / this.numCells;
        this.mode = 0;
        this.modifier = 0.0;
        this.maze = this.generateMaze();
        this.path = this.findShortestPath();
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

    /**
     * @description draws a maze by filling cells with red or yellow color based on the
     * values in the `maze` and `path` arrays, respectively.
     */
    static() {
        rectMode(CENTER);
        for (let x = 0; x < this.numCells; x++) {
            for (let y = 0; y < this.numCells; y++) {
                if (this.maze[x][y] == 1) {
                    fill(this.myColors["brickRed"]);
                    push();
                    translate((x + 0.5) * this.cellSize, (y + 0.5) * this.cellSize);
                    rotate(this.modifier * PI);
                    square(0, 0, (this.cellSize + 1) * this.modifier);
                    pop();
                }

                if (this.path[x][y] == 1) {
                    fill(this.myColors["goldenYellow"]);
                    push();
                    translate((x + 0.5) * this.cellSize, (y + 0.5) * this.cellSize);
                    rotate(this.modifier * PI);
                    square(0, 0, this.cellSize * 0.25 * this.modifier, 5);
                    pop();
                }
            }
        }
    }

    /**
     * @description creates a randomly generated maze, carves out paths within it and
     * marks entry and exit points.
     * 
     * @returns { array } a two-dimensional array representing a navigable maze with entry
     * and exit points marked.
     */
    generateMaze() {
        const maze = Array.from({ length: this.numCells }, () => Array(this.numCells).fill(1));
        for (let x = 0; x < this.numCells; x++) {
            for (let y = 0; y < this.numCells; y++) {
                maze[x][y] = 1;
            }
        }

        // Carve out the paths
        this.carvePaths(maze, 1, 1);
        // Mark entry and exit points
        maze[0][this.numCells - 2] = 0; // Entry point
        maze[this.numCells - 1][1] = 0; // Exit point
        return maze;
    }

    /**
     * @description carves a path through a given maze by iteratively marking cells as
     * part of the path and then recursively calling itself until the entire maze is traversed.
     * 
     * @param { integer } maze - 2D grid of a maze, which is used to track the current
     * cell and generate random directions for exploration.
     * 
     * @param { `int`. } x - 2D coordinate of the cell where the algorithm will start
     * carving paths.
     * 
     * 		- `x`: This is the coordinate of the current cell in the maze. It is an integer
     * between 0 and 3, representing the row number in the array.
     * 		- `y`: This is the coordinate of the current cell in the maze. It is an integer
     * between 0 and 3, representing the column number in the array.
     * 
     * 
     * @param { integer } y - 2D coordinate of the cell to start generating paths from.
     */
    carvePaths(maze, x, y) {
        maze[x][y] = 0; // Mark current cell as path

        // Generate random directions to move
        const directions = this.shuffleDirections();

        for (const dir of directions) {
            const nx = x + dir[0] * 2;
            const ny = y + dir[1] * 2;

            if (this.isValidCell(nx, ny, maze)) {
                maze[x + dir[0]][y + dir[1]] = 0; // Mark the cell between current and next as path
                this.carvePaths(maze, nx, ny);
            }
        }
    }

    /**
     * @description shuffles a list of direction vectors randomly.
     * 
     * @returns { array } a randomized array of 4 directional vectors.
     */
    shuffleDirections() {
        const directions = [
            [0, -1], // Up
            [0, 1], // Down
            [-1, 0], // Left
            [1, 0], // Right
        ];

        // Shuffle the directions randomly
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }

        return directions;
    }

    /**
     * @description returns a boolean value indicating whether a given position within a
     * 2D grid is within the bounds of the grid and contains the wall cell value.
     * 
     * @param { integer } x - 2D coordinate of a cell within the maze.
     * 
     * @param { integer } y - 2D coordinate of the cell being tested for validity, along
     * with `x` and `maze`.
     * 
     * @param { array } maze - 2D array that contains the maze layout, and it is used to
     * determine whether the given position (x, y) is within the maze or not based on the
     * value stored at that location in the maze array.
     * 
     * @returns { boolean } a boolean value indicating whether the given cell position
     * is within the valid range and has the correct maze value.
     */
    isValidCell(x, y, maze) {
        return x >= 1 && x < this.numCells - 1 && y >= 1 && y < this.numCells - 1 && maze[x][y] === 1;
    }

    /**
     * @description calculates and returns a shortest path through a maze based on an
     * initial entry point, using a depth-first search algorithm.
     * 
     * @returns { array } an array of integers representing the shortest path through a
     * maze, where each integer corresponds to a cell in the maze and has a value of
     * either 0 or 1.
     */
    findShortestPath() {
        const distances = Array.from({ length: this.numCells }, () => Array(this.numCells).fill(Infinity));
        const visited = Array.from({ length: this.numCells }, () => Array(this.numCells).fill(false));
        const queue = [];

        // Start from the entry point
        const entry = { x: 0, y: this.numCells - 2 };
        distances[entry.x][entry.y] = 0;
        queue.push(entry);

        while (queue.length > 0) {
            const current = queue.shift();
            const neighbors = this.getNeighbors(current, this.maze);

            for (const neighbor of neighbors) {
                const newDistance = distances[current.x][current.y] + 1;

                if (newDistance < distances[neighbor.x][neighbor.y]) {
                    distances[neighbor.x][neighbor.y] = newDistance;
                    if (!visited[neighbor.x][neighbor.y]) {
                        visited[neighbor.x][neighbor.y] = true;
                        queue.push(neighbor);
                    }
                }
            }
        }

        // Trace back the shortest path
        const shortestPath = [];
        let current = { x: this.numCells - 1, y: 1 };
        while (!(current.x === 0 && current.y === this.numCells - 2)) {
            shortestPath.push(current);
            const neighbors = this.getNeighbors(current, this.maze);
            current = neighbors.find(
                (neighbor) => distances[neighbor.x][neighbor.y] === distances[current.x][current.y] - 1
            );
        }
        shortestPath.push({ x: 0, y: this.numCells - 2 });

        // Convert shortest path to the maze format
        const pathInMazeFormat = Array.from({ length: this.numCells }, () => Array(this.numCells).fill(0));
        for (const cell of shortestPath) {
            pathInMazeFormat[cell.x][cell.y] = 1;
        }

        return pathInMazeFormat;
    }

    /**
     * @description computes and returns an array of neighboring cells for a given cell
     * in a maze, based on its x and y coordinates.
     * 
     * @param { 2D coordinates point value. } cell - 2D cell within the maze that is being
     * evaluated for its neighbors.
     * 
     * 		- `x`: The position of the cell in the horizontal dimension (row).
     * 		- `y`: The position of the cell in the vertical dimension (column).
     * 
     * 	The function then accesses and pushes the neighbors of the given cell to an array
     * based on their coordinates. The properties of these neighbors are not explicitly
     * mentioned as they are not used further in the function.
     * 
     * 
     * @param { array } maze - 2D array of the labyrinth, which is used to determine the
     * positions of the cell's neighbors based on their coordinates within the maze.
     * 
     * @returns { object } an array of neighboring cell positions in the given maze.
     */
    getNeighbors(cell, maze) {
        const { x, y } = cell;
        const neighbors = [];
        if (x > 0 && maze[x - 1][y] === 0) neighbors.push({ x: x - 1, y });
        if (x < this.numCells - 1 && maze[x + 1][y] === 0) neighbors.push({ x: x + 1, y });
        if (y > 0 && maze[x][y - 1] === 0) neighbors.push({ x, y: y - 1 });
        if (y < this.numCells - 1 && maze[x][y + 1] === 0) neighbors.push({ x, y: y + 1 });
        return neighbors;
    }
}
