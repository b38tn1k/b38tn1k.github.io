function fixInwardTraps(flowX, flowY, rows, cols) {

    // Helper: dot product
    const dot = (ax, ay, bx, by) => ax * bx + ay * by;

    for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {

            // Four corners of the 2×2 block
            const A = { dx: flowX[y][x], dy: flowY[y][x] };
            const B = { dx: flowX[y][x + 1], dy: flowY[y][x + 1] };
            const C = { dx: flowX[y + 1][x], dy: flowY[y + 1][x] };
            const D = { dx: flowX[y + 1][x + 1], dy: flowY[y + 1][x + 1] };

            // Center position of the block
            const cx = x + 0.5;
            const cy = y + 0.5;

            // Direction vectors from corners to center
            const dirs = [
                { vx: cx - x, vy: cy - y },     // A
                { vx: cx - (x + 1), vy: cy - y },     // B
                { vx: cx - x, vy: cy - (y + 1) },     // C
                { vx: cx - (x + 1), vy: cy - (y + 1) }      // D
            ];

            // Normalize these center-direction vectors
            for (let i = 0; i < 4; i++) {
                const len = Math.hypot(dirs[i].vx, dirs[i].vy) || 1;
                dirs[i].vx /= len;
                dirs[i].vy /= len;
            }

            // Dot tests — inward if dot > 0
            const inwardA = dot(A.dx, A.dy, dirs[0].vx, dirs[0].vy) > 0;
            const inwardB = dot(B.dx, B.dy, dirs[1].vx, dirs[1].vy) > 0;
            const inwardC = dot(C.dx, C.dy, dirs[2].vx, dirs[2].vy) > 0;
            const inwardD = dot(D.dx, D.dy, dirs[3].vx, dirs[3].vy) > 0;

            // If all four flow inward → it's a trap — fix it
            if (inwardA && inwardB && inwardC && inwardD) {

                const fix = (ox, oy) => {
                    const oldDX = flowX[oy][ox];
                    const oldDY = flowY[oy][ox];
                    flowX[oy][ox] = -oldDY;
                    flowY[oy][ox] = oldDX;
                };

                fix(x, y);
                fix(x + 1, y);
                fix(x, y + 1);
                fix(x + 1, y + 1);
            }
        }
    }
}

function computeCurrentExtrema(currents) {
    let minDX = Infinity, maxDX = -Infinity;
    let minDY = Infinity, maxDY = -Infinity;

    for (const c of currents) {
        if (c.dx < minDX) minDX = c.dx;
        if (c.dx > maxDX) maxDX = c.dx;

        if (c.dy < minDY) minDY = c.dy;
        if (c.dy > maxDY) maxDY = c.dy;
    }

    return { minDX, maxDX, minDY, maxDY };
}


export function generateCurrents(result, p) {
    // Additional currents
    // --- Border currents: push inward away from edges ---
    for (let y = 0; y < result.rows; y++) {
        for (let x = 0; x < result.cols; x++) {

            let dx = 0;
            let dy = 0;

            const isTop = (y === 0);
            const isBottom = (y === result.rows - 1);
            const isLeft = (x === 0);
            const isRight = (x === result.cols - 1);

            if (isTop) dy += 1;   // push downward
            if (isBottom) dy -= 1;   // push upward
            if (isLeft) dx += 1;   // push rightward
            if (isRight) dx -= 1;   // push leftward

            // Only emit if actually on border AND there is no existing current
            if ((dx !== 0 || dy !== 0) &&
                !result.currents.some(c => c.x === x && c.y === y)) {
                result.currents.push({
                    x,
                    y,
                    dx,
                    dy,
                    draw: false,
                    levelDefinitionCurrent: false,
                    legend: 'border',
                    style: 'current',
                    params: {}
                });
            }
        }
    }

    // --- Tile-edge currents: push away from any solid tiles ---
    const dirs = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: -1, dy: -1 }
    ];

    for (let y = 0; y < result.rows; y++) {
        for (let x = 0; x < result.cols; x++) {

            // Ignore solids; only generate currents in open water
            const isWall = result.tiles.some(t => t.x === x && t.y === y);
            if (isWall) continue;

            // Collect outward directions
            const outward = [];

            for (const d of dirs) {
                const nx = x + d.dx;
                const ny = y + d.dy;

                // Out of bounds = treat as wall
                const outOfBounds =
                    nx < 0 || ny < 0 || nx >= result.cols || ny >= result.rows;

                const neighborIsWall = outOfBounds ||
                    result.tiles.some(t => t.x === nx && t.y === ny);

                // If neighbor is wall, push AWAY from that neighbor
                if (neighborIsWall) {
                    outward.push({ dx: -d.dx, dy: -d.dy });
                }
            }

            // If outward options exist AND no current yet in this tile
            if (outward.length > 0 &&
                !result.currents.some(c => c.x === x && c.y === y)) {
                const choice = outward[Math.floor(Math.random() * outward.length)];
                result.currents.push({
                    x,
                    y,
                    dx: choice.dx,
                    dy: choice.dy,
                    draw: false,
                    levelDefinitionCurrent: false,
                    legend: 'tileEdge',
                    style: 'current',
                    params: {}
                });
            }
        }
    }

    // --- Ambient Perlin-flow currents for all open-water tiles with no defined current ---
    const ambientScale = 0.15;        // spatial scale of flow field
    const ambientMag = 0.2;         // how strong ambient drift is

    for (let y = 0; y < result.rows; y++) {
        for (let x = 0; x < result.cols; x++) {

            // Skip tiles that already have explicit currents (manual or border)
            const hasCurrent = result.currents.some(c => c.x === x && c.y === y);
            if (hasCurrent) continue;

            // Skip solid tiles
            const isWall = result.tiles.some(t => t.x === x && t.y === y);
            if (isWall) continue;

            // Perlin samples
            const nx = p.noise(x * ambientScale, y * ambientScale, 0);
            const ny = p.noise(x * ambientScale + 100, y * ambientScale + 100, 0);

            const dx = p.map(nx, 0, 1, -ambientMag, ambientMag);
            const dy = p.map(ny, 0, 1, -ambientMag, ambientMag);

            result.currents.push({
                x,
                y,
                dx,
                dy,
                draw: false,
                levelDefinitionCurrent: false,
                legend: 'ambient',
                style: 'current',
                params: {}
            });
        }
    }

    // ---------------------------------------------------------------------------
    // Flowfield smoothing pass (Gaussian blur)
    // ---------------------------------------------------------------------------

    const rows = result.rows;
    const cols = result.cols;

    // Create vector field arrays
    let flowX = Array.from({ length: rows }, () => Array(cols).fill(0));
    let flowY = Array.from({ length: rows }, () => Array(cols).fill(0));
    let isStrong = Array.from({ length: rows }, () => Array(cols).fill(false));

    // Initialize from currents array
    for (const c of result.currents) {
        flowX[c.y][c.x] = c.dx;
        flowY[c.y][c.x] = c.dy;

        // Level-defined currents act as anchors (fixed direction)
        if (c.levelDefinitionCurrent) {
            isStrong[c.y][c.x] = true;
        }
    }

    // Gaussian kernel (3×3)
    const kernel = [
        [1, 2, 3, 2, 1],
        [2, 4, 6, 4, 2],
        [3, 6, 9, 6, 3],
        [2, 4, 6, 4, 2],
        [1, 2, 3, 2, 1],
    ];
    const kernelDiv = 16;

    const strongInfluenceScale = 1.0;   // strong currents influence neighbors, but reduced

    let newFlowX = Array.from({ length: rows }, () => Array(cols).fill(0));
    let newFlowY = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Blur pass
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {

            // Strong currents are kept exactly
            if (isStrong[y][x]) {
                newFlowX[y][x] = flowX[y][x];
                newFlowY[y][x] = flowY[y][x];
                continue;
            }

            // Skip tiles (blockers)
            const isWall = result.tiles.some(t => t.x === x && t.y === y);
            if (isWall) {
                newFlowX[y][x] = 0;
                newFlowY[y][x] = 0;
                continue;
            }

            let sx = 0;
            let sy = 0;
            let sw = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const ny = y + ky;
                    const nx = x + kx;

                    if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;

                    let w = kernel[ky + 1][kx + 1];
                    let fx = flowX[ny][nx];
                    let fy = flowY[ny][nx];

                    // Strong currents influence neighbors less strongly
                    if (isStrong[ny][nx]) {
                        fx *= strongInfluenceScale;
                        fy *= strongInfluenceScale;
                    }

                    sx += fx * w;
                    sy += fy * w;
                    sw += w;
                }
            }

            newFlowX[y][x] = sx / sw;
            newFlowY[y][x] = sy / sw;
        }
    }

    // Normalize ambient magnitudes
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {

            if (isStrong[y][x]) continue;

            const dx = newFlowX[y][x];
            const dy = newFlowY[y][x];
            const mag = Math.sqrt(dx * dx + dy * dy) || 1;

            newFlowX[y][x] = (dx / mag) * ambientMag;
            newFlowY[y][x] = (dy / mag) * ambientMag;
        }
    }

    fixInwardTraps(newFlowX, newFlowY, rows, cols);

    // Rebuild result.currents with smoothed field (preserving legend/style/draw for strong currents)
    const newCurrents = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {

            const old = result.currents.find(c => c.x === x && c.y === y);

            if (old && old.levelDefinitionCurrent) {
                newCurrents.push(old);
                continue;
            }

            // skip walls
            const isWall = result.tiles.some(t => t.x === x && t.y === y);
            if (isWall) continue;

            newCurrents.push({
                x,
                y,
                dx: newFlowX[y][x],
                dy: newFlowY[y][x],
                draw: false,
                levelDefinitionCurrent: false,
                legend: old ? old.legend : 'ambientSmoothed',
                style: 'current',
                params: old ? old.params : {}
            });
        }
    }
    result.currents = newCurrents;
    const extrema = computeCurrentExtrema(result.currents);
    result.currentExtrema = extrema;
    // console.log('Current extrema:', extrema);
    return result;
}

// "idddddddddddddddddddj",
// "bibbbbbbbbbbbbdddddja",
// "bccclllllbbbbiiidddda",
// "bcccllll.....iiidddda",
// "bcccccl.......iddddda",
// "bccccc.........ddddda",
// "bccccc.........ddddda",
// "bcccckk.......jjdddda",
// "bccccckk.....jjjdddda",
// "bcccccakkaaaajjddddda",
// "blcccccccaaaaaaaaaaka",
// "lcaaaaaaaaaaaaaaaaaak"