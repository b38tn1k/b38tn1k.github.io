let r=10
let a=0
let c=20
let angle = 0
let art

function preload() {
  art = loadImage('tun.jpeg');
}


function setup() {
  createCanvas(400, 400, WEBGL);
}

function keyPressed() {
  if (key == 's') {
    saveImage();
  }
}

function saveImage() {
  var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  save(timestamp+".png");
}

function draw() {
  background(220);
  push()
  texture(art)
  rotateX(angle),
  rotateY(angle),
  rotateZ(angle)
  box(200)
  angle = angle + 0.003
  pop()
}
