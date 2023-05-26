class FeatureComponent {
    constructor(x, y) {
        this.board = createVector(x, y);
        this.screen = createVector(0, 0);
        this.offX = (x == 1);
        this.offY = (y == 1);
        this.screenDim;
        this.screenDimOn2;
    }

    updateScreenCoords(x, y, w, h) {
        let xa = x + this.board.x * w;
        let ya = y + this.board.y * h;
        if (this.offY === true) {
            ya -= this.screenDim;
        }
        if (this.offX === true) {
            xa -= this.screenDim;
        }
        if (this.board.x == 0.5) {
            xa -= this.screenDimOn2;
        }
        this.screen = createVector(xa, ya);
    }
}

class PlantUIButton extends FeatureComponent {
    constructor(label, x, y, size, action) {
        super(x, y);
        this.label = label;
        this.action = action;
        this.boardDim = size;

    }

    update(zoom, x, y, w, h) {
        this.screenDim = this.boardDim * zoom;
        this.screenDimOn2 = this.screenDim / 2;
        this.updateScreenCoords(x, y, w, h);
    }

    drawXIcon(xa, ya) {
        let off = 0.2 * this.screenDim;
        let xs = xa + off;
        let xe = xa + this.screenDim - off;
        let ys = ya + off;
        let ye = ya + this.screenDim - off;
        line(xs, ys, xe, ye)
        line(xe, ys, xs, ye)
    }

    drawMoveIcon(xa, ya) {
        let off = 0.2 * this.screenDim;
        line(xa + this.screenDimOn2, ya + off, xa + this.screenDimOn2, ya + this.screenDim - off)
        line(xa + off, ya + this.screenDimOn2, xa + this.screenDim - off, ya + this.screenDimOn2)
    }

    drawResizeIcon(xa, ya) {
        const ratio = 0.5;
        const offset = this.screenDim * (1 - ratio) / 2;
        const arrowSize = this.screenDim * ratio;
        line(xa + offset, ya + offset, xa + arrowSize, ya + offset);
        line(xa + offset, ya + offset, xa + offset, ya + arrowSize);
        line(xa + offset + arrowSize, ya + offset + arrowSize, xa + offset + arrowSize, ya + 2 * offset);
        line(xa + 2 * offset, ya + offset + arrowSize, xa + offset + arrowSize, ya + offset + arrowSize);
    }

    drawLabelLetterIcon(xa, ya, zoom, textColor) {
        textSize((myTextSize * zoom));
        fill(textColor);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.label[0], xa + this.screenDimOn2, ya + this.screenDimOn2);
    }

    display(zoom, strokeColor, fillColor) {
        fill(fillColor);
        stroke(strokeColor);
        square(this.screen.x, this.screen.y, this.screenDim);
        let off;
        switch (this.label) {
            case 'Xdelete':
                this.drawXIcon(this.screen.x, this.screen.y);
                break;
            case 'Move':
                this.drawMoveIcon(this.screen.x, this.screen.y);
                break;
            case 'Resize':
                this.drawResizeIcon(this.screen.x, this.screen.y);
                break;
            default:
                this.drawLabelLetterIcon(this.screen.x, this.screen.y, zoom, strokeColor);
                break;
        }
    }

    checkMouseClick() {
        const clickX = this.screen.x + this.screenDimOn2;
        const clickY = this.screen.y + this.screenDimOn2;
        if (dist(mouseX, mouseY, clickX, clickY) < this.screenDim) {
            this.action(this);
        }
    }
}

class PlantData extends FeatureComponent {
    constructor(x, y, data, height, action) {
        super(x, y);
        this.data = data;
        this.boardDim = height;
        this.action = action;
        this.mode = 'idle';
    }

    update(zoom, x, y, w, h) {
        this.screenDim = this.boardDim * zoom;
        this.screenDimOn2 = this.screenDim / 2;
        this.updateScreenCoords(x, y, w, h);
    }

    updateScreenCoords(x, y, w, h) {
        const offsX = this.board.x * w;
        const offsY = this.board.y * h;
        let xa = x + offsX;
        if (offsX < this.screenDim && offsY < this.screenDim) {
            xa = x + 1.5 * this.screenDim;
        }
        let ya = y + this.board.y * h;
        if (offsY > h - this.screenDim) {
            ya = y + h - this.screenDim;
        }
        
        this.screen = createVector(xa, ya);
    }

    checkClicked() {
        return false;
    }

    checkMouseClick(zoom) {
        if (this.mode != 'busy') {
            if (this.checkClicked()) {
                this.mode = 'busy';
                this.action(this, this.screen.x, this.screen.y);
            }
        }
    }
}

class PlantDataTextLabel extends PlantData {
    constructor(x, y, data, height, action) {
        super(x, y, data, height, action);
    }

    calculateWidth(zoom) {
        textSize((myTextSize * zoom));
        let wa = textWidth(this.data) * 1.5;
        if (wa == 0) {
            wa = this.screenDim;
        }
        return wa;
    }

    checkClicked() {
        let wa = this.calculateWidth(zoom);
        const centerX = this.screen.x + wa / 2; // Calculate the X coordinate of the center of the button
        const centerY = this.screen.y + this.screenDim / 2; // Calculate the Y coordinate of the center of the button
        const distanceX = Math.abs(mouseX - centerX);
        const distanceY = Math.abs(mouseY - centerY);
        return (distanceX < wa / 2 && distanceY < (this.screenDim * zoom) / 2);
    }

    display(zoom, strokeColor, fillColor) {
        let wa = this.calculateWidth(zoom);
        fill(fillColor);
        stroke(strokeColor);
        rect(this.screen.x, this.screen.y, wa, this.screenDim);
        fill(strokeColor);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.data, this.screen.x + wa / 2, this.screen.y + this.screenDim / 2); // Center the text within the rectangle
    }
}

function getUnsecureHash() {
    let myStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    myStr += myStr + myStr;
    return myStr.substring(0, 10);
}