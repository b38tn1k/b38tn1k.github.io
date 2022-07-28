
var DEBUG = true;
// var DEBUG = false;

var widthOnTwo, heightOnTwo;
var card, cardDeck;
var cards, index;
var textX, textY, textW, logoX, logoY;
var cardslength = 6;
var ani, aniX, aniY, cr, icr, gap, igap;
var aniLayers = {};
var titleTextSize = 32;
var tTextSize = 16;
var functionList;
var rCols = [];
var mStroke;

function keyPressed() {
  chooseIndex();
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  chooseIndex();
}

function preload() {
  cards = loadJSON('cards.json');
}

function chooseIndex(){
  let old_index = index;
  while (index == old_index) {
    index = int(random(0, cardslength));
  }
  rCols = threerCols();
}

function threerCols() {
  let c = [color([0, 0, 255]),color([0, 255, 255]),color([0, 255, 0]),color([255, 255, 0]),color([255, 0, 0])];
  let j = [];
  while (j.length < 3) {
    for (let k = 0; k < int(random(0, c.length)); k++){
      c.push(c.shift());
    }
    j.push(c.pop());
  }
  return(j);
}

function setupScreen() {
  if (DEBUG == true) {
    index = cardslength - 1;
  } else {
    chooseIndex();
  }
  createCanvas(windowWidth, windowHeight);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
  drawCard();
  functionList = [];
  functionList.push(segmentation);
  functionList.push(takeout);
  functionList.push(localquality);
  functionList.push(asymmetry);
  functionList.push(merging);
  functionList.push(universality);
}

function setup() {
  setupScreen();
  textAlign(LEFT, TOP);
  document.body.style.backgroundImage = "url('bg" + str(int(random(0, 8)))+".gif')";
}

function draw() {
  textAlign(LEFT, TOP);
  clear();
  image(cardDeck, 0, 0);
  image(card, 0, 0);
  fill(0);
  textSize(titleTextSize);
  text(cards[index]['title'], textX, textY, textW);
  textSize(tTextSize);
  text(cards[index]['text'], textX, textY + (1.5* titleTextSize), textW);
  functionList[index]();
  fill(220);
  textStyle(BOLD);
  textSize(titleTextSize);
  textAlign(RIGHT, BOTTOM);
  if (index < 10){
    text("0" + str(index+1), logoX, logoY);
  } else {
    text(index + 1, logoX, logoY);
  }

  image(ani, aniX, aniY);
  if (DEBUG == true){
    text("DEBUG", 10, 10);
  }
}

function drawCard() {
  rCols = threerCols();
  cardDeck = createGraphics(windowWidth, windowHeight);
  card = createGraphics(windowWidth, windowHeight);
  let y_ratio = 8.8;
  let x_ratio = 6.3;
  let margin = 0.85;
  let h = windowHeight * margin;
  let w = (h / y_ratio) * x_ratio;
  if (w > windowWidth * margin) {
    w = windowWidth * margin;
    h = (w / x_ratio) * y_ratio;
  }
  let rad = 0.05 * w;
  mStroke = rad * 0.25;
  cardDeck.clear();
  cardDeck.rectMode(CENTER);
  cardDeck.noStroke();
  let c = [[0, 0, 255],[0, 255, 255],[0, 255, 0],[255, 255, 0],[255, 0, 0],[255, 255, 255]];
  let px = widthOnTwo + (c.length * mStroke);
  let py = heightOnTwo + (c.length * mStroke);
  for (let i = 0; i < c.length; i++) {
    cardDeck.fill(color(c[i]));
    px -= mStroke;
    py -= mStroke;
    cardDeck.rect(int(px), int(py), w, h, rad);
  }
  card.rectMode(CENTER);
  card.noStroke();
  card.fill(255);
  card.rect(int(px), int(py), w, h, rad);
  card.stroke(0);
  card.strokeWeight(mStroke);
  card.rect(int(px), int(py), w - rad, h - rad, rad * 0.6);
  titleTextSize = int(h / 16);
  tTextSize = int(titleTextSize/2);
  let l1 = px - w * 0.45;
  let l2 = px + w * 0.45;
  card.line(l1, py, l2, py);
  card.noStroke();
  card.fill(230);
  card.textStyle(BOLD);
  card.textSize(0.75*titleTextSize);
  logoX = widthOnTwo + (w/2) - rad - 1.6*titleTextSize;
  logoY = heightOnTwo + (h/2) - rad;
  card.textSize(tTextSize);
  card.text('TRIZ40', logoX , logoY);
  logoY -= tTextSize * 0.5;
  logoX += 1.6*titleTextSize;
  textX = l1;
  textY = py + mStroke;
  textW = 0.9 * w;
  ani = createGraphics(int(w * 0.9), int(h * 0.45));
  aniX = l1;
  aniY = heightOnTwo - int(0.47 * h);
  cr = (ani.height * 0.8);
  icr = (ani.height * 0.2);
  gap = (ani.width - ani.height)/2;
  igap = ani.width - gap;
}

function segmentation() {
  ani.clear();
  ani.noStroke();
  ani.fill(rCols[0]);
  ani.circle(ani.width/2, ani.height/2, cr);
  ani.strokeWeight(mStroke);
  ani.stroke(255, 255, 255, 127.5 + 127.5 * sin(millis() / 300));
  ani.line(ani.width/2, 0, ani.width/2, ani.height);
  ani.line(gap, ani.height/2, ani.width, ani.height/2);
  // ani.line(gap, icr, igap, cr);
  // ani.line(gap, cr, igap, icr);
}

function takeout() {
  ani.clear();
  ani.noStroke();
  ani.fill(rCols[0]);
  let updateValX = abs(gap* sin(millis() / 1000));
  let updateValY = abs(icr/2* sin(millis() / 1000));
  ani.arc(ani.width/2 + updateValX, ani.height/2 - updateValY, cr, cr, 0, HALF_PI);
  ani.fill(rCols[1]);
  ani.arc(ani.width/2 + updateValX, ani.height/2 - updateValY, cr, cr, PI, TWO_PI);
  ani.fill(rCols[2]);
  ani.arc(ani.width/2 - updateValX, ani.height/2 + updateValY, cr, cr, HALF_PI, PI);
}

function localquality() {
  ani.clear();
  ani.strokeWeight(mStroke);
  ani.stroke(0);
  let ltime = int(millis() / 1000); // second and millis not synced?
  let normd = ((millis() % 1000)/1000);
  let pos = (igap - gap) * normd;
  let gOn2 = gap * 0.5;
  if (!('pencil' in aniLayers)){
    aniLayers['pencil'] = createGraphics(gap, 3*gap);
    aniLayers['pencil'].noStroke();
    aniLayers['pencil'].fill(rCols[0]);
    aniLayers['pencil'].triangle(gOn2, 3*gap, 0, 2*gap, gap, 2*gap);
    aniLayers['pencil'].fill(rCols[1]);
    aniLayers['pencil'].rect(0, gap, gap, gap);
    aniLayers['pencil'].fill(rCols[2]);
    aniLayers['pencil'].arc(gOn2, gap, gap, 2*gap, PI, TWO_PI);

    aniLayers['ipencil'] = createGraphics(gap, 3*gap);
    aniLayers['ipencil'].noStroke();
    aniLayers['ipencil'].fill(rCols[0]);
    aniLayers['ipencil'].triangle(gOn2, 0, 0, gap, gap, gap);
    aniLayers['ipencil'].fill(rCols[1]);
    aniLayers['ipencil'].rect(0, gap, gap, gap);
    aniLayers['ipencil'].fill(rCols[2]);
    aniLayers['ipencil'].arc(gOn2, 2*gap, gap, 2*gap, TWO_PI, PI);
  }

  if (ltime % 6 == 0) {
    ani.line(gap, cr, gap + pos, cr);
    ani.image(aniLayers['pencil'], gOn2 + pos, cr - 3*gap);
  } else if (ltime % 6 == 1) {
    ani.line(gap, cr, igap, cr);
    ani.image(aniLayers['pencil'], igap - gOn2, cr - 3*gap);
  } else if (ltime % 6 == 2) {
    ani.line(gap, cr, igap, cr);
    ani.image(aniLayers['ipencil'], igap - gOn2, cr - 3*gap);
  } else if (ltime % 6 == 3) {
    ani.line(gap, cr, igap - pos, cr);
    ani.image(aniLayers['ipencil'], igap - pos - gOn2, cr - 3*gap);
  } else if (ltime % 6 == 4) {
    ani.image(aniLayers['ipencil'], gOn2, cr - 3*gap);
  } else {
    ani.image(aniLayers['pencil'], gOn2, cr - 3*gap);
  }
}

function asymmetry(){
  ani.clear();
  ani.noStroke();
  let start = 0;
  let ltime = int(millis() / 2000);
  let inc = PI/8;
  if (ltime % 2 == 0){
    start = (millis()/1000) * HALF_PI;
  }
  for (let i = 0; i < 17; i++) {
    ani.fill(rCols[i%2]);
    ani.arc(ani.width/2, ani.height/2, cr, cr, start, start+inc);
    start += inc;
  }
  if (ltime % 2 == 1){
    ani.fill(255);
    ani.rect(0, cr, ani.width, ani.height);
  }
  ani.fill(rCols[0]);
  ani.circle(ani.width/2, ani.height/2, icr);
}

function merging(){
  ani.clear();
  ani.stroke(rCols[0]);
  ani.strokeWeight(2 * mStroke);
  let wOn2 = ani.width/2;
  let series = [icr, 2*icr, 3*icr, 4*icr];
  let inc = icr/5;
  let ltime = int(millis() / 500);
  let l2s = wOn2 + gap;
  let l2e = wOn2 + 2*gap;
  let gap2 = 2*gap;
  let move = ltime % 5 - 1;
  let direction = ltime % 10;
  ani.stroke(rCols[2]);
  ani.line(gap, inc, gap, ani.height - inc);
  ani.line(l2s, inc, l2s, ani.height - inc);

  for (let i = 0; i < 4; i++){
    ani.stroke(rCols[0]);
    let flye;
    if (direction <= 4){
      if (i <= move) {
        flye = icr + i * icr + 2*inc;
      } else {
        flye = icr + i * icr;
      }
    } else {
      if (i > move) {
        flye = icr + i * icr + 2*inc;
      } else {
        flye = icr + i * icr;
      }
    }
    ani.line(gap, icr + i * icr, gap2, flye);
    ani.stroke(rCols[1]);
    let lys = icr + i * icr;
    let lye = lys + inc  + inc * (sin(millis() / 300));
    ani.line(l2s, lys, l2e, lye);
  }
}

function universality(){
  ani.clear();
}
// divide, adapte, pre-empt, change property, change material, make efficient, make harmless, save labor
