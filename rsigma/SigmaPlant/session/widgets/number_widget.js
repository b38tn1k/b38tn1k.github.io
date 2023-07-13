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

    calculateTextVolume() {
        return this.frame.b_volume / (String(this.data).length + 5);
    }

    setupInput() {
        this.input = createInput(this.data['note'], 'number'); // create a number input field
        // this should be done with css
        this.input.input(this.inputEventHandler.bind(this));
        this.input.style('resize', 'none');
        this.input.style('background', 'transparent');
        // this.input.style('background', '#2099FF');
        this.input.style('border', 'transparent');
        this.input.style('color', getColor('outline'));
        // this.input.style('caret-color', getColor('outline'));
        this.input.style('caret-color', getColor('accent'));
        this.input.style('outline', 'none');
        this.input.style('font-family', 'Arial');
        this.input.style('text-align', 'center');
    }

    draw() {
        // fill(getColor('primary'));
        noFill();
        stroke(getColor('outline'));
        rect(this.frame.x_min, this.frame.y_min, this.frame.x_delta, this.frame.y_delta);
    }

    update(zoom) {
        super.update(zoom);
        this.updateHTML(zoom);   
    }

    doHTMLUpdate(zoom) {
        super.doHTMLUpdate(zoom);
        this.input.style('height', String(int(this.frame.y_delta)) + 'px');
        this.input.style('line-height', String(int(this.frame.y_delta)) + 'px');
    }

    
    
}
