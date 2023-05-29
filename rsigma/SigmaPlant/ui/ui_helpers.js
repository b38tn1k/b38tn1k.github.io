function loadColors(data) {
  for (let colorName in data) {
    let colorValue = data[colorName];
    colors[colorName] = color(colorValue);
  }
}

function getColor(field) {
  return colors[themes[COLOR_THEME][field]];
}

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
  frameRate(highFrameRate);
}

function scrollBoard() {
  if (mouseIsPressed && !menu.isActive && !plant.isActive) {
    scrollX += (pmouseX - mouseX) / zoom;
    scrollY += (pmouseY - mouseY) / zoom;
    fpsEvent();
  }
}

function drawCross(x, y, size) {
  line(x - size / 2, y, x + size / 2, y); // Horizontal line
  line(x, y - size / 2, x, y + size / 2); // Vertical line
}


function drawGrid(color) {
  stroke(color);
  strokeWeight(1);
  let resolution = 50; // Grid resolution
  if (zoom <= 0.5) {
    resolution = 100;
  }
  if (zoom <= 0.25) {
    resolution = 200;
  }
  
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
      // point(intersection.x, intersection.y);
      drawCross(intersection.x, intersection.y, 5);
    }
  }
}

function setupMenu(){
  menu = new CircularMenu();

  let themesArray = Object.keys(themes);

  // Divide the themes into three groups
  let themeGroup1 = themesArray.slice(0, themesArray.length / 2);
  let themeGroup2 = themesArray.slice(themesArray.length / 2);
  // let themeGroup3 = themesArray.slice(2 * themesArray.length / 3);

  // Create buttons for each theme group
  let buttons1 = themeGroup1.map(theme => new MenuButton(theme, 0, 0, () => setTheme(theme), 1));
  buttons1.push(new MenuButton( '...', 0, 0, () => menu.activateSubMenu('themes2'), 1));
  let buttons2 = themeGroup2.map(theme => new MenuButton(theme, 0, 0, () => setTheme(theme), 1));
  buttons2.push(new MenuButton( '...', 0, 0, () => menu.activateSubMenu('themes1'), 1));
  // let buttons3 = themeGroup3.map(theme => new MenuButton(theme, 0, 0, () => setTheme(theme), 1));
  // buttons3.push(new MenuButton( '...', 0, 0, () => menu.activateSubMenu('themes1'), 1));

  // Add each theme group as a separate submenu
  menu.newSubMenu(buttons1, 'themes1');
  menu.newSubMenu(buttons2, 'themes2');
  // menu.newSubMenu(buttons3, 'themes3');
  // Create Buttons for a Settings submenu
  let settings = [];
  settings.push(new MenuButton( 'Themes', 0, 0, () => menu.activateSubMenu('themes1'), 1));

  // let busButtonGroup = [];
  // busButtonGroup.push(new MenuButton( 'New Source', 0, 0, newSource, 1));
  // busButtonGroup.push(new MenuButton( 'New Sink', 0, 0, newSink, 1));
  // busButtonGroup.push(new MenuButton( 'New Input', 0, 0, newInput, 1));
  // busButtonGroup.push(new MenuButton( 'New Output', 0, 0, newOutput, 1));
  // busButtonGroup.push(new MenuButton( 'New Split', 0, 0, newSplit, 1));
  // menu.newSubMenu(busButtonGroup, 'omnibus');
  menu.newSubMenu(settings, 'settings');
  menu.addButton('New Zone', newZone);
  menu.addButton('New Process', newProcess);
  menu.addButton('New Source', newSource);
  menu.addButton('New Sink', newSink);
  menu.addButton('New Delay', newDelay);
  menu.addButton('New Split', newSplit);
  // menu.addButton('New Bus', () => {menu.activateSubMenu('omnibus');});
  menu.addButton('Settings', () => {menu.activateSubMenu('settings');});
  // menu.addButton('New Input', newInput);
  // menu.addButton('New Output', newOutput);
  // settings.push(new MenuButton( 'Demo', 0, 0, console.log('Demo Button Press'), 1));
  
}

function setupPlant() {
  plant = new Plant();
}

function setTheme(theme) {
  COLOR_THEME = theme;
  document.body.style.backgroundColor = getColor('background');

}

function newSource() {
  const pos = screenToBoard(menu.position.x, menu.position.y);
  plant.addSource(pos.x, pos.y);
  menu.dismiss();
}

function newSink() {
  const pos = screenToBoard(menu.position.x, menu.position.y);
  menu.dismiss();
  plant.addSink(pos.x, pos.y);
}

function newSplit() {
  const pos = screenToBoard(menu.position.x, menu.position.y);
  plant.addSplit(pos.x, pos.y);
  menu.dismiss();
}

function newProcess() {
  const pos = screenToBoard(menu.position.x, menu.position.y);
  menu.dismiss();
  plant.addProcess(pos.x, pos.y);
}

function newZone() {
  const pos = screenToBoard(menu.position.x, menu.position.y);
  menu.dismiss();
  plant.addZone(pos.x, pos.y);
}

function newDelay() {
  const pos = screenToBoard(menu.position.x, menu.position.y);
  plant.addDelay(pos.x, pos.y);
  menu.dismiss();
}