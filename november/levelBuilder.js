function level0() {
  console.log('level 0')
  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
  let level = new Level('Level0');
  let npc1 = level.newSpriteCollection('NPC1', 0.7, 0.5);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(7, G.loaders['slume-idle']);
  npc1.addAnimation(9, G.loaders['slume-death'], [8]);
  npc1.update();
  npc1.play();
  let dialog = level.newDialog(0.7, 0.5);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('NPC1', 'What\'s the hurry, buddy?');
  dialog.addDialogEvent('PC', 'I can\'t stop! I have to keep going.');
  dialog.addDialogEvent('NPC1', 'I\'m so hungry! Please, do you have any food?');
  let parEvent = dialog.addDialogEvent('PC');
  dialog.addOption(parEvent, 'Here you go.', function () {return G.player.subtractInventoryItem('food');}, function () {return G.player.hasFood();});
  dialog.addOption(parEvent, 'I\'m hungry too.');
  dialog.addOption(parEvent, 'I need boots.', returnTrue, function () {return G.player.hasFood();});
  dialog.addOption(parEvent, 'No!', function () {npc1.changeSequence(1, true);}, returnTrue);
  let thankyou = dialog.addChildDialogEvent(parEvent, 'NPC1', 'Thank you!');
  dialog.addChildDialogEvent(thankyou, 'PC', 'You are welcome!');
  let sorry = dialog.addChildDialogEvent(parEvent, 'NPC1', 'That\'s ok. Don\'t worry about me.');
  dialog.addChildDialogEvent(sorry, 'PC', 'I wish I had food.');
  let trade = dialog.addChildDialogEvent(parEvent, 'NPC1', 'I don\'t have any boots');
  let tradeResp = dialog.addChildDialogEvent(trade, 'PC');
  dialog.addOption(tradeResp, 'Have some food anyway.', function () {return G.player.subtractInventoryItem('food');});
  dialog.addOption(tradeResp, 'I can\'t share my food.');
  dialog.addChildDialogEvent(tradeResp, 'NPC1', 'Wow! Thank you so much!');
  dialog.addChildDialogEvent(tradeResp, 'NPC1', 'I understand.');
  let selfish = dialog.addChildDialogEvent(parEvent, 'NPC1', 'Selfish much?');
  dialog.addChildDialogEvent(selfish, 'PC', 'I have a family!');

  let bg = level.BG();
  level.attachBGSetup(drawBGLevel0);
  drawBGLevel0(bg);
  G.levels.push(level);
}

function drawBGLevel0(bg){
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 1, 0, 5), 5, 1, 0.3, 0.5);
  bg.border(splitSheet(G.loaders['grass'], 64, 2, 0, 1), 1, 1);
  bg.drawPath(G.loaders['path'], 7, 1);
}
