class TagWidget extends Widget {
    // methods to add tags to other blocks
    // on metrics, this provides the category of metric (value, time, voltage, whatever)
    constructor(parent, key = 'TAGS', fill = 'bottom_full', oneOnly = false) {
        super(parent, key, fill);
        this.oneOnly = oneOnly;
        if (!this.data) {
            this.data = '';
        }

        this.titleTextSize = 0.5 * myTextSize;
        this.tagTextSize = 2 * myTextSize;
        this.dynamicTextSizeThresholds = [750, 450];
        this.selector;
        this.tagList = [
            'TIME',
            'WORKFORCE',
            'VALUE',
            'LOSS',
            'ENERGY',
            'INFORMATION',
            'MATERIAL',
            'MECHANICAL'
        ];
        this.data = this.tagList[0];
        this.newTagInput;
        this.setup();
    }

    setup() {
        if (!this.input) {
            this.setupInput();
            this.attachMouseOverToInput();
        }
        this.inputUpdate = true;
        this.input.html(this.data);
    }

    restyleActive() {
        this.selector.show();
    }

    restyleDeActive() {
        this.selector.hide();
    }

    doHTMLUpdate(zoom) {
        super.doHTMLUpdate(zoom);
        this.selector.position(
            this.g.sCart.x + this.g.sDims.w + this.gap,
            this.frame.y_min + HTML_VERT_OFF
        );
        this.selector.style('width', String(this.g.sDims.w) + 'px');
        const ts = this.tagTextSize * zoom;
        this.selector.style('font-size', String(ts) + 'px');
        this.selector.style('line-height', String(ts * 1.5) + 'px');
        Array.from(this.selector.elt.children).forEach((child) => {
            child.style.margin = `${5 * zoom}px`;
            child.style.padding = `${5 * zoom}px`;
        });
        this.input.style('line-height', String(this.frame.y_delta) + 'px');
        this.input.html(this.data);
        // this.newTagInput.style('max-width', String(this.g.sDims.w - 10 * zoom) + 'px');
        this.newTagInput.style('width', String(this.g.sDims.w - 20 * zoom) + 'px');
        this.newTagInput.style('margin', String(5 * zoom) + 'px');
        this.newTagInput.style('padding', String(5 * zoom) + 'px');
    }

    inputEventHandler(res) {
        this.oldData = this.data;
        this.data = res;
        this.input.html(this.data); // double up to happen immediately
        this.inputUpdate = true;
        this.packParentCommand();
    }

    setupInput() {
        this.input = createDiv(this.data);
        styleDivInput(this.input);
        this.inputUpdate = true;
        this.selector = createDiv();
        this.selector.isMouseOver = false;
        for (let tag of this.tagList) {
            const myDiv = createDiv(tag);
            styleDivTag(myDiv);
            myDiv.mouseClicked(() => this.inputEventHandler(tag));
            myDiv.parent(this.selector);
            myDiv.mouseOver(() => {
                this.selector.isMouseOver = true;
            });

            myDiv.mouseOut(() => {
                this.selector.isMouseOver = false;
            });
        }
        styleDivSelector(this.selector);
        this.selector.hide(); // shown later
        this.selector.mouseOver(() => {
            this.selector.isMouseOver = true;
        });
        this.selector.mouseOut(() => {
            this.selector.isMouseOver = false;
        });

        this.newTagInput = createInput();
        this.newTagInput.parent(this.selector);
        styleTextInputInput(this.newTagInput);
        styleTextInputTag(this.newTagInput);
    }

    checkMouse() {
        let res = super.checkMouse();
        let res2 = this.selector.isMouseOver;
        return res || res2;
    }

    delete() {
        super.delete();
        if (this.selector) {
            this.selector.remove();
        }
    }

    dynamicallySizeText() {
        const thresh = super.dynamicallySizeText();
        let nt;
        if (thresh > this.dynamicTextSizeThresholds[0]) {
            nt = 2 * myTextSize;
        } else {
            nt = myTextSize;
        }

        if (this.tagTextSize != nt) {
            this.tagTextSize = nt;
            this.doUpdate = true;
        }
    }

    draw(zoom, cnv) {
        // fill(getColor('primary'));
        noFill();
        stroke(getColor('outline'));
        rect(
            this.frame.x_min,
            this.frame.y_min,
            this.frame.x_delta,
            this.frame.y_delta
        );
        noStroke();
        fill(getColor('outline'));
        textSize(this.titleTextSize * zoom);
        text(this.key, this.frame.x_min + 2, this.frame.y_min + 2);
        textSize(myTextSize * zoom);
    }
}
