class NoteWidget extends Widget {
    constructor(parent) {
        super(parent, 'note_widget');
        if (!this.data) {
            this.data = '';
        }
        this.input;
        this.placeholder = 'an empty note';
        this.setup();
        this.textSize = 3 * myTextSize;
        this.textUpdate = false;
        this.transitionInTimer = 0;
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

    inputEventHandler() {
        this.data = this.input.value();
        this.textUpdate = true;
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
        this.textUpdate = true;
    }

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

    dynamicallySizeText() {
        const thresh = this.frame.b_volume / (this.data.length + 5);
        let nt;
        if (thresh > 1500) {
            nt = 3 * myTextSize;
        } else if (thresh > 750) {
            nt = 2 * myTextSize;
        } else {
            nt = myTextSize;
        }
        if (this.textSize != nt) {
            this.textSize = nt;
            this.doUpdate = true;
        }
    }

    update(zoom) {
        super.update(zoom);
        if (this.textUpdate) {
            this.dynamicallySizeText();
        }
        if (this.doUpdate && this.input) {
            this.input.position(this.frame.x_min, this.frame.y_min);
            this.input.size(this.frame.x_delta, this.frame.y_delta);
            this.input.style('font-size', String(this.textSize * zoom) + 'px');
        }
        
    }
}
