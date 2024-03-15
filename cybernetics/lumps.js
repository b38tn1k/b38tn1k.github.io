class Lumps extends Grid {
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 5);
        this.flakes = [];
        let count = 5;
        this.counter = 0;

        for (var y = 0; y < count; y++) {
            for (var x = 0; x < count; x++) {
                for (var i = 0; i < 3; i++) {
                    this.flakes.push(this.newFlake(x * this.cellSize, y * this.cellSize));
                }
            }
        }
    }

    newFlake(x, y) {
        return new Flake(x, y, this.numCells, this.cellSize * 0.5, this.myColors['brickRed'], this.myColors['teal']);
    }

    static() {
        for (var i = 0; i < this.flakes.length; i++) {
            if (this.modifier != 1) {
                this.counter += 1;
                if (this.counter % 2 == 0) {
                    this.flakes[i].update();
                }
            }

            this.flakes[i].draw();
            if (this.flakes[i].dead) {
                this.flakes[i] = this.newFlake(this.flakes[i].x, this.flakes[i].y);
            }
        }
    }
}

function Flake(x, y, cs, s, c1, c2) {
    this.dead = false;
    this.x = x;
    this.y = y;
    this.cellSize = cs;
    this.size = s;
    this.c1 = c1;
    this.c2 = c2;

    var segCount = random(2, 10);
    var segs = [];

    var dir = p5.Vector.fromAngle(floor(random(4)) * (TWO_PI / 4)).mult(this.cellSize);

    var pos = createVector(
        Math.ceil(random(this.size) / this.cellSize) * this.cellSize,
        Math.ceil(random(this.size) / this.cellSize) * this.cellSize
    );

    var newPos = createVector(0, 0);

    segs.push(pos);

    this.update = function () {
        if (random() < 0.3) {
            dir.rotate(random() < 0.5 ? -PI / 2 : PI / 2);
        }

        //move
        newPos = p5.Vector.add(pos, dir);

        segs.unshift(newPos);
        pos = newPos;

        if (segs.length > segCount) segs.pop();
    };

    // var c = color(random(360), random(10, 70), 100);
    // var c = lerpColor(random(0, 1), this.c1, this.c2);
    if (random(1.0) > 0.33){
        var c = this.c1;
    } else {
        var c = this.c2;
    }
    
    strokeWeight(max(1, this.size * 0.05));

    this.draw = function () {
        stroke(c);
        this.dead = true;

        for (var i = 0; i < segs.length - 1; i++) {
            var s = segs[i];
            var e = segs[i + 1];

            if (s.x >= 0 && s.x <= this.size && s.y >= 0 && s.y <= this.size) {
                if (e.x >= 0 && e.x <= this.size && e.y >= 0 && e.y <= this.size) {
                    line(s.x + this.x, s.y + this.y, e.x + this.x, e.y + this.y);
                    line(s.y + this.x, s.x + this.y, e.y + this.x, e.x + this.y);

                    line(this.size - s.x + this.x, s.y + this.y, this.size - e.x + this.x, e.y + this.y);
                    line(this.size - s.y + this.x, s.x + this.y, this.size - e.y + this.x, e.x + this.y);

                    line(s.x + this.x, this.size - s.y + this.y, e.x + this.x, this.size - e.y + this.y);
                    line(s.y + this.x, this.size - s.x + this.y, e.y + this.x, this.size - e.x + this.y);

                    line(
                        this.size - s.x + this.x,
                        this.size - s.y + this.y,
                        this.size - e.x + this.x,
                        this.size - e.y + this.y
                    );
                    line(
                        this.size - s.y + this.x,
                        this.size - s.x + this.y,
                        this.size - e.y + this.x,
                        this.size - e.x + this.y
                    );

                    this.dead = false;
                }
            }
        }
    };
}
