const HTML_VERT_OFF = -2;

class Widget extends WidgetFrame {
    constructor(parent, key, fill = 'full') {
        super(parent, fill);
        this.active = false;
        this.key = key;
        if (!this.parent.data[this.key]) {
            this.parent.data[this.key] = ''; // using JSON strings
        }
        this.placeholder;
        this.textSize = 3 * myTextSize;
        this.inputUpdate = false;
        this.dynamicTextSizeThresholds = [1500, 750];
    }
    get data() {
        return this.parent.data[this.key];
    }

    set data(value) {
        this.parent.data[this.key] = value;
    }

    packParentCommand() {
        let oldData = this.oldData ? this.oldData : this.placeholder;
        if (oldData != this.data) {
            this.parent.packCommand(
                true,
                'update_data',
                JSON.stringify({ key: this.key, data: this.data }),
                JSON.stringify({ key: this.key, data: oldData })
            );
        }
    }

    inputEventHandler() {
        this.data = this.input.value();
        this.inputUpdate = true;
    }

    update(zoom) {
        super.update(zoom);
        if (this.inputUpdate) {
            this.dynamicallySizeText();
        }
        this.updateHTML(zoom);
    }

    calculateTextVolume() {
        return this.frame.b_volume / (this.data.length + 5);
    }

    dynamicallySizeText() {
        const thresh = this.calculateTextVolume();
        this.inputUpdate = this.parent.isAnimating;
        // console.log(thresh)
        let nt;
        if (thresh > this.dynamicTextSizeThresholds[0]) {
            nt = 3 * myTextSize;
        } else if (thresh > this.dynamicTextSizeThresholds[1]) {
            nt = 2 * myTextSize;
        } else {
            nt = myTextSize;
        }
        if (this.textSize != nt) {
            this.textSize = nt;
            this.doUpdate = true;
        }
        return thresh;
    }

    doHTMLUpdate(zoom) {
        this.input.position(this.frame.x_min, this.frame.y_min + HTML_VERT_OFF);
        this.input.size(this.frame.x_delta, this.frame.y_delta);
        this.input.style('font-size', String(this.textSize * zoom) + 'px');
    }

    updateHTML(zoom) {
        if (this.doUpdate && this.input) {
            this.doHTMLUpdate(zoom);
        }
    }

    update(zoom) {
        super.update(zoom);
        if (this.inputUpdate) {
            this.dynamicallySizeText();
        }
        this.updateHTML(zoom);
    }

    delete() {
        this.parent = null;
        if (this.input) {
            this.input.remove();
        }
    }

    transitionIn() {
        if (this.input) {
            this.input.show();
        }
    }

    transitionOut() {
        if (this.input) {
            this.input.hide();
        }
    }

    attachMouseOverToInput() {
        this.input.isMouseOver = false;
        this.input.mouseOver(() => {
            this.input.isMouseOver = true;
        });

        this.input.mouseOut(() => {
            this.input.isMouseOver = false;
        });
    }

    setup() {
        if (!this.input) {
            this.setupInput();
        }
        this.attachMouseOverToInput();
        if (this.data != this.placeholder) {
            this.input.value(this.data);
        } else {
            this.input.value('');
        }
        this.inputUpdate = true;
    }

    setupInput() {}

    restyleActive() {
        this.input.style('color', getColor('accent'));
    }

    restyleDeActive() {
        this.input.style('color', getColor('outline'));
    }

    activeAction() {
        this.restyleActive();
        keyboardRequiresFocus = true;
        this.parent.mode = 'busy';
    }

    deactiveAction() {
        this.restyleDeActive();
        keyboardRequiresFocus = false;
        this.packParentCommand();
        this.parent.mode = 'idle';
    }

    checkMouse() {
        // let res = (mouseX > this.frame.x_min && mouseX < this.frame.x_max)
        // if (res) {
        //     res = (mouseY > this.frame.y_min + HTML_VERT_OFF && mouseY < this.frame.y_max)
        // }
        // return res;
        return this.input.isMouseOver;
    }

    handleMousePress() {
        let unhand = false;
        if (this.active == true) {
            unhand = true;
        }
        this.active = false;
        if (this.checkMouse()) {
            this.active = true;
            this.activeAction();
            if (unhand == false) {
                this.oldData = this.data;
            }
        }
        if (this.active === false && unhand) {
            this.deactiveAction();
        }
    }

    display(zoom, cnv) {
        if (this.parent.mode !== 'deleting') {
            this.draw(zoom, cnv);
        }
    }

    draw() {}
}
