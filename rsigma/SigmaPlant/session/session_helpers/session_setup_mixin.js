let SessionSetupMixin = {
    // constructor () {
    //     this.plants = [new Plant()];
    //     this.plants[0].parent = this;
    //     this.plantsPointer = 0;

    // }

    setupNewPlant(newPlant) {
        newPlant.addSource(0, -246, false);
        newPlant.addMetric(0, 0, false);
        newPlant.addSink(0, 246, false);
        newPlant.addConnector(
            0,
            0,
            newPlant.features[1],
            newPlant.features[0],
            false
        );
        newPlant.addConnector(
            0,
            0,
            newPlant.features[2],
            newPlant.features[1],
            false
        );
        newPlant.addParentLink(-196, 0, this.plantsPointer);
        for (let i = 0; i < newPlant.features.length; i++) {
            newPlant.features[i].turnOffAnimations();
        }
    },

    addProcess(x, y, record = true, info = null) {
        let newPlant = new Plant();
        if (info == null) {
            this.setupNewPlant(newPlant);
            this.plants.push(newPlant);
            this.undoStack.push([]);
            this.redoStack.push([]);
            this.undoCursor.push(0);
        } else {
            newPlant.selfConstruct(info.plant, this);
            this.plants[info.targetPlant] = newPlant;
        }
        const feat = this.plant.addProcess(
            x,
            y,
            newPlant,
            this.plants.length - 1,
            record
        );
        newPlant.parent = feat;
        return feat;
    },

    addSink(x, y, record = true) {
        const feat = this.plant.addSink(x, y, record);
        return feat;
    },

    addNote(x, y, record = true) {
        const feat = this.plant.addNote(x, y, record);
        return feat;
    },

    addSource(x, y, record = true) {
        const feat = this.plant.addSource(x, y, record);
        return feat;
    },

    addZone(x, y, record = true) {
        const feat = this.plant.addZone(x, y, record);
        return feat;
    },

    addMetric(x, y, record = true) {
        const feat = this.plant.addMetric(x, y, record);
        return feat;
    },

    addSplit(x, y, record = true) {
        const feat = this.plant.addSplit(x, y, record);
        return feat;
    },

    addMerge(x, y, record = true) {
        const feat = this.plant.addMerge(x, y, record);
        return feat;
    },

    addConnector(x, y, input, output, record = true) {
        const feat = this.plant.addConnector(x, y, input, output, record);
        return feat;
    }
};
