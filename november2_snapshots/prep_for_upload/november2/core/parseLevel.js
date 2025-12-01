// core/parseLevel.js
export function parseLevel(levelData, p) {
  const { layers, tileSize, currentsLegend, entityLegend, hazardLegend} = levelData;
  const result = {
    tiles: [],
    currents: [],
    hazards: [],
    entities: [],
    spawn: null,
    goal: null,
    tileSize: tileSize || 32,
    cols: null,
    rows: null,
  };

  // const toWorld = (x, y) => ({ x: x * tileSize, y: y * tileSize });
  const toWorld = (x, y) => ({ x: x, y: y });

  result.cols = layers.layout[0].length;
  result.rows = layers.layout.length;

  // Layout parsing
  for (let y = 0; y < layers.layout.length; y++) {
    for (let x = 0; x < layers.layout[y].length; x++) {
      const ch = layers.layout[y][x];
      const pos = toWorld(x, y);
      if (ch === '#') result.tiles.push({ ...pos, type: 'wall' });
      else if (ch === 'S') result.spawn = pos;
      else if (ch === 'E') result.goal = pos;
    }
  }

  // Currents
  for (let y = 0; y < layers.currents.length; y++) {
    for (let x = 0; x < layers.currents[y].length; x++) {
      const ch = layers.currents[y][x];
      if (currentsLegend[ch]) {
        const pos = toWorld(x, y);
        result.currents.push({ legend: ch, ...pos, ...currentsLegend[ch], draw: true, levelDefinitionCurrent: true});
      }
    }
  }

  // Hazards
  for (let y = 0; y < layers.hazards.length; y++) {
    for (let x = 0; x < layers.hazards[y].length; x++) {
      const ch = layers.hazards[y][x];
      if (hazardLegend[ch]) {
        const pos = toWorld(x, y);
        result.hazards.push({ ...pos, ...hazardLegend[ch] });
      }
    }
  }

  // Entities
  for (let y = 0; y < layers.entities.length; y++) {
    for (let x = 0; x < layers.entities[y].length; x++) {
      const ch = layers.entities[y][x];
      if (entityLegend[ch]) {
        const pos = toWorld(x, y);
        result.entities.push({ ...pos, ...entityLegend[ch], legend: ch } );
      }
    }
  }

  return result;
}