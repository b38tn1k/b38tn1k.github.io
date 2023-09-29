// TODO: line 359 - rebuild plants after deleting! currently the entry and exity indicies are incorrect.
// maybe fix them the correct way rather than the gehtto way
// TODO: line 148 - rebuild the plant stack to shift the target plants etc using plant and plant.parent

/**
* @description The function slerp smoothly transitions between two values, start and 
* end, over a given time t, using a sinusoidal easing formula.
* 
* @param start - The `start` input parameter provides the initial value for the 
* smooth transition between two values.
* 
* @param end - END PARAMETER DOES:
* 
* The `end` parameter in the `slerp` function represents the final value that the 
* function will interpolate towards, based on the input `t` value.
* 
* @param t - The `t` input parameter in the `slerp` function controls the interpolation 
* between the `start` and `end` values, with `t` representing the progress of the interpolation.
* 
* @returns {  } - The output returned by the `slerp` function is a interpolated value 
* between the `start` and `end` parameters, based on the given `t` parameter, using 
* a sinusoidal easing formula.
*/
function slerp(start, end, t) {
    t = 0.5 * (1 - Math.cos(Math.PI * t)); // Sinusoidal easing
    return start * (1 - t) + end * t;
}

class Session extends UndoStack {
/**
* @description The `constructor()` function initializes the object with the following 
* properties and values:
* 
* 	- `plants` array with a single `Plant` object
* 	- `plantsPointer` pointing to the first element of `plants`
* 	- `mode` set to `'idle'`
* 	- `transitionTimer` set to `0`
* 	- `transitionDuration` set to `15`
* 	- `newtag` set to `false`
* 	- `tags` set to a new `Set`
* 
* It also calls the `super()` constructor and applies the `SessionSetupMixin` to the 
* object.
*/
    constructor() {
        super();
        this.plants = [new Plant()];
        this.plants[0].parent = this;
        this.plantsPointer = 0;
        this.mode = 'idle';
        this.transitionTimer = 0;
        this.transitionDuration = 15;
        Object.assign(this, SessionSetupMixin);
        this.newtag = false;
        this.tags = new Set();
    }

/**
* @description The function `get Plant()` returns the plant at the current position 
* of the plants pointer.
* 
* @returns { object } - The output returned by the `getPlant()` function is the plant 
* at the specified index in the `plants` array, as determined by the `plantsPointer` 
* variable.
*/
    get plant() {
        return this.plants[this.plantsPointer];
    }

/**
* @description This function manages a zoom transition.
* 
* @param zoom - The `zoom` input parameter is used to set the initial zoom level for 
* the transition.
*/
    beginTransition(zoom) {
        this.transitionTimer += 1;
        let t = this.transitionTimer / this.transitionDuration; // calculate normalized progress
        globalZoom = slerp(zoom, 0.2, t); // use lerp for smooth transition
        if (this.transitionTimer >= this.transitionDuration) {
            this.mode = 'do_transition';
            this.transitionTimer = 0;
        }
    }

/**
* @description The function doTransition(zoom) manages a transition between two 
* plants in the application, specifically:
* 
* 	- It transitions out the current plant's widgets.
* 	- It sets the target plant to null and the plants pointer to the new target plant.
* 	- It enters the new target plant and transitions in its widgets.
* 	- It updates the plant's state with the new zoom value.
* 	- It sets the mode to 'end_transition' and triggers an fpsEvent.
* 
* @param { number } zoom - The `zoom` input parameter updates the plant's scale.
*/
    doTransition(zoom) {
        let targetPlant = this.plant.targetPlant;
        this.plant.transitionWidgetsOut();
        this.plant.targetPlant = null;
        this.plantsPointer = targetPlant;
        this.plant.enter();
        this.plant.transitionWidgetsIn();
        scrollX = 0;
        scrollY = 0;
        this.plant.update(zoom);
        this.mode = 'end_transition';
        fpsEvent();
    }

/**
* @description The function `endTransition` smoothly transitions the zoom level of 
* an object from 0.2 to 1.0 over a duration of 1 second, using a linear interpolation 
* function `slerp`.
* 
* @param zoom - The `zoom` input parameter in the `endTransition` function is used 
* to smoothly transition the zoom level of the application.
*/
    endTransition(zoom) {
        this.transitionTimer += 1;
        let t = this.transitionTimer / this.transitionDuration; // calculate normalized progress
        globalZoom = slerp(0.2, 1.0, t); // use lerp for smooth transition
        if (this.transitionTimer >= this.transitionDuration) {
            this.mode = 'idle';
            this.transitionTimer = 0;
        }
    }

/**
* @description The function saves a serialized plant description to a JSON file named 
* "myData.json".
*/
    saveSerializedPlant() {
        const description = this.plants[0].selfDescribe();
        try {
            saveJSON(description, 'myData.json');
        } catch (error) {
            console.error(error);
            console.log(description);
        }
    }

/**
* @description The function loadFromObject(info) constructs the plants[0] by calling 
* the selfConstruct(info, this) method.
* 
* @param { object } info - The `info` input parameter is passed to the `selfConstruct()` 
* method of the `plants[0]` object, which is a constructor for the plant object.
*/
    loadFromObject(info) {
        this.plants[0].selfConstruct(info, this);
    }

/**
* @description The `update` function updates the state of a plant simulation based 
* on user input, handling events such as zoom changes and command execution.
* 
* @param { number } zoom - The `zoom` input parameter is passed to the `update` 
* method of the `Plant` class, and it is used to determine the scaling factor for 
* the plant. The `zoom` parameter is set to a value between 0 and 1, where 0 represents 
* no scaling (i.e., the plant remains at its original size), and 1 represents maximum 
* scaling (i.e., the plant is zoomed in to its maximum size).
*/
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
        if (this.plant.changed === true) {
            this.plant.setChangedFalse();
            this.clearRedoStack();
            this.preserveStack = false;
        }

        if (this.plant.command.length > 0 && !this.plant.isActive) {
            // Add the commands to the undo stack
            const commandObject = {
                plant: this.plantsPointer,
                commands: JSON.stringify(this.plant.command)
            };
            // HACK to fix
            // TODO: line 105 - if undo stack isnt as big as plant pointer, need to catch up! problem in loading
            while (this.undoStack.length <= this.plantsPointer) {
                this.undoStack.push([]);
            }
            this.undoStack[this.plantsPointer].push(commandObject);
            // if undo stack isnt as big as plant pointer, need to catch up!
            console.log(logCommand(commandObject));

            // Clear the redo stack
            this.clearRedoStack();

            // Reset the undo cursor
            this.undoCursor[this.plantsPointer] =
                this.undoStack[this.plantsPointer].length;
            this.plant.command = [];

            // ghetto plant memory maintenance
            // TODO: rebuild the plant stack to shift the target plants etc using plant and plant.parent
            for (let i = 0; i < this.plants.length; i++) {
                if (this.plants[i] != null) {
                    if (this.plants[i].parent.mode == 'delete') {
                        this.plants[i].parent = null;
                        this.plants[i] = null;
                    }
                }
            }
        }
        this.checkTags();
        this.updateTags();
    }

/**
* @description The function checks for new tags in the plants array and adds them 
* to the tags set if they do not already exist.
*/
    checkTags() {
        for (let i = 0; i < this.plants.length; i++) {
            if (this.plants[i] != null) {
                if (this.plants[i].newtag) {
                    this.plants[i].newtag = false;
                    for (let tag of this.plants[i].tags) {
                        if (!this.tags.has(tag)) {
                            this.tags.add(tag);
                            this.newtag = true;
                        }
                    }
                }
            }
        }
    }

/**
* @description The function updates the tags of each plant in the array, if it is 
* not null, with the tags passed in the function.
*/
    updateTags() {
        if (this.newtag) {
            for (let i = 0; i < this.plants.length; i++) {
                if (this.plants[i] != null) {
                    this.plants[i].updateTags(this.tags);
                }
            }
            this.newtag = false;
        }
    }

/**
* @description Serializes the plant's description into a JSON string.
* 
* @returns { string } - The output returned by the `serializePlant()` function is a 
* JSON string representing the plant's description.
*/
    serializePlant() {
        const description = this.plants[0].selfDescribe();
        let res = ' ';
        try {
            res = JSON.stringify(description);
        } catch (error) {
            console.error(error);
            console.log(description);
        }
        return res;
    }

/**
* @description The function `draw(zoom, cnv)` draws the plant on the canvas.
* 
* @param { number } zoom - The `zoom` input parameter scales the drawing of the plant.
* 
* @param cnv - The `cnv` input parameter is the canvas element where the plant will 
* be drawn.
*/
    draw(zoom, cnv) {
        this.plant.draw(zoom, cnv);
    }
}

