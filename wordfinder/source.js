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

function windowResized() {
  setupScreen();
}

function addWordHorizontally(word, grid){
  let added = false;
  let xpos, ypos;
  while (added == false) {
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
  }
}

function addWordVertically(word, grid){
  let added = false;
  let xpos, ypos;
  while (added == false) {
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
  }
}

function generate() {
  let list = wordListTextArea.elt.value.split(',');
  title = "Puzzle";
  if (titleInput.value()) {
    title = titleInput.value();
  }
  
  for (let i = 0; i < list.length; i++) {
    list[i] = list[i].toUpperCase(); //or lower case
    list[i] = list[i].replace(/\s+/g, '');
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
    let choice = int(random() * 2);
    switch (choice) {
      case 0:
        // horizontal
        addWordHorizontally(list[i], finderGrid);
        break;
      case 1:
        // vertical
        addWordVertically(list[i], finderGrid);
        break;
      case 2:
        // diag up
        break;
      case 3:
        // diag down
        break;
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

  fullPage.text(title.toUpperCase(), docWidth/2, 2*border);
  fullPage.stroke(0);
  fullPage.strokeWeight(3);
  fullPage.rect(border*3, border * 4, grid.width, grid.height);
  fullPage.image(grid, border*3, border * 4);

  fullPageSolutions.text(title.toUpperCase(), docWidth/2, border);
  fullPageSolutions.stroke(0);
  fullPageSolutions.strokeWeight(2);
  fullPageSolutions.rect(border*3, border * 3, grid.width, grid.height);
  fullPageSolutions.image(solution, border*3, border * 3);
  fullPageSolutions.image(grid, border*3, border * 3);

  let listX = 3*border;
  spacing = (docWidth - 6* border)/4;
  let listY = grid.height + border * 4;
  fullPage.textAlign(LEFT, TOP);
  fullPageSolutions.textAlign(LEFT, TOP);
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

  image(fullPage, 20 + mainDiv.width, 10, fit * docWidth, fit * docHeight);
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  mainDiv.position(10, 10);
  mainDiv.size(min(400, 0.25 * windowWidth), windowHeight - 40);
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
  titleInput.elt.value = 'SINGERS';
  wordListTextArea.elt.value = 'Lennon, McCartney, Jagger, Richards, Dylan, Hendrix, Morrison, Simon, Garfunkel, King, Franklin, Redding, Cooke, Gaye, Wonder, Jones, Turner, Presley, Orbison, Cash';
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
