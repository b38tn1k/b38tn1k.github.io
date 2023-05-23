class StationButton {
    constructor(label, x, y, size, action) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.action = action;
        this.buttonSize = size;
    }

    display(scrollX, scrollY) {
        fill(getColor("primary"));
        stroke(getColor("outline"));
        rect(this.x - scrollX, this.y - scrollY, this.buttonSize, this.buttonSize);

        fill(getColor("text"));
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.label, this.x + this.buttonSize/2 - scrollX, this.y + this.buttonSize/2 - scrollY);
    }

    checkMouseClick() {
        if (dist(mouseX, mouseY, this.x + this.buttonSize/2, this.y + this.buttonSize/2) < this.buttonSize) {
            this.action();
        }
    }
}

class Station {
    constructor(x, y, width = 400, height = 280) {
        console.log('hi');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.mode = null;

        // Create buttons
        this.buttons = [];
        const buttonSize = 20;
        this.buttons.push(new StationButton('M', x, y, buttonSize, () => this.setMode('move'))); // top left
        this.buttons.push(new StationButton('D', x + width - buttonSize, y, buttonSize, () => this.setMode('delete'))); // top right
        this.buttons.push(new StationButton('E', x + width- buttonSize, y + height- buttonSize, buttonSize, () => this.setMode('edit'))); // bottom right
        this.buttons.push(new StationButton('C', x + width / 2, y, buttonSize, () => this.setMode('connect'))); // top center
        this.buttons.push(new StationButton('C', x + width / 2, y + height- buttonSize, buttonSize, () => this.setMode('connect'))); // bottom center
    }

    setMode(mode) {
        this.mode = mode;
    }

    display(scrollX, scrollY) {
        // Draw the station
        fill(getColor("secondary"));
        stroke(getColor("outline"));
        rect(this.x - scrollX, this.y - scrollY, this.width, this.height);

        // Draw buttons
        for (let button of this.buttons) {
            button.display(scrollX, scrollY);
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
