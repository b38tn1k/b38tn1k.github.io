class Plant extends PlantSetup {
/**
* @description The `constructor()` function initializes the object's properties and 
* sub-objects, including `mode`, `isActive`, `targetPlant`, `command`, `parent`, 
* `tags`, and `activeFeatureProcessor`.
*/
    constructor() {
        super();
        this.mode = null; // to capture non-null modes
        this.isActive = false;
        this.targetPlant = null;
        this.command = [];
        this.parent = null;
        this.tags = new Set();
        this.newtag = false;
        this.activeFeatureProcessor = new ProcessActiveFeature(this);
    }

/**
* @description The function `getLastAdded()` returns the last item added to the 
* `features` array.
* 
* @returns { object } - The output returned by the `getLastAdded()` function is the 
* last element added to the `features` array.
*/
    getLastAdded() {
        return this.features[this.features.length - 1];
    }

/**
* @description The function handleMousePress(zoom) clears the hanging connector and 
* recursively calls the handleMousePress function for each feature in the array.
* 
* @param { number } zoom - The `zoom` input parameter is passed to the `handleMousePress()` 
* function of each feature element in the array `this.features`.
*/
    handleMousePress(zoom) {
        this.clearHangingConnector();
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].handleMousePress(zoom);
        }
    }

/**
* @description This function checks if a feature with the given `type` is a hanging 
* connector and returns an array with two elements: `alreadyUntethered` and `hangingConnector`.
* 
* @param { string } type - The `type` input parameter in the `isHangingConnector()` 
* function determines the type of connector to search for.
* 
* @returns { object } - The output returned by this function is an array containing 
* two values:
* 
* 	- alreadyUntethered: a boolean indicating whether any connectors have already 
* been untethered
* 	- hangingConnector: the connector object that matches the given type, or null if 
* no matching connector is found.
*/
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

/**
* @description The function clearHangingConnector() increments the untethered clicks 
* count for each connector feature, and sets the mode to "delete" if the untethered 
* clicks count exceeds 1.
*/
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

/**
* @description The function doConnectorLogic(activeFeature, searchType, action) 
* attaches the active feature to a hanging connector if the connector exists and the 
* source data ID of the connector is different from the active feature's data ID. 
* If no hanging connector is found, it calls the action function.
* 
* @param activeFeature - The `activeFeature` input parameter in the `doConnectorLogic` 
* function is used to specify the currently active feature that should be processed 
* by the connector.
* 
* @param { string } searchType - The `searchType` input parameter in the `doConnectorLogic` 
* function specifies the type of search to perform for the hanging connector.
* 
* @param action - The `action` input parameter in the `doConnectorLogic` function 
* is called when there is no matching connector found for the active feature.
*/
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

/**
* @description The function `draw(zoom, cnv)` iterates through an array of features 
* and calls the `display(zoom, cnv)` method for each feature, drawing it on the canvas.
* 
* @param { number } zoom - The `zoom` input parameter scales the display of features.
* 
* @param cnv - The `cnv` input parameter in the `draw` function is a canvas object 
* that the function will draw on.
*/
    draw(zoom, cnv) {
        for (let i = 0; i < this.features.length; i++) {
            let feature = this.features[i];
            feature.display(zoom, cnv);
        }
    }

/**
* @description The `enter()` function filters the `features` array to only include 
* processes, and then iterates over each process to call the `setupFromSubProcess()` 
* method.
*/
    enter() {
        this.features
            .filter((feature) => feature.type === 'process')
            .forEach((process) => process.setupFromSubProcess());
    }

/**
* @description The `update` function updates the mode of the component to "idle", 
* filters zones, updates features, and sets the component's active status based on 
* the mode.
* 
* @param { number } zoom - The `zoom` input parameter in the `update` function 
* determines which features to update in the map.
*/
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

/**
* @description The `setChangedFalse()` function resets all feature objects' `changed` 
* properties to `false` and sets the parent object's `changed` property to `false` 
* as well.
*/
    setChangedFalse() {
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].changed = false;
        }
        this.changed = false;
    }

/**
* @description This function transitions all widgets within the features array to 
* their in-state.
*/
    transitionWidgetsIn() {
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].transitionWidgetsIn();
        }
    }

/**
* @description This function calls the `transitionWidgetsOut()` method of each element 
* in the `features` array.
*/
    transitionWidgetsOut() {
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].transitionWidgetsOut();
        }
    }

/**
* @description The function setupWidgets() iterates through the features array and 
* calls the setupWidgets() method for each element in the array, allowing each feature 
* to set up its own widgets.
*/
    setupWidgets() {
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].setupWidgets();
        }
    }

/**
* @description The function checkWidgetTags(f) checks if the widget's data property 
* "newtag" is not empty and then iterates through the tags in the "newtag" array.
* 
* @param { object } f - The `f` input parameter is a object that contains data for 
* the widget being checked.
*/
    checkWidgetTags(f) {
        if (f.data['newtag']) {
            if (f.data['newtag'].length != 0) {
                for (let tag of f.data.newtag) {
                    if (!this.tags.has(tag)) {
                        this.tags.add(tag);
                        this.newtag = true;
                    }
                }
                f.data['newtag'] = [];
            }
        }
    }

/**
* @description The function updates widgets by:
* 
* 1/ Checking widget tags.
* 2/ Invoking widget screen logic.
* 
* @param f - The `f` input parameter in the `updateWidgets` function calls the 
* `widgetScreenLogic` method on the object it is passed to.
*/
    updateWidgets(f) {
        this.checkWidgetTags(f);
        f.widgetScreenLogic();

    }

/**
* @description This function updates the tags associated with an object, combining 
* the existing tags with the provided tags and adding the tags to any features 
* associated with the object.
* 
* @param { array } tags - The `tags` input parameter is an array of strings that is 
* passed to the `updateTags` function. It is used to update the `tags` set with new 
* tags.
*/
    updateTags(tags) {
        if (tags) {
            this.tags = new Set([...this.tags, ...tags]);
        }
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].addTags(this.tags);
        }
    }

/**
* @description The `selfConstruct` function initializes and constructs all objects 
* in the `features` array, recursively for plants, using a `SelfConstructionHelper` 
* object. It sets non-linking properties for each object, such as `isAnimating` and 
* `animationValue`, and then calls the `selfConstruct` method for each object.
* 
* @param { object } info - The `info` input parameter provides the feature information 
* for the self-construction process.
* 
* @param { object } sess - The `sess` input parameter is passed to the 
* `SelfConstructionHelper` constructor, which is used to construct the objects in 
* the `features` array.
*/
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
        this.setupWidgets();
    }

/**
* @description The function `setupLinkingFeatures()` sets the linking properties for 
* each object in the `features` array, in order. It creates a new instance of the 
* appropriate connector object based on the `def` property of each feature, and sets 
* the `features` array element to that new connector object.
*/
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

/**
* @description The function `findID(id)` searches the `features` array for a element 
* with a `data['id']` property matching the given `id`, and returns the found feature.
* 
* @param { string } id - The `id` input parameter is passed to the `find` method to 
* search for a feature with a matching `id` in the `features` array.
* 
* @returns { object } - The output returned by this function is a feature object 
* from the `this.features` array, if one is found with an `id` property matching the 
* provided `id`.
*/
    findID(id) {
        const foundFeature = this.features.find(
            (feature) => feature.data['id'] === id
        );
        return foundFeature;
    }

/**
* @description The function `selfDescribe` creates an object containing information 
* about the instance, including the constructor name and an array of feature descriptions.
* 
* @returns { object } - The output returned by this function is an object with a 
* `constructor` property containing the name of the constructor, and a `features` 
* property containing an array of objects representing the features of the object, 
* where each feature is represented by an object returned by the `selfDescribe()` 
* method of the feature.
*/
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

/**
* @description The function `filterZones()` filters an array of features and returns 
* only the features with type 'zone'.
* 
* @returns { array } - The output returned by the `filterZones()` function is an 
* array of `feature` objects that have a `type` of `'zone'`.
*/
    filterZones() {
        const zones = this.features.filter(
            (feature) => feature.type === 'zone'
        );
        return zones;
    }

/**
* @description This function updates the features of a map, iterating through each 
* feature and performing the following actions:
* 
* 	- Updating the feature's widgets.
* 	- Checking if the feature has changed and adding it to the changed list if so.
* 	- Setting the active mode for the feature.
* 	- Deleting the feature if it is in delete mode.
* 	- Adopting the feature into a zone if it is adoptable.
* 	- Triggering an FPS event if the feature is a connector and untethered.
* 
* @param { number } zoom - The `zoom` input parameter in the `updateFeatures` function 
* is used to update the features in the map.
* 
* @param { array } zones - The `zones` input parameter in the `updateFeatures` 
* function is used to specify the zones to which the features should be adopted.
*/
    updateFeatures(zoom, zones) {
        for (let i = 0; i < this.features.length; i++) {
            const feature = this.features[i];
            this.updateWidgets(feature);
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

/**
* @description This function adopts a feature into a set of zones, checking if the 
* feature should be a child of any of the zones and adding or removing it as necessary.
* 
* @param { array } zones - The `zones` input parameter is an array of objects that 
* represent the zones in the map.
* 
* @param feature - The `feature` input parameter is used to determine if the zones 
* should be updated.
*/
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

/**
* @description This function sets the current mode and active feature of the object 
* to the values provided in the `feature` parameter.
* 
* @param { object } feature - The `feature` input parameter sets the `mode` property 
* of the current instance to the `mode` property of the passed `feature` object, and 
* also sets the `activeFeature` property to the passed `feature` object.
*/
    setActiveMode(feature) {
        this.mode = feature.mode;
        this.activeFeature = feature;
    }

/**
* @description The deleteFeature(index) function removes the feature at the specified 
* index from the features array and sets the active feature to null.
* 
* @param index - The `index` input parameter specifies the position of the feature 
* to be deleted in the `features` array.
*/
    deleteFeature(index) {
        this.activeFeature.delete();
        this.features.splice(index, 1);
        this.activeFeature = null;
    }

/**
* @description The function `logPlant()` logs the types and modes of the features 
* stored in the object `this.features`.
*/
    logPlant() {
        for (let i = 0; i < this.features.length; i++) {
            console.log(this.features[i].type, this.features[i].mode);
        }
    }
}

