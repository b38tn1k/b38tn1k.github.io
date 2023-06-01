function slerp(start, end, t) {
    t = 0.5 * (1 - Math.cos(Math.PI * t)); // Sinusoidal easing
    return start * (1 - t) + end * t;
}


class Session {
    constructor () {
        this.plants = [new Plant()];
        this.plantsPointer = 0;
        this.mode = 'idle';
        this.transitionTimer = 0;
        this.transitionDuration = 15;
    }

    get plant() {
        return this.plants[this.plantsPointer];
    }

    beginTransition(zoom) {
        this.transitionTimer += 1;
        let t = this.transitionTimer / this.transitionDuration;  // calculate normalized progress
        globalZoom = lerp(zoom, 0.2, t);  // use lerp for smooth transition
        if (this.transitionTimer >= this.transitionDuration) {
            this.mode = 'do_transition';
            this.transitionTimer = 0;
        }
    }
    
    doTransition(zoom) {
        let targetPlant = this.plant.targetPlant;
        this.plant.targetPlant = null;
        this.plantsPointer = targetPlant;
        this.plant.enter();
        scrollX = 0;
        scrollY = 0;
        this.plant.update(zoom);
        this.mode = 'end_transition';
        fpsEvent();
    }
    
    endTransition(zoom) {
        this.transitionTimer += 1;
        let t = this.transitionTimer / this.transitionDuration;  // calculate normalized progress
        globalZoom = lerp(0.2, 1.0, t);  // use lerp for smooth transition
        if (this.transitionTimer >= this.transitionDuration) {
            this.mode = 'idle';
            this.transitionTimer = 0;
        }
    }
    

    update(zoom) {
        this.plant.update(zoom);
        if (this.plant.mode == 'transition_plant') {
            this.mode = 'begin_transition';
            this.plant.mode = 'idle';
            fpsEvent();
        }
        
        switch (this.mode) {
            case 'begin_transition':
                this.beginTransition(zoom);
                break;
            case 'do_transition':
                this.doTransition(zoom);
                break;
            case 'end_transition':
                this.endTransition(zoom);
                break;
        }
    }
    
    draw(zoom, cnv) {
        this.plant.draw(zoom, cnv);
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
        for (let i = 0; i < newPlant.features.length; i++) { // why isnt this working
            newPlant.features[i].turnOffAnimations();
        }
        this.plants.push(newPlant);
        let newProcess = new Process(x, y, 400, 280, newPlant, this.plants.length - 1);
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