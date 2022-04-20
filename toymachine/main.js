var trainP = [];
var generated = [];
var allGeneratedIn = [];
var allGeneratedOut = [];
var testP = [];
var numberOfThings = 6;
var stepCount = 10;
var tempWeights = [];
var wXmin, wXmax, wYmin, wYmax;
var dXmin, dXmax, dYmin, dYMax;

var myColors, yesColor, noColor;

class NN {
  constructor(inputs, outputs) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.weights = [];
    for (let i = 0; i < inputs[0].length; i++) {
      this.weights.push(random(-1, 1));
    }
  }

  test (input, weights=this.weights) {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += input[i] * weights[i];
    }
    let value = 1 / (1 + exp(-1 * sum));
    return value;
  }

  step() {
    let tOut = [];
    let value;
    // get guessed outputs
    for (let i = 0; i < this.inputs.length; i++) {
      value = this.test(this.inputs[i]);
      tOut.push(value);
    }
    // find delta between output and expected output
    let delta = [];
    let del;
    for (let i = 0; i < this.outputs.length; i++) {
      del = (this.outputs[i] - tOut[i]) * (tOut[i] * (1 - tOut[i]));
      delta.push(del);
    }
    // dot product of inputs and deltas to update weights
    let dotDelta = jamesDotProd(this.inputs, delta);
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += dotDelta[i];
    }
  }
}

function scratchNet() {
  let inputs = [[0, 0, 1, 0, 1, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0, 0], [1, 0, 1, 1, 1, 1, 1, 1], [0, 1, 1, 1, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 1, 1]];
  let outputs = [0, 1, 1, 0, 0];
  let myNN = new NN(inputs, outputs);
  for (let its = 0; its < 10; its ++) {
    for (let steps = 0; steps < 10; steps++) {
      myNN.step();
    }
    console.log(myNN.test([1, 0, 1, 0, 0, 1, 0, 0]));
  }
}

function slowScratchNet() {
  let inputs = [[0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0], [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0]];
  let outputs = [1, 0];
  let myNN = new NN(inputs, outputs);
  for (let its = 0; its < 10; its ++) {
    for (let steps = 0; steps < 50; steps++) {
      myNN.step();
    }
    console.log(myNN.test([0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0]));
  }
}

function jamesDotProd(inputs, delta) {
  let innerLength = inputs[0].length;
  let transpose = [];
  for (let i = 0; i < innerLength; i++) {
    transpose.push([])
    for (let j = 0; j < inputs.length; j++) {
      transpose[i].push(inputs[j][i]);
    }
  }
  let dProd = [];
  for (let i = 0; i < innerLength; i++) {
    dProd.push(0);
  }
  for (let h = 0; h < delta.length; h++){
    for (let i = 0; i < innerLength; i++) {
      dProd[i] += transpose[i][h] * delta[h];
    }
  }
  return dProd;
}

class NPattern {
  constructor(rows, cols, isTest=false) {
    this.seqLength = rows * cols;
    this.rows = rows;
    this.cols = cols;
    this.nSequence = new Array(this.seqLength).fill(0);
    this.boxHitBox = [];
    this.majorHitBox = [];
    this.egHitBox = [];
    this.isExample = false;
    this.isTest = isTest;
    this.lerp = 0;
  }

  generateAlt() {
    let alts = [];
    let arr = [];
    let combined = [];
    let side = [];
    let end = [];
    // move up
    // side = this.nSequence.slice(0, this.cols);
    side = new Array(this.cols).fill(0);
    end = this.nSequence.slice(this.cols);
    combined = end.concat(side);
    alts.push(combined);
    combined = invert(combined)
    alts.push(combined);
    // move down
    combined = [];
    // side = this.nSequence.slice(-1 * this.cols);
    side = new Array(this.cols).fill(0);
    end = this.nSequence.slice(0, -1 * this.cols);
    combined = side.concat(end);
    alts.push(combined);
    combined = invert(combined)
    alts.push(combined);
    //move left
    combined = [];
    for (let i = 1; i < this.seqLength; i+= 1) {
      combined.push(this.nSequence[i]);
    }
    combined.push(0);
    for (let i = this.cols-1; i < this.seqLength; i+= this.cols) {
      combined[i] = 0;
    }
    alts.push(combined);
    combined = invert(combined)
    alts.push(combined);
    //move right
    combined = [0];
    for (let i = 0; i < this.seqLength-1; i+= 1) {
      combined.push(this.nSequence[i]);
    }
    for (let i = 0; i < this.seqLength; i+= this.cols) {
      combined[i] = 0;
    }
    alts.push(combined);
    combined = invert(combined)
    alts.push(combined);
    return alts;
  }

  updateIsExampleWithClick(mx, my) {
    if (mx > this.egHitBox[0] && mx < this.egHitBox[1]) {
      if (my > this.egHitBox[2] && my < this.egHitBox[3]) {
        this.isExample = !this.isExample;
        return true;
      }
    }
    return false;
  }

  areaClicked(mx, my) {
    if (mx > this.majorHitBox[0] && mx < this.majorHitBox[1]) {
      if (my > this.majorHitBox[2] && my < this.majorHitBox[3]) {
        return true;
      }
    }
    return false;

  }

  updateBoxWithClick(mx, my) { //oh man
    if (mx > this.majorHitBox[0] && mx < this.majorHitBox[1]) {
      if (my > this.majorHitBox[2] && my < this.majorHitBox[3]) {
        for (let j = 0; j < this.nSequence.length; j++) {
          if (mx > this.boxHitBox[j][0] && mx < this.boxHitBox[j][1]) {
            if (my > this.boxHitBox[j][2] && my < this.boxHitBox[j][3]) {
              if (this.nSequence[j] == 1) {
                this.nSequence[j] = 0;
              } else {
                this.nSequence[j] = 1;
              }
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  drawPattern(x, y, w) {
    let x2 = x;
    let egX;
    let egY = y;
    let egH = w * this.rows;
    this.boxHitBox = [];
    this.majorHitBox = [x, 0, y, 0];
    for (let i = 0; i < this.nSequence.length; i++) {
      fill(myColors[this.nSequence[i]]);
      square(x2, y, w);
      this.boxHitBox.push([x2, x2 + w, y, y + w]);
      x2 += w;
      if ((i + 1) % this.cols == 0){
        egX = x2;
        x2 = x;
        y += w;
      }
    }
    if (this.isTest) {
      fill(lerpColor(noColor, yesColor, this.lerp));
    } else {
      if (this.isExample) {
        fill(yesColor);
      } else {
        fill(noColor);
      }
    }
    this.majorHitBox[1] = egX;
    this.majorHitBox[3] = y;
    y -= w;
    this.egHitBox = [egX, egX + w, egY, egY + egH];
    rect(egX, egY, w, egH);
  }
}

function setupGenerates() {
  allGeneratedIn = [];
  allGeneratedOut = [];
  let alt = [];
  for (let i = 0; i < trainP.length; i++) {
    alt = [];
    alt = trainP[i].generateAlt();
    for (j = 0; j < alt.length; j++) {
      allGeneratedIn.push(alt[j]);
      allGeneratedOut.push(trainP[i].isExample);
    }
    generated[i].isExample = trainP[i].isExample;
    if (alt.length > 0) {
      generated[i].nSequence = random(alt);
    } else {
      generated[i].nSequence = trainP[i].nSequence;
    }
  }
}

function setupDemo() {
  trainP[0].nSequence = [0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  trainP[0].isExample = true;
  trainP[1].nSequence = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0];
  trainP[1].isExample = true;
  trainP[2].nSequence = [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0];
  trainP[2].isExample = true;
  trainP[3].nSequence = [1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1];
  trainP[4].nSequence = [0,0,0,0,0,0,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,1,0,0,0,0,0,0];
  trainP[5].nSequence = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0];
  testP[0].nSequence = [0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0];
  testP[1].nSequence = [1,1,1,1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1];
}

function doNN() {
  // setup data
  let inputs = [];
  let outputs = [];
  let tests = [];
  for (let i = 0; i < trainP.length; i++) {
    inputs.push(trainP[i].nSequence);
    outputs.push(int(trainP[i].isExample));
  }
  for (let i = 0; i < allGeneratedIn.length; i++) {
    inputs.push(allGeneratedIn[i]);
    outputs.push(int(allGeneratedOut[i]));
  }
  for (let i = 0; i < testP.length; i++) {
    tests.push(testP[i].nSequence);
  }
  // run net
  let myNN = new NN(inputs, outputs);
  if (tempWeights.length == 0) {
    tempWeights = myNN.weights;
  } else {
    myNN.weights = tempWeights;
  }
  for (let its = 0; its < stepCount; its ++) {
    myNN.step();
    tempWeights = myNN.weights;
    for (let i = 0; i < tests.length; i++) {
      testP[i].lerp = myNN.test(tests[i]);
      // console.log(testP[i].lerp);
    }
  }
}

function invert(myArr) {
  invArr = []
  for (let i = 0; i < myArr.length; i++) {
    if (myArr[i] == 1) {
      invArr.push(0);
    } else {
      invArr.push(1);
    }
  }
  return invArr;
}

function drawWeights(x, y, w) {
  wXmin = x;
  wXmax = x + w * trainP[0].cols;
  wYmin = y;
  wYmax = y + w * trainP[0].rows;;
  let x2 = x;
  let norm = [];
  if (tempWeights.length > 0) {
    for (let i = 0; i < tempWeights.length; i++) {
      norm.push(tempWeights[i] - min(tempWeights));
    }
    let nMax = max(norm);
    for (let i = 0; i < norm.length; i++) {
      norm[i] = norm[i] / nMax;
    }
  } else {
    norm = tempWeights;
  }

  for (let i = 0; i < trainP[0].nSequence.length; i++) {
    if (tempWeights.length == 0){
      fill(noColor);
    } else {
      fill(lerpColor(noColor, yesColor, norm[i]));
    }
    square(x2, y, w);
    x2 += w;
    if ((i + 1) % trainP[0].cols == 0){
      x2 = x;
      y += w;
    }
  }
}

function mousePressed() {
  mx = mouseX;
  my = mouseY;
  let stop = false;
  if (mx > wXmin && mx < wXmax && my > wYmin && my < wYmax) {
    setupGenerates();
    doNN();
    return false;
  }
  // console.log(mx, my, dXmin, dXmax, dYmin, dYmax);

  if (mx > dXmin && mx < dXmax && my > dYmin && my < dYmax) {
    setupDemo();
    return false;
  }

  for (let i = 0; i < testP.length; i++){
    stop = testP[i].updateBoxWithClick(mx, my);
    if (stop) {return false;};
  }
  for (let i = 0; i < trainP.length; i++){
    stop = trainP[i].updateIsExampleWithClick(mx, my);
    if (stop) {return false;};
    stop = trainP[i].updateBoxWithClick(mx, my);
    if (stop) {return false;};
  }
  for (let i = 0; i < generated.length; i++) {
    let gen = generated[i].areaClicked(mx, my);
    if (gen) {
      setupGenerates();
      return false;
    }
  }
}

function keyTyped() {
  if (key === 'd') {
    setupDemo();
  } else if (key === 's'){
    let strin = '';
    for (let i = 0; i < trainP.length; i++) {
      strin += '['
      for (let j = 0; j < trainP[i].nSequence.length; j++) {
        strin += trainP[i].nSequence[j] + ','
      }
      strin += '] newline';
    }
    strin += 'newline';

    for (let i = 0; i < testP.length; i++) {
      strin += '['
      for (let j = 0; j < testP[i].nSequence.length; j++) {
        strin += testP[i].nSequence[j] + ','
      }
      strin += '] newline';
    }
    saveStrings(strin, 'demo.txt');
  } else {
    setupGenerates();
    doNN();
  }
  return false;
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function setupScreen(){
  // scratchNet();
  // slowScratchNet();
  createCanvas(windowWidth, windowHeight);
  // let ratio = windowWidth / windowHeight;
  trainP = [];
  generated = [];
  allGeneratedIn = [];
  allGeneratedOut = [];
  testP = [];
  for (let i = 0; i < numberOfThings; i++) {
    trainP.push(new NPattern(6, 5));
    generated.push(new NPattern(6, 5));
  }
  for (let i = 0; i < 2; i++) {
    testP.push(new NPattern(6, 5, true));
  }
}

function preload() {

}

function setup() {
  yesColor = color('#FFFFFF');
  noColor = color('#567DA7');
  myColors = [color('#567DA7'), color('#FFFFFF')];
  textFont('Courier New');
  setupScreen();
  frameRate(10);
  textSize(18);
}

function draw() {
  let x = 20;
  let y = 32;
  noStroke();
  fill(myColors[0]);
  textSize(32);
  text('Toy Neural Network', x, y);
  y += 32;
  textSize(18);
  text('Draw some patterns and non-patterns using the boxes below.', x, y);
  y += 18;
  text('Click the rectangle on the left to label each box as either a pattern (white) or a non-pattern. (blue)', x, y);
  y += 18;
  text('Or click HERE to load a preset.', x, y);
  dXmin = x;
  dXmax = x + textWidth('Or click HERE to load a preset.');
  dYmin = y - 32;
  dYmax = y + 32;
  y += 18;
  text('3 patterns and 3 non-patterns should work best.', x, y);
  stroke(0);
  y += 18;


  let pixelSize = 10;
  noStroke();
  fill(myColors[0]);
  // text('Training Inputs', x, y-10);
  stroke(0);
  for (let i = 0; i < trainP.length; i++) {
    trainP[i].drawPattern(x, y, pixelSize);
    x += (trainP[i].cols + 2) * pixelSize;
  }
  x = 20;
  y += (trainP[0].rows + 3) * pixelSize;
  noStroke();
  fill(myColors[0]);
  text('The computer generates more patterns by moving the source patterns around and flipping the colors.', x, y-10);
  y += 18;
  text('Click any box to generate.', x, y-10);
  stroke(0);
  for (let i = 0; i < generated.length; i++) {
    generated[i].drawPattern(x, y, pixelSize);
    x += (generated[i].cols + 2) * pixelSize;
  }

  x = 20;
  y += (trainP[0].rows + 3) * pixelSize;
  noStroke();
  fill(myColors[0]);
  text('You can test the pattern recognition below.', x, y-10);
  y += 18;
  text('Add a similar (but not identical) pattern and a different pattern:', x, y-10);
  stroke(0);
  for (let i = 0; i < testP.length; i++) {
    testP[i].drawPattern(x, y, pixelSize);
    x += (testP[i].cols + 2) * pixelSize;
  }

  x = 20;
  y += (trainP[0].rows + 3) * pixelSize;
  noStroke();
  fill(myColors[0]);
  // text('Weights', x, y-10);
  // y += 18;
  text('The WEIGHTS box below shows how important each "pixel" is for recognising the pattern.', x, y-10);
  y += 18;
  text('Click the WEIGHTS box below to train for ' + stepCount + ' iterations.', x, y-10);
  stroke(0);
  drawWeights(x, y, pixelSize);
  noStroke();
  fill(myColors[0]);
  x = 20;
  y += (trainP[0].rows + 3) * pixelSize;
  text('Check the label rectangles on your test patterns. Did it work?', x, y-10);
  y += 18;
  text('Maybe try clicking the WEIGHTS box again', x, y-10);




}
