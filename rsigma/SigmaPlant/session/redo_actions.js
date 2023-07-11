class RedoActions {
    constructor(parent) {
        this.parent = parent;
    }

    newFeature(target, commands) {
        this.parent.reConstruct(commands.forwards, commands.reverse, zoom);
        this.parent.preserveStack = true;
    }

    delete_append(target) {
        this.delete(target);
    }

    delete(target) {
        target.setMode('delete');
        target.delete(target, commands);
        this.parent.preserveStack = true;
    }

    move(target, commands) {
        if (target) {
            target.move(commands.forwards[0], commands.forwards[1], false);
            if (target.type == 'zone') {
                this.parent.preserveStack = true;
            }
        }
    }

    addChild(target, commands) {
        if (target) {
            child = this.parent.plants[plant].findID(commands.reverse.id);
            if (child) {
                target.addChild(child, false);
            }
        }
    }

    removeChild(target, commands) {
        if (target) {
            child = this.parent.plants[plant].findID(commands.reverse.id);
            if (child) {
                target.removeChild(child, false);
            }
        }
    }

    resize(target, commands) {
        if (target) {
            target.resize(commands.forwards[0], commands.forwards[1], false);
        }
    }
}
