export class MyButton {
    constructor(x, y, w, h, label, layer, onClick, p) {
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.design = { x, y, w, h };
        this.designWidth = layer.width;
        this.designHeight = layer.height;
        this.label = label;
        this.onClick = onClick;
        this.fontSize = 0.85 * Math.min(this.w, this.h);
        this.p = p;
        this.backgroundColor = this.p.shared.chroma.terrain;
        this.useOrganicShape = true;
        this.organicShape = [];
        this.uiLayerFill = p.color(255);
        this.uiLayerStroke = p.color(0);
        this.outlineOnUILayer = true;

    }

    generateOrganicShape() {
        const pts = [];
        const edgeSteps = 20;
        const cornerSteps = 12;
        const noiseScale = 0.1;
        const p = this.p;

        const r = Math.min(this.w, this.h) * 0.25; // corner radius

        // ---- Top edge (leaving room for rounded corners)
        for (let i = 0; i <= edgeSteps; i++) {
            const t = i / edgeSteps;
            const x = this.x + r + t * (this.w - 2 * r);
            const y = this.y;
            const n = p.noise(x * noiseScale, y * noiseScale);
            pts.push({ x, y: y + n * (this.h * 0.1) });
        }

        // ---- Top-right rounded corner (quarter circle)
        for (let i = 0; i <= cornerSteps; i++) {
            const a = p.map(i, 0, cornerSteps, -p.HALF_PI, 0);
            const cx = this.x + this.w - r;
            const cy = this.y + r;
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r;
            pts.push({ x, y });
        }

        // ---- Right edge
        for (let i = 0; i <= edgeSteps; i++) {
            const t = i / edgeSteps;
            const x = this.x + this.w;
            const y = this.y + r + t * (this.h - 2 * r);
            const n = p.noise(x * noiseScale, y * noiseScale);
            pts.push({ x: x + n * (this.w * 0.1), y });
        }

        // ---- Bottom-right corner
        for (let i = 0; i <= cornerSteps; i++) {
            const a = p.map(i, 0, cornerSteps, 0, p.HALF_PI);
            const cx = this.x + this.w - r;
            const cy = this.y + this.h - r;
            pts.push({
                x: cx + Math.cos(a) * r,
                y: cy + Math.sin(a) * r
            });
        }

        // ---- Bottom edge
        for (let i = 0; i <= edgeSteps; i++) {
            const t = i / edgeSteps;
            const x = this.x + this.w - r - t * (this.w - 2 * r);
            const y = this.y + this.h;
            const n = p.noise(x * noiseScale, y * noiseScale);
            pts.push({ x, y: y - n * (this.h * 0.1) });
        }

        // ---- Bottom-left corner
        for (let i = 0; i <= cornerSteps; i++) {
            const a = p.map(i, 0, cornerSteps, p.HALF_PI, p.PI);
            const cx = this.x + r;
            const cy = this.y + this.h - r;
            pts.push({
                x: cx + Math.cos(a) * r,
                y: cy + Math.sin(a) * r
            });
        }

        // ---- Left edge
        for (let i = 0; i <= edgeSteps; i++) {
            const t = i / edgeSteps;
            const x = this.x;
            const y = this.y + this.h - r - t * (this.h - 2 * r);
            const n = p.noise(x * noiseScale, y * noiseScale);
            pts.push({ x: x - n * (this.w * 0.1), y });
        }

        // ---- Top-left corner
        for (let i = 0; i <= cornerSteps; i++) {
            const a = p.map(i, 0, cornerSteps, p.PI, p.PI + p.HALF_PI);
            const cx = this.x + r;
            const cy = this.y + r;
            pts.push({
                x: cx + Math.cos(a) * r,
                y: cy + Math.sin(a) * r
            });
        }

        this.organicShape = pts;
    }

    drawShadedComponent(shaderLayer) {
        if (this.useOrganicShape) {
            if (this.organicShape.length === 0) {
                this.generateOrganicShape();
            }
            shaderLayer.push();
            shaderLayer.noStroke();
            shaderLayer.fill(this.backgroundColor);
            shaderLayer.beginShape();
            for (const pt of this.organicShape) {
                shaderLayer.vertex(pt.x, pt.y);
            }
            shaderLayer.endShape(shaderLayer.CLOSE);
            shaderLayer.pop();
        } else {
            shaderLayer.fill(this.backgroundColor);
            shaderLayer.rectMode(layer.CORNER);
            shaderLayer.rect(this.x, this.y, this.w, this.h);
        }

    }

    drawUILayerComponent(layer) {
        if (this.outlineOnUILayer) {
            layer.stroke(this.uiLayerStroke);
            layer.noFill();
            layer.strokeWeight(2);

            if (this.useOrganicShape) {
                if (this.organicShape.length === 0) {
                    this.generateOrganicShape();
                }
                layer.beginShape();
                for (const pt of this.organicShape) {
                    layer.vertex(pt.x, pt.y);
                }
                layer.endShape(layer.CLOSE);
            } else {
                layer.rectMode(layer.CORNER);
                layer.rect(this.x, this.y, this.w, this.h);
            }

        }


        layer.fill(this.uiLayerFill);
        layer.stroke(this.uiLayerStroke);
        layer.strokeWeight(2);
        layer.textAlign(layer.CENTER, layer.CENTER);
        layer.textSize(this.fontSize);
        layer.text(
            this.label,
            this.x + this.w / 2,
            this.y + this.h / 2 - this.fontSize * 0.125
        );
    }


    draw(layer, shaderLayer) {
        // if (this.p.frameCount <= 30) {
        //     return;
        // }
        this.drawShadedComponent(shaderLayer);
        this.drawUILayerComponent(layer);
    }

    onResize(layer) {
        const xscale = layer.width / this.designWidth;
        const yscale = layer.height / this.designHeight;

        this.x = this.design.x * xscale;
        this.y = this.design.y * yscale;
        this.w = this.design.w * xscale;
        this.h = this.design.h * yscale;

        if (this.useOrganicShape) {
            this.organicShape = [];
        }

        this.fontSize = 0.85 * Math.min(this.w, this.h);

        // console.log("Layer Size", layer.width, layer.height);
        // console.log('MyButton onResize to', this.x, this.y, this.w, this.h);
    }

    contains(px, py) {
        return px >= this.x && px <= this.x + this.w &&
            py >= this.y && py <= this.y + this.h;
    }

    mousePressed(px, py) {
        // correctedMouseX, correctedMouseY
        // console.log('MyButton mousePressed at', px, py);
        // console.log('Button bounds:', this.x, this.x + this.w, this.y, this.y + this.h);
        if (this.contains(px, py) && this.onClick) {
            // console.log('MyButton clicked!');
            this.onClick();
        }
    }
}