class Companion extends ChasingSprites {
  constructor() {
    super(G.dims.w * 0.5 + 32, G.dims.h * 0.8);
    this.aggressive = false;
    this.attack = false;
    this.movementSpeed = 2;
    this.name = '';
    this.pickupCounter = 0;
    this.setRandomWalkBB(0.2, 0.01);
  }
  reset(player) {
    this.current.tx = player.current.tx + 32;
    this.current.ty = player.current.tx + 32;
    console.log(this.current.tx, this.current.ty)
    this.removeTarget();
    this.pickupCounter = 0;
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
    //   if (this.target == null) {
    //     this.target = level.pickups[this.pickupCounter];
    //     while (this.target.isActive == false) {
    //       this.pickupCounter += 1;
    //       this.target = level.pickups[this.pickupCounter];
    //     }
    //   }
    //
    //   let approach = bounded(this.target.bbox, this.current.tx, this.current.ty);
    //   if (approach.horizontal == true) {
    //     // do nothing;
    //   } else if (approach.onLeft == true) {
    //     this.current.tx += this.movementSpeed;
    //   } else {
    //     this.current.tx -= this.movementSpeed;
    //   }
    //   if (approach.vertical == true) {
    //     // do nothing
    //   } else if (approach.onTop == true) {
    //     this.current.ty += this.movementSpeed;
    //   } else {
    //     this.current.ty -= this.movementSpeed;
    //   }
    //
    //   for (let i = 0; i < level.pickups.length; i++) {
    //     if (bounded(level.pickups[i].bbox, this.current.tx, this.current.ty).complete == true) {
    //       if (level.pickups[i].isActive == true) {
    //         player.addItem(level.pickups[i].item);
    //         player.hit = new HitThing(level.pickups[i].item, 1, this.current.tx, this.current.ty);
    //       }
    //       level.pickups[i].isActive = false;
    //       // level.pickups.splice(i, 1);
    //       while (this.target.isActive == false) {
    //         this.pickupCounter += 1;
    //         if (this.pickupCounter >= level.pickups.length) {
    //           level.pickups = [];
    //           break;
    //         } else {
    //           this.target = level.pickups[this.pickupCounter];
    //         }
    //       }
    //       break;
    //     }
    //   }
    }
  }

};
