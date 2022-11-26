class StickySprites extends SpriteCollection {
  constructor(x, y) {
    super(x, y, true);
    this.bbox = [x-32, y-32, x + 32, y + 32];
    this.activeTrap = true;
  }

  update(player, target = []) {
    if (!player) {
      return false;
    }
    super.update();
    const playerBD = bounded(this.bbox, player.x, player.y);
    const compBD = bounded(this.bbox, player.companion.x, player.companion.y);
    if (this.activeTrap == true && playerBD.complete == true) {
      player.chooseSequence('stuck');
      player.hit = new HitThing('help', 0, this.x + 16, this.y - 32);
      player.isStuck = true;
      player.companion.setTarget(player);
      player.current.tx = this.x;
      player.current.ty = this.y;
    }
    if (this.activeTrap == true && playerBD.complete ==  true && compBD.complete == true) {
      player.hit = new HitThing('safe', 0, this.x + 16, this.y - 32);
      this.activeTrap = false;
      player.chooseSequence('down');
      player.isStuck = false;
      player.companion.removeTarget();
    }
  }

};
