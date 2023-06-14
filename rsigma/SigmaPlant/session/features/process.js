class Process extends Feature {
    constructor(x, y, width, height, plant, targetPlant) {
        super(x, y, width, height, 'process'); // Call the parent constructor
        this.plant = plant;
        this.targetPlant = targetPlant;
        this.buses = {};
        this.buses = {
            source: new Set(),
            sink: new Set()
        };
        this.modelData = {};
        this.setupFromSubProcess();
    }

    delete() {
        super.delete();
        this.plant = null;
    }

    collectBuses() {
        let inputIndices = this.plant.features
            .map((feature, index) => (feature.type == 'source' ? index : null))
            .filter((index) => index !== null);

        this.buses['source'] = new Set(inputIndices);

        let outputIndices = this.plant.features
            .map((feature, index) => (feature.type == 'sink' ? index : null))
            .filter((index) => index !== null);
        this.buses['sink'] = new Set(outputIndices);
    }

    setupIOButtons(buttonSize = BUTTON_SIZE) {
        this.collectBuses();
        const numSourceBuses = this.buses['source'].size;
        const numSinkBuses = this.buses['sink'].size;
        // Get all the valid source and sink ids from plant features
        const validSourceIds = Array.from(this.buses['source']).map(
            (index) => this.plant.features[index].data['id']
        );
        const validSinkIds = Array.from(this.buses['sink']).map(
            (index) => this.plant.features[index].data['id']
        );
        const validIDs = [...validSourceIds, ...validSinkIds];
        // Remove invalid buttons
        this.removeInvalidButtons(validIDs);
        const xIncrementSource =
            numSourceBuses > 1 ? (0.8 - 0.2) / (numSourceBuses - 1) : 0;
        const xIncrementSink =
            numSinkBuses > 1 ? (0.8 - 0.2) / (numSinkBuses - 1) : 0;
        // Create input and output buttons
        this.createIOButtons(
            'source',
            FeatureUIInputButton,
            'Input',
            'i_connect',
            xIncrementSource,
            buttonSize
        );
        this.createIOButtons(
            'sink',
            FeatureUIOutputButton,
            'Output',
            'o_connect',
            xIncrementSink,
            buttonSize
        );
    }

    removeInvalidButtons(validIDs) {
        for (let button of this.buttons) {
            if (
                (button instanceof FeatureUIInputButton ||
                    button instanceof FeatureUIOutputButton) &&
                !validIDs.includes(button.targetID)
            ) {
                button.mode = 'delete';
            }
        }
    }

    createIOButtons(busType, ButtonType, label, mode, xIncrement, buttonSize) {
        let x = 0.2; // Start at the minimum x value
        for (let index of this.buses[busType]) {
            let id = this.plant.features[index].data['id'];
            let existingButton = this.buttons.find(
                (button) => button.targetID === id
            );
            let mouseOverData =
                this.plant.features[index].dataLabels['title'].data['data'];
            if (!existingButton) {
                let b = new ButtonType(
                    label,
                    x,
                    busType === 'source' ? 0 : 1,
                    buttonSize,
                    () => this.setMode(mode)
                );
                b.targetID = id;
                b.doCheckMouseOver = true;
                b.mouseOverData = mouseOverData;
                this.buttons.push(b);
            } else {
                existingButton.mouseOverData = mouseOverData;
            }
            x += xIncrement;
        }
    }

    setupFromSubProcess() {
        this.setupIOButtons();
    }

    update(zoom) {
        super.update(zoom);
        if (this.mode == 'deleting' || this.mode == 'delete') {
            this.plant = null;
        }
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FeatureDataTextLabel(
            0,
            0.15,
            'PROCESS',
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
        // test

        this.modelData['INFO'] = {};
        this.modelData['INFO']['NAME'] = 'a process';
        this.modelData['INFO']['YEAR'] = 2010;
        this.modelData['INFO']['COST'] = 100000;
        this.modelData['TAGS'] = [];
        this.modelData['TAGS'].push('mandated');
        this.modelData['TAGS'].push('no value add');
        this.modelData['TAGS'].push('no AI');
        this.modelData['ACTIONS'] = {};
        this.modelData['ACTIONS']['TEST ACTION'] = () => console.log('test');
        // this.dataLabels['tab'] = new FeatureDataTabGroup(
        //   this.g.bCart.x,
        //   this.g.bCart.y,
        //   this
        // );
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
        this.buttons.push(
            new FeatureUIButtonLetterLabel('Edit', 1, 0.5, buttonSize, () =>
                this.transitionPlant()
            )
        );
    }

    transitionPlant() {
        this.mode = 'transition_plant';
    }

    draw(zoom, cnv) {
        fill(getColor('primary'));
        stroke(getColor('outline'));
        rect(this.g.sCart.x, this.g.sCart.y, this.g.sDims.w, this.g.sDims.h);
    }
}
