class RoamingPixel {
    constructor(p) {
        this.p = p;
        this.x = random(0, p.canvasSize);
        this.y = random(0, p.canvasSize);
        // this.hypot = dist(this.x, this.y, this.p.canvasSizeOn2, this.p.canvasSizeOn2);
        // while (this.hypot > this.p.canvasSizeOn4) {
        //     this.x = random(0, p.canvasSize);
        //     this.y = random(0, p.canvasSize);
        //     this.hypot = dist(this.x, this.y, this.p.canvasSizeOn2, this.p.canvasSizeOn2);
        // }
        this.tx = random(0, this.p.canvasSize);
        this.ty = random(0, this.p.canvasSize);
        this.h = random(-TWO_PI, TWO_PI);
        this.th = random(-TWO_PI, TWO_PI);
        this.h = this.th + random(-QUARTER_PI, QUARTER_PI);
        this.s = 0.3;
        this.maxS = 2;
        // this.dim = Math.floor(random(1, 4)) * p.cellSize;
        this.dim = p.cellSize;
        this.r = this.dim * 0.2;
        this.damp = 0.02;
        this.damp2 = 0.2;
        this.rotationInertia = random(-2, 2);
    }

    setXY(x, y) {
        this.x = random(this.p.canvasSizeOn4, this.p.canvasSizeOn2 + this.p.canvasSizeOn4);
        this.y = random(this.p.canvasSizeOn4, this.p.canvasSizeOn2 + this.p.canvasSizeOn4);
        this.tx = x;
        this.ty = y;
    }

    distanceTo(n) {
        return dist(this.x, this.y, n.x, n.y);
    }

    dampedMove(i, j) {
        let res = (i - j) * this.damp;
        return res;
    }

    increaseSpeed(p = 1) {
        this.s += this.damp2;
        this.s = min(this.s, this.maxS);
    }

    decreaseSpeed(p = 1) {
        this.s -= this.damp2;
        this.s = max(this.s, 0.5);
    }

    hypotTo(x, y) {
        return dist(x, y, this.x, this.y);
    }

    angleAway(x, y) {
        return atan2(this.y - y, this.x - x);
    }

    update() {
        this.th += radians(this.rotationInertia);
        this.h += this.dampedMove(this.th, this.h);
        this.x += this.dampedMove(this.tx, this.x);
        this.y += this.dampedMove(this.ty, this.y);
        // this.x += sin(millis() / this.f1) * this.cellSize;
        // this.y += Math.cos(millis() / this.f2) * this.cellSize;
        this.hypot = dist(this.x, this.y, this.p.canvasSizeOn2, this.p.canvasSizeOn2);
    }

    draw() {
        let scale;
        if (this.hypot > this.p.canvasSizeOn2) {
            scale = 0;
        } else {
            scale = 1.5 * (1 - this.hypot / this.p.canvasSizeOn2);
        }
        scale *= this.p.modifier;
        push();
        translate(this.x, this.y);
        rotate(this.h + this.p.modifier * TWO_PI);
        square(0, 0, this.dim * scale, this.r * this.p.modifier);
        pop();
    }

    log() {
        console.log("tx", this.tx, "ty", this.ty, "th", this.th);
        console.log("x ", this.x, "y ", this.y, "h ", this.h);
    }
}

class Logo extends Grid {
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 50);
        this.canvasSizeOn2 = canvasSize / 2;
        this.canvasSizeOn4 = canvasSize / 4;
        this.image = logo;
        this.scaleX = this.image.width / this.canvasSize;
        this.scaleY = this.image.height / this.canvasSize;
        this.nodes = [];
        this.counter = 0;
        for (let i = 0; i < this.canvasSize; i += this.cellSize) {
            for (let j = 0; j < this.canvasSize; j += this.cellSize) {
                let a = this.mapToImageAlpha(i, j);
                if (a != 0) {
                    let n = new RoamingPixel(this);
                    n.setXY(i, j);
                    this.nodes.push(n);
                }
            }
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
        let modder = 20;
        let number = 1;
        let maxHypot = this.canvasSize;
        if (mouseX > 0 && mouseX < this.canvasSize && mouseY > 0 && mouseY < this.canvasSize) {
            number = int(map(mouseX, 0, this.canvasSize, 1, 50));
            modder  = int(map(mouseX, 0, this.canvasSize, 5, 25));
            maxHypot = map(mouseY, this.canvasSize, 0, this.cellSize * 3, this.canvasSize);
        }

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].update();
        }
        this.counter += 1;
        if (this.counter % modder == 0) {
            for (let i = 0; i < number; i++) {
                let randomChoice1 = Math.floor(random(this.nodes.length));
                let i = this.nodes[randomChoice1];

                let randomChoice2 = Math.floor(random(this.nodes.length));
                let j = this.nodes[randomChoice2];
                let dif = i.distanceTo(j);
                while (dif > maxHypot) {
                    randomChoice2 = Math.floor(random(this.nodes.length));
                    j = this.nodes[randomChoice2];
                    dif = i.distanceTo(j);
                }
                let [tx, ty, th] = [i.tx, i.ty, i.th];
                i.tx = j.tx;
                i.ty = j.ty;
                i.th = j.th;
                j.tx = tx;
                j.ty = ty;
                j.th = th;
            }
        }

        for (let i = 0; i < this.nodes.length; i++) {
            if (i % 2 == 0) {
                fill(this.myColors["brickRed"]);
            } else {
                fill(this.myColors["teal"]);
            }
            this.nodes[i].draw();
        }

        // for (let i = 0; i < this.canvasSize; i += this.cellSize) {
        //     for (let j = 0; j < this.canvasSize; j += this.cellSize) {
        //         let a = this.mapToImageAlpha(i, j);
        //         if (a != 0) {
        //             square(i, j, this.cellSize);
        //         }
        //     }
        // }
    }
}
