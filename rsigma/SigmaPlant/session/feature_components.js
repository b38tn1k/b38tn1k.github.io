const TEXT_WIDTH_MULTIPLIER = 1.5;
const TIGHT_DIM_GAP_PERCENT = 0.2;
const LOW_MID_DIM_GAP_PERCENT = 0.4;
const MID_DIM_GAP_PERCENT = 0.6;



function getUnsecureHash() {
    let myStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    myStr += myStr + myStr;
    return myStr.substring(0, 10);
}

class FeatureComponent {
    constructor(x, y) {
        this.board = createVector(x, y);
        this.screen = createVector(0, 0);
        this.offX = (x == 1); // or 1.0
        this.offY = (y == 1);
        this.screenDim;
        this.screenDimOn2;
        this.id = getUnsecureHash();
        this.targetID = 'none';
        this.doCheckMouseOver = false;
        this.hasMouseOver = false;
        this.mouseOverData = 'none';
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
        if (this.board.x == 0.5) { // Magic number: half way
            xa -= this.screenDimOn2;
        }
        this.screen = createVector(xa, ya);
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

    display(zoom, cnv, strokeColor, fillColor) {
        textSize((myTextSize * zoom));
        let wa = this.calculateWidth(zoom);
        this.draw(zoom, cnv, strokeColor, fillColor, wa);
    }

    updateScreenCoords(x, y, w, h) {
        const offsX = this.board.x * w;
        const offsY = this.board.y * h;
        let xa = x + offsX;
        if (offsX < this.screenDim && offsY < this.screenDim) {
            xa = x + TEXT_WIDTH_MULTIPLIER * this.screenDim;
        }
        let ya = y + this.board.y * h;
        if (offsY > h - this.screenDim) {
            ya = y + h - this.screenDim;
        }

        this.screen = createVector(xa, ya);
    }

    checkClicked(zoom) {
        return false;
    }

    checkMouseClick(zoom) {
        if (this.mode != 'busy') {
            if (this.checkClicked(zoom)) {
                this.mode = 'busy';
                this.action(this, this.screen.x, this.screen.y);
            }
        }
    }
}

class FeatureDataTextLabel extends PlantData {
    constructor(x, y, data, height, action) {
        super(x, y, data, height, action);
    }

    calculateWidth(zoom) {
        textSize((myTextSize * zoom));
        let wa = textWidth(this.data) * TEXT_WIDTH_MULTIPLIER;
        if (wa == 0) {
            wa = this.screenDim;
        }
        return wa;
    }

    checkClicked(zoom) {
        let wa = this.calculateWidth(zoom);
        const waOn2 = wa/2;
        const centerX = this.screen.x + waOn2; // Calculate the X coordinate of the center of the button
        const centerY = this.screen.y + this.screenDimOn2; // Calculate the Y coordinate of the center of the button
        const distanceX = Math.abs(mouseX - centerX);
        const distanceY = Math.abs(mouseY - centerY);
        return(distanceX < waOn2 && distanceY < this.screenDimOn2 * zoom);
    }

    draw(zoom, cnv, strokeColor, fillColor, width) {
        fill(fillColor);
        stroke(strokeColor);
        rect(this.screen.x, this.screen.y, width, this.screenDim);
        fill(strokeColor);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.data, this.screen.x + width / 2, this.screen.y + this.screenDim / 2); // Center the text within the rectangle
    }
}

class FeatureDataTextLabelTrigger extends FeatureDataTextLabel {
    checkMouseClick(zoom) {
        if (this.checkClicked(zoom)) {
            this.action(this, this.screen.x, this.screen.y);
        }
    }
}

class FeatureDataIDLabel extends FeatureDataTextLabel {
    constructor(x, y, data, height) {
        super(x, y, data, height, NOP);
    }

    checkClicked(zoom) {
        return false;
    }

    draw(zoom, cnv, strokeColor, fillColor, width) {
        fill(strokeColor);
        noStroke();
        textAlign(LEFT, TOP);
        textSize((myTextSize * zoom) / 2);
        text(this.data, this.screen.x + this.screenDim * TIGHT_DIM_GAP_PERCENT, this.screen.y + this.screenDim * MID_DIM_GAP_PERCENT); // Center the text within the rectangle
    }
}
