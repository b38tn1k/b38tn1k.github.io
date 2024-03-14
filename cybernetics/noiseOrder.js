const FREE = 0;
const CAPTURED = 1;
const SORTED = 2;
const EXPLODE = 3;
const ONLINE = 4;

function sortNodesByClosest(nodes) {
    const sortedNodes = [];
    const unsortedNodes = [...nodes]; // Copy the array to preserve the original

    // Start with the first node and remove it from the unsorted nodes array
    let currentNode = unsortedNodes.shift();
    sortedNodes.push(currentNode);

    // Iterate until all nodes are sorted
    while (unsortedNodes.length > 0) {
        let closestNode;
        let closestDistance = Infinity;

        // Find the closest unsorted node to the current node
        for (const node of unsortedNodes) {
            const distance = currentNode.distanceTo(node);
            if (distance < closestDistance) {
                closestNode = node;
                closestDistance = distance;
            }
        }

        // Add the closest node to the sorted array and remove it from the unsorted array
        sortedNodes.push(closestNode);
        unsortedNodes.splice(unsortedNodes.indexOf(closestNode), 1);

        // Update the current node for the next iteration
        currentNode = closestNode;
    }

    return sortedNodes;
}

class Node {
    constructor(x, y, borders, field, c1, c2) {
        this.x = x;
        this.y = y;
        this.borders = borders;
        this.heading = random(-TWO_PI, TWO_PI);
        this.targetHeading = random(-TWO_PI, TWO_PI);
        this.c1 = c1;
        this.c2 = c2;
        // this.heading = - HALF_PI;
        // this.targetHeading = - HALF_PI;
        this.dampening = 0.05;
        this.mode = FREE;
        this.scale = 1.0;
        this.field = field;
        this.radius = 5;
        this.hypot = dist(this.x, this.y, this.field.cx, this.field.cy);
        if (this.hypot > this.field.r) {
            this.x = this.field.cx + 2;
            this.y = this.field.xy + 2;
            this.hypot = 0;
        }
    }

    randomiseHeading() {
        this.heading = random(-TWO_PI, TWO_PI);
        this.targetHeading = random(-TWO_PI, TWO_PI);
    }

    distanceTo(otherNode) {
        // Calculate the Euclidean distance between two nodes
        return Math.sqrt((this.x - otherNode.x) ** 2 + (this.y - otherNode.y) ** 2);
    }

    update(speed) {
        switch (this.mode) {
            case FREE:
            case ONLINE:
            case EXPLODE:
                this.hypot = dist(this.x, this.y, this.field.cx, this.field.cy);
                this.updateFree(speed);
                break;
            case CAPTURED:
                this.hypot = dist(this.x, this.y, this.field.cx, this.field.cy);
                this.updateCaptured(speed);
                break;
            default:
                break;
        }
    }

    updateCaptured(speed) {
        this.targetHeading = Math.atan2(this.field.cy - this.y, this.field.cx - this.x);

        this.x += speed * cos(this.heading);
        this.y += speed * sin(this.heading);

        if (this.hypot < 5) {
            this.mode = this.x = this.field.cx;
            this.y = this.field.cy;
            this.mode = SORTED;
        }

        this.heading += (this.targetHeading - this.heading) * this.dampening;
        this.scale = 1 - this.hypot / this.field.r2;
    }

    updateFree(speed) {
        if (int(degrees(this.targetHeading)) == int(degrees(this.heading))) {
            this.targetHeading = random(-TWO_PI, TWO_PI);
        }

        this.x += speed * cos(this.heading);
        this.y += speed * sin(this.heading);

        if (this.hypot > this.field.r2) {
            this.targetHeading = Math.atan2(this.field.cy - this.y, this.field.cx - this.x);
        }

        if (this.hypot < this.field.r * 0.45) {
            this.targetHeading = Math.atan2(this.y - this.field.cy, this.x - this.field.cx);
        }

        if (this.hypot > this.field.r * 0.45) {
            if (this.mode == EXPLODE) {
                this.mode = FREE;
            }
        }

        if (this.hypot > this.field.r) {
            this.mode = FREE;
        }

        this.heading += (this.targetHeading - this.heading) * this.dampening;
        this.scale = 1 - this.hypot / this.field.r2;
    }

    draw(dim, mod) {
        push();
        translate(this.x, this.y);
        rotate(mod * PI);
        let size = this.scale * dim * mod;
        if (this.mode == FREE || this.mode == EXPLODE) {
            fill(this.c1);
            square(0, 0, size, this.radius);
            fill(this.c2);
            square(0, 0, (1 - this.scale) * size, this.radius);
        } else if (this.mode == SORTED) {
            fill(this.c2);
            square(0, 0, size, this.radius);
        } else {
            fill(this.c1);
            square(0, 0, size, this.radius);
            fill(this.c2);
            square(0, 0, this.scale * size, this.radius);
        }

        pop();
    }
}

class Collector extends Grid {
    constructor(myColors, canvasSize) {
        super(myColors, canvasSize, 20);
        this.nodes = [];
        this.canvasSizeOn2 = this.canvasSize / 2;
        this.canvasSizeOn3 = this.canvasSize / 3;
        this.canvasSizeOn4 = this.canvasSize / 4;
        this.strokeWeight = max(1, this.cellSize * 0.05);
        this.prevC = [];
        // for (let i = 0; i < this.numCells; i++) {
        let b1 = this.cellSize * 3;
        let b2 = this.canvasSize - b1;
        let borders = { left: b1, right: b2, top: b1, bottom: b2 };
        let field = {
            w: this.canvasSize,
            h: this.canvasSize,
            cx: this.canvasSizeOn2,
            cy: this.canvasSizeOn2,
            r: this.canvasSizeOn2,
            r2: Math.sqrt(this.canvasSizeOn2 * this.canvasSizeOn2 * 2),
        };
        for (let i = 0; i < this.numCells * this.numCells; i++) {
            // for (let i = 0; i < 10; i++) {
            this.nodes.push(
                new Node(
                    random(this.cellSize, this.canvasSize - this.cellSize),
                    random(this.cellSize, this.canvasSize - this.cellSize),
                    borders,
                    field,
                    this.myColors["brickRed"],
                    this.myColors["teal"]
                )
            );
        }
    }

    static() {
        // fill(this.myColors["teal"]);
        // circle(this.canvasSizeOn2, this.canvasSizeOn2, this.modifier * this.canvasSizeOn4);

        let c = [];

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].mode == FREE || this.nodes[i].mode == CAPTURED || this.nodes[i].mode == ONLINE) {
                if (this.nodes[i].hypot < this.canvasSizeOn2) {
                    c.push(this.nodes[i]);
                }
            }
        }

        let limit = int(this.modifier * min(5, c.length - 1));
        if (limit > 1) {
            c = c.slice(0, limit + 1);
            c.sort((node1, node2) => {
                // Compare the hypot property of each node
                return node1.hypot - node2.hypot;
            });
            c = sortNodesByClosest(c);

            for (let n of this.prevC) {
                if (n.mode != SORTED) {
                    n.mode = FREE;
                }
            }
            this.prevC = c;
            stroke(0);
            strokeWeight(this.strokeWeight);
            line(this.canvasSizeOn2, this.canvasSizeOn2, c[0].x, c[0].y);
            for (let i = limit - 1; i >= 0; i--) {
                stroke(0);
                strokeWeight(this.strokeWeight);
                line(c[i].x, c[i].y, c[i + 1].x, c[i + 1].y);
                c[i].mode = ONLINE;
                c[i + 1].mode = ONLINE;
            }
            c[0].mode = CAPTURED;
        } else {
            for (let n of this.nodes) {
                n.mode = EXPLODE;
            }
        }

        noStroke();
        rectMode(CENTER);
        for (let n of this.nodes) {
            n.update(1);
            n.draw(this.cellSize, this.modifier);
        }
    }
}
