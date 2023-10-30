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

/**
* @description This function preloads a shader program by loading the vertex and 
* fragment shaders, storing them in the `passThroughShader` variable.
*/
function preload() {
    passThroughShader = loadShader("vertex.glsl", "fragment.glsl");
}

/**
* @description This function sets up the graphics and textures for a WebGL drawing 
* application.
*/
function setup() {
    createCanvas(1000, 1000, WEBGL);
    renderTexture = createGraphics(width, height, WEBGL);
    topTexture = createGraphics(width, height, WEBGL);
}

/**
* @description This function renders a truncated pyramid using two textures 
* (renderTexture and topTexture) and a shader (passThroughShader).
*/
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

/**
* @description The function "keyPressed" updates the position of a light source in 
* a 3D space and adjusts the ambient level based on keyboard input.
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

/**
* @description This function draws a truncated pyramid with black edges and white 
* faces on a texture, using various lighting and shape modification techniques.
* 
* @param { object } texture - In the given function, `texture` is the input parameter 
* that represents the texture2D object on which the truncated pyramid is being drawn.
* 
* 	- `strokeC`: The color of the outline (edge) of the pyramid.
* 	- `lights`: A boolean indicating whether to use lights in the scene.
* 	- `fills`: A boolean indicating whether to fill the interior of the pyramid with 
* a specific color.
* 
* The `texture` object is used throughout the function to define various properties 
* and attributes related to the texture, such as the background color, lighting, 
* point lights, etc.
* 
* In essence, the `texture` input parameter serves as a reference to the texture2D 
* object on which the truncated pyramid will be rendered.
* 
* @param { number } strokeC - The `strokeC` parameter in the `drawTruncatedPyramid()` 
* function is used to specify the color of the stroke that will be applied around 
* the edges of the pyramid.
* 
* The function uses the `stroke()` method to draw a line along the edges of the 
* pyramid, which gives the illusion of a three-dimensional object on a two-dimensional 
* surface. The thickness of the line can be adjusted using the `strokeWeight()` method.
* 
* For example, if you pass `255` as the value for `strokeC`, the line will be drawn 
* in yellow (since 255 is the maximum value for each red, green, and blue channel).
* 
* In summary, the `strokeC` parameter in the `drawTruncatedPyramid()` function allows 
* you to specify the color of the stroke that will be applied around the edges of 
* the pyramid.
* 
* @param { boolean } lights - The `lights` input parameter in the `drawTruncatedPyramid` 
* function determines whether or not to include lighting effects in the rendering 
* of the pyramid.
* 
* Here's what each value of `lights` does:
* 
* 	- `true`: Includes point lights and ambient lighting.
* 	- `false`: Does not include point lights or ambient lighting, resulting in a 
* darker, unlit appearance.
* 
* The `ambientLevel` parameter sets the intensity of the ambient lighting, which 
* affects all faces of the pyramid equally.
* 
* @param { boolean } fills - Based on the code provided, the `fills` input parameter 
* is a boolean value that determines whether or not to fill the truncated pyramid 
* with a color other than white (255).
* 
* Here's a breakdown of how the function works:
* 
* 	- If `lights` is set to `true`, the function sets up lights on the top left and 
* bottom right of the pyramid.
* 	- If `fills` is set to `true`, the function fills the pyramid with the specified 
* color and draws the edges with the same color.
* 	- The function then uses textures to create the truncated pyramid, starting from 
* the top left corner and working its way down to the bottom right corner.
* 
* So in summary, the `fills` input parameter determines whether or not to fill the 
* truncated pyramid with a specified color, in addition to drawing the edges with 
* that color.
*/
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

/**
* @description This function draws a cylindrical pie chart with customizable parameters 
* such as the number of sections, stroke color and thickness, fills, and lights.
* 
* @param texture - Based on the documentation of the provided function, it seems 
* that `texture` is an abstract `Texture` object that is passed as a parameter to 
* the function.
* 
* From the function signature, it can be seen that the texture object has several 
* properties and methods that are used in the function's code:
* 
* 1/ `clear()`: clears the contents of the texture object.
* 2/ `noLights()`: disables lights for the texture object.
* 3/ `background(255)`: sets the background color of the texture to white (255, 255, 
* 255).
* 4/ `ambientLight(ambientLevel)`: sets the ambient light level for the texture object.
* 5/ `pointLight(255, 255, 255, lightPosX, lightPosY, lightPosZ)`: sets a point light 
* at the specified position with the specified intensity (255, 255, 255).
* 6/ `push()`: starts a new stack of states for the texture object.
* 7/ `stroke(strokeC)`: sets the stroke color of the texture object to the specified 
* value (255).
* 8/ `strokeWeight(1)`: sets the stroke weight of the texture object to 1.
* 9/ `fill(255)`: sets the fill color of the texture object to white (255, 255, 255).
* 10/ `rotateX(rotationX)`: rotates the texture object around the X-axis by the 
* specified angle (rotationX).
* 
* Overall, the `texture` parameter appears to be an instance of a Texture object 
* that provides various features for drawing 2D graphics on the screen.
* 
* @param { number } cylinderHeight - The `cylinderHeight` input parameter in the 
* `drawCylinderPie()` function determines the height of the cylinder.
* 
* The function draws each pie segment of the cylinder with two vertices at the top 
* and two vertices at the bottom, using `vertex()` method.
* 
* When `cylinderHeight` is greater than zero, the segments will be fully visible and 
* drawn, but when `cylinderHeight` is negative, the segments will be inverted and 
* only the bottom part of each segment will be visible.
* 
* @param { number } cylinderRadius - Based on the name and the context of the function, 
* it can be inferred that the `cylinderRadius` input parameter is used to define the 
* radius of the cylinder that will be drawn.
* 
* More specifically, the function takes five inputs:
* 
* 	- `texture`: a WebGL texture object that will be used to draw the cylinder pie chart.
* 	- `cylinderHeight`: the height of the cylinder.
* 	- `sections`: the number of pie sections that the cylinder should have.
* 	- `strokeC`: the color of the stroke that will be drawn around each pie segment.
* 	- `lights`: a boolean value indicating whether ambient lights should be enabled 
* or not.
* 
* The function uses the `cylinderRadius` parameter to calculate the dimensions of 
* each pie segment and the coordinates of the vertices that will be used to draw 
* each segment.
* 
* 	- Calculating the starting angle and ending angle for each segment.
* 	- Calculating the vertices of each segment.
* 
* In other words, the `cylinderRadius` input parameter determines how "fat" or "thin" 
* each pie segment will be, and it affects the overall shape of the cylinder pie chart.
* 
* @param { number } sections - The `sections` input parameter in the `drawCylinderPie()` 
* function determines how many segments the cylinder will be divided into.
* 
* The function uses the `sections` value to calculate the angle per section and draw 
* each pie segment of the cylinder.
* 
* The loop iterates over each segment, and for each segment, it draws the bottom and 
* top faces using the `beginShape()` and `endShape()` methods.
* 
* Therefore, the `sections` input parameter determines the number of pie segments 
* that will be drawn, and it affects how many vertices and faces are drawn for each 
* cylinder.
* 
* @param { number } strokeC - The `strokeC` input parameter in the `drawCylinderPie` 
* function determines the color of the stroke that is drawn around each pie segment 
* of the cylinder.
* 
* In other words, the `strokeC` parameter is used to specify the color of the outline 
* or border that is drawn around each pie segment, while the `fills` parameter 
* determines whether the inside of each segment should be filled with a color (set 
* to true) or left empty (set to false).
* 
* @param { boolean } lights - Based on the code, the `lights` input parameter in the 
* `drawCylinderPie` function determines whether or not to enable lighting for the 
* cylinder pie chart.
* 
* Here's how the `lights` parameter affects the rendering of the chart:
* 
* 1/ Ambient light: When `lights` is `true`, the function sets the ambientLight 
* property of the texture to the specified `ambientLevel`. This adds a soft, diffuse 
* light that illuminates the entire chart.
* 2/ Point light: When `lights` is `true`, the function also sets the pointLight 
* property of the texture to the specified `lightPosX`, `lightPosY`, and `lightPosZ` 
* coordinates.
* 
* When `lights` is `false`, the function does not apply any lights to the chart, and 
* the default fill color will be used instead.
* 
* @param { boolean } fills - The `fills` input parameter in the `drawCylinderPie` 
* function determines whether to fill the top and bottom faces of each segment of 
* the cylinder.
* 
* When `fills` is set to `true`, the function draws the top face and bottom face of 
* each segment, creating a filled area for that segment.
* 
* So the `fills` parameter allows you to customize how the cylinder pie is rendered, 
* either with fills or without fills.
*/
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
