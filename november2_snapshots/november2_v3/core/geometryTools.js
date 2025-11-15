export const GeometryTools = {
    extractTileRegions(tiles) {
        const grid = new Map();
        for (const t of tiles) {
            grid.set(`${t.x},${t.y}`, t);
        }

        const visited = new Set();
        const regions = [];

        for (const tile of tiles) {
            const key = `${tile.x},${tile.y}`;
            if (visited.has(key)) continue;

            const stack = [tile];
            const region = [];

            while (stack.length) {
                const cur = stack.pop();
                const ck = `${cur.x},${cur.y}`;
                if (visited.has(ck)) continue;

                visited.add(ck);
                region.push(cur);

                // 4-way neighbors
                for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    const nk = `${cur.x + dx},${cur.y + dy}`;
                    if (grid.has(nk) && !visited.has(nk)) {
                        stack.push({ x: cur.x + dx, y: cur.y + dy });
                    }
                }
            }

            regions.push(region);
        }

        return regions;
    },

    computeRegionOutline(region) {
        const tileSet = new Set(region.map(t => `${t.x},${t.y}`));

        const edges = [];

        for (const t of region) {
            const { x, y } = t;

            const isEmpty = (dx, dy) => !tileSet.has(`${x + dx},${y + dy}`);

            if (isEmpty(0, -1)) edges.push([[x, y], [x + 1, y]]);
            if (isEmpty(1, 0)) edges.push([[x + 1, y], [x + 1, y + 1]]);
            if (isEmpty(0, 1)) edges.push([[x + 1, y + 1], [x, y + 1]]);
            if (isEmpty(-1, 0)) edges.push([[x, y + 1], [x, y]]);
        }

        if (edges.length === 0) return [];

        const outline = [];
        let [startA, startB] = edges[0];
        outline.push({ x: startA[0], y: startA[1] });

        let current = startB;
        let guard = 0;

        while (guard++ < 5000) {
            outline.push({ x: current[0], y: current[1] });

            const next = edges.find(e => e[0][0] === current[0] && e[0][1] === current[1]);
            if (!next) break;

            current = next[1];
            if (current[0] === startA[0] && current[1] === startA[1]) break;
        }

        return outline;
    },

    distortPolygon(points, p, opts = {}) {
        const noiseScale = opts.noiseScale ?? 0.08;
        const noiseAmp = opts.noiseAmp ?? 0.25;
        const cornerSmooth = opts.cornerSmooth ?? 0.5;
        const out = [];

        for (let i = 0; i < points.length; i++) {
            const a = points[(i - 1 + points.length) % points.length];
            const b = points[i];
            const c = points[(i + 1) % points.length];

            const vx1 = b.x - a.x;
            const vy1 = b.y - a.y;
            const vx2 = c.x - b.x;
            const vy2 = c.y - b.y;

            const avgx = b.x + (vx1 + vx2) * cornerSmooth * 0.5;
            const avgy = b.y + (vy1 + vy2) * cornerSmooth * 0.5;

            const n = p.noise(b.x * noiseScale, b.y * noiseScale) - 0.5;
            const angle = Math.atan2(vy1 + vy2, vx1 + vx2);

            const dx = Math.cos(angle) * n * noiseAmp;
            const dy = Math.sin(angle) * n * noiseAmp;

            out.push({ x: avgx + dx, y: avgy + dy });
        }

        return out;
    }

};