
function setupScreen(){
  createCanvas(windowWidth, windowHeight);
  bigText = 30;
  smallText = 15;
  pixelSize = 10;
  startx = 20;
  if (windowWidth < 1100 || windowHeight < 650){
    bigText = 30;
    smallText = 12;
    pixelSize = 10;
    startx = 15;
  }
  if (windowWidth < 900){
    bigText = 28;
    smallText = 11;
    pixelSize = 10;
    startx = 10;
  }
  if (windowWidth < 700 ) {
    bigText = 24;
    smallText = 10;
    pixelSize = 10;
    startx = 5;
  }
  if (windowWidth < 500 || windowHeight < 550) {
    bigText = 22;
    smallText = 10;
    pixelSize = 7;
    startx = 5;
  }
  if (windowWidth < 300) {
    bigText = 24;
    smallText = 6;
    pixelSize = 5;
    startx = 5;
  }
  // let ratio = windowWidth / windowHeight;
}

function draw() {
  background(255);
  let x = startx;
  let y = bigText;
  noStroke();
  fill(myColors[0]);
  textSize(bigText);
  text('Toy Neural Network', x, y);
  y += bigText-5;
  textSize(smallText);
  text('This program tries to recognise patterns or shapes.', x, y);
  y += smallText;
  textStyle(BOLD);
  text('Click HERE or press the \'g\' key to randomly generate an example.', x, y);
  textStyle(NORMAL);
  dXmin = x;
  dXmax = x + textWidth('Click HERE or press the \'g\' key to try a randomly generated example.');
  dYmin = y - bigText;
  dYmax = y + bigText;
  y += smallText;
  text('Draw some similar patterns and then some non-patterns in the boxes below.', x, y);
  y += smallText;
  text('Click the rectangle on the left to mark each box:', x, y);
  y += smallText;
  text('A box can be marked as either a pattern (white) or a non-pattern (blue).', x, y);
  y += smallText;
  text('3 patterns and 3 non-patterns should work well.', x, y);
  stroke(0);
  y += smallText;
  noStroke();
  fill(myColors[0]);
  stroke(0);
  for (let i = 0; i < trainP.length; i++) {
    trainP[i].drawPattern(x, y, pixelSize);
    x += (trainP[i].cols + 2) * pixelSize;
  }
  x = startx;
  y += (trainP[0].rows + 0.5) * pixelSize;
  noStroke();
  fill(myColors[0]);
  text('The computer makes some more patterns by moving the source patterns around', x, y-10);
  y += smallText;
  text('Click any box to make some more patterns.', x, y-10);
  stroke(0);
  for (let i = 0; i < generated.length; i++) {
    generated[i].drawPattern(x, y, pixelSize);
    x += (generated[i].cols + 2) * pixelSize;
  }
  x = startx;
  y += (trainP[0].rows + 0.5) * pixelSize;
  noStroke();
  fill(myColors[0]);
  text('You can test the pattern recognition below.', x, y-10);
  y += smallText;
  text('Add a similar (not identical) pattern and a non-pattern:', x, y-10);
  stroke(0);
  for (let i = 0; i < testP.length; i++) {
    testP[i].drawPattern(x, y, pixelSize);
    x += (testP[i].cols + 2) * pixelSize;
  }

  x = startx;
  y += (trainP[0].rows + 0.5) * pixelSize;
  noStroke();
  fill(myColors[0]);
  text('The WEIGHTS boxes are shown below.', x, y-10);
  y += smallText;
  text('Each "pixel" in the box helps recognise the pattern.', x, y-10);
  y += smallText;
  text('But some pixels are more important than others.', x, y-10);
  y += smallText;
  textStyle(BOLD);
  text('Click the large WEIGHTS box (or press \'r\') a few times to train the network ' + stepCount + 'x per click.', x, y-10);
  textStyle(NORMAL);
  stroke(0);
  drawWeights(x, y, pixelSize, layer2Weights, trainP[0].nSequence.length, trainP[0].cols, trainP[0].rows);
  noStroke();
  fill(myColors[0]);
  text('The small box is a moving window.', wXmax + 2 * pixelSize, y + smallText);
  text('It looks at every pixel and its neighbours.', wXmax + 2 * pixelSize, y + 2*smallText);
  text('The big box works on the output of the small box for every pixel.', wXmax + 2 * pixelSize, y + 3*smallText);
  stroke(0);
  drawWeights(wXmax + 2 * pixelSize, wYmax - 3 * pixelSize, pixelSize, layer1Weights, 9, 3, 3, false);
  noStroke();
  fill(myColors[0]);
  x = startx;
  y += (trainP[0].rows + 3) * pixelSize;
  text('Check the label rectangles on your test patterns.', x, y-10);
  y += smallText;
  text('Remember white means pattern, blue means non-pattern.', x, y-10);
  y += smallText;
  text('If it didnt work try training a few more times.', x, y-10);
  y += smallText;
  text('Train too many times and it might learn to recognise any pattern', x, y-10);
  y += smallText;
  text('Make a different test pattern, or click the small box to reset the weights.', x, y-10);
  y += smallText;
  text('Training can go "weird" and fixing it is tricky on a web browser.', x, y-10);
}
