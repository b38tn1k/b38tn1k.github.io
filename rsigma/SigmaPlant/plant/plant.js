class Plant {
    constructor() {
        this.features = [];
        this.mode = null; // to capture non-null modes
        this.isActive = false;
        this.parent = null;
    }

    addParent(parent) {
        this.parent = parent;
        this.features.push(new ParentLink(-196, 0));
    }

    addProcess(x, y, zoom) {
        let p = new Process(x, y);
        p.addPlantParent(this);
        this.features.push(p);
    }

    addSink(x, y) {
        this.features.push(new Sink(x, y));
    }

    addSource(x, y) {
        this.features.push(new Source(x, y));
    }

    addZone(x, y) {
        this.features.push(new Zone(x, y));
    }

    addDelay(x, y) {
        this.features.push(new Delay(x, y));
    }

    addSplit(x, y) {
        this.features.push(new Split(x, y));
    }

    addMerge(x, y) {
        this.features.push(new Merge(x, y));
    }

    addConnector(x, y, input, output) {
        this.features.push(new Connector(x, y, input, output));
    }

    handleMousePress() {
        this.clearHangingConnector();
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].handleMousePress();
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
                    if (feature.untetheredClicks >= 1) {
                        feature.mode = 'delete';
                    } else {
                        feature.untetheredClicks += 1;
                    }
                } 
            }
        }

    }

    doConnectorLogic(activeFeature, searchType, action) {
        let [alreadyUntethered, connector] = this.isHangingConnector(searchType); // look for the other one
        if (connector) {
            if (connector.source.id != activeFeature.id) {
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

    update(zoom) {
        this.mode = 'idle';
        let activeFeature;

        let zones = [];
        for (let i = 0; i < this.features.length; i++) {
            if (this.features[i].type === 'zone') {
                zones.push(this.features[i]);
                this.features[i].emptyChildren();
            }
        }

        for (let i = 0; i < this.features.length; i++) {
            let feature = this.features[i];
            if (feature.adoptable === true) {
                for (let j = 0; j < zones.length; j++) {
                    if (zones[j].checkIfChild(feature)) {
                        zones[j].addChild(feature);
                        break;
                    }
                }
            }
            if (feature.mode !== 'idle') {
                this.mode = feature.mode;
                activeFeature = feature;
            }
            if (feature.mode === 'delete') {
                activeFeature.delete(); // delink references
                this.features.splice(i, 1);
                activeFeature = null;
                i--;
            } else {
                feature.update(zoom);
                feature.display(zoom);
            }
            if (feature.type == 'connector' && feature.untethered) {
                fpsEvent();
            }
        }
        this.isActive = this.mode !== 'idle';
        if (this.isActive == true) {
            let connector;
            switch (this.mode) {
                case 'delete':
                    this.mode = 'idle';
                    break;
                case 'move':
                    activeFeature.moveToMouse();
                    break;
                case 'resize':
                    activeFeature.resizeToMouse();
                    break;
                case 'i_connect':
                    this.doConnectorLogic(activeFeature, 'Output', () => this.addConnector(0, 0, activeFeature, null));
                    break;
                case 'o_connect':
                    this.doConnectorLogic(activeFeature, 'Input', () => this.addConnector(0, 0, null, activeFeature));
                    break;
                default:
                    this.mode = 'idle';
                    break;
            }
            
        }
    }
}
