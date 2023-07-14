class Split extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 196, 196, 'split'); // Call the parent constructor
        this.widgets.push(new NumberWidget(this, 'nominator', 'left', true));
        this.widgets.push(new NumberWidget(this, 'denominator', 'right', true));
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FixedFeatureDataTextLabel(
            0,
            1.5,
            'SPLIT',
            buttonSize,
            openDialog
        );
        this.dataLabels['id'] = new FeatureDataIDLabel(
            0,
            1,
            this.type + '->' + this.data['id'],
            buttonSize,
            NOP
        );
    }

    initButtons(buttonSize) {
        this.buttons.push(
            new FeatureUIButtonMove(this.type, 0, 0, buttonSize, () =>
                this.setMode('move')
            )
        );
        this.buttons.push(
            new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () =>
                this.startDelete()
            )
        );
        this.buttons.push(
            new FeatureUIInputButton('Input', 0.5, 0, buttonSize, () =>
                this.setMode('i_connect')
            )
        );
        this.buttons.push(
            new FeatureUIOutputButton('Output', 0.3, 1, buttonSize, () =>
                this.setMode('o_connect')
            )
        );
        this.buttons.push(
            new FeatureUIOutputButton('Output', 0.6, 1, buttonSize, () =>
                this.setMode('o_connect')
            )
        );
    }

    draw(zoom, cnv) {
        fill(getColor('primary'));
        stroke(getColor('outline'));
        rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);

        fill(getColor('secondary'));
        noStroke();
        // Calculate the center of the rectangle Calculate the center of the rectangle
        const centerX = this.g.sCart.x + this.g.sDims.w / 2;
        const centerY = this.g.sCart.y + this.g.sDims.h / 2;

        // Calculate dimensions for the hourglass
        const top = this.g.sCart.y;
        const bottom = this.g.sCart.y + this.g.sDims.h;
        const left = this.g.sCart.x;
        const right = this.g.sCart.x + this.g.sDims.w;

        // Draw the top triangle
        triangle(centerX, top, left, centerY, right, centerY);

        // Draw the bottom triangle
        triangle(centerX, bottom, left, centerY, right, centerY);
    }
}
