class Companion extends ChasingSprites {
  constructor() {
    super(G.dims.w * 0.5 + 32, G.dims.h * 0.8);
    this.aggressive = false;
    this.attack = false;
    this.movementSpeed = 2;
    this.name = 'Daisy';
    this.pickupCounter = 0;
    this.setRandomWalkBB(0.2, 0.01);
  }
  reset(player) {
    this.current.tx = player.current.tx + 32;
    this.current.ty = player.current.ty;
    this.removeTarget();
    this.pickupCounter = 0;
    this.x = this.current.tx;
    this.y = this.current.ty;
    this.layer = G.graphLayers.getLayer('sprites', true, 100);
    this.layer.clearable = true;
  }

  findCloset(points){
    let distances = [];
    for (let i = 0; i < points.length; i++){
      distances.push(int(pow((this.current.tx - points[i].bbox[0]), 2)) + int(pow((this.current.ty - points[i].bbox[1]), 2)));
    }
    return points[distances.indexOf(min(distances))];
  }

  update(player, level) {
    if (!(player && level)) {
      return false;
    }
    let hitTarget = super.update(player);
    if (level.pickups.length == 0) {
      this.randomWalkOn();
    } else {
      if (hitTarget == true) {
        this.changeSpriteTimer = -1;
        level.pickups[this.pickupCounter].turnOff(player);
      }
      let continueFlag = true;
      while(level.pickups[this.pickupCounter].isActive == false) {
        this.pickupCounter += 1;
        if (this.pickupCounter > level.pickups.length-1) {
          level.pickups = [];
          this.removeTarget();
          continueFlag = false;
          break;
        }
      }
      if (continueFlag == true) {
        this.setTarget(level.pickups[this.pickupCounter]);
      }
    }
  }

};
