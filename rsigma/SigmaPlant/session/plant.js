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