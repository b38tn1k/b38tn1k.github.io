class UndoActions {
    constructor(parent) {
        this.parent = parent;
    }

    newFeature(target, commands, zoom) {
        target.delete();
        target.setMode('delete');
        this.parent.preserveStack = true;
    }

    delete_append(target, commands, zoom) {
        this.delete(target, commands, zoom);
    }

    update_data(target, commands, zoom) {
        const reverse = JSON.parse(commands.reverse);
        target.data[reverse.key] = reverse.data;
        let widget = target.widgets.find(w => w.key === reverse.key);
        if (widget) {
            widget.setup();
        }
    }

    delete(target, commands, zoom) {
        this.parent.reConstruct(commands.forwards, commands.reverse, zoom);
        this.parent.preserveStack = true;
    }

    move(target, commands, zoom) {
        if (target) {
            target.move(commands.reverse[0], commands.reverse[1], false);
            if (target.type == 'zone') {
                this.parent.preserveStack = true;
            }
        }
    }

    addChild(target, commands, zoom) {
        if (target) {
            let child = this.parent.plant.findID(commands.reverse.id);
            if (child) {
                target.removeChild(child, false);
                child.move(commands.reverse.x, commands.reverse.y, false);
            }
        }
    }

    removeChild(target, commands, zoom) {
        if (target) {
            let child = this.parent.plant.findID(commands.reverse.id);
            if (child) {
                target.addChild(child, false);
                child.move(commands.reverse.x, commands.reverse.y, false);
            }
        }
    }

    resize(target, commands, zoom) {
        if (target) {
            target.resize(commands.reverse[0], commands.reverse[1], false);
        }
    }
}
