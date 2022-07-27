
var widthOnTwo, heightOnTwo;
var card, cardDeck;
var cards, index;
var textX, textY, textW;
var newInfo;
var cardslength = 3;

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
  console.log(cards.length);
}

function chooseIndex(){
  index = int(random(0, cardslength));
  newInfo = true;
  console.log(index);
}

function setupScreen() {
  chooseIndex();
  createCanvas(windowWidth, windowHeight);
  widthOnTwo = windowWidth / 2;
  heightOnTwo = windowHeight / 2;
  drawCard();
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
  let off = rad * 0.25;
  cardDeck.clear();
  cardDeck.rectMode(CENTER);
  cardDeck.noStroke();
  let c = [[0, 0, 255],[0, 255, 255],[0, 255, 0],[255, 255, 0],[255, 0, 0],[255, 255, 255]];
  let px = widthOnTwo + (c.length * off);
  let py = heightOnTwo + (c.length * off);
  for (let i = 0; i < c.length; i++) {
    cardDeck.fill(color(c[i]));
    px -= off;
    py -= off;
    cardDeck.rect(int(px), int(py), w, h, rad);
  }
  card.rectMode(CENTER);
  card.noStroke();
  card.fill(255);
  card.rect(int(px), int(py), w, h, rad);
  card.stroke(0);
  card.strokeWeight(off);
  card.rect(int(px), int(py), w - rad, h - rad, rad * 0.6);
  let l1 = px - w * 0.45;
  let l2 = px + w * 0.45;
  card.line(l1, py, l2, py);
  textX = l1;
  textY = py + off;
  textW = 0.9 * w;
}

function setup() {
  setupScreen();
  textAlign(LEFT, TOP);
  newInfo = true;
}

function draw() {
  if (newInfo == true) {
    image(cardDeck, 0, 0);
    image(card, 0, 0);
    textSize(32);
    text(cards[index]['title'], textX, textY, textW);
    textSize(16);
    text(cards[index]['text'], textX, textY + 40, textW);
    newInfo = false;
  }

}
