class SelfConstructionHelper {
    constructor(parent) {
        this.parent = parent;
    }

    Process(f, sess) {
        let newPlant = new Plant();
        sess.plants.push(newPlant);
        newPlant.selfConstruct(f.plant);
        let newProcess = this.parent.addProcess(f.g.bCart[0], f.g.bCart[1], newPlant, f.targetPlant, false);
        newProcess.def = f;
        newProcess.setupFromSubProcess();
    }

    ParentLink(f) {
        let newParentLink = this.parent.addParentLink(f.g.bCart[0], f.g.bCart[1]);
        newParentLink.def = f;
    }

    Source(f) {
        let newSource = this.parent.addSource(f.g.bCart[0], f.g.bCart[1], false);
        newSource.def = f;
    }

    Sink(f) {
        let newSink = this.parent.addSink(f.g.bCart[0], f.g.bCart[1], false);
        newSink.def = f;
    }

    Zone(f) {
        let newZone = this.parent.addZone(f.g.bCart[0], f.g.bCart[1], false);
        newZone.def = f;
    }

    Metric(f) {
        let newMetric = this.parent.addMetric(f.g.bCart[0], f.g.bCart[1], false);
        newMetric.def = f;
    }

    Split(f) {
        let newSplit = this.parent.addSplit(f.g.bCart[0], f.g.bCart[1], false);
        newSplit.def = f;
    }

    Merge(f) {
        let newMerge = this.parent.addMerge(f.g.bCart[0], f.g.bCart[1], false);
        newMerge.def = f;
    }

    Connector(f) {
        let placeHolder = new Introspector(true);
        placeHolder.def = f;
        this.parent.features.push(placeHolder);
    }
}
