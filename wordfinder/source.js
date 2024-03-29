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
var batchProcessButton;
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
var solutionGrid;
var solutionGridCounter = 0;
var title;
var examples;

function windowResized() {
  setupScreen();
}

function cleanCanvases() {
  var canvases = document.getElementsByTagName('canvas');
  var toRemove = [];
  for (let i = 0; i < canvases.length; i++) {
    let id = canvases[i].id;
    if (id.includes('default') == false && id.includes('puzzle') == false && id.includes('solution') == false && id.includes('solutiongrid') == false) {
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
  try {
    for (let i = 0; i < word.length; i++){
      if (grid[xpos + i][ypos] == '' || grid[xpos + i][ypos] == word[i]) {
        score++;
      }
    }
  } catch {
    score = 0;
    return false;
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
  try {
    for (let i = 0; i < word.length; i++){
      if (grid[xpos][ypos + i] == '' || grid[xpos][ypos + i] == word[i]) {
        score++;
      }
    }
  } catch {
    score = 0;
    return false;
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
  try {
    for (let i = 0; i < word.length; i++){
      if (grid[xpos][ypos - i] == '' || grid[xpos][ypos - i] == word[i]) {
        score++;
      }
    }
  } catch {
    score = 0;
    return false;
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
  let sortedList = [];
  for (let i = list.length-1; i >=0 ; i--) {
    sortedList.push(list[i]);

  }
  sortedList.sort((a, b) => a.length - b.length);
  for (let i = list.length-1; i >=0 ; i--) {
    // let choice = int(random() * 4);
    let word = sortedList[i].replace(/\s+/g, '');
    let added = false;
    while (added == false) {
      console.log(title, word);
      // let choice = int(random() * 7);
      // Fun, Entertaining, Stimulating, Addictive, Relaxing, Interesting, challenging, rewarding
      let choice = int(random() * 3);
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
          added = addRevWordDiagonallyUp(word, finderGrid);
          break;
        case 3:
          added = addWordVerticallyUp(word, finderGrid);
          break;
        case 4:
          added = addWordDiagonallyDown(word, finderGrid);
          break;
        case 5:
          added = addRevWordDiagonallyDown(word, finderGrid);
          break;
        case 6:
          added = addWordDiagonallyUp(word, finderGrid);
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
  fit *= 0.3;
  if (solutionGridCounter % 4 == 0) {
    solutionGrid.background(255);
  }
  let scaleDim = 6/16;
  solutionGridCounter += 1;
  let x = 1/16 * docWidth;
  let y = 1/16 * docHeight;
  switch (solutionGridCounter % 4) {
    case 1:
      solutionGrid.image(fullPageSolutions, x + 1/32 * docWidth, y + 1/32 * docHeight, scaleDim * docWidth, scaleDim*docHeight);
      break;
    case 2:
      solutionGrid.image(fullPageSolutions, 9 * x - 1/32 * docWidth, y + 1/32 * docHeight, scaleDim * docWidth, scaleDim*docHeight);
      break;
    case 3:
      solutionGrid.image(fullPageSolutions, x + 1/32 * docWidth, 9 * y - 1/32 * docHeight, scaleDim * docWidth, scaleDim*docHeight);
      break;
    case 0:
      solutionGrid.image(fullPageSolutions, 9 * x - 1/32 * docWidth, 9 * y - 1/32 * docHeight, scaleDim * docWidth, scaleDim*docHeight);
      break;
  }
  image(fullPageSolutions, 40 + mainDiv.width + fullPage.width*fit, 10, fit * docWidth, fit * docHeight);
  image(solutionGrid, 60 + mainDiv.width + fullPage.width*fit + fullPageSolutions.width*fit, 10, fit * docWidth, fit * docHeight);
  image(fullPage, 20 + mainDiv.width, 10, fit * docWidth, fit * docHeight);
  cleanCanvases();
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

  sizeSlider = createSlider(10, 100, 20, 1);
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
  saveImageButton.mousePressed(saveAll);
  saveImageButton.parent(mainDiv);
  mainDiv.html('<br>',true);

  batchProcessButton = createButton('Batch Process');
  batchProcessButton.parent(mainDiv);
  batchProcessButton.mousePressed(batchStep);

  fullPage = createGraphics(docWidth, docHeight);
  fullPage.elt.id = 'puzzle';
  fullPageSolutions = createGraphics(docWidth, docHeight);
  fullPageSolutions.elt.id = 'solutions';
  solutionGrid = createGraphics(docWidth, docHeight);
  solutionGrid.elt.id = 'solutiongrid';
  solutionGrid.background(255);

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

function saveAll() {
  var img = createImage(fullPage.width, fullPage.height);
  img.copy(fullPage, 0, 0, fullPage.width, fullPage.height, 0, 0, fullPage.width, fullPage.height);
  let myStr = format_file_name(title);
  img.save(myStr, 'png'); 
  img.copy(fullPageSolutions, 0, 0, fullPageSolutions.width, fullPageSolutions.height, 0, 0, fullPageSolutions.width, fullPageSolutions.height);
  myStr = format_file_name(title + 'solution');
  img.save(myStr, 'png'); 
  myStr = format_file_name('grid');
  img = createImage(fullPage.width, fullPage.height);
  img.copy(solutionGrid, 0, 0, fullPageSolutions.width, fullPageSolutions.height, 0, 0, fullPageSolutions.width, fullPageSolutions.height);
  img.save(myStr, 'png'); 
}

function draw() {

}

function batchStep() {
  let theme = examples.data[solutionGridCounter];
  titleInput.elt.value = theme.title;
  console.log(theme.title)
  myString = ''
  for (let i = 0; i < theme.content.length; i++) {
    myString += theme.content[i] + ', ';
  }
  wordListTextArea.elt.value = myString;
  generate();
  smartSave();
}

function format_file_name(n, special=false) {
  let numStr;
  n = n.toUpperCase();
  if (special == true) {
    numStr = 'z' + ((solutionGridCounter / 4) + 1000).toString().substring(2);
  } else {
    numStr = (solutionGridCounter + 1000).toString().substring(2);
  }
  return numStr + '_' + n.replaceAll(' ', '_');
}

function smartSave() {
  var img = createImage(fullPage.width, fullPage.height);
    img.copy(fullPage, 0, 0, fullPage.width, fullPage.height, 0, 0, fullPage.width, fullPage.height);
    let myStr = format_file_name(title);
    img.save(myStr, 'png'); 

  if (solutionGridCounter % 4 == 0 || solutionGridCounter == examples.length) {
    myStr = format_file_name('solution', true);
    img = createImage(fullPage.width, fullPage.height);
    img.copy(solutionGrid, 0, 0, fullPageSolutions.width, fullPageSolutions.height, 0, 0, fullPageSolutions.width, fullPageSolutions.height);
    img.save(myStr, 'png'); 
  }
}