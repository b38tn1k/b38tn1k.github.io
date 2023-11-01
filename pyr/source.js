let sWidth = 400;
let sHeight = 500;
let sections = 5;
let gapPercentage = 0.1;

let rotationX = -3.1415 / 16;
let rotationY = 3.1415 / 4;

let renderTexture;
let maskTexture;
let topTexture;
let passThroughShader;

let lightPosX = -50;
let lightPosY = 0;
let lightPosZ = 350;
let ambientLevel = 100;
let mode = 0;

function preload() {
    passThroughShader = loadShader("vertex.glsl", "fragment.glsl");
}

function saveImage() {
    var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-" + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
    save(timestamp + ".png");
}

function keyPressed() {
    let stepSize = 20; // Change this value to adjust movement speed

    switch (key) {
        case "w":
            lightPosY += stepSize;
            break;
        case "s":
            lightPosY -= stepSize;
            break;
        case "S":
            saveImage();
            break;
        case "a":
            lightPosX -= stepSize;
            break;
        case "d":
            lightPosX += stepSize;
            break;
        case "q":
            lightPosZ += stepSize;
            break;
        case "e":
            lightPosZ -= stepSize;
            break;
        case "r":
            ambientLevel += stepSize;
            break;
        case "f":
            ambientLevel -= stepSize;
            break;
        case " ":
            mode += 1;
            break;
    }

    // Print the updated light position to the console
    console.log(`Light Position: X=${lightPosX}, Y=${lightPosY}, Z=${lightPosZ}, Ambient=${ambientLevel}`);
}

function setup() {
    createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
    renderTexture = createGraphics(width, height, WEBGL);
    topTexture = createGraphics(width, height, WEBGL);
    maskTexture = createGraphics(width, height, WEBGL);
}

function draw() {
    let styles = 2;

    switch (mode % styles) {
        case 0:
            drawStyle(renderTexture, topTexture, maskTexture, 400, 400, "pyr", -3.1415 / 16, 3.1415 / 4);
            break;
        case 1:
            drawStyle(renderTexture, topTexture, maskTexture, 150, 100, "hex", -3.1415 / 4, 0);
            break;
    }
}

function drawStyle(renderTexture, topTexture, maskTexture, w, h, type, xa, ya) {
    
    noStroke();
    background(0,0);
    if (mode == 0) {
        gapPercentage = 0.07 + sin(frameCount * 0.1) * 0.05;
        rotationY += 0.005;
        rotationX += sin(frameCount * 0.1) * 0.005;
    } else {
        rotationX = xa;
        rotationY = ya;
    }

    if (type == "pyr") {
        lightPosX = -50;
        lightPosY = 0;
        lightPosZ = 350;
        ambientLevel = 120;
        drawTruncatedPyramid(renderTexture, w, h);
        drawTruncatedPyramid(topTexture, w, h, 0, false, false);
        drawTruncatedPyramid(maskTexture, w, h, 0, false, true, true);
    }

    if (type == "hex") {
        lightPosX = -50;
        lightPosY = 0;
        lightPosZ = 500;
        ambientLevel = 100;
        drawHexagon(renderTexture, w, h);
        drawHexagon(topTexture, w, h, 0, false, false);
        drawHexagon(maskTexture, w, h, 0, false, false, true);
    }

    shader(passThroughShader);
    passThroughShader.setUniform("uStippleMixFactor", 0.5);
    passThroughShader.setUniform("uShadeMixFactor", 0.5);

    passThroughShader.setUniform("uTex", renderTexture);
    passThroughShader.setUniform("uTopTex", topTexture);
    passThroughShader.setUniform("uMask", maskTexture);
    fill(255,0,255,0);
    // how can I used maskTexture on this rect?
    rect(-width / 2, -height / 2, width, height);

    // imageMode(CENTER);
    // image(maskTexture, 0, 0);
}

function drawTruncatedPyramid(texture, sWidth, sHeight, strokeC = 255, lights = true, fills = true, mask = false) {
    texture.push();
    setupTextureEnvironment(texture, strokeC, lights);
    drawTruncatedPyramidSections(texture, sWidth, sHeight, fills, mask);
    texture.pop();
}

function setupTextureEnvironment(texture, strokeC = 255, lights = true) {
    texture.clear();
    texture.noLights();
    texture.background(255);

    if (lights) {
        texture.ambientLight(ambientLevel);
        texture.pointLight(255, 255, 255, lightPosX, lightPosY, lightPosZ);
        texture.pointLight(255, 255, 255, -lightPosX, -lightPosY, -lightPosZ);
    }

    texture.stroke(strokeC);
    texture.strokeWeight(3);
    texture.fill(255);

    texture.rotateX(rotationX);
    texture.rotateY(rotationY);
}

function drawTruncatedPyramidSections(texture, sWidth, sHeight, fills = true, mask = false) {
    let totalGapHeight = sHeight * gapPercentage;
    texture.translate(0, -(sHeight + totalGapHeight) / sections - totalGapHeight, 0);
    let heightPerSection = (sHeight - totalGapHeight) / sections;

    for (let i = 0; i < sections; i++) {
        let topWidth = map(i + 1, 0, sections, 0, sWidth);
        let bottomWidth = map(i, 0, sections, 0, sWidth);

        let bottomY = i * (heightPerSection + totalGapHeight) - sHeight / 2;
        let topY = bottomY + heightPerSection;
        if (fills) {
            texture.fill(200);
            if (mask) {
                texture.fill(0);
            }
        } else {
            texture.fill(255);
        }

        

        texture.beginShape();
        texture.vertex(-bottomWidth / 2, bottomY, -bottomWidth / 2);
        texture.vertex(bottomWidth / 2, bottomY, -bottomWidth / 2);
        texture.vertex(topWidth / 2, topY, -topWidth / 2);
        texture.vertex(-topWidth / 2, topY, -topWidth / 2);
        texture.endShape();

        texture.beginShape();
        texture.vertex(bottomWidth / 2, bottomY, -bottomWidth / 2);
        texture.vertex(bottomWidth / 2, bottomY, bottomWidth / 2);
        texture.vertex(topWidth / 2, topY, topWidth / 2);
        texture.vertex(topWidth / 2, topY, -topWidth / 2);
        texture.endShape();

        texture.beginShape();
        texture.vertex(bottomWidth / 2, bottomY, bottomWidth / 2);
        texture.vertex(-bottomWidth / 2, bottomY, bottomWidth / 2);
        texture.vertex(-topWidth / 2, topY, topWidth / 2);
        texture.vertex(topWidth / 2, topY, topWidth / 2);
        texture.endShape();

        // texture.fill(255);

        texture.beginShape();
        texture.vertex(-bottomWidth / 2, bottomY, bottomWidth / 2);
        texture.vertex(-bottomWidth / 2, bottomY, -bottomWidth / 2);
        texture.vertex(-topWidth / 2, topY, -topWidth / 2);
        texture.vertex(-topWidth / 2, topY, topWidth / 2);
        texture.endShape();

        if (!fills) {
            texture.fill(0);
        }

        texture.beginShape();
        texture.vertex(-bottomWidth / 2, bottomY, bottomWidth / 2);
        texture.vertex(-bottomWidth / 2, bottomY, -bottomWidth / 2);
        texture.vertex(bottomWidth / 2, bottomY, -bottomWidth / 2);
        texture.vertex(bottomWidth / 2, bottomY, bottomWidth / 2);
        texture.endShape();

        texture.beginShape();
        texture.vertex(-topWidth / 2, topY, topWidth / 2);
        texture.vertex(-topWidth / 2, topY, -topWidth / 2);
        texture.vertex(topWidth / 2, topY, -topWidth / 2);
        texture.vertex(topWidth / 2, topY, topWidth / 2);
        texture.endShape();
    }
}

function drawHexagon(texture, sWidth, sHeight, strokeC = 255, lights = true, fills = true, mask=false) {
    texture.push();
    setupTextureEnvironment(texture, strokeC, lights);
    let factor = 1.5;
    let coordinates = [
        [0, 0],
        [sWidth * factor, sWidth * factor],
        [-sWidth * factor, sWidth * factor],
    ];

    // Adjust coordinates based on factor and shift
    let aCoord = coordinates.map((coord) => {
        return [coord[0], coord[1] - sWidth];
    });
    for (let i = 0; i < aCoord.length; i++) {
        drawHexagonalBox(texture, sWidth, sHeight, fills, aCoord[i][0], aCoord[i][1], mask);
    }

    texture.pop();
}

function drawHexagonalBox(texture, sWidth, sHeight, fills, sX, sY, mask=false) {
    // Calculate hexagon parameters
    let hexRadius = sWidth;
    if (mask) {
        texture.fill(0);
    } else {
        texture.fill(255);
    }
    
    // Coordinates for the hexagon vertices
    let vertices = [];
    for (let i = 0; i < 6; i++) {
        let angle = (TWO_PI / 6) * i;
        let x = sX + hexRadius * cos(angle);
        let y = sY + hexRadius * sin(angle);
        vertices.push([x, y]);
    }

    // Drawing the hexagons (top and bottom)
    for (let h of [0, sHeight]) {
        texture.beginShape();
        for (let v of vertices) {
            texture.vertex(v[0], h, v[1]);
        }
        texture.endShape(CLOSE);
    }
    if (fills) {
        texture.fill(180);
    } else {
        texture.fill(255);
    }
    if (mask) {
        texture.fill(0);
    }

    // Drawing the side faces
    for (let i = 0; i < 6; i++) {
        let nextIndex = (i + 1) % 6;
        texture.beginShape();
        texture.vertex(vertices[i][0], 0, vertices[i][1]);
        texture.vertex(vertices[nextIndex][0], 0, vertices[nextIndex][1]);
        texture.vertex(vertices[nextIndex][0], sHeight, vertices[nextIndex][1]);
        texture.vertex(vertices[i][0], sHeight, vertices[i][1]);
        texture.endShape(CLOSE);
    }
}
