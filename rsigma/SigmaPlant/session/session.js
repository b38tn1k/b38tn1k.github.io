// TODO: line 359 - rebuild plants after deleting! currently the entry and exity indicies are incorrect. 
// maybe fix them the correct way rather than the gehtto way
// TODO: line 148 - rebuild the plant stack to shift the target plants etc using plant and plant.parent



function slerp(start, end, t) {
    t = 0.5 * (1 - Math.cos(Math.PI * t)); // Sinusoidal easing
    return start * (1 - t) + end * t;
}

function logCommand(commandObject, label = 'UPDATE') {
    let mystring = label + '\tPLANT: ';
    mystring += String(commandObject.plant);
    mystring += '\n\t';
    const commands = JSON.parse(commandObject.commands);
    for (let cmd of commands) {
        mystring += 'ID: ' + cmd.id;
        mystring += ' CMD: ';
        for (let c of cmd.commands) {
            mystring += c.type;
            mystring += ' ';
        }
        mystring += '\n\t';
    }
    return mystring;
}

function commandContainsType(type, commandObject) {
    let res = [];
    const commands = JSON.parse(commandObject.commands);
    for (let cmd of commands) {
        for (let c of cmd.commands) {
            if (c.type == type) {
                res.push(cmd);
                break;
            }
        }
    }
    return res;
}

class Session {
    constructor() {
        this.plants = [new Plant()];
        this.plants[0].parent = this;
        this.plantsPointer = 0;
        this.mode = 'idle';
        this.transitionTimer = 0;
        this.transitionDuration = 15;
        this.history = [];
        this.undoStack = [[]];
        this.redoStack = [[]];
        this.undoCursor = [0];
        this.preserveStack = false;
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

    doUndo(zoom) {
        if (this.undoCursor[this.plantsPointer] > 0) {
            // Decrement the undo cursor
            this.undoCursor[this.plantsPointer]--;

            // Get the commands from the undo stack and undo them
            const commandObject = this.undoStack[this.plantsPointer].pop();
            console.log(logCommand(commandObject, 'UNDO'));
            this.undoCommands(commandObject, zoom);

            // Move the commands to the redo stack
            this.redoStack[this.plantsPointer].push(commandObject);
        }
    }

    doRedo(zoom) {
        if (this.redoStack[this.plantsPointer].length > 0) {
            // Get the commands from the redo stack and redo them
            const commandObject = this.redoStack[this.plantsPointer].pop();
            console.log(logCommand(commandObject, 'REDO'));
            this.redoCommands(commandObject, zoom);

            // Move the commands to the undo stack
            this.undoStack[this.plantsPointer].push(commandObject);

            // Increment the undo cursor
            this.undoCursor[this.plantsPointer]++;
        }
    }

    undoCommands(commandObject, zoom) {
        const allCommands = JSON.parse(commandObject.commands);
        allCommands.forEach((cmd) => {
            cmd.commands.sort((a, b) => {
                if (a.type === 'delete-append') return 1;
                if (b.type === 'delete-append') return -1;
                return 0;
            });
        });

        allCommands.sort((a, b) => {
            if (a.commands.some((c) => c.type === 'delete-append')) return 1;
            if (b.commands.some((c) => c.type === 'delete-append')) return -1;
            return 0;
        });
        const plant = commandObject.plant;
        for (let ftcmds of allCommands) {
            let target = this.plants[plant].findID(ftcmds.id);
            if (
                target ||
                ftcmds.commands[0].type == 'delete' ||
                ftcmds.commands[0].type == 'delete-append'
            ) {
                for (let i = 0; i < ftcmds.commands.length; i++) {
                    let child;
                    switch (ftcmds.commands[i].type) {
                        case 'newFeature':
                            target.delete();
                            target.setMode('delete');
                            this.preserveStack = true;
                            break;
                        case 'delete-append':
                        case 'delete':
                            this.reConstruct(
                                ftcmds.commands[i].forwards,
                                ftcmds.commands[i].reverse,
                                zoom
                            );
                            this.preserveStack = true;
                            break;
                        case 'move':
                            if (target) {
                                target.move(
                                    ftcmds.commands[i].reverse[0],
                                    ftcmds.commands[i].reverse[1],
                                    false
                                );
                            }
                            break;
                        case 'addChild':
                            if (target) {
                                child = this.plants[plant].findID(
                                    ftcmds.commands[i].reverse.id
                                );
                                if (child) {
                                    target.removeChild(child, false);
                                    child.move(
                                        ftcmds.commands[i].reverse.x,
                                        ftcmds.commands[i].reverse.y,
                                        false
                                    );
                                }
                            }
                            break;
                        case 'removeChild':
                            if (target) {
                                child = this.plants[plant].findID(
                                    ftcmds.commands[i].reverse.id
                                );
                                if (child) {
                                    target.addChild(child, false);
                                    child.move(
                                        ftcmds.commands[i].reverse.x,
                                        ftcmds.commands[i].reverse.y,
                                        false
                                    );
                                }
                            }
                            break;
                        case 'resize':
                            if (target) {
                                target.resize(
                                    ftcmds.commands[i].reverse[0],
                                    ftcmds.commands[i].reverse[1],
                                    false
                                );
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    redoCommands(commandObject, zoom) {
        const allCommands = JSON.parse(commandObject.commands);
        const plant = commandObject.plant;
        for (let ftcmds of allCommands) {
            let target = this.plants[plant].findID(ftcmds.id);
            for (let i = 0; i < ftcmds.commands.length; i++) {
                let child;
                switch (ftcmds.commands[i].type) {
                    case 'newFeature':
                        this.reConstruct(
                            ftcmds.commands[i].forwards,
                            ftcmds.commands[i].reverse,
                            zoom
                        );
                        this.preserveStack = true;
                        break;
                    case 'delete-append':
                    case 'delete':
                        target.setMode('delete');
                        target.delete();
                        this.preserveStack = true;
                        break;
                    case 'move':
                        if (target) {
                            target.move(
                                ftcmds.commands[i].forwards[0],
                                ftcmds.commands[i].forwards[1],
                                false
                            );
                        }
                        break;
                    case 'addChild':
                        if (target) {
                            child = this.plants[plant].findID(
                                ftcmds.commands[i].reverse.id
                            );
                            if (child) {
                                target.addChild(child, false);
                            }
                        }
                        break;
                    case 'removeChild':
                        if (target) {
                            child = this.plants[plant].findID(
                                ftcmds.commands[i].reverse.id
                            );
                            if (child) {
                                target.removeChild(child, false);
                            }
                        }
                        break;
                    case 'resize':
                        if (target) {
                            target.resize(
                                ftcmds.commands[i].forwards[0],
                                ftcmds.commands[i].forwards[1],
                                false
                            );
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    //TODODOODOD
    reConstruct(type, info, zoom) {
        const x = 0;
        const y = 0;
        let newFeature;
        switch (type) {
            case 'process':
                // let newPlant = new Plant();
                // newPlant.selfConstruct(info.plant);
                // TODO rebuild plants after deleting!
                // let newPlant = null;
                newFeature = this.addProcess(x, y, false)//, newPlant); // amm i adding extra plants?
                break;
            case 'sink':
                newFeature = this.addSink(x, y, false);
                break;
            case 'source':
                newFeature = this.addSource(x, y, false);
                break;
            case 'zone':
                newFeature = this.addZone(x, y, false);
                break;
            case 'metric':
                newFeature = this.addMetric(x, y, false);
                break;
            case 'split':
                newFeature = this.addSplit(x, y, false);
                break;
            case 'merge':
                newFeature = this.addMerge(x, y, false);
                break;
            case 'connector':
                let input = this.plant.findID(info.input);
                let output = this.plant.findID(info.output);
                newFeature = this.addConnector(x, y, input, output, false);
                break;
        }
        newFeature.def = info;
        newFeature.isAnimating = false;
        newFeature.animationValue = 1;
        newFeature.commands = {};
        newFeature.selfConstruct();
        if (newFeature.type == 'process') {
            newFeature.setupFromSubProcess();
        }
        if (newFeature.g.bDims.w <= 0) {
            newFeature.g.bDims.w = newFeature.g.aDims.w;
            newFeature.g.bDims.h = newFeature.g.aDims.h;
        }
        newFeature.update(zoom);
    }

    clearRedoStack() {
        if (this.preserveStack == false) {
            console.log('CLEAR REDO STACK');
            this.redoStack[this.plantsPointer] = [];
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

    addProcess(x, y, record = true, newPlant = null) {
        if (newPlant == null) {
            newPlant = new Plant();
            newPlant.addSource(0, -246, false);
            newPlant.addMetric(0, 0, false);
            newPlant.addSink(0, 246, false);
            newPlant.addConnector(
                0,
                0,
                newPlant.features[1],
                newPlant.features[0],
                false
            );
            newPlant.addConnector(
                0,
                0,
                newPlant.features[2],
                newPlant.features[1],
                false
            );
            newPlant.addParentLink(-196, 0, this.plantsPointer);
            for (let i = 0; i < newPlant.features.length; i++) {
                newPlant.features[i].turnOffAnimations();
            }
        }
        this.plants.push(newPlant);
        this.undoStack.push([]);
        this.redoStack.push([]);
        this.undoCursor.push(0);
        const feat = this.plant.addProcess(
            x,
            y,
            newPlant,
            this.plants.length - 1,
            record
        );
        // this.preserveStack = true;
        return feat;
    }

    addSink(x, y, record = true) {
        const feat = this.plant.addSink(x, y, record);
        // this.preserveStack = true;
        return feat;
    }

    addSource(x, y, record = true) {
        const feat = this.plant.addSource(x, y, record);
        // this.preserveStack = true;
        return feat;
    }

    addZone(x, y, record = true) {
        const feat = this.plant.addZone(x, y, record);
        // this.preserveStack = true;
        return feat;
    }

    addMetric(x, y, record = true) {
        const feat = this.plant.addMetric(x, y, record);
        // this.preserveStack = true;
        return feat;
    }

    addSplit(x, y, record = true) {
        const feat = this.plant.addSplit(x, y, record);
        // this.preserveStack = true;
        return feat;
    }

    addMerge(x, y, record = true) {
        const feat = this.plant.addMerge(x, y, record);
        // this.preserveStack = true;
        return feat;
    }

    addConnector(x, y, input, output, record = true) {
        const feat = this.plant.addConnector(x, y, input, output, record);
        // this.preserveStack = true;
        return feat;
    }
}
