function dummyLayout() {
  let bgRes = 3;
  let bg = G.graphLayers.newLayer(0, 'background');
  let myColors = [G.colors[25], G.colors[2], G.colors[25], G.colors[37], G.colors[37]];
  let tile = getPerlinTile(100, 0.05, bgRes, myColors, true);
  bg.setTileAble(tile);
  let road = G.graphLayers.newLayer(1, 'road');
  myColors = [G.colors[35], G.colors[34], G.colors[34], G.colors[33], G.colors[35]];
  drawRoad(road, 0.3, bgRes, myColors);
  // showColors();
}
