var trainP = [];
var generated = [];
var allGeneratedIn = [];
var allGeneratedOut = [];
var testP = [];
var numberOfThings = 6;
var stepCount = 10;
var layer2Weights = [];
var layer1Weights  = [];
var wXmin, wXmax, wYmin, wYmax;
var rwXmin, rwXmax, rwYmin, rwYmax;
var dXmin, dXmax, dYmin, dYMax;
var bigText = 32;
var smallText = 18;
var pixelSize = 10;
var startx = 20;
var weightClickCounter = 0;
var myNN = null;
var myDemo;

var myColors, yesColor, noColor;

class NN {
  constructor(inputs, outputs, windowShape=null, kernelShape=null, parent=true) {
    this.parent = parent;
    this.child = null;
    this.windowShape = windowShape;
    this.windowShapeLength = 0;
    if (!(windowShape === null)) {
      this.windowShapeLength = windowShape.length;
    }
    this.kernelShape = kernelShape
    this.inputs = inputs;
    this.failCount = 0;
    this.outputs = outputs;
    this.weights = [];
    this.majorDataLength = inputs[0].length;
    this.dataCount = inputs.length;
    for (let i = 0; i < this.majorDataLength; i++) {
      this.weights.push(random(-1, 1));
    }
  }


  updateBabyDatas(){
      if (!this.parent){
        return false;
      }
      let bInputs = [];
      let bOutputs = [];
      let k;
      let newIn;
      let kInd;
      for (let i = 0; i < this.dataCount; i++) {
        for (let j = 0; j < this.windowShapeLength; j++) {
          k = this.windowShape[j];
          newIn = [];
          for (let h = 0; h < this.kernelShape.length; h++) {
            kInd = k + this.kernelShape[h];
            newIn.push(this.inputs[i][kInd]);
          }
          bInputs.push(newIn);
          if (max(newIn) == 0 || min(newIn) == 1) {
            bOutputs.push(0);
          } else {
            bOutputs.push(this.outputs[i]);
          }

        }
      }
      if (this.child === null) {
        this.child = new NN(bInputs, bOutputs, null, null, false);
        console.log('hello from me too!');
      } else {
        this.child.updateDatas(bInputs, bOutputs);
      }
    }

  updateDatas(inputs, outputs){
    this.inputs = inputs;
    this.outputs = outputs;
    this.updateBabyDatas();
  }

  ptest (input, weights=this.weights) {
    // convert input into child inspected input
    let k;
    let newIn = [];
    let kInd;
    let bInputs = [];
    // console.log(input);
    for (let j = 0; j < this.windowShapeLength; j++) {
      newIn = [];
      k = this.windowShape[j];
      for (let h = 0; h < this.kernelShape.length; h++) {
        kInd = k + this.kernelShape[h];
        newIn.push(input[kInd]);
      }
      bInputs.push(newIn);
    }
    let childOut = [];
    for (let i = 0; i < bInputs.length; i++) {
      childOut.push(this.child.test(bInputs[i]));
    }
    let _input = new Array(this.majorDataLength).fill(0);
    for (let j = 0; j < this.windowShapeLength; j++) {
      k = this.windowShape[j]
      _input[k] = childOut[j];
    }
    let sum = 0;
    for (let i = 0; i < this.majorDataLength; i++) {
      sum += _input[i] * weights[i];
    }
    let value = 1 / (1 + exp(-1 * sum));
    return value;
  }

  test (input, weights=this.weights) {
    let sum = 0;
    for (let i = 0; i < this.majorDataLength; i++) {
      sum += input[i] * weights[i];
    }
    let value = 1 / (1 + exp(-1 * sum));
    return value;
  }

  guess(input) {
    let tOut = [];
    let value;
    for (let i = 0; i < this.dataCount; i++) {
      value = this.test(input[i]);
      tOut.push(value);
    }
    return tOut;
  }

  getDelta(tOut) {
    let delta = [];
    let del;
    for (let i = 0; i < this.dataCount; i++) {
      del = (this.outputs[i] - tOut[i]) * (tOut[i] * (1 - tOut[i]));
      delta.push(del);
    }
    return delta;
  }

  updateWeights(delta, inputs=this.inputs) {
    let transpose = [];
    for (let i = 0; i < this.majorDataLength; i++) {
      transpose.push([])
      for (let j = 0; j < this.dataCount; j++) {
        transpose[i].push(inputs[j][i]);
      }
    }
    let dotDelta = [];
    for (let i = 0; i < this.majorDataLength; i++) {
      dotDelta.push(0);
    }
    for (let h = 0; h < this.dataCount; h++){
      for (let i = 0; i < this.majorDataLength; i++) {
        dotDelta[i] += transpose[i][h] * delta[h];
      }
    }
    for (let i = 0; i < this.majorDataLength; i++) {
      this.weights[i] += dotDelta[i];
    }
  }

  resetWeights() {
    this.weights = [];
    for (let i = 0; i < this.majorDataLength; i++) {
      this.weights.push(random(-1, 1));
    }
  }

  step() {
    let tOut;
    if (this.parent) {
      for (let i = 0; i < 10; i++) {
        this.child.step();
      }
      let childOut = this.child.guess(this.child.inputs);
      let _inputs = []
      let _inp;
      let k;
      let offset = 0
      // update the parent inputs with the child guesses
      for (let i = 0; i < this.dataCount; i++) {
        _inp = new Array(this.majorDataLength).fill(0);
        for (let j = 0; j < this.windowShapeLength; j++) {
          k = this.windowShape[j]
          _inp[k] = childOut[j + offset];
        }
        offset += this.windowShapeLength;
        _inputs.push(_inp);
      }
      tOut = this.guess(_inputs);
      // find delta between output and expected output
      let delta = this.getDelta(tOut);
      // dot product of inputs and deltas to update weights
      this.updateWeights(delta, _inputs);
    } else {
      // get guessed outputs
      tOut = this.guess(this.inputs);
      // find delta between output and expected output
      let delta = this.getDelta(tOut);
      // dot product of inputs and deltas to update weights
      this.updateWeights(delta);
      layer1Weights = this.weights;
    }
    // check descent is falling towards a solution
    let yesCount = 0;
    let noCount = 0;
    let yesAccum = 0;
    let noAccum = 0;
    for (let i = 0; i < this.dataCount; i++) {
      if (this.outputs[i] == 1) {
        yesCount += 1;
        yesAccum += tOut[i]
      } else {
        noCount += 1;
        noAccum += tOut[i]
      }
    }
    yesAccum = yesAccum / yesCount;
    noAccum = noAccum / noCount;
    if (noAccum > yesAccum) {
      this.failCount += 1;
    }
    if (this.failureCount > 50) {
      this.failCount = 0;
      this.resetWeights();
    }
  }
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
    if (this.isExample == false) {
      //combined = invertArr(combined);
      //alts.push(combined);
    } else {
      side = new Array(this.cols).fill(0);
      end = combined.slice(this.cols);
      combined = end.concat(side);
      alts.push(combined);
    }
    // move down
    combined = [];
    // side = this.nSequence.slice(-1 * this.cols);
    side = new Array(this.cols).fill(0);
    end = this.nSequence.slice(0, -1 * this.cols);
    combined = side.concat(end);
    alts.push(combined);
    if (this.isExample == false) {
      // combined = invertArr(combined);
      // alts.push(combined);
    } else {
      side = new Array(this.cols).fill(0);
      end = combined.slice(0, -1 * this.cols);
      combined = side.concat(end);
      alts.push(combined);
    }
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
    if (this.isExample == false) {
      // combined = invertArr(combined);
      // alts.push(combined);
    } else {
      end = []
      for (let i = 1; i < this.seqLength; i+= 1) {
        end.push(combined[i]);
      }
      end.push(0);
      for (let i = this.cols-1; i < this.seqLength; i+= this.cols) {
        end[i] = 0;
      }
      alts.push(end);
    }
    //move right
    combined = [0];
    for (let i = 0; i < this.seqLength-1; i+= 1) {
      combined.push(this.nSequence[i]);
    }
    for (let i = 0; i < this.seqLength; i+= this.cols) {
      combined[i] = 0;
    }
    alts.push(combined);
    if (this.isExample == false) {
      //combined = invertArr(combined);
      //alts.push(combined);
    } else {
      end = [0];
      for (let i = 0; i < this.seqLength-1; i+= 1) {
        end.push(combined[i]);
      }
      for (let i = 0; i < this.seqLength; i+= this.cols) {
        end[i] = 0;
      }
      alts.push(end);
    }
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
    if (mx > this.majorHitBox[0]-1 && mx < this.majorHitBox[1]+1) {
      if (my > this.majorHitBox[2]-1 && my < this.majorHitBox[3]+1) {
        for (let j = 0; j < this.nSequence.length; j++) {
          if (mx > this.boxHitBox[j][0]-1 && mx < this.boxHitBox[j][1]+1) {
            if (my > this.boxHitBox[j][2]-1 && my < this.boxHitBox[j][3]+1) {
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
    let egH = w * (this.rows - 2);
    this.boxHitBox = [];
    this.majorHitBox = [x, 0, y, 0];
    for (let i = 0; i < this.nSequence.length; i++) {
      if (i < this.cols || i > this.nSequence.length - this.cols - 1 || (i % this.cols == 0) || (i + 1) % this.cols == 0) {
        this.boxHitBox.push([0, 0, 0, 0]);
      } else {
        fill(myColors[this.nSequence[i]]);
        if (i % this.cols == 0) {
          fill(0);
        }
        square(x2, y, w);
        this.boxHitBox.push([x2, x2 + w, y, y + w]);
        x2 += w;
        if ((i + 2) % this.cols == 0){
          egX = x2;
          x2 = x;
          y += w;
        }
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
  for (let i = 0; i < 20; i++) {
    let noise = []
    for (let j = 0; j < trainP[0].nSequence.length; j++) {
      noise.push(int(random(0, 2)));
    }
    allGeneratedIn.push(noise);
    allGeneratedOut.push(false);
  }
}

function setupDemo() {
  let rc = int(random(0, myDemo.length));
  // rc = 0;
  for (let i = 0; i < trainP.length; i++) {
    trainP[i].nSequence = myDemo[rc][0][i];
    trainP[i].isExample = myDemo[rc][1][i];
  }
  for (let i = 0; i < testP.length; i++) {
    testP[i].nSequence = myDemo[rc][2][i];
    testP[i].lerp = 0;
  }
}

function generateShape() {
  if (!(myNN === null)) {
    console.log('reset!');
    myNN.resetWeights();
    myNN.child.resetWeights();
    layer2Weights = myNN.weights;
    layer1Weights = myNN.child.weights;
  }
  let patternLength = int(random(2, 4));
  let pattern = [0];
  for (let i = 0; i < patternLength; i++) {
    pattern.push(int(random(5, 9)));
    pattern.push(int(random(12, 16)));
  }
  let gp;
  let start;

  let row;
  for (let i = 0; i < 3; i++) {
    gp = new Array(trainP[0].nSequence.length).fill(0);
    start = int(random(1, 3));
    row = int(random(1, 3));
    start = start + (i+1)*8;
    for (let i = 0; i < pattern.length; i++) {
      gp[start + pattern[i]] = 1;
    }
    trainP[i].nSequence = [];
    trainP[i].nSequence = gp;
    trainP[i].isExample = true;
  }
  gp = new Array(trainP[0].nSequence.length).fill(0);
  for (let i = 0; i < pattern.length; i++) {
    gp[17 + pattern[i]] = 1;
  }
  testP[0].nSequence = [];
  testP[0].nSequence = gp;
  testP[0].lerp = 0;
  // counter example
  pattern = [];
  patternLength = int(random(3, 7));
  for (let i = 0; i < patternLength; i++) {
    pattern.push(int(random(0, 3)));
    pattern.push(int(random(4, 11)));
    pattern.push(int(random(4, 11)));
    pattern.push(int(random(13, 16)));
    pattern.push(int(random(13, 16)));
    pattern.push(int(random(22, 26)));
  }
  gp = new Array(trainP[0].nSequence.length).fill(0);
  for (let i = 0; i < pattern.length; i++) {
    gp[18 + pattern[i]] = 1;
  }
  testP[1].nSequence = [];
  testP[1].nSequence = gp;
  testP[1].lerp = 0;
  pattern = [];
  for (let j = 3; j < 6; j++) {
    patternLength = int(random(3, 7));
    pattern = [];
    for (let i = 0; i < patternLength; i++) {
      pattern.push(int(random(0, 3)));
      pattern.push(int(random(4, 11)));
      pattern.push(int(random(13, 16)));
      pattern.push(int(random(4, 11)));
      pattern.push(int(random(13, 16)));
      pattern.push(int(random(22, 26)));
    }
    gp = new Array(trainP[0].nSequence.length).fill(0);
    start = int(random(1, 3));
    row = int(random(1, 3));
    start = start + row*8;
    for (let i = 0; i < pattern.length; i++) {
      gp[start + pattern[i]] = 1;
    }
    trainP[j].nSequence = [];
    trainP[j].nSequence = gp;
    trainP[j].isExample = false;
  }
}

function setupData() {
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
  return [inputs, outputs, tests];
}

function setupNN() {
  let inputs = [];
  let outputs = [];
  let tests = [];
  let vals = setupData();
  inputs = vals[0];
  outputs = vals[1];
  tests = vals[2];
  if (myNN === null) {
    console.log('hello');
    let slen = trainP[0].nSequence.length
    let cols = trainP[0].cols
    let aioWindowShape = [];
    for (let i = 0; i < trainP[0].nSequence.length; i++) {
      if (!(i < cols || i > slen - cols - 1 || (i % cols == 0) || (i + 1) % cols == 0)) {
        aioWindowShape.push(i);
      }
    }
    myNN = new NN(inputs, outputs, aioWindowShape, [-cols-1, -cols, -cols+1, -1, 0, 1, cols-1, cols, cols+1]);
  }
  myNN.updateDatas(inputs, outputs);
  if (layer2Weights.length == 0) {
    layer2Weights = myNN.weights;
  }
  return tests
}

function doNN() {
  //setup NN
  let tests = setupNN();
  // run net
  for (let its = 0; its < stepCount; its ++) {
    myNN.step();
    layer2Weights = myNN.weights;
    for (let i = 0; i < tests.length; i++) {
      testP[i].lerp = myNN.ptest(tests[i]);
    }
  }
}

function invertArr(myArr) {
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

function drawWeights(x, y, w, weights, sLength, cols, rows, button = true) {
  if (button) {
    wXmin = x;
    wXmax = x + w * cols;
    wYmin = y;
    wYmax = y + w * rows;;
  } else {
    rwXmin = x;
    rwXmax = x + w * cols;
    rwYmin = y;
    rwYmax = y + w * rows;;
  }
  let x2 = x;
  let norm = [];
  if (weights.length > 0) {
    for (let i = 0; i < weights.length; i++) {
      norm.push(weights[i] - min(weights));
    }
    let nMax = max(norm);
    for (let i = 0; i < norm.length; i++) {
      norm[i] = norm[i] / nMax;
    }
  } else {
    norm = weights;
  }

  for (let i = 0; i < sLength; i++) {
    if (weights.length == 0){
      fill(noColor);
    } else {
      fill(lerpColor(noColor, yesColor, norm[i]));
    }
    square(x2, y, w);
    x2 += w;
    if ((i + 1) % cols == 0){
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
  if (mx > rwXmin && mx < rwXmax && my > rwYmin && my < rwYmax) {
    if (!(myNN === null)) {
      console.log('reset!');
      myNN.resetWeights();
      myNN.child.resetWeights();
      layer2Weights = myNN.weights;
      layer1Weights = myNN.child.weights;
    }
    return false;
  }
  // console.log(mx, my, dXmin, dXmax, dYmin, dYmax);

  if (mx > dXmin && mx < dXmax && my > dYmin && my < dYmax) {
    // setupDemo();
    generateShape();
    return false;
  }

  for (let i = 0; i < generated.length; i++) {
    let gen = generated[i].areaClicked(mx, my);
    if (gen) {
      setupGenerates();
      return false;
    }
  }
  for (let i = 0; i < testP.length; i++){
    stop = testP[i].updateBoxWithClick(mx, my);
    if (stop) {
      testP[i].lerp = 0;
      if (layer2Weights.length > 0) {
        setupNN();
      }

      return false;
    };
  }
  for (let i = 0; i < trainP.length; i++){
    stop = trainP[i].updateIsExampleWithClick(mx, my);
    if (stop) {
      if (layer2Weights.length > 0) {
        setupNN();
      }
      setupGenerates();
      return false;
    };
    stop = trainP[i].updateBoxWithClick(mx, my);
    if (stop) {
      // layer2Weights = [];
      setupGenerates();
      return false;
    };
  }

}

function keyTyped() {
  if (key === 'd') {
    setupDemo();
  } else if (key === 's'){
    let trainPdatas = []
    let trainPoutputs = []
    for (let i = 0; i < trainP.length; i++) {
      trainPdatas.push(trainP[i].nSequence);
      trainPoutputs.push(trainP[i].isExample);
    }
    let testPDatas = [];
    for (let i = 0; i < testP.length; i++) {
      testPDatas.push(testP[i].nSequence);
    }
    let myJSON = [trainPdatas, trainPoutputs, testPDatas];
    save(myJSON, 'demo.json');
  } else if (key == 'g') {
    generateShape();
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
  // console.log(windowWidth);
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

function preload() {
  myDemo = [loadJSON('demo2.json'), loadJSON('demo.json'), loadJSON('demo3.json')] ; //
}

function setup() {
  yesColor = color('#FFFFFF');
  noColor = color('#567DA7');
  myColors = [color('#567DA7'), color('#FFFFFF')];
  textFont('Courier New');
  trainP = [];
  generated = [];
  allGeneratedIn = [];
  allGeneratedOut = [];
  testP = [];
  for (let i = 0; i < numberOfThings; i++) {
    // trainP.push(new NPattern(6, 5));
    // generated.push(new NPattern(6, 5));
    trainP.push(new NPattern(8, 7));
    generated.push(new NPattern(8, 7));
  }
  for (let i = 0; i < 2; i++) {
    // testP.push(new NPattern(6, 5, true));
    testP.push(new NPattern(8, 7, true));
  }
  setupScreen();
  frameRate(10);
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
  text('Click HERE to try a randomly generated example.', x, y);
  textStyle(NORMAL);
  dXmin = x;
  dXmax = x + textWidth('Click HERE to try a randomly generated example.');
  dYmin = y - bigText;
  dYmax = y + bigText;
  y += smallText;
  text('Draw some similar patterns and then some non-patterns in the boxes below.', x, y);
  y += smallText;
  text('Click the rectangle on the left to mark each box:', x, y);
  y += smallText;
  text('A box can hold either a pattern (white) or a non-pattern (blue).', x, y);
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
  text('The computer makes some more patterns:', x, y-10);
  y += smallText;
  text('Moving the source patterns around.', x, y-10);// and flipping the colors.', x, y-10);
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
  text('Click the large WEIGHTS box below to train for ' + stepCount + ' times.', x, y-10);
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
  text('If it didnt work try clicking the WEIGHTS box a few more times.', x, y-10);
  y += smallText;
  text('Click too many times and it will learn to recognise any pattern', x, y-10);
  y += smallText;
  text('Make a different pattern or click the small box to reset the weights.', x, y-10);
  y += smallText;

  text('Training can go "weird" and fixing it is tricky on a web browser.', x, y-10);
}
