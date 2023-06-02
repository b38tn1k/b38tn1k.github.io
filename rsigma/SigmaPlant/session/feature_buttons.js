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

    drawXIcon(xa, ya, offval = TIGHT_DIM_GAP_PERCENT) {
        let off = offval * this.screenDim;
        let xs = xa + off;
        let xe = xa + this.screenDim - off;
        let ys = ya + off;
        let ye = ya + this.screenDim - off;
        line(xs, ys, xe, ye)
        line(xe, ys, xs, ye)
    }
    drawCross(xa, ya, offval = TIGHT_DIM_GAP_PERCENT) {
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

    getCenter () {
        const clickX = this.screen.x + this.screenDimOn2;
        const clickY = this.screen.y + this.screenDimOn2;
        return createVector(clickX, clickY);
    }

    checkMouseOver(zoom) {
        if (this.doCheckMouseOver) {
            const click = this.getCenter();
            this.hasMouseOver = (dist(mouseX, mouseY, click.y, click.y) < this.screenDim)
        }
        return this.hasMouseOver;
    }

    checkMouseClick(zoom) {
        const click = this.getCenter();
        let caller = false;
        if (dist(mouseX, mouseY, click.x, click.y) < this.screenDim) {
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
        const ratio = MID_DIM_GAP_PERCENT;
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

class FeatureUIOutputButton extends FeatureUIButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
        this.connected = false;
        this.associatedConnector = null;
    }

    checkMouseClick(zoom) {
        if (this.connected) {
            const click = this.getCenter();
            if (dist(mouseX, mouseY, click.x, click.y) < this.screenDim) {
                this.associatedConnector.markToDelete();
            }
        } else {
            return super.checkMouseClick(zoom);
        }
    }

    draw(xa, ya, zoom, cnv, textColor) {
        if (this.connected) {
            this.drawXIcon(xa, ya, LOW_MID_DIM_GAP_PERCENT);
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

class FeatureUIInputButton extends FeatureUIOutputButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
        this.id = getUnsecureHash();
    }
}