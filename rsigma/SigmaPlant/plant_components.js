class PlantButton {
    constructor(label, x, y, size, action) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.action = action;
        this.buttonSize = size;
        this.bsOn2 = size / 2;
        this.offX = (x == 1);
        this.offY = (y == 1);
    }

    update(zoom) {
        this.oSBs = this.buttonSize * zoom;
        this.oSBsOn2 = this.oSBs / 2;
    }

    display(x, y, w, h, zoom) {
        fill(getColor("secondary"));
        stroke(getColor("outline"));
        let xa = x + this.x * w;
        let ya = y + this.y * h;
        if (this.offY === true) {
            ya -= this.oSBs;
        }
        if (this.offX === true) {
            xa -= this.oSBs;
        }
        square(xa, ya, this.oSBs);
        if (zoom > 0.7) {
            fill(getColor("text"));
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.label, xa + this.oSBsOn2, ya + this.oSBsOn2);
        }
    }

    checkMouseClick(x, y, w, h) {
        let xa = x + this.x * w;
        let ya = y + this.y * h;
        if (this.offY === true) {
            ya -= this.oSBs;
        }
        if (this.offX === true) {
            xa -= this.oSBs;
        }
        const clickX = xa + this.oSBsOn2;
        const clickY = ya + this.oSBsOn2;
        if (dist(mouseX, mouseY, clickX, clickY) < this.oSBs) {
            this.action();
        }
    }
}

class Station {
    constructor(x, y, w = 400, h = 280) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.mode = null;

        // Create buttons
        this.buttons = [];
        this.initButtons();

    }

    initButtons() {
        const buttonSize = 20;
        this.buttons.push(new PlantButton('M', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new PlantButton('X', 1, 0, buttonSize, () => this.setMode('delete'))); // top right
        this.buttons.push(new PlantButton('E', 0, 1, buttonSize, () => this.setMode('edit'))); // bottom left
        this.buttons.push(new PlantButton('I', 0.5, 0, buttonSize, () => this.setMode('i_connect'))); // top center
        this.buttons.push(new PlantButton('O', 0.5, 1, buttonSize, () => this.setMode('o_connect'))); // bottom center
    }

    setMode(mode) {
        this.mode = mode;
        console.log(mode);
    }

    update(zoom) {
        // Convert the station position to screen coordinates
        this.screenPos = boardToScreen(this.x, this.y);
        this.onScreenWidth = this.width * zoom;
        this.onScreenHeight = this.height * zoom;
        for (let button of this.buttons) {
            button.update(zoom);
        }

        switch (this.mode) {
            case 'move':
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
                print('resize');
                if (mouseIsPressed == false) {
                    this.mode = 'null';
                }
                break;
        }
    }

    display(zoom) {
        // Draw the station
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);

        // Draw buttons
        for (let button of this.buttons) {
            // Convert button position to screen coordinates
            button.display(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight, zoom);
        }
    }

    handleMousePress() {
        if (mouseButton === LEFT) {
            for (let button of this.buttons) {
                button.checkMouseClick(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);
            }
        }
    }
}

class Zone extends Station {
    constructor(x, y, width, height) {
        super(x, y, width, height); // Call the parent constructor
    }

    initButtons() {
        // Overwrite the parent's initButtons method
        let buttonSize = 20; // Update this as needed
        this.buttons.push(new PlantButton('M', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new PlantButton('X', 1, 0, buttonSize, () => this.setMode('delete'))); // top right
        this.buttons.push(new PlantButton('E', 0, 1, buttonSize, () => this.setMode('edit'))); // bottom left
        this.buttons.push(new PlantButton('R', 1, 1, buttonSize, () => this.setMode('resize')));
    }

    display(zoom) {
        // Draw the station
        noFill();
        stroke(getColor("accent"));
        rect(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight);

        // Draw buttons
        for (let button of this.buttons) {
            // Convert button position to screen coordinates
            button.display(this.screenPos.x, this.screenPos.y, this.onScreenWidth, this.onScreenHeight, zoom);
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

    handleMousePress() {
        for (let i = 0; i < this.features.length; i++) {
            this.features[i].handleMousePress();
          }

    }

    update(zoom) {
        for (let i = 0; i < this.features.length; i++) {
            let feature = this.features[i];

            // Check for non-null mode
            if (feature.mode !== null) {
                this.mode = feature.mode;
            }

            // Check for delete mode
            if (feature.mode === 'delete') {
                this.features.splice(i, 1); // Remove the feature from the array
                //   delete feature; // Delete the feature
                i--; // Adjust the index after removal
                this.mode = null;
            } else {
                // Update and display feature
                feature.update(zoom);
                feature.display(zoom);
            }
        }
        this.isActive = this.mode != null;
    }
}
