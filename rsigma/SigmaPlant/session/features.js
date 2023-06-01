let BUTTON_SIZE = 20;

class Feature {
    constructor(x, y, w = 400, h = 280, type) {
        this.id = type + '->' + getUnsecureHash()
        this.x = x;
        this.y = y;
        this.width = 0;
        this.height = 0;
        this.mode = 'idle';
        this.buttons = [];
        this.type = type;
        this.initButtons(BUTTON_SIZE);
        this.dataLabels = {};
        this.data = {};
        this.initDataLabels(BUTTON_SIZE);
        this.isAnimating = true;
        this.animationValue = 0.0;
        this.animationW = w;
        this.animationH = h;
        this.shouldRender = true;
        this.adoptable = true;
        this.notYetDrawnLabelAndButtons = true;
        this.caller = null;

    }

    initDataLabels(buttonSize) { }
    initButtons(buttonSize) { }
    draw(zoom) { }

    delete() {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i] = null;
        }
        this.buttons = [];
        for (let label in this.dataLabels) {
            if (this.dataLabels.hasOwnProperty(label)) {
                this.dataLabels[label] = null;
            }
        }
        this.dataLabels = {};
    }

    setMode(mode) {
        this.mode = mode;
    }

    moveToMouse() {
        let mob = screenToBoard(mouseX, mouseY);
        this.x = mob.x;
        this.y = mob.y;
    }

    resizeToMouse() {
        let mob = screenToBoard(mouseX, mouseY);
        let pWidth = mob.x - this.x;
        let pHeight = mob.y - this.y;
        if (pWidth > 50 && pHeight > 50) {
            this.width = pWidth;
            this.height = pHeight;
        }
    }

    updateScreenCoords(zoom) {
        this.screenPos = boardToScreen(this.x, this.y);
        this.onScreenWidth = this.width * zoom;
        this.onScreenHeight = this.height * zoom;
    }

    updateButtonsAndLabels(zoom) {
        this.buttons = this.buttons.filter(button => button.mode !== 'delete');
        for (let button of this.buttons) {
            button.update(zoom, this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
            button.checkMouseOver();
        }
        for (let label in this.dataLabels) {
            this.dataLabels[label].update(zoom, this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
            if (this.dataLabels[label].mode == 'busy') {
                this.mode = this.dataLabels[label].mode;
            } else if (this.dataLabels[label].mode == 'cleared') {
                this.dataLabels[label].mode = 'idle';
                this.mode = 'idle';
            }
        }
    }

    drawButtonsAndLabels(zoom, myStrokeColor = getColor("outline"), myFillColor = getColor("secondary")) {
        if (this.notYetDrawnLabelAndButtons) {
            if (this.mode == 'deleting') {
                zoom = this.animationValue;
            }
            if (this.mode != 'delete') {
                // Draw buttons
                for (let button of this.buttons) {
                    // Convert button position to screen coordinates
                    button.display(zoom, myStrokeColor, myFillColor);
                }
                // Draw data labels
                for (let label in this.dataLabels) {
                    this.dataLabels[label].display(zoom, myStrokeColor, myFillColor);
                }
            }
        }
        this.notYetDrawnLabelAndButtons = false;
    }

    update(zoom) {
        this.shouldRender = this.isInScreen();
        this.updateScreenCoords(zoom);
        this.updateButtonsAndLabels(zoom);
        this.checkModeAndAct();
    }

    checkModeAndAct() {
        switch (this.mode) {
            case 'move':
                if (mouseIsPressed == false) {
                    this.setMode('idle');
                }
                break;
            case 'delete':
                break;
            case 'edit':
                break;
            case 'i_connect':
                break;
            case 'o_connect':
                break;
            case 'resize':
                if (mouseIsPressed == false) {
                    this.setMode('idle');
                }
                break;
        }
    }

    startDelete() {
        this.mode = 'deleting';
        this.isAnimating = true;
    }

    display(zoom) {
        if (this.isAnimating) {
            fpsEvent();
            const baseIncrement = 0.07;
            const desiredFrameRate = highFrameRate;
            const currentFrameRate = frameRate();
            const increment = baseIncrement * (desiredFrameRate / currentFrameRate);
            if (this.mode == 'deleting') {
                this.animationValue -= increment;
            } else {
                this.animationValue += increment;
            }

            this.height = this.animationH * this.animationValue;
            this.width = this.animationW * this.animationValue;
            if (this.animationValue >= 1.0 && this.mode != 'deleting') {
                this.isAnimating = false;
                this.height = this.animationH;
                this.width = this.animationW;
            }
            if (this.animationValue <= 0.0 && this.mode == 'deleting') {
                this.mode = 'delete';
            }
        }

        if (this.shouldRender == true) {
            this.notYetDrawnLabelAndButtons = true;
            this.draw(zoom);
            this.drawButtonsAndLabels(zoom);
        }
    }

    isInScreen() {
        let screenTopLeft = screenToBoard(0, 0);
        let screenBottomRight = screenToBoard(windowWidth, windowHeight);

        return this.x < screenBottomRight.x &&
            this.x + this.width > screenTopLeft.x &&
            this.y < screenBottomRight.y &&
            this.y + this.height > screenTopLeft.y;
    }

    handleMousePress(zoom) {

        for (let button of this.buttons) {
            const res = button.checkMouseClick(zoom);
            if (res) {
                this.caller = button;
            }
        }
        for (let label in this.dataLabels) {
            this.dataLabels[label].checkMouseClick(zoom);
        }

    }
}

class Process extends Feature {
    constructor(x, y, width, height, plant, targetPlant) {
        super(x, y, width, height, 'process'); // Call the parent constructor
        this.plant = plant;
        this.targetPlant = targetPlant
        this.buses = {}
        this.buses = {
            'source': new Set(),
            'sink': new Set()
        };
        this.setupFromSubProcess();
    }

    collectBuses() {
        let inputIndices = this.plant.features
            .map((feature, index) => feature.type == 'source' ? index : null)
            .filter(index => index !== null);
        this.buses['source'] = new Set(inputIndices);

        let outputIndices = this.plant.features
            .map((feature, index) => feature.type == 'sink' ? index : null)
            .filter(index => index !== null);
        this.buses['sink'] = new Set(outputIndices);
    }

    setupIOButtons(buttonSize = BUTTON_SIZE) {
        // Determine the number of source and sink buses
        const numSourceBuses = this.buses['source'].size;
        const numSinkBuses = this.buses['sink'].size;

        // Get all the valid source and sink ids from plant features
        let validSourceIds = Array.from(this.buses['source']).map(index => this.plant.features[index].id);
        let validSinkIds = Array.from(this.buses['sink']).map(index => this.plant.features[index].id);


        // remove any hanging buttons
        this.buttons = this.buttons.filter(button => {
            if (button instanceof FeatureUIInputLabel && !validSourceIds.includes(button.targetID)) {
                button.mode = 'delete';
                // return false;

            } else if (button instanceof FeatureUIOutputLabel && !validSinkIds.includes(button.targetID)) {
                button.mode = 'delete';
                // return false;
            }
            return true;
        });

        // Calculate the increment for each button based on the number of buttons and the range 0.2 to 0.8
        const xIncrementSource = numSourceBuses > 1 ? (0.8 - 0.2) / (numSourceBuses - 1) : 0;
        const xIncrementSink = numSinkBuses > 1 ? (0.8 - 0.2) / (numSinkBuses - 1) : 0;

        // For each source bus, create an input button
        let xSource = 0.2; // Start at the minimum x value
        for (let index of this.buses['source']) {
            let sourceId = this.plant.features[index].id;
            console.log(this.plant.features[index].dataLabels['title'].data);
            // Check if a button with the same targetID already exists
            let existingButton = this.buttons.find(button => button.targetID === sourceId);
            let mouseOverData = this.plant.features[index].dataLabels['title'].data;
            if (!existingButton) {
                // If no such button exists, create a new one
                let b = new FeatureUIInputLabel('Input', xSource, 0, buttonSize, () => this.setMode('i_connect'));
                b.targetID = sourceId;
                b.doCheckMouseOver = true;
                b.mouseOverData = mouseOverData;
                this.buttons.push(b);
            } else {
                existingButton.mouseOverData = mouseOverData;
            }
            xSource += xIncrementSource;
        }
        // For each sink bus, create an output button
        let xSink = 0.2; // Start at the minimum x value
        for (let index of this.buses['sink']) {
            let sinkId = this.plant.features[index].id;
            let existingButton = this.buttons.find(button => button.targetID === sinkId);
            let mouseOverData = this.plant.features[index].dataLabels['title'].data;
            if (!existingButton) {
                // If no such button exists, create a new one
                let b = new FeatureUIOutputLabel('Output', xSink, 1, buttonSize, () => this.setMode('o_connect'));
                b.targetID = sinkId;
                b.doCheckMouseOver = true;
                b.mouseOverData = mouseOverData;
                this.buttons.push(b);
                xSink += xIncrementSink;
            } else {
                existingButton.mouseOverData = mouseOverData;
            }
        }
    }

    setupFromSubProcess() {
        this.collectBuses();
        this.setupIOButtons();
    }


    update(zoom) {
        super.update(zoom);
        if (this.mode == 'deleting' || this.mode == 'delete') {
            this.plant = null;
        } else {
            this.plant.update(zoom);
        }
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FeatureDataTextLabel(0, 0.15, 'PROCESS', buttonSize, openDialog);
        this.dataLabels['id'] = new FeatureDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new FeatureUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new FeatureUIButtonResize('Resize', 1, 1, buttonSize, () => this.setMode('resize')));
        this.buttons.push(new FeatureUIButtonLetterLabel('Edit', 1, 0.5, buttonSize, () => this.transitionPlant()));

    }

    transitionPlant() {
        this.mode = 'transition_plant';
    }

    draw(zoom) {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
    }
}

class Source extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 196, 196, 'source'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FeatureDataTextLabel(0, 0.15, 'SOURCE', buttonSize, openDialog);
        this.dataLabels['id'] = new FeatureDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new FeatureUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new FeatureUIOutputLabel('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect')));
    }

    draw(zoom) {
        fill(getColor("secondary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);

        fill(getColor("primary"));
        noStroke();
        // Calculate the center of the rectangle
        const centerX = this.screenPos.x + this.onScreenWidth / 2;
        const centerY = this.screenPos.y + this.onScreenHeight / 2;

        // Draw the ellipse
        ellipse(centerX, centerY, this.onScreenWidth, this.onScreenHeight);

    }

}

class ParentLink extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 98, 98, 'parentLink'); // Call the parent constructor
        this.targetPlant = null;
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FeatureDataTextLabelTrigger(0, 0.3, 'PARENT', buttonSize, () => this.transitionPlant()); // bad, fix with a mode
    }

    initButtons(buttonSize) {
        this.buttons.push(new FeatureUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
    }

    draw(zoom) {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
    }

    transitionPlant() {
        this.mode = 'transition_plant';
    }
}

class Sink extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 196, 196, 'sink'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FeatureDataTextLabel(0, 0.15, 'SINK', buttonSize, openDialog);
        this.dataLabels['id'] = new FeatureDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new FeatureUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new FeatureUIOutputLabel('Input', 0.5, 0, buttonSize, () => this.setMode('i_connect')));
    }

    draw(zoom) {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);

        fill(getColor("secondary"));
        noStroke();// Calculate the center of the rectangle
        const centerX = this.screenPos.x + this.onScreenWidth / 2;
        const centerY = this.screenPos.y + this.onScreenHeight / 2;

        // Draw the ellipse
        ellipse(centerX, centerY, this.onScreenWidth, this.onScreenHeight);
    }
}

class Zone extends Feature {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'zone'); // Call the parent constructor
        this.type = 'zone';
        this.children = [];
    }

    initButtons(buttonSize) {
        this.buttons.push(new FeatureUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new FeatureUIButtonResize('Resize', 1, 1, buttonSize, () => this.setMode('resize')));
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FeatureDataTextLabel(0, 0.15, 'ZONE', buttonSize, openDialog);
        this.dataLabels['id'] = new FeatureDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    draw(zoom) {
        noFill();
        stroke(getColor("accent"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
        this.notYetDrawnLabelAndButtons = true;
        this.drawButtonsAndLabels(zoom, getColor("accent"));
    }

    checkIfChild(feature) {
        // The feature is considered to be in the zone if its x and y positions are within the zone's width and height.
        // This assumes x and y are the top left coordinates and the feature's size is negligible or already accounted for.
        return (feature.x >= this.x && feature.x <= this.x + this.width) &&
            (feature.y >= this.y && feature.y <= this.y + this.height) && feature.id != this.id;
    }

    addChild(feature) {
        this.children.push(feature);
    }

    emptyChildren() {
        this.children = [];
    }
}

class Sigma extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 196, 196, 'sigma'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FeatureDataTextLabel(0, 0.15, 'Sigma', buttonSize, NOP);
        this.dataLabels['id'] = new FeatureDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new FeatureUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new FeatureUIInputLabel('Input', 0.5, 0, buttonSize, () => this.setMode('i_connect')));
        this.buttons.push(new FeatureUIOutputLabel('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect')));
    }

    draw(zoom) {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);

        fill(getColor("secondary"));
        noStroke();// Calculate the center of the rectangle
        // Calculate the center of the rectangle
        const centerX = this.screenPos.x + this.onScreenWidth / 2;
        const centerY = this.screenPos.y + this.onScreenHeight / 2;

        // Calculate dimensions for the hourglass
        const top = this.screenPos.y;
        const bottom = this.screenPos.y + this.onScreenHeight;
        const left = this.screenPos.x;
        const right = this.screenPos.x + this.onScreenWidth;

        // Draw the top triangle
        triangle(centerX, centerY, left, top, right, top);

        // Draw the bottom triangle
        triangle(centerX, centerY, left, bottom, right, bottom);
    }
}

class Split extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 196, 196, 'split'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FeatureDataTextLabel(0, 0.15, 'SPLIT', buttonSize, NOP);
        this.dataLabels['id'] = new FeatureDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new FeatureUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new FeatureUIInputLabel('Input', 0.5, 0, buttonSize, () => this.setMode('i_connect')));
        this.buttons.push(new FeatureUIOutputLabel('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect')));
        this.buttons.push(new FeatureUIOutputLabel('Output', 1, 1, buttonSize, () => this.setMode('o_connect')));
    }

    draw(zoom) {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);

        fill(getColor("secondary"));
        noStroke();// Calculate the center of the rectangle
        // Calculate the center of the rectangle
        const centerX = this.screenPos.x + this.onScreenWidth / 2;
        const centerY = this.screenPos.y + this.onScreenHeight / 2;

        // Calculate dimensions for the hourglass
        const top = this.screenPos.y;
        const bottom = this.screenPos.y + this.onScreenHeight;
        const left = this.screenPos.x;
        const right = this.screenPos.x + this.onScreenWidth;

        // Draw the top triangle
        triangle(centerX, top, left, centerY, right, centerY);

        // Draw the bottom triangle
        triangle(centerX, bottom, left, centerY, right, centerY);
    }
}

class Merge extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 196, 196, 'merge'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new FeatureDataTextLabel(0, 0.15, 'MERGE', buttonSize, NOP);
        this.dataLabels['id'] = new FeatureDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new FeatureUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new FeatureUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new FeatureUIInputLabel('Input', 0.3, 0, buttonSize, () => this.setMode('i_connect')));
        this.buttons.push(new FeatureUIOutputLabel('Input', 0.6, 0, buttonSize, () => this.setMode('i_connect')));
        this.buttons.push(new FeatureUIOutputLabel('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect')));
    }

    draw(zoom) {
        fill(getColor("secondary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);

        fill(getColor("primary"));
        noStroke();// Calculate the center of the rectangle
        // Calculate the center of the rectangle
        const centerX = this.screenPos.x + this.onScreenWidth / 2;
        const centerY = this.screenPos.y + this.onScreenHeight / 2;

        // Calculate dimensions for the hourglass
        const top = this.screenPos.y;
        const bottom = this.screenPos.y + this.onScreenHeight;
        const left = this.screenPos.x;
        const right = this.screenPos.x + this.onScreenWidth;

        // Draw the top triangle
        triangle(centerX, top, left, centerY, right, centerY);

        // Draw the bottom triangle
        triangle(centerX, bottom, left, centerY, right, centerY);
    }
}

class Connector extends Feature {
    constructor(x, y, input, output) {
        super(x, y, 0, 0, 'connector'); // Call the parent constructor
        this.isAnimating = false;
        this.type = 'connector';
        this.input = input;
        this.output = output;
        this.anchors = {};
        this.untethered = true;
        if (this.input && this.output) {
            this.untethered = false;
            let inputAnchor = input.buttons.find(button => button.label === 'Input');
            this.anchors['Input'] = inputAnchor;
            let outputAnchor = output.buttons.find(button => button.label === 'Output');
            this.anchors['Output'] = outputAnchor;
        } else {
            this.source = this.input != null ? this.input : this.output;
            this.sourceType = this.input != null ? 'Input' : 'Output';
            this.anchors[this.sourceType] = this.source.caller; //buttons.find(button => button.label === this.sourceType);
        }
        this.mode = 'idle';
        this.untetheredClicks = 0;
        this.adoptable = false;
    }

    attach(dest) {
        this.untethered = false;
        this.input ? this.output = dest : this.input = dest;
        let key = this.sourceType == 'Output' ? 'Input' : 'Output';
        this.anchors[key] = dest.caller; //dest.buttons.find(button => button.id === key);
    }

    update() {
        this.shouldRender = true;
        if (this.input && this.output) {
            if (this.input.mode == 'delete' || this.output.mode == 'delete' || this.anchors['Input'].mode == 'delete' || this.anchors['Output'].mode == 'delete') {
                this.mode = 'delete';
            }
        } else {
            this.untethered = true;
            if (this.source.mode == 'delete') {
                this.mode = 'delete';
            }
        }
    }

    draw(zoom) {
        noFill();
        stroke(getColor("connector"));
        if (this.untethered == false) {
            line(this.anchors['Input'].screen.x + this.anchors['Input'].screenDimOn2, this.anchors['Input'].screen.y, this.anchors['Output'].screen.x + this.anchors['Output'].screenDimOn2, this.anchors['Output'].screen.y + this.anchors['Output'].screenDim);
        } else {
            for (let anchor in this.anchors) {
                if (anchor == "Input") {
                    line(this.anchors['Input'].screen.x + this.anchors['Input'].screenDimOn2, this.anchors['Input'].screen.y, mouseX, mouseY);
                } else {
                    line(mouseX, mouseY, this.anchors['Output'].screen.x + this.anchors['Output'].screenDimOn2, this.anchors['Output'].screen.y + this.anchors['Output'].screenDim);
                }
            }
        }
    }
}
