class NoteWidget extends Widget {
    constructor(parent, fill='full') {
        super(parent, 'note_widget', fill);
        if (!this.data) {
            this.data = '';
        }
        this.input;
        this.placeholder = 'an empty note';
        this.setup();
        this.textSize = 3 * myTextSize;
    }

    setupInput() {
        this.input = createElement('textarea', this.data['note']);
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
        this.dynamicTextSizeThresholds = [1500, 750];
    }

    calculateTextVolume() {
        return this.frame.b_volume / (this.data.length + 5);
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

    update(zoom) {
        super.update(zoom);
        if (this.inputUpdate) {
            this.dynamicallySizeText();
        }
        this.updateHTML(zoom);
    }
}
