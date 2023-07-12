class Sink extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 196, 196, 'sink'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FixedFeatureDataTextLabel(
            0,
            1.5,
            'SINK',
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
    }

    draw(zoom, cnv) {
        fill(getColor('primary'));
        stroke(getColor('outline'));
        rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);

        fill(getColor('secondary'));
        noStroke(); // Calculate the center of the rectangle
        const centerX = this.g.sCart.x + this.g.sDims.w / 2;
        const centerY = this.g.sCart.y + this.g.sDims.h / 2;

        // Draw the ellipse
        ellipse(centerX, centerY, this.g.sDims.w, this.g.sDims.h);
    }
}
