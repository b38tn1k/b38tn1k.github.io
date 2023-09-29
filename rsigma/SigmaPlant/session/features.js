const BUTTON_SIZE = 20;

// todo: widgets need to transition out when off screen, back in when onscreen

class Feature extends Introspector {
/**
* @description The function constructor(x, y, w, h, type) initializes an object with 
* several properties and methods for a graphical user interface element.
* 
* @param { number } x - The `x` input parameter sets the initial position of the 
* widget on the screen.
* 
* @param { number } y - The `y` input parameter in the `constructor` function is 
* used to set the vertical position of the widget.
* 
* @param [w=400] - The `w` input parameter in the function `constructor(x, y, w, h, 
* type)` sets the width of the widget.
* 
* @param [h=280] - The `h` input parameter in the function `constructor` sets the 
* height of the widget.
* 
* @param { string } type - The `type` input parameter in the `constructor` function 
* determines the type of widget to be created.
*/
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

/**
* @description This function initializes data labels for buttons of a specified size.
* 
* @param buttonSize - The `buttonSize` input parameter specifies the size of the 
* buttons to be labeled.
*/
    initDataLabels(buttonSize) {}
/**
* @description The function initButtons(buttonSize) initializes the buttons with the 
* specified size.
* 
* @param { number } buttonSize - The `buttonSize` input parameter specifies the size 
* of the buttons to be initialized.
*/
    initButtons(buttonSize) {}
/**
* @description The function `draw(zoom, cnv)` draws the canvas `cnv` with the specified 
* `zoom` factor.
* 
* @param { number } zoom - The `zoom` input parameter scales the canvas by a factor 
* of its value.
* 
* @param cnv - The `cnv` input parameter is passed as a canvas object to the `draw` 
* function, and it is used as the target canvas for drawing.
*/
    draw(zoom, cnv) {}

/**
* @description The `delete()` function nullifies the `buttons` and `dataLabels` 
* properties, and calls the `deleteWidgets()` method.
*/
    delete() {
        this.buttons = null;
        this.dataLabels = null;
        this.deleteWidgets();
    }

/**
* @description The function sets the value of the "mode" property of the object to 
* the specified "mode".
* 
* @param { string } mode - The `mode` input parameter sets the value of the `mode` 
* property of the object.
*/
    setMode(mode) {
        this.mode = mode;
    }

/**
* @description The `turnOffAnimations()` function sets the `doAnimations` property 
* to `false`, sets the `animationValue` to `1`, and resets the dimensions of the `g` 
* element to the same values as the `a` element.
*/
    turnOffAnimations() {
        this.doAnimations = false;
        this.animationValue = 1;
        this.g.bDims.h = this.g.aDims.h;
        this.g.bDims.w = this.g.aDims.w;
    }

/**
* @description This function adds tags to widgets.
* 
* @param { array } tags - The `tags` input parameter is used to specify the tags 
* that should be added to the widgets.
*/
    addTags(tags) {
        for (let widget of this.widgets) {
            if (widget.tags) {
                for (let tag of tags) {
                    widget.addTag(tag);
                }
            }
        }
    }

/**
* @description The `moveToMouse()` function moves the object to the position of the 
* mouse cursor on the screen, based on the `screenToBoard()` function.
*/
    moveToMouse() {
        let mob = screenToBoard(mouseX, mouseY);
        this.move(mob.x - 2, mob.y - 2); // could be board dims on 2 but i dont trust I implemented it
    }

/**
* @description The function packCommand(record, d, f, r) manages commands for a 
* socket. If a record is provided, it updates the command list with a new command 
* or updates an existing command with new forwards value.
* 
* @param { boolean } record - The `record` input parameter in the `packCommand` 
* function determines whether the command should be recorded in the socket's command 
* history or not.
* 
* @param { string } d - The `d` input parameter in the `packCommand` function 
* determines the type of command being packed.
* 
* @param { string } f - The `f` input parameter in the `packCommand()` function 
* represents the forwards value for the command.
* 
* @param r - The `r` input parameter in the `packCommand` function sets the reverse 
* value of the command.
*/
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

/**
* @description The function `move(x, y, record = true)` updates the position of the 
* cart `g.bCart` to `x` and `y`, and records the previous position in `g.bCartOld`.
* 
* @param { number } x - The `x` input parameter sets the new x-coordinate of the cart.
* 
* @param { number } y - The `y` input parameter in the `move` function sets the new 
* position of the cart.
* 
* @param { boolean } [record=true] - The `record` input parameter determines whether 
* the move command should be recorded in the undo history or not.
*/
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

/**
* @description The `resizeToMouse()` function resizes the game board to fit the mouse 
* cursor's position on the screen.
*/
    resizeToMouse() {
        let mob = screenToBoard(mouseX, mouseY);
        let pWidth = mob.x - this.g.bCart.x;
        let pHeight = mob.y - this.g.bCart.y;
        this.resize(pWidth, pHeight);
    }

/**
* @description The function resize(w, h, record = true) resizes the graphics context's 
* dimensions (bDims.w and bDims.h) to the given width and height, and records the 
* command in the packCommand array if the width and height are greater than 50.
* 
* @param w - The `w` input parameter sets the new width of the graphical representation.
* 
* @param h - The `h` input parameter in the `resize` function sets the new height 
* of the graphic.
* 
* @param { boolean } [record=true] - The `record` input parameter in the `resize` 
* function determines whether the resize operation should be recorded in the game's 
* undo/redo history.
*/
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

/**
* @description The function `updateButtonsAndLabels(zoom)` updates the buttons and 
* labels in the component by filtering out buttons with a mode of 'delete', updating 
* the labels with the new zoom value, and setting the component's mode to the label's 
* mode.
* 
* @param { number } zoom - The `zoom` input parameter updates the buttons and labels 
* based on their current zoom level.
*/
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

/**
* @description The function `drawButtonsAndLabels` draws buttons and data labels on 
* a canvas using the given zoom factor and color palettes.
* 
* @param { number } zoom - The `zoom` input parameter in the `drawButtonsAndLabels` 
* function is used to scale the buttons and labels to the current zoom level of the 
* chart.
* 
* @param cnv - The `cnv` input parameter in the `drawButtonsAndLabels` function is 
* a reference to the canvas element where the buttons and labels will be drawn.
* 
* @param myStrokeColor - The `myStrokeColor` input parameter sets the color of the 
* outline for the buttons and data labels.
* 
* @param myFillColor - The `myFillColor` input parameter sets the fill color for the 
* buttons and data labels.
*/
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

/**
* @description This function updates the widgets and checks the mode and acts 
* accordingly after updating the graphics context.
* 
* @param { number } zoom - The `zoom` input parameter updates the graph's scale.
*/
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

/**
* @description This function transitions all widgets in the widget array into view.
*/
    transitionWidgetsIn() {
        for (let widget of this.widgets) {
            if (widget) {
                widget.transitionIn();
            }
        }
    }

/**
* @description The function transitionWidgetsOut() iterates through a list of widgets 
* and calls the transitionOut() method on each widget if it exists.
*/
    transitionWidgetsOut() {
        for (let widget of this.widgets) {
            if (widget) {
                widget.transitionOut();
            }
        }
    }

/**
* @description This function iterates over an array of widgets and calls the `setup()` 
* method for each widget that exists.
*/
    setupWidgets() {
        for (let widget of this.widgets) {
            if (widget) {
                widget.setup();
            }
        }
    }

/**
* @description Displays widgets.
* 
* @param { number } zoom - The `zoom` input parameter scales the widgets.
* 
* @param cnv - The `cnv` input parameter in the `displayWidgets` function is a canvas 
* object that the function displays the widgets on.
*/
    displayWidgets(zoom, cnv) {
        for (let widget of this.widgets) {
            if (widget) {
                widget.display(zoom, cnv);
            }
        }
    }

/**
* @description This function iterates through an array of widgets and calls the 
* `handleMousePress()` method for each widget if it exists.
*/
    widgetMousePressHandler() {
        for (let widget of this.widgets) {
            if (widget) {
                widget.handleMousePress();
            }
        }
    }

/**
* @description The function deleteWidgets() deletes all widgets in the widget array 
* by calling the delete() method on each widget and setting the widget reference to 
* null.
*/
    deleteWidgets() {
        for (let i = 0; i < this.widgets.length; i++) {
            if (this.widgets[i]) {
                this.widgets[i].delete();
                this.widgets[i] = null;
            }
        }
    }

/**
* @description The function exitMove() sets the mode to 'idle' and updates the changed 
* property to true if the mouse is not pressed.
*/
    exitMove() {
        if (mouseIsPressed == false) {
            this.setMode('idle');
            this.changed = true;
        }
    }

/**
* @description The exitResize() function sets the mode to 'idle' and updates the 
* dimensions of the graphics context (g) to match the size of the background canvas 
* (bDims), while also marking the object as having been changed.
*/
    exitResize() {
        if (mouseIsPressed == false) {
            this.setMode('idle');
            this.changed = true;
            this.g.aDims.w = this.g.bDims.w;
            this.g.aDims.h = this.g.bDims.h;
        }
    }

/**
* @description The function checkModeAndAct() switches the mode of the object and 
* exits the move, auto, or resize function depending on the mode.
*/
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

/**
* @description startDelete() initiates the deletion process by setting the mode to 
* 'deleting', packing a 'delete' command, and animating the deletion of widgets and 
* data labels.
*/
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

/**
* @description The function `display(zoom, cnv)` animates the scaling of an element 
* based on a desired frame rate, updates the position of the element, and draws any 
* labels or buttons associated with it.
* 
* @param { number } zoom - The `zoom` input parameter in the `display()` function 
* is used to scale the graphics and widgets.
* 
* @param cnv - The `cnv` input parameter in the `display` function is the canvas 
* element that the function will operate on.
*/
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

/**
* @description The function widgetScreenLogic() iterates over an array of widgets 
* (w) and invokes the doScreenLogic() method of each widget if it exists and is truthy.
*/
    widgetScreenLogic() {
        for (let w of this.widgets){
            if (w) {
                w.doScreenLogic();
            }
        }
    }

/**
* @description The function handleMousePress(zoom) handles mouse press events for a 
* widget. It first checks if the widget is on screen and then iterates through the 
* widget's buttons and data labels, calling their mouseClickActionHandler(zoom) 
* functions. If any of these functions return true, the function sets the caller 
* variable to the button or data label that returned true.
* 
* @param { number } zoom - The `zoom` input parameter in the `handleMousePress` 
* function is used to determine the current zoom level of the widget.
*/
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

