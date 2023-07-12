class Zone extends Feature {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'zone'); // Call the parent constructor
        this.type = 'zone';
        this.children = [];
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

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FixedFeatureDataTextLabel(
            0,
            1.5,
            'ZONE',
            buttonSize,
            openDialog,
            this.g
        );
        this.dataLabels['id'] = new FeatureDataIDLabel(
            0,
            1,
            this.type + '->' + this.data['id'],
            buttonSize,
            NOP
        );
    }

    draw(zoom, cnv) {
        noFill();
        stroke(getColor('accent'));
        rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);
        this.notYetDrawnLabelAndButtons = true;
        this.drawButtonsAndLabels(zoom, cnv, getColor('accent'));
    }

    checkIfShouldBeChild(feature) {
        // The feature is considered to be in the zone if its x and y positions are
        // within the zone's width and height. This assumes x and y are the top left
        // coordinates and the feature's size is negligible or already accounted for.
        return (
            feature.g.bCart.x >= this.g.bCart.x &&
            feature.g.bCart.x <= this.g.bCart.x + this.g.bDims.w &&
            feature.g.bCart.y >= this.g.bCart.y &&
            feature.g.bCart.y <= this.g.bCart.y + this.g.bDims.h &&
            feature.data['id'] != this.data['id']
        );
    }

    setChildMode(mode) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].setMode(mode);
        }
    }

    move(x, y, record = true) {
        // const oldX = this.g.bCart.x;
        // const oldY = this.g.bCart.y;
        // this.g.bCart.x = x;
        // this.g.bCart.y = y;
        super.move(x, y, record);
        // if (record) {
            //otherwise would be double moving children on undo/redo things
            const delta = createVector(
                this.g.bCart.x - this.g.bCartOld.x,
                this.g.bCart.y - this.g.bCartOld.y
            );
            this.setChildMode('auto');
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].move(
                    this.children[i].g.bCart.x + delta.x,
                    this.children[i].g.bCart.y + delta.y,
                    false
                );
            }
        // }
    }

    exitMove() {
        super.exitMove();
        if (this.mode == 'idle') {
            // for (let i = 0; i < this.children.length; i++) {
            //     this.children[i].exitMove();
            // }
            this.setChildMode('move');
        }
    }

    checkIfIsChild(feature) {
        return this.children.includes(feature);
    }

    removeChild(feature, record = true) {
        let c = {
            id: feature.data['id'],
            x: feature.g.bCart.x,
            y: feature.g.bCart.y
        };
        this.packCommand(record, 'removeChild', c);
        this.children = this.children.filter((child) => child !== feature);
    }

    addChild(feature, record = true) {
        let c = {
            id: feature.data['id'],
            x: feature.g.bCart.x,
            y: feature.g.bCart.y
        };
        this.packCommand(record, 'addChild', c);
        this.children.push(feature);
    }

    emptyChildren() {
        this.children = [];
    }
}
