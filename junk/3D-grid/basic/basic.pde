int cols, rows;
int scl = 100;
int w = 5000;
int h = 5000;
float[][] terrain;
float res = 0.05;
float amp = 300;
float flying = 0;
int colors[] = {#F6511D, #FFB400, #00A6ED, #7FB800, #E56399, #FFFFFF};
int rcol() {
  return colors[int(random(colors.length))];
};

void setup() {
    size(500, 500, P3D);
    cols = w / scl;
    rows = h / scl;
    terrain = new float[cols+1][rows+1];
    
}

float speed = 0.01;

void draw() {
  background (0);
  flying -= speed;
  float yoff = flying;
  for (int y = 0; y < rows; y++) {
      float xoff = 0;
        for (int x = 0; x < cols; x++) {
          float valley = (1.0 - sin(PI*((1.0*x)/cols))) * amp*3;
          terrain[x][y] = map(noise(xoff, yoff), 0, 1, -amp, amp) + valley;// + random(amp * noisGain);
          xoff += res;
        }
        yoff += res;
    }
    push();
    fill(0, 0, 0);
    stroke(100, 255, 100);
    translate(width/2,height);
    rotateX(PI/2);
    translate(-w/2, -h/2);
    strokeWeight(2);
    
    for (int y = 0; y < rows; y++) {
      beginShape(TRIANGLE_STRIP);
      for (int x = 0; x < cols; x++) {
         vertex(x * scl, y*scl, terrain[x][y]);
         vertex(x * scl, (y+1)*scl, terrain[x][y+1]);
       }
       endShape();
     }
     
     stroke(0);
    translate(width / 2, height / 2);
    pop();
}
    
