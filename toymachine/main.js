var tPatts = [];
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

class InputPattern {
  constructor(pattern = [0, 0, 0, 0]) {
    this.numberPattern = pattern;
    this.clicks = [];
    this.exampleToggle = [];
    this.example = false;
  }

  drawPattern(x, y, w, b) {
    rectMode(CENTER);
    let minx, maxx, miny, maxy;
    let w2 = w / 2.0;
    this.clicks = [];
    for (let i = 0; i < this.numberPattern.length; i++) {
      fill(myColors[this.numberPattern[i]]);
      square(x, y, w);
      this.clicks.push([x - w2, x + w2, y - w2, y + w2]);
      x += b;
    }
    if (this.example) {
      fill(yesColor);
    } else {
      fill(noColor);
    }
    this.exampleToggle = [x - w2, x + w2, y - w2, y + w2];
    circle(x, y, w)
  }
}

function mousePressed() {
  mx = mouseX;
  my = mouseY;
  for (let i = 0; i < tPatts.length; i++){
    if (mx > tPatts[i].exampleToggle[0] && mx < tPatts[i].exampleToggle[1]) {
      if (my > tPatts[i].exampleToggle[2] && my < tPatts[i].exampleToggle[3]) {
        tPatts[i].example = !tPatts[i].example;
        return false;
      }
    }
    for (let j = 0; j < tPatts[i].numberPattern.length; j++) {
      if (mx > tPatts[i].clicks[j][0] && mx < tPatts[i].clicks[j][1]) {
        if (my > tPatts[i].clicks[j][2] && my < tPatts[i].clicks[j][3]) {
          tPatts[i].numberPattern[j] += 1;
          if (tPatts[i].numberPattern[j] >= tPatts[i].numberPattern.length){
            tPatts[i].numberPattern[j] = 0;
          }
          return false;
        }
      }
    }
  }
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function setupScreen(){
  // scratchNet();
  createCanvas(windowWidth, windowHeight);
  // let ratio = windowWidth / windowHeight;
  for (let i = 0; i < 6; i++) {
    tPatts.push(new InputPattern());
  }
}

function preload() {

}

function setup() {
  yesColor = color('#00F0B5');
  noColor = color('#FF3E41');
  myColors = [color('#F61067'), color('#5E239D') , color('#FFD166'), color('#118AB2')];
  setupScreen();
  frameRate(10);
}

function draw() {
  let pattsY = 30;
  for (let i = 0; i < tPatts.length; i++) {
    tPatts[i].drawPattern(30, pattsY, 20, 25);
    pattsY += 30;
  }

}
