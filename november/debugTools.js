
function bigCText(myString, size = 64, canvas=gGLayers.base.g, c=gColors[10]) {
  canvas.textSize(size);
  if ( String(canvas.elt.id).includes('defaultCanvas')) {
    fill(c);
  } else {
    canvas.fill(c);
  }
  canvas.textAlign(CENTER, CENTER);
  canvas.text(myString, canvas.width/2, canvas.height/2);
}

function drawTestPattern(canvas=gGLayers.base.g) {
  canvas.noStroke();
  canvas.fill(gColors[22]);
  canvas.circle(0, 0, 40);
  canvas.circle(canvas.width, 0, 40);
  canvas.circle(canvas.width, canvas.height, 40);
  canvas.circle(canvas.width/2, canvas.height/2, 40);
  canvas.circle(0, canvas.height, 40);
  canvas.fill(gColors[42]);
  canvas.circle(0, 0, 20);
  canvas.circle(canvas.width, 0, 20);
  canvas.circle(canvas.width, canvas.height, 20);
  canvas.circle(canvas.width/2, canvas.height/2, 20);
  canvas.circle(0, canvas.height, 20);
}

function visualUserAgentCheck(canvas=gGLayers.base.g){
  drawTestPattern(canvas);
  if (checkIsTouchDevice() === true){
    bigCText('MOBILE-ISH', 64, canvas);
  } else {
    bigCText('NOT MOBILE', 64, canvas);
  }
}

function visualCheckLayers(addFakes = false) {
  if (addFakes == true) {
    gGLayers.newLayer(0, 'L3');
    gGLayers.newLayer(0, 'L2');
    gGLayers.newLayer(2, 'L4');
    gGLayers.newLayer(0, 'L0');
    gGLayers.newLayer(1, 'L1');
  }
  let x = 100;
  let y = 100;
  let r = 50;
  let ts = 32;
  let c = 10;
  gGLayers.base.g.fill(gColors[c]);
  gGLayers.base.g.circle(x, y, r);
  gGLayers.base.g.fill(gColors[c + 10]);
  gGLayers.base.g.textAlign(CENTER, CENTER);
  gGLayers.base.g.textSize(ts);
  gGLayers.base.g.text('B', x, y);
  for (let i = 0; i < gGLayers.layers.length; i++) {
    y += 40;
    c += 2;
    let myL = gGLayers.layers[i]
    gGLayers.base.g.fill(gColors[c]);
    gGLayers.base.g.circle(x, y, r);
    gGLayers.base.g.fill(gColors[c + 10]);
    gGLayers.base.g.textAlign(CENTER, CENTER);
    gGLayers.base.g.textSize(ts);
    gGLayers.base.g.text(gGLayers.getLayerName(i), x, y);
  }
}
