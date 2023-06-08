class Plant {
    constructor() {
        this.features = [];
        this.mode = null; // to capture non-null modes
        this.isActive = false;
        this.targetPlant = null;
        this.changed = false;
    }

    addSink(x, y) {
        this.changed = true;
        this.features.push(new Sink(x, y));
    }

    addSource(x, y) {
        this.changed = true;
        this.features.push(new Source(x, y));
    }

    addZone(x, y) {
        this.changed = true;
        this.features.push(new Zone(x, y));
    }

    addMetric(x, y) {
        this.changed = true;
        this.features.push(new Metric(x, y));
    }

    addSplit(x, y) {
        this.changed = true;
        this.features.push(new Split(x, y));
    }

    addMerge(x, y) {
        this.changed = true;
        this.features.push(new Merge(x, y));
    }

    addConnector(x, y, input, output) {
        this.changed = true;
        this.features.push(new Connector(x, y, input, output));
    }

    handleMousePress(zoom) {
        this.clearHangingConnector();
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].handleMousePress(zoom);
        }
    }

    isHangingConnector(type) {
        let hangingConnector = null;
        let alreadyUntethered = false;
        for (let feature of this.features) {
            if (feature.type == 'connector') {
                if (feature.untethered == true) {
                    alreadyUntethered = true;
                    if (feature.sourceType == type) {
                        hangingConnector = feature;
                    }
                }
            }
        }
        return [alreadyUntethered, hangingConnector];
    }

    clearHangingConnector() {
        for (let feature of this.features) {
            if (feature.type == 'connector') {
                if (feature.untethered == true) {
                    feature.untetheredClicks += 1;
                    if (feature.untetheredClicks > 1) {
                        feature.mode = 'delete';
                    }
                }
            }
        }
    }

    doConnectorLogic(activeFeature, searchType, action) {
        let [alreadyUntethered, connector] =
            this.isHangingConnector(searchType); // look for the other one
        if (connector) {
            if (connector.source.data['id'] != activeFeature.data['id']) {
                connector.attach(activeFeature);
            }
        } else {
            if (alreadyUntethered == false) {
                action();
            }
        }
        this.mode = 'idle';
        activeFeature.mode = 'idle';
    }

    draw(zoom, cnv) {
        for (let i = 0; i < this.features.length; i++) {
            let feature = this.features[i];
            feature.display(zoom, cnv);
        }
    }

    enter() {
        this.features
            .filter((feature) => feature.type === 'process')
            .forEach((process) => process.setupFromSubProcess());
    }

    update(zoom) {
        this.mode = 'idle';

        const zones = this.filterZones();
        this.updateFeatures(zoom, zones);

        this.isActive = this.mode !== 'idle';
        if (this.isActive) {
            this.processActiveFeature();
        }
    }

    setChangedFalse() {
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].changed = false;
        }
        this.changed = false;
    }

    selfConstruct(info, sess) {
        // first, instantiate all the objects in features, in order, recursively for plants
        const f = info.features;
        for (let i = 0; i < f.length; i++) {
            switch (f[i].constructor) {
                case 'Process':
                    let newPlant = new Plant();
                    sess.plants.push(newPlant);
                    newPlant.selfConstruct(f[i].plant);
                    let newProcess = new Process(
                        f[i].g.bCart[0],
                        f[i].g.bCart[1],
                        f[i].g.bDims.w,
                        f[i].g.bDims.h,
                        newPlant,
                        f[i].targetPlant
                    );
                    newProcess.def = f[i];
                    newProcess.setupFromSubProcess();
                    this.features.push(newProcess);
                    break;
                case 'ParentLink':
                    let newParentLink = new ParentLink(
                        f[i].g.bCart[0],
                        f[i].g.bCart[1]
                    );
                    newParentLink.def = f[i];
                    this.features.push(newParentLink);
                    break;
                case 'Source':
                    let newSource = new Source(
                        f[i].g.bCart[0],
                        f[i].g.bCart[1]
                    );
                    newSource.def = f[i];
                    this.features.push(newSource);
                    break;
                case 'Sink':
                    let newSink = new Sink(f[i].g.bCart[0], f[i].g.bCart[1]);
                    newSink.def = f[i];
                    this.features.push(newSink);
                    break;
                case 'Zone':
                    let newZone = new Zone(f[i].g.bCart[0], f[i].g.bCart[1]);
                    newZone.def = f[i];
                    this.features.push(newZone);
                    break;
                case 'Metric':
                    let newMetric = new Metric(
                        f[i].g.bCart[0],
                        f[i].g.bCart[1]
                    );
                    newMetric.def = f[i];
                    this.features.push(newMetric);
                    break;
                case 'Split':
                    let newSplit = new Split(f[i].g.bCart[0], f[i].g.bCart[1]);
                    newSplit.def = f[i];
                    this.features.push(newSplit);
                    break;
                case 'Merge':
                    let newMerge = new Merge(f[i].g.bCart[0], f[i].g.bCart[1]);
                    newMerge.def = f[i];
                    this.features.push(newMerge);
                    break;
                case 'Connector':
                    let placeHolder = new Introspector(true);
                    placeHolder.def = f[i];
                    this.features.push(placeHolder);
                    break;
            }
        }

        // set non-linking properties for each object in features, in order
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].isAnimating = false;
            this.features[i].animationValue = 1;
            this.features[i].selfConstruct();
        }
        // set the linking properties for each object in features, in order
        for (let i = 0; i < this.features.length; i++) {
            if (this.features[i].placeholder == true) {
                let d = this.features[i].def;
                switch (d.constructor) {
                    case 'Connector':
                        try {
                            const inp = this.findID(d.input);
                            const oup = this.findID(d.output);
                            this.features[i] = new Connector(0, 0, inp, oup, d.data.id);
                            let inpB, oupB;
                            for (let t = 0; t < inp.buttons.length; t++) {
                              if(d.anchors['Input'] == inp.buttons[t].data['id']) {
                                inpB = inp.buttons[t];
                                inp.buttons[t].associatedConnector = this.features[i];
                                this.features[i].anchors['Input'] = inpB;
                                break;
                              }
                            }
                            for (let t = 0; t < oup.buttons.length; t++) {
                              if(d.anchors['Output'] == oup.buttons[t].data['id']) {
                                oupB = oup.buttons[t];
                                oup.buttons[t].associatedConnector = this.features[i];
                                this.features[i].anchors['Output'] = oupB;
                                break;
                              }
                            }
                            
                            
                        } catch (error) {
                            console.log('No Connector Created', error);
                        }
                        break;
                }
            }
        }
    }

    findID(id) {
        const foundFeature = this.features.find(
            (feature) => feature.data['id'] === id
        );
        return foundFeature;
    }

    selfDescribe() {
        let info = {
            constructor: this.constructor.name
        };
        info.features = [];
        for (let i = 0; i < this.features.length; i++) {
            const res = this.features[i].selfDescribe();
            if (res) {
                info.features.push(res);
            }
        }
        return info;
    }

    filterZones() {
        const zones = this.features.filter(
            (feature) => feature.type === 'zone'
        );
        // zones.forEach((zone) => zone.emptyChildren());
        return zones;
    }

    updateFeatures(zoom, zones) {
        for (let i = 0; i < this.features.length; i++) {
            const feature = this.features[i];
            this.changed = this.features[i].changed || this.changed;

            if (feature.mode !== 'idle') {
                this.setActiveMode(feature);
            }

            if (feature.mode === 'delete') {
                this.deleteFeature(i);
                this.changed = true;
                continue;
            }

            feature.update(zoom);
            // console.log(feature.g.checkMouseOver(mouseX, mouseY));

            if (feature.adoptable) {
                this.adoptFeatureIntoZone(zones, feature);
            }

            if (feature.type == 'connector' && feature.untethered) {
                fpsEvent();
            }
        }
    }

    adoptFeatureIntoZone(zones, feature) {
        let zoneHasChanged = zones.some((zone) => zone.changed === true); // UX question - do we wanna be able to drop zones ontop?
        // const zoneHasChanged = false;
        if (feature.changed || zoneHasChanged) {
            for (let i = 0; i < zones.length; i++) {
                const zone = zones[i];
                const shouldBeChild = zones[i].checkIfShouldBeChild(feature);
                const isChild = zones[i].checkIfIsChild(feature);
                if (shouldBeChild && !isChild) {
                    zones[i].addChild(feature);
                    break;
                }
                if (!shouldBeChild && isChild) {
                    zones[i].removeChild(feature);
                    break;
                }
            }
        }
    }

    setActiveMode(feature) {
        this.mode = feature.mode;
        this.activeFeature = feature;
    }

    deleteFeature(index) {
        this.activeFeature.delete();
        this.features.splice(index, 1);
        this.activeFeature = null;
    }

    processActiveFeature() {
        switch (this.mode) {
            case 'delete':
                this.mode = 'idle';
                break;
            case 'move':
                this.activeFeature.moveToMouse();
                this.mode = 'idle';
                break;
            case 'resize':
                this.activeFeature.resizeToMouse();
                this.mode = 'idle';
                break;
            case 'i_connect':
                this.doConnectorLogic(this.activeFeature, 'Output', () =>
                    this.addConnector(0, 0, this.activeFeature, null)
                );
                break;
            case 'o_connect':
                this.doConnectorLogic(this.activeFeature, 'Input', () =>
                    this.addConnector(0, 0, null, this.activeFeature)
                );
                break;
            case 'transition_plant':
                this.mode = 'transition_plant';
                this.targetPlant = this.activeFeature.targetPlant;
                this.activeFeature.mode = 'idle';
                break;
            default:
                this.mode = 'idle';
                // this.changed = false;
                break;
        }
    }
}
