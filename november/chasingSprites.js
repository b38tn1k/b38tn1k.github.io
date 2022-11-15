class HitThing {
  constructor(name, value, x, y) {
    this.words = name + ' ' + String(value);
    this.time = millis() + 300;
    this.is = true;
    this.x = x;
    this.y = y;
  }
}

class ChasingSprites extends SpriteCollection {
  constructor(x, y) {
    super(x, y, true);
    this.layer.g.textFont(G.loaders['font']);
    this.textColor = G.colors[34];
    this.bgColor = G.colors[22];
    this.fontSize = 12;
    this.layer.g.textSize(this.fontSize);
    this.layer.g.textLeading(this.lineSpacing * this.fontSize);
    this.layer.g.textAlign(LEFT, TOP);
    this.layer.g.noStroke();
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
    this.hit = {};
    this.hit.is = false;
    this.direction = 'up';
    this.prevDir = '';
    // showColors();
  }

  recalculateRandomWalkVector() {
    let xAmp = random();
    let yAmp = 1.0 - xAmp;
    let xDir = (random() > 0.5) ? -1 : 1;
    let yDir = (random() > 0.5) ? -1 : 1;
    this.randomWalkVector = [xAmp * xDir, yAmp * yDir];
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

  doAttack(player) {
    this.attack = false;
    player.subtractItem(this.goal);
    this.hit = new HitThing(this.goal, -1, player.x, player.y - player.current.g.height/2);
  }

  update(player) {
    super.update();
    this.prevX = this.current.tx;
    this.prevY = this.current.ty;
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
          this.doAttack(player);
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

    let deltaX = this.prevX - this.current.tx;
    let deltaY = this.prevY - this.current.ty;
    if (abs(deltaX) > abs(deltaY)) {
      this.direction = (deltaX < 0) ? 'right' : 'left';
    } else {
      this.direction = (deltaY < 0) ? 'down' : 'up';
    }
    let changed = this.chooseSequence(this.direction);
  }

  draw() {
    super.draw();
    if (this.hit.is == true && this.hit.time > millis()) {
      this.layer.g.fill(this.bgColor);
      this.layer.g.rect(this.hit.x, this.hit.y, this.layer.g.textWidth(this.hit.words), this.fontSize * 1.5);
      this.layer.g.fill(this.textColor);
      this.layer.g.text(this.hit.words, this.hit.x ,this.hit.y);
    }
  }
};
