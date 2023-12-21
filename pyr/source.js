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

// let lightPosX = -50;
// let lightPosY = 0;
// let lightPosZ = 350;
// let ambientLevel = 100;

let lightPosX = -1240;
let lightPosY = -500;
let lightPosZ = 1000;
let ambientLevel = 140;
let mode = 0;

let model;
/**
* @description This function preloads a shader program by loading two GLSL files: 
* "vertex.glsl" and "fragment.glsl".
* 
* @returns { object } - The output returned by the `preload()` function is `passThroughShader`.
*/
function preload() {
    passThroughShader = loadShader("vertex.glsl", "fragment.glsl");
    model = loadModel('airspace_V1.stl', true);
    model = loadModel('coarse.stl', true);
    
}

/**
* @description The function `saveImage` takes no arguments and creates a file name 
* using the current timestamp (year++, month++, day++, hour++, minute++, and second++) 
* and saves the file as an PNG image with that name.
* 
* @returns { string } - The output returned by this function is a timestamp value 
* made up of the current year(), month(), day(), hour(), minute(), and second(), all 
* padded with leading zeroes to the specified number of digits (2).
*/
function saveImage() {
    var timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-" + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
    save(timestamp + ".png");
}

/**
* @description This function controls the movement and manipulation of a light source 
* within a 3D space based on key presses. It updates the light's position along the 
* x-, y-, z-axes and its ambient level using step sizes that can be adjusted by the 
* user.
* 
* @returns { array } - The output returned by the function is the updated light 
* position and ambient level values.
* 
* `Light Position: X=<x>, Y=<y>, Z=<z>, Ambient=<ambient>`
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
* @description This function sets up the graphics environment for a WebGL painting 
* app. It creates canvases and textures for the main rendering scene (renderTexture), 
* top-most layer (topTexture), and mask (maskTexture).
* 
* @returns { any } - The output returned by the function `setup` is `outGraphics`, 
* which is a `Graphics` object created with dimensions `width` and `height` and using 
* the `WEBGL` context.
*/
function setup() {
    createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight), WEBGL);
    renderTexture = createGraphics(width, height, WEBGL);
    topTexture = createGraphics(width, height, WEBGL);
    maskTexture = createGraphics(width, height, WEBGL);
    outGraphics = createGraphics(width, height, WEBGL);
}

/**
* @description The function `draw` switches on the value of `mode % styles`, which 
* ranges over two possible values (`styles`).
* 
* @returns {  } - The output returned by this function is undefined.
*/

let test_alpha = 0;
/**
* @description The function "draw" takes a variable "mode" as input and performs
* different drawing operations based on the value of "mode". It uses three textures
* ("renderTexture", "topTexture", and "maskTexture") to create a visual effect.
* 
* @returns { any } The `draw()` function returns nothing (it is void). It modifies
* the graphics state by drawing a texture using different styles based on the value
* of `mode` (a variable between 0 and 2).
*/
function draw() {
    let styles = 4;

    switch (mode % styles) {
        case 0:
            drawStyle(renderTexture, topTexture, maskTexture, 400, 400, "pyr", -3.1415 / 16, 3.1415 / 4);
            break;
        case 1:
            drawStyle(renderTexture, topTexture, maskTexture, 150, 100, "hex", -3.1415 / 4, 0);
            break;
        case 2:
            drawStyle(renderTexture, topTexture, maskTexture, 300, 80, "cyl", test_alpha, 0);
            // test_alpha += 0.1;
            // test_alpha = -HALF_PI
            break;
        case 3:
            // drawStyle(renderTexture, topTexture, maskTexture, 300, 100, "stl", test_alpha, 0);
            // test_alpha += 0.1;
            // test_alpha = -HALF_PI
            break;
    }
}

/**
* @description This function takes six parameters: `renderTexture`, `topTexture`, 
* `maskTexture`, `w`, `h`, `type`, and `xa`, `ya`. It sets up and draws a stippled 
* image on the screen using a custom shader.
* 
* The function does the following:
* 
* 1/ Sets up the graphics context and clears the background.
* 2/ Rotates the image based on the frame count and a sinusoidal offset.
* 3/ Sets the Ambient level for the light source.
* 4/ Draws the stippled image using the `drawTruncatedPyramid` and `drawHexagon` functions.
* 5/ Sets the uniforms for the shader based on the input textures and current frame 
* count.
* 6/ Fills the rectangle with a colored background.
* 7/ Draws the image on the screen using the `image` function.
* 
* The `maskTexture` is not used directly but it affects the transparency of the 
* stippled image based on its values.
* 
* @param {  } renderTexture - The `renderTexture` input parameter is the main texturing 
* texture that will be drawn on the screen.
* 
* @param { object } topTexture - The `topTexture` input parameter is passed as an 
* optional parameter to the `drawTruncatedPyramid()` and `drawHexagon()` functions. 
* It specifies the topmost texture to use for the current geometry pass.
* 
* @param {  } maskTexture - The `maskTexture` input parameter is used to specify a 
* texture that will be used as a mask for the stippling effect.
* 
* @param {  } w - The `w` parameter is a function argument representing the width 
* of the canvas. It determines how wide the graphic drawn on the render texture 
* should be. This can be used as the size of textures and their scaling relative to 
* other components affecting rendering directly influences them when compositing 
* graphics onto video content using OpenGl graphics library features; adjusting its 
* value modifies dimensions for an appealing display within bounds without altering 
* aspects' proportion so everything blends naturally with minimum stutter/artefacting 
* even as it rotates/scrolls across multiple textures depending on the function call 
* mode parameter; when mode=0 - there'll often exist small black strips above top 
* left corner diagonals towards right down along diagonals.
* 
* @param { number } h - In the given function `drawStyle`, the input parameter `h` 
* represents the height of the textures being drawn.
* 
* @param { string } type - Based on the code provided:
* 
* The `type` input parameter specifies which type of geometric shape to draw: "pyr" 
* for a truncated pyramid or "hex" for a hexagon.
* 
* @param {  } xa - Based on the code provided:
* 
* `xa` is the horizontal angle of rotation for the drawing object.
* 
* @param {  } ya - The `ya` input parameter is a float value that represents the 
* rotationY angle of the shape being drawn.
* 
* @returns {  } - The output returned by this function is a PaperJS scene object 
* representing the stylized 2D graphics drawing based on the given parameters and textures.
*/
function drawStyle(renderTexture, topTexture, maskTexture, w, h, type, xa, ya) {
    
    outGraphics.noStroke();
    outGraphics.background(0,0);
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

    if (type == "cyl") {
        // lightPosX = -50;
        // lightPosY = 0;
        // lightPosZ = 500;
        // ambientLevel = 100;
        drawCylinder(renderTexture, w, h);
        drawCylinder(topTexture, w, h, 0, false, false);
        drawCylinder(maskTexture, w, h, 0, false, false, true);
    }

    if (type == "stl") {
        drawSTL(renderTexture, w, h);
        drawSTL(topTexture, w, h, 0, false, false);
        drawSTL(maskTexture, w, h, 0, false, false, true);
    }

    outGraphics.shader(passThroughShader);
    passThroughShader.setUniform("uStippleMixFactor", 0.5);
    passThroughShader.setUniform("uShadeMixFactor", 0.5);
    passThroughShader.setUniform("uTex", renderTexture);
    passThroughShader.setUniform("uTopTex", topTexture);
    passThroughShader.setUniform("uMask", maskTexture);

    outGraphics.fill(255,0,255,0);
    // how can I used maskTexture on this rect?
    outGraphics.rect(-width / 2, -height / 2, width, height);

    imageMode(CENTER);
    image(outGraphics, 0, 0);
    // image(maskTexture, 0, 0);
    // image(renderTexture, 0, 0);
    // image(topTexture, 0, 0);

}


/**
* @description This function sets up the environment for a Texture object by clearing 
* it and setting various properties such as background color and lighting.
* 
* @param { object } texture - The `texture` input parameter is passed a WebGL texture 
* object that will have its environment modified by the function.
* 
* @param { integer } strokeC - The `strokeC` input parameter sets the color of the 
* stroke for the textured quad.
* 
* @param { boolean } lights - The `lights` input parameter controls whether or not 
* lights are enabled for the texture. When `lights` is set to `true`, ambient and 
* point lights are applied to the texture.
* 
* @returns { any } - The output returned by this function is a `Texture` object with 
* the specified properties and values.
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
* @description This function draws a truncated pyramid using a given texture and 
* sets various properties such as stroke color and lights.
* 
* @param { object } texture - The `texture` input parameter is a graphics texture 
* that is used as the source of the image for the truncated pyramid.
* 
* @param { number } sWidth - The `sWidth` input parameter specifies the width of 
* each section of the truncated pyramid.
* 
* @param { number } sHeight - The `sHeight` parameter represents the height of the 
* truncated pyramid sections that will be drawn.
* 
* @param { number } strokeC - The `strokeC` input parameter specifies the color of 
* the stroke (border) around the truncated pyramid.
* 
* @param { boolean } lights - The `lights` input parameter controls whether or not 
* to include lighting effects when drawing the truncated pyramid.
* 
* @param { boolean } fills - The `fills` input parameter determines whether or not 
* to fill the interior of the truncated pyramid with color.
* 
* @param { number } mask - The `mask` input parameter indicates whether to draw a 
* mask over the pyramid.
* 
* @returns { any } - The output returned by the `drawTruncatedPyramid` function is 
* a modified version of the input `texture` object.
*/
function drawTruncatedPyramid(texture, sWidth, sHeight, strokeC = 255, lights = true, fills = true, mask = false) {
    texture.push();
    setupTextureEnvironment(texture, strokeC, lights);
    drawTruncatedPyramidSections(texture, sWidth, sHeight, fills, mask);
    texture.pop();
}

/**
* @description This function draws a truncated pyramid made up of several sections 
* with rounded edges. It takes a texture object as input and renders each section 
* with a different height based on a specified percentage gap between sections.
* 
* @param { object } texture - The `texture` input parameter is the 2D canvas that 
* will be used to draw the truncated pyramid sections.
* 
* @param { number } sWidth - The `sWidth` input parameter specifies the width of 
* each section of the truncated pyramid.
* 
* @param { number } sHeight - The `sHeight` input parameter defines the total height 
* of each section of the truncated pyramid.
* 
* @param { boolean } fills - The `fills` input parameter determines whether or not 
* the upper triangles of the truncated pyramid sections should be filled with color.
* 
* @param { number } mask - The `mask` input parameter is a Boolean value that 
* determines whether to fill the upper and lower triangular areas of each section 
* with a background color (i.e., a "mask") or not.
* 
* @returns { object } - The output returned by the `drawTruncatedPyramidSections` 
* function is a series of shapes (rectangles and triangles) that make up the truncated 
* pyramid shape. Each section of the pyramid is drawn with a specific width and 
* height determined by the parameters passed to the function.
*/
function drawTruncatedPyramidSections(texture, sWidth, sHeight, fills = true, mask = false) {
    let totalGapHeight = sHeight * gapPercentage;
    texture.translate(0, -(sHeight + totalGapHeight) / sections - totalGapHeight, 0);
    let heightPerSection = (sHeight - totalGapHeight) / sections;
    if (mask) {
        texture.background(0);
        texture.stroke(255);
    }

    for (let i = 0; i < sections; i++) {
        let topWidth = map(i + 1, 0, sections, 0, sWidth);
        let bottomWidth = map(i, 0, sections, 0, sWidth);

        let bottomY = i * (heightPerSection + totalGapHeight) - sHeight / 2;
        let topY = bottomY + heightPerSection;
        if (fills) {
            texture.fill(200);
            if (mask) {
                texture.fill(255);
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

/**
* @description The provided code defines a function `drawHexagon` that draws a hexagon 
* with optional fills and stroke based on given arguments.
* 
* @param { array } texture - The `texture` input parameter is a canvas texture that 
* is used as the source for drawing the hexagon shape.
* 
* @param { number } sWidth - The `sWidth` input parameter defines the size of the 
* hexagon's sides.
* 
* @param { number } sHeight - The `sHeight` input parameter determines the height 
* of the hexagon.
* 
* @param { number } strokeC - The `strokeC` input parameter sets the color of the 
* stroke (border) around each hexagon.
* 
* @param { boolean } lights - The `lights` input parameter determines whether or not 
* to add lighting effects to the hexagon drawn using this function.
* 
* @param { boolean } fills - The `fills` input parameter controls whether or not the 
* inner area of the hexagon is filled with color.
* 
* @param { boolean } mask - The `mask` input parameter is optional and determines 
* whether to draw a shape masked by a provided bitmap.
* 
* @returns { array } - The output returned by the `drawHexagon` function is none or 
* void because there is no return statement within the function.
*/
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

/**
* @description This function draws a hexagonal box on a texture object using HTML5 
* canvas context.
* 
* 	- `texture`: the canvas object to draw on
* 	- `sWidth`, `sHeight`: the size of the hexagon
* 	- `fills`: whether to fill the hexagon with a color (if true) or leave it unfilled 
* (if false)
* 	- `sX`, `sY`: the position of the top-left corner of the hexagon
* 	- `mask`: if true then the outer boundary will be drawn as a black line
* 
* The function first calculates the coordinates of the vertices of the hexagon and 
* then uses these vertices to draw the hexagon (top and bottom) and the side faces 
* using HTML5 canvas context methods such as beginShape(), endShape() and vertext().
* 
* @param { object } texture - The `texture` input parameter is a 2D graphics texture 
* that is modified by the function to draw a hexagonal box with filling and borders.
* 
* @param { number } sWidth - The `sWidth` input parameter determines the radius of 
* the hexagons.
* 
* @param { number } sHeight - The `sHeight` input parameter determines whether to 
* draw only the top or bottom hexagon or both. When `sHeight` is set to a value other 
* than 0 or the default undefined value (in which case the function does not draw 
* any hexagons), the function will draw all the hexagons of the given size along the 
* vertical axis of the canvas.
* 
* @param { boolean } fills - The `fills` input parameter determines whether to fill 
* the interior of the hexagonal box with a solid color.
* 
* @param { number } sX - The `sX` input parameter specifies the initial x-coordinate 
* for the hexagon's center.
* 
* @param { number } sY - The `sY` input parameter is the starting position for the 
* vertical line of hexagons.
* 
* @param { boolean } mask - The `mask` input parameter specifies whether to draw a 
* masked version of the hexagon or not.
* 
* @returns { object } - The output returned by the `drawHexagonalBox` function is a 
* WebGL renderer that draws a hexagonal box with specified dimensions and fill color.
*/
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
let cylinderLayers = 4;
/**
* @description The provided function 'drawCylinder' draws a cylinder using a texture
* atlas with options for stroke color (default 255), fills (default true), lights
* (default true), and masking (default false).
* 
* @param {  } texture - The `texture` input parameter is a reference to a WebGLRenderbuffer
* object that will be used as the surface for the drawn cylinder.
* 
* @param { number } sWidth - The `sWidth` input parameter sets the width of the
* cylinder that is being drawn.
* 
* @param { number } sHeight - The `sHeight` input parameter sets the height of the
* cylinder to be drawn.
* 
* @param { number } strokeC - The `strokeC` input parameter specifies the color of
* the stroke (i.e., the outline) of the cylinder.
* 
* @param { boolean } lights - The `lights` input parameter determines whether to
* draw the cylinder with lights (ambientOcclusion).
* 
* @param { boolean } fills - The `fills` input parameter determines whether to fill
* the cylinder with a solid color or leave it transparent. When set to true (the
* default), the cylinder will be filled with the current stroke color.
* 
* @param { boolean } mask - The `mask` input parameter determines whether to use a
* stencil mask when drawing the cylinder.
* 
* @returns { any } The output returned by the `drawCylinder` function is not explicitly
* defined. The function takes multiple parameters and performs various actions on a
* texture object. No explicit return statement is provided. Instead the function
* manipulates the texture object directly and does not return any output value.
*/
function drawCylinder(texture, sWidth, sHeight, strokeC = 255, lights = true, fills = true, mask=false) {
    // drawCylinder(renderTexture, w, h);
    // drawCylinder(topTexture, w, h, 0, false, false);
    // drawCylinder(maskTexture, w, h, 0, false, false, true);
    // let noStrokeSurf = lights == true && fills == true && mask == false && strokeC == 255;
    let noStrokeSurf = (strokeC == 255);
    texture.push();
    texture.rotateX(QUARTER_PI/3);
    // texture.rotateY(QUARTER_PI/2);
    // texture.translate(0, sHeight, 0);
    setupTextureEnvironment(texture, strokeC, lights);
    drawCylinderbox(texture, sWidth, sHeight, fills, 0, 0, strokeC, noStrokeSurf, mask);
    texture.pop();
}


/**
* @description This function draws a cylinder with layers on a Texture object using
* the P5.js library. It takes various parameters such as texture object itself(texture),
* screen width and height(sWidth and sHeight), number of layers(cylinderLayers) etc.,
* The function performs several operations on the texture such as pushing and popping
* matrices , changing the stroke weight and colors etc to achieve the desired
* cylindrical mesh effect.
* 
* @param { object } texture - The `texture` input parameter is a 2D texture array
* that serves as the canvas for drawing the cylinder box.
* 
* @param { number } sWidth - The `sWidth` input parameter specifies the width of the
* cylinder shape to be drawn.
* 
* @param { array } sHeight - The `sHeight` input parameter specifies the height of
* the cylinder box being drawn.
* 
* @param { number } fills - The `fills` input parameter controls the color of the
* cylinder's body. When `fills` is true (or not specified), the cylinder will be
* filled with a middle gray color (180).
* 
* @param { number } sX - The `sX` input parameter specifies the starting x-coordinate
* of the grid for rendering the cylinder shape.
* 
* @param { number } sY - Based on the code provided:
* 
* The `sY` input parameter determines the position of the horizontal axis (the
* `x`-axis) for the ellipses drawn within the cylinder.
* 
* @param { number } strokeC - The `strokeC` input parameter controls the color of
* the stroke when drawing a cylinder.
* 
* @param { boolean } noStrokeSurf - The `noStrokeSurf` input parameter controls
* whether or not to draw a border around the cylinder.
* 
* @param { boolean } mask - The `mask` input parameter of the `drawCylinderbox`
* function is a boolean value that controls whether to draw the mask for the cylinder
* or not.
* 
* @returns { object } The `drawCylinderbox` function takes several parameters and
* returns none. It draws a cylinder shape on a canvas texture object with the specified
* dimensions and properties. The function performs the following actions:
* 
* 1/ Sets up the drawing context for the canvas texture object.
* 2/ Determines the size of the cylinder based on the specified `sWidth` and `sHeight`.
* 3/ If a mask is provided as a parameter (a binary image indicating which areas to
* fill), it sets the fill color of the texture to black or white based on the value
* of each pixel.
* 4/ If fills are provided as a parameter (a boolean indicating whether to fill the
* interior of the cylinder with a color), it sets the fill color of the texture based
* on that value.
* 5/ Draws the cylinder shape using `cylinder()` and `line()` methods.
*/
function drawCylinderbox(texture, sWidth, sHeight, fills, sX, sY, strokeC, noStrokeSurf, mask=false) {
    let sh = sHeight;
    let cw = sWidth;
    if (mask) {
        texture.fill(0);
    } else {
        texture.fill(255);
    }
    if (fills) {
        texture.fill(180);
    } else {
        texture.fill(255);
    }
    if (mask) {
        texture.fill(0);
    }
    if (noStrokeSurf) {
        texture.noStroke();
    }
    texture.push();
    texture.strokeWeight(1);
    texture.rotateX(QUARTER_PI);
    // texture.translate(0, sHeight, -100);
    let gridSpacing = width * 0.05; // 5% of window width
    for (let x = -width; x < width; x += gridSpacing) {
      for (let y = -height; y < height; y += gridSpacing) {
        if (mask == false) {
            texture.line(x, -height, x, height);
            texture.line(-width, y, width, y);
        }
      }
    }
    texture.strokeWeight(3);
    texture.pop();
    texture.translate(0, -sh, 0);
    texture.rotateX(-QUARTER_PI);

    texture.push();
    texture.rotateX(HALF_PI)
    texture.translate(0, -cw * 0.7, -sh * 0.56);
    // if (mask == false) {
    //     texture.noFill();
    // }
    texture.ellipse(0, cw/2, 1.8*cw, cw*4.5);
    texture.pop();
    if (mask) {
        texture.fill(0);
    } else {
        texture.fill(255);
    }
    if (fills) {
        texture.fill(180);
    } else {
        texture.fill(255);
    }
    if (mask) {
        texture.fill(0);
    }
    if (noStrokeSurf) {
        texture.noStroke();
    }

    
    for (let i = 0; i < cylinderLayers; i++) {
        if (i == cylinderLayers-1) {
            sh *= 0.5;
            texture.translate(0, 0.6*sh, 0);
        }
        texture.push();
        texture.rotateX(HALF_PI)
        
        if (i == cylinderLayers-1) {
            texture.translate(0, 5, -sh * 0.3);
        } else {
            texture.translate(0, 5, -sh * 0.44);
        }
        texture.circle(0, 0, 2*cw+2)
        texture.pop();

        noStroke();
        texture.cylinder(cw + 2, sh, 80, 80, true, false);
        if (noStrokeSurf) {
            texture.noStroke();
        } else {
            texture.stroke(strokeC);
            texture.strokeWeight(3);
        }
        texture.translate(0, -sh, 0);
        texture.push();
        texture.rotateX(HALF_PI)
        texture.translate(0, 0, -sh * 0.48);
        texture.circle(0, 5, 2*cw+2)
        texture.pop();
        
        cw *= 0.5;
    }
}


function drawSTL(texture, sWidth, sHeight, strokeC = 255, lights = true, fills = true, mask=false) {
    // drawCylinder(renderTexture, w, h);
    // drawCylinder(topTexture, w, h, 0, false, false);
    // drawCylinder(maskTexture, w, h, 0, false, false, true);
    // let noStrokeSurf = lights == true && fills == true && mask == false && strokeC == 255;
    let noStrokeSurf = (strokeC == 255);
    texture.push();
    texture.rotateX(QUARTER_PI/3);
    // texture.rotateY(QUARTER_PI/2);
    // texture.translate(0, sHeight, 0);
    setupTextureEnvironment(texture, strokeC, lights);
    drawActualSTL(texture, sWidth, sHeight, fills, 0, 0, strokeC, noStrokeSurf, mask);
    texture.pop();
}

function drawActualSTL(texture, sWidth, sHeight, fills, sX, sY, strokeC, noStrokeSurf, mask=false) {
    if (mask) {
        texture.fill(0);
    } else {
        texture.fill(255);
    }
    if (fills) {
        texture.fill(180);
    } else {
        texture.fill(255);
    }
    if (mask) {
        texture.fill(0);
    }
    if (noStrokeSurf) {
        texture.noStroke();
    }
    texture.push()
    texture.rotateX(QUARTER_PI)
    texture.rotateZ(PI)
    texture.scale(3); // Adjust the scale as needed
    texture.model(model);
    texture.pop()
}