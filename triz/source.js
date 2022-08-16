
var DEBUG = true;
// DEBUG = false;
// divide, adapte, pre-empt, change property, change material, make efficient, make harmless, save labor

var widthOnTwo, heightOnTwo;
var card, cardDeck;
var cards, index, order;
var textX, textY, textW, logoX, logoY;
var cardslength = 27;
var ani, aniX, aniY, cr, icr, gap, igap, gap2, gap3, gap4, gap34, gapOn2, gapOn3, gapOn4, gapOn6, aniWidthOn2, aniHeightOn2, aniWidthOn3, aniHeightOn3, aniWidthOn4, aniHeightOn4;
var aniLayers = {};
var titleTextSize = 32;
var tTextSize = 16;
var functionList;
var rCol = [];
var mStroke;

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

function segmentation() {
  ani.clear();
  ani.noStroke();
  ani.fill(rCol[0]);
  let start = 0;
  let inc = HALF_PI;
  let g4 = gap/6;
  let ofs = g4 + g4 * sin(millis() / 700);
  ani.arc(aniWidthOn2 + ofs, aniHeightOn2 + ofs, cr, cr, start, start+inc);
  start += inc;
  ani.arc(aniWidthOn2 - ofs, aniHeightOn2 + ofs, cr, cr, start, start+inc);
  start += inc;
  ani.arc(aniWidthOn2 - ofs, aniHeightOn2 - ofs, cr, cr, start, start+inc);
  start += inc;
  ani.arc(aniWidthOn2 + ofs, aniHeightOn2 - ofs, cr, cr, start, start+inc);
  start += inc;
}

function takeout() {
  ani.clear();
  ani.noStroke();
  ani.fill(rCol[0]);
  let updateValX = abs(gap* sin(millis() / 1000));
  let updateValY = abs(icr/2* sin(millis() / 1000));
  ani.arc(aniWidthOn2 + updateValX, aniHeightOn2 - updateValY, cr, cr, 0, HALF_PI);
  ani.fill(rCol[1]);
  ani.arc(aniWidthOn2 + updateValX, aniHeightOn2 - updateValY, cr, cr, PI, TWO_PI);
  ani.fill(rCol[2]);
  ani.arc(aniWidthOn2 - updateValX, aniHeightOn2 + updateValY, cr, cr, HALF_PI, PI);
}

function localquality() {
  ani.clear();
  ani.strokeWeight(mStroke);
  ani.stroke(0);
  let ltime = int(millis() / 1000); // second and millis not synced?
  let normd = ((millis() % 1000)/1000);
  let pos = (igap - gap) * normd;
  if (!('pencil' in aniLayers)){
    // aniLayers['pencil'] = createGraphics(gap, gap3);
    // aniLayers['pencil'].stroke(0);
    // aniLayers['pencil'].fill(rCol[0]);
    // let x1 = gapOn2; let y1 = gap3; let x2 = 0; let y2 = gap2; let x3 = gap; let y3 = gap2;
    // aniLayers['pencil'].triangle(x1, y1, x2, y2, x3, y3);
    // aniLayers['pencil'].fill(0);
    // aniLayers['pencil'].triangle(x1, y1, gapOn2 - gapOn6, gap2 + gap34, gapOn2 + gapOn6, gap2 + gap34);
    // aniLayers['pencil'].fill(rCol[1]);
    // aniLayers['pencil'].rect(0, gap, gapOn3, gap);
    // aniLayers['pencil'].rect(gapOn3, gap, gapOn3, gap);
    // aniLayers['pencil'].rect(gapOn3*2, gap, gapOn3, gap);
    // aniLayers['pencil'].fill(245, 161, 157); // eraser
    // aniLayers['pencil'].arc(gapOn2, gap, gap, gap2 * 0.97, PI, TWO_PI);
    // aniLayers['pencil'].fill(255, 165, 0);
    // aniLayers['pencil'].rect(0, gap - gapOn3, gap * 1.5, gapOn2);
    aniLayers['pencil'] = createGraphics(gap, gap3);
    aniLayers['pencil'].noStroke();
    aniLayers['pencil'].fill(rCol[0]);
    aniLayers['pencil'].triangle(gapOn2, gap3, 0, gap2, gap, gap2);
    aniLayers['pencil'].fill(rCol[1]);
    aniLayers['pencil'].rect(0, gap, gap, gap);
    aniLayers['pencil'].fill(rCol[2]);
    aniLayers['pencil'].arc(gapOn2, gap, gap, gap2, PI, TWO_PI);
    aniLayers['ipencil'] = createGraphics(gap, gap3);
    aniLayers['ipencil'].imageMode(CENTER);
    aniLayers['ipencil'].push();
    aniLayers['ipencil'].scale(1, -1);
    aniLayers['ipencil'].translate(gapOn2, -1.5*gap);
    aniLayers['ipencil'].image(aniLayers['pencil'], 0, 0);
    aniLayers['ipencil'].pop();
}

  if (ltime % 6 == 0) {
    ani.line(gap, cr, gap + pos, cr);
    ani.image(aniLayers['pencil'], gapOn2 + pos, cr - gap3);
  } else if (ltime % 6 == 1) {
    ani.line(gap, cr, igap, cr);
    ani.image(aniLayers['pencil'], igap - gapOn2, cr - gap3);
  } else if (ltime % 6 == 2) {
    ani.line(gap, cr, igap, cr);
    ani.image(aniLayers['ipencil'], igap - gapOn2, cr - gap3);
  } else if (ltime % 6 == 3) {
    ani.line(gap, cr, igap - pos, cr);
    ani.image(aniLayers['ipencil'], igap - pos - gapOn2, cr - gap3);
  } else if (ltime % 6 == 4) {
    ani.image(aniLayers['ipencil'], gapOn2, cr - gap3);
  } else {
    ani.image(aniLayers['pencil'], gapOn2, cr - gap3);
  }
}

function asymmetry(){
  ani.clear();
  ani.noStroke();
  let start = 0;
  let ltime = int(millis() / 2000);
  let inc = PI/8;
  let wobble = sin(millis()/100) * gapOn4;
  if (ltime % 2 == 0){
    start = 0.1*sin(millis()/100);
  } else {
    wobble = 0;
  }
  for (let i = 0; i < 17; i++) {
    ani.fill(rCol[i%2]);
    ani.arc(aniWidthOn2 + wobble, aniHeightOn2, cr, cr, start, start+inc);
    start += inc;
  }
  if (ltime % 2 == 1){
    ani.fill(255);
    ani.rect(0, cr, ani.width, ani.height);
  }
  ani.fill(rCol[0]);
  ani.circle(aniWidthOn2 + wobble, aniHeightOn2, icr);
}

function merging(){
  ani.clear();
  ani.stroke(rCol[0]);
  ani.strokeWeight(2 * mStroke);
  let series = [icr, 2*icr, 3*icr, 4*icr];
  let inc = icr/5;
  let ltime = int(millis() / 500);
  let l2s = aniWidthOn2 + gap;
  let l2e = (aniWidthOn2) + gap2;
  let move = ltime % 5 - 1;
  let direction = ltime % 10;
  ani.stroke(rCol[2]);
  ani.line(gap, inc, gap, ani.height - inc);
  ani.line(l2s, inc, l2s, ani.height - inc);
  ani.line(l2e, icr + inc + inc * (sin(millis() / 300)), l2e, 2*inc + inc * (sin(millis() / 300)) + 3.8*gap);

  for (let i = 0; i < 4; i++){
    ani.stroke(rCol[0]);
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
    ani.stroke(rCol[1]);
    let lys = icr + i * icr;
    let lye = lys + inc  + inc * (sin(millis() / 300));
    ani.line(l2s, lys, l2e, lye);
  }
}

function equiTriangle(x, y, l, normal=false){
  vertices = [];
  l = l * sin(60);
  if (normal) {
    vertices.push(x-l);
    vertices.push(y);
    vertices.push(x+l);
    vertices.push(y - l);
    vertices.push(x+l);
    vertices.push(y + l);
  } else {
    vertices.push(x);
    vertices.push(y+l);
    vertices.push(x+l);
    vertices.push(y - l);
    vertices.push(x-l);
    vertices.push(y - l);
    // vertices.push(x);
    // vertices.push(y-l);
    // vertices.push(x-l);
    // vertices.push(y + l);
    // vertices.push(x+l);
    // vertices.push(y + l);
  }
  return vertices;
}

function universality(){
  ani.clear();
  ani.noStroke();
  let timer = sin(millis()/600);
  let timer2 = cos(millis()/600);

  // wedge
  // let gapOn2 = gap/2;
  // let gap2 = 2*gap;
  let gapSin60 = gap * sin(60);
  let t1x = aniWidthOn2 + aniWidthOn4 * timer + gapSin60;
  let t1y = aniHeightOn4;

  let rx = aniWidthOn2;
  let r1y = aniHeightOn4 - gapOn2;
  let r2y = aniHeightOn4;

  if (timer2 < 0){
    if (timer > 0) {
      r1y += gapSin60;
      r2y -= gapSin60;
      t1x = 3*aniWidthOn4 + gapSin60;
    } else {
      t1x = aniWidthOn4 + gapSin60;
    }
  } else {
    if (timer > 0) {
      r1y += timer * gapSin60;
      r2y -= timer  * gapSin60;
    }
  }
  let tri1 = equiTriangle(t1x, t1y, gap, true);
  ani.fill(rCol[1]);
  ani.rect(rx, r1y, gap2, gapOn2);
  ani.rect(rx, r2y, gap2, gapOn2);
  ani.fill(rCol[0]);
  ani.triangle(tri1[0], tri1[1], tri1[2], tri1[3], tri1[4], tri1[5]);
  // stop
  ani.fill(rCol[0]);
  let t2x = 3*aniWidthOn4;
  let t2y = 3*aniHeightOn4;
  let tri2 = equiTriangle(t2x, t2y, gap, false);
  ani.triangle(tri2[0], tri2[1], tri2[2], tri2[3], tri2[4], tri2[5]);
  ani.fill(rCol[1]);
  let ballx = aniWidthOn2 + (aniWidthOn4 * timer) + gapSin60;
  if (timer2 < 0){
    if (timer > 0) {
      ballx = 3*aniWidthOn4 + gapSin60;
    } else {
      ballx = aniWidthOn4 + gapSin60;
    }
  }
  ani.circle(ballx, t2y, gapOn2);
}

function matryoshka() { // yes I should use recursion here
  ani.clear();
  ani.noStroke();
  let timer = sin(millis()/700);
  let majorDim = gapOn4;
  let mdOn2= majorDim/2;
  ani.fill(rCol[0]);
  ani.arc(aniWidthOn2, aniHeightOn2, majorDim, 2*majorDim, PI, TWO_PI);
  ani.arc(aniWidthOn2, aniHeightOn2, majorDim, majorDim, TWO_PI, PI);
  ani.fill(rCol[1]);
  majorDim *= 2;
  mdOn2 *= 2;
  ani.arc(aniWidthOn2, aniHeightOn2 - (timer * mdOn2) - mdOn2, majorDim, 2*majorDim, PI, TWO_PI);
  ani.arc(aniWidthOn2, aniHeightOn2 + (timer * mdOn2) + mdOn2, majorDim, majorDim, TWO_PI, PI);
  ani.fill(rCol[2]);
  majorDim *= 2;
  mdOn2 *= 2;
  ani.arc(aniWidthOn2, aniHeightOn2 - (timer * mdOn2) - mdOn2, majorDim, 2*majorDim, PI, TWO_PI);
  ani.arc(aniWidthOn2, aniHeightOn2 + (timer * mdOn2) + mdOn2, majorDim, majorDim, TWO_PI, PI);
}

function antiweight() {
  ani.clear();
  let axs, ays, axe, aye;
  let timer = sin((millis()/1500));
  let timer2 = (cos((millis()/1500))) > 0;
  let osc = PI/12 * timer;
  let hypot = aniWidthOn2 - gap2;
  axs = aniWidthOn2 - hypot * cos(osc);
  ays = hypot * sin(osc) + aniHeightOn3;
  axe = aniWidthOn2 + hypot * cos(osc);
  aye = -hypot * sin(osc) + aniHeightOn3;
  ani.noStroke();
  ani.fill(0);
  ani.circle(aniWidthOn2, aniHeightOn3, gapOn2);
  ani.circle(axs, ays, gapOn4);
  ani.circle(axe, aye, gapOn4);
  ani.fill(rCol[0]);
  ani.rect(axe - gapOn4, aye + gap + gapOn2-mStroke, gapOn2, gapOn2);
  ani.fill(rCol[1]);
  let by = ays+gap+gapOn2-mStroke;
  ani.rect(axs - gapOn2, by, gap, gapOn2);
  ani.strokeWeight(mStroke);
  if (!timer2){
    ani.fill(255);
    ani.stroke(255);
    ani.rect(axs-gapOn4, by+(gapOn4/2), gapOn2, gapOn4);
  }
  ani.stroke(0);
  ani.strokeWeight(mStroke);
  ani.noFill();
  ani.line(axs, ays, axe, aye);
  ani.triangle(axs, ays + mStroke, axs-gap, ays+gap2, axs+gap, ays+gap2);
  ani.triangle(axe, aye + mStroke, axe-gap, aye+gap2, axe+gap, aye+gap2);
}

function pantiactions(){
  ani.clear();
  let cx = ani.width-(gap + gapOn2); //cy = gap
  let from = color(0, 255, 255);
  let to = color(0, 0, 255);
  let lerpVal = ((sin(millis()/400))/2) + 0.5;
  let mc = lerpColor(from, to, lerpVal);
  let mc2 = lerpColor(to, from, lerpVal);
  ani.stroke(mc);
  ani.strokeWeight(mStroke/2);
  let toggle = true;
  let cs = 0;
  for (let i = -2; i <=2; i+=0.5){
    toggle = true;
    for (let j = gap; j < ani.height-gapOn2; j+= gapOn4){
      if (toggle) {
        ani.line(cx + i*gapOn2, j, cx + i*gapOn2, j+gapOn4/2);
        cs++;
      }
      if ((cs % 2) == 0){
        ani.stroke(mc);
      } else {
        ani.stroke(mc2);
      }
      toggle = !toggle;
    }
  }
  for (let i = -1.75; i <=2; i+=0.5){
    toggle = false;
    for (let j = gap; j < ani.height-gapOn2; j+= gapOn4){
      if (toggle) {
        ani.line(cx + i*gapOn2, j, cx + i*gapOn2, j+gapOn4/2);
        cs++;
      }
      if ((cs % 2) == 0){
        ani.stroke(mc);
      } else {
        ani.stroke(mc2);
      }
      toggle = !toggle;
    }
  }

  ani.noStroke();
  ani.fill(255, 255, 0); //sun
  ani.circle(gap, gap, gap);
  ani.fill(220); //clouds
  for (let i = -2; i <=2; i++) {
    ani.circle(cx + i*gapOn2, gap, gapOn2);
  }
  for (let i = -1.5; i <=1.5; i++) {
    ani.circle(cx + i*gapOn2, gap34, gapOn2);
    ani.circle(cx + i*gapOn2, gapOn4+gap, gapOn2);
  }
  ani.fill(rCol[0]); //umbrella
  let osc = aniWidthOn2 + sin(millis()/2000) * aniWidthOn3;
  ani.ellipse(osc, aniHeightOn3*2, gap2, gap);
  ani.fill(255);
  ani.rect(osc - gap, aniHeightOn3*2, gap2, ani.height);
  for (let i = -1; i <=1; i++) {
    ani.circle(osc + i*gapOn2, aniHeightOn3*2 + gapOn4/2, gapOn2);
  }
  ani.stroke(0);
  ani.strokeWeight(mStroke);
  ani.line(osc, aniHeightOn3*2-gapOn4/2, osc, ani.height-gapOn2);
  ani.point(osc, aniHeightOn3*2-gapOn2);
  ani.fill(255);
  ani.stroke(rCol[0]);
  ani.arc(osc-gapOn4/2, ani.height-gapOn2, gapOn4, gapOn4, 0, PI);
}

function countTo3(period, shift=0, now=millis(), invert=false){
  let t1 = sin(now/period + shift) > 0;
  let t2 = cos(now/period + shift) > 0;
  let pArr = [0, 3, 1, 2];
  if (invert){
    pArr = [3, 0, 2, 1];
  }
  return pArr[t1 + 2*t2];
}

function countTo15(period, now=millis(), invert=false) {
  let major = 4 * countTo3(period*4, PI/4, now, invert);
  let minor = countTo3(period, 0, now, invert);
  return major + minor;
}

function aniRulers(){
  ani.stroke(0);
  ani.strokeWeight(1);
  ani.line(0, aniHeightOn2, ani.width, aniHeightOn2);
  ani.line(aniWidthOn2, 0, aniWidthOn2, ani.height);
  // ani.line(0, aniHeightOn2 - (gap + gapOn2), ani.width, aniHeightOn2 - (gap + gapOn2));
  // ani.line(0, aniHeightOn2 + gap, ani.width, aniHeightOn2 + gap);
}

function preactions(){
  ani.clear();
  ani.rectMode(CENTER);
  ani.stroke(0);
  ani.strokeWeight(mStroke);
  ani.noFill();
  let period = 1000;
  // hub
  let warehouse = [aniWidthOn4 - gapOn2, aniHeightOn2];
  // sats
  let sats = [[aniWidthOn2 + gapOn4, aniHeightOn3],[aniWidthOn2+ gapOn4, aniHeightOn3 * 2]];
  // houses
  let hx = aniWidthOn4 * 3 + gapOn2;//(gapOn2 + gapOn3);
  let houses = [];
  let inc = ani.height/5;
  let start = inc;
  for (let i = 0; i < 4; i++){
    houses.push([hx, start + i * inc]);
  }
  //draw layout
  ani.square(warehouse[0], warehouse[1], gap2);
  for (let i = 0; i < sats.length; i++){
    ani.square(sats[i][0], sats[i][1], gap);
  }
  let ind = countTo3(period);
  for (let i = 0; i < houses.length; i++){
    if (i == ind) {
      ani.fill(0);
    } else {
      ani.fill(rCol[1]);
    }
    ani.square(houses[i][0], houses[i][1], gapOn2);
  }
  ani.fill(0);
  ani.square(sats[0][0], sats[0][1], gapOn2);
  ani.square(sats[1][0], sats[1][1], gapOn2);
  // transport test
  ani.fill(rCol[1]);
  ani.noStroke();
  let c = deliver(sats[int(ind / 2)], houses[ind], period, ind);
  ani.square(c[0], c[1], gapOn2 - mStroke);
  let ws = [warehouse[0] + gapOn2, warehouse[1] - gapOn2];
  c = deliver(ws, sats[int(ind / 2)], period, ind);
  ani.square(c[0], c[1], gapOn2- mStroke);

  // warehouse inventory
  c = deliver([ws[0], ws[1]+ gapOn2 + mStroke], ws, period, ind);
  ani.square(c[0], c[1] , gapOn2 - mStroke);
  ani.square(c[0], c[1] + (gapOn2 + mStroke), gapOn2 - mStroke);

  let first = [ws[0], ws[1] + gap + 2*mStroke];
  let offscr = [-gap, first[1]];
  c = deliver(offscr, first, period, ind);
  ani.square(c[0], c[1] , gapOn2 - mStroke);
  if (ind == 0 || ind == 1){
    c = sats[1];
  } else {
    c = sats[0];
  }
  ani.square(c[0], c[1], gapOn2- mStroke);
  ani.rectMode(CORNER);
  ani.fill(255); //ani.square(warehouse[0], warehouse[1], gap2);
  ani.rect(0, 0, warehouse[0] - (gap * 1.05), ani.height);
}

function deliver(s, d, period, phase=0){
  let myFunc = [sin, cos, sin, cos];
  let x = s[0] + abs(myFunc[phase](millis()/period)) * (d[0] - s[0]);
  let y = s[1] + abs(myFunc[phase](millis()/period)) * (d[1] - s[1]);
  return [x, y];
}

function beforehandcushioning(){
  ani.clear();
  ani.rectMode(CENTER);
  let timer = sin(millis()/1000);
  let x = (timer * (aniWidthOn3/2)) + aniWidthOn3;
  ani.noStroke();
  ani.fill(rCol[0]);
  let ah32 = aniHeightOn3*2
  ani.rect(x, ah32, gap2, gap);
  ani.fill(rCol[1]);
  ani.circle(x - gapOn2, ah32 + gapOn2, gap34);
  ani.circle(x + gapOn2, ah32 + gapOn2, gap34);
  ani.fill(rCol[2]);
  ani.rect(ani.width - aniWidthOn4, aniHeightOn2, aniWidthOn3 - gap, aniHeightOn2 + gap);
  ani.stroke(0);
  ani.strokeWeight(mStroke/2);
  let spx = x + gap + 1;
  let inc = aniWidthOn3/8;
  if (x > (aniWidthOn3)) {
    inc = ((aniWidthOn2) - x) / 4;
  }
  for (let i = 0; i < 5; i++) {
    ani.line(spx, ah32 - gapOn4, spx, ah32 + gapOn4);
    if (i < 4) {
      ani.line(spx, ah32 - gapOn4, spx + inc, ah32 + gapOn4);
    }
    spx += inc;
  }
  ani.rectMode(CORNER);
}

function smoothSquare(period, now=millis(), shift=0){
  let st = sin(now/period + shift);
  let ct = cos(now/period + shift);
  let result = 0;
  if (st > 0 && ct < 0){
    result = st;
  } else if (st >= 0) {
    result = 1;
  } else if (st < 0 && ct > 0) {
    result = 1 + st;
  }
  return result
}

function equipotentiality(){
  ani.clear();
  ani.rectMode(CORNER);
  let t = smoothSquare(1000);
  let s = smoothSquare(250);
  // let sig = sin(millis()/250) * 0.5 + 0.5;
  ani.noStroke();
  ani.fill(0, 0, 255);
  let low = 2*aniHeightOn3;
  let high = aniHeightOn3
  ani.rect(0, low, aniWidthOn3, gap);
  ani.rect(aniWidthOn3 * 2, high, aniWidthOn3, gap + aniHeightOn3);
  ani.rect(aniWidthOn3, low, aniWidthOn3, gap);

  let lockHeight = low - (t * high)

  ani.rect(aniWidthOn3, low - (t * high), aniWidthOn3, gap + (t * high));
  let boatx = 0;
  let boaty = 0;
  let l1 = (aniHeightOn3 * 2) + gap;
  let l2 = aniWidthOn3 - gap;
  if (t == 0) {
    // boatx = int(aniWidthOn3 - gap + s * gap2);
    boatx = aniWidthOn2 - (1-s) * gap2;
    boaty = low - gapOn2/2;
  } else if (t==1){
    // boatx = int(2*aniWidthOn3 - s * gap2 + gap);
    boatx = aniWidthOn2 + (1-s) * gap2;
    boaty = high - gapOn2/2;
  } else {
    boatx = aniWidthOn2;
    boaty = lockHeight - gapOn2/2;
    if ((sin(millis()/1000)) > 0) {
      l1 = (aniHeightOn3 * 2);
    } else {
      l2 = aniWidthOn3;
    }
  }
  ani.fill(255, 0, 0);
  ani.rectMode(CENTER);
  ani.rect(boatx, boaty, gap, gapOn2);
  ani.triangle(boatx - gapOn2, boaty - gapOn4, boatx - gap, boaty - gapOn4, boatx - gapOn2, boaty + gapOn4)
  ani.triangle(boatx + gapOn2, boaty - gapOn4, boatx + gap, boaty - gapOn4, boatx + gapOn2, boaty + gapOn4)
  ani.rect(boatx, boaty - gap34, gapOn6/2, gap);
  ani.fill(255, 255, 0);
  let mast = boatx - gapOn6/2;
  ani.triangle(mast, boaty - (gap + gapOn4), mast, boaty - gapOn4, mast - gap34, boaty - gapOn4);
  ani.rectMode(CORNER);
  ani.strokeWeight(mStroke);
  ani.stroke(0);
  ani.line(aniWidthOn3, aniWidthOn3 - gap, aniWidthOn3, l1);
  ani.line(2*aniWidthOn3, l2, 2*aniWidthOn3, (aniHeightOn3 * 2) + gap);
}

function dothingsbackwards() {
  ani.clear();
  ani.noStroke();
  let per = 200;

  let ah42 = aniHeightOn4/2;
  let aw42 = aniWidthOn4/2;
  ani.fill(139, 69, 19);
  ani.rect(aniWidthOn4, ah42, gapOn3, aniWidthOn2);
  let timer = sin(millis()/per);
  let nailx = timer * gap + (aw42 + gap) + gap2;
  let vy1 = ah42 + gapOn3;
  let vy2 = vy1 + gapOn3*2;
  let vy3 = (vy1 + vy2)/2;
  let pos = countTo3(4*per, -per/2, millis(), true);
  let gpos = max(pos-1, 0);
  if (pos == 0) {
    nailx = aw42 + gap2;
  }
  let wpx = nailx + (pos) * gapOn4;
  ani.rect(wpx, ah42, gap, gap + gapOn2);
  ani.fill(190);
  ani.rect(aw42, ah42 + gapOn4, gap2, gap);
  ani.triangle(nailx, vy1, nailx, vy2, nailx + gap, vy3);
}

function curvature(){
  ani.clear();
  let per = 500;
  let tx1 = sin(millis()/per);
  let tx2 = cos(millis()/per);
  let cx = aniWidthOn4;
  let cy = aniWidthOn3;
  let cr = aniWidthOn3 - gap * 1.5;
  let mcx = cx + tx1 * cr;
  let mcy = cy + tx2 * cr;
  ani.noStroke()
  ani.fill(rCol[0]);
  ani.circle(cx, cy, cr * 3);
  let tb = cy - cr*1.5
  let aw315 = aniWidthOn3*1.5 + cr*0.5;
  ani.rect(cx, tb, aw315, cr/2);
  ani.rect(cx, cy + cr, aw315, cr/2);
  ani.fill(255);
  ani.circle(cx, cy, cr);
  ani.fill(rCol[1]);
  ani.circle(mcx, mcy, gapOn2);
  ani.rect(2 * aniWidthOn3 + tx1 * cr, tb + cr/2, gapOn4, cr*2);
  ani.strokeWeight(mStroke);
  ani.stroke(rCol[2]);
  ani.line(mcx, mcy, 2 * aniWidthOn3 + tx1 * cr + gapOn4/2, tb + cr * 1.5);
}

function dynamics() {
  if (!('dynSin' in aniLayers)){
    aniLayers['dynSin'] = createGraphics(int(aniWidthOn2), gap2);
    aniLayers['dynSin'].strokeWeight(mStroke);
    aniLayers['dynSin'].stroke(0);
    for (let i = -1; i < aniLayers['dynSin'].width+1; i++) {
      let x = i;
      let y = aniLayers['dynSin'].height/2;
      y += gapOn4/2 * sin((i /aniLayers['dynSin'].width) * TWO_PI * 2);
      aniLayers['dynSin'].point(x, y);
    }
  }
  ani.clear();
  ani.noStroke();

  let cx = aniWidthOn2 + aniWidthOn4 *sin(millis()/1000);
  let cr = gap;
  let osc = gapOn4/2 * sin((cx /aniLayers['dynSin'].width) * TWO_PI * 2);
  let cy = (aniWidthOn2 - gapOn2) + osc;
  let type = countTo3(2000);
  ani.fill(rCol[0]);
  ani.circle(cx, cy, cr);
  ani.strokeWeight(mStroke);
  ani.stroke(0);
  let ah8 = aniHeightOn4/2;
  let cyp = cy - ah8
  ani.line(cx, cy, cx, cyp);
  ani.line(cx - gap, cyp, cx + gap, cyp);
  let pl = aniHeightOn2;
  let inc = (cy - pl) / 3;
  let pos = inc;
  for (let i = 0; i < 3; i++) {
    ani.line(cx - gap, cyp - pos, cx - gapOn2, cyp - pos)
    pos += inc;
  }
  let bb = aniHeightOn4 + gapOn2;
  ani.line (cx + gap34, cyp, cx + gap34, cyp - gapOn6);
  ani.line (cx + gap34, bb, cx + gap34, bb + gapOn6);
  ani.stroke(220);
  ani.line (0, aniHeightOn4 + gapOn4, ani.width, aniHeightOn4+ gapOn4);
  ani.noStroke();
  ani.fill(rCol[1]);
  ani.rect(cx - gap, aniHeightOn4, gap2, gapOn2);
  ani.fill(rCol[2]);
  ani.rect(cx + gapOn2, bb + gapOn6, gapOn2, (cyp - bb - gapOn3));
  ani.image(aniLayers['dynSin'], 0, aniHeightOn2);
  ani.image(aniLayers['dynSin'], aniWidthOn2, aniHeightOn2);
}

function partialorexcessive() {
  let now = millis();
  let per = 500;
  let ind = countTo3(per * 4, 0, now) + 1;
  let prevInd = ind - 1;
  if (prevInd == 0) {
    prevInd = 4;
  }
  let paintPhase = (ind % 2 == 0);
  ani.fill(rCol[ind]);
  ani.noStroke();
  let f = now/per;
  let stencilTimer = sin(f);
  let paintTimer = -cos(f);
  ani.clear();
  ani.background(rCol[prevInd]);
  let xPaint;
  if (stencilTimer >= 0) {
    xPaint = paintTimer * ani.width;
  } else {
    xPaint = ani.width;
  }
  ani.rect(0, 0, xPaint, ani.height);
  let sp = smoothSquare(per, now, per/2) * aniWidthOn2 + aniWidthOn4;

  let aw34 = aniWidthOn4 * 3
  // if (xPaint < aw34) {
  //   let pprev = prevInd - 1;
  //   if (pprev < 0) {
  //     pprev = 3;
  //   }
  //   ani.fill(rCol[pprev]);
  // } else {
  //   ani.fill(rCol[prevInd]);
  // }
  ani.fill(255);
  star(aw34, aniHeightOn2, gap, gapOn2, 6);
  if (sp < xPaint) {
    ani.fill(rCol[ind]);
  } else {
    ani.fill(rCol[prevInd]);
  }
  ani.stroke(0);
  ani.strokeWeight(mStroke);
  star(sp, aniHeightOn2, gap, gapOn2, 6);
  // ani.square( sp, aniHeightOn2 - gapOn2, gap);
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let off = HALF_PI - angle;
  let halfAngle = angle / 2.0;
  ani.beginShape();
  for (let a = off; a < TWO_PI + off; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    ani.vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    ani.vertex(sx, sy);
  }
  ani.endShape(CLOSE);
}

function drawTruck() {
  if (!('truck' in aniLayers)){
    aniLayers['truck'] = createGraphics(ani.width, ani.height);
    aniLayers['truck'].noStroke();
    aniLayers['truck'].fill(100);
    let aw8 = aniWidthOn4/2;
    aniLayers['truck'].rect(0, ani.height - aniHeightOn4 - gapOn2, aniWidthOn4 * 3, gapOn2);
    aniLayers['truck'].arc(aw8 + aniWidthOn2, ani.height - aniHeightOn4, 6*gapOn4, 6*gapOn4, PI, 0);
    aniLayers['truck'].fill(255, 0, 0);
    aniLayers['truck'].rect(0, aniHeightOn4, aniWidthOn4, aniHeightOn2);
    aniLayers['truck'].fill(255, 100, 100);
    aniLayers['truck'].rect(aniWidthOn4/2, aniHeightOn3 + gapOn6, aniWidthOn4/3, aniHeightOn4);
    aniLayers['truck'].fill(0, 255, 255);
    aniLayers['truck'].rect(0, aniHeightOn3 + gapOn6, gapOn2, gap34);
    aniLayers['truck'].fill(255, 255, 0);
    aniLayers['truck'].rect(0, aniHeightOn2 + gapOn2, gapOn6, gapOn6);
    aniLayers['truck'].fill(0);
    aniLayers['truck'].circle(aw8, ani.height - aniHeightOn4, gap);
    aniLayers['truck'].circle(aw8 + aniWidthOn2, ani.height - aniHeightOn4, gap);
    aniLayers['truck'].fill(100);
    aniLayers['truck'].circle(aw8, ani.height - aniHeightOn4, gapOn3);
    aniLayers['truck'].circle(aw8 + aniWidthOn2, ani.height - aniHeightOn4, gapOn3);
  }
}

function anotherdimension(){
  drawTruck()
  ani.clear();
  ani.noStroke();
  ani.rectMode(CORNER);
  bcx = aniWidthOn2 - aniWidthOn4;
  let bcy = (aniHeightOn3 * 2) - (aniHeightOn4 + gapOn2);
  let timer = sin(millis()/1000);
  let osc = timer * (QUARTER_PI / 2) + (QUARTER_PI / 2);
  let fall = (cos(millis()/1000));
  let ind = countTo3(4000);
  let cx = ani.width - gapOn2;
  let cy = ani.height - aniHeightOn4 + gapOn4;
  ani.fill(rCol[ind]);
  if (osc > 0.6 && fall > 0) {
    ani.circle(cx - abs(fall * gapOn4), cy - abs(fall * gap), gapOn2);
  } else if (fall < 0){
    ani.circle(cx, cy, gapOn2);
  }
  ani.strokeWeight(mStroke * 2);
  ani.stroke(150);
  ani.line(bcx, bcy + aniHeightOn3, sin(osc + QUARTER_PI) * aniWidthOn2, (bcy + aniHeightOn3) - sin(osc + QUARTER_PI) * aniHeightOn3);
  ani.strokeWeight(mStroke);
  ani.stroke(100);
  ani.fill(150);
  ani.push();
  ani.translate(bcx + sin(osc) * aniWidthOn2, bcy - sin(osc) * aniHeightOn3);
  ani.rotate(osc);
  ani.rect(0, 0, aniWidthOn2, aniHeightOn3);
  ani.fill(200);
  for (let i = 1; i < 12; i+=2) {
    ani.rect(gapOn4 * i, gapOn4, gapOn4, aniHeightOn3 - gapOn2);
  }
  ani.pop();
  ani.image(aniLayers['truck'], 0, 0);
  ani.stroke(0);
}

function vibrations() {
  ani.clear();
  ani.noStroke();
  ani.rectMode(CENTER);
  let per = 1000;
  let lt = cos(millis() / per + per/2);
  let lt2 = (sin(millis() / per + per/2) + 1)/4;
  let osc = 0;
  let c1 = lerpColor(rCol[0], rCol[1], lt2);
  let c2 = lerpColor(rCol[1], rCol[0], lt2);
  if (lt > 0) {
    osc = sin(millis() / 20) * gapOn4/2;
  }
  ani.fill(c1);
  ani.rect(aniWidthOn2 + osc, aniHeightOn3 + osc, aniWidthOn3, aniHeightOn3);
  ani.fill(c2);
  ani.rect(aniWidthOn2 + osc, 2*aniHeightOn3 + osc, aniWidthOn3, aniHeightOn3);
  ani.strokeWeight(mStroke);
  ani.stroke(c1);
  ani.line(aniWidthOn3 + osc, aniHeightOn2 + osc, aniWidthOn3*2 + osc, aniHeightOn2 + osc);
  ani.stroke(0);
  ani.noFill();
  ani.rect(aniWidthOn2 + osc, aniHeightOn2 + osc, aniWidthOn3, aniHeightOn3*2);
  ani.rectMode(CORNER);
}

function periodicaction(){
  ani.clear();
  ani.rectMode(CENTER);
  ani.noFill();
  ani.strokeWeight(mStroke);
  ani.stroke(0);
  let aw34 = 3*aniWidthOn4;
  let ah34 = 3*aniHeightOn4;
  let sx = gapOn2 + mStroke;
  let ex = ani.width - (gapOn2 + mStroke);
  let ty = aniHeightOn4;
  let by = ah34;
  ani.fill(rCol[0]);
  let per = 500;
  let t1 = sin(millis()/per);
  let t2 = (cos(millis()/per) + 1) / 2;
  if (t1 >= 0) {
    t2 = 1 - t2;
  }
  ani.noStroke();
  ani.circle(sx + t2 *(ex - sx), ty, gapOn3);

  let batchT = countTo3(2 * per);
  let diffx = (ex - sx - gap);
  if (batchT == 0) {
    ani.circle(gap + sx + t2 * diffx, by, gapOn3);
    ani.circle(gap + gapOn2 + sx + t2 * diffx, by, gapOn3);
    ani.circle(gap2 + sx + t2 * diffx, by, gapOn3);
  } else if (batchT == 1) {
    ani.circle(sx + t2 * (gap2), by, gapOn3);
  } else if (batchT == 2) {
    ani.circle(sx + gap2, by, gapOn3);
    ani.circle(sx + t2 * (gap + gapOn2), by, gapOn3);
  } else if (batchT == 3) {
    ani.circle(sx + gap + gapOn2, by, gapOn3);
    ani.circle(sx + gap2, by, gapOn3);
    ani.circle(sx + t2 * gap, by, gapOn3);
  }
  ani.fill(255);
  ani.rect(ex + gap, aniHeightOn2, gap2, ani.height);
  ani.fill(rCol[1]);
  ani.square(sx, ty, gap);
  ani.square(sx, by, gap);
  ani.fill(rCol[0]);
  ani.square(ex, ty, gap);
  ani.square(ex, by, gap);
  ani.rectMode(CORNER);
}

function continuityofusefulaction() {
  ani.clear();
  ani.noStroke();
  ani.fill(200);
  let per = 1000;
  let timer = sin(millis()/per);
  ani.push();
  ani.translate(aniWidthOn2, ani.height - aniHeightOn3);
  ani.rotate(TWO_PI*(millis()/per));
  ani.circle(0, 0, gap);
  ani.fill(100);
  ani.arc(0, 0, gap, gap, 0, QUARTER_PI);
  ani.arc(0, 0, gap, gap, HALF_PI, HALF_PI + QUARTER_PI);
  ani.arc(0, 0, gap, gap, PI, PI + QUARTER_PI);
  ani.arc(0, 0, gap, gap, -HALF_PI, - QUARTER_PI);
  ani.pop();
  ani.strokeWeight(mStroke);
  ani.stroke(0);
  ani.circle(aniWidthOn2, ani.height - aniHeightOn3, gapOn2);
  ani.rect(aniWidthOn2-gapOn2, ani.height - aniHeightOn3, gap, gapOn2);
  let lh = ani.height - aniHeightOn3 + gap;
  ani.line(aniWidthOn2, lh - gapOn2, aniWidthOn2, lh );
  if (timer > 0) {
    ani.fill(255, 255, 0);
    ani.stroke(255, 255, 0);
    ani.line(aniWidthOn2, lh, gap, lh );
    ani.line(gap, lh, gap, aniHeightOn3 + gap);
    ani.stroke(0);
    ani.line(aniWidthOn2, lh, ani.width - aniWidthOn3/2, lh );
    ani.line(ani.width - aniWidthOn3/2, lh, ani.width - aniWidthOn3/2, ani.height - aniHeightOn3/2);
  } else {
    ani.noFill();
    ani.stroke(255, 255, 0);
    ani.line(aniWidthOn2, lh, ani.width - aniWidthOn3/2, lh );
    ani.line(ani.width - aniWidthOn3/2, lh, ani.width - aniWidthOn3/2, ani.height - aniHeightOn3/2);
    ani.stroke(0);
    ani.line(aniWidthOn2, lh, gap, lh );
    ani.line(gap, lh, gap, aniHeightOn3 + gap);
  }
  ani.stroke(0);
  ani.ellipse(gap, aniHeightOn3, gap, gap2);
  ani.noFill();
  ani.triangle(gap - gapOn4, aniHeightOn3, gap + gapOn4, aniHeightOn3, gap, aniHeightOn3 + gap);
  ani.fill(100);
  ani.rect(gapOn2, aniHeightOn3 + gap34 , gap, gapOn2);
  ani.fill(0, 0, 255);
  ani.noStroke();
  ani.rect(ani.width - (aniWidthOn3), aniHeightOn3/2, gap2, 2*aniHeightOn3);
  let water = 1 - (cos(millis()/per) + 1)/2;
  ani.fill(255);
  ani.rect(ani.width - (aniWidthOn3), aniHeightOn3/2 , gap2, 2*aniHeightOn3 * water);
  ani.noFill();
  ani.stroke(0);
  ani.rect(ani.width - (aniWidthOn3), aniHeightOn3/2, gap2, 2*aniHeightOn3);
}

function skipping() {
  ani.clear();
  // let c = [color([141, 85, 36]),color([198, 134, 66]),color([224, 172, 105]),color([241, 194, 125]),color([255, 219, 172])];
  let c = [color([141, 85, 36]),color([224, 172, 105]),color([255, 219, 172])];
  let index = 0;
  for (let i = 0; i < 3; i++) {
    if (rCol[i].levels[0] == 255) {
      index += 1;
    }
  }
  let timer = sin(millis()/200);
  ani.background(c[index]);
  ani.noStroke();
  if (timer > 0.8) {
    ani.fill(255, 230, 230);
  } else {
    ani.fill(255);
  }
  ani.circle(aniWidthOn2, aniHeightOn2, aniWidthOn2);
  ani.noStroke();
  if (rCol[4].levels[0] == 255) {
    ani.fill(0, 255, 255);
  } else {
    ani.fill(color([198, 134, 66]));
  }
  ani.circle(aniWidthOn2, aniHeightOn2, aniWidthOn4);
  ani.fill(0);
  ani.circle(aniWidthOn2, aniHeightOn2, aniWidthOn4/2);
  ani.push();
  ani.translate(aniWidthOn2, aniHeightOn2);
  ani.rotate(-QUARTER_PI);
  if (timer > 0.8) {
    ani.strokeWeight(mStroke);
    ani.stroke(0, 255, 0);
    ani.line(0, 0, ani.width, 0);
  }
  ani.fill(200);
  ani.noStroke();
  ani.rect(aniWidthOn4 + gapOn4, -gapOn2, ani.width, gap);
  ani.pop();
}

function drawCar(){
  if (!('car' in aniLayers)){
    aniLayers['car'] = createGraphics(ani.width, ani.height);
    aniLayers['car window'] = createGraphics(ani.width, ani.height);
    aniLayers['car'].noStroke();
    let body = [];
    body.push([0.1, 0.72]);
    body.push([0.26, 0.63]);
    body.push([0.43, 0.51]);
    body.push([0.83, 0.51]);
    body.push([0.92, 0.65]);
    body.push([0.92, 0.73]);
    body.push([0.93, 0.78]);
    body.push([0.93, 0.86]);
    body.push([0.9, 0.9]);
    body.push([0.09, 0.93]);
    body.push([0.06, 0.84]);
    body.push([0.1, 0.72]);
    body.push([0.26, 0.63]);
    body.push([0.43, 0.51]);
    aniLayers['car'].beginShape();
    aniLayers['car'].fill(0, 0, 255);
    for (let i = 0; i < body.length; i++) {
      aniLayers['car'].curveVertex(body[i][0] * ani.width, body[i][1] * ani.height);
    }
    aniLayers['car'].endShape();
    let windows = [];
    windows.push([0.3, 0.68]);
    windows.push([0.3, 0.68]);
    windows.push([0.4, 0.55]);
    windows.push([0.78, 0.53]);
    windows.push([0.82, 0.66]);
    windows.push([0.3, 0.68]);
    aniLayers['car window'].beginShape();
    aniLayers['car window'].fill(255);
    aniLayers['car window'].noStroke();
    for (let i = 0; i < windows.length; i++) {
      aniLayers['car window'].curveVertex(windows[i][0] * ani.width, windows[i][1] * ani.height);
    }
    aniLayers['car window'].endShape();
    // aniLayers['car'].fill(255, 255, 0);
    // aniLayers['car'].ellipse(0.12*ani.width, 0.77 * ani.height, 0.04*ani.width, 0.06*ani.width);
    // aniLayers['car'].ellipse(0.9*ani.width, 0.68 * ani.height, 0.04*ani.width, 0.06*ani.width);
    // let lights = [[0.12, 0.77], [0.9, 0.7]];
    // let wheels = [[0.23, 0.9], [0.83, 0.9]];
    aniLayers['car'].fill(0);
    aniLayers['car'].circle(0.23*ani.width, 0.88*ani.height, 0.16*ani.width);
    aniLayers['car'].circle(0.83*ani.width, 0.88*ani.height, 0.16*ani.width);
    aniLayers['car'].fill(100);
    aniLayers['car'].circle(0.23*ani.width, 0.88*ani.height, 0.08*ani.width);
    aniLayers['car'].circle(0.83*ani.width, 0.88*ani.height, 0.08*ani.width);

  }
}

function harmtobenefit() {
  drawCar();
  ani.clear();
  ani.image(aniLayers['car'], 0, -aniHeightOn3/2);
  let timer = smoothSquare(500);
  ani.rectMode(CENTER);
  ani.noStroke();
  let c = lerpColor(color(100), color(255, 0, 0), timer );
  ani.fill(c);
  let ex = aniWidthOn2 + gapOn2;
  let ey = aniHeightOn2 + gap34;
  ani.rect(ex, ey, gap, gapOn2);
  ani.rect(ex - gap34, ey, gapOn6, gapOn2);
  ani.rect(ex - gap34/2, ey, gap34, gapOn6);
  ani.rect(ex, ey - gapOn3, gapOn2, gapOn6);
  ani.rect(ex + gap34, ey, gapOn6, gapOn2);
  ani.rect(ex + gap34/2, ey, gap34, gapOn6)
  c = lerpColor(color(200, 255, 255), color(255, 255, 100), timer );
  ani.tint(c);
  ani.image(aniLayers['car window'], 0, -aniHeightOn3/2);
  ani.noTint();
  ani.rectMode(CORNER);
}

function drawFBLoop() {
  if (!('fbl' in aniLayers)){
    aniLayers['fbl'] = createGraphics(ani.width, ani.height);
    aniLayers['fbl'].rectMode(CENTER);
    aniLayers['fbl'].noFill();
    aniLayers['fbl'].strokeWeight(mStroke);
    aniLayers['fbl'].stroke(0);
    aniLayers['fbl'].rect(aniWidthOn2, aniHeightOn2, aniWidthOn4 * 2.5, aniHeightOn2);
    aniLayers['fbl'].line(0, aniHeightOn4, ani.width, aniHeightOn4);
    aniLayers['fbl'].fill(rCol[1]);
    let aw8 = aniWidthOn4/2;
    aniLayers['fbl'].circle(aniWidthOn4 * 0.75, aniHeightOn4, gapOn2);
    aniLayers['fbl'].rect(aniWidthOn2, aniHeightOn4, gapOn2, gapOn2);
    // aniLayers['fbl'].rect(aniWidthOn2 + aw8, aniHeightOn4, gapOn2, gapOn2);
    // aniLayers['fbl'].rect(aniWidthOn2, aniHeightOn4 * 3, gapOn2, gapOn2);
    aniLayers['fbl'].fill(0);
    let txs = ani.width - gapOn6;
    let g12 = gapOn6/2
    aniLayers['fbl'].stroke(255);
    aniLayers['fbl'].strokeWeight(mStroke*2);
    aniLayers['fbl'].line(txs, aniHeightOn4, txs + gap, aniHeightOn4);
    aniLayers['fbl'].stroke(0);
    aniLayers['fbl'].strokeWeight(mStroke);
    // aniLayers['fbl'].noStroke();
    aniLayers['fbl'].triangle(txs, aniHeightOn4, txs - gapOn6, aniHeightOn4 - g12, txs - gapOn6, aniHeightOn4 + g12);
    txs = gapOn3;
    aniLayers['fbl'].stroke(255);
    aniLayers['fbl'].strokeWeight(mStroke*2);
    aniLayers['fbl'].line(txs, aniHeightOn4, txs + gapOn4, aniHeightOn4);
    aniLayers['fbl'].stroke(0);
    aniLayers['fbl'].strokeWeight(mStroke);
    aniLayers['fbl'].triangle(txs, aniHeightOn4, txs - gapOn6, aniHeightOn4 - g12, txs - gapOn6, aniHeightOn4 + g12);
    txs = aniWidthOn2 - aniWidthOn4;
    let ty = aniHeightOn4 * 3;
    aniLayers['fbl'].stroke(255);
    aniLayers['fbl'].strokeWeight(mStroke*2);
    aniLayers['fbl'].line(txs, ty, txs - gapOn6/2, ty);
    aniLayers['fbl'].stroke(0);
    aniLayers['fbl'].strokeWeight(mStroke);
    aniLayers['fbl'].triangle(txs, ty, txs + gapOn6, ty - g12, txs + gapOn6, ty + g12);
    txs = aniWidthOn2 + aniWidthOn4 - gapOn3;
    aniLayers['fbl'].stroke(255);
    aniLayers['fbl'].strokeWeight(mStroke*2);
    aniLayers['fbl'].line(txs, ty, txs - gapOn6/2, ty);
    aniLayers['fbl'].stroke(0);
    aniLayers['fbl'].strokeWeight(mStroke);
    aniLayers['fbl'].triangle(txs, ty, txs + gapOn6, ty - g12, txs + gapOn6, ty + g12);
    aw8 = aniWidthOn4/2;
    let gHeight = gap2;
    let inputSignalX = aw8 - gapOn3;
    let inputSignalY = gapOn3;
    let errorX = aniWidthOn3 - gapOn6;
    let errorY = gapOn3;
    let outputSignalX = ani.width - aw8 - gapOn3/3;
    let outputSignalY = gapOn3;
    let targetX = aniWidthOn2 + gapOn2;
    let targetY = aniHeightOn2 - gHeight/2 + gapOn3;//aniHeightOn4 * 3 - gHeight + gapOn4 - mStroke/2;
    aniLayers['fbl overlay'] = createGraphics(ani.width, ani.height);
    aniLayers['fbl overlay'].strokeWeight(mStroke);
    aniLayers['fbl overlay'].stroke(0);
    aniLayers['fbl overlay'].noFill();
    aniLayers['fbl overlay'].rect(inputSignalX, inputSignalY, gapOn3, gHeight);
    aniLayers['fbl overlay'].rect(outputSignalX, outputSignalY, gapOn3, gHeight);
    aniLayers['fbl overlay'].rect(targetX, targetY, gapOn3, gHeight);
    aniLayers['fbl overlay'].rect(errorX, errorY, gapOn3, gHeight);
    aniLayers['fbl overlay'].line(targetX + gapOn3, targetY + gHeight/2, targetX + gap + gapOn4, targetY + gHeight/2);
    aniLayers['fbl overlay'].line(targetX, targetY + gHeight/2, aniWidthOn2, targetY + gHeight/2);
    aniLayers['fbl overlay'].line(aniWidthOn2, targetY + gHeight/2, aniWidthOn2, aniHeightOn3 + gapOn4);
  }
}

function feedback(){
  ani.clear();
  drawFBLoop();
  ani.image(aniLayers['fbl'], 0, gapOn3);
  // let input = (sin(millis()/100) + 1) * 0.33 + 0.165;
  let input = (sin(millis()/50) + 1) * 0.1 + (sin(millis()/1000) + 1) * 0.3;
  let target = 0.5 * smoothSquare(600) + 0.25;
  // simulate plant delay
  // let inputDelayed = (sin(millis()/per - per/8) + 1) / 2;
  let error = target - input;
  let output = input + error;
  ani.noStroke();
  let aw8 = aniWidthOn4/2;
  let gHeight = gap2;
  let inputSignalX = aw8 - gapOn3;
  let inputSignalY = gapOn3;
  ani.fill(255);
  ani.rect(inputSignalX, inputSignalY, gapOn3, gHeight);
  ani.fill(255, 0, 0);
  ani.rect(inputSignalX, inputSignalY + (1-input) * gHeight, gapOn3, gHeight*input);
  let errorX = aniWidthOn3 - gapOn6;
  let errorY = gapOn3;
  ani.fill(255);
  ani.rect(errorX, errorY, gapOn3, gHeight);
  ani.fill(255, 0, 0);
  ani.rect(errorX, errorY + (1-error/2) * gHeight - gHeight/2, gapOn3/2, gHeight*error/2);
  ani.fill(0, 255, 0);
  ani.rect(errorX + gapOn3/2, errorY + (1-error/2) * gHeight - gHeight/2, gapOn3/2, gHeight*error/2);
  let outputSignalX = ani.width - aw8 - gapOn3/3;
  let outputSignalY = gapOn3;
  ani.fill(255);
  ani.rect(outputSignalX, outputSignalY, gapOn3, gHeight);
  ani.fill(0, 255, 0);
  ani.rect(outputSignalX, outputSignalY + (1-output) * gHeight, gapOn3, gHeight*output);
  let targetX = aniWidthOn2 + gapOn2;
  let targetY = aniHeightOn2 - gHeight/2 + gapOn3;//aniHeightOn4 * 3 - gHeight + gapOn4 - mStroke/2;
  ani.fill(255);
  ani.rect(targetX, targetY, gapOn3, gHeight);
  ani.fill(255, 0, 255);
  ani.rect(targetX, targetY + (1-target) * gHeight, gapOn3, gHeight*target);
  let cx = targetX + gap// + gapOn4;
  ani.image(aniLayers['fbl overlay'], 0, 0);
  ani.strokeWeight(mStroke);
  ani.stroke(0);
  ani.push();
  ani.translate(cx, targetY + gHeight/2);
  target = -(QUARTER_PI) + (target - 0.25) * PI;
  ani.rotate(target);
  ani.fill(255, 0, 255);
  ani.circle(0, 0, gap34);
  ani.line(0, 0, 0, -gap34/2);
  ani.pop();
}

function drawCarpentry() {
  if (!('nail' in aniLayers)) {
    aniLayers['nail'] = createGraphics(gap, gap2);
    aniLayers['nail'].stroke(100);
    aniLayers['nail'].fill(100);
    aniLayers['nail'].rectMode(CENTER);
    aniLayers['nail'].rect(gapOn2, 0, gap34, gapOn6);
    aniLayers['nail'].rect(gapOn2, gapOn3*2, gapOn4, gap2-gapOn3);
    aniLayers['nail'].triangle(gapOn2, gap2, gapOn2 - gapOn4/2, gap2-gapOn2, gapOn2 + gapOn4/2, gap2 - gapOn2);
    aniLayers['nail small'] = createGraphics(gapOn2, gap);
    aniLayers['nail small'].push();
    aniLayers['nail small'].scale(0.5, 0.5);
    aniLayers['nail small'].image(aniLayers['nail'], 0, 0);
    aniLayers['nail small'].pop();
  }
}

function intermediary() {
  drawCarpentry();
  ani.clear();
  let per = 500;
  let counter = countTo3(per) % 2;
  let timer = (1.0 - sin(millis()/(per/2)));
  let wh = aniHeightOn3 * 2;
  let nh = wh - gap * counter;
  let hh = wh + gapOn4 - gapOn2*(1.0 - sin(millis()/(per/2)));
  ani.noStroke();
  ani.fill(rCol[0]);
  ani.rect(0, wh, ani.width, ani.height);
  if (counter == 0) {
    ani.fill(255);
    ani.circle(aniWidthOn3 - gap34, wh-gap34, gap2);
  }
  ani.fill(rCol[1]);
  ani.rect(2 * aniWidthOn3, nh - gapOn2, gapOn2, gapOn2);
  ani.fill(100);
  ani.rect(aniWidthOn3 - gap34 - gapOn4, hh - gap - gapOn2, gapOn2, gap);
  ani.rect(2 * aniWidthOn3, hh - gap2, gapOn2, gap);
  ani.fill(rCol[2]);
  ani.rect(aniWidthOn3-gapOn2, hh - (gap + gapOn4/2), gap, gapOn4);
  ani.rect(2 * aniWidthOn3 + gapOn2, hh - gap - gapOn2 - gapOn4/2, gap, gapOn4);
  ani.image(aniLayers['nail small'], aniWidthOn3-gap, nh );
  ani.image(aniLayers['nail small'], 2 * aniWidthOn3, nh);
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  let off = angle - HALF_PI;
  ani.beginShape();
  for (let a = off; a < TWO_PI + off; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    ani.vertex(sx, sy);
  }
  ani.endShape(CLOSE);
}

function selfservice() {
  ani.clear();
  ani.rectMode(CENTER);
  let per = 1000;
  let size = gap34;
  let t = sin(millis()/per);
  let t2 = cos(millis()/per);
  let ramp = (t2 + 1)/2;
  if (t >= 0) {
    ramp = 1 - ramp;
  }
  let iramp = 1-ramp;
  let px = aniWidthOn4*3;
  let py = aniHeightOn2 - gap;
  let rx = aniWidthOn4;
  let drx = px - rx;
  let ry = py + gap2;
  let dry = ry - py;
  ani.noFill();
  ani.stroke(0);
  ani.strokeWeight(mStroke);
  ani.rect(aniWidthOn2, aniHeightOn2, gap3 + gapOn3, gap2)
  ani.line(aniWidthOn2, py, px+gap, py)
  ani.line(gapOn2, ry, rx, ry);
  ani.fill(0);
  ani.triangle(px+gap, py, px + gap34, py-gapOn6, px + gap34, py+gapOn6)
  ani.noStroke();
  // waste
  ani.fill(rCol[1]);
  ani.square(px, py + ramp * gap2, size);
  ani.fill(255);
  ani.circle(px, py + ramp * gap2, size);
  // part
  ani.fill(rCol[1]);
  ani.circle(px + ramp * gap3, py, size);
  ani.square(rx, ry - ramp*dry, size);
  ani.square(rx + drx * ramp, py, size);
  // waste
  ani.fill(rCol[1]);
  ani.square(rx + iramp * drx, ry, size);
  let subSquareSize = 0.85 * size; // sqrt ( Pi (d/2)^2) = sqrt(pi) * (d/2)
  ani.square(rx - iramp * drx, ry, subSquareSize);
  ani.fill(255);
  ani.circle(rx + iramp * drx, ry, size);
  // processors
  ani.fill(rCol[0]);
  ani.square(rx, ry, size*1.5);
  ani.square(aniWidthOn2, py, size*1.5);
  ani.fill(rCol[2]);
  star(aniWidthOn2, py, size/2, size/4, 5);
  polygon(rx, ry, size/2, 3)
  ani.rectMode(CORNER);
}

function drawTrophy(){
  if (!('trophy' in aniLayers)){
    aniLayers['trophy'] = createGraphics(gap, gap2);
    aniLayers['trophy'].noStroke();
    aniLayers['trophy'].fill(255, 200, 0);
    aniLayers['trophy'].circle(gapOn2, gapOn2, gap)
    aniLayers['trophy'].rect(0, 0, gap, gapOn2);
    aniLayers['trophy'].rectMode(CENTER);
    aniLayers['trophy'].rect(gapOn2, gap, gapOn4, gap2);
    aniLayers['trophy'].rect(gapOn2, gap + gapOn2 + gapOn4, gap34, gapOn4);
    aniLayers['trophy'].rect(gapOn2, gap2, gap, gapOn2);
  }
}

function copying(){
  drawTrophy();
  ani.clear();
  ani.imageMode(CENTER);
  ani.noStroke();
  let per = 1000;
  let now = millis();
  let r1 = smoothSquare(per, now);
  let t = cos(millis()/(per / 20));
  let ramp = r1;
  let alarm = 0;
  if (ramp == 0) {
    let cv = t * 100;
    ani.fill(255, 255 - cv, 255 - cv);
    ani.ellipse(aniWidthOn4, aniHeightOn2, aniWidthOn2, ani.height);
    // ani.rect(0, 0, aniWidthOn2, ani.height);
    alarm = sin(millis()/(per/2));
  }
  let tx = aniWidthOn4 - gap + gap*ramp;
  let tx2 = tx + aniWidthOn2;
  let ty = aniHeightOn3;
  ani.image(aniLayers['trophy'], tx, ty);
  ani.image(aniLayers['trophy'], tx2, ty);
  ani.fill(100);
  let bsx = tx2 + gap34;
  ani.rect(tx2 + gap34, ty, gap34, gap, gap, gapOn4, gapOn3, gapOn6);
  bsx += gap34;
  ani.triangle(bsx, ty-gapOn6, bsx - gapOn6, ty + gapOn3, bsx + gapOn6, ty);
  let pw = gap;
  let ph =  gap;
  let px = aniWidthOn4 - pw/2;
  let px2 = px + aniWidthOn2;
  let py = aniHeightOn3 + aniLayers['trophy'].height/2;
  ani.fill(rCol[1]);
  ani.rect(px, py - alarm * gapOn2, gap, gapOn4);
  ani.rect(px + gapOn4, py - alarm * gapOn2, gapOn2, gap);
  ani.rect(px2, py, gap, gapOn4);
  ani.fill(rCol[0]);
  ani.rect(px, py + gapOn4, gap, gap);
  ani.rect(px2, py + gapOn4, gap, gap);
  ani.stroke(0);
  ani.strokeWeight(mStroke);
  let sx = px + gapOn4;
  let ex = px + gap34;
  let sx2 = px + gapOn4 + aniWidthOn2;
  let ex2 = px + gap34 + aniWidthOn2;
  let sy = py + gap + gapOn4 - mStroke;
  let inc = (py  - sy)/4;
  for (let i = 0; i <=3; i++) {
    ani.line(sx2, sy, ex2, sy);
    sy += inc;
  }
  sy = py + gap + gapOn4 - mStroke;
  inc = ((py - alarm * gapOn2) - sy)/4;
  for (let i = 0; i <=3; i++) {
    ani.line(sx, sy, ex, sy);
    sy += inc;
  }
  ani.imageMode(CORNER);
}

function cheapshort() {
  ani.clear();
  ani.noStroke();
  let per = 500;
  let now = millis();
  let timer = now/per;
  let index = countTo3(per, 0, now);
  let tri = abs((timer % 4) - 2)/2;
  let tri2f = abs(((timer / 8) % 4) - 2);
  let tri3 = int (4 * abs((((timer / 8) + per/8) % 4) - 2));
  let tri2 = int(2 * tri2f)
  let offsets = [0, -gap - gapOn2, gap + gapOn2, 0];
  let cx = tri * (ani.width - gap2) + gap;
  let cy;
  // cheap
  if (tri2 == 3) {
    if (tri <= 0.05) {
      ani.fill(rCol[3]);
    } else {
      ani.fill(rCol[2]);
    }
    if (tri3 != 3 && tri3 != 4) {
      ani.rect(gapOn2, aniHeightOn2 + offsets[1] - gapOn2, gapOn4, gap);
    }
    ani.fill(rCol[0]);
    cy = aniHeightOn2 - gapOn2 + (1-tri) * offsets[1] + gapOn2;
    ani.circle(cx, cy, gapOn2);
  }
  if (tri2 == 0) {
    if (tri <= 0.05) {
      ani.fill(rCol[3]);
    } else {
      ani.fill(rCol[2]);
    }
    if (tri3 != 3 && tri3 != 4) {
      ani.rect(gapOn2, aniHeightOn2 + offsets[1] - gapOn2, gapOn4, gap);
      ani.rect(gapOn2, aniHeightOn2 + offsets[2] - gapOn2, gapOn4, gap);
    }
    ani.fill(rCol[0]);
    cy = aniHeightOn2 - gapOn2 + (1-tri) * offsets[1] + gapOn2;
    ani.circle(cx, cy, gapOn2);
    cy = aniHeightOn2 - gapOn2 + (1-tri) * offsets[2] + gapOn2;
    ani.circle(cx, cy, gapOn2);
  }
  // ball(s)
  ani.fill(rCol[0]);
  cy = aniHeightOn2 - gapOn2 + (1-tri) * offsets[tri2] + gapOn2;
  ani.circle(cx, cy, gapOn2);
  // wall
  ani.fill(rCol[1]);
  ani.rect(ani.width - gap34, 0, gapOn2, ani.height);
  // paddle
  let px = aniHeightOn2 - gapOn2 + (1-tri) * offsets[tri2];
  ani.rect(gapOn4, px, gapOn2, gap);
}

function mechanicalsubstitution(){
  ani.clear();
  ani.noStroke();
  ani.rectMode(CENTER);
  let per = 2000;
  let currentAngle = (TWO_PI * millis()/per) % TWO_PI;
  let coscurrentAngle = cos(currentAngle);
  let sincurrentAngle = sin(currentAngle);
  let c1 = color(255, 0, 0);
  let c2 = color(0, 0, 255);
  //brushed()
  ani.push();
  ani.translate(aniWidthOn4 - gapOn6, aniHeightOn2);
  ani.fill(c1);
  ani.rect(-gap, 0, gapOn4, gap3);
  ani.fill(c2);
  ani.rect(gap, 0, gapOn4, gap3);
  ani.rotate(currentAngle);
  if (sincurrentAngle < 0) {
    [c1, c2] = [c2, c1];
  }
  ani.fill(c1);
  let xoff = gap34/2;
  ani.rect(-xoff, 0, gap34, gapOn2);
  ani.fill(c2);
  ani.rect(xoff, 0, gap34, gapOn2);
  ani.arc(0, 0, gap34, gap34, PI, 0);
  ani.fill(c1);
  ani.arc(0, 0, gap34, gap34, 0, PI);
  ani.fill(255);
  ani.rect(0, 0, gap34, gapOn6/2);
  ani.pop();
  ani.strokeWeight(mStroke);
  ani.stroke(0);
  let yend = gapOn2;
  let x1 = aniWidthOn4-xoff - gapOn6;
  let x2 = aniWidthOn4+xoff - gapOn6;
  ani.line(x1, aniHeightOn2, x1, yend);
  ani.line(x2, aniHeightOn2, x2, yend);
  ani.noStroke();
  ani.fill(255, 230, 0);
  ani.circle(x1, aniHeightOn2, gapOn4);
  ani.circle(x2, aniHeightOn2, gapOn4);
  ani.fill(255, 0, 0);
  ani.circle(x1, yend, gapOn2);
  ani.fill(0, 0, 255);
  ani.circle(x2, yend, gapOn2);
  //brushless
  let xc = ani.width - aniWidthOn4 + gapOn6;
  let xy = aniHeightOn2 + gapOn2;
  let radius = gap2;
  ani.strokeWeight(mStroke);
  ani.stroke(0);
  xoff = gap + gapOn6;
  x1 = xc-xoff;
  x2 = xc;
  let x3 = xc+xoff;
  ani.line(x1, gapOn2, x1, xy + 0.35 * aniHeightOn4);
  ani.line(x2, gapOn2, x2, xy - aniHeightOn4);
  ani.line(x3, gapOn2, x3, xy + 0.35 * aniHeightOn4);
  ani.noStroke();
  redC = color(255, 0, 0);
  blueC = color(0, 0, 255);
  off = color(100);
  let stators = [];
  stators.push([[off, off], [blueC, redC], [redC, blueC]]);
  stators.push([[redC, blueC], [blueC, redC], [off, off]]);
  stators.push([[redC, blueC], [off, off], [blueC, redC]]);
  stators.push([[off, off], [redC, blueC], [blueC, redC]]);
  stators.push([[blueC, redC], [redC, blueC], [off, off]]);
  stators.push([[blueC, redC], [off, off], [redC, blueC]]);
  stators.push([[off, off], [blueC, redC], [redC, blueC]]);
  let phase = round(currentAngle);
  ani.fill(stators[phase][0][0]);
  ani.circle(x2, gapOn2, gapOn2);
  ani.fill(stators[phase][1][0]);
  ani.circle(x3, gapOn2, gapOn2);
  ani.fill(stators[phase][2][0]);
  ani.circle(x1, gapOn2, gapOn2);
  let rotations = [0, TWO_PI/3, 2*TWO_PI/3];
  for (let i = 0; i < 3; i++) {
    ani.push();
    ani.translate(xc, xy);
    ani.rotate(rotations[i]);
    ani.fill(stators[phase][i][0]);
    ani.rect(0, - aniHeightOn4, gapOn2, gapOn4);
    ani.fill(stators[phase][i][1]);
    ani.rect(0, -aniHeightOn4 - gapOn4, gapOn2, gapOn4);
    ani.pop();
  }
  ani.push();
  ani.translate(xc, xy);
  ani.rotate(currentAngle);
  ani.fill(redC);
  let arad = gap + gapOn2;
  ani.arc(0, 0, arad, arad, PI, 0);
  ani.fill(blueC);
  ani.arc(0, 0, arad, arad, 0, PI);
  ani.fill(255);
  ani.circle(0, 0, gap34);
  ani.pop();
  ani.stroke(200);
  ani.line (aniWidthOn2, 0, aniWidthOn2, ani.height);
}
