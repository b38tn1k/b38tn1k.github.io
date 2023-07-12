class Widget extends WidgetFrame{
    constructor(parent, key, fill='full') {
        super(parent, fill);
        this.active = false;
        this.key = key;
        if (!this.parent.data[this.key]) {
            this.parent.data[this.key] = ''; // using JSON strings
        }
        this.placeholder;
    }
    get data() {
        return this.parent.data[this.key];
    }

    set data(value) {
        this.parent.data[this.key] = value;
    }

    delete() {
        this.parent = null;
    }

    packParentCommand() {
        let oldData = this.oldData ? this.oldData : this.placeholder;
        this.parent.packCommand(true, 'update_data', JSON.stringify({key: this.key, data: this.data}), oldData);
    }

    update(zoom) {
        super.update(zoom);
    }

    transitionIn() {}

    transitionOut() {}

    setup() {}

    handleMousePress() {}

    display() {
        this.draw();
    }

    draw() {

    }
}
