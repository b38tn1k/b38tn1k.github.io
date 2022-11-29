function grassArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['grass'], 64, 3, 0, 4), 4, 1);
  fg.border(splitSheet(G.loaders['grass'], 64, 2, 0, 4), 4, 1);
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
  fg.border(splitSheet(G.loaders['grass'], 64, 2, 0, 4), 4, 1);
  return bb;
}

function preTempleArt(bg, fg){
//function splitSheet(src, res, row, start, end)
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['grass'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['grass'], 64, 3, 0, 4), 4, 1);
  bb[1] = 0;
  bb[3] = 128;
  bg.topBorderDouble(splitSheet(G.loaders['grass'], 64, 6, 0, 5), 5, 1);
  bg.drawCave(splitSheet(G.loaders['grass'], 64, 7, 0, 3), 3, 1);
  fg.border(splitSheet(G.loaders['grass'], 64, 2, 0, 4), 4, 1);
  return bb;
}

function snowArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['snow'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['snow'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['snow'], 64, 3, 0, 4), 4, 1);
  fg.border(splitSheet(G.loaders['snow'], 64, 2, 0, 4), 4, 1);
  return bb;
}

function townArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['town'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['town'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['town'], 64, 3, 0, 4), 4, 1);
  fg.border(splitSheet(G.loaders['town'], 64, 2, 0, 4), 4, 1, 1, 1);
  return bb;
}

function addRandomHouse(level, x=random(), y=random()) {
  let selection = floor(random(1, 5));
  house = level.newSpriteCollection('house', x, y);
  let sheet = splitSheet(G.loaders['town'], 64, 2, selection-1, selection);
  house.addAnimation(1, sheet, 'idle');
}

function desertArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['desert'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['desert'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  let bb = bg.drawPath(splitSheet(G.loaders['desert'], 64, 3, 0, 4), 4, 1);
  fg.border(splitSheet(G.loaders['desert'], 64, 2, 0, 4), 4, 1);
  return bb;
}
function testLevelArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['temple'], 64, 0, 0, 5), 5, 1);
  return [-1, -1, -1, -1];
}

function templeArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['temple'], 64, 0, 0, 5), 5, 1);
  bg.randomTile(splitSheet(G.loaders['temple'], 64, 1, 0, 5), 5, 1, 0.4, 0.5);
  bg.setBorder(splitSheet(G.loaders['temple'], 64, 2, 0, 4), 4, 1);
  return [-1, -1, -1, -1];
}

function addRandomPickups(level, amount, name='chest', items = ['toy', 'food', 'food', 'bead']) {
  for (let i = 0; i < amount; i++) {
    level.addPickup(random(0.2, 0.8), random(0.2, 0.8), items);
    level.pickups[i].chooseImage(name);
  }
  level.optimizePickups();
}

function addPuddle(level, x, y){
  let puddle = level.newSpriteCollection('puddle', x, y, 3);
  puddle.addAnimation(4, G.loaders['puddle'], 'idle', 0, 0, 4);
  puddle.setCollectionRate(0.4);
  puddle.update();
  puddle.play();
}

function addRandomGhosts(level, amount) {
  let ghost;
  for (let i = 0; i < amount; i++) {
    ghost = level.newSpriteCollection('ghost', random(), random(), 1);
    ghost.addAnimation(4, splitSheet(G.loaders['ghost'], 64, 0, 0, 4), 'left');
    ghost.addAnimation(4, splitSheet(G.loaders['ghost'], 64, 1, 0, 4), 'right');
    ghost.setCollectionRate(0.3);
    ghost.goal = 'crystal';
    ghost.aggressive = true;
    ghost.update();
    ghost.play();
  }
}

function addRandomSpiders(level, amount) {
  let spider;
  for (let i = 0; i < amount; i++) {
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
}


function addObstacle(level, biome, x, y) {
  let obs = level.newSpriteCollection('obs', x, y, 2);
  let start = int(random(0, 4));
  obs.addAnimation(1, splitSheet(G.loaders[biome], 64, 2, start, start + 1), 'static');
  obs.setCollectionRate(10);
  obs.update();
  obs.play();
}

function addRandomRats(level, amount) {
  let rat;
  for (let i = 0; i < amount; i++) {
    rat = level.newSpriteCollection('rat', random(), random(), 1);
    rat.addAnimation(10, splitSheet(G.loaders['rat'], 52, 0, 0, 10), 'left');
    rat.addAnimation(10, splitSheet(G.loaders['rat'], 52, 1, 0, 10), 'right');
    rat.setCollectionRate(0.4);
    rat.goal = 'food';
    rat.aggressive = true;
    rat.update();
    rat.play();
  }
}

function addFinAndJake(level){
  let npc1 = level.newSpriteCollection('Finn', 0.2, 0.4);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 0, 0, 8), 32, 0, 0, 8);
  npc1.update();
  npc1.play();
  npc1 = level.newSpriteCollection('Jake', 0.24, 0.44);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 1, 0, 8), 32, 0, 0, 8);
  npc1.update();
  npc1.play();
}

function addRandomHens(level, amount) {
  let hen;
  let selection;
  for (let i = 0; i < amount; i++) {
    selection = int(random(0, 4));
    switch(selection) {
      case 0:
      hen = level.newSpriteCollection('hen', random(), random(), 1);
      hen.addAnimation(5, splitSheet(G.loaders['hen'], 32, 0, 0, 5), 'left');
      hen.addAnimation(5, splitSheet(G.loaders['hen'], 32, 1, 0, 5), 'right');
      break;
      case 1:
      hen = level.newSpriteCollection('hen', random(), random(), 1);
      hen.addAnimation(5, splitSheet(G.loaders['hen'], 32, 2, 0, 5), 'left');
      hen.addAnimation(5, splitSheet(G.loaders['hen'], 32, 3, 0, 5), 'right');
      break;
      case 2:
      hen = level.newSpriteCollection('hen', random(), random(), 1);
      hen.addAnimation(5, splitSheet(G.loaders['hen'], 32, 4, 0, 5), 'left');
      hen.addAnimation(5, splitSheet(G.loaders['hen'], 32, 5, 0, 5), 'right');
      break;
      case 3:
      hen = level.newSpriteCollection('hen', random(), random(), 1);
      hen.addAnimation(5, splitSheet(G.loaders['hen'], 32, 6, 0, 5), 'left');
      hen.addAnimation(5, splitSheet(G.loaders['hen'], 32, 7, 0, 5), 'right');
      break;
    }
    hen.setCollectionRate(0.4);
    hen.goal = 'corn';
    hen.update();
    hen.play();
    hen.attack = false;
  }
}

function addRandomBirds(level, amount) {
  let hen;
  let selection;
  for (let i = 0; i < amount; i++) {
    selection = int(random(0, 4));
    switch(selection) {
      case 0:
      hen = level.newSpriteCollection('hen', random(), random(), 1);
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 0, 0, 8), 'up');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 1, 0, 8), 'down');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 2, 0, 8), 'left');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 3, 0, 8), 'right');
      break;
      case 1:
      hen = level.newSpriteCollection('hen', random(), random(), 1);
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 4, 0, 8), 'up');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 5, 0, 8), 'down');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 6, 0, 8), 'left');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 7, 0, 8), 'right');
      break;
      case 2:
      hen = level.newSpriteCollection('hen', random(), random(), 1);
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 8, 0, 8), 'up');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 9, 0, 8), 'down');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 10, 0, 8), 'left');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 11, 0, 8), 'right');
      break;
      case 3:
      hen = level.newSpriteCollection('hen', random(), random(), 1);
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 12, 0, 8), 'up');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 13, 0, 8), 'down');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 14, 0, 8), 'left');
      hen.addAnimation(8, splitSheet(G.loaders['bird'], 16, 15, 0, 8), 'right');
      break;
    }
    hen.setCollectionRate(0.4);
    hen.goal = 'corn';
    hen.update();
    hen.play();
    hen.attack = false;
  }

}

function addRandomHumans(level, amount) {
  let otherNPCs;
  let count = 10
  for (let i = 0; i < amount; i++) {
    otherNPCs = level.newSpriteCollection('NPC' + String(count + i), random(), random(), 1);
    if (random() > 0.5) {
      otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 7, 0, 8), 'right');
      otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 6, 0, 8), 'left');
      otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 3, 0, 8), 'up');
      otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 2, 0, 8), 'down');
    } else {
      otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 15, 0, 8), 'right');
      otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 14, 0, 8), 'left');
      otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 5, 0, 8), 'up');
      otherNPCs.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 4, 0, 8), 'down');
    }

    otherNPCs.setCollectionRate(0.4);
    otherNPCs.goal = 'food';
    otherNPCs.update();
    otherNPCs.play();
    otherNPCs.attack = false;
  }
}

function addSleepyPossum(level, x, y) {
  let possum = level.newSpriteCollection('possum', x, y, 1);
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 0, 0, 8), 'left');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 1, 0, 8), 'right');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 2, 0, 8), 'up');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 3, 0, 8), 'down');
  possum.addAnimation(8, splitSheet(G.loaders['possum'], 48, 4, 0, 8), 'idle');
  possum.setCollectionRate(0.4);
  possum.movementSpeed = 2;
  possum.autochange = false;
  possum.attack = false;
  possum.aggressive = false;
  possum.chooseSequence('idle');
  possum.randomWalkOff();
  possum.goal = 'food';
  possum.update();
  possum.play();
  return possum;
}

function level0() {
  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
  let level = new Level('Level0');
  addRandomHens(level, ceil(G.dims.swarmSize/4));

  let npc1 = level.newSpriteCollection('NPC1', 0.7, 0.5);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(6, splitSheet(G.loaders['humanoid1'], 64, 8, 0, 6), 32, 0, 0, 6);
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 9, 0, 8), 'death', [7, 8]);
  npc1.update();
  npc1.play();
  level.addPickup(0.3, 0.3);
  let dialog = level.newDialog(0.65, 0.55);
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
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level1() {
  let level = new Level('level1');
  level.attachBGSetup(grassArt);
  addRandomPickups(level, G.dims.swarmSize/2);
  addRandomSpiders(level, G.dims.swarmSize);
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level2() {
  let level = new Level('level2');
  level.attachBGSetup(snowArt);
  level.addPickup(0.45, 0.4, ['toy', 'food']);
  let npc1 = level.newSpriteCollection('NPC1', 0.7, 0.5);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 10, 0, 8), 32, 0, 0, 4);
  npc1.update();
  npc1.play();
  let dialog = level.newDialog(0.65, 0.55);
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
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level3() {
  let level = new Level('level1');
  level.attachBGSetup(snowArt);
  addRandomPickups(level, G.dims.swarmSize/2);
  addObstacle(level, 'snow', 0.25, 0.6);
  addObstacle(level, 'snow', 0.75, 0.6);
  addObstacle(level, 'snow', 0.5, 0.25);
  addRandomRats(level, G.dims.swarmSize);
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level4() {
  let level = new Level('level4');
  level.attachBGSetup(snowArt);
  addRandomHouse(level, 0.8, 0.2);
  addRandomHouse(level, 0.2, 0.8);
  addRandomHens(level, ceil(G.dims.swarmSize/4));
  let npc1 = level.newSpriteCollection('NPC1', 0.5, 0.3);
  npc1.setCollectionRate(0.4);
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 16, 0, 8), 32, 0, 0, 8);
  npc1.update();
  npc1.play();
  // addFinAndJake(level);
  addRandomHumans(level, 10);
  let dialog = level.newDialog(0.5, 0.3, returnTrue);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('NPC1', 'Hello!');
  dialog.addDialogEvent('PC', 'Hi!');
  dialog.addDialogEvent('NPC1', 'Where are you headed?');
  dialog.addDialogEvent('PC', 'The Northern Temple, but without boots I am making little progress.');
  dialog.addDialogEvent('NPC1', 'Oh the Northern Temple. You are looking for knowledge? A noble quest. We have boots to spare! Would you like to trade?');
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
  addRandomBirds(level, ceil(G.dims.swarmSize/4));

  return level;
}

function level5() {
  let level = new Level('level5');
  level.attachBGSetup(grassArt);
  let possum = addSleepyPossum(level, 0.55, 0.4);

  level.addPickup(0.3, 0.25, ['food']);
  let dialog = level.newDialog(0.55, 0.5);
  dialog.updateCoords('NPC1', possum.current);
  dialog.addDialogEvent('NPC1', 'Zzz Zzz Zzz...');
  dialog.addDialogEvent('PC', 'Good Morning! Who are you?');
  let dotdot = dialog.addDialogEvent('PC', '');
  dialog.addOption(dotdot, -1, function () {return level.setSpritesToAttack()}, returnTrue);
  dialog.addChildDialogEvent(dotdot, 'NPC1', -1);
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level6() {
  let level = new Level('level6');
  level.attachBGSetup(grassArt);
  G.player.hasCompanion = true;
  addObstacle(level, 'grass', 0.25, 0.6);
  addObstacle(level, 'grass', 0.75, 0.6);
  addObstacle(level, 'grass', 0.5, 0.25);
  addObstacle(level, 'grass', 0.5, 0.6);
  addPuddle(level, 0.35, 0.5);
  addPuddle(level, 0.65, 0.5);
  addPuddle(level, 0.35, 0.25);
  addPuddle(level, 0.65, 0.25);
  addRandomPickups(level, G.dims.swarmSize);
  // addRandomRats(level, ceil(G.dims.swarmSize/2));
  // addRandomSpiders(level, ceil(G.dims.swarmSize/2));
  // let dialog = level.newDialog(0.5, 0.1, returnTrue);
  // dialog.addDialogEvent('PC', 'Thanks for the help, possum!');
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level6v2() {
  let level = new Level('level6v2');
  level.attachBGSetup(grassArt);
  G.player.hasCompanion = true;

  addPuddle(level, 0.25, 0.6);
  addPuddle(level, 0.75, 0.6);
  addPuddle(level, 0.5, 0.25);
  addPuddle(level, 0.5, 0.6);
  addObstacle(level, 'grass', 0.35, 0.5);
  addObstacle(level, 'grass', 0.65, 0.5);
  addObstacle(level, 'grass', 0.35, 0.25);
  addObstacle(level, 'grass', 0.65, 0.25);
  addRandomPickups(level, G.dims.swarmSize);
  addRandomRats(level, ceil(G.dims.swarmSize/2));
  addRandomSpiders(level, ceil(G.dims.swarmSize/2));
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
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
  // npc1.addAnimation(4, splitSheet(G.loaders['humanoid1'], 64, 12, 0, 4), 32, 0, 0, 4);
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 18, 0, 8), 32, 0, 0, 4);
  npc1.update();
  npc1.play();
  let dialog = level.newDialog(0.5, 0.5, returnTrue);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('NPC1', 'That opossum looks ravenous!');
  dialog.addDialogEvent('PC', 'Yeh... it just started following me around. It helps me with loot and puddles.');
  dialog.addDialogEvent('NPC1', 'It must like you! If you feed it, it will probably help you even more!');
  dialog.addDialogEvent('NPC1', 'Have you given it a name?');
  let parEvent = dialog.addDialogEvent('PC', '');
  dialog.addOption(parEvent, 'Daisy', function () {return G.player.companion.name = 'Daisy';}, returnTrue);
  dialog.addOption(parEvent, 'Dr. Pinknose', function () {return G.player.companion.name = 'Dr. Pinknose';}, returnTrue);
  dialog.addOption(parEvent, 'Bitey', function () {return G.player.companion.name = 'Bitey';}, returnTrue);
  dialog.addOption(parEvent, 'Ziggy', function () {return G.player.companion.name = 'Ziggy';}, returnTrue);

  let ok2 = dialog.addChildDialogEvent(parEvent,'NPC1', 'Lovely. This cave is full of crystals.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'If you bring me crystals I will give you enough food to keep Daisy happy.');
  // let ok2 = dialog.addChildDialogEvent(ok,'PC', 'OK!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'The cave is very dark and full of ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'Scary!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Possums are afraid of the dark. You should leave Daisy with me.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'uhhh. I don\'t think possums are afraid of the dark.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Well, they hate ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'So do I. uh. OK. Daisy, stay!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Good Luck!');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', '...');

  ok2 = dialog.addChildDialogEvent(parEvent,'NPC1', 'Lovely. This cave is full of crystals.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'If you bring me crystals I will give you enough food to keep Dr. Pinknose happy.');
  // ok2 = dialog.addChildDialogEvent(ok,'PC', 'OK!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'The cave is very dark and full of ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'Scary!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Possums are afraid of the dark. You should leave Dr. Pinknose with me.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'uhhh. I don\'t think possums are afraid of the dark.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Well, they hate ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'So do I. uh. OK. Dr. Pinknose, stay!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Good Luck!');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', '...');

  ok2 = dialog.addChildDialogEvent(parEvent,'NPC1', 'Lovely. This cave is full of crystals.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'If you bring me crystals I will give you enough food to keep Bitey happy.');
  // ok2 = dialog.addChildDialogEvent(ok,'PC', 'OK!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'The cave is very dark and full of ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'Scary!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Possums are afraid of the dark. You should leave Bitey with me.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'uhhh. I don\'t think possums are afraid of the dark.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Well, they hate ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'So do I. uh. OK. Bitey, stay!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Good Luck!');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', '...');

  ok2 = dialog.addChildDialogEvent(parEvent,'NPC1', 'Lovely. This cave is full of crystals.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'If you bring me crystals I will give you enough food to keep Ziggy happy.');
  // ok2 = dialog.addChildDialogEvent(ok,'PC', 'OK!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'The cave is very dark and full of ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'Scary!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Possums are afraid of the dark. You should leave Ziggy with me.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'uhhh. I don\'t think possums are afraid of the dark.');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Well, they hate ghosts.');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', 'So do I. uh. OK. Ziggy, stay!');
  ok2 = dialog.addChildDialogEvent(ok2,'NPC1', 'Good Luck!');
  ok2 = dialog.addChildDialogEvent(ok2,'PC', '...');
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level8() {
  let level = new Level('level8');
  G.player.hasCompanion = false;
  level.attachBGSetup(caveArt);
  addObstacle(level, 'cave', 0.3, 0.3);
  addObstacle(level, 'cave', 0.3, 0.7);
  addObstacle(level, 'cave', 0.7, 0.7);
  addObstacle(level, 'cave', 0.7, 0.3);
  addObstacle(level, 'cave', 0.5, 0.5);
  addRandomPickups(level, G.dims.swarmSize * 2, 'crystal1', ['crystal']);
  addRandomGhosts(level, G.dims.swarmSize);
  return level;
}

function level9() {
  let level = new Level('level9');
  G.player.hasCompanion = false;
  level.attachBGSetup(grassArt);
  level.addPickup(random(0.2, 0.8), random(0.2, 0.8));
  let dialog = level.newDialog(0.5, 0.5, returnTrue);
  dialog.addDialogEvent('PC', 'Hello?');
  dialog.addDialogEvent('PC', 'I\'m back from the caves.');
  if (G.player.inventory.hasItems('crystal') == true) {
    dialog.addDialogEvent('PC', 'I got you some crystals.');
  } else {
    dialog.addDialogEvent('PC', 'I was attacked and dropped all the crystals.');
  }
  dialog.addDialogEvent('PC', 'Is anyone there?.');
  dialog.addDialogEvent('PC', 'Helloooooo!');
  dialog.addDialogEvent('PC', G.player.companion.name + '?');
  dialog.addDialogEvent('PC', 'I should head to the next town. Maybe someone knows something.');
  addRandomBirds(level, ceil(G.dims.swarmSize/4));

  return level;
}

function level10() {
  let level = new Level('level10');
  G.player.hasCompanion = false;
  level.attachBGSetup(townArt);
  addRandomHens(level, ceil(G.dims.swarmSize/4));
  let npc1 = level.newSpriteCollection('NPC1', 0.6, 0.3);
  npc1.setCollectionRate(0.4); // add more humans!
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 11, 0, 8), 32, 0, 0, 8);
  npc1.update();
  npc1.play();
  let npc2 = level.newSpriteCollection('NPC2', 0.3, 0.4);
  npc2.setCollectionRate(0.4);
  npc2.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 16, 0, 8), 32, 0, 0, 8);
  npc2.update();
  npc2.play();
  addRandomHumans(level, 10);
  let dialog = level.newDialog(0.5, 0.5, returnTrue);
  dialog.updateCoords('NPC1', npc1.current);
  // dialog.updateCoords('NPC2', npc2.current);
  dialog.addDialogEvent('PC', 'Has anyone seen an old man with a possum?');
  // dialog.addDialogEvent('NPC2', 'An old man with a possum? I dont think so.');
  dialog.addDialogEvent('PC', 'He tricked me and stole my possum!');
  dialog.addDialogEvent('NPC1', 'One of our foragers was attacked in the woods. They are looking after him just up the road. Maybe he knows something.');
  dialog.addDialogEvent('PC', 'Thank you.');
  dialog.addDialogEvent('NPC1', 'I hope you find your possum.');
  // dialog.addDialogEvent('NPC2', 'Old man. Possum. Hmmm...');
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level11() {
  let level = new Level('level11');
  G.player.hasCompanion = false;
  level.attachBGSetup(townArt);
  addRandomHens(level, ceil(G.dims.swarmSize/4));
  let npc1 = level.newSpriteCollection('NPC1', 0.6, 0.3);
  npc1.setCollectionRate(0.4); // add more humans!
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 11, 0, 8), 32, 0, 0, 8);
  npc1.update();
  npc1.play();
  let npc2 = level.newSpriteCollection('NPC2', 0.6, 0.4);
  npc2.setCollectionRate(0.4);
  // npc2.addAnimation(6, splitSheet(G.loaders['humanoid1'], 64, 8, 0, 6), 32, 0, 0, 6);
  npc2.addAnimation(1, splitSheet(G.loaders['humanoid1'], 64, 9, 7, 8), 'death', [7, 8]);
  npc2.update();
  npc2.play();
  let dialog = level.newDialog(0.5, 0.5, returnTrue);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('PC', 'The townsfold said your friend was attacked?');
  dialog.addDialogEvent('NPC1', 'Yes. He was gathering food in the forest. Someone hit him and stole all the food.');
  dialog.addDialogEvent('PC', 'Did he describe his attacker? I\'m looking for a possum-napper.');
  dialog.addDialogEvent('NPC1', 'He\s been unconcious since we found him. We need medicine from the forest, but it\'s too dangerous.');
  dialog.addDialogEvent('PC', 'I\'ll get your medicine.');
  dialog.addDialogEvent('NPC1', 'Be safe!');
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level12() {
  let level = new Level('level12');
  level.attachBGSetup(grassArt);
  G.player.hasCompanion = false;
  addObstacle(level, 'grass', 0.25, 0.6);
  addObstacle(level, 'grass', 0.75, 0.6);
  addObstacle(level, 'grass', 0.5, 0.25);
  addObstacle(level, 'grass', 0.5, 0.6);
  addRandomRats(level, ceil(G.dims.swarmSize/2));
  addRandomPickups(level, G.dims.swarmSize*2, 'medicine1', ['medicine']);
  addRandomPickups(level, ceil(G.dims.swarmSize/2));
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level13() {
  let level = new Level('level13');
  G.player.hasCompanion = false;
  level.attachBGSetup(townArt);
  let npc1 = level.newSpriteCollection('NPC1', 0.4, 0.3);
  npc1.setCollectionRate(0.4); // add more humans!
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 11, 0, 8), 32, 0, 0, 8);
  npc1.update();
  npc1.play();
  let npc2 = level.newSpriteCollection('NPC2', 0.6, 0.5);
  npc2.setCollectionRate(0.4);
  npc2.addAnimation(6, splitSheet(G.loaders['humanoid1'], 64, 8, 0, 6), 32, 0, 0, 6);
  npc2.update();
  npc2.play();
  let dialog = level.newDialog(0.5, 0.6, returnTrue);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.updateCoords('NPC2', npc2.current);
  dialog.addDialogEvent('PC', 'I\'m back');
  dialog.addDialogEvent('NPC1', 'With medicine?');
  if (G.player.inventory.hasItems('medicine') == true) {
    let parEvent = dialog.addDialogEvent('PC', '');
    dialog.addOption(parEvent, 'Yes. Here.', function () {return G.player.removeMedicine();}, returnTrue);
    dialog.addOption(parEvent, 'Did he say anything while I was gone?', function () {return G.player.removeMedicine();}, returnTrue);
    let ok = dialog.addChildDialogEvent(parEvent,'NPC1', 'Wonderful. He should wake up soon.');
    ok = dialog.addChildDialogEvent(ok,'NPC1', '...');
    ok = dialog.addChildDialogEvent(ok, 'NPC2', 'Wha... Where am I?');
    ok = dialog.addChildDialogEvent(ok, 'NPC1', 'You were attacked. In the forest.');
    ok = dialog.addChildDialogEvent(ok, 'NPC2', 'I remember. An old man. With a caged possum.');
    ok = dialog.addChildDialogEvent(ok, 'PC', 'Where is he!?');
    ok = dialog.addChildDialogEvent(ok, 'NPC1', 'You need to rest.');
    ok = dialog.addChildDialogEvent(ok, 'NPC2', 'I\'m ok. He was heading towards the desert.');
    ok = dialog.addChildDialogEvent(ok, 'PC', 'Thankyou.');
    ok = dialog.addChildDialogEvent(ok, 'NPC2', 'Find him.');

    ok = dialog.addChildDialogEvent(parEvent,'NPC1', 'No. I will give him the medicine. He should wake up soon.');
    ok = dialog.addChildDialogEvent(ok,'NPC1', '...');
    ok = dialog.addChildDialogEvent(ok, 'NPC2', 'Wha... Where am I?');
    ok = dialog.addChildDialogEvent(ok, 'NPC1', 'You were attacked. In the forest.');
    ok = dialog.addChildDialogEvent(ok, 'NPC2', 'I remember. An old man. With a caged possum.');
    ok = dialog.addChildDialogEvent(ok, 'PC', 'Where is he!?');
    ok = dialog.addChildDialogEvent(ok, 'NPC1', 'You need to rest.');
    ok = dialog.addChildDialogEvent(ok, 'NPC2', 'I\'m ok. He was heading towards the desert.');
    ok = dialog.addChildDialogEvent(ok, 'PC', 'Thankyou.');
    ok = dialog.addChildDialogEvent(ok, 'NPC2', 'Find him.');
  } else {
    dialog.addDialogEvent('PC', 'No. I\'m so sorry.');
    dialog.addDialogEvent('NPC1', 'We will manage.');
    dialog.addDialogEvent('PC', 'Do you have any idea where the possum-napper might be?');
    dialog.addDialogEvent('NPC1', 'The desert north of here is full of villians.');
    dialog.addDialogEvent('PC', 'I will search there.');
    dialog.addDialogEvent('NPC1', 'Good luck!');
  }
  addRandomBirds(level, ceil(G.dims.swarmSize/4));

  return level;
}

function level14() {
  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
  G.player.hasCompanion = false;
  let level = new Level('Level14');
  level.attachBGSetup(desertArt);
  addObstacle(level, 'desert', 0.25, 0.6);
  addObstacle(level, 'desert', 0.75, 0.6);
  addObstacle(level, 'desert', 0.5, 0.25);
  addObstacle(level, 'desert', 0.5, 0.6);
  addRandomRats(level, ceil(G.dims.swarmSize/2));
  addRandomSpiders(level, ceil(G.dims.swarmSize/2));
  addRandomPickups(level, G.dims.swarmSize);
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level15() {
  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
  G.player.hasCompanion = false;
  let level = new Level('Level15');
  level.attachBGSetup(desertArt);
  let possum = addSleepyPossum(level, 0.5, 0.4);
  let npc1 = level.newSpriteCollection('NPC1', 0.7, 0.5);
  npc1.setCollectionRate(0.4);
  // npc1.addAnimation(4, splitSheet(G.loaders['humanoid1'], 64, 13, 0, 4), 32, 0, 0, 4);
  npc1.addAnimation(8, splitSheet(G.loaders['humanoid1'], 64, 17, 0, 8), 32, 0, 0, 4);
  npc1.update();
  npc1.play();
  let cage = level.newSpriteCollection('cage', 0.5, 0.4);
  cage.addAnimation(1, G.loaders['cage'], 64, 0, 0, 1);
  cage.update();
  cage.play();
  let dialog = level.newDialog(0.5, 0.6, returnTrue);
  dialog.updateCoords('NPC1', npc1.current);
  dialog.addDialogEvent('PC', 'Release ' + G.player.companion.name + ' right now!');
  dialog.addDialogEvent('NPC1', 'Oh, you survived the cave.');
  dialog.addDialogEvent('PC', 'You\'d better free that possum.');
  dialog.addDialogEvent('NPC1', 'Or what? Possums are delicious. And how do you know this is your possum?');
  dialog.addDialogEvent('PC', 'I know ' + G.player.companion.name + '.');
  dialog.addDialogEvent('NPC1', 'Yes yes. I guess we could trade.');
  let parEvent = dialog.addDialogEvent('PC', '');
  dialog.addOption(parEvent, 'Everything I have. Take it.', function() { level.setSpritesToAttack(false); return G.player.emptyInventory()}, function () {return G.player.hasAnything();});
  let ok = dialog.addChildDialogEvent(parEvent, 'NPC1', 'Excellent.');
  ok = dialog.addChildDialogEvent(ok, 'PC', G.player.companion.name + '!');
  dialog.addOption(parEvent, 'The only thing I will give you is my FISTS IN YOUR FACE!.', function() { return level.setSpritesToAttack(false);}, returnTrue);
  ok = dialog.addChildDialogEvent(parEvent, 'NPC1', 'Ok ok! We don\'t need that.');
  ok = dialog.addChildDialogEvent(ok, 'PC', G.player.companion.name + '!');
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function level16() {
  let [w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
  G.player.hasCompanion = true;
  let level = new Level('Level16');
  level.attachBGSetup(desertArt);
  addObstacle(level, 'desert', 0.25, 0.5);
  addObstacle(level, 'desert', 0.75, 0.5);
  addObstacle(level, 'desert', 0.5, 0.5);
  addPuddle(level, 0.4, 0.5);
  addPuddle(level, 0.6, 0.5);
  addPuddle(level, 0.5, 0.25);
  addRandomRats(level, ceil(G.dims.swarmSize/2));
  addRandomSpiders(level, ceil(G.dims.swarmSize/2));
  addRandomPickups(level, G.dims.swarmSize);
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function penultimateLevel() {
  G.player.hasCompanion = true;
  let level = new Level('final');
  level.attachBGSetup(preTempleArt);
  for (let i = 0; i < max(4, floor(G.dims.swarmSize/2)); i++) {
    addSleepyPossum(level, random(0.1, 0.9), random(0.3, 0.8));
  }
  let bby = 128 / height;
  for (let i = 0; i < level.npcs.length; i++) {
    level.npcs[i].setRandomWalkBB(0.2, bby);
  }
  let dialog = level.newDialog(0.5, 0.6, returnTrue);
  dialog.addDialogEvent('PC', 'Is this your family?');
  dialog.addDialogEvent('PC', 'Is this your home?');
  dialog.addDialogEvent('PC', 'I have been searching for this temple. Isn\'t that funny?');
  dialog.addDialogEvent('PC', 'I guess you\'ve been searching for your family.');
  let parEvent = dialog.addDialogEvent('PC', '');
  dialog.addOption(parEvent, 'Thank you for all your help, ' + G.player.companion.name + '.', function() { return level.setSpritesToAttack(false);}, returnTrue);
  dialog.addOption(parEvent, 'Goodbye, ' + G.player.companion.name + '.', function() { return level.setSpritesToAttack(false);}, returnTrue);
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}

function testLevel() {
  let level = new Level('final');
  level.attachBGSetup(testLevelArt);
  level.attachBGSetup(grassArt);
  // addPuddle(level, 0.3, 0.4);
  addSleepyPossum(level, 0.5, 0.5);

  // G.player.hasCompanion = true;

  return level;
}

function finalLevel() {
  G.player.hasCompanion = false;
  let level = new Level('final');
  level.attachBGSetup(templeArt);
  let boss = level.newSpriteCollection('comp', 0.5, 0.3);
  boss.addAnimation(8, G.loaders['computer'], 'comp', 0, 0, 8);
  boss.update();
  boss.play();
  let dialog = level.newDialog(0.5, 0.5, returnTrue);
  dialog.updateCoords('comp', boss.current);
  dialog.addDialogEvent('comp', 'cd .. && python4 godTest.py');
  dialog.addDialogEvent('PC', 'Hello?');
  dialog.addDialogEvent('comp', 'NameError: name \'tf\' is not defined');
  dialog.addDialogEvent('comp', 'python4 /test/chatbot.py');
  dialog.addDialogEvent('PC', 'ummm...');
  dialog.addDialogEvent('comp', 'Welcome Visitor.');
  dialog.addDialogEvent('comp', 'I am an all-knowing chat interface.');
  dialog.addDialogEvent('comp', 'Do you want to chat?');
  dialog.addDialogEvent('PC', 'I came to ask a question.');
  dialog.addDialogEvent('comp', 'I can answer questions.');
  let parEvent = dialog.addDialogEvent('PC', '');
  dialog.addOption(parEvent, 'How many words are there?', returnTrue, returnTrue);
  let q1resp = dialog.addChildDialogEvent(parEvent, 'comp', 'Can you imagine the size of a dictionary?');

  let next1 = dialog.addChildDialogEvent(q1resp, 'PC', '');
  let doneWithQuestions = new DialogEvent('PC', 'OK... Did I really travel all this way just to talk to a machine?');

  dialog.addOption(next1, 'Is this a question I should ask?', returnTrue, returnTrue);
  resp = dialog.addChildDialogEvent(next1, 'comp', '...');
  resp.children.push(doneWithQuestions);

  dialog.addOption(next1, 'Tell me about possums.', returnTrue, returnTrue);
  resp = dialog.addChildDialogEvent(next1, 'comp', 'Possums are marsupials. They have existed for 20 million years. Possums are immune to some snake venoms.');
  resp.children.push(doneWithQuestions);

  dialog.addOption(parEvent, 'What are atomic clocks made from?', returnTrue, returnTrue);
  let q2resp = dialog.addChildDialogEvent(parEvent, 'comp', 'Atoms. I think.');
  resp.children.push(doneWithQuestions);

  let next2 = dialog.addChildDialogEvent(q2resp, 'PC', '');

  dialog.addOption(next2, 'Is this a question I should ask?', returnTrue, returnTrue);
  resp = dialog.addChildDialogEvent(next2, 'comp', '...');
  resp.children.push(doneWithQuestions);

  dialog.addOption(next2, 'Tell me about possums.', returnTrue, returnTrue);
  resp = dialog.addChildDialogEvent(next2, 'comp', 'Possums are marsupials. They have existed for 20 million years. Possums are immune to some snake venoms.');
  resp.children.push(doneWithQuestions);

  let next = dialog.addChildDialogEvent(doneWithQuestions, 'comp', 'Did you find the answers you were looking for?');
  next = dialog.addChildDialogEvent(next, 'PC', 'Honestly, I forgot the question I wanted to ask a long time ago.');
  next = dialog.addChildDialogEvent(next, 'comp', 'You can always go back home.');
  next = dialog.addChildDialogEvent(next, 'PC', 'There is nothing there for me.');
  next = dialog.addChildDialogEvent(next, 'comp', 'You found nothing along your journey?');
  next = dialog.addChildDialogEvent(next, 'PC', 'I found something. I found a friend.');
  next = dialog.addChildDialogEvent(next, 'comp', 'Aww! I don\'t know what to say. Thank you.');
  next = dialog.addChildDialogEvent(next, 'PC', 'No, not you.');
  next = dialog.addChildDialogEvent(next, 'comp', 'Oh.');
  // up to here is ok
  parEvent = dialog.addChildDialogEvent(next, 'PC', '');
  dialog.addOption(parEvent, 'OK. Bye.', function(){return transitionLevel();}, returnTrue);
  dialog.addOption(parEvent, 'Can I go now?', function(){return transitionLevel();}, returnTrue);

  return level;
}

function finalFinalLevel() {
  G.player.hasCompanion = true;
  let level = new Level('final');
  level.attachBGSetup(preTempleArt);
  for (let i = 0; i < max(4, floor(G.dims.swarmSize/2)); i++) {
    addSleepyPossum(level, random(0.1, 0.9), random(0.3, 0.8));
  }
  let bby = 128 / height;
  for (let i = 0; i < level.npcs.length; i++) {
    level.npcs[i].setRandomWalkBB(0.2, bby);
  }
  level.setSpritesToAttack();
  let dialog = level.newDialog(0.5, 0.8, returnTrue);
  dialog.addDialogEvent('PC', 'I\'m back!');
  function fflogic(player, inputs, level) {
    if (level.levelTimer > 100) {
      player.companion.setTarget(player);
      level.deleteDialogs();
    }
    if (level.levelTimer > 150) {
      player.companion.setTarget(player);
      G.state = END_GAME;
    }
    // add timers to the end card in here etc
  }
  level.levelLogic = fflogic;
  addRandomBirds(level, ceil(G.dims.swarmSize/4));
  return level;
}
