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
  }

  recalculateRandomWalkVector() {
    let dir = random();
    this.randomWalkVector = [int(random(-2, 2)) * dir, int(random(-2, 2)) * (1 - dir)];
  }

  // angleToSprite(sprite) {
  //   let dx = sprite.x - this.x;
  //   let dy = sprite.y - this.y;
  //   return atan2(dx, dy);
  // }
  //
  // getUnitVectorFromSprite(sprite) {
  //   let i = -1 * cos(this.angleToSprite(sprite));
  //   let j = -1 * sin(this.angleToSprite(sprite));
  //   return [i, j];
  // }

  update(player) {
    super.update();
    this.prevX = this.current.tx;
    if (player) {
      if (player.inventory.checkInventory(this.goal).has == false) {
        this.attack = false;
      }
      if (this.attack == true) {
        if (int(player.x) > int(this.x)) {
          this.current.tx += this.movementSpeed;
        } else if (int(player.x) < int(this.x)) {
          this.current.tx -= this.movementSpeed;
        }
        if (int(player.y) > int(this.y)) {
          this.current.ty += this.movementSpeed;
        } else if (int(player.y) < int(this.y)) {
          this.current.ty -= this.movementSpeed;
        }
        if (bounded(player.bbox, this.x, this.y).complete == true) {
          this.attack = false;
          player.subtractItem(this.goal);
        }
      }
    }
    if (this.attack == false) { // then random walk
      if (this.randomWalkTimer == this.randomWalkInterval) {
        this.recalculateRandomWalkVector();
        this.randomWalkInterval = int(random(20, 100));
        this.randomWalkTimer = 0;
      }
      this.current.tx += this.movementSpeed * this.randomWalkVector[1];
      this.current.ty += this.movementSpeed * this.randomWalkVector[0];
      this.randomWalkTimer += 1;
      this.current.tx = constrain(this.current.tx, 0, G.dims.w);
      this.current.ty = constrain(this.current.ty, 0, G.dims.h);
    }
    // if (this.prevX - this.current.tx < 0) {
    //   this.changeSequence(1);
    // } else {
    //   this.changeSequence(0);
    // }
  }
};
