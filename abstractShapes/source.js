var docWidth = 2550;
var docHeight = 3300;
var pg;
var mainDiv;
var generateButton;
var saveImageButton;
var font;
var font2;


function keyPressed() {
  if (key == ' ') {
    setupScreen();
  }
  if (key == 's') {
    dl();
  }
}

function dl() {
  var img = createImage(pg.width, pg.height);
  img.copy(pg, 0, 0, pg.width, pg.height, 0, 0, pg.width, pg.height);
  img.save('pattern', 'png');
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function setupScreen() {
  setAttributes('antialias', true);
  setAttributes('context', 'willReadFrequently');
  createCanvas(windowWidth, windowHeight);
  mainDiv.size(min(200, 0.25 * windowWidth));
  mainDiv.position(10, windowHeight - (mainDiv.height));
  generateArt();
}

function generateArt() {
  cleanCanvases();
  pg = initPage();
  pg.background(255);
  // backgrounds
  let backgroundChoice = floor(random() * 4);
  switch (backgroundChoice) {
    case 0:
      squigBG();
      break;
    case 1:
      mazeBG();
      break;
    case 2:
      miniMandalasBG()
      break;
    case 3:
      fontIconCheat(random([font, font2]));
      break;
  }
  // foregrounds
  let foregroundChoice = floor(random() * 4);
  switch (foregroundChoice) {
    case 0:
      frontNCenterFG();
      break;
    case 1:
      threeInAColFG();
      break;
    case 2:
      surroundedSmallFG();
      break;
    case 3:
      surroundedLargeFG();
      break;
    case 4:
    // medallion(pg);
  }
  //finalise
  border();
  showPage();
  cleanCanvases();
}

function preload() {
  font = loadFont('Kalocsai_Flowers.ttf');
  font2 = loadFont('dingbatcobogo.ttf');
}

function setup() {
  mainDiv = createDiv('Abstract Shape Maker');
  mainDiv.style('background', 'white');
  mainDiv.style('padding', '10px');
  mainDiv.html('<br>', true);

  generateButton = createButton('Generate');
  generateButton.parent(mainDiv);
  generateButton.mousePressed(generateArt);
  mainDiv.html(' ', true);

  saveImageButton = createButton('Save');
  saveImageButton.mousePressed(dl);
  saveImageButton.parent(mainDiv);
  setupScreen();
}

function draw() {

}
