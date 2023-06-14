class ParentLink extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 98, 98, 'parentLink'); // Call the parent constructor
        this.targetPlant = null;
        this.adoptable = false;
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FeatureDataTextLabelTrigger(
            0.5,
            0.3,
            'PARENT',
            buttonSize,
            () => this.transitionPlant()
        ); // bad, fix with a mode
    }

    initButtons(buttonSize) {
        this.buttons.push(
            new FeatureUIButtonMove(this.type, 0, 0, buttonSize, () =>
                this.setMode('move')
            )
        );
    }

    draw(zoom, cnv) {
        fill(getColor('primary'));
        stroke(getColor('outline'));
        rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);
    }

    transitionPlant() {
        this.mode = 'transition_plant';
    }
}
