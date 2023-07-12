function myInputEvent() {
    console.log('you are typing: ', this.value());
    keyboardRequiresFocus = true;
  }

class NoteWidget extends Widget {
    constructor(parent) {
        super(parent, 'note_widget');
        if (!this.data['note']) {
            this.data['note'] = '';
        }
        this.input = createElement('textarea', this.data['note']);
        // this should be done with css
        this.input.input(myInputEvent);
        this.input.style('resize', 'none');
        this.input.style('background', 'transparent'); 
        this.input.style('border', 'transparent'); 
        this.input.style('color', getColor('outline')); 
        this.input.style('caret-color', getColor('outline'));
        this.input.style('outline', 'none');
    }

    delete() {
        this.input.remove();
        super.delete();
    }

    // inputEventHandler() {
    //     console.log(this.input.value());
    // }

    handleMousePress() {
        let unhand = false;
        if (this.active == true) {
            unhand = true;

        }
        this.active = false;
        if (
            mouseX > this.g.sCart.x + BUTTON_SIZE &&
            mouseX < this.g.sCart.x + this.g.sDims.w - BUTTON_SIZE
        ) {
            if (
                mouseY > this.g.sCart.y + BUTTON_SIZE &&
                mouseY < this.g.sCart.y + this.g.sDims.h - BUTTON_SIZE
            ) {
                this.active = true;
                keyboardRequiresFocus = true;
            }
        }

        if (this.active === false && unhand) {
            keyboardRequiresFocus = false;
        }
    }

    update() {
        this.input.position(this.g.sCart.x + BUTTON_SIZE, this.g.sCart.y + BUTTON_SIZE);
        this.input.size(this.g.sDims.w - 2*BUTTON_SIZE, this.g.sDims.h - 2*BUTTON_SIZE);
        this.data['note'] = this.input.value();
        
    }



    draw() {
        // fill(255);
        // circle(this.g.sCart.x + this.g.sMids.w, this.g.sCart.y + this.g.sMids.h, 20);
    }
}
