
var colors = ['#0f0', '#ff0', '#0ff', '#f0f'];

int rcol() {
  return colors[int(random(colors.length))];
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
  } else if (key == 'b') {
   background(rcol());
  } else {
    generate();
  }
}

float[] compass(float xf, float yf, float radius, float angle) {
  float x = xf + (radius * sin(angle));
  float y = yf + (radius * cos(angle));
  float forReturn[] = {x, y};
  return forReturn;
}

void saveImage() {
  String timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-"  + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  println(timestamp);
  saveFrame(timestamp+".png");
}

void generate() {
  clear();
  background(rcol());
  int c1 = rcol();
  int c2 = rcol();
  for (int i = 0; i < 1; i++) {
    spiro(100, 100, c1, c2);
  }
}

void spiro(float r1, float r2, int c1, int c2) {

  pushMatrix();
  translate(width/2, height/2);
  float thickness = 1;
  float rad1 = random(r1);
  float rad2 = random(r2);
  float twopi = 2*PI;
  int per = randint(10);
  noStroke();
  //int c1 = rcol();
  //int c2 = rcol();
  //float normRad = sqrt(width*width + height*height);
  float normRad = rad1 + rad2;
  float j = 0;
  for (float i = 0; i < twopi; i+=0.0001) {
      normRad = rad1 + rad2;
      j+= random(0.001, 0.008);
      float coords1[] = compass(0, 0, rad1 + rad2*sin(per*i), i);
      float coords2[] = compass(coords1[0], coords1[1], rad2, j);
      float dist = sqrt(coords2[0]*coords2[0] + coords2[1]*coords2[1]);
      float lerper = (dist/normRad);
      thickness = lerp(-10, 10, lerper);
      fill(lerpColor(c1, c2, lerper*0.5));
      ellipse(coords2[0], coords2[1], thickness, thickness);
    }
  popMatrix();

}

void spirally() {
  float count1 = 4;
  float count2 = 500;
  noStroke();
  while (count2 >=100) {
    int c1 = rcol();
    int c2 = rcol();
    float twopi = 2*PI;
    for (float k = 0; k < twopi; k+= PI/count1) {
      println(k);
      pushMatrix();
      translate(width/2, height/2);
      rotate(k);


      float orad = count2;
      float rad = orad;
      float erad = 5;

      for (float i = 0; i < twopi; i+=(PI/rad)) {
        fill (lerpColor(c1, c2, (rad/orad)));
        float coords[] = compass(0, 0, rad, i);
        ellipse(coords[0], coords[1], erad, erad);
        rad --;
        erad += 0.1;
      }
      popMatrix();
    }
    count1*=1.2;
    count2-=50;
  }
}

void setup() {
  size(512, 512, P3D);
  smooth(8);
  //pixelDensity(2);
  background(rcol());
  generate();
}

void draw() {
  //generate();
}
