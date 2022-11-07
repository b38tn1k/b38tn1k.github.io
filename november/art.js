function pixelBorder(cnv, r=5) {
  let wOn2 = cnv.g.width/2;
  let hOn2 = cnv.g.height/2;
  let flwr = floor((cnv.g.width)/r);
  let flhr = floor((cnv.g.height)/r);
  let rd = r;
  let v = 0;
  let off = 0;
  flwr -= 1;
  cnvrh = (cnv.g.width - (flwr * r)) * 2;
  cnvrv = (cnv.g.height - (flhr * r)) * 2;
  cnv.g.fill(G.colors[0]);
  cnv.g.noStroke();
  cnv.g.rectMode(CENTER);
  cnv.g.rect(wOn2, cnvrh/2, cnv.g.width, cnvrh);
  cnv.g.rect(wOn2, cnv.g.height-cnvrh/2, cnv.g.width, cnvrh);
  cnv.g.rect(cnvrv/2, hOn2, cnvrv, cnv.g.height);
  cnv.g.rect(cnv.g.width-cnvrv/2, hOn2, cnvrv, cnv.g.height);
  for (let i = 0; i < r; i++) {
    for (let i = cnvrv + r/2; i < cnv.g.width; i += 2*r) {
      cnv.g.square(i + off, cnvrh + r/2 + v, rd);
      cnv.g.square(i + off, cnv.g.height - (cnvrh + r/2 + v), rd);
    }
    for (let i = cnvrh/2 - r/2; i < cnv.g.height; i += 2*r) {
      cnv.g.square(cnvrv + r/2 + v, i + off, rd);
      cnv.g.square(cnv.g.width - (cnvrv + r/2 + v), i + off, rd);
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

function getPerlinTile(dim, r=100, scalex=5, scaley=5) {
  console.log(dim)
  let cnv = new Drawable(dim, dim, 0, 0, 0, 0);
  perlinTile(cnv, r, scalex, scaley);
  return cnv;
}

function perlinTile(cnv, r, scalex, scaley) {
  let psX = cnv.g.width / r;
  let psY = cnv.g.width / r;
  cnv.g.noStroke();
  let blendBorder = (r/2)-1;
  let [blbdXm, blbdXM, blbdYm, blbdYM] = [blendBorder, r - blendBorder, blendBorder, r - blendBorder];
  let val, ratio;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < r; j++) {
      val = noise(i/scalex, j/scaley);
      ratio = val;
      if (i < blbdXm) {
        let v2 = noise((i+r)/scalex, (j)/scaley);
        val = max(val, v2);
        // ratio = (i / blbdXm);
        // val = (ratio * val) + ((1 - ratio) * noise((i+r)/scalex, (j)/scaley));
      }
      if (i > blbdXM) {
        let v2 = noise((i-r)/scalex, (j)/scaley);
        val = max(val, v2);
        // ratio = 1 - ((i - blbdXM) / blendBorder);
        // val = (ratio * val) + ((1 - ratio) * noise((i-r)/scalex, (j)/scaley));
      }
      if (j < blbdYm) {
        let v2 = noise((i/scalex),(j+r)/scaley);
        val = max(val, v2);
        // ratio = (j) / blbdYm;
        // val = (val * ratio) + ((1-ratio) * noise((i)/scalex, (j+r)/scaley));
      }
      if (j > blbdYM) {
        let v2 = noise(i/scalex, (j-r)/scaley);
        val = max(val, v2);
        // ratio = 1 - ((j - blbdYM) / blendBorder);
        // val = (val * ratio) + ((1 - ratio) * noise((i)/scalex, (j-r)/scaley))
      }
      if (val > 0.5) {
        cnv.g.fill(G.colors[35]);
      } else if (val < 0.4) {
        cnv.g.fill(G.colors[33]);
      } else {
        cnv.g.fill(G.colors[34]);
        // cnv.g.fill(0, 255, 255);

      }

      cnv.g.rect(i * psX, j*psY, psX, psY);
    }
  }
}
