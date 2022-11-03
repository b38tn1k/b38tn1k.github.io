
function bigCText(myString, size = 64, canvas=gGraphics['canvas'], c=gColors[10]) {
  canvas.textSize(size);
  if ( String(canvas.elt.id).includes('defaultCanvas')) {
    fill(c);
  } else {
    canvas.fill(c);
  }
  canvas.textAlign(CENTER, CENTER);
  canvas.text(myString, canvas.width/2, canvas.height/2);
}

function drawTestPattern(canvas) {
  canvas.fill(gColors[42]);
  canvas.circle(0, 0, 20);
  canvas.circle(canvas.width, 0, 20);
  canvas.circle(canvas.width, canvas.height, 20);
  canvas.circle(canvas.width/2, canvas.height/2, 20);
  canvas.circle(0, canvas.height, 20);
}

function visualUserAgentCheck(){
  drawTestPattern(gGraphics['base']['g']);
  if (isTouchDevice === true){
    bigCText('MOBILE-ISH', 64, gGraphics['base']['g']);
  } else {
    bigCText('NOT MOBILE', 64, gGraphics['base']['g']);
  }
}
