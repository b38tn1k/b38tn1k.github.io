let pyramidWidth = 500;
let pyramidHeight = 400;
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
    drawTruncatedPyramid(renderTexture);
    drawTruncatedPyramid(topTexture, 0, false, false);
    shader(passThroughShader);
    passThroughShader.setUniform("uMixFactor", 0.1); // 0.5 will mix stipple and random equally

    passThroughShader.setUniform("uTex", renderTexture);
    passThroughShader.setUniform("uTopTex", topTexture);

    rect(-width / 2, -height / 2, width, height);
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

function drawTruncatedPyramid(texture, strokeC = 255, lights = true, fills = true) {
    texture.clear();
    texture.noLights();
    texture.background(255);

    // texture.specularMaterial(10);
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
    texture.translate(0, -(pyramidHeight * (1 + gapPercentage)) / sections, 0);
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

function drawCylinderPie(
    texture,
    cylinderHeight,
    cylinderRadius,
    sections,
    strokeC = 255,
    lights = true,
    fills = true
) {
    texture.clear();
    texture.noLights();
    texture.background(255);

    if (lights) {
        texture.ambientLight(ambientLevel); // Soft general light
        texture.pointLight(255, 255, 255, lightPosX, lightPosY, lightPosZ);
    }

    texture.push();
    texture.stroke(strokeC);
    texture.strokeWeight(1);
    texture.fill(255);
    texture.rotateX(rotationX);

    let anglePerSection = TWO_PI / sections;

    for (let i = 0; i < sections; i++) {
        let startAngle = i * anglePerSection;
        let endAngle = startAngle + anglePerSection;

        let x1 = cylinderRadius * cos(startAngle);
        let y1 = cylinderRadius * sin(startAngle);
        let x2 = cylinderRadius * cos(endAngle);
        let y2 = cylinderRadius * sin(endAngle);

        // Draw each pie segment of the cylinder
        texture.beginShape();

        // Bottom vertices
        texture.vertex(x1, y1, -cylinderHeight / 2);
        texture.vertex(x2, y2, -cylinderHeight / 2);

        // Top vertices
        texture.vertex(x2, y2, cylinderHeight / 2);
        texture.vertex(x1, y1, cylinderHeight / 2);

        texture.endShape(CLOSE);

        // Draw the top face of each segment
        if (fills) {
            texture.beginShape();
            texture.vertex(0, 0, cylinderHeight / 2);
            texture.vertex(x1, y1, cylinderHeight / 2);
            texture.vertex(x2, y2, cylinderHeight / 2);
            texture.endShape(CLOSE);
        }

        // Draw the bottom face of each segment
        if (fills) {
            texture.beginShape();
            texture.vertex(0, 0, -cylinderHeight / 2);
            texture.vertex(x1, y1, -cylinderHeight / 2);
            texture.vertex(x2, y2, -cylinderHeight / 2);
            texture.endShape(CLOSE);
        }
    }

    texture.pop();
}
