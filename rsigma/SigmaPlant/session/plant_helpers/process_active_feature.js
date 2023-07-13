class ProcessActiveFeature {
    constructor(parent) {
        this.parent = parent;
        return true;
    }

    delete() {
        this.parent.mode = 'idle';
        return true;
    }

    move() {
        this.parent.activeFeature.moveToMouse();
        this.parent.mode = 'idle';
        return true;
    }

    resize() {
        this.parent.activeFeature.resizeToMouse();
        this.parent.mode = 'idle';
        return true;
    }

    i_connect() {
        this.parent.doConnectorLogic(this.parent.activeFeature, 'Output', () =>
            this.parent.addConnector(0, 0, this.parent.activeFeature, null)
        );
        return true;
    }

    o_connect() {
        this.parent.doConnectorLogic(this.parent.activeFeature, 'Input', () =>
            this.parent.addConnector(0, 0, null, this.parent.activeFeature)
        );
        return true;
    }

    transition_plant() {
        this.parent.mode = 'transition_plant';
        this.parent.targetPlant = this.parent.activeFeature.targetPlant;
        this.parent.activeFeature.mode = 'idle';
        return true;
    }
}
