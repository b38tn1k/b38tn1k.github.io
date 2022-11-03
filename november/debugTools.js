
function bigCText(myString, size = 64, canvas=gGraphics['canvas'], c=gColors[10]) {
  canvas.textSize(size);
  if ( String(canvas.elt.id).includes('defaultCanvas')) {
    fill(c);
  } else {
    canvas.fill(c);
  }
  let y = (windowHeight - size)/2;
  let x = (windowWidth - canvas.textWidth(myString))/2;
  canvas.text(myString, x, y);
}
