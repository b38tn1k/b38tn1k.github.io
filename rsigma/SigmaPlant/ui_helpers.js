function loadColors(data) {
  for (let colorName in data) {
    let colorValue = data[colorName];
    colors[colorName] = color(colorValue);
  }
}

function getColor(field) {
  return colors[themes[COLOR_THEME][field]];
}

// convert between coordinate systems, e.g.
// let mouseXBoard, mouseYBoard;
// let boardMouse = screenToBoard(mouseX, mouseY);
// mouseXBoard = boardMouse.x;
// mouseYBoard = boardMouse.y;
function screenToBoard(x, y) {
  let boardX = (x - width / 2) / zoom + scrollX ;//+ width/2;
  let boardY = (y - height / 2) / zoom + scrollY;// + height/2;
  return createVector(boardX, boardY);
}

function boardToScreen(boardX, boardY) {
  let screenX = (boardX - scrollX) * zoom + width / 2;
  let screenY = (boardY - scrollY) * zoom + height / 2;
  return createVector(screenX, screenY);
}

function fpsEvent() {
  lastInputTime = millis();  // I wish js had decorators
}

function scrollBoard() {
  if (mouseIsPressed && !mouseHasFocus) {
    scrollX += (pmouseX - mouseX) / zoom;
    scrollY += (pmouseY - mouseY) / zoom;
    fpsEvent();
  }
}

function drawGrid() {
  stroke(getColor('gridline'));
  strokeWeight(2);
  let resolution = 10; // Grid resolution
  
  // Convert the screen edges to board coordinates
  let topLeftBoard = screenToBoard(0, 0);
  let bottomRightBoard = screenToBoard(width, height);

  // Calculate the board coordinates of the first grid lines
  let startX = floor(topLeftBoard.x / resolution) * resolution;
  let startY = floor(topLeftBoard.y / resolution) * resolution;

  // Iterate over the grid intersections
  for (let boardX = startX; boardX < bottomRightBoard.x; boardX += resolution) {
    for (let boardY = startY; boardY < bottomRightBoard.y; boardY += resolution) {
      let intersection = boardToScreen(boardX, boardY);
      point(intersection.x, intersection.y);
    }
  }
}


function setupMenu(){
  menu = new CircularMenu();
  let buttons = []
  for (let theme in themes) {
    buttons.push(new MenuButton(theme, 0, 0, () => COLOR_THEME = theme, 1));
  }
  menu.newSubMenu(buttons, 'themes');
  menu.addButton('New Station', newStation);
  menu.addButton('Save', () => console.log('Save Action'));
  menu.addButton('Close', () => menu.dismiss());
  menu.addButton('Select Theme', () => menu.activateSubMenu('themes'));
}

function newStation() {
  const pos = screenToBoard(mouseX, mouseY);
  menu.dismiss();
  stations.push(new Station(pos.x + width/2, pos.y + height/2));
}