function createPoints(number, gap, gap2) {
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
    point['yi'] = (1 - rval) * gap2;
    pts.push(point);
  }
  return pts;
}

function drawPointsCurved(g, pts, off) {
  g.beginShape();
  for (let i = 0; i < pts.length; i++) {
    g.curveVertex(pts[i]['x'] + off, pts[i]['y'] + off);
  }
  g.endShape();
  g.beginShape();
  for (let i = 0; i < pts.length; i++) {
    g.curveVertex(pts[i]['xi'] + off, pts[i]['yi'] + off);
  }
  g.endShape();
}

function rotatePts(pts, angle) {
  for (let i = 0; i < pts.length; i++) {
    let x1 = pts[i]['x'];
    let x2 = pts[i]['xi'];
    let y1 = pts[i]['y'];
    let y2 = pts[i]['yi'];
    pts[i]['x'] = x1 * cos(angle) + y1 * sin(angle);
    pts[i]['y'] = x1 * sin(angle) + y1 * cos(angle);
    pts[i]['xi'] = x2 * cos(angle) + y2 * sin(angle);
    pts[i]['yi'] = x2 * sin(angle) + y2 * cos(angle);

  }
}

function squiggleTile(d) {
  let tile = createGraphics(d, d);
  tile.noFill();
  tile.strokeWeight(3);
  let pts = createPoints(8, d / 8, 100);
  let offset = d / 2;
  drawPointsCurved(tile, pts, offset - d / 2);
  rotatePts(pts, (PI));
  drawPointsCurved(tile, pts, offset + d / 2);
  rotatePts(pts, (PI / 2));
  drawPointsCurved(tile, pts, offset + d / 2);
  rotatePts(pts, (PI));
  drawPointsCurved(tile, pts, offset - d / 2);
  return tile;
}

function convertToImage(g) {
  var img = createImage(g.width, g.height);
  img.copy(g, 0, 0, g.width, g.height, 0, 0, g.width, g.height);
  return img;
}

function tileFill(target, tile) {
  let xdim = floor((2 * target.width) / tile.width) * tile.width;
  let ydim = floor((2 * target.height) / tile.height) * tile.height;
  let temp = createGraphics(xdim, ydim);
  for (let x = 0; x < temp.width; x += tile.width) {
    for (let y = 0; y < temp.height; y += tile.width) {
      temp.image(tile, x, y);
    }
  }
  target.imageMode(CENTER);
  target.image(temp, target.width / 2, target.height / 2);
  delete (temp);

}

function hSymmetrise(g) {
  var gi = convertToImage(g);
  for (let x = 0; x < g.width / 2; x++) {
    for (let y = 0; y < g.height; y++) {
      gi.set(gi.width - x, y, gi.get(x, y));
    }
  }
  gi.updatePixels();
  return gi;
}

function vSymmetrise(g) {
  var gi = convertToImage(g);
  for (let x = 0; x < g.width; x++) {
    for (let y = 0; y < g.height / 2; y++) {
      gi.set(x, gi.height - y, gi.get(x, y));
    }
  }
  gi.updatePixels();
  return gi;
}

function dSymmetrise(g) {
  var gi = convertToImage(g);
  for (let x = 0; x < g.width; x++) {
    for (let y = 0; y < g.height; y++) {
      if (x + y <= g.width) {
        gi.set(gi.width - x, gi.height - y, gi.get(x, y));
      }
    }
  }
  gi.updatePixels();
  return gi;
}

function medallion(g) {
  let radius = random((g.width - 500) / 2, g.width / 5);
  let count = floor(random(100, 200));
  let cir = 2 * PI * radius
  let temp = createGraphics(radius * 2.5, radius * 2.5);
  let weaveRadius = random(cir / count, cir / count * 1.5);
  let offx = temp.width / 2;
  let offy = temp.width / 2;
  temp.fill(255);
  temp.noStroke();
  temp.circle(offx, offy, 2 * radius);
  temp.strokeWeight(3);
  temp.stroke(0);
  let start = 0;
  let borderType = floor(random() * 3);
  let offset = random();
  let offset2 = 1 + random();
  let x, y;
  switch (borderType) {
    case 0:
      offset = random() * TWO_PI;
      offset2 = 1 + random();
      for (start = 0; start <= TWO_PI - PI / count; start += TWO_PI / count) {
        temp.circle(offx + radius * sin(start + offset), offy + radius * cos(start + offset), weaveRadius * offset2);
        temp.circle(offx + radius * sin(start + offset), offy + radius * cos(start + offset), weaveRadius);
      }
      break;
    case 1:

      temp.fill(255);
      temp.strokeWeight(3);
      temp.stroke(0);
      let points = floor(random(70, 200));
      let inc = TWO_PI / points;
      let amplitude = random(0.01, 0.05);
      let gap = random(0.03, 0.08);
      let period = floor(random(50, 150)) * 2;
      let dims = [];
      let offs = [];
      let syncChoice = floor(random(2));
      switch (syncChoice) {
        case 0:
          dims = [1, 1 - gap, 1 - gap, 1 - 2 * gap];
          offs = [0, 0, HALF_PI, HALF_PI];
          break;
        case 1:
          dims = [1, 1 - gap, 1 - gap, 1 - 2 * gap, 1 - 2 * gap, 1 - 3 * gap, 1 - 3 * gap, 1 - 4 * gap];
          offs = [0, 0, QUARTER_PI, QUARTER_PI, HALF_PI, HALF_PI, 3 * QUARTER_PI, 3 * QUARTER_PI];
          break;
      }
      for (let k = 0; k < dims.length; k++) {
        let radi = dims[k] * radius;
        temp.beginShape();
        curveVertex(offx + radi * sin(0 + offs[k]), offy + radi * cos(0 + offs[k]));
        curveVertex(offx + radi * sin(0 + offs[k]), offy + radi * cos(0 + offs[k]));
        let j = 0;
        for (let i = 0; i < TWO_PI; i += inc) {
          let nr = radi + amplitude * radi * sin(period * i);;
          curveVertex(offx + nr * sin(i + offs[k]), offy + nr * cos(i + offs[k]));
        }
        curveVertex(offx + radi * sin(0 + offs[k]), offy + radi * cos(0 + offs[k]));
        curveVertex(offx + radi * sin(0 + offs[k]), offy + radi * cos(0 + offs[k]));
        temp.endShape();
      }
      break;
    case 2:
      count = floor(random(50, 100))
      weaveRadius = cir / count;
      let stutter = PI / count;
      temp.fill(255);
      for (start = 0; start <= TWO_PI - PI / count; start += TWO_PI / count) {
        x = offx + radius * sin(start);
        y = offy + radius * cos(start);
        temp.arc(x, y, weaveRadius, weaveRadius, PI - start, 0 - start);
        x = offx + radius * sin(start - stutter);
        y = offy + radius * cos(start - stutter);
        temp.arc(x, y, weaveRadius, weaveRadius, 0 - start, PI - start);

      }
      break;
  }
  g.imageMode(CENTER);
  g.image(temp, g.width / 2, g.height / 2);
  delete (temp);
}


function addMultiples(t, s, pos) {
  t.imageMode(CENTER);
  for (let i = 0; i < pos.length; i++) {
    t.image(s, t.width * pos[i][0], t.height * pos[i][1]);
  }
}

function maze(g) {
  g.strokeWeight(3);
  let size = random(20, 80);
  let res = random(0.001, 0.01);
  for (let x = 0; x < g.width; x += size + 0) {
    for (let y = 0; y < g.height; y += size + 0) {
      n = noise(x * res, y * res) - 0.2;
      c = random(0, 8) * n;
      if (c < 1) {
        g.line(x, y, x + size, y + size)
      }
      else if (c < 2) {
        g.line(x, y + size, x + size, y)
      } else if (c < 3) {
        g.line(x, y, x, y + size)
      }
      else if (c < 4) {
        g.line(x, y, x + size, y)
      }
    }
  }

}

function mandala1(g, temp, finalx, finaly, perfect = false, simple = false) {
  temp.strokeWeight(3);
  temp.fill(255);
  if (random() > 0.7 && simple == false) {
    flower(temp, 0.5, 0.5);
  }
  let shapeSetting = random() > 0.5;
  let backwards = random() > 0.5;
  let w = temp.width;
  let h = temp.height;
  let points = [];
  pt = {};
  pt['aOff'] = random(0, QUARTER_PI);
  if (backwards == true) {
    pt['r'] = w / 2;
    points.push(pt);
  } else {
    pt['r'] = 1;
  }
  points.push(pt);
  let pointCount = random(5, 12);
  if (simple == true) {
    pointCount = random(2, 6);
  }
  for (let i = 1; i < pointCount; i++) {
    pt = {};
    if (backwards == true) {
      pt['r'] = points[i - 1]['r'] - random((w / (2 * pointCount)), w / pointCount);
    } else {
      pt['r'] = points[i - 1]['r'] + random((w / (2 * pointCount)), w / pointCount);
    }
    pt['aOff'] = random(0, QUARTER_PI);
    if (pt['r'] < 0) {
      pt['r'] = random() * 5;
      points.push(pt);
      break;
    }
    if (pt['r'] >= w / 2) {
      pt['r'] = random(0.6, 1.0) * w / 2;
      points.push(pt);
      break;
    } else {
      points.push(pt);
    }
  }
  if (perfect == true) {
    pt = {};
    pt['r'] = w / 2 * 0.9;
    pt['aOff'] = random(0, QUARTER_PI);
    points.push(pt);
  }
  if (backwards == true) {
    pt = {};
    pt['r'] = 1;
    pt['aOff'] = 0;
    points.push(pt);
    points.push(pt);
    // points.reverse();
  }

  let count = floor(random(2, 10));
  if (simple == true) {
    count = floor(random(3, 7));
  }
  let inc = TWO_PI / count
  if (shapeSetting == false) {
    temp.beginShape();
  }
  for (let a = -TWO_PI; a < TWO_PI; a += inc) {
    if (shapeSetting == true) {
      temp.beginShape();
    }
    if (backwards == false) {
      temp.curveVertex(w / 2, h / 2);
      for (let i = 0; i < points.length; i++) {
        let x = w / 2 + sin(points[i]['aOff'] + a) * points[i]['r'];
        let y = h / 2 + cos(points[i]['aOff'] + a) * points[i]['r'];
        temp.curveVertex(x, y);
      }
      for (let i = points.length - 1; i >= 0; i--) {
        let x = w / 2 + sin(a - points[i]['aOff']) * points[i]['r'];
        let y = h / 2 + cos(a - points[i]['aOff']) * points[i]['r'];
        temp.curveVertex(x, y);
      }
      temp.curveVertex(w / 2, h / 2);
    } else {
      for (let i = points.length - 1; i >= 0; i--) {
        let x = w / 2 + sin(a - points[i]['aOff']) * points[i]['r'];
        let y = h / 2 + cos(a - points[i]['aOff']) * points[i]['r'];
        temp.curveVertex(x, y);
      }
      for (let i = 0; i < points.length; i++) {
        let x = w / 2 + sin(points[i]['aOff'] + a) * points[i]['r'];
        let y = h / 2 + cos(points[i]['aOff'] + a) * points[i]['r'];
        temp.curveVertex(x, y);
      }

    }

    if (shapeSetting == true) {
      temp.endShape();
    }
  }
  if (shapeSetting == false) {
    temp.endShape();
  }

  if (g) {
    g.imageMode(CENTER);
    g.image(temp, finalx, finaly);
  }
}

function border() {
  let border = 60;
  pg.fill(255);
  pg.noStroke();
  pg.rect(0, 0, border, docHeight);
  pg.rect(0, 0, docWidth, border);
  pg.rect(0, docHeight - border, docWidth, border);
  pg.rect(docWidth - border, 0, border, docHeight);
  pg.stroke(0);
  pg.line(border, border, border, docHeight - border);
  pg.line(border, border, docWidth - border, border);
  pg.line(docWidth - border, border, docWidth - border, docHeight - border);
  pg.line(border, docHeight - border, docWidth - border, docHeight - border);
}

function initPage() {
  g = createGraphics(docWidth, docHeight);
  g.noFill();
  g.strokeWeight(3);
  return g;
}

function showPage() {
  let fit = 1.0;
  while (docWidth * fit > windowWidth || docHeight * fit > (windowHeight - mainDiv.height - 40)) {
    fit -= 0.05;
  }
  image(pg, 10, 10, fit * docWidth, fit * docHeight);
}


function squigBG() {
  let tile = squiggleTile(random([250, 300, 350, 400, 450, 500]));
  tile = vSymmetrise(tile);
  tile = hSymmetrise(tile);
  tileFill(pg, tile);
  delete (tile);
}

function mazeBG() {
  let radnDim;
  let mt;
  radnDim = random([250, 300, 350, 400, 450, 500]);
  mt = createGraphics(radnDim, radnDim);
  maze(mt);
  mt = vSymmetrise(mt);
  mt = hSymmetrise(mt);
  tileFill(pg, mt);
  delete (mt);
}

function miniMandalasBG() {
  let radnDim;
  let mt;
  radnDim = random([250, 300, 350, 400, 450, 500]);
  mt = createGraphics(radnDim, radnDim);
  mandala1(mt, mt, mt.width / 2, mt.width / 2, false, true);
  tileFill(pg, mt);
  delete (mt);
}

function frontNCenterFG() {
  let temp;
  medallion(pg);
  temp = createGraphics(docWidth * 0.9, docWidth * 0.9);
  mandala1(pg, temp, docWidth / 2, docHeight / 2);
  delete (temp);
  cleanCanvases();
  temp = createGraphics(docWidth * 0.7, docWidth * 0.7);
  if (random() > 0.5) {
    mandala1(pg, temp, docWidth / 2, docHeight / 2);
  } else {
    flower(temp, 0.5, 0.5);
    addMultiples(pg, temp, [[0.5, 0.5]]);
  }
  delete (temp);
  cleanCanvases();
  temp = createGraphics(docWidth * 0.5, docWidth * 0.5);
  if (random() > 0.5) {
    mandala1(pg, temp, docWidth / 2, docHeight / 2);
  } else {
    flower(temp, 0.5, 0.5);
    addMultiples(pg, temp, [[0.5, 0.5]]);
  }
  delete (temp);
  cleanCanvases();
  temp = createGraphics(docWidth * 0.3, docWidth * 0.3);
  mandala1(pg, temp, docWidth / 2, docHeight / 2);
  delete (temp);
}

function threeInAColFG() {
  let temp;
  temp = createGraphics(docHeight / 2, docHeight / 2);
  medallion(temp);
  addMultiples(pg, temp, [[0.5, 3 / 16], [0.5, 13 / 16], [0.5, 0.5]]);
  delete (temp);
  temp = createGraphics(docHeight / 4, docHeight / 4);
  mandala1(null, temp, 0, 0);
  addMultiples(pg, temp, [[0.5, 3 / 16], [0.5, 13 / 16]]);
  temp.clear();
  mandala1(null, temp, 0, 0);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  delete (temp);
  cleanCanvases();
  temp = createGraphics(docHeight / 5, docHeight / 5);
  mandala1(null, temp, 0, 0);
  addMultiples(pg, temp, [[0.5, 3 / 16], [0.5, 13 / 16]]);
  temp.clear();
  mandala1(null, temp, 0, 0);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  delete (temp);
}

function surroundedSmallFG() {

  let temp;
  temp = createGraphics(docHeight / 4, docHeight / 4);
  medallion(temp);
  addMultiples(pg, temp, [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]]);
  delete (temp);
  temp = createGraphics(docHeight / 4, docHeight / 4);
  mandala1(null, temp, 0, 0);
  addMultiples(pg, temp, [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]]);
  delete (temp);
  temp = createGraphics(docHeight / 6, docHeight / 6);
  mandala1(null, temp, 0, 0);
  addMultiples(pg, temp, [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]]);
  temp = createGraphics(docHeight / 2, docHeight / 2);
  medallion(temp);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp.clear();
  mandala1(null, temp, 0, 0);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  delete (temp);
  temp = createGraphics(docHeight / 4, docHeight / 4);
  mandala1(null, temp, 0, 0);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  delete (temp);
}

function surroundedLargeFG() {
  let temp;
  temp = createGraphics(docHeight, docHeight);
  medallion(temp);
  addMultiples(pg, temp, [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]);
  delete (temp);
  let dims = [1.0, 0.75, 0.5, 0.25];
  for (let h = 0; h < dims.length; h++) {
    temp = createGraphics(docWidth * dims[h], docWidth * dims[h]);
    mandala1(null, temp, 0, 0);
    addMultiples(pg, temp, [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]);
    delete(temp);
  }
  cleanCanvases();
  temp = createGraphics(docHeight / 2, docHeight / 2);
  medallion(temp);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp.clear();
  dims = [0.6, 0.4, 0.2];
  for (let h = 0; h < dims.length; h++) {
    temp = createGraphics(docWidth * dims[h], docWidth * dims[h]);
    mandala1(null, temp, 0, 0);
    addMultiples(pg, temp, [[0.5, 0.5]]);
    delete(temp);
  }
}

function cleanCanvases() {
  var canvases = document.getElementsByTagName('canvas');
  var toRemove = [];
  for (let i = 0; i < canvases.length; i++) {
    if (canvases[i].id.includes('default') != true) {
      toRemove.push(canvases[i]);
    }
  }
  for (let i = 0; i < toRemove.length; i++) {
    toRemove[i].remove();
  }
}

function flower(g, x, y) {
  g.strokeWeight(3);
  g.fill(255);
  x *= g.width;
  y *= g.height; //center location
  let radius = 0.4 * (g.width);
  let petals = floor(random(6, 21));
  let width = (TWO_PI * radius) / petals;
  let rNode = radius * random(0.3, 0.8);
  let wNode = width * random(0.1, 0.2);
  let cNode = random(-width, width);
  wNode = 0.1 * width;
  let p = [[0, 0]];
  p.push([rNode, wNode]);
  // p.push([radius, width]);
  p.push([radius, cNode]);
  p.push([rNode, -wNode]);
  p.push([0, 0]);
  p.push([-rNode, wNode]);
  // p.push([-radius, width]);
  p.push([-radius, -cNode]);
  p.push([-rNode, -wNode]);
  p.push([0, 0]);
  let alpha = TWO_PI / petals;
  for (let i = 0; i < petals; i++) {
    g.beginShape();
    g.curveVertex(x, y);
    for (let j = 0; j < p.length; j++) {
      let px = x + p[j][0] * sin(i * alpha) + p[j][1] * cos(i * alpha);
      let py = y + p[j][0] * cos(i * alpha) + p[j][1] * sin(i * alpha);
      g.curveVertex(px, py);
    }
    g.curveVertex(x, y);
    g.endShape();
  }



}