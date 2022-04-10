// Look and Layout
var versionString = 'version 0.2 - b38tn1k.com - see help for details';
var colors = []
var colorfuls = [5, 54];
var barColor = [];
var plusTrackButton, exitNewItemMenuButton, addNewItemButton, clearButton, demoButton, deleteButton, screenShotButton, saveButton, loadButton, helpButton;
var c, gr, grBg, menuBg, border, viewport;
var barPixelOffset = 30;
var barPixelHeight = 20;
var barPixelStartY = 40;
var screenshot = false;
var scrollX = 0;
// Audio and Math
var maxFreq = 22000;
var majors = [100, 1000, 10000];
var majorSpacing = [0.15, 0.5, 0.85];
var areas = [['sub', 1, 60],['low', 60, 300],['mid', 300, 2000], ['hi-mid', 2000, 5500], ['hi', 5500, maxFreq]];
var freqLookup = [];
var clips = [];
var mouseFreq = 0;
// Menu
var newItemMenuOpen = false;
var loadMenuOpen = false;
var deleteModeOn = false;
var inputError = false;
var showHelp = false;
var clickOnGraphCounter = 0;
// Data
var llHead;
var llCursor; // so it didnt need this in the end but it is here / breaking if removed for now.
var nameInput, lowInput, highInput, midInput, loadInput;
var tempName, tempLow, tempHigh, tempMid;

class FrequencyRanger {
  constructor(name=null, low=null, mid=null, high=null) {
    this.name = name;
    this.low = low;
    this.mid = mid;
    this.high = high;
    this.width = high - low;
    let rc = int(random(colorfuls[0], colorfuls[1]));
    this.color = colors[rc];
    this.neighbours = [];
    this.pixelX = freqToX(low)
    this.pixelM = freqToX(mid)
    this.pixelW = freqToX(high) - freqToX(low);
    this.pixelX = null;
    this.pixelY = null;
    this.pixelW = null;
    this.pixelH = null;
    this.pixelM = null;
    this.parent = null;
    this.child = null;
  }
}

function preload() {
  c = loadStrings('nintendo-entertainment-system.hex');
}

function setup() {
  // pixelDensity(5);
  nameInput = createInput('');
  lowInput = createInput('');
  midInput = createInput('');
  highInput = createInput('');
  loadInput = createInput('');
  colorSetup();
  pageSetup();
  frameRate(24);
  llHead = new FrequencyRanger('root');
  llCursor = llHead;
}

function deviceTurned() {
  pageSetup();
  pixelMatchRangers();
}

function mousePressed() {
  if ((mouseY > 2*border + menuBg.height) && (mouseY < 2*border + menuBg.height + 50)) {
    clickOnGraphCounter += 1;
    // console.log(clickOnGraphCounter);
  }
  showHelp = false;
  let mx = mouseX;
  let my = mouseY;
  if (buttonPressed(plusTrackButton, mx, my)){
      newItemMenuOpen = true;
      clickOnGraphCounter = 0;
      loadMenuOpen = false;
      return false;
  } else if (buttonPressed(exitNewItemMenuButton, mx, my)) {
    if (newItemMenuOpen === true){
      newItemMenuOpen = false;
      clickOnGraphCounter = 0;
      clearInput(lowInput);
      clearInput(midInput);
      clearInput(highInput);
      clearInput(nameInput);
    } else {
      loadMenuOpen = false;
    }

    return false;
  } else if (buttonPressed(addNewItemButton, mx, my)) {
    if (newItemMenuOpen === true){
      addNewItemCallback();
    } else if (loadMenuOpen === true) {
      // mystring = 'BG weight|60|80|100*BG growl|500|600|700*BG snap|2000|2500|3000*BG pres|6000|6500|7000*BD punch|40|60|80*BD box|300|400|500*BD click|3000|5000|7000*SD girth|150|200|250*SD box|300|400|500*SD bark|700|850|1000*SD crisp|3500|6000|7400*SD snap|7500|11000|15000*HH body|300|400|500*HH siz|4000|5000|6000*HH overtones|7500|11000|15000*CYM meat|280|320|400*CYM siz|2000|3500|5000*CYM overtones|6000|12000|18000*EG girth|200|400|600*EG pres|1000|2000|3000*EG buzz|3500|5000|6500*AG bloom|50|75|110*AG body|200|300|400*AG pres|2000|3000|5000*ORG bloom|50|75|110*ORG body|200|300|400*ORG pres|2000|3000|5000*PIANO bloom|40|80|120*PIANO pres|3000|4000|5000*PIANO overtones|8000|13000|18000*'
      mystring = String(loadInput.value());
      loadThing(mystring);
      loadMenuOpen = false;
    }
    return false;
  } else if (buttonPressed(clearButton, mx, my)) {
    llHead = new FrequencyRanger('root');
    llCursor = llHead;
    return false;
  } else if (buttonPressed(demoButton, mx, my)) {
    llHead = new FrequencyRanger('root');
    llCursor = llHead;
    drawDemo();
    return false;
  } else if (buttonPressed(deleteButton, mx, my)) {
    deleteModeOn = !deleteModeOn;
    return false;
  } else if (buttonPressed(screenShotButton, mx, my)) {
    screenshot = true;
    return false;
  } else if (buttonPressed(saveButton, mx, my)) {
    saveThing();
    return false;
  } else if (buttonPressed(loadButton, mx, my)) {
    loadMenuOpen = true;
    return false;
  } else if (buttonPressed(helpButton, mx, my)) {
    showHelp = true;
    window.open("https://b38tn1k.com/mixtool/help");
    // console.log(windowWidth);
    return false;
  }
  if (deleteModeOn) {
    let temp = llHead;
    while (!(temp === null)){
      if (!(temp.low === null)) {
        if (checkClipClicked(temp, mx, my)) {
          for (let i = 0; i < temp.neighbours.length; i++) {
            temp.neighbours[i].pixelY = temp.pixelY;
          }
          let parent = temp.parent;
          let child = temp.child;
          parent.child = child;
          if (!(child === null)) {
            child.parent = parent;
          } else {
            llCursor = parent;
          }
          if (!(temp === null)){
            for (let i = 0; i < temp.neighbours.length; i++) {
              temp.neighbours[i].pixelY = temp.pixelY;
            }
          }
          // deleteModeOn = false;
          pixelMatchRangers();
          // printList()
          return false;
        }
      }
      temp = temp.child;
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER || keyCode === RETURN){
    if (newItemMenuOpen) {
      addNewItemCallback();
    } else {
      newItemMenuOpen = true;
    }
  }
}

function draw() {
  gr.textAlign();
  background(colors[0]);
  noStroke();
  fill(colors[4]);
  text(versionString, int(border), int(windowHeight - border/2));
  gr.image(grBg, 0, 0);
  // draw the freq at mouse position
  mouseFreq = xToFreq(mouseX);
  if (mouseFreq > 0) {
    gr.textAlign(RIGHT);
    gr.fill(colors[2]);
    if (mouseFreq >= 1000){
      gr.text((mouseFreq/1000).toFixed(2) + ' kHz', int(gr.width) - 4, int(gr.height) - 12);
    } else {
      gr.text(mouseFreq + ' Hz', int(gr.width) - 20, int(gr.height) - 12);
    }
    gr.textAlign(LEFT);
  }
  // draw the 'new audio' button
  gr.textAlign(LEFT, CENTER);
  plusTrackButton = drawButton(gr, '+ zone', 4, int(gr.height) - 24, 40, 20, border, border);
  deleteButton = drawButton(gr, 'delete', 50, int(gr.height) - 24, 40, 20, border, border, deleteModeOn, colors[23]);
  clearButton = drawButton(gr, 'clear all', 96, int(gr.height) - 24, 50, 20, border, border);
  demoButton = drawButton(gr, 'demo', 152, int(gr.height) - 24, 40, 20, border, border);
  screenShotButton = drawButton(gr, 'screenshot', 198, int(gr.height) - 24, 70, 20, border, border);
  saveButton = drawButton(gr, 'save', 274, int(gr.height) - 24, 40, 20, border, border);
  loadButton = drawButton(gr, 'load', 320, int(gr.height) - 24, 40, 20, border, border);
  helpButton = drawButton(gr, 'help', 366, int(gr.height) - 24, 40, 20, border, border);
  let temp = llHead;
  while (!(temp === null)){
    if (!(temp.low === null)) {
      if ((temp.pixelY + 2*temp.pixelH) < int(gr.height)){
        gr.stroke(temp.color);
        gr.fill(temp.color);
        gr.rect(temp.pixelX, temp.pixelY, temp.pixelW, temp.pixelH);
        gr.strokeWeight(3);
        gr.line(temp.pixelM, temp.pixelY - 10, temp.pixelM, temp.pixelY + temp.pixelH + 10);
        gr.fill(colors[0]);
        gr.noStroke();
        gr.text(temp.name, int(temp.pixelX), int(temp.pixelY + temp.pixelH/2));
      }
    }
    temp = temp.child;
  }
  gr.noStroke();

  if (newItemMenuOpen) {
    gr.image(menuBg, int(border), int(border));
    exitNewItemMenuButton = drawButton(gr, 'exit', border + menuBg.width - 34, border+ 4, 30, 20, border, border);
    addNewItemButton = drawButton(gr, 'add', border + menuBg.width - 34, border + menuBg.height - 24, 30, 20, border, border);
    let y_off = 2*border + menuBg.height/16;
    let ytoff = int(border) + menuBg.height/6;
    let x_off = 2*border + menuBg.width/3;
    nameInput.position(x_off - scrollX, y_off);
    gr.noStroke();
    gr.fill(colors[2]);
    if ((mouseY > 2*border + menuBg.height) && (mouseY < 2*border + menuBg.height + 50)) {
      if (clickOnGraphCounter % 4 == 0) {
        lowInput.value(xToFreq(mouseX));
      } else if (clickOnGraphCounter % 4 == 1) {
        midInput.value(xToFreq(mouseX));
      } else if (clickOnGraphCounter % 4 == 2) {
        highInput.value(xToFreq(mouseX));
      } else if (clickOnGraphCounter % 4 == 3) {
        // highInput.value(xToFreq(mouseX));
      }
    }
    gr.fill(barColor[clickOnGraphCounter % 4]);
    gr.rect(0, 2*border + menuBg.height-25, gr.width, 50);
    gr.fill(colors[2]);
    // gr.textAlign(RIGHT, BOTTOM);
    gr.text('name.........................................', int(border) + 4, int(ytoff));
    y_off += menuBg.height/4;
    ytoff += menuBg.height/4;
    lowInput.position(x_off - scrollX, y_off);
    gr.text('bass extent (hz).........................................', int(border) + 4, int(ytoff));
    y_off += menuBg.height/4;
    ytoff += menuBg.height/4;
    midInput.position(x_off - scrollX, y_off);
    gr.text('center freq (hz).........................................', int(border) + 4, int(ytoff));
    y_off += menuBg.height/4;
    ytoff += menuBg.height/4;
    highInput.position(x_off - scrollX, y_off);
    gr.text('treble extent (hz).........................................', int(border) + 4, int(ytoff));
    gr.textAlign(LEFT, CENTER);
  } else {
    nameInput.position(windowWidth, windowHeight);
    lowInput.position(windowWidth, windowHeight);
    highInput.position(windowWidth, windowHeight);
    midInput.position(windowWidth, windowHeight);
  }
  if (loadMenuOpen){
    gr.textAlign(LEFT, BOTTOM);
    gr.image(menuBg, int(border), int(border));
    exitNewItemMenuButton = drawButton(gr, 'exit', border + menuBg.width - 34, border+ 4, 30, 20, border, border);
    addNewItemButton = drawButton(gr, 'load', border + menuBg.width - 34, border + menuBg.height - 24, 30, 20, border, border);
    let y_off = 2*border + menuBg.height/16;
    let x_off = 2*border + menuBg.width/3;
    loadInput.position(x_off - scrollX, y_off);
    // gr.textAlign(RIGHT, BOTTOM);
    gr.text('Load String.........................................', int(border + 4), int(y_off-6));
    y_off += 100;
    gr.text('Open your save file in a web browser\nCopy / paste your load string above\nThis website is just hosted on GitHub pages,\n so I don\'t think you can upload or download files. \nand you def can\'t have user profiles :-/', int(border + 4), int(y_off-6));

  } else {
    loadInput.position(windowWidth, windowHeight);
    loadInput.value('');
  }
  if (screenshot) {
    gr.noStroke();
    gr.fill(colors[4]);
    gr.rect(0, int(gr.height) - 28, int(gr.width), 30);
  }
  if (keyIsDown(LEFT_ARROW)){
    scrollLeft();
  }
  if (keyIsDown(RIGHT_ARROW)){
    scrollRight();
  }
  viewport.image(gr, 0, 0, viewport.width, viewport.height, int(scrollX), 0, viewport.width, viewport.height);
  image(viewport, int(border), int(border));
  if (screenshot) {
    let timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
    save(timestamp+".png");
    screenshot = false;
  }
}
function scrollLeft() {
  if (scrollX > 0){
    scrollX -= 1;
    // scrollX = max(0, scrollX-1);
  }
}

function scrollRight() {
  if (scrollX + viewport.width < freqToX(maxFreq)) {
    scrollX += 1;
  }
}

function pixelMatchRangers() {
  sortLL();
  for (let dothismultipletimes = 0; dothismultipletimes < 2; dothismultipletimes++) {
    let temp = llHead;
    let n = 'abracadabra'; //magic way to be lazy with string checking, just dont name anything abracadabra I guess.
    while (!(temp === null)){
      if (!(temp.low === null)) {
        temp.pixelX = freqToX(temp.low)
        temp.pixelM = freqToX(temp.mid)
        temp.pixelW = freqToX(temp.high) - temp.pixelX;
        n = temp.name.split(' ')[0];
      }
      let t2 = temp.child;
      let off;
      while (!(t2 === null)){
        off = false;
        if (!(t2.low === null)) {
          // colors
          if (t2.name.split(' ')[0] === n) {
            t2.color = temp.color;
          }

          // offsets
          if (t2.low <= temp.low && t2.high >= temp.low) {
            off = true;
          } else if (t2.low <= temp.high && t2.high >= temp.high) {
            off = true;
          } else if (t2.low >= temp.low && t2.high <= temp.high) {
            off = true;
          } else if (t2.low <= temp.high && t2.high >= temp.high) {
            off = true;
          }
          if (off){
            if (t2.pixelY === temp.pixelY) {
              t2.pixelY += barPixelOffset;
              temp.neighbours.push(t2);
            }
          }
          t2 = t2.child;
        }
      }
      temp = temp.child;
    }
  }
}

function drawButton(layer, label, x, y, w, h, offx, offy, fill = false, fcolor = null){
  layer.strokeWeight(1)
  if (fill === true) {
    layer.fill(fcolor);
  } else {
    layer.noFill();
  }
  layer.stroke(colors[2]);
  layer.rect(x, y, w, h);
  layer.noStroke();
  layer.fill(colors[2]);
  layer.text(label, x + 2, y + int((h / 2) + 4));
  let xs = int(x + offx);
  let xe = int(x + w + border);
  let ys = int(y + offy);
  let ye = int(y + h + offy);
  return [[xs, xe], [ys, ye]];
}

function checkClipClicked(node, mx, my) {
  clicked = false;
  let xmin = border + node.pixelX;
  let xmax = border + node.pixelX + node.pixelW;
  let ymin = border + node.pixelY;
  let ymax = border + node.pixelY + node.pixelH;
  if (mx > xmin- scrollX && mx < xmax- scrollX) {
    if (my > ymin && my < ymax) {
      clicked = true;
    }
  }
  return clicked
}

function buttonPressed(button, mx, my){
  let pressed = false;
  if (mx > button[0][0]- scrollX && mx < button[0][1]- scrollX) {
    if (my > button[1][0] && my < button[1][1]){
      pressed = true;
    }
  }
  return pressed;
}

function windowResized() {
  scrollX = 0;
  pageSetup();
  pixelMatchRangers();
}

function colorSetup() {
  for (let i = 0; i < c.length; i++) {
    colors.push(color('#' + c[i]));
  }
  delete c;
}

function pageSetup() {
  // can I do something hear to determine is screen to small?
  border = min(0.05*windowWidth, 0.05*windowHeight);
  let x = (windowWidth - 2*border);
  let y = (windowHeight - 2*border);
  createCanvas(windowWidth, windowHeight);
  viewport = createGraphics(x, y);
  x = max(600, x);
  // x = max(1000, x);
  gr = createGraphics(x, y);
  gr.noStroke();
  grBg = createGraphics(x, y);
  drawGraphBackground();
  plusTrackButton = [[0, 0], [0, 0]];
  exitNewItemMenuButton = [[0, 0], [0, 0]];
  addNewItemButton = [[0, 0], [0, 0]];
  deleteButton = [[0, 0], [0, 0]];
  clearButton = [[0, 0], [0, 0]];
  demoButton = [[0, 0], [0, 0]];
  screenShotButton = [[0, 0], [0, 0]];
  saveButton = [[0, 0], [0, 0]];
  loadButton = [[0, 0], [0, 0]];
  helpButton = [[0, 0], [0, 0]];
  x = 300
  y = 150;
  menuBg = createGraphics(x, y);
  drawMenuBackground();
  scrollX = 0;
  // color(c1.levels)
  let c  = color(colors[10].levels);
  c.setAlpha(100);
  barColor.push(c);
  c  = color(colors[15].levels);
  c.setAlpha(100);
  barColor.push(c);
  c  = color(colors[20].levels);
  c.setAlpha(100);
  barColor.push(c);
  c  = color(colors[40].levels);
  c.setAlpha(100);
  barColor.push(c);

}

function drawMenuBackground() {
  menuBg.background(colors[4]);
  menuBg.fill(colors[4]);
  menuBg.strokeWeight(1);
  menuBg.stroke(colors[2]);
  menuBg.rect(1, 1, menuBg.width-2, menuBg.height-2);
}

function xToFreq(x) {
  freq = 0;
  if (x > border && x < grBg.width + border) {
    pos = int(x - border + scrollX);
    freq = freqLookup[pos];
  }
  return freq;
}

function freqToX(value) {
  let w = grBg.width;
  let v = Math.log(value);
  let m;
  if (value <= majors[0]) {
    m = map(v, 1, Math.log(majors[0]), 0, majorSpacing[0]*w);
  } else if (value > majors[0] && value <= majors[1]) {
    m = map(v, Math.log(majors[0]), Math.log(majors[1]), majorSpacing[0]*w, majorSpacing[1]*w);
  } else if (value > majors[1] && value <= majors[2]) {
    m = map(v, Math.log(majors[1]), Math.log(majors[2]), majorSpacing[1]*w, majorSpacing[2]*w);
  } else {
    m = map(v, Math.log(majors[2]), Math.log(maxFreq), majorSpacing[2]*w, w);
  }
  return m;
}

function makeXAxes() {
  let vals = [];
  let i = 0;
  let j = 0;
  let pow = 1;
  while (i < 22000) {
    if (j == 9) {
      j = 0;
      pow += 1
    }
    j += 1;
    i = j * 10 ** pow;
    vals.push(i);
  }
  vals = vals.slice(0, -1);
  vals.push(25000);
  return vals;
}

function drawGraphBackground() {
  // grBg.background(colors[4]);
  grBg.noStroke();
  grBg.textAlign(CENTER);
  for (let j = 0; j < areas.length; j++){
    if (j % 2 == 0) {
      grBg.fill(colors[4]);
    } else {
      grBg.fill(colors[3]);
    }
    let start = freqToX(areas[j][1]);
    let end = freqToX(areas[j][2]);
    let diff = end - start;
    let mid = start + diff/2;
    grBg.rect(start, 0, diff, grBg.height);
    if (j % 2 == 0) {
      grBg.fill(colors[3]);
    } else {
      grBg.fill(colors[4]);
    }
    grBg.text(areas[j][0], int(mid), 12);

  }
  grBg.strokeWeight(1);
  grBg.textAlign(LEFT);
  let vals = makeXAxes();
  // console.log(vals);
  freqLookup = [];
  let i = 0;
  let prev = 0;
  let x = 0
  let counter = 0;
  let gap = 1;
  while (i < maxFreq) {
    while (x == prev) {
      counter++;
      x = int(freqToX(i));
      x = max(0, x);
      i += gap;
    }
    if (counter > 5) {
      gap++;
    }
    counter = 0;
    prev = x;
    for (let j = freqLookup.length; j < x; j++) {
      freqLookup.push(i);
    }
  }
  for (let j = freqLookup.length; j < grBg.width; j++) {
    freqLookup.push(maxFreq);
  }
  grBg.strokeWeight(1);
  for (let i = 0; i < vals.length; i++) {
    let x = freqToX(vals[i])
    if (majors.includes(vals[i])) {
      grBg.noStroke();
      grBg.fill(colors[2]);
      grBg.text(vals[i] + ' Hz', int(x + 2), 32);
      // grBg.strokeWeight(3);
      grBg.stroke(colors[2]);
    } else {
      grBg.stroke(colors[2]);
      // grBg.strokeWeight(1);
    }
    grBg.line(x, 20, x, grBg.height- 30);
  }
  grBg.noStroke();
  grBg.fill(colors[4]);
  grBg.rect(0, grBg.height - 30, grBg.width, 30);
  // grBg.strokeWeight(3);
  grBg.strokeWeight(1);
  grBg.stroke(colors[2]);
  grBg.line(0, 20, grBg.width, 20);
  grBg.line(0, grBg.height - 30, grBg.width, grBg.height - 30);
}

function clearInput(inp) {
  inp.value('');
}

function addNewItemCallback() {
  let ok = true;
  inputError = false;
  tempName = String(nameInput.value());
  tempLow = parseFloat(lowInput.value());
  tempMid = parseFloat(midInput.value());
  tempHigh = parseFloat(highInput.value());
  // check the formatting is correct
  if (tempName.length == 0 || isNaN(tempLow) || isNaN(tempMid) || isNaN(tempHigh)) {
    ok = false;
    inputError = true;
  }
  // check the values are reasonable
  if (ok) {
    if ((tempLow < 0) || (tempMid < tempLow) || (tempHigh < tempMid) || (tempHigh > maxFreq)){
      ok = false;
      inputError = true;
    }
  }
  if (ok) {
    addFR(tempName, tempLow, tempMid, tempHigh);
    pixelMatchRangers();
    newItemMenuOpen = false;
    clearInput(nameInput);
    clearInput(lowInput);
    clearInput(midInput);
    clearInput(highInput);
  }
}

function addFR(_name, _low, _mid, _high){
  let rc = int(random(colorfuls[0], colorfuls[1]));
  let newRange = new FrequencyRanger(_name, _low, _mid, _high);
  // let newwidth = _high - _low;
  newRange.pixelY = barPixelStartY;
  newRange.pixelH = barPixelHeight;
  // newRange.width = _high - _low;
  newRange.parent = llCursor;
  llCursor.child = newRange;
  llCursor = llCursor.child;
  // balance ?
  // pixelMatchRangers();
  pixelMatchRangers();
  // printList();
}

function drawDemo() {
  addFR('BG weight', 60, 80, 100);
  addFR('BG growl', 500, 600, 700);
  addFR('BG snap', 2000, 2500, 3000);
  addFR('BG pres', 6000, 6500, 7000);
  addFR('BD punch', 40, 60, 80);
  addFR('BD box', 300, 400, 500);
  addFR('BD click', 3000, 5000, 7000);
  addFR('SD girth', 150, 200, 250);
  addFR('SD box', 300, 400, 500);
  addFR('SD bark', 700, 850, 1000);
  addFR('SD crisp', 3500, 6000, 7400);
  addFR('SD snap', 7500, 11000, 15000);
  addFR('HH body', 300, 400, 500);
  addFR('HH siz', 4000, 5000, 6000);
  addFR('HH overtones', 7500, 11000, 15000);
  addFR('CYM meat', 280, 320, 400);
  addFR('CYM siz', 2000, 3500, 5000);
  addFR('CYM overtones', 6000, 12000, 18000);
  addFR('EG girth', 200, 400, 600);
  addFR('EG pres', 1000, 2000, 3000);
  addFR('EG buzz', 3500, 5000, 6500);
  addFR('AG bloom', 50, 75, 110);
  addFR('AG body', 200, 300, 400);
  addFR('AG pres', 2000, 3000, 5000);
  addFR('ORG bloom', 50, 75, 110);
  addFR('ORG body', 200, 300, 400);
  addFR('ORG pres', 2000, 3000, 5000);
  addFR('PIANO bloom', 40, 80, 120);
  addFR('PIANO pres', 3000, 4000, 5000);
  addFR('PIANO overtones', 8000, 13000, 18000);
  // console.log(windowWidth, windowHeight);
  // printList();
  pixelMatchRangers();
}

function printList() {
  let temp = llHead;
  console.log('');
  while (!(temp === null)){
    console.log(temp.name, temp.width);
    temp = temp.child;
  }
}

function loadThing(string) {
  let subStringArray = [];
  let stringArray = string.split('*');
  for (let i = 0; i < stringArray.length; i++){
    subStringArray = stringArray[i].split('|')
    if (subStringArray.length == 4){
      addFR(subStringArray[0], subStringArray[1], subStringArray[2], subStringArray[3]);
    }
  }
  // printList();
  pixelMatchRangers();
  pixelMatchRangers();
}

function saveThing() {
  let timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2) + '.htm';
  let myTable = new p5.Table();
  myTable.addColumn();
  myTable.addRow();
  myTable.set(0, 0, '<br>Mix Tool Save String<br>');
  myTable.addRow();
  myTable.set(1, 0, 'Copy the string below and paste it into the load file dialog<br><br>');
  myTable.addRow();
  myTable.set(2, 0, '<br>');
  myTable.addRow();
  let saveString = '';
  let temp = llHead;
  while (!(temp === null)){
    if (!(temp.name === 'root')) {
      // console.log(saveString);
      saveString += temp.name + '|' + temp.low + '|' + temp.mid + '|' + temp.high + '*';
    }
    temp = temp.child;
  }
  myTable.set(3, 0, saveString);
  myTable.addRow();
  myTable.set(4, 0, '<br');
  myTable.addRow();
  myTable.set(5, 0, '<br><br><a href="https://b38tn1k.com/mixtool">Mix Tool Website</a>');
  myTable.addRow();
  save(myTable, timestamp);
}

function sortLL() {
  // this is not LC
  let temp = llHead.child;
  let sortingArray = [];
  while (!(temp === null)){
    temp.pixelW = int(freqToX(temp.high) - freqToX(temp.low));
    sortingArray.push(temp.pixelW);
    temp = temp.child;
  }
  sortingArray.sort(function(a, b){
    return b - a;
  });
  // console.log(sortingArray);
  newLlHead = new FrequencyRanger('root');
  let newTemp = newLlHead;
  temp = llHead;
  for (let i = 0; i < sortingArray.length; i++){
    temp = llHead;
    while (int(temp.pixelW) != sortingArray[i]){
      temp = temp.child;
    }
    // add to new ll
    let newNode = new FrequencyRanger(temp.name, temp.low, temp.mid, temp.high);
    newNode.color = temp.color;
    newNode.pixelY = barPixelStartY;
    newNode.pixelH = barPixelHeight;
    newNode.parent = newTemp;
    newTemp.child = newNode;
    newTemp = newTemp.child;
    //remove from old ll
    temp.parent.child = temp.child;
    if (!(temp.child === null)){
      temp.child.parent = temp.parent;
    }
  }
  llHead = newLlHead;
  llCursor = newTemp;
  // printList();
}
