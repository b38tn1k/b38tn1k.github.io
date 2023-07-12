class Note extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 196, 196, 'note');
        let [v1, v2, v3, v4] = [0.01, 0.15, 0.85, 0.99]
        this.shape = [random(v1, v2), random(v1, v2), random(v3, v4), random(v3, v4), 
            random(v1, v2), random(v3, v4), random(v3, v4), random(v1, v2)];
    }

    initDataLabels(buttonSize) {
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
            new FeatureUIButtonResize('Resize', 1, 1, buttonSize, () =>
                this.setMode('resize')
            )
        );

    }

    draw(zoom, cnv) {
        fill(getColor('primary'));
        stroke(getColor('outline'));
        rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);
        fill(getColor('secondary'));
        noStroke();
        beginShape();
        for (let i = 0; i < 4; i++) {
            let x = this.g.sCart.x + this.shape[i] * this.g.sDims.w;
            let y = this.g.sCart.y + this.shape[i+4] * this.g.sDims.h;
            vertex(x, y);
        }
        endShape(CLOSE);

    }
}
