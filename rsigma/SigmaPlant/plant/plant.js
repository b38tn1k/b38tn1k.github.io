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

    draw(zoom) {
        for (let i = 0; i < this.features.length; i++) {
            let feature = this.features[i];
            feature.display(zoom);
        }
    }

    update(zoom) {
        this.mode = 'idle';
    
        const zones = this.filterZones();
        this.processFeatures(zoom, zones);
    
        this.isActive = this.mode !== 'idle';
        if (this.isActive) {
          this.processActiveFeature();
        }
      }
    
      filterZones() {
        const zones = this.features.filter(feature => feature.type === 'zone');
        zones.forEach(zone => zone.emptyChildren());
        return zones;
      }
    
      processFeatures(zoom, zones) {
        for (let i = 0; i < this.features.length; i++) {
          const feature = this.features[i];
    
          if (feature.adoptable) {
            this.adoptFeatureIntoZone(zones, feature);
          }
    
          if (feature.mode !== 'idle') {
            this.setActiveMode(feature);
          }
    
          if (feature.mode === 'delete') {
            this.deleteFeature(i);
            continue;
          }
    
          feature.update(zoom);
    
          if (feature.type == 'connector' && feature.untethered) {
            fpsEvent();
          }
        }
      }
    
      adoptFeatureIntoZone(zones, feature) {
        const suitableZone = zones.find(zone => zone.checkIfChild(feature));
        if (suitableZone) {
          suitableZone.addChild(feature);
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
            break;
          case 'resize':
            this.activeFeature.resizeToMouse();
            break;
          case 'i_connect':
            this.doConnectorLogic(this.activeFeature, 'Output', () => this.addConnector(0, 0, this.activeFeature, null));
            break;
          case 'o_connect':
            this.doConnectorLogic(this.activeFeature, 'Input', () => this.addConnector(0, 0, null, this.activeFeature));
            break;
          default:
            this.mode = 'idle';
            break;
        }
      }
}
