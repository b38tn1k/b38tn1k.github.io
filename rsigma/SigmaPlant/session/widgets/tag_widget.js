class TagWidget extends Widget {
    // methods to add tags to other blocks
    // on metrics, this provides the category of metric (value, time, voltage, whatever)
    constructor(parent, fill='full') {
        super(parent, 'tag_widget', fill);
        if (!this.data) {
            this.data = '';
        }
        
    }
}
