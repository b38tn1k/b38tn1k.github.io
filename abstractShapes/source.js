var docWidth = 2550;
var docHeight = 3300;
var pg;
var mainDiv;
var generateButton;
var saveImageButton;


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
  createCanvas(windowWidth, windowHeight);
  mainDiv.size(min(200, 0.25 * windowWidth));
  mainDiv.position(10, windowHeight - (mainDiv.height + 20));
  generateArt();
}

function cleanCanvases() {
  var canvases = document.getElementsByTagName('canvas');
  var toRemove = [];
  for (let i = 0; i < canvases.length; i++) {
    if (canvases[i].id.includes('default') != true) {
      toRemove.push(canvases[i]);
    }
  }
  console.log(canvases.length, toRemove.length);
  for (let i = 0; i < toRemove.length; i++) {
    toRemove[i].remove();
  }
}

function generateArt(){
  cleanCanvases();
  pg = initPage();
  pg.background(255);
  // backgrounds
  let backgroundChoice = floor(random() * 4);
  let radnDim;
  let mt;
  backgroundChoice = floor(random(3));
  // backgroundChoice = 3;
  switch(backgroundChoice) {
    case 0:
      let tile = squiggleTile(random([250, 300, 350, 400, 450, 500]));
      tile = vSymmetrise(tile);
      tile = hSymmetrise(tile);
      tileFill(pg, tile);
      delete(tile);
      break;
    case 1:
      radnDim = random([250, 300, 350, 400, 450, 500]);
      mt = createGraphics(radnDim, radnDim);
      maze(mt);
      mt = vSymmetrise(mt);
      mt = hSymmetrise(mt);
      tileFill(pg, mt);
      delete(mt);
      break;
    case 2:
      radnDim = random([250, 300, 350, 400, 450, 500]);
      mt = createGraphics(radnDim, radnDim);
      mandala1(mt, mt, mt.width/2, mt.width/2, false, true);
      tileFill(pg, mt);
      delete(mt);
      break;
    case 3:
      radnDim = random([250, 300, 350, 400, 450, 500]);
      mt = createGraphics(radnDim, radnDim, WEBGL);

      tileFill(pg, mt);
      delete(mt);
      break;
  }

  // foregrounds
  let foregroundChoice = floor(random() * 4);
  let temp, temp2;
  switch(foregroundChoice) {
    case 0:
      medallion(pg);
      temp = initPage();
      mandala1(pg, temp, docWidth/2, docHeight/2);
      delete(temp);
      temp = createGraphics(3*docWidth/4, 3*docWidth/4);
      mandala1(pg, temp, docWidth/2, docHeight/2);
      delete(temp);
      temp = createGraphics(docWidth/2, docWidth/2);
      mandala1(pg, temp, docWidth/2, docHeight/2);
      delete(temp);
      break;
    case 1:
      temp = createGraphics(docHeight/2, docHeight/2);
      medallion(temp);
      addMultiples(pg, temp, [[0.5, 3/16], [0.5, 13/16], [0.5, 0.5]]);
      delete(temp);
      temp = createGraphics(docHeight/4, docHeight/4);
      temp2 = createGraphics(docHeight/4, docHeight/4);
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.5, 3/16], [0.5, 13/16]]);
      temp.clear();
      temp2.clear();
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.5, 0.5]]);
      delete(temp);
      delete(temp2);
      temp = createGraphics(docHeight/5, docHeight/5);
      temp2 = createGraphics(docHeight/5, docHeight/5);
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.5, 3/16], [0.5, 13/16]]);
      temp.clear();
      temp2.clear();
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.5, 0.5]]);
      delete(temp);
      delete(temp2);
      break;
    case 2:
      temp = createGraphics(docHeight/4, docHeight/4);
      medallion(temp);
      addMultiples(pg, temp, [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]]);
      delete(temp);
      temp = createGraphics(docHeight/4, docHeight/4);
      temp2 = createGraphics(docHeight/4, docHeight/4);
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]]);
      delete(temp);
      delete(temp2);
      temp = createGraphics(docHeight/6, docHeight/6);
      temp2 = createGraphics(docHeight/6, docHeight/6);
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]]);
      temp = createGraphics(docHeight/2, docHeight/2);
      medallion(temp);
      addMultiples(pg, temp, [[0.5, 0.5]]);
      temp.clear();
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.5, 0.5]]);
      delete(temp);
      temp = createGraphics(docHeight/4, docHeight/4);
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.5, 0.5]]);
      delete(temp);
      delete(temp2);
      break;
    case 3:
      temp = createGraphics(docHeight, docHeight);
      temp2 = createGraphics(docHeight, docHeight);
      medallion(temp);
      addMultiples(pg, temp, [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]);
      delete(temp);
      delete(temp2);
      temp = createGraphics(docWidth, docWidth);
      temp2 = createGraphics(docWidth, docWidth);
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]);
      temp.clear();
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]);
      delete(temp);
      delete(temp2);
      temp = createGraphics(3*docWidth/4, 3*docWidth/4);
      temp2 = createGraphics(3*docWidth/4, 3*docWidth/4);
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]);
      delete(temp);
      temp = createGraphics(docHeight/2, docHeight/2);
      medallion(temp);
      addMultiples(pg, temp, [[0.5, 0.5]]);
      temp.clear();
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.5, 0.5]]);
      delete(temp);
      temp = createGraphics(docHeight/4, docHeight/4);
      mandala1(temp2, temp, 0, 0);
      addMultiples(pg, temp, [[0.5, 0.5]]);
      delete(temp);
      delete(temp2);
      break;
  }

  delete(temp);
  delete(temp2);

  //finalise
  border();
  showPage();
  cleanCanvases();
}


function setup() {
  mainDiv = createDiv('Abstract Shape Maker');
  mainDiv.style('background', 'white');
  mainDiv.style('padding', '10px');
  mainDiv.html('<br>',true);

  generateButton = createButton('Generate');
  generateButton.parent(mainDiv);
  generateButton.mousePressed(generateArt);
  mainDiv.html('<br>',true);

  saveImageButton = createButton('Save');
  saveImageButton.mousePressed(dl);
  saveImageButton.parent(mainDiv);
  setupScreen();
}

function draw() {

}
