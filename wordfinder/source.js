// forest, rainforest, tropical, undergrowth, swamps, jungle, bush, mangrove, wilderness, countryside, guerrilla, highlands, desert, borneo, amazon, mountains, woodland, lizards, woods, marshy, hills, huts, wild, highland, monkey, caves, tiger
var docWidth = 2550;
var border = 60;
var docHeight = 3300;
var fontSize = 70;
var mainDiv;
var wordListTextArea;
var titleInput;
var generateButton;
var testButton;
var saveImageButton;
var sizeSlider;
var sizeSliderLabel;
var fontSlider;
var fontSliderLabel;
var cols = 20;
var rows = 20;
var letters = 'qwertyuiopasdfghjklzxcvbnm';
var grid;
var solution;
var fullPage;
var fullPageSolutions;
var title;
var examples;

function windowResized() {
  setupScreen();
}

function cleanCanvases() {
  var canvases = document.getElementsByTagName('canvas');
  var toRemove = [];
  for (let i = 0; i < canvases.length; i++) {
    if (canvases[i].id.includes('default') != true) {
      toRemove.push(canvases[i]);
    }
  }
  for (let i = 0; i < toRemove.length; i++) {
    toRemove[i].remove();
  }
}

function addWordHorizontally(word, grid){
  let added = false;
  let xpos, ypos;
  xpos = floor(random() * (cols - word.length));
  ypos = floor(random() * (rows));
  let score = 0;
  for (let i = 0; i < word.length; i++){
    if (grid[xpos + i][ypos] == '' || grid[xpos + i][ypos] == word[i]) {
      score++;
    }
  }
  if (score == word.length) {
    for (let i = 0; i < word.length; i++){
      grid[xpos + i][ypos] = word[i];
    }
    added=true;
  }
  return added;
}

function addWordVerticallyDown(word, grid){
  let added = false;
  let xpos, ypos;
  xpos = floor(random() * (cols - word.length));
  ypos = floor(random() * (rows));
  let score = 0;
  for (let i = 0; i < word.length; i++){
    if (grid[xpos][ypos + i] == '' || grid[xpos][ypos + i] == word[i]) {
      score++;
    }
  }
  if (score == word.length) {
    for (let i = 0; i < word.length; i++){
      grid[xpos][ypos + i] = word[i];
    }
    added=true;
  }
  return added;
}

function addWordVerticallyUp(word, grid){
  let added = false;
  let xpos, ypos;
  xpos = word.length + floor(random() * (cols - word.length));
  ypos = floor(random() * (rows));
  let score = 0;
  for (let i = 0; i < word.length; i++){
    if (grid[xpos][ypos - i] == '' || grid[xpos][ypos - i] == word[i]) {
      score++;
    }
  }
  if (score == word.length) {
    for (let i = 0; i < word.length; i++){
      grid[xpos][ypos - i] = word[i];
    }
    added=true;
  }
  return added;
}

function addWordDiagonallyDown(word, grid){
  let added = false;
  let xpos, ypos;
  let score = 0;
  xpos = max(floor(random() * (cols - ceil(word.length / 1.4) - 1)), 0);
  ypos = max(floor(random() * (rows - ceil(word.length / 1.4) - 1)), 0);
  try {
    for (let i = 0; i < word.length; i++){
      if (grid[xpos - i][ypos + i] == '' || grid[xpos - i][ypos + i] == word[i]) {
        score++;
      }
    }
  } catch {
    score = 0;
    return false;
  }
  if (score == word.length) {
    for (let i = 0; i < word.length; i++){
      grid[xpos - i][ypos + i] = word[i];
    }
    added=true;
  }
  return added;
}

function addWordDiagonallyUp(word, grid){
  let added = false;
  let xpos, ypos;
  let score = 0;
  xpos = ceil(word.length / 1.4) + floor(random() * (cols - ceil(word.length / 1.4) - 1));
  ypos = ceil(word.length / 1.4) + floor(random() * (rows - ceil(word.length / 1.4) - 1));
  try {
    for (let i = 0; i < word.length; i++){
      if (grid[xpos - i][ypos - i] == '' || grid[xpos - i][ypos - i] == word[i]) {
        score++;
      }
    }
  } catch {
    score = 0;
    return false;
  }
  if (score == word.length) {
    for (let i = 0; i < word.length; i++){
      grid[xpos - i][ypos - i] = word[i];
    }
    added=true;
  }
  return added;
}

function addRevWordDiagonallyDown(word, grid){
  let t = word.split("");
  let r = t.reverse();
  let w = r.join("");
  let added = addWordDiagonallyDown(w, grid);
  return added;
}

function addRevWordDiagonallyUp(word, grid){
  let t = word.split("");
  let r = t.reverse();
  let w = r.join("");
  let added = addWordDiagonallyUp(w, grid);
  return added;
}

function generate() {
  cleanCanvases();
  let list = wordListTextArea.elt.value.split(',');
  title = "Puzzle";
  if (titleInput.value()) {
    title = titleInput.value();
  }
  for (let i = 0; i < list.length; i++) {
    list[i] = list[i].toUpperCase(); //or lower case
    list[i] = list[i].replace(/'/, '');
    if (list[i][0] == " ") {
      list[i] = list[i].substr(1)
    }

  }
  letters = letters.toUpperCase();
  let letterGrid = [];
  let finderGrid = [];
  for (let i = 0; i < cols; i++) {
    let row = [];
    let frow = [];
    for (let j = 0; j < rows; j++) {
      let c = letters.charAt(floor(random() * letters.length));
      row.push(c);
      frow.push('');
    }
    letterGrid.push(row);
    finderGrid.push(frow);
  }

  // add words
  // finderGrid[0][0] = 'H';finderGrid[0][1] = 'E';finderGrid[0][2] = 'L';finderGrid[0][3] = 'L';finderGrid[0][4] = 'O';
  for (let i = 0; i < list.length; i++) {
    // let choice = int(random() * 4);
    let word = list[i].replace(/\s+/g, '');
    let added = false;
    while (added == false) {
      let choice = int(random() * 7);
      switch (choice) {
        case 0:
          // horizontal
          added = addWordHorizontally(word, finderGrid);
          break;
        case 1:
          // vertical
          added = addWordVerticallyDown(word, finderGrid);
          break;
        case 2:
          added = addWordVerticallyUp(word, finderGrid);
          break;
        case 3:
          added = addWordDiagonallyDown(word, finderGrid);
          break;
        case 4:
          added = addWordDiagonallyUp(word, finderGrid);
          break;
        case 5:
          added = addRevWordDiagonallyDown(word, finderGrid);
          break;
        case 6:
          added = addRevWordDiagonallyUp(word, finderGrid);
          break;
      }
    }
  }

  // combine grids
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (finderGrid[i][j] != '') {
        letterGrid[i][j] = finderGrid[i][j]; 
      }
    }
  }

  // letterGrid = finderGrid;

  var gWidth = docWidth - (border*6);
  delete(solution);
  delete(grid);
  delete(fullPage);
  delete(fullPageSolutions);

  solution = createGraphics(gWidth, gWidth);
  grid = createGraphics(gWidth, gWidth);
  fullPage = createGraphics(docWidth, docHeight);
  fullPageSolutions = createGraphics(docWidth, docHeight);

  solution.background(255);
  solution.fill(200);
  solution.noStroke();
  grid.textSize(fontSize);

  grid.textAlign(CENTER, CENTER);

  fullPage.background(255);
  fullPage.textSize(fontSize);
  fullPage.textAlign(CENTER, CENTER);

  fullPageSolutions.background(255);
  fullPageSolutions.textSize(fontSize);
  fullPageSolutions.textAlign(CENTER, CENTER);
  
  spacing = gWidth / ((cols + rows)/2);
  start = spacing/2;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid.text(letterGrid[i][j], start + i * spacing, start + j*spacing);
      if (finderGrid[i][j] != ''){
        solution.circle(start + i * spacing, start + j*spacing, fontSize * 1.5);
      }
    }
  }

  let area = min((windowWidth - (100 + mainDiv.width)), windowHeight-500);
  // fullPage.textSize(1.5*fontSize);
  // fullPageSolutions.textSize(1.5*fontSize);
  fullPageSolutions.stroke(0);
  fullPageSolutions.strokeWeight(3);
  fullPage.stroke(0);
  fullPage.strokeWeight(3);

  fullPageSolutions.text(title.toUpperCase(), docWidth/2, border);
  fullPage.text(title.toUpperCase(), docWidth/2, 2*border);

  fullPage.textSize(0.7* fontSize);
  fullPageSolutions.textSize(0.7* fontSize);

  fullPage.stroke(0);
  fullPage.strokeWeight(3);
  fullPage.rect(border*3, border * 4, grid.width, grid.height);
  fullPage.image(grid, border*3, border * 4);
  fullPageSolutions.stroke(0);
  fullPageSolutions.strokeWeight(3);
  fullPageSolutions.rect(border*3, border * 3, grid.width, grid.height);
  fullPageSolutions.image(solution, border*3, border * 3);
  fullPageSolutions.image(grid, border*3, border * 3);
  let listX = 3*border;
  spacing = (docWidth - 6* border)/4;
  let listY = grid.height + border * 4;
  fullPage.textAlign(LEFT, TOP);
  fullPageSolutions.textAlign(LEFT, TOP);
  fullPageSolutions.noStroke();
  fullPage.noStroke();
  for (let i = 0; i < list.length; i++) {
    if (i % 4 == 0) {
      listX = 3*border;
      listY += border*1.5;
    }
    fullPage.text(list[i], listX, listY);
    fullPageSolutions.text(list[i], listX, listY);
    listX += spacing;
  }
  let fit = 1.0;
  while (docWidth * fit > windowWidth || docHeight * fit > windowHeight) {
    fit -= 0.05;
  }
  fit *= 0.5;
  image(fullPageSolutions, 40 + mainDiv.width + fullPage.width*fit, 10, fit * docWidth, fit * docHeight);
  image(fullPage, 20 + mainDiv.width, 10, fit * docWidth, fit * docHeight);
}

function setupScreen() {
  cleanCanvases();
  createCanvas(windowWidth, windowHeight);
  mainDiv.position(10, 10);
  mainDiv.size(min(400, 0.25 * windowWidth), windowHeight - 40);
}

function preload() {
  examples = loadJSON('egs.json'); 
}

function setup() {
  mainDiv = createDiv('Word Finder Maker');
  mainDiv.style('background', 'white');
  mainDiv.style('padding', '10px');
  mainDiv.html('<br>',true);
  
  titleInput = createInput();
  titleInput.elt.placeholder = 'title'
  titleInput.style('width', '100%');
  titleInput.parent(mainDiv);
  mainDiv.html('<br>',true);
  
  wordListTextArea = createElement('textarea');
  wordListTextArea.elt.placeholder = 'add comma seperated word list here'
  wordListTextArea.parent(mainDiv);
  wordListTextArea.style('width', '100%');
  wordListTextArea.style('height', '40%');
  wordListTextArea.style('resize', 'vertical');
  mainDiv.html('<br>',true);

  sizeSlider = createSlider(20, 100, 20, 1);
  sizeSlider.parent(mainDiv);
  sizeSlider.input(updateSize);
  sizeSliderLabel = createDiv("Grid Size: " + cols.toString());
  sizeSliderLabel.parent(mainDiv);
  mainDiv.html('<br>',true);

  fontSlider = createSlider(24, 128, fontSize, 1);
  fontSlider.parent(mainDiv);
  fontSlider.input(updateFontSize);
  fontSliderLabel = createDiv("Font Size: " + fontSize.toString());
  fontSliderLabel.parent(mainDiv);
  mainDiv.html('<br>',true);

  testButton = createButton('Test');
  testButton.parent(mainDiv);
  testButton.mousePressed(testSetup);
  mainDiv.html('<br>',true);
  
  generateButton = createButton('Generate');
  generateButton.parent(mainDiv);
  generateButton.mousePressed(generate);
  mainDiv.html('<br>',true);

  saveImageButton = createButton('Save Puzzle & Solution');
  saveImageButton.mousePressed(saveBoth);
  saveImageButton.parent(mainDiv);

  setupScreen();
}

function testSetup() {
  
  let choice = floor(random(examples.length))
  let theme = examples.data[choice];
  titleInput.elt.value = theme.title;
  myString = ''
  for (let i = 0; i < theme.content.length; i++) {
    myString += theme.content[i] + ', ';
  }
  wordListTextArea.elt.value = myString;
  generate();
}

function updateSize(){
  sizeSliderLabel.html("Grid Size: " + sizeSlider.value().toString());
  cols = int(sizeSlider.value());
  rows = cols;
}

function updateFontSize () {
  fontSliderLabel.html("Font Size: " + fontSlider.value().toString());
  fontSize = int(fontSlider.value());
}

function saveBoth() {
  var img = createImage(fullPage.width, fullPage.height);
  img.copy(fullPage, 0, 0, fullPage.width, fullPage.height, 0, 0, fullPage.width, fullPage.height);
  let myStr = title;
  img.save(myStr, 'png'); 
  img.copy(fullPageSolutions, 0, 0, fullPageSolutions.width, fullPageSolutions.height, 0, 0, fullPageSolutions.width, fullPageSolutions.height);
  myStr = title + "_solutions";
  img.save(myStr, 'png'); 

}

function draw() {

}
