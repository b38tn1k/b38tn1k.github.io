//int colors[] = {#EBB858, #EEA8C1, #D0CBC3, #87B6C4, #EA4140, #5A5787, #D0CBC3, #87B6C4, #EA4140, #5A5787};
//green = #7FB800
//int colors[] = {#F6511D, #FFB400, #00A6ED, #7FB800, #E56399, #FFFFFF};
//int colors[] = {#666666};
int colors[] = {#845EC2, #D65DB1, #FF6F91, #FF9671, #FFC75F, #F9F871};
//int colors[] = {#896234, #906a41, #565c41, #41443b, #a17a4d, #645f49, #526246, #666c5c, #625e3c, #484640, #aa8058, #988964, #9f7d57, #363d36, #866637}; //camo
//int colors[] = {#F6511D, #FFB400, #00A6ED, #E56399, #FFFFFF};
int version = 0;
int rcol() {
  return colors[int(random(colors.length))];
};

int rcolsub(int colors[], int len) {
  return colors[int(random(len))];
};

boolean coin() {
  return random(1) > .5;
}

int randint(int x) {
  return int(random(x));
}

void keyPressed() {
  if (key == 's') {
    saveImage();
  } else {
    generate();
  }
}

void saveImage() {
  String name = "Personal_Space_Invader_" + nf(version, 3);
  version += 1;
  saveFrame(name+".png");
}

void generate() {
  background(0);
  stroke(255);
  int pixelSize = 15;
  invader((width/2) , (height/2), 3  * pixelSize, random(5.0, 7.0), 8);
}

void invader(int x, int y, int pixelSize, float invLength, float invHeight) {
  invLength = float(int(invLength));
  invHeight = float(int(invHeight));
  //crab 8 x 11
  //squid 8 x 8
  //octopus 8 x 12
  //float invLength = 4.0; // use these to calculate translation later
  //float invLength = 6.0; // use these to calculate translation later
  //float invHeight = 8.0;
  float grid[][] = new float[int(invLength)][int(invHeight)];
  float max = 0.0;
  //generate
  for (int i = 0; i < invLength; i++) {
    for (int j = 0; j < invHeight; j++) {
      // probability of pixel decreases radiating from grid[6][4]
      // random component
      //grid[i][j] = 0;
      grid[i][j] = random(2);
      // increase density towards horizontal center
      grid[i][j] = grid[i][j] + sin(radians(90*i/invLength)); 
      // increase density towards vertical center
      grid[i][j] = grid[i][j] + sin(radians(180*(j/invHeight)));  
      // reduce density near eye areas
      
      // end of generating
      if (grid[i][j] > max) {
        max = grid[i][j];
      }
    }
  }
  //scale and prepare for threshold
  float sum = 0;
  int count = 0;
  for (int i = 0; i < invLength; i++) {
    for (int j = 0; j < invHeight; j++) {
      grid[i][j] = grid[i][j]/max;
      sum += grid[i][j];
      count++;
    }
  }
  float average = sum/count;
  float threshhold = average;
  int xpos = 0;
  int ypos = 0;
  pushMatrix();
  translate(x - pixelSize*int(invLength), y - pixelSize*int(invHeight/2));
  //translate etc
  for (int i = 0; i < invLength; i++) {
    for (int j = 0; j < invHeight; j++) {
      if (grid[i][j] > threshhold) {
        rect(xpos, ypos, pixelSize, pixelSize);
      }
      ypos += pixelSize;
    }
    ypos = 0;
    xpos += pixelSize;
  }
  int invlen = int(invLength) - 1;
  for (int i = 0; i < invLength; i++) {
    for (int j = 0; j < invHeight; j++) {
      if (grid[invlen- i][j] > threshhold) {
        rect(xpos, ypos, pixelSize, pixelSize);
      }
      ypos += pixelSize;
    }
    ypos = 0;
    xpos += pixelSize;
  }
  popMatrix();
}

void setup() {
  size(700, 700);
  background(0);
  generate();
}

//void mouseClicked() {
// invader(mouseX, mouseY, 10, 6.0, 8.0); 
//}

void draw() {
  //generate();
  //saveImage();
}
