class Session {
    constructor () {
        this.plants = [new Plant()];
        this.plantsPointer = 0;
    }

    get plant() {
        return this.plants[this.plantsPointer];
    }

    update(zoom) {
        this.plant.update(zoom);
        if (this.plant.mode == 'transition_plant') {
            this.plant.mode = 'idle';
            let targetPlant = this.plant.targetPlant;
            this.plant.targetPlant = null;
            this.plantsPointer = targetPlant;
            this.plant.enter();
        }
    }

    draw(zoom) {
        this.plant.draw(zoom);
    }

    addProcess(x, y) {
        let newPlant = new Plant();
        newPlant.addSource(0, -246);
        newPlant.addSigma(0, 0);
        newPlant.addSink(0, 246);
        newPlant.addConnector(0, 0, newPlant.features[1], newPlant.features[0]);
        newPlant.addConnector(0, 0, newPlant.features[2], newPlant.features[1]);
        let parentLink = new ParentLink(-196, 0);
        parentLink.targetPlant = this.plantsPointer;
        newPlant.features.push(parentLink);
        for (let i = 0; i < newPlant.length; i++) { // why isnt this working
            newPlant[i].isAnimating = false;
        }
        this.plants.push(newPlant);
        let newProcess = new Process(x, y, 400, 280, newPlant, this.plants.length - 1);
        // newPlant.collectBuses();
        // newPlant.setupIOButtons();
        this.plant.features.push(newProcess);

    }

    addSink(x, y) {
        this.plant.features.push(new Sink(x, y));
    }

    addSource(x, y) {
        this.plant.features.push(new Source(x, y));
    }

    addZone(x, y) {
        this.plant.features.push(new Zone(x, y));
    }

    addSigma(x, y) {
        this.plant.features.push(new Sigma(x, y));
    }

    addSplit(x, y) {
        this.plant.features.push(new Split(x, y));
    }

    addMerge(x, y) {
        this.plant.features.push(new Merge(x, y));
    }

    addConnector(x, y, input, output) {
        this.plant.features.push(new Connector(x, y, input, output));
    }
}