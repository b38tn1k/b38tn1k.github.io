var docWidth = 2550;
var docHeight = 3300;
var pg;


function keyPressed() {
  if (key == ' ') {
    setupScreen();
  }
  if (key == 's') {
    var img = createImage(pg.width, pg.height);
    img.copy(pg, 0, 0, pg.width, pg.height, 0, 0, pg.width, pg.height);
    img.save('pattern', 'png'); 
  }
  
  if (keyCode == DOWN_ARROW){

  return;
  }  else if (keyCode == LEFT_ARROW){

  return;
  }  else if (keyCode == UP_ARROW){

  return;
  }  else if (keyCode == RIGHT_ARROW){

  return;
  }
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  console.log(mouseX, mouseY)
}

function createPoints(number, gap, gap2){
  let pts = [];
  let rval;
  range = 0;
  let point = {};
  point['x'] = 0;
  point['xi'] = 0;
  point['y'] = 0;
  point['yi'] = 0;
  pts.push(point);
  let x = range;
  for (let i = 0; i < number; i++) {
    point = {};
    point['x'] = x;
    point['xi'] = x;
    x += gap;
    rval = random();
    point['y'] = rval * gap2;
    point['yi'] = (1-rval) * gap2;
    pts.push(point);
  }
  
  return pts;
}

function drawPointsCurved(g, pts, off){
  g.beginShape();
  for (let i = 0; i < pts.length; i++) {
    g.curveVertex(pts[i]['x'] + off, pts[i]['y']+ off);
  }
  g.endShape();
  g.beginShape();
  for (let i = 0; i < pts.length; i++) {
    g.curveVertex(pts[i]['xi']+ off, pts[i]['yi']+ off);
  }
  g.endShape();
}

function rotatePts(pts, angle){
  for (let i = 0; i < pts.length; i++) {
    let x1 = pts[i]['x'];
    let x2 = pts[i]['xi'];
    let y1 = pts[i]['y'];
    let y2 = pts[i]['yi'];
    pts[i]['x'] = x1 * cos(angle) + y1 * sin(angle);
    pts[i]['y'] = x1 * sin(angle) + y1 * cos(angle);
    pts[i]['xi'] = x2 * cos(angle) + y2 * sin(angle);
    pts[i]['yi'] = x2 * sin(angle) + y2  * cos(angle);

  }
}

function squiggleTile(d) {
  console.log(d);
  let tile = createGraphics(d, d);
  tile.noFill();
  tile.strokeWeight(3);
  let pts = createPoints(8, d/8, 100);
  let offset = d/2;
  drawPointsCurved(tile, pts, offset-d/2);
  rotatePts(pts, (PI));
  drawPointsCurved(tile, pts, offset+d/2);
  rotatePts(pts, (PI/2));
  drawPointsCurved(tile, pts, offset+d/2);
  rotatePts(pts, (PI));
  drawPointsCurved(tile, pts, offset-d/2);
  return tile;
}

function convertToImage(g) {
  var img = createImage(g.width, g.height);
  img.copy(g, 0, 0, g.width, g.height, 0, 0, g.width, g.height);
  return img;
}

function tileFill(target, tile) {
  let xdim = floor((2*target.width) / tile.width) * tile.width;
  let ydim = floor((2*target.height) / tile.height) * tile.height;
  let temp = createGraphics(xdim, ydim);
  for (let x = 0; x < temp.width; x+=tile.width) {
    for (let y = 0; y < temp.height; y+=tile.width) {
      temp.image(tile, x, y);
    }
  }
  target.imageMode(CENTER);
  target.image(temp, target.width/2, target.height/2);

}

function hSymmetrise(g) {
  var gi = convertToImage(g);
  for (let x = 0; x < g.width/2; x++) {
    for (let y = 0; y < g.height; y++) {
      gi.set(gi.width-x, y, gi.get(x, y));
    }
  }
  gi.updatePixels();
  return gi;
}

function vSymmetrise(g) {
  var gi = convertToImage(g);
  for (let x = 0; x < g.width; x++) {
    for (let y = 0; y < g.height/2; y++) {
      gi.set(x, gi.height-y, gi.get(x, y));
    }
  }
  gi.updatePixels();
  return gi;
}

function dSymmetrise(g) {
  var gi = convertToImage(g);
  for (let x = 0; x < g.width; x++) {
    for (let y = 0; y < g.height; y++) {
      if (x + y <=g.width) {
        gi.set(gi.width-x, gi.height-y, gi.get(x, y));
      }
    }
  }
  gi.updatePixels();
  return gi;
}

function medallion(g) {
  let radius = random((g.width - 500)/2, g.width / 5);
  let count = floor(random(100, 200));
  let cir = 2 * PI * radius
  let temp = createGraphics(radius*2.5, radius*2.5);
  let weaveRadius = random(cir/count, cir/count * 1.5);
  let offx = temp.width/2;
  let offy = temp.width/2;
  temp.fill(255);
  temp.noStroke();
  temp.circle(offx, offy, 2*radius);
  temp.strokeWeight(3);
  temp.stroke(0);
  let start = 0;
  let borderType = floor(random() * 3);
  let offset = random();
  let offset2 = 1 + random();
  let tempRad = radius - weaveRadius;
  let x, y;
  switch(borderType) {
    case 0:
      offset = random() * TWO_PI;
      offset2 = 1 + random();
      for (start = 0; start <= TWO_PI - PI/count; start += TWO_PI/count) {
        temp.circle(offx+radius*sin(start + offset), offy+radius*cos(start + offset), weaveRadius * offset2);
        temp.circle(offx+radius*sin(start + offset), offy+radius*cos(start + offset), weaveRadius);
      }
      break;
    case 1:
      temp.fill(255);
      let radius2 = radius * (1 + random(0.9, 1.0));
      temp.circle(offx, offy, radius2 + 2*weaveRadius);
      count = random(4, 16);
      temp.noFill();
      for (start = 0; start <= TWO_PI - PI/count; start += TWO_PI/count) {
        temp.circle(offx+weaveRadius*sin(start + offset), offy+weaveRadius*cos(start + offset), radius2);
      }
      break;
    case 2:
      count = floor(random(50, 100))
      weaveRadius = cir / count;
      let stutter = PI/count;
      temp.fill(255);
      for (start = 0; start <= TWO_PI - PI/count; start += TWO_PI/count) {
        x = offx+radius*sin(start);
        y = offy+radius*cos(start);
        temp.arc(x, y, weaveRadius, weaveRadius, PI - start, 0 - start);
        x = offx+radius*sin(start - stutter);
        y = offy+radius*cos(start - stutter);
        temp.arc(x, y, weaveRadius, weaveRadius, 0 - start, PI - start);
        
      }
      break;
  }
  g.imageMode(CENTER);
  g.image(temp, docWidth/2, docHeight/2);
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  pg = initPage();
  pg.background(255);
  let tile = squiggleTile(random([250, 300, 350, 400, 450, 500]));
  tile = vSymmetrise(tile);
  tile = hSymmetrise(tile);
  tileFill(pg, tile);
  medallion(pg);
  mandala1(pg);
  border();
  showPage();
}

function mandala1(g) {
  let temp = initPage();
  temp.strokeWeight(3);
  temp.fill(255);
  let points = [];
  pt = {};
  pt['r'] = 1;
  pt['aOff'] = 0;
  let pointCount = random(5, 12);
  points.push(pt);
  for (let i = 1; i < pointCount; i++) {
    pt = {};
    pt['r'] = points[i-1]['r'] + random(50, 300);
    pt['aOff'] = random(0, QUARTER_PI);
    points.push(pt);
  }
  let w = docWidth;
  let h = docHeight;
  for (let a = 0; a < TWO_PI; a+= QUARTER_PI) {
    temp.beginShape();
    temp.curveVertex(w/2, h/2);
    for (let i = 0; i < points.length; i++) {
      let x = w/2 + sin(points[i]['aOff'] + a) * points[i]['r'];
      let y = h/2 + cos(points[i]['aOff'] + a) * points[i]['r'];
      temp.curveVertex(x, y);
    }
    for (let i = points.length-1; i >= 0; i--) {
      let x = w/2 + sin(a - points[i]['aOff']) * points[i]['r'];
      let y = h/2 + cos(a - points[i]['aOff']) * points[i]['r'];
      temp.curveVertex(x, y);
    }
    temp.curveVertex(w/2, h/2);

    temp.endShape();

  }
  



  g.imageMode(CENTER);
  g.image(temp, docWidth/2, docHeight/2);
}

function border() {
  let border = 60;
  pg.fill(255);
  pg.noStroke();
  pg.rect(0, 0, border, docHeight);
  pg.rect(0, 0, docWidth, border);
  pg.rect(0, docHeight-border, docWidth, border);
  pg.rect(docWidth-border, 0, border, docHeight);
  pg.stroke(0);
  pg.line(border,border,border,docHeight-border);
  pg.line(border,border,docWidth-border,border);
  pg.line(docWidth-border,border,docWidth-border,docHeight-border);
  pg.line(border,docHeight-border,docWidth-border,docHeight-border);
}

function initPage() {
  g = createGraphics(docWidth, docHeight);
  g.noFill();
  g.strokeWeight(3);
  return g;
}

function showPage() {
  let fit = 1.0;
  while (docWidth * fit > windowWidth || docHeight * fit > windowHeight) {
    fit -= 0.05;
  }
  image(pg, 10, 10, fit * docWidth, fit * docHeight);
}

function setup() {

  setupScreen();
}

function draw() {

}
