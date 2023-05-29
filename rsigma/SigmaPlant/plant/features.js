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
        this.initButtons(20);
        this.dataLabels = {};
        this.initDataLabels(20);
        this.isAnimating = true;
        this.animationValue = 0.0;
        this.animationW = w;
        this.animationH = h;
        this.shouldRender = true;
        this.adoptable = true;
        this.notYetDrawnLabelAndButtons = true;

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
        for (let button of this.buttons) {
            button.update(zoom, this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
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

    handleMousePress() {
        if (mouseButton === LEFT) {
            for (let button of this.buttons) {
                button.checkMouseClick();
            }
            for (let label in this.dataLabels) {
                this.dataLabels[label].checkMouseClick(zoom);
            }
        }
    }
}

class Process extends Feature {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'process'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new PlantDataTextLabel(0, 0, 'PROCESS NAME', buttonSize, openDialog);
        this.dataLabels['id'] = new PlantDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new PlantUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new PlantUIButtonLetterLabel('Input', 0.5, 0, buttonSize, () => this.setMode('i_connect')));
        this.buttons.push(new PlantUIButtonLetterLabel('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect')));
    }

    draw(zoom) {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
    }
}

class Source extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 300, 196, 'source'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new PlantDataTextLabel(0, 0, 'SOURCE NAME', buttonSize, openDialog);
        this.dataLabels['id'] = new PlantDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new PlantUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new PlantUIButtonLetterLabel('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect')));
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

class Sink extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 300, 196, 'sink'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new PlantDataTextLabel(0, 0, 'SINK NAME', buttonSize, openDialog);
        this.dataLabels['id'] = new PlantDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new PlantUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new PlantUIButtonLetterLabel('Input', 0.5, 0, buttonSize, () => this.setMode('i_connect')));
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
        this.buttons.push(new PlantUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new PlantUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new PlantUIButtonResize('Resize', 1, 1, buttonSize, () => this.setMode('resize')));
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new PlantDataTextLabel(0, 0, 'ZONE NAME', buttonSize, openDialog);
        this.dataLabels['id'] = new PlantDataIDLabel(0, 1, this.id, buttonSize, NOP);
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

class Delay extends Feature {
    constructor(x, y, width, height) {
        super(x, y, 196, 196, 'delay'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new PlantDataTextLabel(0, 0, 'DELAY', buttonSize, NOP);
        this.dataLabels['id'] = new PlantDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new PlantUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new PlantUIButtonLetterLabel('Input', 0.5, 0, buttonSize, () => this.setMode('i_connect')));
        this.buttons.push(new PlantUIButtonLetterLabel('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect')));
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
        this.dataLabels['title'] = new PlantDataTextLabel(0, 0, 'SPLIT', buttonSize, NOP);
        this.dataLabels['id'] = new PlantDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move')));
        this.buttons.push(new PlantUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete()));
        this.buttons.push(new PlantUIButtonLetterLabel('Input', 0.5, 0, buttonSize, () => this.setMode('i_connect')));
        this.buttons.push(new PlantUIButtonLetterLabel('Output', 1, 1, buttonSize, () => this.setMode('o_connect')));
        this.buttons.push(new PlantUIButtonLetterLabel('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect')));
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

class Connector extends Feature {
    constructor(x, y, input, output) {
        super(x, y, 0, 0, 'connector'); // Call the parent constructor
        this.isAnimating = false;
        this.type = 'connector';
        this.input = input;
        this.output = output;
        this.source = this.input != null ? this.input : this.output;
        this.sourceType = this.input != null ? 'Input' : 'Output';
        this.anchors = {};
        this.anchors[this.sourceType] = this.source.buttons.find(button => button.label === this.sourceType);
        this.mode = 'idle';
        this.untethered = true;
        this.untetheredClicks = 0;
        this.adoptable = false;
    }

    attach(dest) {
        this.untethered = false;
        this.input ? this.output = dest : this.input = dest;
        let key = this.sourceType == 'Output' ? 'Input' : 'Output';
        this.anchors[key] = dest.buttons.find(button => button.label === key);
    }

    update() {
        this.shouldRender = true;
        if (this.input && this.output) {
            if (this.input.mode == 'delete' || this.output.mode == 'delete') {
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
