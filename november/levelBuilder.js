function level0() {
  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
  let level = new Level('Level0');
  level.inventory.addItem('boots');
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
  dialog.addOption(parEvent, 'Here you go.', function () {return G.player.subtractItem('food');}, function () {return G.player.hasFood();});
  dialog.addOption(parEvent, 'I\'m hungry too.');
  dialog.addOption(parEvent, 'I need boots.', returnTrue, function () {return G.player.hasFood();});
  dialog.addOption(parEvent, 'No!', function () {npc1.changeSequence(1, true);}, returnTrue);
  let thankyou = dialog.addChildDialogEvent(parEvent, 'NPC1', 'Thank you!');
  dialog.addChildDialogEvent(thankyou, 'PC', 'You are welcome!');
  let sorry = dialog.addChildDialogEvent(parEvent, 'NPC1', 'That\'s ok. Don\'t worry about me.');
  dialog.addChildDialogEvent(sorry, 'PC', 'I wish I had food.');
  let trade = dialog.addChildDialogEvent(parEvent, 'NPC1', 'I don\'t have any boots');
  let tradeResp = dialog.addChildDialogEvent(trade, 'PC');
  dialog.addOption(tradeResp, 'Have some food anyway.', function () {return G.player.subtractItem('food');});
  dialog.addOption(tradeResp, 'I can\'t share my food.');
  dialog.addChildDialogEvent(tradeResp, 'NPC1', 'Wow! Thank you so much!');
  dialog.addChildDialogEvent(tradeResp, 'NPC1', 'I understand.');
  let selfish = dialog.addChildDialogEvent(parEvent, 'NPC1', 'Selfish much?');
  dialog.addChildDialogEvent(selfish, 'PC', 'I have a family!');
  let bg = level.bg;
  let fg = level.fg;
  level.attachBGSetup(drawLevel0);
  // level.transitionBB = drawLevel0(bg, fg);
  G.levels.push(level);
}

function drawLevel0(bg, fg){
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['grass'], 64, 3, 0, 4), 4, 1);
  fg.border(splitSheet(G.loaders['grass'], 64, 2, 0, 2), 2, 1);
  return bb;
}

function level1() {
  let level = new Level('final');
  let bg = level.bg;
  let fg = level.fg;
  level.attachBGSetup(drawLevel1);

  let rat = level.newSpriteCollection('rat', 0.6, 0.5, 1);
  rat.setCollectionRate(0.4);
  rat.addAnimation(4, G.loaders['rats']);
  rat.addAnimation(4, G.loaders['ratsRev']);
  rat.goal = 'food';
  rat.update();
  rat.play();

  rat = level.newSpriteCollection('rat', 0.3, 0.2, 1);
  rat.setCollectionRate(0.4);
  rat.addAnimation(4, G.loaders['rats']);
  rat.addAnimation(4, G.loaders['ratsRev']);
  rat.goal = 'food';
  rat.update();
  rat.play();

  rat = level.newSpriteCollection('rat', 0.8, 0.8, 1);
  rat.setCollectionRate(0.4);
  rat.addAnimation(4, G.loaders['rats']);
  rat.addAnimation(4, G.loaders['ratsRev']);
  rat.goal = 'food';
  rat.update();
  rat.play();

  G.levels.push(level);
}

function drawLevel1(bg, fg){
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['grass'], 64, 3, 0, 4), 4, 1, true);
  fg.border(splitSheet(G.loaders['grass'], 64, 2, 0, 2), 2, 1);
  return bb;
}
