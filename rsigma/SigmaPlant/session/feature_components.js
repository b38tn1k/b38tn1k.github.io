function getUnsecureHash() {
    let myStr =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    myStr += myStr + myStr;
    return myStr.substring(0, 10);
}

class FeatureComponent extends Introspector {
    constructor(x, y, size) {
        super();
        this.g = new ParentDefinedGeometry(x, y, size);
        this.targetID = 'none';
        this.doCheckMouseOver = false;
        this.data = {};
        this.data['id'] = getUnsecureHash();
        this.hasMouseOver = false;
        this.mouseOverData = 'none';
    }

    update(zoom, gp) {
        this.g.update(zoom, gp);
    }
}

class FeatureLabel extends FeatureComponent {
    constructor(x, y, data, size, action) {
        super(x, y, size);
        this.data['data'] = data;
        this.action = action;
        this.mode = 'idle';
    }

    display(zoom, cnv, strokeColor, fillColor) {
        textSize(myTextSize * zoom);
        this.draw(zoom, cnv, strokeColor, fillColor);
    }

    update(zoom, gp) {
        super.update(zoom, gp);
        this.g.setBDimsWidth(
            myTextSize,
            TEXT_WIDTH_MULTIPLIER,
            this.data['data']
        );
    }

    checkClicked(zoom) {
        return false;
    }

    mouseClickActionHandler(zoom) {
        if (this.mode != 'busy') {
            if (this.checkClicked(zoom)) {
                this.mode = 'busy';
                this.action(this, this.g.sCart.x, this.g.sCart.y);
            }
        }
    }
}

class FeatureDataTextLabel extends FeatureLabel {
    constructor(x, y, data, size, action) {
        super(x, y, data, size, action);
    }

    checkClicked(zoom) {
        this.g.setBDimsWidth(
            myTextSize,
            TEXT_WIDTH_MULTIPLIER,
            this.data['data']
        );
        return this.g.checkMouseOver(mouseX, mouseY);
    }

    draw(zoom, cnv, strokeColor, fillColor) {
        fill(fillColor);
        stroke(strokeColor);
        rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);
        fill(strokeColor);
        noStroke();
        textAlign(CENTER, CENTER);
        text(
            this.data['data'],
            this.g.sCart.x + this.g.sDims.w / 2,
            this.g.sCart.y + this.g.sSqrDimOn2
        ); // Center the text within the rectangle
    }
}

class FeatureDataTextLabelTrigger extends FeatureDataTextLabel {
    mouseClickActionHandler(zoom) {
        if (this.checkClicked(zoom)) {
            this.action(this, this.g.sCart.x, this.g.sCart.y);
        }
    }
}

class FeatureDataIDLabel extends FeatureDataTextLabel {
    constructor(x, y, data, size) {
        super(x, y, data, size, NOP);
        this.g.static = false;
    }

    checkClicked(zoom) {
        return false;
    }

    draw(zoom, cnv, strokeColor, fillColor, width) {
        fill(strokeColor);
        noStroke();
        textAlign(LEFT, TOP);
        textSize((myTextSize * zoom) / 2);
        text(
            this.data['data'],
            this.g.sCart.x + this.g.sSqrDim * TIGHT_DIM_GAP_PERCENT,
            this.g.sCart.y + this.g.sSqrDim * MID_DIM_GAP_PERCENT
        );
    }
}
