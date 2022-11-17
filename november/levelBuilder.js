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

function templeArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['temple'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['temple'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  fg.setBorder(splitSheet(G.loaders['temple'], 64, 2, 0, 4), 4, 1);
  return [-1, -1, -1, -1];
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
  level.addPickup(0.3, 0.3);
  let dialog = level.newDialog(0.7, 0.5);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('NPC1', 'What\'s the hurry, buddy?');
  dialog.addDialogEvent('PC', 'I can\'t stop! I have to keep going.');
  dialog.addDialogEvent('NPC1', 'I\'m so hungry! Please, do you have any food?');
  let parEvent = dialog.addDialogEvent('PC');
  dialog.addOption(parEvent, 'Here you go.', function () {return G.player.subtractItem('food');}, function () {return G.player.hasFood();});
  dialog.addOption(parEvent, 'I\'m hungry too.');
  dialog.addOption(parEvent, 'I need boots.', returnTrue, function () {return (G.player.hasFood() && G.player.hasNoBoot());});
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
  level.attachBGSetup(desertArt);
  return level;
}


function level1() {
  let level = new Level('level1');
  level.attachBGSetup(grassArt);

  //function splitSheet(src, res, row, start, end)
  let spider;
  for (let i = 0; i < 5; i++) {
    level.addPickup(random(), random());
  }
  for (let i = 0; i < G.dims.swarmSize; i++) {
    spider = level.newSpriteCollection('spider', random(), random(), 1);
    spider.addAnimation(2, splitSheet(G.loaders['spider'], 32, 0, 0, 2), 'left');
    spider.addAnimation(2, splitSheet(G.loaders['spider'], 32, 1, 0, 2), 'right');
    spider.addAnimation(2, splitSheet(G.loaders['spider'], 32, 2, 0, 2), 'up');
    spider.addAnimation(2, splitSheet(G.loaders['spider'], 32, 3, 0, 2), 'down');
    spider.setCollectionRate(0.4);
    spider.goal = 'food';
    spider.aggressive = true;
    spider.update();
    spider.play();
  }
  return level;
}

function level2() {
  let level = new Level('level2');
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
  dialog.addDialogEvent('NPC1', 'I have taught the locals to trade using glass beads I import from far away.');
  dialog.addDialogEvent('NPC1', 'Would you like to trade? This currency will help on your travels!');
  let parEvent = dialog.addDialogEvent('PC');
  dialog.addOption(parEvent, 'No');
  dialog.addOption(parEvent, 'I will exchange all I have.', function () {return G.player.addItem('bead', G.player.emptyInventory());}, function () {return G.player.hasAnything();});
  dialog.addOption(parEvent, 'One meal for two beads.', function () {return G.player.inventory.trade('food', 1, 'bead', 2)}, function () {return G.player.hasFood();});
  let no = dialog.addChildDialogEvent(parEvent, 'NPC1', 'Very well then. You shall perish.');
  no = dialog.addChildDialogEvent(no, 'PC', 'Whatever dude...');
  dialog.addChildDialogEvent(no, 'NPC1', 'Perish!!!');
  let yes = dialog.addChildDialogEvent(parEvent, 'NPC1', 'Excellent! A deal!');
  yes = dialog.addChildDialogEvent(yes, 'PC', '...');
  dialog.addChildDialogEvent(yes, 'NPC1', 'Not very talkative, are you?');
  let sorta = dialog.addChildDialogEvent(parEvent, 'NPC1', 'An acceptable trade.');
  sorta = dialog.addChildDialogEvent(sorta, 'PC', '...');
  dialog.addChildDialogEvent(sorta, 'NPC1', 'Not very talkative, are you?');
  return level;
}

function level3() {
  let level = new Level('level3');
  level.attachBGSetup(snowArt);
  let npc1 = level.newSpriteCollection('NPC1', 0.5, 0.3);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(7, G.loaders['slume-idle']);
  npc1.update();
  npc1.play();
  let dialog = level.newDialog(0.5, 0.3, function () {return (G.player.hasNoBoot());});
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('NPC1', 'Hello!');
  dialog.addDialogEvent('PC', 'Hi!');
  dialog.addDialogEvent('NPC1', 'Where are you headed?');
  dialog.addDialogEvent('PC', 'North, but without boots I am making little progress.');
  dialog.addDialogEvent('NPC1', 'We have boots to spare! Would you like to trade?');
  let parEvent = dialog.addDialogEvent('PC');
  dialog.addOption(parEvent, 'I have nothing useful to trade.', returnTrue, function () {return G.player.hasNoFoodAndNoBeads();});
  let nothing = dialog.addChildDialogEvent(parEvent, 'NPC1', 'I am sorry to hear. There are many opportunities along the path.');
  nothing = dialog.addChildDialogEvent(nothing, 'PC', 'Oh well...');
  dialog.addChildDialogEvent(nothing, 'NPC1', 'Good luck!');

  dialog.addOption(parEvent, 'One bead for a pair of boots.', returnTrue, function () {return G.player.hasBead();});
  let tryBeads = dialog.addChildDialogEvent(parEvent, 'NPC1', 'You have been talking to the idiot Colin Iser. We do not trade with people like him!');
  tryBeads = dialog.addChildDialogEvent(tryBeads, 'PC', 'I\'m sorry? What?');
  tryBeads = dialog.addChildDialogEvent(tryBeads, 'NPC1', 'Leave us alone!');
  dialog.addChildDialogEvent(tryBeads, 'PC', 'Sorry.');

  dialog.addOption(parEvent, 'One meal for a pair of boots.', function () {return G.player.inventory.trade('food', 1, 'boot', 1)}, function () {return G.player.hasFood();});
  let foodForBoots = dialog.addChildDialogEvent(parEvent, 'NPC1', 'An acceptable trade!');
  foodForBoots = dialog.addChildDialogEvent(foodForBoots, 'PC', 'These boots are warm!');
  foodForBoots = dialog.addChildDialogEvent(foodForBoots, 'NPC1', 'Fair travels!');

  let dialog2 = level.newDialog(0.5, 0.3);
  dialog2.updateCoords('NPC1', npc1.current);
  dialog2.addDialogEvent('NPC1', 'Hello!');
  dialog2.addDialogEvent('PC', 'Hi!');
  dialog2.addDialogEvent('NPC1', 'Where are you headed?');
  dialog2.addDialogEvent('PC', 'North.');
  dialog2.addDialogEvent('NPC1', 'You have a long path ahead.');

  let otherNPCs;
  for (let i = 0; i < 10; i++) {
    otherNPCs = level.newSpriteCollection('NPC', random(), random(), 1);
    otherNPCs.addAnimation(7, G.loaders['slume-idle'], 'left');
    otherNPCs.addAnimation(7, G.loaders['slume-idle'], 'right');
    otherNPCs.addAnimation(7, G.loaders['slume-idle'], 'up');
    otherNPCs.addAnimation(7, G.loaders['slume-idle'], 'down');
    otherNPCs.setCollectionRate(0.4);
    otherNPCs.goal = 'food';
    otherNPCs.update();
    otherNPCs.play();
    otherNPCs.attack = false;
  }
  return level;
}

function finalLevel() {
  let level = new Level('level3');
  level.attachBGSetup(snowArt);
  level.attachBGSetup(templeArt);
  let possum = level.newSpriteCollection('possum', 0.5, 0.5);
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 0, 0, 8), 'left');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 1, 0, 8), 'right');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 2, 0, 8), 'up');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 3, 0, 8), 'down');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 4, 0, 8), 'idle');
  possum.setCollectionRate(0.4);
  possum.chooseSequence('idle');
  possum.update();
  possum.play();
  possum = level.newSpriteCollection('possum', random(), random(), 1);
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 0, 0, 8), 'left');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 1, 0, 8), 'right');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 2, 0, 8), 'up');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 3, 0, 8), 'down');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 4, 0, 8), 'idle');
  possum.setCollectionRate(0.4);
  possum.goal = 'food';
  possum.attack = false;
  possum.update();
  possum.play();

  return level;
}
