class NoteWidget extends Widget {
    constructor(parent) {
        super(parent, 'note_widget');
        if (!this.data) {
            this.data = '';
        }
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
        this.placeholder = 'an empty note';
    }

    delete() {
        this.input.remove();
        super.delete();
    }

    inputEventHandler() {
        this.data = this.input.value();
    }

    setup() {
        if (this.data != this.placeholder) {
            this.input.value(this.data);
        } else {
            this.input.value('');
        }
    }

    handleMousePress() {
        let unhand = false;
        if (this.active == true) {
            unhand = true;

        }
        this.active = false;
        if (
            mouseX > this.frame.x_min &&
            mouseX < this.frame.x_max
        ) {
            if (
                mouseY > this.frame.y_min &&
                mouseY < this.frame.y_max
            ) {
                this.active = true;
                this.input.style('color', getColor('accent')); 
                // this.input.style('caret-color', getColor('accent'));
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
            // this.input.style('caret-color', getColor('outline'));
        }
    }

    update(zoom) {
        super.update(zoom);
        if (this.doUpdate) {
            this.input.position(this.frame.x_min, this.frame.y_min);
            this.input.size(this.frame.x_delta, this.frame.y_delta);
            this.input.style('font-size', String(myTextSize * zoom) + 'px');
        }
    }

}
