class ChasingSprites extends SpriteCollection {
  constructor(x, y) {
    super(x, y, true);
    this.attack = true; // vs flee?
    this.movementSpeed = 1;
    this.goal;
    this.randomWalkTimer = 0;
    this.randomWalkInterval = 5;
    this.randomWalkVector;
    this.prevX;
    this.prevY;
    this.prevX = (x < G.dims.cx) ? x-1 : x+1;
    this.recalculateRandomWalkVector();
    this.direction = 'up';
    this.prevDir = '';
    this.randomWalkBB = [0, G.dims.w, 0, G.dims.h];
    this.doRandomWalk = true;
    this.autochange = true;
    this.changeSpriteTimer = 0;
    this.changeSpriteThresh = 15;
    this.hasTarget = false;
    this.target = null;
    // showColors();
  }

  randomWalkOff() {
    this.doRandomWalk = false;
  }

  randomWalkOn() {
    this.doRandomWalk = true;
  }

  recalculateRandomWalkVector() {
    let xAmp = random();
    let yAmp = 1.0 - xAmp;
    let xDir = (random() > 0.5) ? -1 : 1;
    let yDir = (random() > 0.5) ? -1 : 1;
    this.randomWalkVector = [xAmp * xDir, yAmp * yDir];
  }

  setRandomWalkBB(x, y) {
    this.randomWalkBB = [G.dims.w*x, G.dims.w * (1-x), G.dims.h*y, G.dims.h*(1-y)];
  }

  doAttack(player) {
    this.attack = false;
    let item = player.inventory.getRandomOwnedInventoryItem('boot');
    player.subtractItem(item);
    player.hit = new HitThing(item, -1, player.x, player.y - player.current.g.height/2);
  }

  randomWalkHandler() {
    if (this.randomWalkTimer == this.randomWalkInterval) {
      this.recalculateRandomWalkVector();
      this.changeSpriteTimer = -2;
      this.randomWalkInterval = int(random(20, 100));
      this.randomWalkTimer = 0;
    }
    this.current.tx += this.movementSpeed * this.randomWalkVector[1];
    this.current.ty += this.movementSpeed * this.randomWalkVector[0];
    this.randomWalkTimer += 1;
    // keep in bounds
    const bCheck = bounded([this.randomWalkBB[0], this.randomWalkBB[2], this.randomWalkBB[1], this.randomWalkBB[3]], this.current.tx, this.current.ty);
    if (bCheck.horizontal == false) {
      this.randomWalkVector[1] *= -1;
    }
    if (bCheck.vertical == false) {
      this.randomWalkVector[0] *= -1;
    }
  }

  determineDirection() {
    let deltaX = this.prevX - this.current.tx;
    let deltaY = this.prevY - this.current.ty;
    let a = atan2(deltaX, deltaY);
    if ('up' in this.tags) {
      if (a > -radians(90) && a < radians(90)) {
        this.direction = 'up';
      } else {
        this.direction = 'down';
      }
      if (a > radians(45) && a < radians(135)) {
        this.direction = 'left';
      } else if (-a > radians(45) && -a < radians(135)) {
        this.direction = 'right';
      }
    } else {
      if (deltaX > 0) {
        this.direction = 'left';
      } else {
        this.direction = 'right';
      }
    }
  }

  approachTarget(target){
    let hit = false;
    if (int(target.x) > int(this.x - 1) && int(target.x) > int(this.x + 1))  {
      this.current.tx += this.movementSpeed;
    } else if (int(target.x) < int(this.x) -1 && int(target.x) < int(this.x) + 1) {
      this.current.tx -= this.movementSpeed;
    }
    if (int(target.y) > int(this.y) -1 && int(target.y) > int(this.y) + 1) {
      this.current.ty += this.movementSpeed;
    } else if (int(target.y) < int(this.y) - 1 && int(target.y) < int(this.y) + 1) {
      this.current.ty -= this.movementSpeed;
    }
    if (bounded(target.bbox, this.x, this.y).complete == true) {
      hit = true;
    }
    return hit;
  }

  decideToReAttack() {
    if (this.aggressive == true) {
      this.attack = true;
    }
  }

  setTarget(target) {
    this.target = target;
    this.hasTarget = true;
  }

  removeTarget() {
    this.target = null;
    this.hasTarget = false;
  }

  update(player, target = []) {
    if (!player) {
      return false;
    }
    let hitTarget = false;
    super.update();
    this.prevX = this.current.tx;
    this.prevY = this.current.ty;
    // attack behavior monitoring
    if (player.inventory.checkInventory(this.goal).has == false) {
      this.attack = false;
    } else {
      this.decideToReAttack();
    }
    // do attack!
    if (this.attack == true) {
      const hit = this.approachTarget(player);
      if (hit == true) {
        this.doAttack(player);
      }
    }

    if (this.hasTarget == true) {
      hitTarget = this.approachTarget(this.target);
    }

    // if not attack, do random walk
    if (this.attack == false && this.hasTarget == false) {
      if (this.doRandomWalk == true) {
        this.randomWalkHandler();
      }
    }
    // chose animation based on direction
    if (this.autochange == true && this.changeSpriteTimer == 0) {
      this.determineDirection();
      this.chooseSequence(this.direction);
    }
    // keep in bounds brute approach (changes in random walk dir also)
    this.current.tx = constrain(this.current.tx, this.randomWalkBB[0], this.randomWalkBB[1]);
    this.current.ty = constrain(this.current.ty, this.randomWalkBB[2], this.randomWalkBB[3]);
    // trigger animation selection changing
    this.changeSpriteTimer += 1;
    if (this.changeSpriteTimer == this.changeSpriteThresh) {
      this.changeSpriteTimer = 0;
    }
    return hitTarget;
  }
};
