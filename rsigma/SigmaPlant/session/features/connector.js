class Connector extends Feature {
    constructor(x, y, input, output, id = null) {
        super(x, y, 0, 0, 'connector'); // Call the parent constructor
        if (id) {
            this.data['id'] = id;
        }
        this.changed = false;
        this.g.manualOnScreen = true;
        this.isAnimating = false;
        this.type = 'connector';
        this.connectorIsOnScreen = true;
        this.input = input;
        this.output = output;
        this.anchors = {};
        this.untethered = true;
        if (this.input && this.output) {
            this.untethered = false;
            this.findAnchors();
            
            this.setupAnchors();
        } else {
            this.source = this.input != null ? this.input : this.output;
            this.sourceType = this.input != null ? 'Input' : 'Output';
            this.anchors[this.sourceType] = this.source.caller;
        }
        this.mode = 'idle';
        this.untetheredClicks = 0;
        this.adoptable = false;
        this.path = [];
    }

    findAnchors() {
        let inputAnchors = this.input.buttons.filter(
            (button) => button.data['data'] === 'Input'
        );
        let outputAnchors = this.output.buttons.filter(
            (button) => button.data['data'] === 'Output'
        );
        
        let inputAnchor = inputAnchors.find(
            (button) => button.associatedConnector === null
        );
        let outputAnchor = outputAnchors.find(
            (button) => button.associatedConnector === null
        );
        this.anchors['Output'] = outputAnchor ? outputAnchor : outputAnchors[0];
        this.anchors['Input'] = inputAnchor ? inputAnchor : inputAnchors[0];
    }
    

    selfDescribe() {
        let res;
        if (!this.untethered) {
            res = super.selfDescribe();
        }
        return res;
    }

    computePath(zoom) {
        if (this.input && this.output) {
            let buffer = 20 * zoom;
            let x1 =
                this.anchors['Input'].g.sCart.x +
                this.anchors['Input'].g.sSqrDimOn2;
            let y1 = this.anchors['Input'].g.sCart.y;

            let x2 =
                this.anchors['Output'].g.sCart.x +
                this.anchors['Output'].g.sSqrDimOn2;
            let y2 =
                this.anchors['Output'].g.sCart.y +
                this.anchors['Output'].g.sSqrDim;
            buffer = min(buffer, Math.abs(y2 - y1) / 3);
            let ip = this.input.g.offDirection;
            let op = this.output.g.offDirection;
            if (ip.left) {
                x1 = 0;
                y1 = y2 + 2 * buffer;
            }
            if (ip.right) {
                x1 = windowWidth;
                y1 = y2 + 2 * buffer;
            }
            if (ip.top) {
                x1 = x2;
                y1 = 0;
            }
            if (ip.bottom) {
                x1 = x2;
                y1 = windowHeight;
            }
            if (op.left) {
                x2 = 0;
                y2 = y1 + 2 * buffer;
            }
            if (op.right) {
                x2 = windowWidth;
                y2 = y1 + 2 * buffer;
            }
            if (op.top) {
                x2 = x1;
                y2 = 0;
            }
            if (op.bottom) {
                x2 = x1;
                y2 = windowHeight;
            }
            // Calculate the midpoints
            let midY = (y1 + y2) / 2;
            let midX = (x1 + x2) / 2;
            // Calculate the connection points
            let cpY1 = y1 - buffer;
            let cpY4 = y2 + buffer;
            // Update path with the new points
            this.path = [
                {
                    x: x1,
                    y: y1
                },
                {
                    x: x1,
                    y: cpY1
                },
                {
                    x: midX,
                    y: cpY1
                },
                {
                    x: midX,
                    y: cpY4
                },
                {
                    x: x2,
                    y: cpY4
                },
                {
                    x: x2,
                    y: y2
                }
            ];
        }
    }

    setupAnchors() {
        for (let anchor in this.anchors) {
            this.anchors[anchor].connected = true;
            this.anchors[anchor].associatedConnector = this;
        }
    }

    selfConstruct() {
        super.selfConstruct();
        let inputAnchor = this.input.buttons.find(
            (button) => button.data.id === this.def.anchors.Input
        );
        let outputAnchor = this.output.buttons.find(
            (button) => button.data.id === this.def.anchors.Output
        );
        this.anchors['Output'] = outputAnchor;
        this.anchors['Input'] = inputAnchor;
        this.setupAnchors();
    }

    attach(dest) {
        this.untethered = false;
        this.input ? (this.output = dest) : (this.input = dest);
        let key = this.sourceType == 'Output' ? 'Input' : 'Output';
        this.anchors[key] = dest.caller; // dest.buttons.find(button => button.data['id'] === key);
        this.setupAnchors();
        this.changed = true;
        this.packCommand(true, 'newFeature', this.type, this.selfDescribe());
    }

    update(zoom) {
        this.changed = false;
        if (this.input && this.output) {
            this.g.manualOnScreen =
                this.input.g.isOnScreen || this.output.g.isOnScreen;
            if (
                this.input.mode == 'deleting' ||
                this.output.mode == 'deleting'
            ) {
                this.startDelete(true);
            }
            this.computePath(zoom);
        } else {
            this.untethered = true;
            this.connectorIsOnScreen = true;
        }
    }

    delete() {
        super.delete();
        this.clearAnchors();
    }

    clearAnchors() {
        for (let anchor in this.anchors) {
            this.anchors[anchor].connected = false;
            this.anchors[anchor].associatedConnector = null;
        }
    }

    startDelete(append = false) {
        let ds = this.selfDescribe();
        let cmdType = 'delete';
        if (append == true) {
            cmdType = 'delete-append';
        }
        this.packCommand(true, cmdType, this.type, ds);
        this.mode = 'delete';
        this.clearAnchors();
        this.changed = true;
    }

    draw(zoom, cnv) {
        noFill();
        stroke(getColor('connector'));
        if (this.untethered == false) {
            for (let i = 0; i < this.path.length - 1; i++) {
                let point1 = this.path[i];
                let point2 = this.path[i + 1];
                line(point1.x, point1.y, point2.x, point2.y);
            }
        } else {
            for (let anchor in this.anchors) {
                if (anchor == 'Input') {
                    line(
                        this.anchors['Input'].g.sCart.x +
                            this.anchors['Input'].g.sSqrDimOn2,
                        this.anchors['Input'].g.sCart.y,
                        mouseX,
                        mouseY
                    );
                } else {
                    line(
                        mouseX,
                        mouseY,
                        this.anchors['Output'].g.sCart.x +
                            this.anchors['Output'].g.sSqrDimOn2,
                        this.anchors['Output'].g.sCart.y +
                            this.anchors['Output'].g.sSqrDim
                    );
                }
            }
        }
    }
}
