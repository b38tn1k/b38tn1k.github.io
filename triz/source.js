
var widthOnTwo, heightOnTwo;
var card, cardDeck;
var cards, index;
var textX, textY, textW;
var cardslength = 3;
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

function segmentation() {
  ani.clear();
  ani.noStroke();
  ani.fill(rCols[0]);
  ani.circle(ani.width/2, ani.height/2, cr);
  ani.strokeWeight(mStroke);
  ani.stroke(255, 255, 255, 127.5 + 127.5 * sin(millis() / 600));
  ani.line(ani.width/2, 0, ani.width/2, ani.height);
  ani.line(gap, ani.height/2, ani.width, ani.height/2);
  ani.line(gap, icr, igap, cr);
  ani.line(gap, cr, igap, icr);
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

function setupScreen() {
  chooseIndex();
  createCanvas(windowWidth, windowHeight);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
  drawCard();
  functionList = [];
  functionList.push(segmentation);
  functionList.push(takeout);
  functionList.push(localquality);
}

function drawCard() {
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
  let l1 = px - w * 0.45;
  let l2 = px + w * 0.45;
  card.line(l1, py, l2, py);
  textX = l1;
  textY = py + mStroke;
  textW = 0.9 * w;
  ani = createGraphics(int(w * 0.9), int(h * 0.45));
  aniX = l1;
  aniY = heightOnTwo - int(0.47 * h);
  titleTextSize = int(h / 16);
  tTextSize = int(titleTextSize/2);
  cr = (ani.height * 0.8);
  icr = (ani.height * 0.2);
  gap = (ani.width - ani.height)/2;
  igap = ani.width - gap;
}

function setup() {
  setupScreen();
  textAlign(LEFT, TOP);
  newInfo = true;
}

function draw() {
  clear();
  image(cardDeck, 0, 0);
  image(card, 0, 0);
  textSize(titleTextSize);
  text(cards[index]['title'], textX, textY, textW);
  textSize(tTextSize);
  text(cards[index]['text'], textX, textY + (1.5* titleTextSize), textW);
  functionList[index]();
  image(ani, aniX, aniY);

}

// divide, adapte, pre-empt, change property, change material, make efficient, make harmless, save labor
