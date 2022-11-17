class Companion extends ChasingSprites {
  constructor() {
    super(G.dims.w * 0.5 + 32, G.dims.h * 0.8);
    this.aggressive = false;
    this.attack = false;
    this.movementSpeed = 2;
    this.name = '';
  }

  findCloset(points){
    let distances = [];
    for (let i = 0; i < points.length; i++){
      distances.push(int(pow((this.current.tx - points[i].x), 2)) + int(pow((this.current.ty - points[i].y), 2)));
    }
    return points[distances.indexOf(min(distances))];
  }

  update(player, level) {
    if (!(player && level)) {
      return false;
    }
    let targets = [];
    super.update(player);
    for (let i = 0; i < level.pickups.length; i++) {
      if (level.pickups[i].draw == true) {
        targets.push(level.pickups[i]);
        this.randomWalkOff();
      }
    }
    if (targets.length == 0) {
      this.randomWalkOn();
    } else {
      let target = this.findCloset(targets);
      let approach = bounded(target.bb, this.current.tx, this.current.ty);

      if (approach.horizontal == true) {
        // do nothing;
      } else if (approach.onRight == true) {
        this.current.tx += this.movementSpeed;
      } else {
        this.current.tx -= this.movementSpeed;
      }
      if (approach.vertical == true) {
        // do nothing
      } else if (approach.onTop == true) {
        this.current.ty += this.movementSpeed;
      } else {
        this.current.ty -= this.movementSpeed;
      }
      if (bounded(target.bb, this.current.tx, this.current.ty).complete == true) {
        target.draw = false;
        player.addItem(target.item);
        player.hit = new HitThing(target.item, 1, this.current.tx, this.current.ty);
      }
    }
  }

};
