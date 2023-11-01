let sWidth = 400;
let sHeight = 500;
let sections = 5;
let gapPercentage = 0.1;

let rotationX = -3.1415 / 16;
let rotationY = 3.1415 / 4;

let renderTexture;
let passThroughShader;

let lightPosX = -50;
let lightPosY = 0;
let lightPosZ = 350;
let ambientLevel = 100;
let mode = 0;

/**
* @description This function preloads a shader program by loading the vertex and 
* fragment shaders with the specified names.
* 
* @returns { object } - The output returned by the `preload` function is 
* `passThroughShader`, which is a shader object obtained through `loadShader`.
*/
function preload() {
    passThroughShader = loadShader("vertex.glsl", "fragment.glsl");
}

/**
* @description This function saves an image with a name that includes the current 
* timestamp (year-month-day-hour-minute-second) as a string of padding digits to a 
* file with the format "yyyy-mm-dd-HH-MM-SS.png".
* 
* @returns { string } - The output of this function would be a string of the form "YYYY-MM-DD-HH:MM:SS".
*/
function saveImage() {
    var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-" + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
    save(timestamp + ".png");
}

/**
* @description The `keyPressed` function responds to keyboard input and updates the 
* position and ambient level of a light source based on the input key pressed.
* 
* @returns {  } - The output returned by the `keyPressed()` function is the updated 
* light position information (X`, Y`, Z`, and ambient level) to the console.
*/
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

/**
* @description This function sets up the graphics context and creates two textures: 
* `renderTexture` and `topTexture`, with dimensions equal to the window size (minimized 
* to fit within the canvas), using WebGL.
* 
* @returns { object } - The output returned by this function is `null`.
*/
function setup() {
    createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
    renderTexture = createGraphics(width, height, WEBGL);
    topTexture = createGraphics(width, height, WEBGL);
}

/**
* @description The function `draw()` switches on the value of `mode` (which is assumed 
* to be an integer) and applies different drawing styles depending on the value. The 
* function uses two possible values for `styles`, which are used as arguments to the 
* `drawStyle()` function.
* 
* @returns { any } - The output returned by this function is `null`.
*/
function draw() {
    let styles = 2;

    switch (mode % styles) {
        case 0:
            drawStyle(renderTexture, topTexture, 400, 400, "pyr", -3.1415 / 16, 3.1415 / 4);
            break;
        case 1:
            drawStyle(renderTexture, topTexture, 150, 100, "hex", -3.1415 / 4, 0);
            break;
    }
}

/**
* @description This function renders an image with a stylized hexagonal or pyramidal 
* pattern using a shader and passes it through another texture.
* 
* @param {  } renderTexture - The `renderTexture` input parameter is a texture that 
* the `drawStyle()` function uses as the surface to render the stylized graphic on.
* 
* @param {  } topTexture - The `topTexture` input parameter passed to the function 
* is used as a reference for drawing an overlaid texture on top of the main `renderTexture`.
* 
* @param {  } w - The `w` input parameter specifies the width of the texture to be 
* rendered.
* 
* @param { number } h - In the given function `drawStyle`, the input parameter `h` 
* represents the height of the texture that will be drawn.
* 
* @param { string } type - The `type` input parameter determines which geometry to 
* draw using the `drawTruncatedPyramid` and `drawHexagon` functions.
* 
* @param { number } xa - The `xa` input parameter sets the rotation angle for the 
* X-axis of the texture being drawn.
* 
* @param { number } ya - Based on the code provided: The `ya` input parameter controls 
* the starting rotation of the hexagon shape that is being drawn.
* 
* @returns {  } - The output returned by this function is nothing (undefined) since 
* the function does not return anything.
*/
function drawStyle(renderTexture, topTexture, w, h, type, xa, ya) {
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
    }

    if (type == "hex") {
        lightPosX = -50;
        lightPosY = 0;
        lightPosZ = 500;
        ambientLevel = 100;
        drawHexagon(renderTexture, w, h);
        drawHexagon(topTexture, w, h, 0, false, false);
    }

    shader(passThroughShader);
    passThroughShader.setUniform("uStippleMixFactor", 0.5);
    passThroughShader.setUniform("uShadeMixFactor", 0.5);
    

    passThroughShader.setUniform("uTex", renderTexture);
    passThroughShader.setUniform("uTopTex", topTexture);

    rect(-width / 2, -height / 2, width, height);
}

/**
* @description The provided function `drawTruncatedPyramid` pushes the current canvas 
* context ( texture ), sets up the texture environment using the parameters strokeC 
* and lights , draws truncated pyramid sections using the fill flag ( fills ) and 
* the given width and height parameter ( sWidth and sHeight ), then pops the canvas 
* context.
* 
* @param {  } texture - The `texture` input parameter is a canvas that serves as the 
* base for the truncated pyramid.
* 
* @param { number } sWidth - The `sWidth` input parameter specifies the width of 
* each section of the truncated pyramid.
* 
* @param { number } sHeight - The `sHeight` input parameter represents the height 
* of the truncated pyramid and is used to draw each section of the pyramid.
* 
* @param { number } strokeC - The `strokeC` input parameter sets the color of the 
* stroke (outline) of the truncated pyramid.
* 
* @param { boolean } lights - The `lights` input parameter controls whether to add 
* lighting effects to the truncated pyramid when drawing it.
* 
* @param { boolean } fills - The `fills` input parameter determines whether to fill 
* the inside of the truncated pyramid with a solid color.
* 
* @returns {  } - The output returned by the `drawTruncatedPyramid` function is a 
* modified Texture object with the pyramid drawn on it.
*/
function drawTruncatedPyramid(texture, sWidth, sHeight, strokeC = 255, lights = true, fills = true) {
    texture.push();
    setupTextureEnvironment(texture, strokeC, lights);
    drawTruncatedPyramidSections(texture, sWidth, sHeight, fills);
    texture.pop();
}

/**
* @description This function sets up the texture environment for a 3D rendering 
* engine. It clears the texture buffer and sets the background color to white (255). 
* If "lights" is true (the second argument), it sets ambient lighting and two point 
* lights at specific positions.
* 
* @param {  } texture - The `texture` input parameter is the object being manipulated 
* and modified within the function.
* 
* @param { integer } strokeC - The `strokeC` input parameter sets the color of the 
* stroke for the texture.
* 
* @param { boolean } lights - The `lights` input parameter controls whether or not 
* ambient and point lights are enabled for the texture. When set to true (the default), 
* the function adds ambient and point lights to the texture.
* 
* @returns { object } - The output returned by this function is a modified texture 
* object with the specified properties:
* 
* 	- cleared and without lights
* 	- background color set to 255
* 	- ambient light set to ambientLevel
* 	- point lights at lightPosX/Y/Z with colors (255)
* 	- point lights at -lightPosX/Y/Z with colors (255)
* 	- stroke color set to strokeC
* 	- stroke weight set to 3
* 	- fill color set to 255
* 	- rotationX and Y set to rotationX and Y respectively.
*/
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

/**
* @description This function draws a truncated pyramid with filled sections using a 
* texture atlas.
* 
* @param {  } texture - The `texture` input parameter is the 2D graphical context 
* to be rendered. It defines the final visual representation of the pyramid's sloping 
* sides.
* 
* @param { number } sWidth - The `sWidth` input parameter specifies the width of 
* each section of the truncated pyramid.
* 
* @param { number } sHeight - The `sHeight` input parameter defines the height of 
* each section of the truncated pyramid.
* 
* @param { boolean } fills - The `fills` input parameter determines whether or not 
* to fill the upper and lower gaps between pyramid sections with color.
* 
* @returns { object } - The output returned by the `drawTruncatedPyramidSections` 
* function is a sequence of six shapes: a quadrilateral and two triangles for each 
* section of the truncated pyramid. Each shape has four vertices (or three vertices 
* for the triangle) that form the shape of the pyramid's sections.
*/
function drawTruncatedPyramidSections(texture, sWidth, sHeight, fills = true) {
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

/**
* @description This function draws hexagons on top of an image with the given 
* `texture`, using a provided factor for the hexagon size and coloring (with the 
* provided `strokeC` and optionally `lights` and `fills`).
* 
* @param {  } texture - The `texture` input parameter is passed to the `push()` and 
* `pop()` methods of the texture array and serves as the main visual representation 
* element for the drawn hexagons.
* 
* @param { number } sWidth - The `sWidth` input parameter defines the width of the 
* hexagon's sides.
* 
* @param { number } sHeight - The `sHeight` input parameter specifies the height of 
* the hexagon to be drawn.
* 
* @param { number } strokeC - The `strokeC` input parameter is a color value (in the 
* range of 0 to 255) that represents the stroke color for the hexagon shape drawn 
* by the `drawHexagon()` function.
* 
* @param { boolean } lights - The `lights` input parameter determines whether to 
* include lighting effects when drawing the hexagon.
* 
* @param { boolean } fills - The `fills` input parameter determines whether or not 
* to fill the inner spaces of the hexagon with the current color.
* 
* @returns { any } - The output returned by the `drawHexagon` function is none or 
* undefined since no return statement is present within the function.
*/
function drawHexagon(texture, sWidth, sHeight, strokeC = 255, lights = true, fills = true) {
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
        drawHexagonalBox(texture, sWidth, sHeight, fills, aCoord[i][0], aCoord[i][1]);
    }

    texture.pop();
}

/**
* @description This function draws a hexagonal box with specified width and height 
* using the provided texture object.
* 
* 1/ It calculates the coordinates of the hexagon vertices and stores themin an array.
* 2/ It uses those coordinates to draw the hexagon using the texture object's 
* beginShape(), vertex(), and endShape() methods.
* 
* @param {  } texture - The `texture` input parameter is a 2D image object that 
* defines the appearance of the hexagonal box.
* 
* @param { number } sWidth - The `sWidth` input parameter represents the width of 
* the hexagon and is used to calculate the radius of the hexagon.
* 
* @param { number } sHeight - The `sHeight` input parameter determines which hexagon 
* is being drawn. When set to zero or omitted (default), the top hexagon is drawn.
* 
* @param { boolean } fills - The `fills` input parameter determines whether to fill 
* the inside of the hexagon with a different color (180 if true) or leave it transparent 
* (255 if false).
* 
* @param { number } sX - The `sX` input parameter sets the starting position of the 
* hexagon on the x-axis.
* 
* @param { number } sY - The `sY` input parameter specifies the starting height of 
* the hexagonal box.
* 
* @returns {  } - The output returned by the `drawHexagonalBox` function is a PixelArt 
* texture.
*/
function drawHexagonalBox(texture, sWidth, sHeight, fills, sX, sY) {
    // Calculate hexagon parameters
    let hexRadius = sWidth;

    texture.fill(255);
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
