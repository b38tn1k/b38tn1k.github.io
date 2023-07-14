class TagWidget extends Widget {
    // methods to add tags to other blocks
    // on metrics, this provides the category of metric (value, time, voltage, whatever)
    constructor(
        parent,
        key = 'tag_widget',
        fill = 'bottom_full',
        categoryMode = false
    ) {
        super(parent, key, fill);
        this.categoryMode = categoryMode;
        if (!this.data) {
            if (this.categoryMode) {
                this.data = '';
            } else {
                this.data = [];
            }
        }
        this.categoryMode = categoryMode;
        // this.titleTextSize = 0.5 * myTextSize;
        this.tagTextSize = 2 * myTextSize;
        if (!this.categoryMode) {
            this.textSize = myTextSize;
            this.tagTextSize = myTextSize;
        }
        this.dynamicTextSizeThresholds = [750, 450];
        this.selector;
        this.tags = new Set([
            'TIME',
            'WORKFORCE',
            'VALUE',
            'LOSS',
            'ENERGY',
            'INFORMATION',
            'MATERIAL',
            'MECHANICAL',
            'ANALOG',
            'DIGITAL'
        ]);
        this.timer = 0;
        // this.data = this.tags.values().next().value;
        this.newTagInput;
        this.activeTags = {};
        this.setup();
        this.placeholder = 'undefined';
    }

    setup() {
        if (!this.input) {
            this.setupInput();
            this.attachMouseOverToInput();
        }
        this.inputUpdate = true;
        if (this.categoryMode) {
            if (this.data == this.placeholder) {
                this.input.html('');

            } else {
                this.input.html(this.data);
            }
        } else {
            this.drawMultiTags();
        }
    }

    drawMultiTags() {
        // for (let data of this.data) {
        //     this.activeTags[data].show();
        //     this.activeTags[data].style('display', 'inline-block');
        //     this.inputUpdate = true;
        // }
        this.inputUpdate = true;
        for (let tag of this.tags) {
            if (this.data.includes(tag)) {
                this.activeTags[tag].show();
                this.activeTags[tag].style('display', 'inline-block');
            } else {
                this.activeTags[tag].hide();
            }
        }
    }

    restyleActive() {
        this.selector.show();
        this.inputUpdate = true;
    }

    restyleDeActive() {
        this.selector.hide();
        this.newTagInput.value('');
        this.inputUpdate = true;
    }

    doHTMLUpdate(zoom) {
        super.doHTMLUpdate(zoom);
        this.selector.position(
            this.g.sCart.x + this.g.sDims.w + this.gap,
            this.frame.y_min + HTML_VERT_OFF
        );
        this.selector.style('width', String(this.g.sDims.w) + 'px');
        const ts = this.tagTextSize * zoom;
        const ts5 = 1.1 * ts;
        this.selector.style('font-size', String(ts) + 'px');
        this.selector.style('line-height', String(ts5) + 'px');
        Array.from(this.selector.elt.children).forEach((child) => {
            child.style.margin = `${3 * zoom}px`;
            child.style.padding = `${3 * zoom}px`;
        });
        if (this.categoryMode) {
            this.input.style('line-height', String(this.frame.y_delta) + 'px');
            this.input.html(this.data);
        } else {
            // this.drawMultiTags();
            this.input.style('font-size', String(ts) + 'px');
            this.input.style('line-height', String(ts5) + 'px');
            Array.from(this.input.elt.children).forEach((child) => {
                child.style.margin = `${3 * zoom}px`;
                child.style.padding = `${3 * zoom}px`;
            });
        }
        // this.newTagInput.style('max-width', String(this.g.sDims.w - 10 * zoom) + 'px');
        this.newTagInput.style(
            'width',
            String(this.g.sDims.w - 20 * zoom) + 'px'
        );
        this.newTagInput.style('margin', String(5 * zoom) + 'px');
        this.newTagInput.style('padding', String(5 * zoom) + 'px');
    }

    activateTag(res) {
        this.oldData = JSON.parse(JSON.stringify(this.data));
        if (this.categoryMode) {
            this.data = res;
            this.input.html(this.data);
        } else {
            if (!this.data.includes(res)) {
                this.data.push(res);
                this.activeTags[res].show();
                this.activeTags[res].style('display', 'inline-block');
            }
        }
        this.inputUpdate = true;
        this.packParentCommand();
    }

    hasDelta(oldData) {
        return JSON.stringify(oldData) != JSON.stringify(this.data);
    }

    deActivateTag(tag) {
        this.oldData = JSON.parse(JSON.stringify(this.data));
        if (this.categoryMode) {
            // this.data = res;
            // this.input.html(this.data);
        } else {
            this.activeTags[tag].hide();
        }
        this.data = this.data.filter((item) => item !== tag);
        this.inputUpdate = true;
        this.removingTag = true;
        this.packParentCommand();
    }

    addTag(tag, skipCheck = false) {
        if (this.tags.has(tag) && !skipCheck) {
            return false;
        }
        const myDiv = createDiv(tag);
        styleDivTag(myDiv);
        this.tags.add(tag);
        this.parent.data['newtag'].push(tag);
        myDiv.mouseClicked(() => this.activateTag(tag));
        myDiv.parent(this.selector);
        myDiv.mouseOver(() => {
            this.selector.isMouseOver = true;
        });

        myDiv.mouseOut(() => {
            this.selector.isMouseOver = false;
        });
        this.inputUpdate = true;

        this.activeTags[tag] = createDiv(tag);
        // let cross = crossSVGImg(this.textSize, getColor('outline'))
        // cross.mouseOver(() => {
        //     this.selector.isMouseOver = false;
        // });
        // cross.parent(this.activeTags[tag]);
        styleDivTag(this.activeTags[tag]);
        this.activeTags[tag].mouseClicked(() => this.deActivateTag(tag));
        this.activeTags[tag].hide();
        this.activeTags[tag].parent(this.input);
    }

    setupInput() {
        this.input = createDiv(this.data);
        if (!this.categoryMode) {
            styleDivSelector(this.input);
            this.input.style('overflow', 'hidden');
        } else {
            styleDivInput(this.input);
        }

        this.inputUpdate = true;
        this.selector = createDiv();
        this.selector.isMouseOver = false;
        this.createNewTagInput();
        for (let tag of this.tags) {
            this.addTag(tag, true);
        }
        styleDivSelector(this.selector);
        this.selector.hide(); // shown later
        this.selector.mouseOver(() => {
            this.selector.isMouseOver = true;
        });
        this.selector.mouseOut(() => {
            this.selector.isMouseOver = false;
        });
    }

    createNewTagInput() {
        this.newTagInput = createInput();
        this.newTagInput.parent(this.selector);
        styleTextInputInput(this.newTagInput);
        styleTextInputTag(this.newTagInput);
        this.newTagInput.elt.addEventListener('keydown', (e) => {
            if (
                document.activeElement === this.newTagInput.elt &&
                e.keyCode === 13
            ) {
                // console.log(this.newTagInput.value());
                this.addTag(this.newTagInput.value());
                this.inputUpdate = true;
                e.preventDefault(); // Prevent the default action of the Enter key if needed.
                this.activateTag(this.newTagInput.value());
                this.newTagInput.value('');
            }
        });
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
        if (this.categoryMode == true) {
            let nt = myTextSize;
            if (this.data) {
                if (this.data.length == 0) {
                    nt = myTextSize;
                    this.textSize = myTextSize;
                } else {
                    const thresh = super.dynamicallySizeText();
                    if (thresh > this.dynamicTextSizeThresholds[0]) {
                        nt = 2 * myTextSize;
                    } else {
                        nt = myTextSize;
                    }
                }
            }
            if (this.tagTextSize != nt) {
                this.tagTextSize = nt;
                this.doUpdate = true;
            }
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
        // noStroke();
        // fill(getColor('outline'));
        // textSize(this.titleTextSize * zoom);
        // text(this.key, this.frame.x_min + 2, this.frame.y_min + 2);
        // textSize(myTextSize * zoom);
    }
}
