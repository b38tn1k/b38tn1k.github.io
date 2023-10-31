let pyramidWidth = 400;
let pyramidHeight = 500;
let sections = 5;
let gapPercentage = 0.1;

let rotationX = 3.1415 / 16;
let rotationY = 3.1415 / 4;

let renderTexture;
let passThroughShader;

let lightPosX = -50;
let lightPosY = 0;
let lightPosZ = 350;
let ambientLevel = 100;

function preload() {
    passThroughShader = loadShader("vertex.glsl", "fragment.glsl");
}

function setup() {
    createCanvas(1000, 1000, WEBGL);
    renderTexture = createGraphics(width, height, WEBGL);
    topTexture = createGraphics(width, height, WEBGL);
}

function draw() {
    drawTruncatedPyramid(renderTexture, 400, 400);
    drawTruncatedPyramid(topTexture, 400, 400, 0, false, false);

    shader(passThroughShader);
    passThroughShader.setUniform("uMixFactor", 0.1); // 0.5 will mix stipple and random equally

    passThroughShader.setUniform("uTex", renderTexture);
    passThroughShader.setUniform("uTopTex", topTexture);

    rect(-width / 2, -height / 2, width, height);
    gapPercentage = 0.07 + sin(frameCount * 0.1) * 0.05
    rotationY += 0.05;
    rotationX += sin(frameCount * 0.1) * 0.005;
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
    }

    // Print the updated light position to the console
    console.log(`Light Position: X=${lightPosX}, Y=${lightPosY}, Z=${lightPosZ}, Ambient=${ambientLevel}`);
}

function drawTruncatedPyramid(texture, pyramidWidth, pyramidHeight, strokeC = 255, lights = true, fills = true) {
    texture.clear();
    texture.noLights();
    texture.background(255);

    
    if (lights) {
        texture.ambientLight(ambientLevel); // Soft general light to see all faces of the pyramid
        // texture.pointLight(255, 255, 255, 200, -200, 200);
        // texture.pointLight(255, 255, 255, -200, -200, 200); // Light source from the top left
        // texture.pointLight(255, 255, 255, 50, 100, 200);
        texture.pointLight(255, 255, 255, lightPosX, lightPosY, lightPosZ);
        texture.pointLight(255, 255, 255, -lightPosX, -lightPosY, -lightPosZ);
    }
    texture.push();
    texture.stroke(strokeC); // Black edges
    texture.strokeWeight(1); // Black edges
    texture.fill(255); // White faces
    texture.rotateX(rotationX);
    texture.rotateY(rotationY);
    let totalGapHeight = pyramidHeight * gapPercentage;
    texture.translate(0, (-(pyramidHeight + totalGapHeight) / sections - totalGapHeight), 0);
    let heightPerSection = (pyramidHeight - totalGapHeight) / sections;

    for (let i = 0; i < sections; i++) {
        let topWidth = map(i + 1, 0, sections, 0, pyramidWidth);
        let bottomWidth = map(i, 0, sections, 0, pyramidWidth);

        let bottomY = i * (heightPerSection + totalGapHeight) - pyramidHeight / 2;
        let topY = bottomY + heightPerSection;
        texture.fill(255);
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
        // if (fills) {
        //     texture.fill(100);
        // }

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

        texture.fill(0);

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
    texture.pop();
}
