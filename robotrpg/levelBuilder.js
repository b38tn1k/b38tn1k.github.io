function addComp(level, x, y) {
  let comp = level.newSpriteCollection('comp', x, y);
  comp.addAnimation(8, G.loaders['computer'], 'comp', 0, 0, 8);
  comp.update();
  comp.play();
}

function testLevelArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['temple'], 64, 0, 0, 5), 5, 1);
  return [-1, -1, -1, -1];
}

function factory() {
  let level = new Level('factory');
  // addComp(level, 0.1, 0.2);
  level.attachBGSetup(testLevelArt);
  return level;
}
