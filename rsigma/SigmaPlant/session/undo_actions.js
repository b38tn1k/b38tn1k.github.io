class UndoActions {
    constructor(parent) {
        this.parent = parent;
    }

    newFeature(target, commands) {
        target.delete();
        target.setMode('delete');
        this.preserveStack = true;
    }

    delete_append(target, commands) {}

    delete(target, commands) {
        this.reConstruct(commands.forwards, commands.reverse, zoom);
        this.preserveStack = true;
    }

    move(target, commands) {
        if (target) {
            target.move(commands.reverse[0], commands.reverse[1], false);
            if (target.type == 'zone') {
                this.preserveStack = true;
            }
        }
    }

    addChild(target, commands) {
        if (target) {
            child = this.plants[plant].findID(commands.reverse.id);
            if (child) {
                target.removeChild(child, false);
                child.move(commands.reverse.x, commands.reverse.y, false);
            }
        }
    }

    removeChild(target, commands) {
        if (target) {
            child = this.plants[plant].findID(commands.reverse.id);
            if (child) {
                target.addChild(child, false);
                child.move(commands.reverse.x, commands.reverse.y, false);
            }
        }
    }

    resize(target, commands) {
        if (target) {
            target.resize(commands.reverse[0], commands.reverse[1], false);
        }
    }
}
