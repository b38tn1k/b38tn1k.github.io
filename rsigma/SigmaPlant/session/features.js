const BUTTON_SIZE = 20;

// todo: widgets need to transition out when off screen, back in when onscreen

class Feature extends Introspector {
    constructor(x, y, w = 400, h = 280, type) {
        super();
        this.g = new Geometry(x, y, w, h);
        this.g.clearBDims();
        this.mode = 'idle';
        this.buttons = [];
        this.type = type;
        this.dataLabels = {};
        this.data = {};
        this.data['id'] = getUnsecureHash();
        this.data['newtag'] = [];
        this.isAnimating = true;
        this.doAnimations = true;
        this.animationValue = 0.0;
        this.adoptable = true;
        this.notYetDrawnLabelAndButtons = true;
        this.caller = null;
        this.modelData = {};
        this.initButtons(BUTTON_SIZE);
        this.initDataLabels(BUTTON_SIZE);
        this.changed = true;
        this.command = {};
        this.widgets = [];
    }

    initDataLabels(buttonSize) {}
    initButtons(buttonSize) {}
    draw(zoom, cnv) {}

    delete() {
        this.buttons = null;
        this.dataLabels = null;
        this.deleteWidgets();
    }

    setMode(mode) {
        this.mode = mode;
    }

    turnOffAnimations() {
        this.doAnimations = false;
        this.animationValue = 1;
        this.g.bDims.h = this.g.aDims.h;
        this.g.bDims.w = this.g.aDims.w;
    }

    addTags(tags) {
        for (let widget of this.widgets) {
            if (widget.tags) {
                for (let tag of tags) {
                    widget.addTag(tag);
                }
            }
        }
    }

    moveToMouse() {
        let mob = screenToBoard(mouseX, mouseY);
        this.move(mob.x - 2, mob.y - 2); // could be board dims on 2 but i dont trust I implemented it
    }

    packCommand(record, d, f, r) {
        if (!r) {
            r = f;
        }
        if (record) {
            if (Object.keys(this.command).length === 0) {
                this.command = {
                    id: this.data['id'],
                    commands: [{ type: d, forwards: f, reverse: r }]
                };
            } else {
                // Check if a command with type 'd' already exists
                const existingCommandIndex = this.command.commands.findIndex(
                    (cmd) => cmd.type === d
                );

                if (existingCommandIndex !== -1) {
                    // Update the existing command with new forwards value
                    this.command.commands[existingCommandIndex].forwards = f;
                } else {
                    // Create a new command with type, forwards, and reverse
                    const newCommand = { type: d, forwards: f, reverse: r };
                    this.command.commands.push(newCommand);
                }
            }
        }
        // console.info('SOCKET UPDATE:', this.data.id, d, r, f);
    }

    move(x, y, record = true) {
        this.g.bCartOld.x = this.g.bCart.x;
        this.g.bCartOld.y = this.g.bCart.y;
        this.g.bCart.x = x;
        this.g.bCart.y = y;
        if (record) {
            this.packCommand(
                record,
                'move',
                [x, y],
                [this.g.bCartOld.x, this.g.bCartOld.y]
            );
        }
    }

    resizeToMouse() {
        let mob = screenToBoard(mouseX, mouseY);
        let pWidth = mob.x - this.g.bCart.x;
        let pHeight = mob.y - this.g.bCart.y;
        this.resize(pWidth, pHeight);
    }

    resize(w, h, record = true) {
        const oldw = this.g.bDims.w;
        const oldh = this.g.bDims.h;
        if (w > 50 && h > 50) {
            this.g.bDims.w = w;
            this.g.bDims.h = h;
            this.packCommand(record, 'resize', [w, h], [oldw, oldh]);
        }
        this.g.aDims.w = this.g.bDims.w;
        this.g.aDims.h = this.g.bDims.h;
    }

    updateButtonsAndLabels(zoom) {
        this.buttons = this.buttons.filter(
            (button) => button.mode !== 'delete'
        );
        for (let button of this.buttons) {
            button.update(zoom, this.g);
        }
        for (let label in this.dataLabels) {
            this.dataLabels[label].update(zoom, this.g);
            if (this.dataLabels[label].mode == 'busy') {
                this.mode = this.dataLabels[label].mode;
            } else if (this.dataLabels[label].mode == 'cleared') {
                this.dataLabels[label].mode = 'idle';
                this.mode = 'idle';
            }
            if (this.dataLabels[label].changed == true) {
                this.changed = true;
                this.dataLabels[label].changed = false;
            }
        }
        if (this.dataLabels['title']) {
            this.data['title'] = this.dataLabels['title'].data['data'];
        }
    }

    drawButtonsAndLabels(
        zoom,
        cnv,
        myStrokeColor = getColor('outline'),
        myFillColor = getColor('secondary')
    ) {
        if (this.notYetDrawnLabelAndButtons) {
            if (this.mode == 'deleting') {
                zoom = this.animationValue;
            }
            if (this.mode != 'delete') {
                // Draw buttons
                for (let button of this.buttons) {
                    // Convert button position to screen coordinates
                    button.display(zoom, cnv, myStrokeColor, myFillColor);
                }
                // Draw data labels
                for (let label in this.dataLabels) {
                    this.dataLabels[label].display(
                        zoom,
                        cnv,
                        myStrokeColor,
                        myFillColor
                    );
                }
            }
        }
        this.notYetDrawnLabelAndButtons = false;
    }

    update(zoom) {
        // this.changed = false;
        this.g.update(zoom);
        if (this.g.isOnScreen) {
            this.updateButtonsAndLabels(zoom);
            this.checkModeAndAct();
            for (let widget of this.widgets) {
                if (widget) {
                    widget.update(zoom);
                }
            }
        }
    }

    transitionWidgetsIn() {
        for (let widget of this.widgets) {
            if (widget) {
                widget.transitionIn();
            }
        }
    }

    transitionWidgetsOut() {
        for (let widget of this.widgets) {
            if (widget) {
                widget.transitionOut();
            }
        }
    }

    setupWidgets() {
        for (let widget of this.widgets) {
            if (widget) {
                widget.setup();
            }
        }
    }

    displayWidgets(zoom, cnv) {
        for (let widget of this.widgets) {
            if (widget) {
                widget.display(zoom, cnv);
            }
        }
    }

    widgetMousePressHandler() {
        for (let widget of this.widgets) {
            if (widget) {
                widget.handleMousePress();
            }
        }
    }

    deleteWidgets() {
        for (let i = 0; i < this.widgets.length; i++) {
            if (this.widgets[i]) {
                this.widgets[i].delete();
                this.widgets[i] = null;
            }
        }
    }

    exitMove() {
        if (mouseIsPressed == false) {
            this.setMode('idle');
            this.changed = true;
        }
    }

    exitResize() {
        if (mouseIsPressed == false) {
            this.setMode('idle');
            this.changed = true;
            this.g.aDims.w = this.g.bDims.w;
            this.g.aDims.h = this.g.bDims.h;
        }
    }

    checkModeAndAct() {
        switch (this.mode) {
            case 'move':
                this.exitMove();
                break;
            case 'auto':
                this.exitMove();
                break;
            case 'resize':
                this.exitResize();
                break;
            case 'idle':
                // this.command = {};
                break;
        }
    }

    startDelete() {
        if (this.mode !== 'deleting') {
            const ds = this.selfDescribe();
            this.packCommand(true, 'delete', this.type, ds);
            this.setMode('deleting');
            this.doAnimations = true;
            this.isAnimating = true;
            this.deleteWidgets();
            this.buttons = [];
            this.dataLabels = {};
        }
    }

    display(zoom, cnv) {
        if (this.isAnimating && this.doAnimations) {
            fpsEvent();
            const baseIncrement = 0.07;
            const desiredFrameRate = highFrameRate;
            const currentFrameRate = frameRate();
            const increment =
                baseIncrement * (desiredFrameRate / currentFrameRate);
            if (this.mode == 'deleting') {
                this.animationValue -= increment;
            } else {
                this.animationValue += increment;
            }
            this.g.bDims.h = this.g.aDims.h * this.animationValue;
            this.g.bDims.w = this.g.aDims.w * this.animationValue;
            if (this.animationValue >= 1.0 && this.mode != 'deleting') {
                this.isAnimating = false;
                this.g.bDims.h = this.g.aDims.h;
                this.g.bDims.w = this.g.aDims.w;
            }
            if (this.animationValue <= 0.0 && this.mode == 'deleting') {
                this.g.bDims.h = this.g.aDims.h;
                this.g.bDims.w = this.g.aDims.w;
                this.mode = 'delete';
            }
        }

        if (this.g.isOnScreen == true) {
            this.notYetDrawnLabelAndButtons = true;
            this.draw(zoom, cnv);
            this.drawButtonsAndLabels(zoom, cnv);
            this.displayWidgets(zoom, cnv);
        }
    }

    widgetScreenLogic() {
        for (let w of this.widgets){
            if (w) {
                w.doScreenLogic();
            }
        }
    }

    handleMousePress(zoom) {
        if (this.g.isOnScreen == true) {
            for (let button of this.buttons) {
                const res = button.mouseClickActionHandler(zoom);
                if (res) {
                    this.caller = button;
                }
            }
            for (let label in this.dataLabels) {
                this.dataLabels[label].mouseClickActionHandler(zoom);
            }
            this.widgetMousePressHandler();
        }
    }
}

