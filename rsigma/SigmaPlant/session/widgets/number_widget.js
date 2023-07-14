// TODO: modes: absolute, gaussian, range
class NumberWidget extends Widget {
    // interactive widget that allows setting a number
    // e.g. used for metric blocks to set an amount
    // used on split blocks for percentages etc
    // maybe used on source blocks, tbd
    constructor(parent, key, fill='top_full') {
        super(parent, key, fill);
        if (this.parent.data[this.key] == '') {
            this.parent.data[this.key] = 1;
        }
        this.placeholder = 1;
        this.dynamicTextSizeThresholds = [100000, 500];
        this.setup();
    }

    setup() {
        if (!this.input) {
            this.setupInput();
        }
        this.input.value(this.data);
        this.inputUpdate = true;
        this.attachMouseOverToInput();
    }

    calculateTextVolume() {
        return this.frame.b_volume / (String(this.data).length + 5);
    }

    setupInput() {
        this.input = createInput(this.data['note'], 'number'); // create a number input field
        this.input.input(this.inputEventHandler.bind(this));
        styleTextInputInput(this.input);
    }

    draw() {
        noFill();
        stroke(getColor('outline'));
        rect(this.frame.x_min, this.frame.y_min, this.frame.x_delta, this.frame.y_delta);
    }

    doHTMLUpdate(zoom) {
        super.doHTMLUpdate(zoom);
        this.input.style('height', String(int(this.frame.y_delta)) + 'px');
        this.input.style('line-height', String(int(this.frame.y_delta)) + 'px');
    }

    
    
}
