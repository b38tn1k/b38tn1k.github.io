class Pickup {
  constructor (x, y, items=['food', 'bead', 'toy']) {
    this.item = random(items);
    this.image = 'chest'; // tryna be more conservative
    this.x = int(G.dims.w * x);
    this.y = int(G.dims.h * y);
    this.bbx = this.x - 16;
    this.bbx2 = this.x + 16
    this.bb = [0, 0, 0, 0];
    this.draw = true;
    this.calculateBB();
  }

  calculateBB(){
    this.bb = [this.bbx, this.y - 16, this.bbx2, this.y + 16];
  }

  update(player) {
    this.y += 0.5*(sin(millis()/200));
    if ((this.draw == true) && bounded(this.bb, player.current.tx, player.current.ty).complete == true) {
      this.draw = false;
      player.hit = new HitThing(this.item, +1, player.x, player.y - player.current.g.height/2);
      player.addItem(this.item);
    }

  }

}