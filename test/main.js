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
// various item menus
var contentStringArr;
var squareItemImageWidth = 200;
var nextItem, previousItem;
// discography
var discography = [];
var albumPointer = 0;
// posts
var posts = [];
var postDiv;
// demos
var demos = [];
var demoPointer = 0;

class myDemoItem {
  constructor(title, image, link, content) {
    this.content = ' ';
    if (!(content === null)){
      this.content = content.slice(content.indexOf("[description]") + "[description]".length);
      this.content = this.content.slice(0, this.content.indexOf("[description]"));
      while (this.content.indexOf('&lt;') != -1) {
        this.content = this.content.replace('&lt;', '<');
      }
      while (this.content.indexOf('&gt;') != -1) {
        this.content = this.content.replace('&gt;', '>');
      }
    }
    this.content += '<br> <br> <em>Some of these demos may not provide the best experience on mobile devices.</em>'

    this.title = title.slice('title '.length);
    this.image = image.slice('image '.length);
    this.link = link.slice('link '.length);
    this.linkHTML = '<a href="' + this.link + '">' + this.title + '</a>';
    this.imageHTML = '<img src="' + this.image + '" alt="' + this.title + '" width="' + squareItemImageWidth + '">';
    this.divString = this.linkHTML;
    this.div = createDiv(this.divString);
  }
  updateDiv() {
    this.imageHTML = '<img src="' + this.image + '" alt="' + this.title + '" width="' + squareItemImageWidth + '">';
    this.divString = this.imageHTML + '<br>' + this.linkHTML + '<br> <br>' + this.content;
    this.div.remove();
    this.div = createDiv(this.divString);
    this.div.style('font-size', textSize() + 'px');
    this.div.style('font-family', "'courier new', courier");
    this.div.style('overflow', "auto");
    this.div.size(squareItemImageWidth, windowHeight - (titleY - (titleHeight) + 2*border));
    this.div.position(0, titleY - (titleHeight));
    this.div.center('horizontal');
    this.div.hide();
  }
}

class myPost {
  constructor(title, date, link, tags) {
    this.title = title.slice('title '.length);
    this.date = date.slice('date '.length);
    this.link = link.slice('link '.length);
    this.tags = tags;
    this.postHTML = '<a href="' + this.link + '">' + this.title + '</a><br><em>' + this.date;
    if (this.tags.length >= 1) {
      this.postHTML+= ' - ';
      for (let i = 0; i < tags.length-1; i++) {
        this.postHTML+= this.tags[i] + ', ';
      }
      this.postHTML += this.tags[tags.length-1] + '</em><br>';
    }
    this.postHTML+= '</em><br>';
  }
}

class myDiscogEntry {
  constructor(title, artists, cover, spotify, applemusic, bandcamp, date) {
    this.title = title.slice('title '.length);
    this.artists = '<em>' + artists.slice('artists '.length) + '</em>';
    this.cover = cover.slice(cover.indexOf('/'));
    this.coverHTML = '<img src="https://b38tn1k.com/' + this.cover + '" alt="' + this.title + '" width="' + squareItemImageWidth + '">';
    // this.albumImage = loadImage('https://b38tn1k.com/' + this.cover);
    this.spotify = spotify.slice(spotify.indexOf('h'));
    this.spotifyHTML = '<a href="' + this.spotify + '">spotify</a>';
    this.applemusic = applemusic.slice(applemusic.indexOf('h'));
    this.applemusicHTML = '<a href="' + this.applemusic + '">apple music</a>';
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
    this.date = date.slice('date '.length);
    this.divString = this.coverHTML + '<br>' + this.title + '<br>' + this.artists + '<br>' + this.date + '<br>' + this.bandcampHTML + '<br>' + this.spotifyHTML + '<br>' + this.applemusicHTML;
    this.div = createDiv(this.divString);
    this.div.hide();
  }

  updateDiv() {
    this.coverHTML = '<img src="https://b38tn1k.com/' + this.cover + '" alt="' + this.title + '" width="' + squareItemImageWidth + '">';
    this.divString = this.coverHTML + '<br>' + this.title + '<br>' + this.artists + '<br>' + this.date + '<br> <br>' + this.bandcampHTML + '<br>' + this.spotifyHTML + '<br>' + this.applemusicHTML;
    this.div.remove();
    this.div = createDiv(this.divString);
    this.div.style('font-size', textSize() + 'px');
    this.div.style('font-family', "'courier new', courier");
    this.div.style('overflow', "auto");
    this.div.size(squareItemImageWidth, windowHeight - (titleY - (titleHeight) + 2*border));
    this.div.position(0, titleY - (titleHeight));
    this.div.center('horizontal');
    this.div.hide();
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
  console.log(windowWidth, windowHeight);
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
  squareItemImageWidth = int(min(x, y)/2);
  // text setup
  centerX = int(width/2);
  centerY = int(height/2);
  titleY = int(height/3);
  buttonY = height - titleY;
  let tSize = int(0.015 * x);
  if (x/y < 0.8) {tSize *= 1.4;}
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
  exitButton = new myButton('exit', null, int(width - 2.5*border), 2*border);
  nextItem = new myButton('next', null, int(width - 4*border), buttonY);
  previousItem = new myButton('prev', null, int(4*border), buttonY);
  // html setup
  titleDiv.remove();
  titleDiv = createDiv(titleDivString);
  titleDiv.style('font-size', tSize + 'px');
  titleDiv.position(0, titleY - (titleHeight));
  titleDiv.center('horizontal');
  for (let i = 0; i < discography.length; i++) {
    discography[i].updateDiv();
  }
  for (let i = 0; i < demos.length; i++) {
    demos[i].updateDiv();
  }
  setupPostDiv();
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
  contentStringArr = loadStrings('https://b38tn1k.com/map_for_p5/');
  // contentStringArr = loadStrings('http://127.0.0.1:4000/map_for_p5/');
}

function mousePressed() {
  mx = mouseX;
  my = mouseY;
  if (showItem && buttonLabels[itemToShow] == 'music' && buttonPressed(nextItem, mx, my)) {
    nextItem.clickCountDown = 2;
    discography[albumPointer].div.hide();
    albumPointer += 1;
    if (albumPointer >= discography.length) {
      albumPointer = 0;
    }
    discography[albumPointer].div.show();
    return false;

  }
  if (showItem && buttonLabels[itemToShow] == 'music' && buttonPressed(previousItem, mx, my)) {
    previousItem.clickCountDown = 2;
    discography[albumPointer].div.hide();
    albumPointer -= 1;
    if (albumPointer == -1) {
      albumPointer = discography.length-1;
    }
    discography[albumPointer].div.show();
    return false;
  }
  if (showItem && buttonLabels[itemToShow] == 'demos' && buttonPressed(nextItem, mx, my)) {
    nextItem.clickCountDown = 2;
    demos[demoPointer].div.hide();
    demoPointer += 1;
    if (demoPointer >= demos.length) {
      demoPointer = 0;
    }
    demos[demoPointer].div.show();
    return false;

  }
  if (showItem && buttonLabels[itemToShow] == 'demos' && buttonPressed(previousItem, mx, my)) {
    previousItem.clickCountDown = 2;
    demos[demoPointer].div.hide();
    demoPointer -= 1;
    if (demoPointer == -1) {
      demoPointer = demos.length-1;
    }
    demos[demoPointer].div.show();
    return false;
  }

  if (!showItem) {
    let res = false;
    for (let i = 0; i < buttons.length; i++) {
      res = buttonPressed(buttons[i], mx, my);
      if (res === true) {
        itemToShow = i;
        showItem = true;
        buttons[i].clickCountDown = 1;
        return false;
      }
    }
  }
  if (buttonPressed(exitButton, mx, my)){
    showItem = false;
    return false;
  }

}

function setupPosts(){
  let tempTitle, tempDate, tempLink;
  tempTitle = null;
  tempDate = null;
  tempLink = null;
  let tempTags = [];
  let readingPosts = false;
  for (let i = 0; i < contentStringArr.length; i++) {
    if (contentStringArr[i].includes('startpost')) {
      readingPosts = true;
    } else if (contentStringArr[i].includes('endpost')) {
      readingPosts = false;
      if (!(tempTitle === null)) {
        posts.push(new myPost(tempTitle, tempDate, tempLink, tempTags));
      }
      tempTitle = null;
      tempDate = null;
      tempLink = null;
      tempTags = [];
    }
    if(readingPosts) {
      if (contentStringArr[i].includes('title') && tempTitle === null){ tempTitle = contentStringArr[i];}
      else if (contentStringArr[i].includes('date') && tempDate === null){ tempDate = contentStringArr[i];}
      else if (contentStringArr[i].includes('link') && tempLink === null){ tempLink = contentStringArr[i];}
      else if (contentStringArr[i].includes('$ ')){
        let mySliceString = contentStringArr[i];
        mySliceString = mySliceString.slice(mySliceString.indexOf('$ ') + 2); // removing weird spacing stuff
        tempTags.push(mySliceString);
      }
    }
  }
}

function setupPostDiv() {
  let divString = '';
  for (let i = 0; i < posts.length; i++) {
    divString += posts[i].postHTML;
  }
  postDiv.remove();
  postDiv = createDiv(divString);
  postDiv.style('font-size', textSize() + 'px');
  postDiv.style('font-family', "'courier new', courier");
  postDiv.style('font-family', "'courier new', courier");
  postDiv.style('overflow', "auto");
  postDiv.size(int(windowWidth / 2), windowHeight - (titleY - (titleHeight) + 2*border));
  postDiv.position(0, border*2);//titleY - (titleHeight));
  postDiv.center('horizontal');
  postDiv.hide();
  // console.log(divString);
}

function setupDiscog() {
    let tempTitle, tempArtists, tempCover, tempSpot, tempApp, tempBC, tempDate;
    tempTitle = null;
    tempArtists= null;
    tempCover= null;
    tempSpot= null;
    tempApp= null;
    tempBC= null;
    tempDate= null;
    let readingDiscog = false
    for (let i = 0; i < contentStringArr.length; i++) {
      if (contentStringArr[i].includes('startrelease')) {
        readingDiscog = true;
      } else if (contentStringArr[i].includes('endrelease')) {
        readingDiscog = false;
        if (!(tempTitle === null)) {
          discography.push(new myDiscogEntry(tempTitle, tempArtists, tempCover, tempSpot, tempApp, tempBC, tempDate));
        }
        tempTitle = null;
        tempArtists= null;
        tempCover= null;
        tempSpot= null;
        tempApp= null;
        tempBC= null;
        tempDate= null;
      }
      if (readingDiscog){
        if (contentStringArr[i].includes('title')){ tempTitle = contentStringArr[i];}
        else if (contentStringArr[i].includes('artists')){ tempArtists = contentStringArr[i];}
        else if (contentStringArr[i].includes('cover')){ tempCover = contentStringArr[i];}
        else if (contentStringArr[i].includes('spoti')){ tempSpot = contentStringArr[i];}
        else if (contentStringArr[i].includes('applem')){ tempApp = contentStringArr[i];}
        else if (contentStringArr[i].includes('bandcam')){ tempBC = contentStringArr[i];}
        else if (contentStringArr[i].includes('date')){ tempDate = contentStringArr[i];}
      }
    }
}

function setupDemos() {
  let tempTitle, tempImage, tempLink, tempContent;
  tempTitle = null;
  tempImage = null;
  tempContent = null;
  tempLink = null;
  let readingDemos = false;
  let readingContent = false;
  for (let i = 0; i < contentStringArr.length; i++) {
    if (contentStringArr[i].includes('startdemo')) {
      readingDemos = true;
    } else if (contentStringArr[i].includes('enddemo')) {
      readingDemos = false;
      if (!(tempTitle === null)) {
        demos.push(new myDemoItem(tempTitle, tempImage, tempLink, tempContent));
      }
      tempTitle = null;
      tempImage = null;
      tempContent = null;
      tempLink = null;
      readingContent = false;
    }
    if (readingDemos){
      if (readingContent) (tempContent += contentStringArr[i]);
      if (contentStringArr[i].includes('title')&& tempTitle === null){ tempTitle = contentStringArr[i];}
      else if (contentStringArr[i].includes('image') && tempImage === null){ tempImage = contentStringArr[i];}
      else if (contentStringArr[i].includes('link') && tempLink === null){ tempLink = contentStringArr[i];}
      else if (contentStringArr[i].includes('content')){readingContent = true;}
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
    button.clickCountDown -= 1;
  } else {
    fill(255, 255, 255, 100);
    rect(button.x, button.y, button.width, button.height)
    fill(0);
    text(button.label, button.x, button.y);
  }
}

function drawBorder(g){
  stroke(0);
  strokeWeight(2);
  noFill();
  rect(centerX, centerY, g.width, g.height);

  // g.stroke(0);
  // g.strokeWeight(1);
  // g.noFill();
  // g.rect(1, 1, g.width-1, g.height-1);
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
  postDiv = createDiv('blank');
  setupDiscog();
  setupPosts();
  setupDemos();
  setupPostDiv();
  setupScreen();
  frameRate(5);

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
  image(view, centerX, centerY);
  drawBorder(view);

  // fill(255, 255, 0);
  // text(titleString, centerX, titleY);
  textStyle(BOLD);
  noStroke();

  if (showItem) {
    titleDiv.hide();
    drawButton(exitButton);
    if (buttonLabels[itemToShow] == 'music'){
      discography[albumPointer].div.show();
      drawButton(nextItem);
      drawButton(previousItem);
    } else if (buttonLabels[itemToShow] == 'blog'){
      postDiv.show();
    } else if (buttonLabels[itemToShow] == 'demos') {
      drawButton(nextItem);
      drawButton(previousItem);
      demos[demoPointer].div.show();
    }
  } else {
    discography[albumPointer].div.hide();
    demos[demoPointer].div.hide();
    postDiv.hide();
    titleDiv.show();
    drawButtons();
  }
  // text('windowWidth: ' + windowWidth, 150, 10);
  // text('windowHeight: ' + windowHeight, 150, 30);
  // text('tSize: ' + textSize(), 150, 50);

}
