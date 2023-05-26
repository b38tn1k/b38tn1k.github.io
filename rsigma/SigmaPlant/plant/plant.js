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

class Station extends Feature {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'station'); // Call the parent constructor
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new PlantDataTextLabel(0, 0, 'STATION NAME', buttonSize, openDialog);
        this.dataLabels['id'] = new PlantDataIDLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new PlantUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete())); // top right
        this.buttons.push(new PlantUIButtonLetterLabel('Input', 0.5, 0, buttonSize, () => this.setMode('i_connect'))); // top center
        this.buttons.push(new PlantUIButtonLetterLabel('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect'))); // bottom center
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
        this.buttons.push(new PlantUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new PlantUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete())); // top right
        this.buttons.push(new PlantUIButtonLetterLabel('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect'))); // bottom center
    }

    draw(zoom) {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
    
        // Draw triangle
        fill(getColor("secondary")); // Set the fill color for the triangle
        noStroke(); // Remove stroke for the triangle
        const centerX = this.screenPos.x + this.onScreenWidth / 2;
        const baseY = this.screenPos.y;
        triangle(centerX, this.screenPos.y + this.onScreenHeight, this.screenPos.x, baseY, this.screenPos.x + this.onScreenWidth, baseY);
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
        this.buttons.push(new PlantUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new PlantUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete())); // top right
        this.buttons.push(new PlantUIButtonLetterLabel('Input', 0.5, 0, buttonSize, () => this.setMode('i_connect'))); // top center
    }

    draw(zoom) {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
    
        // Draw triangle
        fill(getColor("secondary")); // Set the fill color for the triangle
        noStroke(); // Remove stroke for the triangle
        const centerX = this.screenPos.x + this.onScreenWidth / 2;
        const baseY = this.screenPos.y + this.onScreenHeight;
        triangle(centerX, this.screenPos.y, this.screenPos.x, baseY, this.screenPos.x + this.onScreenWidth, baseY);
    }
    
}

class Zone extends Feature {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'zone' ); // Call the parent constructor
        this.type = 'zone';
        this.children = [];
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButtonMove('Move', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new PlantUIButtonClose('Xdelete', 1, 0, buttonSize, () => this.startDelete())); // top right
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

class Connector extends Feature {
    constructor(x, y, input, output) {
        super(x, y, 0, 0, 'connector' ); // Call the parent constructor
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

class Plant {
    constructor() {
        this.features = [];
        this.mode = null; // to capture non-null modes
        this.isActive = false;
    }

    addStation(x, y) {
        this.features.push(new Station(x, y));
    }

    addSink(x, y) {
        this.features.push(new Sink(x, y));
    }

    addSource(x, y) {
        this.features.push(new Source(x, y));
    }

    addZone(x, y) {
        this.features.push(new Zone(x, y));
    }

    addConnector(x, y, input, output) {
        this.features.push(new Connector(x, y, input, output));
    }

    handleMousePress() {
        this.clearHangingConnector();
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].handleMousePress();
        }
    }

    isHangingConnector(type) {
        let hangingConnector = null;
        let alreadyUntethered = false;
        for (let feature of this.features) {
            if (feature.type == 'connector') {
                if (feature.untethered == true) {
                    alreadyUntethered = true;
                    if (feature.sourceType == type) {
                        hangingConnector = feature;   
                    }
                }
            }
        }
        return [alreadyUntethered, hangingConnector];
    }

    clearHangingConnector() {
        for (let feature of this.features) {
            if (feature.type == 'connector') {
                if (feature.untethered == true) {
                    if (feature.untetheredClicks >= 1) {
                        feature.mode = 'delete';
                    } else {
                        feature.untetheredClicks += 1;
                    }
                } 
            }
        }

    }

    doConnectorLogic(activeFeature, searchType, action) {
        let [alreadyUntethered, connector] = this.isHangingConnector(searchType); // look for the other one
        if (connector) {
            if (connector.source.id != activeFeature.id) {
                connector.attach(activeFeature);
            }
        } else {
            if (alreadyUntethered == false) {
                action();
            }
        }
        this.mode = 'idle';
        activeFeature.mode = 'idle';
    }

    update(zoom) {
        this.mode = 'idle';
        let activeFeature;

        let zones = [];
        for (let i = 0; i < this.features.length; i++) {
            if (this.features[i].type === 'zone') {
                zones.push(this.features[i]);
                this.features[i].emptyChildren();
            }
        }

        for (let i = 0; i < this.features.length; i++) {
            let feature = this.features[i];
            if (feature.adoptable === true) {
                for (let j = 0; j < zones.length; j++) {
                    if (zones[j].checkIfChild(feature)) {
                        zones[j].addChild(feature);
                        break;
                    }
                }
            }
            if (feature.mode !== 'idle') {
                this.mode = feature.mode;
                activeFeature = feature;
            }
            if (feature.mode === 'delete') {
                activeFeature.delete(); // delink references
                this.features.splice(i, 1);
                activeFeature = null;
                i--;
            } else {
                feature.update(zoom);
                feature.display(zoom);
            }
            if (feature.type == 'connector' && feature.untethered) {
                fpsEvent();
            }
        }
        this.isActive = this.mode !== 'idle';
        if (this.isActive == true) {
            let connector;
            switch (this.mode) {
                case 'delete':
                    this.mode = 'idle';
                    break;
                case 'move':
                    activeFeature.moveToMouse();
                    break;
                case 'resize':
                    activeFeature.resizeToMouse();
                    break;
                case 'i_connect':
                    this.doConnectorLogic(activeFeature, 'Output', () => this.addConnector(0, 0, activeFeature, null));
                    break;
                case 'o_connect':
                    this.doConnectorLogic(activeFeature, 'Input', () => this.addConnector(0, 0, null, activeFeature));
                    break;
                default:
                    this.mode = 'idle';
                    break;
            }
            
        }
    }
}
