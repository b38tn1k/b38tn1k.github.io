// graphics
var view, border, gradient;
var centerX, centerY, titleY, buttonY;
// strings
var titleStringArr = [];
var titleString = '';
var titleDivStringArr = [];
var titleDivString = '';
var titleDiv;
var titleWidth, titleHeight;
// buttons
var buttons = [];
var buttonLabels = ['music', 'blog', 'demos'];
var exitButton;
var buttonLinks = [null, null, null];
var showItem = false;
var itemToShow;
// some fun
var sprites = [];
var spriteCount = 25;
var dawndusk = [255, 200, 100];
var daytime = [100, 200, 255];
var nighttime = [100, 100, 200];
// discography
var discography = []
var discogStringArr;
var coverWidth = 200;

class myAlbum {
  constructor(title, artists, cover, spotify, applemusic, bandcamp, date) {
    this.title = title.slice('title '.length);
    this.artists = artists.slice('artists '.length);
    this.cover = cover.slice(cover.indexOf('/'));
    this.coverHTML = '<img src="https://b38tn1k.com/' + this.cover + '" alt="' + this.title + '" width="' + coverWidth + '">';
    // this.albumImage = loadImage('https://b38tn1k.com/' + this.cover);
    this.spotify = spotify.slice(spotify.indexOf('h'));
    this.spotifyHTML = '<a href="' + this.spotify + '">Spotify</a>';
    this.applemusic = applemusic.slice(applemusic.indexOf('h'));
    this.applemusicHTML = '<a href="' + this.applemusic + '">Apple Music</a>';
    this.bandcamp = bandcamp.slice(bandcamp.indexOf('h'));
    this.bandcampHTML = '<a href="' + this.bandcamp + '">bandcamp</a>';
    if (this.spotify.length < 2) {
      this.spotifyHTML = ""
      this.spotify = ""
    }
    if (this.applemusic.length < 2) {
      this.applemusic = "";
      this.applemusicHTML = "";
    }
    if (this.bandcamp.length < 2) {
      this.bandcamp = "";
      this.bandcampHTML = "";
    }
    this.date = date.split(' ')[1];
    this.divString = this.title + '<br>' + this.artists + '<br>' + this.coverHTML + '<br>' + this.date + '<br>' + this.bandcampHTML + ' ' + this.spotifyHTML + ' ' + this.applemusicHTML;
  }
}


class myButton {
  constructor(label, link, x, y) {
    this.name = label;
    this.link = link;
    if (!(link === null)) {
      // figure out how to handle links that look like buttons here
    }
    this.label = '|';
    for (let i = 0; i < label.length + 2; i++) {
      this.label += '-';
    }
    this.label += '|\n| ' + label + ' |\n|';
    for (let i = 0; i < label.length + 2; i++) {
      this.label += '-';
    }
    this.label += '|';
    // this.label = label;
    this.x = x;
    this.y = y;
    this.width = textWidth('|-' + label + '-|');
    this.height = int(3.5 * textSize());
    this.x_min = x - (this.width/2);
    this.x_max = x + (this.width/2);
    this.y_min = y - (this.height/2);
    this.y_max= y + (this.height/2);
    this.clickCountDown = 0;
  }
}

function genSprite(spriteWidth, spriteHeight, pixelSize, color) {
  let sprite = createGraphics((spriteWidth+2)*pixelSize, spriteHeight*2*pixelSize);
  sprite.fill(color);
  sprite.noStroke();
  let x = 0;
  let y = 0;
  let invLength = spriteHeight;
  let invHeight = spriteWidth;
  let grid = new Array();
  let max = 0.0;
  for (let i = 0; i < invLength; i++) {
    grid[i] = new Array();
    for (let j = 0; j < invHeight; j++) {
      grid[i][j] = random(2);
      grid[i][j] = grid[i][j] + sin(radians(90*i/invLength));
      grid[i][j] = grid[i][j] + sin(radians(180*(j/invHeight)));
      if (grid[i][j] > max) {
        max = grid[i][j];
      }
    }
  }
  let sum = 0;
  let count = 0;
  for (let i = 0; i < invLength; i++) {
    for (let j = 0; j < invHeight; j++) {
      grid[i][j] = grid[i][j]/max;
      sum += grid[i][j];
      count++;
    }
  }
  let average = sum/count;
  let threshhold = average;
  let xpos = 0;
  let ypos = 0;
  for (var i = 0; i < invLength; i++) {
    for (var j = 0; j < invHeight; j++) {
      if (grid[i][j] > threshhold) {
        sprite.rect(xpos, ypos, pixelSize, pixelSize);
      }
      ypos += pixelSize;
    }
    ypos = 0;
    xpos += pixelSize;
  }
  var invlen = int(invLength) - 1;
  for (var i = 0; i < invLength; i++) {
    for (var j = 0; j < invHeight; j++) {
      if (grid[invlen- i][j] > threshhold) {
        sprite.rect(xpos, ypos, pixelSize, pixelSize);
      }
      ypos += pixelSize;
    }
    ypos = 0;
    xpos += pixelSize;
  }
  return sprite;
}

function clearItemBG() {
  tempBG = createGraphics(itemBG.width, itemBG.height);
  tempBG.background(255, 255, 255, 100);
  drawBorder(tempBG);
  delete(itemBG);
  itemBG = tempBG;
}

function drawGradient(rgb){
  let c1 = color(255, 255, 255);
  let c2 = color(rgb[0], rgb[1], rgb[2]);
  stroke(c1);
  gradient.background(c1);
  gradient.line(0, 0, view.width, 0);
  gradient.strokeWeight(2);
  let gradStart = int(view.height/2);
  let bump = 3 * textSize(); // prop to invader height
  for (let i = 0; i < gradStart; i++) {
    gradient.stroke(lerpColor(c1, c2, (i/gradStart)));
    gradient.line(0, i + gradStart - bump, view.width, i + gradStart - bump);
  }
  // gradient.stroke(c2);
  for (let i = view.height - bump; i < view.height; i++) {
    gradient.line(0, i, view.width, i);
  }
}

function setupScreen() {
  let colorOfTheTime;
  if (hour() > 7 && hour() <= 17) {
    colorOfTheTime = daytime;
  } else if (hour() == 6 || hour() == 18) {
    colorOfTheTime = dawndusk;
  } else {
    colorOfTheTime = nighttime;
  }
  // draw-onables
  createCanvas(windowWidth, windowHeight);
  border = int(min(0.05*windowWidth, 0.05*windowHeight));
  let x = (windowWidth - 2*border);
  let y = (windowHeight - 2*border);
  view = createGraphics(x, y);
  gradient = createGraphics(x, y);
  // text setup
  centerX = int(width/2);
  centerY = int(height/2);
  titleY = int(height/3);
  buttonY = height - titleY;
  let tSize = int(0.015 * x);
  titleHeight = titleStringArr.length * tSize;
  if (titleHeight > centerY/2) {
    tSize = int(0.02 * y);
    titleHeight = titleStringArr.length * tSize;
  }
  buttonY = titleY + 1.5*titleHeight;
  textSize(tSize);
  textFont('Courier New');
  view.textFont('Courier New');
  titleWidth = textWidth(titleStringArr[1]);
  buttons = [];
  // button setup
  let buttonX = int(centerX - (titleWidth/2));
  let xInt = int(titleWidth/(buttonLabels.length - 1));
  for (let i = 0; i < buttonLabels.length; i++){
    buttons.push(new myButton(buttonLabels[i], buttonLinks[i], buttonX, buttonY));
    buttonX += xInt;
  }
  exitButton = new myButton('exit', null, int(width - 2.5*border), 2*border)
  // html setup
  titleDiv.remove();
  titleDiv = createDiv(titleDivString);
  titleDiv.style('font-size', tSize + 'px');
  titleDiv.position(0, titleY - (titleHeight));
  titleDiv.center('horizontal');

  // invaders guy
  sprites = [];
  let spritePixelSize = int(max(3, tSize/12));
  for (let i = 0; i < spriteCount; i++){
    sprites.push([genSprite(8, 5, spritePixelSize, colorOfTheTime), random(view.width), random(view.height), int(random(-2, 2)), 1, int(random(50, 100)), spritePixelSize]);
  }
  // prettify
  background(255);
  view.background(255);
  drawGradient(colorOfTheTime);
}

function preload() {
  titleStringArr = loadStrings('textAssets/title.txt');
  titleDivStringArr  = loadStrings('textAssets/title.html');
  discogStringArr = loadStrings('https://b38tn1k.com/release_map/');
  // discogStringArr = loadStrings('http://127.0.0.1:4000/release_map/');
}

function mousePressed() {
  // drawGradient(random([daytime, dawndusk, nighttime]));
  mx = mouseX;
  my = mouseY;
  let res = false;
  for (let i = 0; i < buttons.length; i++) {
    res = buttonPressed(buttons[i], mx, my);
    if (res === true) {
      itemToShow = i;
      showItem = true;
      buttons[i].clickCountDown = 0;
      return false;
    }
  }
  if (buttonPressed(exitButton, mx, my)){
    showItem = false;
    return false;
  }
}

function setupDiscog() {
    let tempTitle, tempArtists, tempCover, tempSpot, tempApp, tempBC, tempDate;
    let readingDiscog = false
    for (let i = 0; i < discogStringArr.length; i++) {
      if (discogStringArr[i].includes('startrelease')) {
        readingDiscog = true;
      } else if (discogStringArr[i].includes('endrelease')) {
        readingDiscog = false;
        if (!(tempTitle === null)) {
          discography.push(new myAlbum(tempTitle, tempArtists, tempCover, tempSpot, tempApp, tempBC, tempDate));
        }
        tempSpot = null;
        tempApp = null;
        tempBC = null;
        tempTitle = null;
      }
      if (readingDiscog){
        if (discogStringArr[i].includes('title')){ tempTitle = discogStringArr[i];}
        if (discogStringArr[i].includes('artists')){ tempArtists = discogStringArr[i];}
        if (discogStringArr[i].includes('cover')){ tempCover = discogStringArr[i];}
        if (discogStringArr[i].includes('spoti')){ tempSpot = discogStringArr[i];}
        if (discogStringArr[i].includes('applem')){ tempApp = discogStringArr[i];}
        if (discogStringArr[i].includes('bandcam')){ tempBC = discogStringArr[i];}
        if (discogStringArr[i].includes('date')){ tempDate = discogStringArr[i];}
      }
    }
}

function drawSprites() {
  for (let i = 0; i < sprites.length; i++){
    view.image(sprites[i][0], sprites[i][1], sprites[i][2]);
    sprites[i][1] += sprites[i][3] * sprites[i][6];
    sprites[i][2] += sprites[i][4] * sprites[i][6];
    if (frameCount % sprites[i][5] == 0) {
      sprites[i][3] = int(random(-2, 2));
    }

    if (sprites[i][1] < 0) {sprites[i][1] = view.width;}
    if (sprites[i][1] > view.width) {sprites[i][1] = 0;}
    if (sprites[i][2] < 0){sprites[i][2] = view.height;}
    if (sprites[i][2] > view.height) {sprites[i][2] = 0;}
  }
}

function drawButtons() {
  for (let i = 0; i < buttons.length; i++){
    drawButton(buttons[i]);
  }
}

function drawButton(button) {
  if (button.clickCountDown > 0) {
    fill(0);
    rect(button.x, button.y, button.width, button.height)
    fill(255);
    text(button.label, button.x, button.y);
    buttons.clickCountDown -= 1;
  } else {
    fill(255, 255, 255, 100);
    rect(button.x, button.y, button.width, button.height)
    fill(0);
    text(button.label, button.x, button.y);
  }
}

function drawBorder(g){
  g.stroke(0);
  g.strokeWeight(2);
  g.noFill();
  g.rect(0, 0, g.width, g.height);
}

function buttonPressed(button, mx, my){
  let pressed = false;
  if (mx > button.x_min  && mx < button.x_max) {
    if (my > button.y_min && my < button.y_max){
      pressed = true;
    }
  }
  return pressed;
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function unpackStringArray(myArr, end=null){
  let myString = ''
  for (let i = 0; i < myArr.length-1; i++){
    if (!(end === null)) {
      myString += myArr[i] + end;
    } else {
      myString += myArr[i]
    }
  }
  return myString;
}

function setup() {
  titleString = unpackStringArray(titleStringArr, '\n');
  titleDivString = unpackStringArray(titleDivStringArr);
  titleDiv = createDiv(titleDivString);
  setupScreen();
  frameRate(5);
  setupDiscog();
}

function draw(){
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  rectMode(CENTER);
  view.image(gradient, 0, 0);
  drawSprites();
  if (showItem) {
    view.fill(255, 255, 255, 100);
    view.rect(0, 0, view.width, view.height);
  }
  drawBorder(view);
  image(view, centerX, centerY);

  // fill(255, 255, 0);
  // text(titleString, centerX, titleY);
  textStyle(BOLD);
  noStroke();

  if (showItem) {
    titleDiv.hide();
    drawButton(exitButton);
  } else {
    titleDiv.show();
    drawButtons();
  }
  // text('windowWidth: ' + windowWidth, 150, 10);
  // text('windowHeight: ' + windowHeight, 150, 30);
  // text('tSize: ' + textSize(), 150, 50);

}
