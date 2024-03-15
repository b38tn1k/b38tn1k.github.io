`
https://openprocessing.org/sketch/2146220
https://openprocessing.org/sketch/2176867
https://openprocessing.org/sketch/2187699

`

class FlowField extends Grid {
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 100);
        this.num = 3000;
        this.particles_a = [];
        this.particles_b = [];
        this.particles_c = [];
        this.fade = 600;
        this.radius = this.cellSize;
        this.noiseScale = 400;
        this.noiseStrength = 1.4;
        this.image = logo;
        this.scaleX = this.image.width / this.canvasSize;
        this.scaleY = this.image.height / this.canvasSize;
        for (let i = 0; i < this.num; i++) {
            let loc_a = createVector(random(this.canvasSize * 1.2), random(this.canvasSize), 2);
            let angle_a = random(TWO_PI);
            let dir_a = createVector(cos(angle_a), sin(angle_a));
            let loc_b = createVector(random(this.canvasSize * 1.2), random(this.canvasSize), 2);
            let angle_b = random(TWO_PI);
            let dir_b = createVector(cos(angle_b), sin(angle_b));
            let loc_c = createVector(random(this.canvasSize * 1.2), random(this.canvasSize), 2);
            let angle_c = random(TWO_PI);
            let dir_c = createVector(cos(angle_c), sin(angle_c));
            this.particles_a[i] = new Particle(loc_a, dir_a, 0.5, this.canvasSize, this.noiseScale, this.noiseStrength);
            this.particles_b[i] = new Particle(loc_b, dir_b, 0.5, this.canvasSize, this.noiseScale, this.noiseStrength);
            this.particles_c[i] = new Particle(loc_c, dir_c, 0.75, this.canvasSize, this.noiseScale, this.noiseStrength);
        }
    }

    mapToImageAlpha(x, y) {
        let imageX = x * this.scaleX;
        let imageY = y * this.scaleY;
        imageX = constrain(imageX, 0, this.image.width - 1);
        imageY = constrain(imageY, 0, this.image.height - 1);
        let pixelColor = this.image.get(imageX, imageY);
        let alphaValue = alpha(pixelColor);
        return alphaValue;
    }

    static() {
        let c;
        noStroke();
        for (let i = 0; i < this.num; i++) {
            c = this.myColors['brickRed'];
            c.setAlpha(this.fade);
            fill(c);
            let a = this.mapToImageAlpha(this.particles_a[i].dir.x, this.particles_a[i].dir.y);
            if (a != 0){
                this.particles_a[i].speed *= 0.8;
                
            }
            this.particles_a[i].move();
            this.particles_a[i].update(this.radius);
            this.particles_a[i].checkEdges();

            a = this.mapToImageAlpha(this.particles_b[i].dir.x, this.particles_b[i].dir.y);
            if (a != 0){
                this.particles_b[i].speed *= 0.8;
                
            }

            c = this.myColors['teal'];
            c.setAlpha(this.fade);
            fill(c);
            this.particles_b[i].move();
            this.particles_b[i].update(this.radius);
            this.particles_b[i].checkEdges();
            

            a = this.mapToImageAlpha(this.particles_c[i].dir.x, this.particles_c[i].dir.y);
            if (a != 0){
                this.particles_c[i].speed *= 0.8;
                
            }

            c = this.myColors['goldenYellow'];
            c.setAlpha(this.fade);
            fill(c);
            this.particles_c[i].move();
            this.particles_c[i].update(this.radius);
            this.particles_c[i].checkEdges();
        }
    }
}

let Particle = function (loc_, dir_, speed_, dim, nsc, nst) {
    this.loc = loc_;
    this.dir = dir_;
    this.speed = speed_;
    this.width = dim;
    this.height = dim;
    this.d = 1;
    this.noiseScale = nsc;
    this.noiseStrength = nst;
};

Particle.prototype.run = function () {
    this.move();
    this.checkEdges();
    this.update();
};

// Method to move position
Particle.prototype.move = function () {
    this.angle =
        noise(this.loc.x / this.noiseScale, this.loc.y / this.noiseScale, frameCount / this.noiseScale) *
        TWO_PI *
        this.noiseStrength;
    this.dir.x = cos(this.angle) + sin(this.angle) - sin(this.angle);
    this.dir.y = sin(this.angle) - cos(this.angle) * sin(this.angle);
    this.vel = this.dir.copy();
    this.vel.mult(this.speed * this.d);
    this.loc.add(this.vel);
};

// Method to chech edges
Particle.prototype.checkEdges = function () {
    if (this.loc.x < 0 || this.loc.x > this.width || this.loc.y < 0 || this.loc.y > this.height) {
        this.loc.x = random(this.width * 1.2);
        this.loc.y = random(this.height);
    }
};

// Method to update position
Particle.prototype.update = function (r) {
    ellipse(this.loc.x, this.loc.y, r);
};
