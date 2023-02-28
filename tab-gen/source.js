var stringCount = 4;

var dpi = 300;
var docWidth = 2550;
var docHeight = 3300;
var tabSpacing = 0.15 * 300;
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

function sleep(millisecondsDuration) {
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
    noteStrings = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    next();
  }
  if (key == '6') {
    clear();
    stringCount = 6;
    setupScreen();
    noteStrings = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    next();
  }
  if (key == '7') {
    clear();
    stringCount = 7;
    setupScreen();
    noteStrings = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    next();
  }
  if (key == '8') {
    clear();
    stringCount = 8;
    setupScreen();
    noteStrings = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    next();
  }

}

async function autoExport() {
  let i = 0;
  while (i != 24) {
    saveImg();
    await sleep(1000);
    next();
    await sleep(2000);
    i++;
  }
}

function setupScreen() {
  pg.clear();


  chordBoxImg = createGraphics((stringCount) * tabSpacing, (chordBoxFretCount - 1) * fretSpacing);
  for (let i = 1; i < (stringCount * tabSpacing); i+= tabSpacing) {
    chordBoxImg.line(int(i), 0, int(i), int(chordBoxImg.height));
  }
  chordBoxImg.line(0, 1, int(chordBoxImg.width-tabSpacing+1), 1);
  chordBoxImg.line(0, int(chordBoxImg.height-1), int(chordBoxImg.width-tabSpacing+1), int(chordBoxImg.height-1));

  for (let i = fretSpacing; i < (chordBoxFretCount - 1) * fretSpacing - 2; i += fretSpacing) {
    chordBoxImg.line(0, int(i), int(chordBoxImg.width-tabSpacing+1), int(i));
  }
  let chordBoxWithPadding = chordBoxImg.width + tabSpacing
  var numberThatCanFit = floor(docWidth / chordBoxWithPadding);
  chordBoxGroup = createGraphics(numberThatCanFit * (chordBoxWithPadding) - tabSpacing * 2 + 4, chordBoxImg.height + 1);
  
  for (let j = 0; j <= numberThatCanFit-1; j++) {
    chordBoxGroup.image(chordBoxImg, int(j * chordBoxWithPadding), 0);
  }
  pg.imageMode(CENTER);
  pg.image(chordBoxGroup, pg.width/2, tabSpacing + chordBoxGroup.height/2);
  pg.imageMode(CORNER);

  tabImg = createGraphics(docWidth, (stringCount-1) * tabSpacing + 2);
  // tabImg.background(255, 255, 200);
  for (let i = 1; i < (stringCount * tabSpacing); i+= tabSpacing) {
    tabImg.line(0, int(i), docWidth, int(i));
  }
  let totalHeight = tabImg.height + tabSpacing;
  let start = chordBoxImg.height + 4*tabSpacing;
  let vSpace = docHeight - start;
  let fit = floor(vSpace/totalHeight) - 1;
  console.log(fit);
  let gap = (docHeight - fit * totalHeight) / fit;
  while (start + totalHeight < docHeight) {
    pg.image(tabImg, 0, int(start));
    start += totalHeight + gap;
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
    tb.text(noteStrings[i], int(spacing/4), int(i * spacing + spacing - spacing/4));
    tb.noFill();
    tb.square(1, int(i * spacing + 1), int(spacing));
    tb.fill(0);
  }
  return tb;
}

function transposeTool() {
  let tb = makeTextBoxes();
  let left = 2;
  let right = docWidth - left - tb.width
  if (leftRightCounter % 2 == 1) {
    console.log('left');
    pg.image(tb, int(left), int((docHeight - tb.height)/2));
  } else {
    console.log('right');
    pg.image(tb, int(right), int((docHeight - tb.height)/2));
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
  image(pg, 0, 0, docWidth/3, docHeight/3);
}
