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
        this.gap = BUTTON_SIZE;
    }

    get g() {
        return this.parent.g;
    }

    store() {
        this.frame.x_min_old = this.frame.x_min;
        this.frame.x_max_old = this.frame.x_max;
        this.frame.y_min_old = this.frame.y_min;
        this.frame.y_max_old = this.frame.y_max;
    }

    full(zoom) {
        this.store();
        this.frame.x_min = this.g.sCart.x + this.gap * zoom;
        this.frame.x_max = this.g.sCart.x + this.g.sDims.w - this.gap * zoom;
        this.frame.x_delta = this.frame.x_max - this.frame.x_min;
        this.frame.y_min = this.g.sCart.y + this.gap * zoom;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h - this.gap * zoom;
        this.frame.y_delta = this.frame.y_max - this.frame.y_min;
        this.frame.b_volume = int(this.frame.y_delta) * int(this.frame.x_delta);
    }

    top_full(zoom) {
        this.store();
        this.frame.x_min = this.g.sCart.x + this.gap * zoom;
        this.frame.x_max = this.g.sCart.x + this.g.sDims.w - this.gap * zoom;
        this.frame.x_delta = this.frame.x_max - this.frame.x_min;
        this.frame.y_min = this.g.sCart.y + this.g.sDims.h * 0.3;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h * 0.5;
        this.frame.y_delta = this.frame.y_max - this.frame.y_min;
        this.frame.b_volume = int(this.frame.y_delta) * int(this.frame.x_delta);
    }

    left(zoom) {
        this.store();
        this.frame.x_min = this.g.sCart.x + this.gap * zoom;
        this.frame.x_max = this.g.sCart.x + this.g.sMids.w - this.gap * zoom;
        this.frame.x_delta = this.frame.x_max - this.frame.x_min;
        this.frame.y_min = this.g.sCart.y + 3.5 * this.gap * zoom;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h - 2*this.gap * zoom;
        this.frame.y_delta = this.frame.y_max - this.frame.y_min;
        this.frame.b_volume = int(this.frame.y_delta) * int(this.frame.x_delta);
    }

    right(zoom) {
        this.store();
        this.frame.x_min = this.g.sCart.x + this.g.sMids.w + this.gap * zoom;
        this.frame.x_max = this.g.sCart.x + this.g.sDims.w - this.gap * zoom;
        this.frame.x_delta = this.frame.x_max - this.frame.x_min;
        this.frame.y_min = this.g.sCart.y + 3.5 * this.gap * zoom;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h - 2*this.gap * zoom;
        this.frame.y_delta = this.frame.y_max - this.frame.y_min;
        this.frame.b_volume = int(this.frame.y_delta) * int(this.frame.x_delta);
    }

    left_tall(zoom) {
        this.store();
        this.frame.x_min = this.g.sCart.x + 2*this.gap * zoom;
        this.frame.x_max = this.g.sCart.x + this.g.sMids.w - this.gap * zoom;
        this.frame.x_delta = this.frame.x_max - this.frame.x_min;
        this.frame.y_min = this.g.sCart.y + 3 * this.gap * zoom;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h - 2*this.gap * zoom;
        this.frame.y_delta = this.frame.y_max - this.frame.y_min;
        this.frame.b_volume = int(this.frame.y_delta) * int(this.frame.x_delta);
    }

    right_tall(zoom) {
        this.store();
        this.frame.x_min = this.g.sCart.x + this.g.sMids.w + this.gap * zoom;
        this.frame.x_max = this.g.sCart.x + this.g.sDims.w - 2*this.gap * zoom;
        this.frame.x_delta = this.frame.x_max - this.frame.x_min;
        this.frame.y_min = this.g.sCart.y + 3 * this.gap * zoom;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h - 2*this.gap * zoom;
        this.frame.y_delta = this.frame.y_max - this.frame.y_min;
        this.frame.b_volume = int(this.frame.y_delta) * int(this.frame.x_delta);
    }

    bottom_full(zoom) {
        this.store();
        this.frame.x_min = this.g.sCart.x + this.gap * zoom;
        this.frame.x_max = this.g.sCart.x + this.g.sDims.w - this.gap * zoom;
        this.frame.x_delta = this.frame.x_max - this.frame.x_min;

        this.frame.y_min = this.g.sCart.y + this.g.sDims.h * 0.6;
        this.frame.y_max = this.g.sCart.y + this.g.sDims.h * 0.8;
        this.frame.y_delta = this.frame.y_max - this.frame.y_min;
        this.frame.b_volume = int(this.frame.y_delta) * int(this.frame.x_delta);
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
