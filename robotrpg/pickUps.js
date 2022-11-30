class Pickup {
  constructor (x, y, items=['food', 'bead', 'toy']) {
    this.item = random(items);
    this.bounce = true;
    this.image = 'chest'; // tryna be more conservative
    this.x = int(G.dims.w * x);
    this.y = int(G.dims.h * y);
    this.bbx = this.x - 16;
    this.bbx2 = this.x + 16
    this.bbox = [0, 0, 0, 0];
    // this.bb;
    this.isActive = true;
    this.calculateBB();
  }

  chooseImage(name) {
    this.image = name;
  }

  turnOff(player){
    this.isActive = false;
    if (player) {
      player.addItem(this.item);
      player.hit = new HitThing(this.item, 1, this.x, this.y);
    }
  }

  calculateBB(){
    this.bbox = [this.bbx, this.y - 16, this.bbx2, this.y + 16];
    // this.bb = this.bbox;
    // DO NOT INCLUDE IN UPDATE! will confuse the possum
  }

  update(player) {
    // if (this.bounce) {
    //   this.y += 0.5*(sin(millis()/200));
    // }

    if ((this.isActive == true) && bounded(this.bbox, player.current.tx, player.current.ty).complete == true) {
      this.isActive = false;
      player.hit = new HitThing(this.item, +1, player.x, player.y - player.current.g.height/2);
      player.addItem(this.item);
    }

  }

}
