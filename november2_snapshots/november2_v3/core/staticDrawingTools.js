import { GeometryTools } from './GeometryTools.js';

export function drawWorldBoundary(p, layer, mapTransform) {
  if (!layer || !mapTransform) {
    console.warn('⚠️ drawWorldBoundary: Missing layer or mapTransform');
    return;
  }

  const { cols, rows, tileSizePx, originPx } = mapTransform;

  // How many tiles fit around the screen
  const tilesWideScreen  = Math.ceil(p.width  / tileSizePx);
  const tilesHighScreen  = Math.ceil(p.height / tileSizePx);

  // Extend boundary far enough to cover FULL viewport
  const minX = -tilesWideScreen;
  const maxX = cols + tilesWideScreen;
  const minY = -tilesHighScreen;
  const maxY = rows + tilesHighScreen;

  layer.noStroke();
  layer.fill(p.shared.chroma.terrain);

  // Draw all tiles OUTSIDE the playable rectangle
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {

      // Only draw tiles OUTSIDE world bounds
      const outside =
        x < 0 || y < 0 || x >= cols || y >= rows;

      if (outside) {
        const sx = originPx.x + x * tileSizePx;
        const sy = originPx.y + y * tileSizePx;
        layer.rect(sx, sy, tileSizePx, tileSizePx);
      }
    }
  }
}

// export function drawWorldBoundary(p, layer, mapTransform) {
//   if (!layer || !mapTransform) {
//     console.warn('⚠️ drawWorldBoundary: Missing layer or mapTransform');
//     return;
//   }

//   const { cols, rows, tileSizePx, originPx } = mapTransform;

//   layer.noStroke();
//   layer.fill(p.shared.chroma.terrain);

//   // Top and bottom boundaries
//   for (let x = -1; x <= cols; x++) {
//     // top
//     const sxTop = originPx.x + x * tileSizePx;
//     const syTop = originPx.y + -1 * tileSizePx;
//     layer.rect(sxTop, syTop, tileSizePx, tileSizePx);

//     // bottom
//     const sxBot = originPx.x + x * tileSizePx;
//     const syBot = originPx.y + rows * tileSizePx;
//     layer.rect(sxBot, syBot, tileSizePx, tileSizePx);
//   }

//   // Left and right boundaries
//   for (let y = -1; y <= rows; y++) {
//     // left
//     const sxLeft = originPx.x + -1 * tileSizePx;
//     const syLeft = originPx.y + y * tileSizePx;
//     layer.rect(sxLeft, syLeft, tileSizePx, tileSizePx);

//     // right
//     const sxRight = originPx.x + cols * tileSizePx;
//     const syRight = originPx.y + y * tileSizePx;
//     layer.rect(sxRight, syRight, tileSizePx, tileSizePx);
//   }
// }

export function drawOrganicBlockingBackground(p, layer, mapTransform, tiles, opts = {}) {
  if (!layer || !mapTransform) {
    console.warn('⚠️ drawOrganicBlockingBackground: Missing layer or mapTransform');
    return;
  }

  const { tileSizePx, originPx } = mapTransform;

  layer.noStroke();
  layer.fill(p.shared.chroma.terrain);

  const regions = GeometryTools.extractTileRegions(tiles);

  for (const region of regions) {
    const outline = GeometryTools.computeRegionOutline(region);
    if (outline.length === 0) continue;

    const distorted = GeometryTools.distortPolygon(outline, p, opts);

    layer.beginShape();
    for (const pt of distorted) {
      const sx = originPx.x + pt.x * tileSizePx;
      const sy = originPx.y + pt.y * tileSizePx;
      layer.curveVertex(sx, sy);
    }
    layer.endShape(p.CLOSE);
  }
}

export function drawBlockingBackgroundTransformed(p, layer, mapTransform, tiles) {
  if (!layer || !mapTransform) {
    console.warn('⚠️ drawBlockingBackgroundTransformed: Missing layer or mapTransform');
    return;
  }
  const { tileSizePx, originPx } = mapTransform;

  layer.noStroke();
  layer.fill(p.shared.chroma.terrain);

  for (const t of tiles) {
    if (t && Number.isFinite(t.x) && Number.isFinite(t.y)) {
      const px = originPx.x + t.x * tileSizePx;
      const py = originPx.y + t.y * tileSizePx;
      layer.rect(px, py, tileSizePx, tileSizePx);
    }
  }
}

export function drawCurrents(p, layer, mapTransform, currents, drawArrows = true) {
  if (!currents) return;

  const { tileSizePx } = mapTransform;

  for (const c of currents) {
    const { x, y, dx, dy } = c;

    const { x: sx, y: sy } = {
      x: mapTransform.originPx.x + x * tileSizePx,
      y: mapTransform.originPx.y + y * tileSizePx
    };

    layer.noStroke();
    layer.fill(p.shared.chroma.current);
    layer.rect(sx, sy, tileSizePx, tileSizePx);

    if (drawArrows) {
      const cx = sx + tileSizePx * 0.5;
      const cy = sy + tileSizePx * 0.5;

      const ax = dx * (tileSizePx * 0.01);
      const ay = dy * (tileSizePx * 0.01);

      layer.stroke(0);
      layer.strokeWeight(1);
      layer.line(cx, cy, cx + ax, cy + ay);

      const angle = Math.atan2(ay, ax);
      const headLen = tileSizePx * 0.15;

      layer.line(
        cx + ax,
        cy + ay,
        cx + ax - headLen * Math.cos(angle - Math.PI / 6),
        cy + ay - headLen * Math.sin(angle - Math.PI / 6)
      );
      layer.line(
        cx + ax,
        cy + ay,
        cx + ax - headLen * Math.cos(angle + Math.PI / 6),
        cy + ay - headLen * Math.sin(angle + Math.PI / 6)
      );
    }
  }
}
