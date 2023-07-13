class NoteWidget extends Widget {
    constructor(parent, fill='full') {
        super(parent, 'note_widget', fill);
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

    
}
