const HTML_VERT_OFF = -2;

//todo, a lot of the tag stuff can/should be html

class Widget extends WidgetFrame {
/**
* @description This function constructs a new object of a class, setting its "active" 
* property to false, and its "key" property to the given "key" argument. It also 
* sets the value of the parent object's "data" property at the given "key" to an 
* empty JSON string.
* 
* @param parent - The `parent` input parameter is used to pass the parent widget to 
* the constructor.
* 
* @param { string } key - SETS THE PROPERTY OF THE OBJECT TO THE GIVEN VALUE
* 
* @param { string } [fill='full'] - The `fill` input parameter in the `constructor` 
* function determines the initial content of the text element.
*/
    constructor(parent, key, fill = 'full') {
        super(parent, fill);
        this.active = false;
        this.key = key;
        if (!this.parent.data[this.key]) {
            this.parent.data[this.key] = ''; // using JSON strings
        }
        this.placeholder;
        this.textSize = 3 * myTextSize;
        this.dynamicTextSizeThresholds = [1500, 750];
    }
/**
* @description The function `getData()` retrieves a specific piece of data from the 
* parent object's data array using the key provided.
* 
* @returns { object } - The output returned by the `getData()` function is the value 
* of the `data` property of the parent object, indexed by the `key` property of the 
* current object.
*/
    get data() {
        return this.parent.data[this.key];
    }

/**
* @description The function sets the value of the parent object's data property with 
* the specified key to the given value.
* 
* @param { any } value - The `value` input parameter sets the value of the data 
* property for the specified key in the parent object.
*/
    set data(value) {
        this.parent.data[this.key] = value;
    }

/**
* @description The function `hasDelta(oldData)` checks if the current data is different 
* from the previous data by comparing both using the `!=` operator.
* 
* @param { object } oldData - The `oldData` input parameter is used to compare the 
* current state of the data with the previous state.
* 
* @returns { boolean } - The output returned by this function is a boolean value, 
* indicating whether the "oldData" and "this.data" are different.
*/
    hasDelta(oldData) {
        return oldData != this.data;
    }

/**
* @description The function toggleShow() displays the input field and sets the 
* inputUpdate flag to true.
*/
    toggleShow() {
        this.input.show();
        this.inputUpdate = true;
    }

/**
* @description The toggleHide() function hides the input and sets the inputUpdate 
* flag to true.
*/
    toggleHide() {
        this.input.hide();
        this.inputUpdate = true;
    }

/**
* @description The function packParentCommand() takes an object's old data and current 
* data and updates the parent command if there is a delta between the two.
*/
    packParentCommand() {
        let oldData = this.oldData ? this.oldData : this.placeholder;
        if (this.hasDelta(oldData)) {
            this.parent.packCommand(
                true,
                'update_data',
                JSON.stringify({ key: this.key, data: this.data }),
                JSON.stringify({ key: this.key, data: oldData })
            );
        }
    }

/**
* @description The function sets the value of the data attribute to the value of the 
* input element and sets the inputUpdate flag to true.
*/
    inputEventHandler() {
        this.data = this.input.value();
        this.inputUpdate = true;
    }

/**
* @description The function `update(zoom)` updates the size of the text within the 
* component based on the given zoom level, and also updates the HTML of the component.
* 
* @param { number } zoom - The `zoom` input parameter in the `update()` function 
* updates the size of the text dynamically.
*/
    update(zoom) {
        super.update(zoom);
        if (this.inputUpdate) {
            this.dynamicallySizeText();
        }
        this.updateHTML(zoom);
    }

/**
* @description The function `calculateTextVolume()` calculates the text volume based 
* on the `b_volume` attribute of the `frame` object and the length of the `data` 
* array, plus 5.
* 
* @returns { number } - The output returned by the function `calculateTextVolume()` 
* is the volume of the text, calculated as the ratio of the background volume 
* (`b_volume`) to the sum of the text length (`data.length`) and a fixed value of 5.
*/
    calculateTextVolume() {
        return this.frame.b_volume / (this.data.length + 5);
    }

/**
* @description dynamicallySizeText(): Adjusts the text size based on the available 
* space.
*/
    dynamicallySizeText() {
    }

/**
* @description The function doHTMLUpdate(zoom) updates the input element's position, 
* size, and font size based on the provided zoom value.
* 
* @param zoom - The `zoom` input parameter adjusts the size of the text in the HTML 
* element.
*/
    doHTMLUpdate(zoom) {
        this.input.position(this.frame.x_min, this.frame.y_min + HTML_VERT_OFF);
        this.input.size(this.frame.x_delta, this.frame.y_delta);
        this.input.style('font-size', String(this.textSize * zoom) + 'px');
    }

/**
* @description The function updateHTML(zoom) updates the HTML content of the element 
* if the doUpdate flag is set and the input is present.
* 
* @param { number } zoom - The `zoom` input parameter calls the `doHTMLUpdate()` 
* function within the `updateHTML()` function.
*/
    updateHTML(zoom) {
        if (this.doUpdate && this.input) {
            this.doHTMLUpdate(zoom);
        }
    }

/**
* @description The function `update(zoom)` updates the size of the text based on the 
* given zoom level, and then updates the HTML content.
* 
* @param { number } zoom - The `zoom` input parameter updates the text size of the 
* component.
*/
    update(zoom) {
        super.update(zoom);
        if (this.inputUpdate) {
            this.dynamicallySizeText();
        }
        this.updateHTML(zoom);
    }

/**
* @description The `delete()` function sets the `parent` property to `null` and 
* removes the `input` element, if present.
*/
    delete() {
        this.parent = null;
        if (this.input) {
            this.input.remove();
        }
    }

/**
* @description This function transitions the input element to a shown state.
*/
    transitionIn() {
        if (this.input) {
            this.input.show();
        }
    }

/**
* @description The transitionOut() function hides the input element if it exists.
*/
    transitionOut() {
        if (this.input) {
            this.input.hide();
        }
    }

/**
* @description The function attachMouseOverToInput() attaches mouse over and mouse 
* out events to an input element.
*/
    attachMouseOverToInput() {
        this.input.isMouseOver = false;
        this.input.mouseOver(() => {
            this.input.isMouseOver = true;
        });

        this.input.mouseOut(() => {
            this.input.isMouseOver = false;
        });
    }

/**
* @description This function sets up the input field by attaching a mouseover event 
* to it and setting its initial value based on the data or placeholder properties.
*/
    setup() {
        if (!this.input) {
            this.setupInput();
        }
        this.attachMouseOverToInput();
        if (this.data != this.placeholder) {
            this.input.value(this.data);
        } else {
            this.input.value('');
        }
        this.inputUpdate = true;
    }

/**
* @description The function setupInput() initializes the input parameters for the program.
*/
    setupInput() {}

/**
* @description This function restyles the input element by setting its color to the 
* accent color.
*/
    restyleActive() {
        this.input.style('color', getColor('accent'));
    }

/**
* @description The function restyleDeActive() sets the color of the input element 
* to the value returned by the getColor('outline') function.
*/
    restyleDeActive() {
        this.input.style('color', getColor('outline'));
    }

/**
* @description The activeAction() function resets the component's style, sets the 
* keyboard focus requirement to true, updates the parent mode to 'busy', and sets 
* the input update flag to true.
*/
    activeAction() {
        this.restyleActive();
        keyboardRequiresFocus = true;
        this.parent.mode = 'busy';
        this.inputUpdate = true;
    }

/**
* @description The function deactiveAction() performs the following actions:
* 
* 	- Restyles the deactive state.
* 	- Sets keyboardRequiresFocus to false.
* 	- Packs the parent command.
* 	- Sets the parent mode to 'idle'.
* 	- Updates the input.
*/
    deactiveAction() {
        this.restyleDeActive();
        keyboardRequiresFocus = false;
        this.packParentCommand();
        this.parent.mode = 'idle';
        this.inputUpdate = true;
    }

/**
* @description The function `checkMouse()` checks if the mouse cursor is within the 
* specified boundaries of the game frame.
* 
* @returns { boolean } - The output returned by the `checkMouse()` function is a 
* boolean value indicating whether the mouse is currently over the game frame.
*/
    checkMouse() {
        // let res = (mouseX > this.frame.x_min && mouseX < this.frame.x_max)
        // if (res) {
        //     res = (mouseY > this.frame.y_min + HTML_VERT_OFF && mouseY < this.frame.y_max)
        // }
        // return res;
        return this.input.isMouseOver;
    }

/**
* @description The function handleMousePress manages the active state of an object 
* and performs two actions, activeAction and deactiveAction, depending on the mouse 
* press event. When the object is active, it checks for mouse presses and if one is 
* detected, it performs the activeAction.
*/
    handleMousePress() {
        let unhand = false;
        if (this.active == true) {
            unhand = true;
        }
        this.active = false;
        if (this.checkMouse()) {
            this.active = true;
            this.activeAction();
            if (unhand == false) {
                this.oldData = this.data;
            }
        }
        if (this.active === false && unhand) {
            this.deactiveAction();
        }
    }

/**
* @description The function display(zoom, cnv) checks if the parent object's mode 
* is not "deleting" and the object is on-screen, then it draws the object.
* 
* @param { number } zoom - The `zoom` input parameter is used to control the scaling 
* of the drawing.
* 
* @param cnv - The `cnv` input parameter is passed as a canvas object to the `draw()` 
* method, which is used to render the element on the canvas.
*/
    display(zoom, cnv) {
        if (!(this.parent.mode == 'deleting') && this.isOnScreen) {
            this.draw(zoom, cnv);
        }
    }

/**
* @description The function `draw()` is called and it does nothing.
*/
    draw() {}
}

