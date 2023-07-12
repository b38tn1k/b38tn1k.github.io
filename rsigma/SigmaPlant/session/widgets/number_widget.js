class NumberWidget extends Widget {
    // interactive widget that allows setting a number
    // e.g. used for metric blocks to set an amount
    // used on split blocks for percentages etc
    // maybe used on source blocks, tbd
    constructor(parent, fill='full') {
        super(parent, 'number_widget', fill);
    }
}
