export class MyButton {
    constructor(x, y, w, h, label, layer, onClick) {
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.design = { x, y, w, h };
        this.designWidth = layer.width;
        this.designHeight = layer.height;
        this.label = label;
        this.onClick = onClick;
        this.fontSize = Math.min((this.w / this.label.length) * 0.8, 64);
    }

    draw(layer) {
        layer.fill(255, 100, 100);
        layer.rectMode(layer.CORNER);
        layer.rect(this.x, this.y, this.w, this.h);
        layer.fill(0);
        layer.textAlign(layer.CENTER, layer.CENTER);
        layer.textSize(this.fontSize);
        layer.text(
            this.label,
            this.x + this.w / 2,
            this.y + this.h / 2 - this.fontSize * 0.12
        );
    }

    onResize(layer) {
        const xscale = layer.width / this.designWidth;
        const yscale = layer.height / this.designHeight;

        this.x = this.design.x * xscale;
        this.y = this.design.y * yscale;
        this.w = this.design.w * xscale;
        this.h = this.design.h * yscale;

        this.fontSize = Math.min((this.w / this.label.length) * 0.8, 64);

        // console.log("Layer Size", layer.width, layer.height);
        // console.log('MyButton onResize to', this.x, this.y, this.w, this.h);
    }

    contains(px, py) {
        return px >= this.x && px <= this.x + this.w &&
            py >= this.y && py <= this.y + this.h;
    }

    mousePressed(px, py) {
        // console.log('MyButton mousePressed at', px, py);
        // console.log('Button bounds:', this.x, this.x + this.w, this.y, this.y + this.h);
        if (this.contains(px, py) && this.onClick) {
            // console.log('MyButton clicked!');
            this.onClick();
        }
    }
}