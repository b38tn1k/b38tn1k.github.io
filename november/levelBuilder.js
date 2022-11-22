function grassArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['grass'], 64, 3, 0, 4), 4, 1);
  fg.border(splitSheet(G.loaders['grass'], 64, 2, 0, 2), 2, 1);
  return bb;
}

function caveArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['cave'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['cave'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['cave'], 64, 3, 0, 4), 4, 1);
  fg.border(splitSheet(G.loaders['cave'], 64, 2, 0, 4), 4, 1);
  return bb;
}

function preCaveArt(bg, fg){
//function splitSheet(src, res, row, start, end)
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['grass'], 64, 3, 0, 4), 4, 1);
  bb[1] = 0;
  bb[3] = 128;
  bg.topBorderDouble(splitSheet(G.loaders['grass'], 64, 4, 0, 5), 5, 1);
  bg.drawCave(splitSheet(G.loaders['grass'], 64, 5, 0, 3), 3, 1);
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
function testLevelArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['temple'], 64, 0, 0, 5), 5, 1);
  return [-1, -1, -1, -1];
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
  //function splitSheet(src, res, row, start, end)

  npc1.addAnimation(6, splitSheet(G.loaders['humanoid1'], 64, 8, 0, 6), 32, 0, 0, 6);
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 9, 0, 8), 'death', [7, 8]);
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
  dialog.addOption(parEvent, 'I\'m hungry too.', function () {npc1.changeSequence(1, true);}, returnTrue);
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
  for (let i = 0; i < G.dims.swarmSize/2; i++) {
    level.addPickup(random(0.2, 0.8), random(0.2, 0.8), ['toy', 'food']);
  }
  level.optimizePickups();
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
  level.addPickup(0.45, 0.4, ['toy', 'food']);
  let npc1 = level.newSpriteCollection('NPC1', 0.7, 0.5);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(4, splitSheet(G.loaders['humanoid1'], 64, 10, 0, 4), 32, 0, 0, 4);
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
  let level = new Level('level1');
  level.attachBGSetup(snowArt);

  //function splitSheet(src, res, row, start, end)
  let rat;
  for (let i = 0; i < G.dims.swarmSize/2; i++) {
    level.addPickup(random(0.2, 0.8), random(0.2, 0.8), ['toy', 'food']);
  }
  level.optimizePickups();
  let tree = level.newSpriteCollection('tree', 0.25, 0.6, 2);
  tree.addAnimation(2, splitSheet(G.loaders['snow'], 64, 2, 0, 2), 'static');
  tree.setCollectionRate(10);
  tree.update();
  tree.play();
  tree = level.newSpriteCollection('tree', 0.75, 0.6, 2);
  tree.addAnimation(2, splitSheet(G.loaders['snow'], 64, 2, 0, 2), 'static');
  tree.setCollectionRate(10);
  tree.update();
  tree.play();
  tree = level.newSpriteCollection('tree', 0.5, 0.25, 2);
  tree.addAnimation(2, splitSheet(G.loaders['snow'], 64, 2, 0, 2), 'static');
  tree.setCollectionRate(10);
  tree.update();
  tree.play();

  for (let i = 0; i < G.dims.swarmSize; i++) {
    rat = level.newSpriteCollection('rat', random(), random(), 1);
    rat.addAnimation(10, splitSheet(G.loaders['rat'], 52, 0, 0, 10), 'left');
    rat.addAnimation(10, splitSheet(G.loaders['rat'], 52, 1, 0, 10), 'right');
    rat.setCollectionRate(0.4);
    rat.goal = 'food';
    rat.aggressive = true;
    rat.update();
    rat.play();
  }
  return level;
}

function level4() {
  let level = new Level('level4');
  level.attachBGSetup(snowArt);
  let npc1 = level.newSpriteCollection('NPC1', 0.5, 0.3);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 11, 0, 8), 32, 0, 0, 8);
  npc1.update();
  npc1.play();
  let dialog = level.newDialog(0.5, 0.3, returnTrue);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('NPC1', 'Hello!');
  dialog.addDialogEvent('PC', 'Hi!');
  dialog.addDialogEvent('NPC1', 'Where are you headed?');
  dialog.addDialogEvent('PC', 'North, but without boots I am making little progress.');
  dialog.addDialogEvent('NPC1', 'We have boots to spare! Would you like to trade?');
  let parEvent = dialog.addDialogEvent('PC');

  dialog.addOption(parEvent, 'I have nothing useful to trade.', returnTrue, function () {return G.player.hasNoFood();});
  let nothing = dialog.addChildDialogEvent(parEvent, 'NPC1', 'As I said, boots to spare! Take them. They are yours.');
  nothing = dialog.addChildDialogEvent(nothing, 'PC', '');
  dialog.addOption(nothing, 'Thank you!', function () {return G.player.addItem('boot');}, returnTrue);
  dialog.addOption(nothing, 'I couldn\'t.', function () {return G.player.addItem('boot');}, returnTrue);
  dialog.addChildDialogEvent(nothing, 'NPC1', 'You are always welcome.');
  nothing = dialog.addChildDialogEvent(nothing, 'NPC1', 'We insist.');
  dialog.addChildDialogEvent(nothing, 'PC', 'Thank you!');

  nothing = dialog.addChildDialogEvent(nothing, 'PC', 'OK!');
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

  let otherNPCs;
  for (let i = 0; i < 10; i++) {
    otherNPCs = level.newSpriteCollection('NPC', random(), random(), 1);
    // npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 7, 0, 8), 32, 0, 0, 1);
    otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 7, 0, 8), 'right');
    otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 6, 0, 8), 'left');
    otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 3, 0, 8), 'up');
    otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 2, 0, 8), 'down');
    otherNPCs.setCollectionRate(0.4);
    otherNPCs.goal = 'food';
    otherNPCs.update();
    otherNPCs.play();
    otherNPCs.attack = false;
  }
  return level;
}

function level5() {
  let level = new Level('level5');
  level.attachBGSetup(grassArt);
  let possum = level.newSpriteCollection('possum', 0.55, 0.4, 1);
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 0, 0, 8), 'left');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 1, 0, 8), 'right');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 2, 0, 8), 'up');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 3, 0, 8), 'down');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 4, 0, 8), 'idle');
  possum.setCollectionRate(0.4);
  possum.movementSpeed = 2;
  possum.autochange = false;
  possum.chooseSequence('idle');
  possum.randomWalkOff();
  possum.goal = 'food';
  possum.update();
  possum.play();

  level.addPickup(0.3, 0.25, ['food']);
  let dialog = level.newDialog(0.55, 0.5);
  dialog.updateCoords('NPC1', possum.current);
  dialog.addDialogEvent('NPC1', 'Zzz Zzz Zzz...');
  dialog.addDialogEvent('PC', 'Good Morning!');
  let dotdot = dialog.addDialogEvent('PC', '');
  dialog.addOption(dotdot, -1, function () {return level.setSpritesToAttack()}, returnTrue);
  dialog.addChildDialogEvent(dotdot, 'NPC1', -1);
  return level;
}

function level6() {
  let level = new Level('level6');
  level.attachBGSetup(grassArt);
  G.player.hasCompanion = true;
  let tree = level.newSpriteCollection('tree', 0.25, 0.6, 2);
  tree.addAnimation(2, splitSheet(G.loaders['grass'], 64, 2, 0, 2), 'static');
  tree.setCollectionRate(10);
  tree.update();
  tree.play();
  tree = level.newSpriteCollection('tree', 0.75, 0.6, 2);
  tree.addAnimation(2, splitSheet(G.loaders['grass'], 64, 2, 0, 2), 'static');
  tree.setCollectionRate(10);
  tree.update();
  tree.play();
  tree = level.newSpriteCollection('tree', 0.5, 0.25, 2);
  tree.addAnimation(2, splitSheet(G.loaders['grass'], 64, 2, 0, 2), 'static');
  tree.setCollectionRate(10);
  tree.update();
  tree.play();
  tree = level.newSpriteCollection('tree', 0.5, 0.6, 2);
  tree.addAnimation(2, splitSheet(G.loaders['grass'], 64, 2, 0, 2), 'static');
  tree.setCollectionRate(10);
  tree.update();
  tree.play();
  let rat;
  for (let i = 0; i < ceil(G.dims.swarmSize/2); i++) {
    rat = level.newSpriteCollection('rat', random(), random(), 1);
    rat.addAnimation(10, splitSheet(G.loaders['rat'], 52, 0, 0, 10), 'left');
    rat.addAnimation(10, splitSheet(G.loaders['rat'], 52, 1, 0, 10), 'right');
    rat.setCollectionRate(0.4);
    rat.goal = 'food';
    rat.aggressive = true;
    rat.update();
    rat.play();
  }
  for (let i = 0; i < G.dims.swarmSize; i++) {
    level.addPickup(random(0.2, 0.8), random(0.2, 0.8));
  }
  level.optimizePickups();
  let spider;
  for (let i = 0; i < ceil(G.dims.swarmSize/2); i++) {
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

function level7() {
  let level = new Level('level7');
  G.player.hasCompanion = true;
  level.attachBGSetup(preCaveArt); // change to precave art
  level.addPickup(random(0.2, 0.8), random(0.2, 0.8));
  let npc1 = level.newSpriteCollection('NPC1', 0.4, 0.4);
  npc1.setCollectionRate(0.4);
  // npc1.addAnimation(7, splitSheet(G.loaders['slume-idle'], 32, 1, 0, 7), 'right');
  npc1.addAnimation(4, splitSheet(G.loaders['humanoid1'], 64, 12, 0, 4), 32, 0, 0, 4);
  npc1.update();
  npc1.play();
  let dialog = level.newDialog(0.5, 0.3, returnTrue);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('NPC1', 'That opossum looks ravenous!');
  dialog.addDialogEvent('PC', 'Yeh... it just started following me around.');
  dialog.addDialogEvent('NPC1', 'It must like you! If you feed it, it will probably help you out.');
  dialog.addDialogEvent('PC', 'Interesting...');
  dialog.addDialogEvent('NPC1', 'Have you given it a name?');
  let parEvent = dialog.addDialogEvent('PC', '');
  dialog.addOption(parEvent, 'Daisy', function () {return G.player.companion.name = 'Daisy';}, returnTrue);
  dialog.addOption(parEvent, 'Dr. Pinknose', function () {return G.player.companion.name = 'Dr. Pinknose';}, returnTrue);
  dialog.addOption(parEvent, 'Bitey', function () {return G.player.companion.name = 'Bitey';}, returnTrue);
  dialog.addOption(parEvent, 'Ziggy', function () {return G.player.companion.name = 'Ziggy';}, returnTrue);
  let ok = dialog.addChildDialogEvent(parEvent,'NPC1', 'This cave is full of crystals. If you bring me crystals I will give you enough food to keep Daisy happy.');
  let ok2 = dialog.addChildDialogEvent(ok,'PC', 'OK!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'The cave is very dark and full of ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'Scary!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Possums are afraid of the dark. You should leave Daisy with me.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'uhhh. I don\'t think possums are afraid of the dark.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Well, they hate ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'So do I. uh. OK. Daisy, stay!');

  ok = dialog.addChildDialogEvent(parEvent,'NPC1', 'This cave is full of crystals. If you bring me crystals I will give you enough food to keep Dr. Pinknose happy.');
  ok2 = dialog.addChildDialogEvent(ok,'PC', 'OK!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'The cave is very dark and full of ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'Scary!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Possums are afraid of the dark. You should leave Dr. Pinknose with me.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'uhhh. I don\'t think possums are afraid of the dark.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Well, they hate ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'So do I. uh. OK. Dr. Pinknose, stay!');

  ok = dialog.addChildDialogEvent(parEvent,'NPC1', 'This cave is full of crystals. If you bring me crystals I will give you enough food to keep Bitey happy.');
  ok2 = dialog.addChildDialogEvent(ok,'PC', 'OK!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'The cave is very dark and full of ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'Scary!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Possums are afraid of the dark. You should leave Bitey with me.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'uhhh. I don\'t think possums are afraid of the dark.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Well, they hate ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'So do I. uh. OK. Bitey, stay!');

  ok = dialog.addChildDialogEvent(parEvent,'NPC1', 'This cave is full of crystals. If you bring me crystals I will give you enough food to keep Ziggy happy.');
  ok2 = dialog.addChildDialogEvent(ok,'PC', 'OK!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'The cave is very dark and full of ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'Scary!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Possums are afraid of the dark. You should leave Ziggy with me.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'uhhh. I don\'t think possums are afraid of the dark.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Well, they hate ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'So do I. uh. OK. Ziggy, stay!');
  return level;
}

function level8() {
  let level = new Level('level8');
  G.player.hasCompanion = false;
  level.attachBGSetup(caveArt);

  splitSheet(G.loaders['cave'], 64, 2, 0, 4)

  rock = level.newSpriteCollection('rocks', 0.3, 0.3, 2);
  rock.addAnimation(1, splitSheet(G.loaders['cave'], 64, 2, 3, 4), 'static');
  rock.setCollectionRate(10);
  rock.update();
  rock.play();

  rock = level.newSpriteCollection('rocks', 0.3, 0.7, 2);
  rock.addAnimation(1, splitSheet(G.loaders['cave'], 64, 2, 1, 2), 'static');
  rock.setCollectionRate(10);
  rock.update();
  rock.play();

  rock = level.newSpriteCollection('rocks', 0.7, 0.3, 2);
  rock.addAnimation(1, splitSheet(G.loaders['cave'], 64, 2, 0, 1), 'static');
  rock.setCollectionRate(10);
  rock.update();
  rock.play();

  rock = level.newSpriteCollection('rocks', 0.7, 0.7, 2);
  rock.addAnimation(1, splitSheet(G.loaders['cave'], 64, 2, 3, 4), 'static');
  rock.setCollectionRate(10);
  rock.update();
  rock.play();

  rock = level.newSpriteCollection('rocks', 0.5, 0.5, 2);
  rock.addAnimation(1, splitSheet(G.loaders['cave'], 64, 2, 3, 4), 'static');
  rock.setCollectionRate(10);
  rock.update();
  rock.play();

  for (let i = 0; i < G.dims.swarmSize * 2; i++) {
    level.addPickup(random(0.2, 0.8), random(0.2, 0.8), ['crystal']);
    level.pickups[i].chooseImage('crystal1');
  }
  level.optimizePickups();

  let ghost; // replace with ghosts

  for (let i = 0; i < G.dims.swarmSize; i++) {
    ghost = level.newSpriteCollection('ghost', random(), random(), 1);
    ghost.addAnimation(4, splitSheet(G.loaders['ghost'], 64, 0, 0, 4), 'left');
    ghost.addAnimation(4, splitSheet(G.loaders['ghost'], 64, 1, 0, 4), 'right');
    ghost.setCollectionRate(0.3);
    ghost.goal = 'crystal';
    ghost.aggressive = true;
    ghost.update();
    ghost.play();
  }

  return level;
}

function level9() {
  let level = new Level('level9');
  G.player.hasCompanion = false;
  level.attachBGSetup(grassArt);
  level.addPickup(random(0.2, 0.8), random(0.2, 0.8));
  let npc1 = level.newSpriteCollection('NPC1', 0.7, 0.5);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(4, splitSheet(G.loaders['humanoid1'], 64, 13, 0, 4), 32, 0, 0, 4);
  npc1.update();
  npc1.play();
  let dialog = level.newDialog(0.7, 0.5, returnTrue);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('NPC1', 'You survived!');
  dialog.addDialogEvent('PC', 'Yup.');
  dialog.addDialogEvent('NPC1', 'Find any crystals?');
  G.player.companion.name = 'Milky Joe';
  if (G.player.inventory.hasItems('crystal') == true) {
    dialog.addDialogEvent('PC', 'Yup.');
  } else {
    dialog.addDialogEvent('PC', 'Nope.');
    dialog.addDialogEvent('NPC1', 'Wanna sell me that possum?');
    dialog.addDialogEvent('PC', 'Nope. ' + G.player.companion.name + ' belongs to themselves.');
    dialog.addDialogEvent('NPC1', 'Sure, sure...');
    let dotdot = dialog.addDialogEvent('PC', '');
    dialog.addOption(dotdot, -1, function () {return level.setSpritesToAttack()}, returnTrue);
    dialog.addChildDialogEvent(dotdot, 'NPC1', -1);
  }

  let possum = level.newSpriteCollection('possum', 0.4, 0.4, 1);
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 0, 0, 8), 'left');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 1, 0, 8), 'right');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 2, 0, 8), 'up');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 3, 0, 8), 'down');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 4, 0, 8), 'idle');
  possum.setCollectionRate(0.4);
  possum.movementSpeed = 2;
  possum.autochange = false;
  possum.chooseSequence('idle');
  possum.randomWalkOff();
  possum.goal = 'food';
  possum.update();
  possum.play();
  level.addPickup(0.3, 0.25, ['food']);
  return level;
}

function testLevel() {
  let level = new Level('test');
  G.player.hasCompanion = true;
  level.attachBGSetup(testLevelArt);
  level.addPickup(random(0.2, 0.8), random(0.2, 0.8));
  let rat = level.newSpriteCollection('rat', random(), random(), 1);
  rat.addAnimation(10, splitSheet(G.loaders['rat'], 52, 0, 0, 10), 'left');
  rat.addAnimation(10, splitSheet(G.loaders['rat'], 52, 1, 0, 10), 'right');
  rat.setCollectionRate(0.4);
  rat.goal = 'food';
  rat.aggressive = true;
  rat.update();
  rat.play();
  return level;
}

function finalLevel() {
  let level = new Level('final');
  level.attachBGSetup(snowArt);
  level.attachBGSetup(templeArt);
  let possum = level.newSpriteCollection('possum', 0.5, 0.5);
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 4, 0, 8), 'idle');
  possum.setCollectionRate(0.4);
  possum.chooseSequence('idle');
  possum.update();
  possum.play();

  return level;
}
