class PlantUIButton {
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
        if (this.x == 0.5) {
            xa -= this.oSBsOn2;
        }
        square(xa, ya, this.oSBs);
        let off;
        switch (this.label) {
            case 'X':
                off = 0.2 * this.oSBs;
                let xs = xa + off;
                let xe = xa + this.oSBs - off;
                let ys = ya + off;
                let ye = ya + this.oSBs - off;
                line(xs, ys, xe, ye)
                line(xe, ys, xs, ye)
                break;
            case 'M':
                off = 0.2 * this.oSBs;
                line(xa + this.oSBsOn2, ya + off, xa + this.oSBsOn2, ya + this.oSBs - off)
                line(xa + off, ya + this.oSBsOn2, xa + this.oSBs - off, ya + this.oSBsOn2)
                break;
            case 'R':
                const ratio = 0.5;
                const offset = this.oSBs * (1 - ratio) / 2;
                const arrowSize = this.oSBs * ratio;
                line(xa + offset, ya + offset, xa + arrowSize, ya + offset);
                line(xa + offset, ya + offset, xa + offset, ya + arrowSize);
                line(xa + offset + arrowSize, ya + offset + arrowSize, xa + offset + arrowSize, ya + 2 * offset);
                line(xa + 2 * offset, ya + offset + arrowSize, xa + offset + arrowSize, ya + offset + arrowSize);

                break;
            default:
                if (zoom > 0.7) {
                    fill(getColor("text"));
                    noStroke();
                    textAlign(CENTER, CENTER);
                    text(this.label, xa + this.oSBsOn2, ya + this.oSBsOn2);
                }
                break;
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
            this.action(this);
        }
    }
}

class PlantData {
    constructor(x, y, data, height, action) {
        this.x = x;
        this.y = y;
        this.data = data;
        this.height = height;
        this.action = action;
        this.mode = 'idle';
    }

    display(x, y, w, h, border, zoom) {
        // Override this method in subclasses
    }

    getXaYa(x, y, w, h, border) {
        const offsX = this.x * w;
        let xa
        if (offsX < border) {
            xa = x + 1.5 * border;
        } else {
            xa = x + offsX;
        }
        let ya = y + this.y * h;
        return [xa, ya];
    }

    // checkMouseClick(x, y, w, h, border) {
    //     const [clickX, clickY] = this.getXaYa(x, y, w, h, border)
    //     if (dist(mouseX, mouseY, clickX, clickY) < this.height /* Threshold for clicking */) {
    //         this.mode = 'busy';
    //         this.action(this);
    //     }
    // }
    checkMouseClick(x, y, w, h, border) {
        if (this.mode != 'busy') {
            const [xa, ya] = this.getXaYa(x, y, w, h, border);
            textSize((myTextSize * zoom));
            let wa = textWidth(this.data) * 1.2;
            if (wa == 0) {
                wa = this.height;
            }
            const centerX = xa + wa / 2; // Calculate the X coordinate of the center of the button
            const centerY = ya + this.height / 2; // Calculate the Y coordinate of the center of the button
            const distanceX = Math.abs(mouseX - centerX);
            const distanceY = Math.abs(mouseY - centerY);
            console.log(distanceX, distanceY);
            if (distanceX < wa / 2 && distanceY < (this.height * zoom) / 2) {
                this.mode = 'busy';
                this.action(this, xa, ya);
            }

        }
    }
}

class PlantDataTextLabel extends PlantData {
    constructor(x, y, data, height, action) {
        super(x, y, data, height);
        this.action = action;
    }

    display(x, y, w, h, border, zoom) {
        // The display logic for text labels goes here
        // The logic should consider the zoom level and the component's dimensions (w, h)
        let [xa, ya] = this.getXaYa(x, y, w, h, border);
        textSize((myTextSize * zoom));
        let wa = textWidth(this.data) * 1.2;
        if (wa == 0) {
            wa = this.height;
        }
        rect(xa, ya, wa, this.height * zoom);

        fill(getColor("text"));
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.data, xa + wa / 2, ya + this.height * zoom / 2); // Center the text within the rectangle
    }
}

function openDialog(plantData, xa, ya) {
    // Create a dialog box for text input
    const dialog = createInput(plantData.data);

    // Apply CSS styles based on the current theme
    dialog.style('border', `10px solid ${getColor('secondary')}`);
    dialog.style('outline', getColor('outline'));
    dialog.style('color', getColor('text'));
    dialog.style('background-color', getColor('primary'));

    // Set the position of the dialog box
    dialog.position(xa - 2, ya - 4);

    // Set a callback function to update the data field when the user presses Enter
    dialog.changed(() => {
        plantData.data = dialog.value();
        plantData.mode = 'idle';
        dialog.remove(); // Remove the dialog box from the DOM
        console.log('hey');
    });

    // Prevent event propagation within the dialog
    dialog.mouseClicked((event) => {
        event.stopPropagation();
    });

    // Add an event listener to remove the dialog if mouse is pressed outside the dialog box
    const removeDialog = () => {
        if (plantData.mode === 'busy') {
            plantData.mode = 'idle';
            dialog.remove(); // Remove the dialog box from the DOM
            console.log('removed');
            document.removeEventListener('mousedown', removeDialog);
        }
    };

    // Add an event listener to dismiss the dialog if mouse is pressed outside the dialog box
    document.addEventListener('mousedown', removeDialog);

    // Add an event listener to prevent dismissing the dialog if clicking inside the dialog box
    dialog.elt.addEventListener('mousedown', (event) => {
        event.stopPropagation();
    });
}
