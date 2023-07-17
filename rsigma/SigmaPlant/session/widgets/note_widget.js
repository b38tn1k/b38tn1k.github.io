class NoteWidget extends Widget {
    constructor(parent, key = 'note_widget', fill='full') {
        super(parent, key, fill);
        if (!this.data) {
            this.data = '';
        }
        this.input;
        this.placeholder = 'an empty note';
        this.setup();
    }

    setupInput() {
        this.input = createElement('textarea', this.data['note']);
        this.input.input(this.inputEventHandler.bind(this));
        styleTextAreaInput(this.input);
        this.dynamicTextSizeThresholds = [1500, 750];
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

    
}
