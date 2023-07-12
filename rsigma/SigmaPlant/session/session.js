// TODO: line 359 - rebuild plants after deleting! currently the entry and exity indicies are incorrect.
// maybe fix them the correct way rather than the gehtto way
// TODO: line 148 - rebuild the plant stack to shift the target plants etc using plant and plant.parent
// TODO: line 105 - if undo stack isnt as big as plant pointer, need to catch up! problem in loading

function slerp(start, end, t) {
    t = 0.5 * (1 - Math.cos(Math.PI * t)); // Sinusoidal easing
    return start * (1 - t) + end * t;
}

class Session extends UndoStack {
    constructor() {
        super();
        this.plants = [new Plant()];
        this.plants[0].parent = this;
        this.plantsPointer = 0;
        this.mode = 'idle';
        this.transitionTimer = 0;
        this.transitionDuration = 15;
        Object.assign(this, SessionSetupMixin);
    }

    get plant() {
        return this.plants[this.plantsPointer];
    }

    beginTransition(zoom) {
        this.transitionTimer += 1;
        let t = this.transitionTimer / this.transitionDuration; // calculate normalized progress
        globalZoom = slerp(zoom, 0.2, t); // use lerp for smooth transition
        if (this.transitionTimer >= this.transitionDuration) {
            this.mode = 'do_transition';
            this.transitionTimer = 0;
        }
    }

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

    endTransition(zoom) {
        this.transitionTimer += 1;
        let t = this.transitionTimer / this.transitionDuration; // calculate normalized progress
        globalZoom = slerp(0.2, 1.0, t); // use lerp for smooth transition
        if (this.transitionTimer >= this.transitionDuration) {
            this.mode = 'idle';
            this.transitionTimer = 0;
        }
    }

    saveSerializedPlant() {
        const description = this.plants[0].selfDescribe();
        try {
            saveJSON(description, 'myData.json');
        } catch (error) {
            console.error(error);
            console.log(description);
        }
    }

    loadFromObject(info) {
        this.plants[0].selfConstruct(info, this);
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
    }

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

    draw(zoom, cnv) {
        this.plant.draw(zoom, cnv);
    }
}
