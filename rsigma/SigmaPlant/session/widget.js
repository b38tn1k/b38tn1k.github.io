class Widget extends WidgetFrame {
    constructor(parent, key, fill = 'full') {
        super(parent, fill);
        this.active = false;
        this.key = key;
        if (!this.parent.data[this.key]) {
            this.parent.data[this.key] = ''; // using JSON strings
        }
        this.placeholder;
        this.textSize = myTextSize;
        this.inputUpdate = false;
        this.dynamicTextSizeThresholds = [1500, 750];
    }
    get data() {
        return this.parent.data[this.key];
    }

    set data(value) {
        this.parent.data[this.key] = value;
    }

    delete() {
        this.parent = null;
    }

    packParentCommand() {
        let oldData = this.oldData ? this.oldData : this.placeholder;
        this.parent.packCommand(
            true,
            'update_data',
            JSON.stringify({ key: this.key, data: this.data }),
            JSON.stringify({ key: this.key, data: oldData })
        );
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
    }

    doHTMLUpdate(zoom) {
        this.input.position(this.frame.x_min, this.frame.y_min);
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
        this.input.remove();
        super.delete();
    }

    transitionIn() {
        this.input.show();
    }

    transitionOut() {
        this.input.hide();
    }

    setup() {
        if (!this.input) {
            this.setupInput();
        }
        if (this.data != this.placeholder) {
            this.input.value(this.data);
        } else {
            this.input.value('');
        }
        this.inputUpdate = true;
    }

    setupInput() {}

    handleMousePress() {
        let unhand = false;
        if (this.active == true) {
            unhand = true;
        }
        this.active = false;
        if (mouseX > this.frame.x_min && mouseX < this.frame.x_max) {
            if (mouseY > this.frame.y_min && mouseY < this.frame.y_max) {
                this.active = true;
                this.input.style('color', getColor('accent'));
                keyboardRequiresFocus = true;
                if (unhand == false) {
                    this.oldData = this.data;
                }
            }
        }

        if (this.active === false && unhand) {
            keyboardRequiresFocus = false;
            this.packParentCommand();
            this.input.style('color', getColor('outline'));
        }
    }

    display() {
        this.draw();
    }

    draw() {}
}
