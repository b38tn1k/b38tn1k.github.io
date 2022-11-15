function grassArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['grass'], 64, 3, 0, 4), 4, 1);
  fg.border(splitSheet(G.loaders['grass'], 64, 2, 0, 2), 2, 1);
  return bb;
}

function snowArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['snow'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['snow'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['snow'], 64, 3, 0, 4), 4, 1);
  fg.border(splitSheet(G.loaders['snow'], 64, 2, 0, 3), 3, 1);
  return bb;
}

function desertArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['desert'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['desert'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['desert'], 64, 3, 0, 4), 4, 1);
  fg.border(splitSheet(G.loaders['desert'], 64, 2, 0, 2), 2, 1);
  return bb;
}

function level0() {
  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
  let level = new Level('Level0');
  let npc1 = level.newSpriteCollection('NPC1', 0.7, 0.5);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(7, G.loaders['slume-idle']);
  npc1.addAnimation(9, G.loaders['slume-death'], 'death', [8]);
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
  level.attachBGSetup(grassArt);
  G.levels.push(level);
}


function level1() {
  let level = new Level('level1');
  level.attachBGSetup(desertArt);

  //function splitSheet(src, res, row, start, end)
  let spider;
  for (let i = 0; i < 20; i++) {
    spider = level.newSpriteCollection('spider', random(), random(), 1);
    spider.addAnimation(2, splitSheet(G.loaders['spider'], 24, 0, 0, 2), 'left');
    spider.addAnimation(2, splitSheet(G.loaders['spider'], 24, 1, 0, 2), 'right');
    spider.addAnimation(2, splitSheet(G.loaders['spider'], 24, 2, 0, 2), 'up');
    spider.addAnimation(2, splitSheet(G.loaders['spider'], 24, 3, 0, 2), 'down');
    spider.setCollectionRate(0.4);
    spider.goal = 'food';
    spider.update();
    spider.play();
  }
  G.levels.push(level);
}



function level2() {
  let level = new Level('level2');
  G.levels.push(level);
  level.attachBGSetup(snowArt);
  let npc1 = level.newSpriteCollection('NPC1', 0.7, 0.5);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(7, G.loaders['slumeY']);
  npc1.update();
  npc1.play();
  let dialog = level.newDialog(0.7, 0.5);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('NPC1', 'Greetings Traveller, who might you be?');
  dialog.addDialogEvent('PC', '...');
  dialog.addDialogEvent('NPC1', 'My name is Colin Iser. I have discovered and tamed this land.');
  dialog.addDialogEvent('PC', '...');
  dialog.addDialogEvent('NPC1', 'I have taught the native people how to trade using glass beads I import from far away.');
  dialog.addDialogEvent('NPC1', 'It is quite lucrative. Would you like to trade? This currency may assist on your travels.');
  let parEvent = dialog.addDialogEvent('PC');
  dialog.addOption(parEvent, 'No');
  dialog.addOption(parEvent, 'I will exchange all I have.');
  dialog.addOption(parEvent, 'One meal for two beads.');
  let no = dialog.addChildDialogEvent(parEvent, 'NPC1', 'Very well then. You shall perish.');
  dialog.addChildDialogEvent(no, 'PC', '...');
  let yes = dialog.addChildDialogEvent(parEvent, 'NPC1', 'Excellent! A deal!');
  dialog.addChildDialogEvent(yes, 'PC', '...');
  let sorta = dialog.addChildDialogEvent(parEvent, 'NPC1', 'An acceptable trade.');
  dialog.addChildDialogEvent(sorta, 'PC', '...');

}
