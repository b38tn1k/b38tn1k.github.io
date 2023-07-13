class PlantSetup {

    constructor() {
        this.features = [];
        this.changed = false;
    }
    addProcess(x, y, plant, plantID, record = true) {
        plant.transitionWidgetsOut();
        this.changed = true;
        const feat = new Process(x, y, 400, 280, plant, plantID);
        this.features.push(feat);
        feat.packCommand(record, 'newFeature', feat.type, feat.selfDescribe());
        return feat;
    }

    addSink(x, y, record = true) {
        this.changed = true;
        const feat = new Sink(x, y);
        this.features.push(feat);
        feat.packCommand(record, 'newFeature', feat.type, feat.selfDescribe());
        return feat;
    }

    addSource(x, y, record = true) {
        this.changed = true;
        const feat = new Source(x, y);
        this.features.push(feat);
        feat.packCommand(record, 'newFeature', feat.type, feat.selfDescribe());
        return feat;
    }

    addNote(x, y, record = true) {
        this.changed = true;
        const feat = new Note(x, y);
        this.features.push(feat);
        feat.packCommand(record, 'newFeature', feat.type, feat.selfDescribe());
        return feat;
    }

    addZone(x, y, record = true) {
        this.changed = true;
        this.features.push(new Zone(x, y));
        const feat = this.getLastAdded();
        feat.packCommand(record, 'newFeature', feat.type, feat.selfDescribe());
        return feat;
    }

    addMetric(x, y, record = true) {
        this.changed = true;
        const feat = new Metric(x, y);
        this.features.push(feat);
        feat.packCommand(record, 'newFeature', feat.type, feat.selfDescribe());
        return feat;
    }

    addSplit(x, y, record = true) {
        this.changed = true;
        const feat = new Split(x, y);
        this.features.push(feat);
        feat.packCommand(record, 'newFeature', feat.type, feat.selfDescribe());
        return feat;
    }

    addMerge(x, y, record = true) {
        this.changed = true;
        const feat = new Merge(x, y);
        this.features.push(feat);
        feat.packCommand(record, 'newFeature', feat.type, feat.selfDescribe());
        return feat;
    }

    addConnector(x, y, input, output, record = true) {
        this.changed = true;
        const feat = new Connector(x, y, input, output);
        this.features.push(feat);
        return feat;
    }

    addParentLink(x, y, pp) {
        let feat = new ParentLink(x, y);
        feat.targetPlant = pp;
        this.features.push(feat);
        feat.packCommand(false, 'newFeature', feat.type, feat.selfDescribe());
        return feat;
    }
}