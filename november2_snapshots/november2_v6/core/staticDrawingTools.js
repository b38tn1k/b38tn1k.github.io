import { GeometryTools } from './geometryTools.js';

function distortOutlineWithPerlin(p, outline, opts = {}) {
  const {
    baseStep = 0.25,
    jitter = 0.3,
    noiseFreq = 1.0
  } = opts;

  const out = [];

  for (let i = 0; i < outline.length; i++) {
    const a = outline[i];
    const b = outline[(i + 1) % outline.length];

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);

    const nx = -dy / len;
    const ny = dx / len;

    const steps = Math.max(2, Math.floor(len / baseStep));

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const px = a.x + dx * t;
      const py = a.y + dy * t;

      const n = p.noise(px * noiseFreq, py * noiseFreq);
      const offset = (n - 0.5) * 2 * jitter;

      out.push({
        x: px + nx * offset,
        y: py + ny * offset
      });
    }
  }

  return out;
}

export function drawWorldBoundary(p, layer, mapTransform) {
  if (!layer || !mapTransform) {
    console.warn('⚠️ drawWorldBoundary: Missing layer or mapTransform');
    return;
  }

  const { cols, rows, tileSizePx, originPx } = mapTransform;

  // world rect outline in tile coords
  const outline = [
    { x: 0, y: 0 },
    { x: cols, y: 0 },
    { x: cols, y: rows },
    { x: 0, y: rows }
  ];

  const organic = distortOutlineWithPerlin(p, outline, {
    baseStep: 0.25,
    jitter: 0.35,
    noiseFreq: 0.9
  });

  const bigPad = 50; // tile units far outside the world
  const outerRect = [
    { x: -bigPad, y: -bigPad },
    { x: cols + bigPad, y: -bigPad },
    { x: cols + bigPad, y: rows + bigPad },
    { x: -bigPad, y: rows + bigPad }
  ];

  layer.noStroke();
  layer.fill(p.shared.chroma.terrain);

  layer.beginShape();
  // outer polygon (big enclosing rectangle)
  for (const pt of outerRect) {
    const sx = originPx.x + pt.x * tileSizePx;
    const sy = originPx.y + pt.y * tileSizePx;
    layer.vertex(sx, sy);
  }

  // cut out the playable world shape as a contour
  layer.beginContour();
  // reverse order for correct winding
  for (let i = organic.length - 1; i >= 0; i--) {
    const pt = organic[i];
    const sx = originPx.x + pt.x * tileSizePx;
    const sy = originPx.y + pt.y * tileSizePx;
    layer.vertex(sx, sy);
  }
  layer.endContour();

  layer.endShape(p.CLOSE);
}

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

    const distorted = distortOutlineWithPerlin(p, outline, opts);

    layer.beginShape();
    for (const pt of distorted) {
      const sx = originPx.x + pt.x * tileSizePx;
      const sy = originPx.y + pt.y * tileSizePx;
      layer.curveVertex(sx, sy);
    }
    layer.endShape(p.CLOSE);
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

      layer.stroke(p.shared.chroma.player);
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