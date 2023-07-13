class WidgetFrame {
    constructor(parent, fill) {
        this.parent = parent;
        this.fill = fill;
        console.log(this.fill);
        this.frame = {};
        [
            this.frame.x_min_old,
            this.frame.x_max_old,
            this.frame.y_min_old,
            this.frame.y_max_old
        ] = [0, 0, 0, 0];
        this.frame.x_min = this.g.sCart.x;
        this.frame.x_max = this.g.sCart.x + this.g.sDims.w;
        this.frame.y_min = this.g.sCart.y;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h;
        this.doUpdate = true;
        this.gap = BUTTON_SIZE;
    }

    get g() {
        return this.parent.g;
    }

    full (zoom) {
        this.frame.x_min_old = this.frame.x_min;
        this.frame.x_max_old = this.frame.x_max;
        this.frame.y_min_old = this.frame.y_min;
        this.frame.y_max_old = this.frame.y_max;
        this.frame.x_min = this.g.sCart.x + this.gap * zoom;
        this.frame.x_max = this.g.sCart.x + this.g.sDims.w - this.gap * zoom;
        this.frame.x_delta = this.frame.x_max - this.frame.x_min;
        this.frame.y_min = this.g.sCart.y + this.gap * zoom;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h - this.gap * zoom;
        this.frame.y_delta = this.frame.y_max - this.frame.y_min;
        this.frame.b_volume = this.g.bDims.w * this.g.bDims.h;
    }

    // mid_left37(zoom) {
    //     this.frame.x_min_old = this.frame.x_min;
    //     this.frame.x_max_old = this.frame.x_max;
    //     this.frame.y_min_old = this.frame.y_min;
    //     this.frame.y_max_old = this.frame.y_max;
    //     this.frame.x_min = this.g.sCart.x + this.gap * zoom;
    //     this.frame.x_max = this.g.sCart.x + this.g.sMids.w - (this.gap * zoom / 2);
    //     this.frame.x_delta = this.frame.x_max - this.frame.x_min;
    //     this.frame.y_min = this.g.sCart.y + this.g.sDims.h * 0.3;
    //     this.frame.y_max = this.g.sCart.y + this.g.sDims.h * 0.7;
    //     this.frame.y_delta = this.frame.y_max - this.frame.y_min;
    //     this.frame.b_volume = this.g.bDims.w * this.g.bDims.h * 0.16;
    // }

    top_full(zoom) {
        this.frame.x_min_old = this.frame.x_min;
        this.frame.x_max_old = this.frame.x_max;
        this.frame.y_min_old = this.frame.y_min;
        this.frame.y_max_old = this.frame.y_max;
        this.frame.x_min = this.g.sCart.x + this.gap * zoom;
        this.frame.x_max = this.g.sCart.x + this.g.sDims.w - (this.gap * zoom);
        this.frame.x_delta = this.frame.x_max - this.frame.x_min;
        this.frame.y_min = this.g.sCart.y + this.g.sDims.h * 0.3;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h * 0.5;
        this.frame.y_delta = this.frame.y_max - this.frame.y_min;
        this.frame.b_volume = this.g.bDims.w * this.g.bDims.h * 0.15;
    }

    update(zoom) {
        this[this.fill](zoom);
        this.doUpdate = this.checkIfValuesChanged();
    }

    checkIfValuesChanged() {
        if (this.frame.x_min !== this.frame.x_min_old) {
            return true;
        }
        if (this.frame.x_max !== this.frame.x_max_old) {
            return true;
        }
        if (this.frame.y_min !== this.frame.y_min_old) {
            return true;
        }
        if (this.frame.y_max !== this.frame.y_max_old) {
            return true;
        }

        return false;
    }
}