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
  // g.curveTightness(random(0, -5));
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
  let radius = random((g.width * 0.8) / 2, g.width / 5);
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
  // temp.curveTightness(random(0, -5));
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
        temp.curveVertex(offx + radi * sin(0 + offs[k]), offy + radi * cos(0 + offs[k]));
        temp.curveVertex(offx + radi * sin(0 + offs[k]), offy + radi * cos(0 + offs[k]));
        let j = 0;
        for (let i = 0; i < TWO_PI; i += inc) {
          let nr = radi + amplitude * radi * sin(period * i);;
          temp.curveVertex(offx + nr * sin(i + offs[k]), offy + nr * cos(i + offs[k]));
        }
        temp.curveVertex(offx + radi * sin(0 + offs[k]), offy + radi * cos(0 + offs[k]));
        temp.curveVertex(offx + radi * sin(0 + offs[k]), offy + radi * cos(0 + offs[k]));
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
  // temp.curveTightness(random(0, -5));
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
    pt['r'] = w * 0.5;
    pt['aOff'] = random(0, QUARTER_PI);
    points.push(pt);
  }
  let innerRad = random(0.05, 0.2) * w/2;
  if (backwards == true) {
    pt = {};
    pt['r'] = innerRad;
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
  let backOff = random([1, 2, 3]);
  for (let a = -TWO_PI; a < TWO_PI; a += inc) {
    if (shapeSetting == true) {
      temp.beginShape();
    }
    if (backwards == false) {
      temp.curveVertex(w / 2 + sin(a) * innerRad, h / 2 + cos(a) * innerRad);
      for (let i = 0; i < points.length; i++) {
        let x = w / 2 + sin(points[i]['aOff'] + a) * points[i]['r'];
        let y = h / 2 + cos(points[i]['aOff'] + a) * points[i]['r'];
        x = checkXY(x, w, h);
        y = checkXY(y, w, h);
        temp.curveVertex(min(max(x, 0), temp.width), min(max(y, 0), temp.height));
      }
      for (let i = points.length - backOff; i >= 0; i--) {
        let x = w / 2 + sin(a - points[i]['aOff']) * points[i]['r'];
        let y = h / 2 + cos(a - points[i]['aOff']) * points[i]['r'];
        x = checkXY(x, w, h);
        y = checkXY(y, w, h);
        temp.curveVertex(min(max(x, 0), temp.width), min(max(y, 0), temp.height));
      }
      temp.curveVertex(w / 2, h / 2);
    } else {
      for (let i = points.length - backOff; i >= 0; i--) {
        let x = w / 2 + sin(a - points[i]['aOff']) * points[i]['r'];
        let y = h / 2 + cos(a - points[i]['aOff']) * points[i]['r'];
        x = checkXY(x, w, h);
        y = checkXY(y, w, h);
        temp.curveVertex(min(max(x, 0), temp.width), min(max(y, 0), temp.height));
      }
      for (let i = 0; i < points.length; i++) {
        let x = w / 2 + sin(points[i]['aOff'] + a) * points[i]['r'];
        let y = h / 2 + cos(points[i]['aOff'] + a) * points[i]['r'];
        x = checkXY(x, w, h);
        y = checkXY(y, w, h);
        temp.curveVertex(min(max(x, 0), temp.width), min(max(y, 0), temp.height));
      }
    }
    if (shapeSetting == true) {
      temp.endShape();
    }
  }
  if (shapeSetting == false) {
    temp.endShape();
  }
  if (simple == false) {
    temp.circle(temp.width/2, temp.height/2, min(temp.width, temp.height) * random(0.1, 0.2))
  }
  if (g) {
    g.imageMode(CENTER);
    g.image(temp, finalx, finaly);
  }
}

function checkXY(x, w, h) {
  w = min(w, h);
  if (x > 0.9 * w) {
    x -= 0.1 * w;
  }
  if (x < 0.1 * w) {
    x += 0.1 * w;
  }
  return x;
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
  // mt.curveTightness(random(0, -5));
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

function sinBubblesBG(g = pg) {
  // g.curveTightness(random(0, -5));
  let radius = random(50, 100);
  let minorRadius = random(30, radius);
  let corners = random(minorRadius / 2, radius / 2);
  let inc = random(radius, 2 * radius);
  let cx = g.width / 2;
  let cy = g.height / 2;
  let rx = random(-1, 1);
  let ry = random(-1, 1);
  let mod = random(-10, 10);
  g.fill(255);
  g.rectMode(CENTER);
  let coin = random() > 0.5;
  for (let x = 0; x < cx; x += inc) {
    for (let y = 0; y < cy; y += inc) {
      let tx = cx + x;
      let ty = cy + y;
      if (coin == true) {
        g.square(tx, ty, radius + sin(mod * (rx * tx - ry * ty)) * minorRadius, corners);
      } else {
        g.square(tx, ty, radius + sin(mod * sqrt((rx * x) * (rx * x) * (ry * y) * (ry * y))) * minorRadius, corners);
      }
      tx = cx - x;
      if (coin == true) {
        g.square(tx, ty, radius + sin(mod * (rx * tx - ry * ty)) * minorRadius, corners);
      } else {
        g.square(tx, ty, radius + sin(mod * sqrt((rx * x) * (rx * x) * (ry * y) * (ry * y))) * minorRadius, corners);
      }
      ty = cy - y;
      if (coin == true) {
        g.square(tx, ty, radius + sin(mod * (rx * tx - ry * ty)) * minorRadius, corners);
      } else {
        g.square(tx, ty, radius + sin(mod * sqrt((rx * x) * (rx * x) * (ry * y) * (ry * y))) * minorRadius, corners);
      }
      tx = cx + x;
      if (coin == true) {
        g.square(tx, ty, radius + sin(mod * (rx * tx - ry * ty)) * minorRadius, corners);
      } else {
        g.square(tx, ty, radius + sin(mod * sqrt((rx * x) * (rx * x) * (ry * y) * (ry * y))) * minorRadius, corners);
      }
    }
  }
  g.rectMode(CORNER);
}

function frontNCenterFG() {
  let temp;
  medallion(pg);
  temp = stackedMandalas(docWidth * 0.9, docWidth * 0.9, 5);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp = fascinator(docWidth / 2, docWidth / 2);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp = fascinator(docWidth / 4, docWidth / 4);
  addMultiples(pg, temp, [[0.5, 0.5]]);
}

function threeInAColFG() {
  let temp;
  let pos;
  let pChoice = floor(random() * 3);
  switch (pChoice) {
    case 0:
      pos = [[0.5, 3 / 16], [0.5, 13 / 16], [0.5, 0.5]]
      break;
    case 1:
      pos = [[0.33, 3 / 16], [0.66, 13 / 16], [0.5, 0.5]]
      break;
    case 2:
      pos = [[0.66, 3 / 16], [0.33, 13 / 16], [0.5, 0.5]]
      break;
  }

  temp = createGraphics(docHeight / 2, docHeight / 2);
  medallion(temp);
  addMultiples(pg, temp, pos);
  delete (temp);
  temp = stackedMandalas(docHeight / 4, docHeight / 4, 2);
  addMultiples(pg, temp, [pos[0], pos[1]]);
  temp = stackedMandalas(docHeight / 2, docHeight / 2, 3);
  addMultiples(pg, temp, [pos[2]]);
  temp = fascinator(docWidth / 2, docWidth / 2);
  addMultiples(pg, temp, [[0.5, 0.5]]);
}

function surroundedSmallFG() {
  let temp;
  temp = createGraphics(docHeight / 3, docHeight / 3);
  medallion(temp);
  addMultiples(pg, temp, [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]]);
  delete (temp);
  temp = stackedMandalas(docHeight / 3, docHeight / 3, 2);
  addMultiples(pg, temp, [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]]);
  temp = createGraphics(docHeight / 2, docHeight / 2);
  medallion(temp);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp = stackedMandalas(docHeight / 2, docHeight / 2, 3);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp = fascinator(docWidth / 2, docWidth / 2);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  delete (temp);
}

function stackedMandalas(w, h, stacks) {
  let canvas = createGraphics(w, h);
  let temp;
  let increment = 1 / (stacks);
  let alreadyDone = false;
  for (let i = 1.0; i >= increment; i -= increment) {
    let method = floor(random() * 3);
    if (alreadyDone == true) {
      method = floor(random() * 2);
    }
    switch (method) {
      case 0:
        temp = createGraphics(w * i, h * i);
        mandala1(canvas, temp, w / 2, h / 2, i == 1.0, i <= (stacks/2) * increment);
        delete (temp);
        break;
      case 1:
        canvas.imageMode(CENTER);
        temp = flowerMandala(w * i, h * i);
        canvas.image(temp, w / 2, h / 2);
        break;
      case 2:
        canvas.imageMode(CENTER);
        temp = createGraphics(w * i, h * i);
        westworldFG(temp);
        alreadyDone = true;
        canvas.image(temp, w / 2, h / 2);
        break;
    }
  }
  return canvas;
}

function surroundedLargeFG() {
  let temp;
  temp = createGraphics(docHeight, docHeight);
  medallion(temp);
  addMultiples(pg, temp, [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]);
  delete (temp);
  temp = stackedMandalas(docHeight, docHeight, 4);
  addMultiples(pg, temp, [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]);
  temp = fascinator(docWidth / 3, docWidth / 3);
  addMultiples(pg, temp, [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]);
  temp = fascinator(docWidth / 2, docWidth / 2);
  addMultiples(pg, temp, [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]);
  cleanCanvases();
  temp = createGraphics(docHeight / 2, docHeight / 2);
  medallion(temp);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp = stackedMandalas(docHeight / 2, docHeight / 2, 4);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp = fascinator(docWidth / 2, docWidth / 2);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp = fascinator(docWidth / 3, docWidth / 3);
  addMultiples(pg, temp, [[0.5, 0.5]]);
}

function bigTopBottomFG() {
  let temp;
  temp = createGraphics(docHeight, docHeight);
  medallion(temp);
  addMultiples(pg, temp, [[0.5, 0.0], [0.5, 1.0]]);
  delete (temp);
  temp = stackedMandalas(docHeight, docHeight, 4);
  addMultiples(pg, temp, [[0.5, 0.0], [0.5, 1.0]]);
  temp = fascinator(docWidth / 3, docWidth / 3);
  addMultiples(pg, temp, [[0.5, 0.0], [0.5, 1.0]]);
  medallion(pg);
  temp = stackedMandalas(docWidth * 0.9, docWidth * 0.9, 5);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp = fascinator(docWidth / 2, docWidth / 2);
  addMultiples(pg, temp, [[0.5, 0.5]]);
  temp = fascinator(docWidth / 4, docWidth / 4);
  addMultiples(pg, temp, [[0.5, 0.5]]);
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
  // g.curveTightness(random(0, -5));
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
  g.circle(g.width/2, g.height/2, min(g.width, g.height) * random(0.2, 0.3))
}

function fontIconCheat(font) {
  let radnDim;
  let mt;
  radnDim = random([350, 400, 450, 500, 550, 600]);
  mt = createGraphics(radnDim, radnDim);
  mt.fill(255);
  mt.strokeWeight(6);
  mt.stroke(0);
  mt.textFont(font);
  mt.textAlign(CENTER, CENTER);
  let rSize = random(0.8, 2.3);
  mt.textSize(mt.width * rSize);
  myStr = 'qwertyuiopasdhjlzxcvbnm';
  myStr += myStr.toUpperCase();
  selection = floor(random() * myStr.length);
  mt.text(myStr[selection], mt.width / 2, mt.width / 2);
  selection = floor(random() * myStr.length);
  mt.text(myStr[selection], mt.width, mt.height);
  mt.text(myStr[selection], mt.width, 0);
  mt.text(myStr[selection], 0, mt.height);
  mt.text(myStr[selection], 0, 0);

  tileFill(pg, mt);
  delete (mt);
}

function fascinator(w, h, bypass = true) {
  temp = createGraphics(w, h);
  if (random() > 0.5 && bypass == true) {
    return temp;
  }
  temp.stroke(0);
  temp.strokeWeight(3);
  // temp.curveTightness(random(0, -5));
  let x = w / 2;
  let y = h / 2;
  let r = (min(w, h)) * 0.4;
  let count = floor(random(3, 20));
  let inc = TWO_PI / count;
  let start = random(0.1, 0.8);
  let end = random(start, 1.0);
  if (bypass == true) {
    end = random(end, 1.0);
    end = random(end, 1.0);
  }
  let mid = random(start, end);
  let width = TWO_PI / floor(random(count, 60));
  // r, alpha // start, start, out, apex, out_inv, start
  let points = [[start, 0], [start, 0], [mid, width / 2], [end, 0], [mid, -width / 2], [start, 0], [start, 0]]
  let a = 0;
  for (let j = 0; j < count; j++) {
    temp.beginShape();
    for (let i = 0; i < points.length; i++) {
      let px = x + sin(points[i][1] + a) * points[i][0] * r;
      let py = y + cos(points[i][1] + a) * points[i][0] * r;
      temp.curveVertex(px, py);
    }
    temp.endShape();
    a += inc;
  }
  return temp;
}

function flowerMandala(w, h) {
  let temp = createGraphics(w, h);
  temp.imageMode(CENTER);
  let f = fascinator(w, h, false);
  temp.image(f, w / 2, h / 2);
  let inc = 1.0 / floor(random() * 10 + 3);
  for (let i = 1.0; i > inc; i -= inc) {
    f = fascinator(i * w, i * h);
    temp.image(f, w / 2, h / 2);
  }
  g.circle(g.width/2, g.height/2, min(g.width, g.height) * random(0.2, 0.3))
  return temp;
}

function geometric(w, h) {
  let temp = createGraphics(w, h);
  temp.strokeWeight(3);
  let inc = 1.0 / floor(random() * 10 + 3);
  let r = min(w, h);
  temp.circle(w / 2, h / 2, r);
  for (let i = 1.0; i > inc; i -= inc) {
    temp.circle(w / 2, h / 2, r * inc);
  }
  return temp;
}

function wavesBG(g = pg) {
  // g.curveTightness(random(0, -5));
  g.strokeWeight(3);
  g.fill(255);
  let yinc = g.height / floor(random(20, 50));
  let xinc = g.width / floor(random(20, 50));
  let amp = random(yinc * 0.5, yinc);
  let mod = random();
  let j = 0;
  for (let y = 0; y < g.height; y += yinc) {
    g.beginShape();
    g.vertex(0, y);
    g.vertex(0, y);
    let off;
    j % 2 == 0 ? off = 0 : off = PI;
    for (x = 0; x < g.width + 5 * xinc; x += xinc) {
      g.curveVertex(x, y + amp * sin(x * mod + off));
    }
    j++;
    g.vertex(g.width, y);
    g.vertex(g.width, g.height);
    g.vertex(0, g.height);
    g.vertex(0, y);
    g.endShape();
  }
}

function contourBG(g = pg) {
  // g.curveTightness(random(0, -5));
  let mod = random();
  let start;
  let inc = random();
  let initLine = [];
  let lines = [];
  let curvyLinesCount = 100;
  initLine = [];
  lines = [];
  let amp = random(300, 700);
  let amp2 = random(50, 150);
  start = g.height + amp;
  initLine.push({ x: -200, y: start, diff: 0 });
  initLine.push({ x: -200, y: start, diff: 0 });
  for (let x = -200; x < g.width; x += 100) {
    let n = noise(inc * mod);
    let randY = map(n, 0, 1, -amp, amp);
    initLine.push({ x: x, y: start + randY, diff: start - (start - randY) });
    inc += inc;
  }
  initLine.push({ x: g.width, y: start, diff: 0 });
  initLine.push({ x: g.width, y: start, diff: 0 });
  initLine.push({ x: g.width, y: start, diff: 0 });

  for (let x = 0; x < curvyLinesCount; x++) {
    lines[x] = initLine.map((point, index) => {
      return {
        x: point.x,
        y: point.y - x * amp2 - (point.diff / curvyLinesCount) * x,
      };
    });
  }

  g.strokeWeight(3);
  g.stroke(0);
  g.noFill();

  lines.forEach((myLine, index) => {
    g.beginShape();
    myLine.forEach((point) => {
      g.curveVertex(point.x, point.y);
    });
    g.endShape();
  });
}

function westworldFG(g = pg){
  let w = g.width;
  let h = g.height;
  let sections = floor(random(4, w/200));
  let fullAngle = TWO_PI/sections;
  let gap = random(0.3, 0.9) * fullAngle;
  let mod = random();
  let x = w/2;
  let y = h/2;
  // g.curveTightness(random(0, -5));
  g.ellipseMode(CENTER);
  g.strokeWeight(3);
  let r = w * random(0.7, 0.9);
  let concentrics = floor(random(4, w/200));
  console.log(concentrics);
  let concentricMax = w/concentrics;
  let ir = w;
  ir -= random(0.3*concentricMax, concentricMax);
  g.circle(x, y, w);
  while (ir > concentricMax) {
    ir = r - random(0.3*concentricMax, concentricMax);
    sections = floor(random(4, 37));
    fullAngle = TWO_PI/sections;
    gap = random(0.2, 0.8) * fullAngle;
    mod = random();
    oneRev(g, x, y, r, ir, mod, gap, fullAngle);
    r -= concentricMax * 1.1;
  }
  temp = fascinator(g.width, g.width);
  addMultiples(g, temp, [[0.5, 0.5]]);
}

function oneRev(g, x, y, r, ir, mod, gap, fullAngle){
  let pos = 0;
    while (pos < TWO_PI) {
      g.arc(x, y, r, r, pos + mod, pos + gap  + mod);
      pos += fullAngle;
    }
    pos = 0;
    while (pos < TWO_PI) {
      g.arc(x, y, ir, ir, pos + mod, pos + gap  + mod);
      pos += fullAngle;
    }
    pos = 0;
    while (pos < TWO_PI) {
      let x1, x2, y1, y2;
      x1 = x + cos(pos + mod) * r/2;
      y1 = y + sin(pos + mod) * r/2;
      x2 = x + cos(pos + mod) * ir/2;
      y2 = y + sin(pos + mod) * ir/2;
      g.line(x1, y1, x2, y2);
      x1 = x + cos(pos + mod + gap) * r/2;
      y1 = y + sin(pos + mod + gap) * r/2;
      x2 = x + cos(pos + mod + gap) * ir/2;
      y2 = y + sin(pos + mod + gap) * ir/2;
      g.line(x1, y1, x2, y2);
      pos += fullAngle;
    }
}