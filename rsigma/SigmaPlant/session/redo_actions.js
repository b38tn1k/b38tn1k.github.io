class RedoActions {
    constructor(parent) {
        this.parent = parent;
    }

    newFeature(target, commands, zoom) {
        this.parent.reConstruct(commands.forwards, commands.reverse, zoom);
        this.parent.preserveStack = true;
    }

    delete_append(target, commands, zoom) {
        this.delete(target, commands, zoom);
    }

    delete(target, commands, zoom) {
        target.setMode('delete');
        target.delete();
        this.parent.preserveStack = true;
    }

    move(target, commands, zoom) {
        if (target) {
            target.move(commands.forwards[0], commands.forwards[1], false);
            if (target.type == 'zone') {
                this.parent.preserveStack = true;
            }
        }
    }

    addChild(target, commands, zoom) {
        if (target) {
            let child = this.parent.plant.findID(commands.reverse.id);
            if (child) {
                target.addChild(child, false);
            }
        }
    }

    removeChild(target, commands, zoom) {
        if (target) {
            let child = this.parent.plant.findID(commands.reverse.id);
            if (child) {
                target.removeChild(child, false);
            }
        }
    }

    resize(target, commands, zoom) {
        if (target) {
            target.resize(commands.forwards[0], commands.forwards[1], false);
        }
    }
}
