export class WobbleText {
    constructor(p, font, text, x, y, size = 80, layer, opts = {}) {
        this.p = p;
        this.font = font;
        this.text = text;
        this.x = x;
        this.y = y;
        this.layer = {};
        this.layer.width = layer.width;
        this.layer.height = layer.height;
        this.size = size;
        this.orig = { x, y, size };
        this.baseLayerWidth = layer.width;
        this.centered = opts.centered ?? false;

        this.sampleFactor = opts.sampleFactor ?? 0.4;

        // wobble amount (px)
        this.amp = opts.amp ?? 2;

        // speed multiplier
        this.speed = opts.speed ?? 1;

        // neon outline offset (optional)
        this.outlineOffset = opts.outlineOffset ?? 4;

        // colors
        this.mainFill = opts.mainFill ?? this.p.color(this.p.shared.chroma.player);
        this.outline1 = opts.outline1 ?? this.p.color(0);
        this.outline2 = opts.outline2 ?? this.p.color(255);
        this.outline1 = opts.outline1 ?? this.p.color(this.p.shared.chroma.ambient);
        // this.outline2 = opts.outline2 ?? this.p.color(this.p.shared.chroma.terrain);
        this.outline2 = opts.outline2 ?? this.p.color(this.p.shared.chroma.ambient);

        // Precompute points per character
        this.letters = this._computeLetters();
    }

    _computeLetters() {
        const out = [];

        // 1. Measure total width
        let totalWidth = 0;
        for (let i = 0; i < this.text.length; i++) {
            const ch = this.text[i];
            if (ch === " ") {
                totalWidth += this.p.textWidth(" ") * (this.size / 50);
                continue;
            }
            const bounds = this.font.textBounds(ch, 0, 0, this.size);
            totalWidth += bounds.w;
        }

        // 2. If centered, shift start so x,y is the middle
        let cursorX = this.centered
            ? this.x - totalWidth / 2
            : this.x;

        // 3. Build letters
        for (let i = 0; i < this.text.length; i++) {
            const ch = this.text[i];

            if (ch === " ") {
                cursorX += this.p.textWidth(" ") * (this.size / 50);
                continue;
            }

            const pts = this.font.textToPoints(
                ch,
                cursorX,
                this.y,    // baseline — you can offset for optical centering if needed
                this.size,
                { sampleFactor: this.sampleFactor }
            );

            out.push({
                char: ch,
                points: pts,
                index: i,
            });

            const bounds = this.font.textBounds(ch, 0, 0, this.size);
            cursorX += bounds.w;
        }

        return out;
    }

    onResize(layer) {
        const scale = layer.width / this.baseLayerWidth;
        this.x = this.orig.x * scale;
        this.y = this.orig.y * scale;
        this.size = this.orig.size * scale;
        this.baseLayerWidth = layer.width;
        this.orig.x = this.x;
        this.orig.y = this.y;
        this.orig.size = this.size;
        this.letters = this._computeLetters();
    }

    draw(layer) {
        const t = this.p.millis() * 0.002 * this.speed;
        const layers = this.p.shared.renderer.layers;

        // Layer 1 — colored outline #1
        // this._drawLayer(layers.uiLayer, this.outline1, (idx, i) => {
        this._drawLayer(layer, this.outline1, (idx, i) => {
            const wob = this._wobble(idx, i, t);
            return { x: wob.x + this.outlineOffset, y: wob.y + this.outlineOffset };
        });

        // Layer 2 — colored outline #2
        // this._drawLayer(layers.uiLayer, this.outline2, (idx, i) => {
        this._drawLayer(layer, this.outline2, (idx, i) => {
            const wob = this._wobble(idx, i, t);
            return { x: wob.x - this.outlineOffset*2, y: wob.y - this.outlineOffset*2 };
        });

        // Layer 3 — main text
        this._drawLayer(layer, this.mainFill, (idx, i) => {
            const wob = this._wobble(idx, i, t);
            return { x: wob.x, y: wob.y };
        });
    }

    _drawLayer(layer, col, offsetFn, outline=false) {
        layer.noStroke();
        layer.fill(col);
        if (outline) {
            layer.stroke(col);
            layer.strokeWeight(2);
            layer.noFill();
        }

        for (const letter of this.letters) {
            const pts = letter.points;

            layer.beginShape();
            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];

                const off = offsetFn(letter.index, i);
                const x = p.x + (off.x ?? 0);
                const y = p.y + (off.y ?? 0);

                layer.vertex(x, y);
            }
            layer.endShape(this.p.CLOSE);
        }
    }

    _wobble(letterIndex, pointIndex, t) {
        // Localized wobble for organic feel
        const phase = letterIndex * 0.7 + pointIndex * 0.15;

        return {
            x: this.amp * Math.sin(t + phase),
            y: this.amp * Math.cos(t + phase * 1.2),
        };
    }
}