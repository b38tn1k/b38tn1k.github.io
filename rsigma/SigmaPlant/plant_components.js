class Station {
    constructor(x, y, w = 400, h = 280) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.mode = 'idle';

        // Create buttons
        this.buttons = [];
        this.initButtons(20);
        // Create data labels
        this.dataLabels = {};
        this.initDataLabels(20);
    }

    initDataLabels() {
        
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButton('M', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new PlantUIButton('X', 1, 0, buttonSize, () => this.setMode('delete'))); // top right
        // this.buttons.push(new PlantUIButton('E', 0, 1, buttonSize, () => this.setMode('edit'))); // bottom left
        this.buttons.push(new PlantUIButton('I', 0.5, 0, buttonSize, () => this.setMode('i_connect'))); // top center
        this.buttons.push(new PlantUIButton('O', 0.5, 1, buttonSize, () => this.setMode('o_connect'))); // bottom center
    }

    setMode(mode) {
        this.mode = mode;
        // console.log(mode);
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

    update(zoom) {
        // Convert the station position to screen coordinates
        this.screenPos = boardToScreen(this.x, this.y);
        this.onScreenWidth = this.width * zoom;
        this.onScreenHeight = this.height * zoom;
        for (let button of this.buttons) {
            button.update(zoom);
        }

        for (let label in this.dataLabels){
            if (this.dataLabels[label].mode == 'busy') {
                this.mode = this.dataLabels[label].mode;
            } else if  (this.dataLabels[label].mode == 'cleared') {
                this.dataLabels[label].mode = 'idle';
                this.mode = 'idle';
            }
        }


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

    display(zoom) {
        // Draw the station
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
        this.drawButtonsAndLabels();

        
    }

    drawButtonsAndLabels() {
        // Draw buttons
        for (let button of this.buttons) {
            // Convert button position to screen coordinates
            button.display(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight, zoom);
        }
        // Draw data labels
        for (let label in this.dataLabels) {
            this.dataLabels[label].display(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight, this.buttons[0].oSBs, zoom);
        }
    }

    handleMousePress() {
        if (mouseButton === LEFT) {
            for (let button of this.buttons) {
                button.checkMouseClick(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
            }
            // Handle data label click checks
            for (let label in this.dataLabels) {
                this.dataLabels[label].checkMouseClick(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight, this.buttons[0].oSBs);
            }
        }
    }
}

class Zone extends Station {
    constructor(x, y, width, height) {
        super(x, y, width, height); // Call the parent constructor
    }

    initButtons(buttonSize) {
        this.buttons.push(new PlantUIButton('M', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new PlantUIButton('X', 1, 0, buttonSize, () => this.setMode('delete'))); // top right
        // this.buttons.push(new PlantUIButton('E', 0, 1, buttonSize, () => this.setMode('edit'))); // bottom left
        this.buttons.push(new PlantUIButton('R', 1, 1, buttonSize, () => this.setMode('resize')));
    }

    initDataLabels(buttonSize) {
        this.dataLabels['title'] = new PlantDataTextLabel(0, 0, 'ZONE NAME', buttonSize, openDialog);
    }

    display(zoom) {
        // Draw the station
        noFill();
        stroke(getColor("accent"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);

        this.drawButtonsAndLabels();

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

    handleMousePress() {
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].handleMousePress();
        }

    }

    update(zoom) {
        this.mode = 'idle';
        let activeFeature;
        for (let i = 0; i < this.features.length; i++) {
            let feature = this.features[i];
            // Check for non-null mode
            if (feature.mode !== 'idle') {
                this.mode = feature.mode;
                activeFeature = feature;
            }
            // Check for delete mode
            if (feature.mode === 'delete') {
                this.features.splice(i, 1); // Remove the feature from the array
                //   delete feature; // Delete the feature
                activeFeature = null;
                i--; // Adjust the index after removal
            } else {
                // Update and display feature
                feature.update(zoom);
                feature.display(zoom);
            }
        }
        this.isActive = this.mode !== 'idle';
        if (this.isActive == true) {
            switch (this.mode) {
                case 'delete':
                    this.mode = 'idle';
                    break;
                case 'edit':
                    this.mode = 'idle';
                    break;
                case 'move':
                    activeFeature.moveToMouse();
                    break;
                case 'resize':
                    activeFeature.resizeToMouse();
                    break;
                case 'i_connect':
                    this.mode = 'idle';
                    break;
                case 'o_connect':
                    this.mode = 'idle';
                    break;
                default:
                    this.mode = 'idle';
                    break;
            }

        }
    }
}
