// forest, rainforest, tropical, undergrowth, swamps, jungle, bush, mangrove, wilderness, countryside, guerrilla, highlands, desert, borneo, amazon, mountains, woodland, lizards, woods, marshy, hills, huts, wild, highland, monkey, caves, tiger
var docWidth = 2550;
var mainDiv;
var wordListTextArea;
var generateButton;
var showSolutionButton;
var cols = 40;
var rows = 40;
var letters = 'qwertyuiopasdfghjklzxcvbnm';
var grid;
var solution;

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

  solution = createGraphics(docWidth, docWidth);
  solution.background(255);
  solution.fill(200);
  solution.noStroke();

  grid = createGraphics(docWidth, docWidth);
  grid.textSize(32);
  grid.textAlign(CENTER, CENTER);
  
  spacing = docWidth / ((cols + rows)/2);
  start = spacing/2;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid.text(letterGrid[i][j], start + i * spacing, start + j*spacing);
      if (finderGrid[i][j] != ''){
        solution.circle(start + i * spacing, start + j*spacing, 48);
      }
    }
  }

  let area = min((windowWidth - (50 + mainDiv.width)), windowHeight-50);

  image(solution, 20 + mainDiv.width, 10, area, area);
  image(grid, 20 + mainDiv.width, 10, area, area);
  
}

function setupScreen() {
  createCanvas(windowWidth, windowHeight);
  mainDiv.position(10, 10);
  mainDiv.size(min(400, 0.25 * windowWidth), windowHeight - 20);
}

function setup() {
  mainDiv = createDiv('Word Finder Maker');
  mainDiv.style('background', 'white');
  mainDiv.style('padding', '10px');
  
  wordListTextArea = createElement('textarea');
  wordListTextArea.elt.placeholder = 'add comma seperated word list here'
  wordListTextArea.parent(mainDiv);
  wordListTextArea.style('width', '100%');
  wordListTextArea.style('height', '40%');
  wordListTextArea.style('resize', 'vertical');
  
  generateButton = createButton('Generate');
  generateButton.parent(mainDiv);
  generateButton.mousePressed(generate);

  setupScreen();
}

function draw() {

}
