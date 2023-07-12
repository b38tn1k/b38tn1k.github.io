class Widget {
    constructor(parent, key) {
        this.parent = parent;
        this.active = false;
        this.key = key;
        if (!this.parent.data[this.key]) {
            this.parent.data[this.key] = {};
        }
        this.parent.data[this.key]['test'] = 'hello';
    }
    get data() {
        return this.parent.data[this.key];
    }

    get g() {
        return this.parent.g;
    }

    delete() {
        this.parent = null;
    }

    update() {
        
    }

    handleMousePress() {

    }

    display() {
        this.draw();
    }
}