export class SpriteAnimator {
    constructor(p) { this.p = p; }

    getPingPongIndex(totalFrames, speed) {
        const cycle = Math.floor(this.p.frameCount / speed);
        const idx = cycle % (2 * (totalFrames - 1));
        return idx < totalFrames ? idx : (2 * (totalFrames - 1) - idx);
    }

    drawPingPong(layer, sheet, pos, frames, speed) {
        const fw = sheet.width / frames;
        const fh = sheet.height;
        const idx = this.getPingPongIndex(frames, speed);
        layer.imageMode(this.p.CENTER);
        layer.image(
            sheet,
            this.p.width * pos.x,
            this.p.height * pos.y,
            fw,
            fh,
            idx * fw,
            0,
            fw,
            fh
        );
    }

    drawWaveGrid(layer, sheet, arr, cols, rows, speed) {
        const fw = sheet.width / cols;
        const fh = sheet.height / rows;
        for (const w of arr) {
            const cyc = Math.floor((this.p.frameCount + w.frameOffset) / speed);
            const idx = cyc % (cols * rows);
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            layer.image(
                sheet,
                w.x,
                w.y,
                fw,
                fh,
                c * fw,
                r * fh,
                fw,
                fh
            );
            if (w.vx !== undefined) w.x += w.vx;
            if (w.vy !== undefined) w.y += w.vy;
            if (w.speed !== undefined) w.x += w.speed;
        }
    }

    drawLightning(layer, sheet, arr, cols, rows, speed) {
        const fw = sheet.width / cols;
        const fh = sheet.height / rows;
        for (const L of arr) {
            const cyc = Math.floor((this.p.frameCount + L.frameOffset) / speed);
            const idx = cyc % (cols * rows);
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            layer.image(
                sheet,
                L.x,
                L.y,
                fw,
                fh,
                c * fw,
                r * fh,
                fw,
                fh
            );
        }
    }
}

export class BackgroundAnimator {
    constructor(p) { this.p = p; }

    drawAspectCorrect(layer, img, bgColor) {
        const p = this.p;
        if (bgColor) {
            layer.push();
            layer.noStroke();
            layer.fill(bgColor);
            layer.rect(0, 0, p.width, p.height);
            layer.pop();
        }
        const iw = img.width;
        const ih = img.height;
        const vw = p.width;
        const vh = p.height;
        const imgRatio = iw / ih;
        const viewRatio = vw / vh;
        let scale;
        if (imgRatio > viewRatio) {
            scale = vw / iw;
        } else {
            scale = vh / ih;
        }
        const padding = 0.02; // 2 percent inward padding
        const drawW = iw * scale * (1 - padding);
        const drawH = ih * scale * (1 - padding);
        layer.imageMode(p.CENTER);
        layer.image(img, vw / 2, vh / 2, drawW, drawH);
    }

    drawPingPong(layer, images, speed) {
        const N = images.length;

        // fractional cycle
        const cyc = this.p.frameCount / speed;

        // ping-pong pattern index (fractional)
        const rawIdx = cyc % (2 * (N - 1));

        // integer + fractional split
        const baseIdx = Math.floor(rawIdx);
        const frac = rawIdx - baseIdx;  // 0..1 transition amount

        // convert ping-pong into forward/backward logic
        const forward = baseIdx < (N - 1);
        const idxA = forward ? baseIdx : (2 * (N - 1) - baseIdx);
        const idxB = forward ? idxA + 1 : idxA - 1;

        const imgA = images[idxA];
        const imgB = images[idxB];

        // Crossfade between frames
        layer.push();

        // draw A with decreasing opacity
        layer.tint(255, 255 * (1 - frac));
        this.drawAspectCorrect(layer, imgA);

        // draw B with increasing opacity
        layer.tint(255, 255 * frac);
        this.drawAspectCorrect(layer, imgB);

        layer.pop();
        layer.noTint();
    }
}