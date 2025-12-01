function drawTail(shapeGraphic, p, cx, cy, bodyLength, topH, botH, tailWidth, tailHeight, verticalSkew) {
    const tailType = p.floor(p.random(0, 4));
    // 0 = triangle, 1 = fork, 2 = round, 3 = ribbon
    // console.log("tailType:", tailType);

    const baseX = cx - bodyLength * 0.5;
    const topY = cy - topH * 0.2 + verticalSkew * shapeGraphic.height;
    const botY = cy + botH * 0.2 + verticalSkew * shapeGraphic.height;

    shapeGraphic.beginShape();
    shapeGraphic.noStroke();

    if (tailType === 0) {
        // --------------------------------------------------
        // CLASSIC TRIANGLE
        // --------------------------------------------------
        shapeGraphic.vertex(baseX, topY);
        shapeGraphic.vertex(baseX - tailWidth, cy);
        shapeGraphic.vertex(baseX, botY);
    }

    else if (tailType === 1) {
        // --------------------------------------------------
        // FORKED TAIL
        // --------------------------------------------------
        shapeGraphic.vertex(baseX, topY);
        shapeGraphic.vertex(baseX - tailWidth, cy - tailHeight * 0.4);
        shapeGraphic.vertex(baseX - tailWidth * 0.6, cy);
        shapeGraphic.vertex(baseX - tailWidth, cy + tailHeight * 0.4);
        shapeGraphic.vertex(baseX, botY);
    }

    else if (tailType === 2) {
        // --------------------------------------------------
        // ROUNDED PADDLE TAIL
        // --------------------------------------------------
        shapeGraphic.vertex(baseX, topY);
        shapeGraphic.bezierVertex(
            baseX - tailWidth * 0.8, cy - tailHeight * 0.6,
            baseX - tailWidth * 0.8, cy + tailHeight * 0.6,
            baseX, botY
        );
    }

    else if (tailType === 3) {
        // --------------------------------------------------
        // RIBBON / STREAMER TAIL
        // --------------------------------------------------
        shapeGraphic.vertex(baseX, topY);
        shapeGraphic.bezierVertex(
            baseX - tailWidth, cy - tailHeight * 0.8,
            baseX - tailWidth * 0.7, cy + tailHeight * 1.1,
            baseX, botY
        );
        // second thin ribbon
        shapeGraphic.bezierVertex(
            baseX - tailWidth * 0.4, cy + tailHeight * 0.6,
            baseX - tailWidth * 0.3, cy - tailHeight * 0.5,
            baseX, topY
        );
    }

    shapeGraphic.endShape(p.CLOSE);
}

export function generateFish(p, shapeGraphic, textureGraphic, maskColor, alignmentColor) {
    const w = shapeGraphic.width;
    const h = shapeGraphic.height;

    const bodyLength = p.random(w * 0.3, w * 0.6);
    const bodyHeight = p.random(h * 0.2, h * 0.4);
    const tailWidth = p.random(w * 0.1, w * 0.2);
    const tailHeight = p.random(h * 0.2, h * 0.35);

    const topFinHeight = p.random(h * 0.075, h * 0.175);
    const bottomFinHeight = p.random(h * 0.0625, h * 0.15);

    const shapeColor = p.random(0, 360);

    const baseHue = p.random(0, 360);
    const firstBaseHue = (baseHue + p.random(-30, 30)) % 360;
    const accentHue = (baseHue + p.random(60, 140)) % 360;

    // ----------------------------------------------------
    // ASYMMETRY + SPECIES MODE
    // ----------------------------------------------------
    const species = p.floor(p.random(0, 4));
    // 0 = round, 1 = oval, 2 = torpedo, 3 = triangle
    // console.log("species:", species);

    // body skew
    const topBulge = p.random(0.8, 1.2);
    const bottomBulge = p.random(0.8, 1.2);
    const forwardSkew = p.random(-0.2, 0.2);   // shift control points horizontally
    const verticalSkew = p.random(-0.15, 0.15); // overall up/down tilt

    // species shape weights
    let headPull = 0.0;    // how pointy the head becomes
    let tailPull = 0.0;    // how narrow the tail end becomes
    let heightBias = 1.0;  // round vs flattened

    if (species === 0) {          // PUFFER
        heightBias = 1.0;
        headPull = 0.05;
        tailPull = 0.1;
    }
    else if (species === 1) {     // OVAL (default)
        heightBias = 0.5;
        headPull = 0.15;
        tailPull = 0.15;
    }
    else if (species === 2) {     // TORPEDO
        heightBias = 0.5;
        headPull = 0.3;
        tailPull = 0.35;
    }
    else if (species === 3) {     // BUTTERFLY / TRIANGLE
        heightBias = 1.;
        headPull = 0.45;
        tailPull = 0.05;
    }

    // apply height shaping
    const topH = bodyHeight * topBulge * heightBias;
    const botH = bodyHeight * bottomBulge * heightBias;

    // controlling "face to right"
    const cx = w * 0.45;
    const cy = h * 0.5;

    shapeGraphic.clear();
    shapeGraphic.noStroke();
    shapeGraphic.colorMode(p.HSL);
    shapeGraphic.fill(maskColor);

    // ----------------------------------------------------
    // BODY OUTLINE (ASyMMETRIC, HEAD FACING RIGHT)
    // ----------------------------------------------------
    shapeGraphic.beginShape();

    // START — left side of fish (tail end, thicker)
    shapeGraphic.vertex(
        cx - bodyLength * 0.5,
        cy - topH * 0.5 + verticalSkew * h
    );

    // TOP CURVE — moving toward head
    shapeGraphic.bezierVertex(
        cx - bodyLength * 0.25 + forwardSkew * bodyLength,
        cy - topH * 0.8 + verticalSkew * h,
        cx + bodyLength * (0.25 - headPull),
        cy - topH * 0.4 + verticalSkew * h,
        cx + bodyLength * 0.45,
        cy + verticalSkew * h
    );

    // BOTTOM CURVE — return toward tail
    shapeGraphic.bezierVertex(
        cx + bodyLength * (0.25 - tailPull),
        cy + botH * 0.4 + verticalSkew * h,
        cx - bodyLength * 0.28 + forwardSkew * bodyLength,
        cy + botH * 0.8 + verticalSkew * h,
        cx - bodyLength * 0.5,
        cy + botH * 0.5 + verticalSkew * h
    );

    // Closing curve (tail bump)
    shapeGraphic.bezierVertex(
        cx - bodyLength * 0.6,
        cy + botH * 0.2 + verticalSkew * h,
        cx - bodyLength * 0.6,
        cy - topH * 0.2 + verticalSkew * h,
        cx - bodyLength * 0.5,
        cy - topH * 0.5 + verticalSkew * h
    );

    shapeGraphic.endShape(p.CLOSE);

    drawTail(shapeGraphic, p, cx, cy, bodyLength, topH, botH, tailWidth, tailHeight, verticalSkew);

    // ----------------------------------------------------
    // FINS (larger, contained, alignmentColor)
    // ----------------------------------------------------
    const finType = p.floor(p.random(0, 3));
    shapeGraphic.fill(alignmentColor);
    shapeGraphic.noStroke();

    // fin prominence multiplier (1.0–3.0 works well)
    const finScale = 1.75;

    // local helpers to keep fins inside the silhouette curvature
    function finBaseX(t) {
        // spine from tail → head
        return p.lerp(cx - bodyLength * 0.3, cx + bodyLength * 0.2, t);
    }

    function finTopY(t) {
        // decrease confinement slightly for bigger fins
        return cy - (topH * (0.5 - 0.18 * t)) + verticalSkew * h;
    }

    function finBotY(t) {
        return cy + (botH * (0.5 - 0.18 * t)) + verticalSkew * h;
    }

    // increased outward curvature
    const finSpread = (0.1 + 0.25 * (1 - species * 0.15)) * finScale;

    // TOP FIN
    if (finType === 0 || finType === 2) {
        shapeGraphic.beginShape();

        // extended fin length along body
        const t0 = p.random(0.05, 0.18);
        const t1 = t0 + p.random(0.55, 0.85);

        const x0 = finBaseX(t0);
        const x1 = finBaseX(t1);

        const y0 = finTopY(t0);
        const y1 = finTopY(t1);

        // bigger vertical reach
        const ctrlX = p.lerp(x0, x1, 0.5);
        const ctrlY = p.min(y0, y1) - topFinHeight * finSpread * finScale;

        shapeGraphic.vertex(x0, y0);
        shapeGraphic.bezierVertex(ctrlX, ctrlY, ctrlX, ctrlY, x1, y1);
        shapeGraphic.endShape(p.CLOSE);
    }

    // BOTTOM FIN
    if (finType === 1 || finType === 2) {
        shapeGraphic.beginShape();

        // extended fin length along body
        const t0 = p.random(0.03, 0.15);
        const t1 = t0 + p.random(0.55, 0.90);

        const x0 = finBaseX(t0);
        const x1 = finBaseX(t1);

        const y0 = finBotY(t0);
        const y1 = finBotY(t1);

        // bigger vertical reach
        const ctrlX = p.lerp(x0, x1, 0.5);
        const ctrlY = p.max(y0, y1) + bottomFinHeight * finSpread * finScale;

        shapeGraphic.vertex(x0, y0);
        shapeGraphic.bezierVertex(ctrlX, ctrlY, ctrlX, ctrlY, x1, y1);
        shapeGraphic.endShape(p.CLOSE);
    }


    textureGraphic.clear();
    textureGraphic.noStroke();
    textureGraphic.colorMode(p.HSL);

    textureGraphic.fill(firstBaseHue, 60, 50);
    textureGraphic.circle(w * 0.5, h * 0.5, w);

    const minCircleSize = textureGraphic.width * 0.0025;
    const maxCircleSize = textureGraphic.width * 0.015;


    for (let i = 0; i < 2000; i++) {
        let x = p.random(w);
        let y = p.random(h);
        let d = p.dist(x, y, w * 0.45, h * 0.5);

        if (d < bodyLength * 0.8) {
            const heightRatio = y / h;
            textureGraphic.fill(baseHue, 55 + p.random(-10, 10), 40 * heightRatio + 40 + p.random(-10, 10), 0.7);
            textureGraphic.circle(x, y, p.random(minCircleSize, maxCircleSize * 2));
        }
    }



    textureGraphic.stroke(accentHue, 70, 60, 0.8);
    textureGraphic.strokeWeight(1);
    let stripeWidth = p.random(1, 20);

    const stripeCount = p.floor(p.random(5, 50));
    for (let i = 0; i < stripeCount * 2; i++) {
        let sx = 2 * i * (w / stripeCount);
        // textureGraphic.line(sx, h * 0.5 - bodyHeight * 0.4, sx, h * 0.5 + bodyHeight * 0.4);
        for (let y = maxCircleSize; y < h; y += p.random(minCircleSize, maxCircleSize)) {
            let x = sx + (p.random() * stripeWidth * maxCircleSize);
            let d = p.dist(x, y, w * 0.5, h * 0.5);
            if (d < bodyLength * 0.8) {
                textureGraphic.fill(accentHue, 55 + p.random(-10, 10), 40 + p.random(-10, 10), 0.7);

                textureGraphic.circle(x, y, p.random(minCircleSize, maxCircleSize));
            }
        }
    }

    textureGraphic.noStroke();

    const eyeR = bodyHeight * (0.25 + p.random(-0.05, 0.05));

    // true head anchor (based on spline)
    const headX = cx + bodyLength * 0.45;
    const headY = cy + verticalSkew * h;

    // eye relative offsets
    const eyeOffsetX = -bodyLength * 0.15 - eyeR;   // pulled slightly left into the head
    const eyeOffsetY = -topH * 0.1;// + eyeR/2;          // slight upward bias (natural fish anatomy)

    const eyeX = headX + eyeOffsetX;
    const eyeY = headY + eyeOffsetY;



    // white eye
    textureGraphic.fill(0, 0, 90);
    textureGraphic.circle(eyeX, eyeY, eyeR);

    // pupil
    textureGraphic.fill(0, 0, 0);
    textureGraphic.circle(eyeX + eyeR * 0.1, eyeY, eyeR * 0.67);

    // highlight
    textureGraphic.fill(0, 0, 100);
    textureGraphic.circle(eyeX - eyeR * 0.2, eyeY - eyeR * 0.25, eyeR * 0.15);
}