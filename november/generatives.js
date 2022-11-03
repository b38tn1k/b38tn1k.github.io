// all temp, just to feel better

function drawBase(gGLayers){
  // make the world brown and sad looking;
  gGLayers.base.g.background(gColors[36]);
  // add a road
  gGLayers.base.g.fill(gColors[35]);
  gGLayers.base.g.noStroke();
  gGLayers.base.g.rectMode(CENTER);
  gGLayers.base.g.rect(gGLayers.base.g.width/2, gGLayers.base.g.height/2, 7*gGLayers.base.g.width/12, gGLayers.base.g.height * 2);
}

function drawBorder(gGLayers) {
  let b = gGLayers.newLayer(0, 'border');
  b.g.fill(gColors[0]);
  b.g.noStroke();
  b.g.rectMode(CENTER);
  let r = 5;
  let w = b.g.width;
  let h = b.g.height;
  let wOn2 = b.g.width/2;
  let hOn2 = b.g.height/2;
  let flwr = floor((w)/r);
  let flhr = floor((h)/r);
  flwr -= 1;
  brh = (w - (flwr * r)) * 2;
  brv = (h - (flhr * r)) * 2;
  b.g.rect(wOn2, brh/2, w, brh);
  b.g.rect(wOn2, h-brh/2, w, brh);
  b.g.rect(brv/2, hOn2, brv, h);
  b.g.rect(w-brv/2, hOn2, brv, h);
  let rd = r;
  let v = 0;
  let off = 0;
  for (let i = 0; i < 3; i++) {
    for (let i = brv + r/2; i < w; i += 2*r) {
      b.g.square(i + off, brh + r/2 + v, rd);
      b.g.square(i + off, h - (brh + r/2 + v), rd);
    }
    for (let i = brh/2 - r/2; i < h; i += 2*r) {
      b.g.square(brv + r/2 + v, i + off, rd);
      b.g.square(w - (brv + r/2 + v), i + off, rd);
    }
    v += r;
    if (off == 0) {
      off = r;
    } else {
      off = 0;
    }
    rd -= 1;
  }
}
