class UIElements {
  constructor() {
    this.cmpNdle = G.loaders['agulha'];
    this.cmpBG = G.loaders['windrose'];
    this.cmpX = G.dims.w - 100;
    this.cmpY = G.dims.h - 100;
    this.cmpA = 0;
  }

  update(myInp=G.inputs) {
    this.cmpA = myInp.angleTo(myInp.originX, myInp.originY);
  }

  draw() {
    push();
    translate(this.cmpX, this.cmpY);
    image(this.cmpBG, 0, 0);
    rotate(this.cmpA);
    image(this.cmpNdle, 0, 0);
    pop();

  }

};
