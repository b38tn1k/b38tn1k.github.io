var myNN = null;
var stepCount = 10;
var layer2Weights = [];
var layer1Weights  = [];
var nnInputWidgetCount = 6;
var trainP = [];
var generated = [];
var allGeneratedIn = [];
var allGeneratedOut = [];
var testP = [];

var myDivStrings;
var myDemos;

var wXmin, wXmax, wYmin, wYmax;
var rwXmin, rwXmax, rwYmin, rwYmax;
var dXmin, dXmax, dYmin, dYMax;

var pixelSize = 10;
var startx = 20;
var wideScreen = false;
var titleHeight;
var myColors, yesColor, noColor;
var firstRun = true;

class NN {
  constructor(inputs, outputs, paddingArr=null, kernelShape=null, fullyConnected=true) {
    this.fullyConnected = fullyConnected;
    this.convLayer = null;
    this.paddingArr = paddingArr;
    this.paddingArrLength = 0;
    if (!(paddingArr === null)) {
      this.paddingArrLength = paddingArr.length;
    }
    this.kernelShape = kernelShape
    this.inputs = inputs;
    this.outputs = outputs;
    this.weights = [];
    this.majorDataLength = inputs[0].length;
    this.dataCount = inputs.length;
    this.failCount = 0;
    for (let i = 0; i < this.majorDataLength; i++) {
      this.weights.push(random(-1, 1));
    }
  }


  updateConvLayerData(){
      if (!this.fullyConnected){
        return false;
      }
      let bInputs = [];
      let bOutputs = [];
      let k, newIn, kInd;
      for (let i = 0; i < this.dataCount; i++) {
        for (let j = 0; j < this.paddingArrLength; j++) {
          k = this.paddingArr[j];
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
      if (this.convLayer === null) {
        this.convLayer = new NN(bInputs, bOutputs, null, null, false);
        // console.log('hello from me too!');
      } else {
        this.convLayer.updateDatas(bInputs, bOutputs);
      }
    }

  updateDatas(inputs, outputs){
    this.inputs = inputs;
    this.outputs = outputs;
    this.updateConvLayerData();
  }

  ptest (input, weights=this.weights) {
    // convert input into convLayer inspected input
    let k, kInd;
    let sum = 0;
    let newIn = [];
    let bInputs = [];
    let convLayerOut = [];
    // console.log(input);
    for (let j = 0; j < this.paddingArrLength; j++) {
      newIn = [];
      k = this.paddingArr[j];
      for (let h = 0; h < this.kernelShape.length; h++) {
        kInd = k + this.kernelShape[h];
        newIn.push(input[kInd]);
      }
      bInputs.push(newIn);
    }
    for (let i = 0; i < bInputs.length; i++) {
      convLayerOut.push(this.convLayer.test(bInputs[i]));
    }
    let _input = new Array(this.majorDataLength).fill(0);
    for (let j = 0; j < this.paddingArrLength; j++) {
      k = this.paddingArr[j]
      _input[k] = convLayerOut[j];
    }
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
    let tOut, _inp, k;
    let _inputs = [];
    let offset = 0;
    if (this.fullyConnected) {
      for (let i = 0; i < 10; i++) {
        this.convLayer.step();
      }
      let convLayerOut = this.convLayer.guess(this.convLayer.inputs);
      // update the fullyConnected inputs with the convLayer guesses
      for (let i = 0; i < this.dataCount; i++) {
        _inp = new Array(this.majorDataLength).fill(0);
        for (let j = 0; j < this.paddingArrLength; j++) {
          k = this.paddingArr[j]
          _inp[k] = convLayerOut[j + offset];
        }
        offset += this.paddingArrLength;
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
    let c = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < this.dataCount; i++) {
      if (this.outputs[i] == 1) {
        c[0] += 1;
        c[1] += tOut[i];
      } else {
        c[3] += 1;
        c[4] += tOut[i];
      }
    }
    c[2] = c[1] / c[0];
    c[5] = c[4] / c[3];
    if (c[5] > c[2]) {
      this.failCount += 1;
    }
    if (this.failureCount > 50) {
      this.failCount = 0;
      console.log('ahh');
      this.resetWeights();
    }
  }
}

class NPattern {
  constructor(rows, cols, isTest=false) {
    this.rows = rows;
    this.cols = cols;
    this.nSeqLength = rows * cols;
    this.nSequence = new Array(this.nSeqLength).fill(0);
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
    side = new Array(this.cols).fill(0);
    end = this.nSequence.slice(this.cols);
    combined = end.concat(side);
    alts.push(combined);
    if (this.isExample) {
      side = new Array(this.cols).fill(0);
      end = combined.slice(this.cols);
      combined = end.concat(side);
      alts.push(combined);
    }
    // move down
    combined = [];
    side = new Array(this.cols).fill(0);
    end = this.nSequence.slice(0, -1 * this.cols);
    combined = side.concat(end);
    alts.push(combined);
    if (this.isExample) {
      side = new Array(this.cols).fill(0);
      end = combined.slice(0, -1 * this.cols);
      combined = side.concat(end);
      alts.push(combined);
    }
    //move left
    combined = [];
    for (let i = 1; i < this.nSeqLength; i+= 1) {
      combined.push(this.nSequence[i]);
    }
    combined.push(0);
    for (let i = this.cols-1; i < this.nSeqLength; i+= this.cols) {
      combined[i] = 0;
    }
    alts.push(combined);
    if (this.isExample) {
      end = []
      for (let i = 1; i < this.nSeqLength; i+= 1) {
        end.push(combined[i]);
      }
      end.push(0);
      for (let i = this.cols-1; i < this.nSeqLength; i+= this.cols) {
        end[i] = 0;
      }
      alts.push(end);
    }
    //move right
    combined = [0];
    for (let i = 0; i < this.nSeqLength-1; i+= 1) {
      combined.push(this.nSequence[i]);
    }
    for (let i = 0; i < this.nSeqLength; i+= this.cols) {
      combined[i] = 0;
    }
    alts.push(combined);
    if (this.isExample) {
      end = [0];
      for (let i = 0; i < this.nSeqLength-1; i+= 1) {
        end.push(combined[i]);
      }
      for (let i = 0; i < this.nSeqLength; i+= this.cols) {
        end[i] = 0;
      }
      alts.push(end);
    }

    for (let i = 0; i < 3; i++) {
      combined = [...this.nSequence];
      let pos = int(random(combined.length))
      if (combined[pos] == 0){
        combined[pos] = 1;
      } else {
        combined[pos] = 0;
      }
      alts.push(combined);
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
        // if (i % this.cols == 0) {
        //   fill(0);
        // }
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
      rect(egX, egY, w, egH);
      fill(noColor);
      noStroke();
      textSize(pixelSize);
      text('Similarity:\n' + int(this.lerp * 100).toPrecision(3) + '%', x, y + 1.5*w);
      stroke(0);
    } else {
      if (this.isExample) {
        fill(yesColor);
      } else {
        fill(noColor);
      }
      rect(egX, egY, w, egH);
    }
    this.majorHitBox[1] = egX;
    this.majorHitBox[3] = y;
    y -= w;
    this.egHitBox = [egX, egX + w, egY, egY + egH];

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
  resetWeights();
  let rc = int(random(0, myDemos.length));
  if (firstRun) {
    rc = 2; //best foor forward :-P
    firstRun = false;
  }
  // rc = 0;
  for (let i = 0; i < trainP.length; i++) {
    trainP[i].nSequence = myDemos[rc][0][i];
    trainP[i].isExample = myDemos[rc][1][i];
  }
  for (let i = 0; i < testP.length; i++) {
    testP[i].nSequence = myDemos[rc][2][i];
    testP[i].lerp = 0;
  }
  setupGenerates();
}

function generateShape() { // this bit is gross too
  resetWeights();
  let gp, start, row;
  let noise = 0
  let patternLength = int(random(2, 4));
  let pattern = [0];
  // training examples
  for (let i = 0; i < patternLength; i++) {
    pattern.push(int(random(0, 2)));
    pattern.push(int(random(5, 11)));
    pattern.push(int(random(13, 16)));
  }
  for (let i = 0; i < 3; i++) {
    gp = new Array(trainP[0].nSequence.length).fill(0);
    start = int(random(1, 2));
    start = start + (i+2)*8 - 1;
    for (let j = 0; j < pattern.length; j++) {
      gp[start + pattern[j]] = 1;
    }
    for (let j = 0; j < i; j++) {
      noise = int(random(8, 48));
      while (noise % 7 == 0 || noise % 6 == 0) {
        noise = int(random(8, 48));
      }
      gp[noise] = 1;
    }
    trainP[i].nSequence = [];
    trainP[i].nSequence = gp;
    trainP[i].isExample = true;
  }
  // test example
  gp = new Array(trainP[0].nSequence.length).fill(0);
  for (let j = 0; j < pattern.length; j++) {
    gp[17 + pattern[j]] = 1;
  }
  testP[0].nSequence = [];
  testP[0].nSequence = gp;
  testP[0].lerp = 0;
  // test counter example
  for (let i = 3; i < 6; i++) {
    pattern = [];
    for (let j = 0; j < patternLength; j++) {
      pattern.push(int(random(-1, 3)));
      pattern.push(int(random(6, 11)));
      pattern.push(int(random(6, 11)));
      pattern.push(int(random(7, 12)));
      pattern.push(int(random(14, 17)));
    }
    gp = new Array(trainP[0].nSequence.length).fill(0);
    start = int(random(1, 3));
    row = int(random(1, 3));
    start = start + row*8;
    for (let j = 0; j < pattern.length; j++) {
      gp[start + pattern[j]] = 1;
    }
    for (let j = 0; j < i; j++) {
      noise = int(random(8, 48));
      while (noise % 7 == 0 || noise % 6 == 0) {
        noise = int(random(8, 48));
      }
      gp[noise] = 1;
    }
    trainP[i].nSequence = [];
    trainP[i].nSequence = gp;
    trainP[i].isExample = false;
  }
  let selector = int(random(3, 6));
  testP[1].nSequence = [...trainP[selector].nSequence];
  let pos = int(random(testP[1].nSequence.length))
  if (testP[1].nSequence[pos] == 0){
    testP[1].nSequence[pos] = 1;
  } else {
    testP[1].nSequence[pos] = 0;
  }
  testP[1].lerp = 0;
  setupGenerates();
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
    // console.log('hello');
    let slen = trainP[0].nSequence.length
    let cols = trainP[0].cols
    let aiopaddingArr = [];
    for (let i = 0; i < trainP[0].nSequence.length; i++) {
      if (!(i < cols || i > slen - cols - 1 || (i % cols == 0) || (i + 1) % cols == 0)) {
        aiopaddingArr.push(i);
      }
    }
    myNN = new NN(inputs, outputs, aiopaddingArr, [-cols-1, -cols, -cols+1, -1, 0, 1, cols-1, cols, cols+1]);
  }
  myNN.updateDatas(inputs, outputs);
  if (layer2Weights.length == 0) {
    layer2Weights = myNN.weights;
  }
  return tests
}

function doNN(_stepCount = stepCount) {
  setupGenerates();
  //setup NN
  let tests = setupNN();
  // run net
  for (let its = 0; its < _stepCount; its ++) {
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

function resetWeights() {
  if (!(myNN === null)) {
    console.log('reset!');
    myNN.resetWeights();
    myNN.convLayer.resetWeights();
    layer2Weights = [];
    layer1Weights = [];
  }
  testP[0].lerp = 0;
  testP[1].lerp = 0;
}

function mousePressed() {
  mx = mouseX;
  my = mouseY;
  let stop = false;
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
    return false;
  } else if (key == 'r') {
    doNN();
  } else if (key == 'q') {
    resetWeights();
  }
  return false;
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function preload() {
  myDemos = [loadJSON('demo2.json'), loadJSON('demo.json'), loadJSON('demo3.json'), loadJSON('demo4.json')];
  myDivStrings = loadJSON('htmlStrings.json');
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
  for (let i = 0; i < nnInputWidgetCount; i++) {
    // trainP.push(new NPattern(6, 5));
    // generated.push(new NPattern(6, 5));
    trainP.push(new NPattern(8, 7));
    generated.push(new NPattern(8, 7));
  }
  for (let i = 0; i < 2; i++) {
    // testP.push(new NPattern(6, 5, true));
    testP.push(new NPattern(8, 7, true));
  }
  introDiv = createDiv(myDivStrings.intro);
  tutorialDiv = createDiv(myDivStrings.tutorial);
  generatesDiv = createDiv(myDivStrings.generated);
  testDiv = createDiv(myDivStrings.test);
  weightsDiv = createDiv(myDivStrings.weights);
  conclusionDiv = createDiv(myDivStrings.conclusion);
  setupScreen();
  frameRate(10);
}


let introDiv;
let tutorialDiv;
let generatesDiv;
let testDiv;
let weightsDiv;
let conclusionDiv;

function showTutorialDiv(){
  wideScreen = false;
  tutorialDiv.show();
  introDiv.hide();
  generatesDiv.hide();
  testDiv.hide();
  weightsDiv.hide();
  conclusionDiv.hide();
}

function hideTutorialDiv() {
  wideScreen = (windowWidth / windowHeight > 1.5);
  tutorialDiv.hide();
  introDiv.show();
  generatesDiv.show();
  testDiv.show();
  weightsDiv.show();
  conclusionDiv.show();
}

function setupScreen(){
  createCanvas(windowWidth, windowHeight);
  wideScreen = (windowWidth / windowHeight > 1.6);
  let divWidth = 56;

  if (wideScreen) {
    pixelSize = min(windowHeight / 56, windowWidth / 28);
    divWidth = (windowWidth/2 - 4*pixelSize)/pixelSize;

  } else {
    pixelSize = min(windowHeight / 96, windowWidth / 56);
  }
  startx = min(20, 3* pixelSize);
  let smallText = 1.2*pixelSize;

  let title = createDiv(myDivStrings.title);
  title.style('font-family', "'courier new', courier");
  titleHeight = title.size()['height'];
  title.remove();

  introDiv.remove();
  introDiv = createDiv(myDivStrings.intro);
  introDiv.position(startx-pixelSize, 0);
  introDiv.size(pixelSize * divWidth);
  introDiv.style('font-size', smallText + 'px');
  introDiv.style('font-family', "'courier new', courier");
  introDiv.show();
  tutorialDiv.remove();
  tutorialDiv = createDiv(myDivStrings.tutorial);
  tutorialDiv.position(startx-pixelSize, 0);
  tutorialDiv.hide();
  tutorialDiv.size(pixelSize * divWidth, windowHeight);
  tutorialDiv.style('background-color', 'white');
  tutorialDiv.style('padding', '1em');
  tutorialDiv.style('font-size', smallText + 'px');
  tutorialDiv.style('font-family', "'courier new', courier");
  generatesDiv.remove();
  generatesDiv = createDiv(myDivStrings.generated);
  generatesDiv.style('font-size', smallText + 'px');
  generatesDiv.style('font-family', "'courier new', courier");
  generatesDiv.size(pixelSize * divWidth);
  generatesDiv.show();
  testDiv.remove();
  testDiv = createDiv(myDivStrings.test);
  testDiv.style('font-size', smallText + 'px');
  testDiv.style('font-family', "'courier new', courier");
  testDiv.size(pixelSize * divWidth);
  testDiv.show();
  weightsDiv.remove();
  weightsDiv = createDiv(myDivStrings.weights);
  weightsDiv.style('font-size', smallText + 'px');
  weightsDiv.style('font-family', "'courier new', courier");
  weightsDiv.size(pixelSize * divWidth);
  weightsDiv.show();
  conclusionDiv.remove();
  conclusionDiv = createDiv(myDivStrings.conclusion);
  conclusionDiv.style('font-size', smallText + 'px');
  conclusionDiv.style('font-family', "'courier new', courier");
  conclusionDiv.size(pixelSize * divWidth);
  conclusionDiv.show();
}

function drawNPatterns(x, y, pixelSize) {
  stroke(0);
  for (let i = 0; i < trainP.length; i++) {
    trainP[i].drawPattern(x, y, pixelSize);
    x += (trainP[i].cols) * pixelSize;
  }
  y += (trainP[0].rows - 2) * pixelSize;
  return y;
}

function drawGenPatterns(x, y, pixelSize){
  stroke(0);
  for (let i = 0; i < generated.length; i++) {
    generated[i].drawPattern(x, y, pixelSize);
    x += (generated[i].cols) * pixelSize;
  }
  x = startx;
  y += (trainP[0].rows -2) * pixelSize;
  return y;
}

function drawTestPatterns(x, y, pixelSize) {
  stroke(0);
  for (let i = 0; i < testP.length; i++) {
    testP[i].drawPattern(x, y, pixelSize);
    x += (testP[i].cols) * pixelSize;
  }
  y += (trainP[0].rows + 0.5) * pixelSize;
  return y;
}

function drawWeightPatterns(x, y, pixelSize) {
  stroke(0);
  drawWeights(x, y, pixelSize, layer2Weights, trainP[0].nSequence.length, trainP[0].cols, trainP[0].rows);
  drawWeights(wXmax + pixelSize, wYmax - 3 * pixelSize, pixelSize, layer1Weights, 9, 3, 3, false);
  y += (trainP[0].rows ) * pixelSize;
  return y;
}


function draw() {
  background(255);
  let y = drawNPatterns(startx, introDiv.size()['height'], pixelSize);

  generatesDiv.position(startx-pixelSize, y);

  y = drawGenPatterns(startx, generatesDiv.size()['height'] + y, pixelSize);

  testDiv.position(startx-pixelSize, y);

  y = drawTestPatterns(startx, testDiv.size()['height'] + y, pixelSize);

  let x = 0;
  if (wideScreen) {
    y = titleHeight;
    x += windowWidth/2;
    line(x - pixelSize, 0, x - pixelSize, windowHeight);

  }

  weightsDiv.position(x + startx-pixelSize, y);

  y = drawWeightPatterns(x + startx, weightsDiv.size()['height'] + y, pixelSize);
  conclusionDiv.position(x + startx-pixelSize, y);
}
