class Plant extends PlantSetup {
    constructor() {
        super();
        this.mode = null; // to capture non-null modes
        this.isActive = false;
        this.targetPlant = null;
        this.command = [];
        this.parent = null;
        this.activeFeatureProcessor = new ProcessActiveFeature(this);
    }

    getLastAdded() {
        return this.features[this.features.length - 1];
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
            if (this.activeFeatureProcessor[this.mode]) {
                this.activeFeatureProcessor[this.mode]();
            } else {
                this.mode = 'idle';
            }
        }
    }

    setChangedFalse() {
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].changed = false;
        }
        this.changed = false;
    }

    selfConstruct(info, sess) {
        this.features = []; // clear out any naughty features
        // first, instantiate all the objects in features, in order, recursively for plants
        const f = info.features;
        const constructorHelper = new SelfConstructionHelper(this);

        for (let i = 0; i < f.length; i++) {
            constructorHelper[f[i].constructor](f[i], sess);
        }
        // set non-linking properties for each object in features, in order
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].isAnimating = false;
            this.features[i].animationValue = 1;
            this.features[i].selfConstruct();
        }
        this.setupLinkingFeatures();
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].changed = true;
        }
    }

    setupLinkingFeatures() {
        // set the linking properties for each object in features, in order
        for (let i = 0; i < this.features.length; i++) {
            if (this.features[i].placeholder == true) {
                let d = this.features[i].def;
                switch (d.constructor) {
                    case 'Connector':
                        this.features[i] = new Connector(
                            0,
                            0,
                            this.findID(d.input),
                            this.findID(d.output),
                            d.data.id
                        );
                        this.features[i].def = d;
                        this.features[i].selfConstruct();
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
        return zones;
    }

    updateFeatures(zoom, zones) {
        for (let i = 0; i < this.features.length; i++) {
            const feature = this.features[i];
            this.changed = this.features[i].changed || this.changed;
            if (feature.mode !== 'idle') {
                if (feature.mode !== 'auto') {
                    this.setActiveMode(feature);
                }
            } else {
                if (Object.keys(feature.command).length > 0) {
                    this.command.push(feature.command);
                    feature.command = {};
                }
            }

            if (feature.mode === 'delete') {
                if (Object.keys(feature.command).length > 0) {
                    this.command.push(feature.command);
                }
                this.deleteFeature(i);
                this.changed = true;
                continue;
            }

            feature.update(zoom);

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

    logPlant() {
        for (let i = 0; i < this.features.length; i++) {
            console.log(this.features[i].type, this.features[i].mode);
        }
    }
}
