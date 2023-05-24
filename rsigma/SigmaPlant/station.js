class StationButton {
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
            text(this.label[0], xa + this.oSBsOn2, ya + this.oSBsOn2);
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
        const buttonSize = 20;
        this.buttons.push(new StationButton('M', 0, 0, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new StationButton('D', 1, 0, buttonSize, () => this.setMode('delete'))); // top right
        this.buttons.push(new StationButton('I', 1, 1, buttonSize, () => this.setMode('edit'))); // bottom right
        this.buttons.push(new StationButton('C1', 0.5, 0, buttonSize, () => this.setMode('connect'))); // top center
        this.buttons.push(new StationButton('C2', 0.5, 1, buttonSize, () => this.setMode('connect'))); // bottom center
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
