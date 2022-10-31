var myText, textDiv, scrollThresh, scrollIncrement;
var drawn = false;

var swaps = {};
swaps['warehouse'] = ['building', 'construction', 'structure', 'factory'];
swaps['asphalt'] = ['bitumen', 'dirt', 'tar'];
swaps['large'] = ['massive'];
swaps['stopped'] = ['paused'];
swaps['single'] = ['lone', 'solitary'];
swaps['met'] = ['greeted'];
swaps['nervous'] = ['anxious'];
swaps['excited'] = ['impatient'];
swaps['maps take'] = ['nav takes', 'maps send', 'nav sends'];
swaps['building'] = ['warehouse'];
swaps['warmer'] = ['hotter'];
swaps['2 years'] = ['3 years', '4 years', '1 year'];
swaps['share house'] = ['co-op'];
swaps['system'] = ['demo'];
swaps['show'] = ['take'];
swaps['built'] = ['created', 'made', 'achieved'];
swaps['worn'] = ['cheap'];
swaps['navigate'] = ['explore'];
swaps['universe'] = ['world'];
swaps['boring'] = ['dull'];
swaps['speck'] = ['ray'];
swaps['dizzy'] = ['disorientated'];
swaps['looked like'] = ['appeared as'];
swaps['all the others'] = ['nothing special'];
swaps['a partially collapsed'] = ['an ancient'];
swaps['gate hung'] = ['gate swung'];
swaps['slight breeze'] = ['breeze'];
swaps['recent addition'] = ['new addition'];
swaps['potholes'] = ['puddles'];
swaps['small front door'] = ['main entrance'];
swaps['steel'] = ['metal'];
swaps['difficult'] = ['hard'];
swaps['slightly'] = ['moderately'];
swaps['yellow'] = ['red', 'green', 'orange', 'grey',  'black'];
swaps['blue'] = ['green', 'pink', 'orange', 'white'];
swaps['and got'] = ['and found'];

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function preload() {
  let strg = loadStrings('OG.txt');
  myText = strg;
}

function mutated() {
  let newText = myText;
  let myKeys = Object.keys(swaps);
  for (let i = 0; i < 10; i++) {
    let rval = int(random(0, myKeys.length));
    let target = myKeys[rval]
    let replacement = random(swaps[myKeys[rval]]);
    let res = newText.replace(target, replacement);
    newText = res;
  }

  return newText;
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  dim = windowWidth / 100;
  clear();
  textDiv.remove();
  textDiv = createDiv();
  textDiv.html(myText);
  textDiv.position(0, 0);
  textDiv.addClass('myText');
  textDiv.html(myText);
  scrollIncrement = textDiv.elt.scrollHeight - windowHeight;
  scrollThresh = scrollIncrement;
  stroke('#00FF41');
  fill('#00FF41');
  strokeWeight(pixelDensity()*2);
  // console.log(textDiv.elt.scrollHeight, textDiv.elt.scrollTop, textDiv.elt.scrollHeight - windowHeight)
}

function setup() {
  textDiv = createDiv();
  myText = myText[0];
  setupScreen();
}

function draw() {
  if (textDiv.elt.scrollTop > scrollThresh) {
    scrollThresh += scrollIncrement;
    let newText = mutated();
    textDiv.html(newText, true);
  }
  background(lerpColor(color('#000000'), color('#00FF41'), textDiv.elt.scrollTop/20000));
  for (let i = 0; i < textDiv.elt.scrollTop/50; i++) {
    let px = random(0, windowWidth);
    let py = random(0, windowHeight);
    point(px, py);
  }
}
