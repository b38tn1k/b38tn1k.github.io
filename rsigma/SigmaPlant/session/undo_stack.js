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

function loadInOrder(commands) {
    const allCommands = JSON.parse(commands);
    allCommands.forEach((cmd) => {
        cmd.commands.sort((a, b) => {
            if (a.type === 'delete_append') return 1;
            if (b.type === 'delete_append') return -1;
            return 0;
        });
    });

    allCommands.sort((a, b) => {
        if (a.commands.some((c) => c.type === 'delete_append')) return 1;
        if (b.commands.some((c) => c.type === 'delete_append')) return -1;
        return 0;
    });
    return allCommands;
}

class UndoStack {
    constructor() {
        this.history = [];
        this.undoStack = [[]];
        this.redoStack = [[]];
        this.undoCursor = [0];
        this.preserveStack = false;
        this.undoActions = new UndoActions(this);
        this.redoActions = new RedoActions(this);
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
        const allCommands = loadInOrder(commandObject.commands);
        const plant = commandObject.plant;
        for (let ftcmds of allCommands) {
            let target = this.plants[plant].findID(ftcmds.id);
            if (
                target ||
                ftcmds.commands[0].type == 'delete' ||
                ftcmds.commands[0].type == 'delete_append'
            ) {
                for (let i = 0; i < ftcmds.commands.length; i++) {
                    if (this.undoActions[ftcmds.commands[i].type]) {
                        this.undoActions[ftcmds.commands[i].type](
                            target,
                            ftcmds.commands[i],
                            zoom
                        );
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
                if (this.redoActions[ftcmds.commands[i].type]) {
                    this.redoActions[ftcmds.commands[i].type](
                        target,
                        ftcmds.commands[i],
                        zoom
                    );
                }
            }
        }
    }

    //TODODOODOD
    reConstruct(type, info, zoom) {
        const x = 0;
        const y = 0;
        let newFeature;
        switch (type) { // I should really improve the placeholder part of introspector here
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
            case 'note':
                newFeature = this.addNote(x, y, false);
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
