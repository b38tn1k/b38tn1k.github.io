if (this.graphicUpdate == true){
  let x = 1;//this.viewX;
  let y = 1;//this.viewY;
  this.canvas = createGraphics(this.width + 2, this.height+2);
    // body
  if (this.flash == true) {
    this.canvas.fill(this.colors[2]);
  } else {
    if (this.highlight === true) {
      this.canvas.fill(this.colors[2]);
    } else {
      this.canvas.fill(this.colors[0]);
    }
  }
  if (this.underneath === true) {
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.input.hide();
    }
    this.indexLabeldiv.hide();

  }
  if (this.underneath === false) {
    if (blockConfig[this.type]['input type'] != I_NONE) {
      this.input.show();
    }
    this.indexLabeldiv.show();

  }
  this.canvas.stroke(this.colors[1]);
  this.canvas.rect(x, y, this.width, this.height, this.radius);
  if (blockConfig[this.type]['handles']['move'] == true) {
    this.canvas.fill(this.colors[1]);
    this.canvas.rect(x, y, this.handleW, this.handleH);
  }
  if (blockConfig[this.type]['handles']['delete'] == true) {
    this.canvas.fill(this.colors[3]);
    this.canvas.stroke(this.colors[3]);
    this.canvas.rect(x + this.width - this.handleW, y, this.handleW, this.handleH);
    this.canvas.stroke(this.colors[1]);
  }
  if (blockConfig[this.type]['handles']['expand'] == true) {
    this.canvas.fill(this.colors[1]);
    this.canvas.rect(x + this.width/2 - this.handleW, y + this.height - this.handleH, this.handleW, this.handleH);
  }
  if (this.shrink == false) {
    if (blockConfig[this.type]['handles']['resize'] == true) {
      this.canvas.fill(this.colors[1]);
      this.canvas.rect(x + this.width - this.handleW, y + this.height - this.handleH, this.handleW, this.handleH);
    }
    if (blockConfig[this.type]['handles']['copy'] == true) {
      this.canvas.fill(this.colors[1]);
      this.canvas.rect(x + this.width - this.handleW, y + this.height/2 - this.handleH, this.handleW, this.handleH);
    }
    if (blockConfig[this.type]['handles']['mutate'] != -1) {
      this.canvas.fill(this.colors[1]);
      this.canvas.rect(x, y + this.height - this.handleH, this.handleW, this.handleH);
    }
  }
  for (let i = 0; i < this.children.length; i++) {
    this.children[i].graphicUpdate = true;
    this.children[i].draw();
  }
  this.graphicUpdate = false;
} else {
  image(this.canvas, xp, yp);
}
