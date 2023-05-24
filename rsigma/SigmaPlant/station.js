class StationButton {
    constructor(label, x, y, size, action) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.action = action;
        this.buttonSize = size;
        this.offX = (x == 1);
        this.offY = (y == 1);
    }

    display(x, y, w, h, zoom) {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        const bs = this.buttonSize * zoom;
        let xa = x + this.x * w;
        let ya = y + this.y * h;
        if (this.offY === true) {
            ya -= bs;
        }
        if (this.offX === true) {
            xa -= bs;
        }
        square(xa, ya, bs);
        if (zoom > 0.7) {
            fill(getColor("text"));
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.label[0], xa + bs/2, ya + bs/2);
        }
    }

    checkMouseClick() {
        if (dist(mouseX, mouseY, this.x + bs/2, this.y + bs/2) < this.buttonSize) {
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
        this.buttons.push(new StationButton('E', 1, 1, buttonSize, () => this.setMode('edit'))); // bottom right
        this.buttons.push(new StationButton('C1', 0.5, 0, buttonSize, () => this.setMode('connect'))); // top center
        this.buttons.push(new StationButton('C2', 0.5, 1, buttonSize, () => this.setMode('connect'))); // bottom center
    }

    setMode(mode) {
        this.mode = mode;
    }

    display(scrollX, scrollY, zoom) {
        // Convert the station position to screen coordinates
        const screenPos = boardToScreen(this.x, this.y);
        const w = this.width * zoom;
        const h = this.height * zoom;
        
        // Draw the station
        fill(getColor("secondary"));
        stroke(getColor("outline"));
        rect(screenPos.x, screenPos.y, w, h);
        
        // Draw buttons
        for (let button of this.buttons) {
            // Convert button position to screen coordinates
            button.display(screenPos.x, screenPos.y, w, h, zoom);
        }
    }

    handleMousePress() {
        if (mouseButton === LEFT) {
            for (let button of this.buttons) {
                button.checkMouseClick();
            }
        }
    }
}
