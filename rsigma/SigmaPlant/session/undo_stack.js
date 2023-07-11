class UndoStack {
    constructor() {
        this.history = [];
        this.undoStack = [[]];
        this.redoStack = [[]];
        this.undoCursor = [0];
        this.preserveStack = false;
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
                                if (target.type == 'zone') {
                                    this.preserveStack = true;
                                }
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
                            if (target.type == 'zone') {
                                this.preserveStack = true;
                            }
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
                newFeature = this.addProcess(x, y, false, info); // amm i adding extra plants?
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
}
