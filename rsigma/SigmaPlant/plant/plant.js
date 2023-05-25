class Feature {
    constructor(x, y, w = 400, h = 280) {
        this.id = getUnsecureHash()
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.mode = 'idle';
        this.buttons = [];
        this.initButtons(20);
        this.dataLabels = {};
        this.initDataLabels(20);
    }

    initDataLabels(buttonSize) { }
    initButtons(buttonSize) { }
    draw() { }

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

    drawButtonsAndLabels() {
        // Draw buttons
        for (let button of this.buttons) {
            // Convert button position to screen coordinates
            button.display(zoom);
        }
        // Draw data labels
        for (let label in this.dataLabels) {
            this.dataLabels[label].display(zoom);
        }
    }

    update(zoom) {
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

    display() {
        if (this.isInScreen() == true) {
            this.draw();
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
        super(x, y, width, height); // Call the parent constructor
        this.type = 'feature';
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new PlantDataTextLabel(0, 0, 'STATION NAME', buttonSize, openDialog);
        this.dataLabels['id'] = new PlantDataTextLabel(0, 1, this.id, buttonSize, NOP);
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButton('Move', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new PlantUIButton('Xdelete', 1, 0, buttonSize, () => this.setMode('delete'))); // top right
        this.buttons.push(new PlantUIButton('Input', 0.5, 0, buttonSize, () => this.setMode('i_connect'))); // top center
        this.buttons.push(new PlantUIButton('Output', 0.5, 1, buttonSize, () => this.setMode('o_connect'))); // bottom center
    }

    draw() {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
        this.drawButtonsAndLabels();
    }

}

class Zone extends Feature {
    constructor(x, y, width, height) {
        super(x, y, width, height); // Call the parent constructor
        this.type = 'zone';
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButton('Move', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new PlantUIButton('Xdelete', 1, 0, buttonSize, () => this.setMode('delete'))); // top right
        this.buttons.push(new PlantUIButton('Resize', 1, 1, buttonSize, () => this.setMode('resize')));
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new PlantDataTextLabel(0, 0, 'ZONE NAME', buttonSize, openDialog);
    }

    draw() {
        noFill();
        stroke(getColor("accent"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
        this.drawButtonsAndLabels();
    }
}

class Connector extends Feature {
    constructor(x, y, input, output) {
        super(x, y); // Call the parent constructor
        this.type = 'connector';
        this.input = input;
        this.output = output;
        this.source = this.input != null ? this.input : this.output;
        this.sourceType = this.input != null ? 'Input' : 'Output';
        this.anchors = {};
        this.setupAnchors();
        this.mode = 'idle';
        this.untethered = true;
    }

    setupAnchors() {
        this.anchors[this.sourceType] = this.source.buttons.find(button => button.label === this.sourceType);
        for (let anchor in this.anchors) {
            console.log(anchor, this.anchors[anchor]);
        }
    }

    attach(dest) {
        this.untethered = false;
        this.input ? this.output = dest : this.input = dest;
        let key = this.sourceType == 'Output' ? 'Input' : 'Output';
        print(this.input, this.output, this.sourceType, key);
        this.anchors[key] = this.source.buttons.find(button => button.label === key);
    }

    update() {
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
        stroke(getColor("outline"));
        for (let anchor in this.anchors) {
            circle(this.anchors[anchor].screen.x, this.anchors[anchor].screen.y, 100);
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

    addZone(x, y) {
        this.features.push(new Zone(x, y));
    }

    addConnector(x, y, input, output) {
        this.features.push(new Connector(x, y, input, output));
    }

    handleMousePress() {
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].handleMousePress();
        }
    }

    isHangingConnector(type) {
        console.log(type);
        let hangingConnector = null;
        for (let feature of this.features) {
            if (feature.type == 'connector') {
                if (feature.untethered == true && feature.sourceType == type) {
                    hangingConnector = feature;
                }
            }
        }
        return hangingConnector;
    }

    doConnectorLogic(activeFeature, searchType, action) {
        print('looking for' + searchType)
        let connector = this.isHangingConnector(searchType); // look for the other one
        if (connector) {
            console.log('found: ', connector.sourceType);
            connector.attach(activeFeature);
        } else {
            console.log('none found')
            action();
        }
        this.mode = 'idle';
        activeFeature.mode = 'idle';
    }

    update(zoom) {
        this.mode = 'idle';
        let activeFeature;
        for (let i = 0; i < this.features.length; i++) {
            let feature = this.features[i];
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
