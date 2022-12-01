function addComp(level, x, y) {
  let comp = level.newSpriteCollection('comp', x, y);
  comp.addAnimation(8, G.loaders['computer'], 'comp', 0, 0, 8);
  comp.update();
  comp.play();
}

function addSingleSprite(level, key, x, y) {
  let spr = level.newSpriteCollection(key, x, y, 4);
  spr.addAnimation(1, G.loaders[key], key, 0, 0, 4);
  spr.init();
  spr.update();
  spr.play();
  return spr;
}

function testLevelArt(bg, fg){
  bg.randomTile(splitSheet(G.loaders['lab'], 64, 0, 0, 5), 5, 1);
  return [-1, -1, -1, -1];
}

function factory() {
  let level = new Level('factory');
  // addComp(level, 0.1, 0.2);
  // addSingleSprite(level, 'table', 0.5, 0.4);
  // addSingleSprite(level, 'vogui', 0.5, 0.5);
  // addSingleSprite(level, 'URarm', 0.4, 0.5);
  addSingleSprite(level, 'worker', 0.5, 0.5);
  let spr = addSingleSprite(level, 'table' , 0.4, 0.5);spr.current.tx = 161;spr.current.ty = 82;
  spr = addSingleSprite(level, 'vogui' , 0.4, 0.5);spr.current.tx = 328;spr.current.ty = 199;
  spr = addSingleSprite(level, 'URarm' , 0.4, 0.5);spr.current.tx = 27;spr.current.ty = 32;
  spr = addSingleSprite(level, 'mobileManipulator' , 0.4, 0.5);spr.current.tx = 393;spr.current.ty = 199;
  spr = addSingleSprite(level, 'table' , 0.4, 0.5);spr.current.tx = 161;spr.current.ty = 109;
  spr = addSingleSprite(level, 'table' , 0.4, 0.5);spr.current.tx = 160;spr.current.ty = 137;
  spr = addSingleSprite(level, 'table' , 0.4, 0.5);spr.current.tx = 160;spr.current.ty = 165;
  spr = addSingleSprite(level, 'table' , 0.4, 0.5);spr.current.tx = 160;spr.current.ty = 193;
  spr = addSingleSprite(level, 'table' , 0.4, 0.5);spr.current.tx = 484;spr.current.ty = 67;
  spr = addSingleSprite(level, 'table' , 0.4, 0.5);spr.current.tx = 484;spr.current.ty = 95;
  spr = addSingleSprite(level, 'table' , 0.4, 0.5);spr.current.tx = 484;spr.current.ty = 123;
  spr = addSingleSprite(level, 'table' , 0.4, 0.5);spr.current.tx = 483;spr.current.ty = 151;
  spr = addSingleSprite(level, 'URarm' , 0.4, 0.5);spr.current.tx = 165;spr.current.ty = 72;
  spr = addSingleSprite(level, 'URarm' , 0.4, 0.5);spr.current.tx = 164;spr.current.ty = 157;
  for (let i = 0; i < level.npcs.length; i++) {
    if (level.npcs[i].clickable == true) {
      level.npcs[i].init();
    }
  }
  level.attachBGSetup(testLevelArt);
  return level;
}
