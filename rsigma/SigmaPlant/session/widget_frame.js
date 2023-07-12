class WidgetFrame {
    constructor(parent, fill) {
        this.parent = parent;
        this.fill = fill;
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
    }

    get g() {
        return this.parent.g;
    }

    full (zoom) {
        this.frame.x_min_old = this.frame.x_min;
        this.frame.x_max_old = this.frame.x_max;
        this.frame.y_min_old = this.frame.y_min;
        this.frame.y_max_old = this.frame.y_max;
        this.frame.x_min = this.g.sCart.x + BUTTON_SIZE * zoom;
        this.frame.x_max = this.g.sCart.x + this.g.sDims.w - BUTTON_SIZE * zoom;
        this.frame.x_delta = this.frame.x_max - this.frame.x_min;
        this.frame.y_min = this.g.sCart.y + BUTTON_SIZE * zoom;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h - BUTTON_SIZE * zoom;
        this.frame.y_delta = this.frame.y_max - this.frame.y_min;
        this.frame.b_volume = this.g.bDims.w * this.g.bDims.h;
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