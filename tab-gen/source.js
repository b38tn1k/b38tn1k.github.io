var stringCount = 4;

var dpi = 300;
var docWidth = 2550;
var docHeight = 3300;
var tabSpacing = 0.14 * 300;
var fretSpacing = 1.5 * tabSpacing;
var chordBoxFretCount = 5
var noteStrings = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
var pg;
var leftRightCounter = 0;

function saveImg() {
  var img = createImage(pg.width, pg.height);
    img.copy(pg, 0, 0, pg.width, pg.height, 0, 0, pg.width, pg.height);
    let myStr = String(stringCount) + "string_page" + String(leftRightCounter);
    img.save(myStr, 'png'); 
    console.log('saved');
    return true;
}

function next() {
  clear();
  setupScreen();
  transposeTool();
  return true;
}

function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}

function keyPressed() {
  if (key == 's') {
    saveImg();
  }
  if (key == ' ') {
    next();
  }
  if (key == 'a') {
    autoExport();
  }
  if (key == '4') {
    clear();
    stringCount = 4;
    setupScreen();
  }
  if (key == '6') {
    clear();
    stringCount = 6;
    setupScreen();
  }
  if (key == '7') {
    clear();
    stringCount = 7;
    setupScreen();
  }
  if (key == '8') {
    clear();
    stringCount = 8;
    setupScreen();
  }

}

async function autoExport() {
  noteStrings = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
  let stringCounts = [4, 6, 7, 8];
  for (let j = 0; j < stringCounts.length; j++) {
    stringCount = stringCounts[j];
    let i = 0;
    while (i != 24) {
      // await sleep(2000);
      // saveImg();
      await sleep(500);
      next();
      i++;
    }
  }
}

function setupScreen() {
  pg.clear();
  chordBoxImg = createGraphics((stringCount) * tabSpacing, (chordBoxFretCount - 1) * fretSpacing);
  for (let i = 1; i < (stringCount * tabSpacing); i+= tabSpacing) {
    chordBoxImg.line(i, 0, i, chordBoxImg.height);
  }
  chordBoxImg.line(0, 1, chordBoxImg.width-tabSpacing+1, 1);
  chordBoxImg.line(0, chordBoxImg.height-1, chordBoxImg.width-tabSpacing+1, chordBoxImg.height-1);
  for (let i = fretSpacing; i < (chordBoxFretCount - 1) * fretSpacing - 2; i += fretSpacing) {
    chordBoxImg.line(0, i, chordBoxImg.width-tabSpacing+1, i);
  }
  let chordBoxWithPadding = chordBoxImg.width + tabSpacing
  var numberThatCanFit = floor(docWidth / chordBoxWithPadding);
  chordBoxGroup = createGraphics(numberThatCanFit * (chordBoxWithPadding) - tabSpacing * 2 + 4, chordBoxImg.height + 1);
  
  for (let j = 0; j <= numberThatCanFit-1; j++) {
    chordBoxGroup.image(chordBoxImg, j * chordBoxWithPadding, 0);
  }
  pg.imageMode(CENTER);
  pg.image(chordBoxGroup, pg.width/2, tabSpacing + chordBoxGroup.height/2);
  pg.imageMode(CORNER);

  tabImg = createGraphics(docWidth, (stringCount + 1) * tabSpacing);
  for (let i = 1; i < (stringCount * tabSpacing); i+= tabSpacing) {
    tabImg.line(0, i, docWidth, i);
  }
  let totalHeight = tabImg.height + tabSpacing;
  var i = chordBoxImg.height + 3*tabSpacing;
  while (i + totalHeight < docHeight) {
    pg.image(tabImg, 0, i);
    i += totalHeight;
  }
}

function shuffleNoteStrings() {
  noteStrings.push(noteStrings.shift());
}

function makeTextBoxes() {
  fontSize = 32;
  spacing = fontSize * 2
  let tb = createGraphics(spacing + 2, spacing * 12 + spacing/4 + 3);
  tb.background(255, 255, 255);
  tb.textSize(fontSize);
  for (let i = 0; i < 12; i++) {
    tb.text(noteStrings[i], spacing/4, i * spacing + spacing - spacing/4);
    tb.noFill();
    tb.square(1, i * spacing + 1, spacing);
    tb.fill(0);
  }
  return tb;
}

function transposeTool() {
  let tb = makeTextBoxes();
  if (leftRightCounter % 2 == 1) {
    console.log('left');
    pg.image(tb, 2, (docHeight - tb.height)/2);
  } else {
    console.log('right');
    pg.image(tb, docWidth - 2 - tb.width, (docHeight - tb.height)/2);
    shuffleNoteStrings();
  }
  leftRightCounter += 1;
}

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(docWidth, docHeight);
  setupScreen();
  next();
}

function draw() {
  image(pg, 0, 0);
}
