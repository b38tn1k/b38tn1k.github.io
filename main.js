// graphics
var view, border, gradient;
var centerX, centerY, titleY, buttonY;
var bgColor, fgColor, transparent;
var fullScreen, halfScreen, mobile;
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
var itemToShow = 1;
//a11y
var showBackgroundButton;
var showBackground = true;
var invertColorsButton;
var invertColors = false;
var retroButton;
var retro = true;
// some fun
var sprites = [];
var spriteCount = 25;
var dawndusk = [255, 200, 100];
var daytime = [100, 200, 255];
var nighttime = [100, 100, 200];
var tank;
var game = false;
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
var postFilter = 0;
// demos
var demos = [];
var demoPointer = 0;

class Tank {
  constructor(pixelSize, x, y, rgb) {
    this.x = x;
    this.y = y;
    this.killcount = 0;
    this.pixelSize = pixelSize;
    this.speedCount = 0;
    this.bulletsX = [-1, -1, -1, -1, -1];
    this.bulletsY = [-1, -1, -1, -1, -1];
    this.bullet = createGraphics(pixelSize, 5*pixelSize);
    this.bullet.background(color(rgb[0], rgb[1], rgb[2]));
    this.bullet.noStroke();
    this.bullet.fill(255, 255, 255);
    this.bullet.square(0, 0, pixelSize);
    this.bullet.square(0, 2*pixelSize, pixelSize);
    this.bullet.square(0, 4*pixelSize, pixelSize);
    this.sprite = createGraphics(pixelSize * 9, pixelSize * 5);
    this.sprite.fill(bgColor);
    this.sprite.noStroke();
    this.sprite.square(pixelSize * 4, 0, pixelSize);
    for (let j = 3; j < 6; j++) {
      this.sprite.square(pixelSize * j, pixelSize, pixelSize);
    }
    for (let j = 1; j < 8; j++) {
      this.sprite.square(pixelSize * j, 2*pixelSize, pixelSize);
    }
    this.sprite.rect(0, 3*pixelSize, this.sprite.width, this.sprite.width);
  }

  moveLeft(){
    this.speedCount += 1;
    if (this.speedCount < 3){
      this.x -= this.pixelSize;
    } else {
      this.x -= 5 * this.pixelSize;
    }
    if (this.x < this.pixelSize * 4){
      this.x = view.width - this.pixelSize * 5;
    }
  }

  moveRight(){
    this.speedCount += 1;
    if (this.speedCount < 3){
      this.x += this.pixelSize;
    } else {
      this.x += 5 * this.pixelSize;
    }
    if (this.x > view.width - this.pixelSize * 4){
      this.x = this.pixelSize * 5;
    }
  }

  speedReset(){
    this.speedCount = 0;
  }

  checkShot(x, y){
    let minX  = x - (8 * this.pixelSize);
    let maxX  = x + (8 * this.pixelSize);
    let yInc = y - this.pixelSize * 20;
    y -= 2 * this.pixelSize;
    for (let i = 0; i < this.bulletsX.length; i++) {
      if (this.bulletsY[i] > 0) {
        if (this.bulletsY[i] < y && this.bulletsY[i] > yInc) {
          if (this.bulletsX[i] > minX && this.bulletsX[i] < maxX) {
            this.bulletsY[i] = -1;
            this.killcount += 1;
            return true;
          }
        }
      }
    }
    return false;
  }

  shoot() {
    let cx = 0;
    let nx = 0;
    let cy = 0;
    let ny = 0;
    for (let i = 0; i < this.bulletsX.length; i++) {
      cx = this.bulletsX[i]
      this.bulletsX[i] = nx;
      nx = cx;
      cy = this.bulletsY[i]
      this.bulletsY[i] = ny;
      ny = cy;
    }
    this.bulletsX[0] = this.x + this.pixelSize * 4;
    this.bulletsY[0] = this.y;
  }
}

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
    this.linkHTML = '<a href="' + this.link + '" target="_blank">' + this.title + '</a>';
    this.imageHTML = '<img src="' + this.image + '" alt="' + this.title + '" width="' + squareItemImageWidth + '">';
    let divString = this.linkHTML;
    this.div = createDiv(divString);
  }
  updateDiv() {
    this.imageHTML = '<img src="' + this.image + '" alt="' + this.title + '" width="' + squareItemImageWidth + '">';
    let divString = this.imageHTML + '<br><strong>' + this.linkHTML + '</strong><br> <br>' + this.content;
    let divLineHeight = int(squareItemImageWidth + ( (5 * textSize()) + textSize() * textWidth(this.title + this.content)/squareItemImageWidth));

    if (invertColors) {
      divString = '<style> a { color: #AAFFAA; } </style>' + divString;
    }
    this.div.remove();
    this.div = createDiv(divString);
    this.div.style('font-size', textSize() + 'px');
    if (retro) {
      this.div.style('font-family', "'courier new', courier");
    } else {
      this.div.style('font-family', "'arial', sans-serif");
    }

    this.div.style('overflow', "auto");
    let yPos = titleY - (titleHeight);
    let dheight = windowHeight - (titleY - (titleHeight) + 2*border);
    if (invertColors) {
      dheight -= 20;
      divLineHeight +=20;
      yPos -= 20;
      dheight = min(divLineHeight, dheight);
      this.div.style('background-color', 'rgba(0, 0, 0, 0.3)')
      this.div.style('color', 'white');
      this.div.style('padding', '20px');
    } else {
      this.div.style('color', 'black');
    }
    this.div.size(squareItemImageWidth, dheight);
    this.div.position(0, yPos);
    this.div.center('horizontal');
    if (! retro) {
      let pos = this.div.position();
      this.div.position(pos['x'] + border, yPos);
    }

    this.div.hide();
  }
}

class myPost {
  constructor(title, date, link, tags) {
    this.title = title.slice('title '.length);
    this.date = date.slice('date '.length);
    this.link = link.slice('link '.length);
    this.tags = tags;
    this.postHTML = '<strong><a href="' + this.link + '" target="_blank">' + this.title + '</a></strong><br><em>' + this.date;
    this.postHTMLDark = '<strong><a href="' + this.link + '#darkmode" target="_blank">' + this.title + '</a></strong><br><em>' + this.date;
    if (this.tags.length >= 1) {
      this.postHTMLDark += ' - ';
      this.postHTML+= ' - ';
      for (let i = 0; i < tags.length-1; i++) {
        this.postHTML+= this.tags[i] + ', ';
        this.postHTMLDark+= this.tags[i] + ', ';
      }
      this.postHTML += this.tags[tags.length-1] + '</em><br>';
      this.postHTMLDark += this.tags[tags.length-1] + '</em><br>';
    }
    this.postHTML+= '</em><br>';
    this.postHTMLDark+= '</em><br>';
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
    let divString = this.coverHTML + '<br>' + this.title + '<br>' + this.artists + '<br>' + this.date + '<br>' + this.bandcampHTML + '<br>' + this.spotifyHTML + '<br>' + this.applemusicHTML;
    this.div = createDiv(divString);
    this.div.hide();
  }

  updateDiv() {
    this.coverHTML = '<img src="https://b38tn1k.com/' + this.cover + '" alt="' + this.title + '" width="' + squareItemImageWidth + '">';
    let divString = this.coverHTML + '<br><strong>' + this.title + '</strong><br>' + this.artists + '<br>' + this.date + '<br> <br>' + this.bandcampHTML + '<br>' + this.spotifyHTML + '<br>' + this.applemusicHTML;
    let divLineHeight = squareItemImageWidth + ( (10 * textSize()) + textSize() * textWidth(this.title)/squareItemImageWidth);
    this.div.remove();
    if (invertColors) {
      divString = '<style> a { color: #AAFFAA; } </style>' + divString;
    }
    let dheight = windowHeight - (titleY - (titleHeight) + 2*border);
    this.div = createDiv(divString);
    this.div.style('font-size', textSize() + 'px');
    if (retro) {
      this.div.style('font-family', "'courier new', courier");
    } else {
      this.div.style('font-family', "'arial', sans-serif");
    }
    if (invertColors) {
      this.div.style('color', 'white');
      this.div.style('background-color', 'rgba(0, 0, 0, 0.3)')
      dheight = min(divLineHeight, dheight);
    } else {
      this.div.style('color', 'black');
    }
    this.div.style('overflow', "auto");
    this.div.size(squareItemImageWidth, dheight);
    this.div.position(0, titleY - (titleHeight));
    this.div.center('horizontal');
    if (! retro) {
      let pos = this.div.position();
      this.div.position(pos['x'] + border, pos['y']);
    }
    this.div.hide();
  }
}

class myButton {
  constructor(label, link, x, y, small = false) {
    this.name = label;
    this.link = link;
    this.small = small;
    if (!(link === null)) {
      // figure out how to handle links that look like buttons here
    }
    if (small) {
      this.label = label;
    } else {
      this.label = '|';
      for (let i = 0; i < label.length + 2; i++) {
        this.label += '-';
      }
      this.label += '|\n| ' + label + ' |\n|';
      for (let i = 0; i < label.length + 2; i++) {
        this.label += '-';
      }
      this.label += '|';
    }
    this.x = x;
    this.y = y;


    if (! small) {
      this.height = int(3.5 * textSize());
      this.width = textWidth('|-' + label + '-|');
    } else {
      this.height = int(textSize());
      this.width = textWidth(label + ' ');
    }
    if (! small) {
      this.x_min = x - (this.width/2);
      this.x_max = x + (this.width/2);
      this.y_min = y - (this.height/2);
      this.y_max= y + (this.height/2);
    } else {
      this.x_min = x - (this.width);
      this.x_max = x + (this.width);
      this.y_min = y - (this.height);
      this.y_max= y + (this.height);
    }

    this.clickCountDown = 0;
  }
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

function filterPosts(myTag) {
  postFilter = int(myTag);
  setupPostDiv();
}

function checkLeftBrain(myTags){
  if (myTags.includes('robot') || myTags.includes('patent') || myTags.includes('rover') || myTags.includes('safety') || myTags.includes('code') || myTags.includes('arduino')) {
    return true;
  }
  return false;
}

function checkRightBrain(myTags){
  if (myTags.includes('i made another outsider art filmclip') || myTags.includes('art') || myTags.includes('fun') || myTags.includes('music')) {
    return true;
  }
  return false;
}

function setupPostDiv() {
  let divString = '<table width="100%"><tr><td style="text-align:left" ><a href="javascript:void(0)" onclick="filterPosts(0)">All</a></td><td style="text-align:center"><a href="javascript:void(0)" onclick="filterPosts(1)">Techy</a></td><td style="text-align:right"><a href="javascript:void(0)" onclick="filterPosts(2)">Arty</a></td></tr></table><br>';
  for (let i = 0; i < posts.length; i++) {
    if (postFilter == 1) {
      if (checkLeftBrain(posts[i]['tags'])) {
        if (invertColors) {
          divString += posts[i].postHTMLDark;
        } else {
          divString += posts[i].postHTML;
        }
      }
    } else if (postFilter == 2) {
      if (checkRightBrain(posts[i]['tags'])){
        if (invertColors) {
          divString += posts[i].postHTMLDark;
        } else {
          divString += posts[i].postHTML;
        }
      }
    } else {
      if (invertColors) {
        divString += posts[i].postHTMLDark;
      } else {
        divString += posts[i].postHTML;
      }
    }
  }
  postDiv.remove();
  postDiv = createDiv(divString);
  postDiv.style('font-size', textSize() + 'px');
  if (retro) {
    postDiv.style('font-family', "'courier new', courier");
    postDiv.style('font-family', "'courier new', courier");
  } else {
    postDiv.style('font-family', "'arial', sans-serif");
  }

  if (invertColors) {
    postDiv.style('color', 'white');
  } else {
    postDiv.style('color', 'black');
  }
  postDiv.style('overflow', "auto");
  if (retro) {
    postDiv.size(int(windowWidth / 2), windowHeight - 4* border);//- (titleY - (titleHeight) + 2*border));
    postDiv.position(0, border*2);//titleY - (titleHeight));
    postDiv.center('horizontal');
  } else {
    postDiv.size(int(windowWidth / 2), (windowHeight - 4* border));//- (titleY - (titleHeight) + 2*border));
    // if (mobile) {
    //   postDiv.size(int(windowWidth / 2), (windowHeight - 9* border));//- (titleY - (titleHeight) + 2*border));
    // }
    postDiv.position(0, 2*border);//titleY - (titleHeight));//titleY - (titleHeight));
    postDiv.center('horizontal');
    if (mobile) {
      let po = postDiv.position();
      postDiv.position(po['x'] + 2 * border, po['y']);
    }
    // let po = postDiv.position()
    // postDiv.position(po['x'] + 2 * border, po['y']);
  }
  postDiv.hide();
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

function drawButtons() {
  for (let i = 0; i < buttons.length; i++){
    drawButton(buttons[i]);
  }
}

function drawButton(button) {
  if (retro) {
    if (button.clickCountDown > 0) {
      fill(fgColor);
      rect(button.x, button.y, button.width, button.height)
      fill(bgColor);
      text(button.label, button.x, button.y);
      button.clickCountDown -= 1;
    } else {
      fill(255, 255, 255, transparent);
      rect(button.x, button.y, button.width, button.height)
      fill(fgColor);
      text(button.label, button.x, button.y);
    }
  } else {
    fill(bgColor);
    rect(button.x, button.y, button.width, button.height, 5)
    fill(fgColor);
    text(button.name, button.x, button.y)
  }
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

function drawSprites() {
  for (let i = 0; i < sprites.length; i++){
    if (showItem) {
      if ((sprites[i][1] <= width/2) && (sprites[i][1] > width/8)) {
        sprites[i][3] = -1;
      } else if ((sprites[i][1] > width/2) && (sprites[i][1] < 2*(width/3))) {
        sprites[i][3] = 1;
      } else {
        if (frameCount % sprites[i][5] == 0) {
          sprites[i][3] = int(random(-2, 2));
        }
      }
    }
    view.image(sprites[i][0], sprites[i][1], sprites[i][2]);
    if (game) {
      if (tank.checkShot(sprites[i][1], sprites[i][2])) {
        sprites[i][1] = random(view.width);
        sprites[i][2] = random(view.height);
      }
    }

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
  let c1 = bgColor;
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

function drawBorder(g){
  stroke(fgColor);
  strokeWeight(2);
  noFill();
  rect(centerX, centerY, g.width, g.height);
}

function showMusic(){
  titleDiv.html('<h1>B38TN1K</h1><p>aka James C<p><br><p><a href="javascript:void(0)" onclick="showBlog()"> blog</a></p><br><p><a href="javascript:void(0)" onclick="showDemos()"> demos</a></p><br><p><a href="javascript:void(0)" onclick="showMusic()"> music</a></p><br><p><a href="javascript:void(0)" onclick="nextAlbum()"> next album</a></p><br><p><a href="javascript:void(0)" onclick="previousAlbum()"> previous album</a></p>');
  showItem = true;
  itemToShow = 0;

}

function showBlog(){
  titleDiv.html('<h1>B38TN1K</h1><p>aka James C<p><br><p><a href="javascript:void(0)" onclick="showBlog()"> blog</a></p><br><p><a href="javascript:void(0)" onclick="showDemos()"> demos</a></p><br><p><a href="javascript:void(0)" onclick="showMusic()"> music</a></p>');
  showItem = true;
  itemToShow = 1;
}

function showDemos(){
  titleDiv.html('<h1>B38TN1K</h1><p>aka James C<p><br><p><a href="javascript:void(0)" onclick="showBlog()"> blog</a></p><br><p><a href="javascript:void(0)" onclick="showDemos()"> demos</a></p><br><p><a href="javascript:void(0)" onclick="showMusic()"> music</a></p><br><p><a href="javascript:void(0)" onclick="nextDemo()"> next demo</a></p><br><p><a href="javascript:void(0)" onclick="previousDemo()"> previous demo</a></p>');
  showItem = true;
  itemToShow = 2;
}

function setupScreen() {
  let screenRatio = windowWidth / windowHeight;
  fullScreen = false;
  halfScreen = false;
  mobile = false;
  if (screenRatio > 1.4) {
    // console.log('full screen');
    fullScreen = true;
  } else if (screenRatio > 0.9) {
    // console.log('half screen');
    halfScreen = true;
  } else {
    // console.log('mobile');
    mobile = true;
  }
  if (!invertColors) {
    bgColor = color(255);
    fgColor = color(0);
    transparent = 200;
  } else {
    bgColor = color(0);
    fgColor = color(255);
    transparent = 100;
  }

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
  // redo this part for mobile etc
  // if (titleHeight > centerY/2) {
  //   tSize = int(0.02 * y);
  //   titleHeight = titleStringArr.length * tSize;
  // }
  if (mobile || halfScreen) {
    tSize = int(0.02 * y);
    titleHeight = titleStringArr.length * tSize;
  }
  buttonY = titleY + 1.5*titleHeight;
  textSize(tSize);
  if (retro) {
    textFont('Courier New');
    view.textFont('Courier New');
  } else {
    textFont('Helvetica');
    view.textFont('Helvetica');
    showItem = true;
    // itemToShow = 1;
  }
  titleWidth = textWidth(titleStringArr[1]);
  buttons = [];
  // button setup
  if (mobile) {
    let buttonX = centerX;
    buttonY = titleY + 0.5*titleHeight;
    for (let i = 0; i < buttonLabels.length; i++){
      buttons.push(new myButton(buttonLabels[i], buttonLinks[i], buttonX, buttonY));
      buttonY += 2 * buttons[i].height;
    }

  } else {
    let buttonX = int(centerX - (titleWidth/2));
    let xInt = int(titleWidth/(buttonLabels.length - 1));
    for (let i = 0; i < buttonLabels.length; i++){
      buttons.push(new myButton(buttonLabels[i], buttonLinks[i], buttonX, buttonY));
      buttonX += xInt;
    }
  }
  let buttonNudge = 0;
  if (mobile) {
    buttonY = titleY;
    buttonNudge = 0.5 * border
  }
  exitButton = new myButton('exit', null, int(width - 2.5*border - buttonNudge), 2*border + buttonNudge);
  while ((exitButton.y - (exitButton.height) / 2) < border + 2) {
    exitButton.y += 1;
  }
  while ((exitButton.x + (exitButton.width) / 2) > (windowWidth - border - 3)) {
    exitButton.x -= 1;
  }
  nextItem = new myButton('next', null, int(width - 4*border + buttonNudge), buttonY);
  previousItem = new myButton('prev', null, int(4*border - buttonNudge), buttonY);
  // html setup
  titleDiv.remove();
  if (retro) {
    titleDiv = createDiv(titleDivString);
    titleDiv.style('font-family', "'courier new', courier");
  } else {
    titleDiv = createDiv('<h1>B38TN1K</h1><p>aka James C<p><br><p><a href="javascript:void(0)" onclick="showBlog()"> blog</a></p><br><p><a href="javascript:void(0)" onclick="showDemos()"> demos</a></p><br><p><a href="javascript:void(0)" onclick="showMusic()"> music</a></p>');
    titleDiv.style('font-family', "'arial', sans-serif");
  }

  if (mobile && retro) {
    titleDiv.style('font-size', (0.6*tSize )+ 'px');
  } else {
    titleDiv.style('font-size', tSize + 'px');
  }
  if (invertColors) {
    titleDiv.style('color', 'white');
    titleDiv.style('background-color', 'rgba(0, 0, 0, 0.3)')
  } else {
    titleDiv.style('color', 'black');
  }
  if (retro) {
    showItem = false;
    titleDiv.position(0, titleY - (titleHeight));
    titleDiv.center('horizontal');
  } else {
    if (itemToShow == 0) {
      titleDiv.html('<h1>B38TN1K</h1><p>aka James C<p><br><p><a href="javascript:void(0)" onclick="showBlog()"> blog</a></p><br><p><a href="javascript:void(0)" onclick="showDemos()"> demos</a></p><br><p><a href="javascript:void(0)" onclick="showMusic()"> music</a></p><br><p><a href="javascript:void(0)" onclick="nextAlbum()"> next album</a></p><br><p><a href="javascript:void(0)" onclick="previousAlbum()"> previous album</a></p>');
    } else if (itemToShow == 1) {
      titleDiv.html('<h1>B38TN1K</h1><p>aka James C<p><br><p><a href="javascript:void(0)" onclick="showBlog()"> blog</a></p><br><p><a href="javascript:void(0)" onclick="showDemos()"> demos</a></p><br><p><a href="javascript:void(0)" onclick="showMusic()"> music</a></p>');
    } else {
      titleDiv.html('<h1>B38TN1K</h1><p>aka James C<p><br><p><a href="javascript:void(0)" onclick="showBlog()"> blog</a></p><br><p><a href="javascript:void(0)" onclick="showDemos()"> demos</a></p><br><p><a href="javascript:void(0)" onclick="showMusic()"> music</a></p><br><p><a href="javascript:void(0)" onclick="nextDemo()"> next demo</a></p><br><p><a href="javascript:void(0)" onclick="previousDemo()"> previous demo</a></p>');
    }
    titleDiv.position(int(1.5 * border), border);
  }

  for (let i = 0; i < discography.length; i++) {
    discography[i].updateDiv();
  }
  for (let i = 0; i < demos.length; i++) {
    demos[i].updateDiv();
  }
  setupPostDiv();
  // invaders guy
  showBackgroundButton = new myButton('BG: OFF', null, width - (border + textWidth('BG: OFF ')/2 + 1), int(height-border - textSize()/2), true);
  invertColorsButton = new myButton('dark ', null, (border + 5 + (textWidth('light')/2)), int(height-border - textSize()/2), true);
  retroButton = new myButton('retro', null, invertColorsButton.x + textWidth('BG: OFF '), int(height-border - textSize()/2), true);

  if (retro) {
    retroButton.label = 'clean';
  } else {
    retroButton.label = 'retro';
  }
  if (showBackground) {
    showBackgroundButton.label = 'BG: OFF ';
  } else {
    showBackgroundButton.label = 'BG: ON ';
  }
  if (invertColors) {
    invertColorsButton.label = 'light';
    invertColorsButton.name = 'light';
  } else {
    invertColorsButton.label = 'dark ';
    invertColorsButton.name = 'dark ';
  }
  sprites = [];
  let spritePixelSize = int(max(3, tSize/12));
  for (let i = 0; i < spriteCount; i++){
    sprites.push([genSprite(8, 5, spritePixelSize, colorOfTheTime), random(view.width), random(view.height), int(random(-2, 2)), 1, int(random(50, 100)), spritePixelSize]);
  }
  tank = new Tank(spritePixelSize, view.width / 2, view.height - 6 * spritePixelSize, colorOfTheTime);
  // prettify
  background(bgColor);
  view.background(bgColor);
  drawGradient(colorOfTheTime);
}

function preload() {
  titleStringArr = loadStrings('textAssets/title.txt');
  titleDivStringArr  = loadStrings('textAssets/title.html');
  contentStringArr = loadStrings('https://b38tn1k.com/map_for_p5/');
  // contentStringArr = loadStrings('http://127.0.0.1:4000/map_for_p5/');
}

function deviceTurned() {
  setupScreen();
}

function windowResized() {
  setupScreen();
}

function mousePressed() {
  mx = mouseX;
  my = mouseY;
  if (buttonPressed(showBackgroundButton, mx, my)){
    showBackground = !showBackground;
    if (showBackground) {
      showBackgroundButton.label = 'BG: OFF ';
    } else {
      showBackgroundButton.label = 'BG: ON ';
    }
    return false;
  }
  if (buttonPressed(retroButton, mx, my)) {
    retro = ! retro;
    setupScreen();
    return false;
  }
  if (buttonPressed(invertColorsButton, mx, my)){
    invertColors = !invertColors;
    setupScreen();
    return false;
  }
  if (showItem && buttonLabels[itemToShow] == 'music' && buttonPressed(nextItem, mx, my)) {
    nextItem.clickCountDown = 2;
    nextAlbum();
    return false;

  }
  if (showItem && buttonLabels[itemToShow] == 'music' && buttonPressed(previousItem, mx, my)) {
    previousItem.clickCountDown = 2;
    previousAlbum();
    return false;
  }
  if (showItem && buttonLabels[itemToShow] == 'demos' && buttonPressed(nextItem, mx, my)) {
    nextItem.clickCountDown = 2;
    nextDemo();
    return false;

  }
  if (showItem && buttonLabels[itemToShow] == 'demos' && buttonPressed(previousItem, mx, my)) {
    previousItem.clickCountDown = 2;
    previousDemo();
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

function keyTyped() {
  if (key === ' ') {
    game = true;
    tank.shoot();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    tank.moveLeft();
  }
  if (keyCode === RIGHT_ARROW) {
    tank.moveRight();
  }
}

function nextAlbum() {
  discography[albumPointer].div.hide();
  albumPointer += 1;
  if (albumPointer >= discography.length) {
    albumPointer = 0;
  }
  discography[albumPointer].div.show();
}

function previousAlbum() {
  discography[albumPointer].div.hide();
  albumPointer -= 1;
  if (albumPointer == -1) {
    albumPointer = discography.length-1;
  }
  discography[albumPointer].div.show();
}

function nextDemo() {
  demos[demoPointer].div.hide();
  demoPointer += 1;
  if (demoPointer >= demos.length) {
    demoPointer = 0;
  }
  demos[demoPointer].div.show();
}

function previousDemo() {
  demos[demoPointer].div.hide();
  demoPointer -= 1;
  if (demoPointer == -1) {
    demoPointer = demos.length-1;
  }
  demos[demoPointer].div.show();
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
  frameRate(5);
  setupScreen();
}

function draw(){
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  rectMode(CENTER);
  if (showBackground && retro) {
    view.image(gradient, 0, 0);
    drawSprites();
    if (game) {
      for (let j = 0; j < tank.bulletsX.length; j++) {
        if (tank.bulletsY[j] > 0) {
          view.image(tank.bullet, tank.bulletsX[j], tank.bulletsY[j]);
          tank.bulletsY[j] -= 20 * tank.pixelSize;
        }
      }
      view.image(tank.sprite, tank.x, tank.y);
      if (keyIsDown(LEFT_ARROW)){
        tank.moveLeft();
      } else if (keyIsDown(RIGHT_ARROW)){
        tank.moveRight();
      } else {
        tank.speedReset();
      }
    }
  } else {
    background(bgColor);
  }

  if (showItem) {
    if (invertColors){
      view.fill(0, 0, 0, 2*transparent);
    } else {
      view.fill(255, 255, 255, transparent);
    }

    view.rect(0, 0, view.width, view.height);
  }
  if (showBackground) {
    image(view, centerX, centerY);
  }
  // fill(255, 255, 0);
  // text(titleString, centerX, titleY);
  textStyle(BOLD);
  noStroke();

  if (showItem) {
    if (retro) {
      titleDiv.hide();
      drawButton(exitButton);
    }
    if (buttonLabels[itemToShow] == 'music'){
      discography[albumPointer].div.show();
      demos[demoPointer].div.hide();
      postDiv.hide();
      if (retro) {
        drawButton(nextItem);
        drawButton(previousItem);
      }
    } else if (buttonLabels[itemToShow] == 'blog'){
      postDiv.show();
      discography[albumPointer].div.hide();
      demos[demoPointer].div.hide();
    } else if (buttonLabels[itemToShow] == 'demos') {
      if (retro) {
        drawButton(nextItem);
        drawButton(previousItem);
      }
      demos[demoPointer].div.show();
      postDiv.hide();
      discography[albumPointer].div.hide();
    }
  } else {
    discography[albumPointer].div.hide();
    demos[demoPointer].div.hide();
    postDiv.hide();
    titleDiv.show();
    if (retro){
      drawButtons();
    }

  }
  if (retro) {
    drawButton(showBackgroundButton);
  }

  drawButton(retroButton);
  drawButton(invertColorsButton);
  drawBorder(view);

  // text('windowWidth: ' + windowWidth, 150, 10);
  // text('windowHeight: ' + windowHeight, 150, 30);
  // text('tSize: ' + textSize(), 150, 50);

}
