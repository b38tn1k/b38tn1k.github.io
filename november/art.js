function vignette(cnv, border = 1.1){
  let c1 = color(0, 0, 0, 0);
  let c2 = color(255, 0, 0, 255);
  let w = G.dims.w * border;
  let h = G.dims.h * border;
  let br = min(w, h) / max(G.dims.w, G.dims.h);
  cnv.g.noFill();
  cnv.g.strokeWeight(1);
  while (min(w, h) < max(G.dims.w, G.dims.h)) {
    let ratio = (min(w, h) / max(G.dims.w, G.dims.h)) - br;
    cnv.g.stroke(lerpColor(c1, c2, ratio));
    cnv.g.ellipse(G.dims.cx, G.dims.cy, w, h);
    w += 1;
    h += 1;
  }
}

function pixelBorder(cnv, r=3) {
  let flwr = floor((cnv.g.width - r)/r);
  let flhr = floor((cnv.g.height - r)/r);
  let rd = r;
  let v = 0;
  let off = 0;
  let noff = r;
  flwr -= 1;
  let flY = (flwr%2 == 0);
  let flX = (flhr%2 == 0);
  cnv.g.fill(G.colors[0]);
  cnv.g.stroke(G.colors[0]);
  cnv.g.strokeWeight(1);
  let newCanv = createGraphics(flwr*r, flhr*r);
  cnv.g.rectMode(CORNER);
  cnv.g.rect(0, 0, cnv.g.width, (cnv.g.height - newCanv.height)/2);
  cnv.g.rect(0, 0, (cnv.g.width - newCanv.width)/2, cnv.g.height);
  cnv.g.rect(0, cnv.g.height-((cnv.g.height - newCanv.height)/2), cnv.g.width, newCanv.height);
  cnv.g.rect(cnv.g.width - (cnv.g.width - newCanv.width)/2, 0, newCanv.width, cnv.g.height);
  newCanv.fill(G.colors[0]);
  newCanv.noStroke();
  newCanv.rectMode(CORNER);
  for (let i = 0; i < r; i++) {
    // horizontals
    for (let j = 0; j < newCanv.width; j += 2*r) {
      newCanv.square(j + off, v, rd);
      if (flX == true) {
        newCanv.square(j + noff, newCanv.height - (v + r), rd);
      } else {
        newCanv.square(j + off, newCanv.height - (v + r), rd);
      }
    }
    // verticals
    for (let j = 0; j <= cnv.g.height; j += 2*r) {
      newCanv.square(v, j + off, rd);
      if (flY == true) {
        newCanv.square(newCanv.width - (v + r), j + noff, rd);
      } else {
        newCanv.square(newCanv.width - (v + r), j + off, rd);
      }

    }
    v += r;
    if (off == 0) {
      off = r;
      noff = 0;
    } else {
      off = 0;
      noff = r;
    }
    rd -= 1;
  }
  cnv.g.imageMode(CENTER);
  cnv.g.image(newCanv, cnv.tx, cnv.ty);
}

function getPerlinTile(dim, scale, r, myColors, addNoise=false) {
  noiseSeed(random(100));
  let cnv = new Drawable(dim, dim, 0, 0, 0, 0);
  for (let x = 0; x < cnv.g.width + r; x+=r) {
    for (let y = 0; y < cnv.g.height + r; y+=r) {
      const n = sqrt(myNoise(x * scale, y * scale, 0, cnv.g.width * scale, cnv.g.height * scale));
      const c = int(map(n, 0, 1, 0, myColors.length));
      cnv.g.stroke(myColors[c]);
      cnv.g.fill(myColors[c]);
      cnv.g.square(x, y, r);
    }
  }
  if (addNoise == true) {
    addNoiseTile(cnv, r, myColors);
  }
  return cnv;
}

function addNoiseTile(cnv, r, myColors, amount = 50) {
  let range = floor(cnv.g.width / r);
  for (let i = 0; i < amount; i++) {
    let c = myColors[int(random(myColors.length))]
    cnv.g.stroke(c);
    cnv.g.fill(c);
    cnv.g.square(r * int(random(range)), r * int(random(range)), r);
  }
}

function drawRoad(cnv, widthPercent, bgRes, myColors) {
[w, h, r, tx, ty] = G.dims.fullScreenGraphicDims;
let roadTexture = new Drawable(w, h, r, tx, ty, 0);
let tile = getPerlinTile(100, 0.05, bgRes, myColors, true);
roadTexture.setTileAble(tile);
var roadTextureIMG = createImage(w, h);
roadTextureIMG.copy(roadTexture.g, 0, 0, w, h, 0, 0, w, h);
let roadMask = new Drawable(w, h, r, tx, ty, 0);
roadMask.g.fill(0);
let border = 10;
let startX = (1 - widthPercent) * (w/2);
startX = floor(startX / bgRes) * bgRes + bgRes * border;
let endX = startX + widthPercent * w;
endX = floor(endX / bgRes) * bgRes - bgRes  * border;
width = endX - startX;
roadMask.g.rect(startX, 0, width, h);
let probability = 0.8;
px = startX - bgRes;
pxE = endX;
for (let repeat = 0; repeat < border; repeat++) {
  for (let i = 0; i < h; i+= bgRes) {
    if (probability > random()) {
      roadMask.g.square(px, i, bgRes);
    }
    if (probability > random()) {
      roadMask.g.square(pxE, i, bgRes);
    }
  }
  probability -= 0.1;
  px -= bgRes;
  pxE += bgRes;
}
var roadMaskIMG = createImage(w, h);
roadMaskIMG.copy(roadMask.g, 0, 0, w, h, 0, 0, w, h);
roadTextureIMG.mask(roadMaskIMG);
cnv.g.image(roadTextureIMG, 0, 0);
// cnv.g.image(roadMask.g, 0, 0);
}

function showColors() {
  function colorString(levels) {
    return String(levels[0]) + ', ' + String(levels[1]) + ', ' + String(levels[2])
  }
  colorDiv = createDiv();
  colorDiv.position(0, 0);
  colorDiv.style('background-color', '#FFFFFF');
  for (let i = 0; i < G.colors.length; i++) {
    let levels = G.colors[i].levels;
    colorDiv.html('<span style="color:rgb(' + colorString(levels) + ')">' + i + '    ■ </span>' , true);
    // colorDiv.html(i + '    ■ </span>', true);
    if (i % 10 == 0 && i != 0) {
      colorDiv.html('<br><br>', true);
    }
  }
}



function perlinTilebackup(cnv, scale, r) {
  cnv.g.strokeWeight(2);
  cnv.g.rectMode(CENTER);
  for (let x = 0; x < cnv.g.width; x++) {
    for (let y = 0; y < cnv.g.height; y++) {
      const n = myNoise(x * scale, y * scale, 0, cnv.g.width * scale, cnv.g.height * scale);
      const c = map(n, 0, 1, 0, 255);
      cnv.g.stroke(c);
      cnv.g.point(x, y);
    }
  }
}

function myNoise(x, y, z, w, h) {
  return (noise(x, y, z) * (w - x) * (h - y) + noise(x - w, y, z) * x * (h - y) + noise(x - w, y - h, z) * x * y + noise(x, y - h, z) * (w - x) * y) / (w * h);
}
