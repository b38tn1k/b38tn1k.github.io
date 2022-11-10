function dummyLayout() {
  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;

  G.player = new SpriteCollection(G.dims.cx, G.dims.h - 100, true);
  G.player.addAnimation(8, G.loaders['walk'], [0, 4], [1, 2, 3, 5, 6, 7]);
  G.player.setCollectionRate(0.4);
  G.player.playable = true;

  testNPC = new SpriteCollection(G.dims.w * 0.7, G.dims.cy);
  testNPC.setCollectionRate(0.4);
  testNPC.addAnimation(7, G.loaders['slume-idle']);
  testNPC.addAnimation(9, G.loaders['slume-death'], [8]);
  testNPC.update();
  testNPC.play();

  testDialog = new Dialog(G.dims.w * 0.7, G.dims.cy, 100, 100);
  // testDialog.showZones = true;
  testDialog.updateCoords('NPC1', testNPC.current);
  testDialog.addDialogEvent('NPC1', 'What\'s the hurry, buddy?');
  testDialog.addDialogEvent('PC', 'I can\'t stop! I have to keep going.');
  testDialog.addDialogEvent('NPC1', 'I\'m so hungry! Please, do you have any food?');
  G.player.hasFood = function() {return true;};
  let parEvent = testDialog.addDialogEvent('PC');//, ['Here you go.', 'I\'m hungry too.', 'No!'], [testSprite.hasFood, returnTrue, returnTrue]);
  testDialog.addOption(parEvent, 'Here you go.', 'feeding time ID', G.player.hasFood);
  testDialog.addOption(parEvent, 'I\'m hungry too.');
  testDialog.addOption(parEvent, 'I need boots.', 'trading time', G.player.hasFood);
  testDialog.addOption(parEvent, 'No!', 101);
  let thankyou = testDialog.addChildDialogEvent(parEvent, 'NPC1', 'Thank you!');
  testDialog.addChildDialogEvent(thankyou, 'PC', 'You are welcome!');
  let sorry = testDialog.addChildDialogEvent(parEvent, 'NPC1', 'That\'s ok. Don\'t worry about me.');
  testDialog.addChildDialogEvent(sorry, 'PC', 'I wish I had food.');
  let trade = testDialog.addChildDialogEvent(parEvent, 'NPC1', 'I don\'t have any boots');
  let tradeResp = testDialog.addChildDialogEvent(trade, 'PC');
  testDialog.addOption(tradeResp, 'Have some food anyway.');
  testDialog.addOption(tradeResp, 'I can\'t share my food.');
  testDialog.addChildDialogEvent(tradeResp, 'NPC1', 'Wow! Thank you so much!');
  testDialog.addChildDialogEvent(tradeResp, 'NPC1', 'I understand.');
  let selfish = testDialog.addChildDialogEvent(parEvent, 'NPC1', 'Selfish much?');
  testDialog.addChildDialogEvent(selfish, 'PC', 'I have a family!');

  let b = G.gLayers.newLayer(100, 'border');
  pixelBorder(b);

  let bgRes = 3;
  let bg = G.gLayers.newLayer(0, 'background');
  let myColors = [G.colors[25], G.colors[2], G.colors[25], G.colors[37], G.colors[37]];
  let tile = getPerlinTile(100, 0.05, bgRes, myColors, true);
  bg.setTileAble(tile);
  let road = G.gLayers.newLayer(1, 'road');
  myColors = [G.colors[35], G.colors[34], G.colors[34], G.colors[33], G.colors[35]];
  drawRoad(road, 0.3, bgRes, myColors);
  // showColors();
}

function visualCheckInputs(myInp=G.inputs) {
  push();
  let [x, y] = [G.debugTools.compassx, G.debugTools.compassy];
  translate(x, y);
  // rotate(myInp.angleTo(x, y))

  rotate(myInp.angleTo(myInp.originX, myInp.originY));
  image(G.debugTools.compass, 0, 0);
  pop();
  return myInp.angleTo(x, y);
}
