class DrawUtils {
    static drawXIcon(g, xa, ya, offval = TIGHT_DIM_GAP_PERCENT) {
        let off = offval * g.sSqrDim;
        let xs = xa + off;
        let xe = xa + g.sSqrDim - off;
        let ys = ya + off;
        let ye = ya + g.sSqrDim - off;
        line(xs, ys, xe, ye);
        line(xe, ys, xs, ye);
    }

    static drawCross(g, xa, ya, offval = TIGHT_DIM_GAP_PERCENT) {
        let off = offval * g.sSqrDim;
        line(
            xa + g.sSqrDimOn2,
            ya + off,
            xa + g.sSqrDimOn2,
            ya + g.sSqrDim - off
        );
        line(
            xa + off,
            ya + g.sSqrDimOn2,
            xa + g.sSqrDim - off,
            ya + g.sSqrDimOn2
        );
    }
}

class FeatureUIButton extends FeatureComponent {
    constructor(label, x, y, size, action) {
        super(x, y, size);
        this.data['data'] = label;
        this.mouseOverData = label.toUpperCase();
        this.hasMouseOver = false;
        this.action = action;
        this.g.static = false;
    }

    display(zoom, cnv, strokeColor, fillColor) {
        fill(fillColor);
        stroke(strokeColor);
        square(this.g.sCart.x, this.g.sCart.y, this.g.sSqrDim);
        this.draw(this.g.sCart.x, this.g.sCart.y, zoom, cnv, strokeColor);
    }

    doMouseOverText(zoom, textColor) {
        if (this.hasMouseOver) {
            textAlign(LEFT, CENTER);
            textSize(myTextSize * zoom);
            fill(textColor);
            noStroke();
            text(
                this.mouseOverData,
                this.g.sCart.x,
                this.g.sCart.y - this.g.sSqrDim
            );
        }
    }

    mouseClickActionHandler(zoom) {
        let caller = false;
        if (this.g.checkMouseOver(mouseX, mouseY)) {
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
        // this.drawXIcon(xa, ya);
        DrawUtils.drawXIcon(this.g, xa, ya);
    }
}

class FeatureUIButtonMove extends FeatureUIButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
        this.mouseOverData = label.toUpperCase();
    }

    update(zoom, x, y, w, h) {
        super.update(zoom, x, y, w, h);
        this.hasMouseOver = this.g.checkMouseOver(mouseX, mouseY);
    }

    draw(xa, ya, zoom, cnv, textColor) {
        // this.drawCross(xa, ya);
        DrawUtils.drawCross(this.g, xa, ya);
        this.doMouseOverText(zoom, textColor);
    }
}

class FeatureUIButtonResize extends FeatureUIButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
    }
    draw(xa, ya, zoom, cnv, textColor) {
        const ratio = MID_DIM_GAP_PERCENT;
        const offset = (this.g.sSqrDim * (1 - ratio)) / 2;
        const arrowSize = this.g.sSqrDim * ratio;
        line(xa + offset, ya + offset, xa + arrowSize, ya + offset);
        line(xa + offset, ya + offset, xa + offset, ya + arrowSize);
        line(
            xa + offset + arrowSize,
            ya + offset + arrowSize,
            xa + offset + arrowSize,
            ya + 2 * offset
        );
        line(
            xa + 2 * offset,
            ya + offset + arrowSize,
            xa + offset + arrowSize,
            ya + offset + arrowSize
        );
    }
}

class FeatureUIButtonLetterLabel extends FeatureUIButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
    }
    draw(xa, ya, zoom, cnv, textColor) {
        textSize(myTextSize * zoom);
        fill(textColor);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.data['data'][0], xa + this.g.sSqrDimOn2, ya + this.g.sSqrDimOn2);
    }
}

class FeatureUIOutputButton extends FeatureUIButton {
    constructor(label, x, y, size, action) {
        super(label, x, y, size, action);
        this.connected = false;
        this.associatedConnector = null;
        this.mouseOverData = label.toUpperCase();
    }

    update(zoom, x, y, w, h) {
        super.update(zoom, x, y, w, h);
        this.hasMouseOver = this.g.checkMouseOver(mouseX, mouseY);
    }

    mouseClickActionHandler(zoom) {
        if (this.connected) {
            if (this.g.checkMouseOver(mouseX, mouseY)) {
                this.associatedConnector.startToDelete();
            }
        } else {
            return super.mouseClickActionHandler(zoom);
        }
    }

    draw(xa, ya, zoom, cnv, textColor) {
        if (this.connected) {
            DrawUtils.drawXIcon(this.g, xa, ya, LOW_MID_DIM_GAP_PERCENT);
        } else {
            textSize(myTextSize * zoom);
            fill(textColor);
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.data['data'][0], xa + this.g.sSqrDimOn2, ya + this.g.sSqrDimOn2);
        }
        this.doMouseOverText(zoom, textColor);
    }
}

class FeatureUIInputButton extends FeatureUIOutputButton {}
