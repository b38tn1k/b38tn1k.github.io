
var DEBUG = true;
// DEBUG = false;
// divide, adapte, pre-empt, change property, change material, make efficient, make harmless, save labor

function keyPressed() {
  // chooseIndex();
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
  index -= 1;
  if (index == -1) {
    index += cardslength;
  }
  rCol = shuffleColrs();
}

function shuffleColrs() {
  let c = [color([0, 0, 255]),color([0, 255, 255]),color([0, 255, 0]),color([255, 255, 0]),color([255, 0, 0])];
  let j = [];
  let cl = c.length;
  while (j.length <= cl) {
    for (let k = 0; k < int(random(0, c.length)); k++){
      c.push(c.shift());
    }
    j.push(c.pop());
  }
  return(j);
}

function setupScreen() {
  if (DEBUG) {
    index = order.indexOf(cardslength - 1);
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
  functionList.push(matryoshka);
  functionList.push(antiweight);
  functionList.push(pantiactions);
  functionList.push(preactions);
  functionList.push(beforehandcushioning);
  functionList.push(equipotentiality);
  functionList.push(dothingsbackwards);
  functionList.push(curvature);
  functionList.push(dynamics);
  functionList.push(partialorexcessive);
  functionList.push(anotherdimension);
  functionList.push(vibrations);
  functionList.push(periodicaction);
  functionList.push(continuityofusefulaction);
  functionList.push(skipping);
  functionList.push(harmtobenefit);
  functionList.push(feedback);
  functionList.push(intermediary);
  functionList.push(selfservice);
  functionList.push(copying);
  functionList.push(cheapshort);
  functionList.push(mechanicalsubstitution);
}

function setup() {
  order = [];
  for (let i = 0; i < cardslength; i++){
    order.push(i);
  }
  if (!DEBUG) {
    shuffle(order, true);
  }

  setupScreen();
  textAlign(LEFT, TOP);
  document.body.style.backgroundImage = "url('bg" + str(int(random(0, 5)))+".gif')";
}

function draw() {
  let curr = order[index];
  textAlign(LEFT, TOP);
  clear();
  image(cardDeck, 0, 0);
  image(card, 0, 0);
  fill(0);
  textSize(titleTextSize);
  textStyle(BOLD);
  text(cards[curr]['title'], textX, textY, textW);
  let tTextY = textY + titleTextSize;
  let tL = textWidth(cards[curr]['title']);
  while (tL > textW) {
    tTextY += titleTextSize;
    tL -= textW;
  }
  tTextY += titleTextSize * 0.5;
  textStyle(NORMAL);
  textSize(tTextSize);
  text(cards[curr]['text'], textX, tTextY, textW);
  functionList[curr]();
  fill(220);
  textStyle(BOLD);
  textSize(titleTextSize);
  textAlign(RIGHT, BOTTOM);
  // console.log(index);
  if (curr < 9){
    text("0" + str(curr+1), logoX, logoY);
  } else {
    text(curr + 1, logoX, logoY);
  }
  image(ani, aniX, aniY);
  if (DEBUG){
    fill(0);
    stroke(255);
    strokeWeight(1);
    textAlign(LEFT, TOP);
    text("TESTING", 10, 10);
  }
}

function drawCard() {
  aniLayers = {};
  rCol = shuffleColrs();
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
  titleTextSize = int(h / 17);
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
  gap2 = gap*2;
  gap3 = gap*3;
  gap4 = gap*4;
  gap34 = 0.75*gap;
  gapOn2 = gap/2;
  gapOn3 = gap/3;
  gapOn4 = gap/4;
  gapOn6 = gap/6;
  aniWidthOn2 = ani.width/2;
  aniHeightOn2 = ani.height/2;
  aniWidthOn3 = ani.width/3;
  aniHeightOn3 = ani.height/3;
  aniWidthOn4 = ani.width/4;
  aniHeightOn4 = ani.height/4;
}
