
function drawCross(x, y, size) {
    line(x - size / 2, y, x + size / 2, y); // Horizontal line
    line(x, y - size / 2, x, y + size / 2); // Vertical line
}

function drawGrid(color, zoom) {
    stroke(color);
    strokeWeight(1);
    let resolution = 50; // Grid resolution
    if (zoom <= 0.5) {
        resolution = 100;
    }
    if (zoom <= 0.25) {
        resolution = 200;
    }

    // Convert the screen edges to board coordinates
    let topLeftBoard = screenToBoard(0, 0);
    let bottomRightBoard = screenToBoard(width, height);

    // Calculate the board coordinates of the first grid lines
    let startX = floor(topLeftBoard.x / resolution) * resolution;
    let startY = floor(topLeftBoard.y / resolution) * resolution;

    // Iterate over the grid intersections
    for (
        let boardX = startX;
        boardX < bottomRightBoard.x;
        boardX += resolution
    ) {
        for (
            let boardY = startY;
            boardY < bottomRightBoard.y;
            boardY += resolution
        ) {
            let intersection = boardToScreen(boardX, boardY);
            // point(intersection.x, intersection.y);
            drawCross(intersection.x, intersection.y, 5);
        }
    }
}
