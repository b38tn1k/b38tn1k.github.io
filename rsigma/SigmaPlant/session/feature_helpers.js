class FeatureComponent {
    constructor(x, y) {
        this.board = createVector(x, y);
        this.screen = createVector(0, 0);
        this.offX = (x == 1);
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
        if (this.board.x == 0.5) {
            xa -= this.screenDimOn2;
        }
        this.screen = createVector(xa, ya);
    }
}

class FeatureUIButton extends FeatureComponent {
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

    drawXIcon(xa, ya, offval = 0.2) {
        let off = offval * this.screenDim;
        let xs = xa + off;
        let xe = xa + this.screenDim - off;
        let ys = ya + off;
        let ye = ya + this.screenDim - off;
        line(xs, ys, xe, ye)
        line(xe, ys, xs, ye)
    }
    drawCross(xa, ya, offval = 0.2) {
        let off = offval * this.screenDim;
        line(xa + this.screenDimOn2, ya + off, xa + this.screenDimOn2, ya + this.screenDim - off)
        line(xa + off, ya + this.screenDimOn2, xa + this.screenDim - off, ya + this.screenDimOn2)
    }

    display(zoom, cnv, strokeColor, fillColor) {
        fill(fillColor);
        stroke(strokeColor);
        square(this.screen.x, this.screen.y, this.screenDim);
        this.draw(this.screen.x, this.screen.y, zoom, cnv, strokeColor);
    }

    checkMouseOver(zoom) {
        if (this.doCheckMouseOver) {
            const clickX = this.screen.x + this.screenDimOn2;
            const clickY = this.screen.y + this.screenDimOn2;
            this.hasMouseOver = (dist(mouseX, mouseY, clickX, clickY) < this.screenDim)
        }
        return this.hasMouseOver;
    }

    checkMouseClick(zoom) {
        const clickX = this.screen.x + this.screenDimOn2;
        const clickY = this.screen.y + this.screenDimOn2;
        let caller = false;
        if (dist(mouseX, mouseY, clickX, clickY) < this.screenDim) {
            this.action(this);
            caller = true;
        }
        return caller;
    }
}

class FeatureUIButtonClose extends FeatureUIButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
    }
    draw(xa, ya, zoom, cnv, textColor) {
        this.drawXIcon(xa, ya);
    }
}

class FeatureUIButtonMove extends FeatureUIButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
    }
    draw(xa, ya, zoom, cnv, textColor) {
        this.drawCross(xa, ya);
    }
}

class FeatureUIButtonResize extends FeatureUIButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
    }
    draw(xa, ya, zoom, cnv, textColor) {
        const ratio = 0.5;
        const offset = this.screenDim * (1 - ratio) / 2;
        const arrowSize = this.screenDim * ratio;
        line(xa + offset, ya + offset, xa + arrowSize, ya + offset);
        line(xa + offset, ya + offset, xa + offset, ya + arrowSize);
        line(xa + offset + arrowSize, ya + offset + arrowSize, xa + offset + arrowSize, ya + 2 * offset);
        line(xa + 2 * offset, ya + offset + arrowSize, xa + offset + arrowSize, ya + offset + arrowSize);
    }
}

class FeatureUIButtonLetterLabel extends FeatureUIButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
    }
    draw(xa, ya, zoom, cnv, textColor) {
        textSize((myTextSize * zoom));
        fill(textColor);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.label[0], xa + this.screenDimOn2, ya + this.screenDimOn2);
    }
}

class FeatureUIOutputLabel extends FeatureUIButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
        this.connected = false;
        this.associatedConnector = null;
    }

    update(zoom, x, y, w, h) {
        super.update(zoom, x, y, w, h);
    }

    checkMouseClick(zoom) {
        if (this.connected) {
            const clickX = this.screen.x + this.screenDimOn2;
            const clickY = this.screen.y + this.screenDimOn2;
            if (dist(mouseX, mouseY, clickX, clickY) < this.screenDim) {
                this.associatedConnector.markToDelete();
            }
        } else {
            return super.checkMouseClick(zoom);
        }
    }

    draw(xa, ya, zoom, cnv, textColor) {
        if (this.connected) {
            this.drawXIcon(xa, ya, 0.3);
        } else {
            textSize((myTextSize * zoom));
            fill(textColor);
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.label[0], xa + this.screenDimOn2, ya + this.screenDimOn2);
        }

        if (this.hasMouseOver) {
            textSize((myTextSize * zoom));
            fill(textColor);
            noStroke();
            text(this.mouseOverData, xa + this.screenDimOn2, ya - this.screenDim);
        }
    }

}

class FeatureUIInputLabel extends FeatureUIOutputLabel {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
        this.id = getUnsecureHash();
    }

    // draw(xa, ya, zoom, cnv, textColor) {
    //     textSize((myTextSize * zoom));
    //     fill(textColor);
    //     noStroke();
    //     textAlign(CENTER, CENTER);
    //     text(this.label[0], xa + this.screenDimOn2, ya + this.screenDimOn2);
    //     if (this.hasMouseOver) {
    //         // console.log(this.id, this.targetID, this.mouseOverData);
    //         text(this.mouseOverData, xa + this.screenDimOn2, ya - this.screenDim);
    //     }
    // }

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
            xa = x + 1.5 * this.screenDim;
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
        let wa = textWidth(this.data) * 1.5;
        if (wa == 0) {
            wa = this.screenDim;
        }
        return wa;
    }

    checkClicked(zoom) {
        let wa = this.calculateWidth(zoom);
        const centerX = this.screen.x + wa / 2; // Calculate the X coordinate of the center of the button
        const centerY = this.screen.y + this.screenDim / 2; // Calculate the Y coordinate of the center of the button
        const distanceX = Math.abs(mouseX - centerX);
        const distanceY = Math.abs(mouseY - centerY);
        return(distanceX < wa / 2 && distanceY < (this.screenDim * zoom) / 2);
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

function getUnsecureHash() {
    let myStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    myStr += myStr + myStr;
    return myStr.substring(0, 10);
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

    draw(zoom, cnv, strokeColor, fillColor, width) {
        fill(strokeColor);
        noStroke();
        textAlign(LEFT, TOP);
        textSize((myTextSize * zoom) / 2);
        text(this.data, this.screen.x + this.screenDim * 0.2, this.screen.y + this.screenDim * 0.6); // Center the text within the rectangle
    }
}
