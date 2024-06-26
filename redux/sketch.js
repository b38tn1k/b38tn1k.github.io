let images = [];
let imageFiles = [
    "image001.png", "image002.png", "image003.png", "image004.png", "image005.png",
    "image006.png", "image007.png", "image008.png", "image009.png", "image010.png",
    "image011.png", "image012.png", "image013.png", "image014.png", "image015.png",
    "image016.png", "image017.png", "image018.png", "image019.png", "image020.png",
    "image021.png", "image022.png", "image023.png", "image024.png", "image025.png",
    "image026.png", "image027.png", "image028.png", "image029.png", "image030.png",
    "image031.png", "image032.png", "image033.png", "image034.png", "image035.png",
    "image036.png", "image037.png", "image038.png", "image039.png", "image040.png",
    "image041.png", "image042.png" // Ensure this list includes all your image files
];
let currentImageIndex = 0;
let boundingBoxes = {};
let startX, startY, endX, endY;
let drawingBox = false;
let scaleFactor = 0.5; // Scale factor to fit images on the screen

/**
 * @description Preloads several images by calling the `loadImage()` method and storing
 * them in an array called `images`.
 */
function preload() {
    for (let i = 0; i < imageFiles.length; i++) {
        images[i] = loadImage(imageFiles[i]);
    }
}

/**
 * @description Initializes an image canvas and populates a `boundingBoxes` object
 * with values. It then displays an image at the current `imageIndex` position.
 */
function setup() {
    createCanvas(windowWidth, windowHeight);
    boundingBoxes = {};
    showImage(currentImageIndex);
}

/**
 * @description Sets the background to white and displays an image at the specified
 * position using a scale factor, then draws a box around the mouse cursor if
 * `drawingBox` is true.
 */
function draw() {
    background(255);
    if (images[currentImageIndex]) {
        image(images[currentImageIndex], 0, 0, images[currentImageIndex].width * scaleFactor, images[currentImageIndex].height * scaleFactor);
    }

    if (drawingBox) {
        noFill();
        stroke(255, 0, 0);
        rect(startX, startY, mouseX - startX, mouseY - startY);
    }
}

/**
 * @description Sets initial values for two variables: `startX` and `startY`. These
 * are the coordinates where the user first clicked inside a designated drawing area.
 * The function also enables a boolean variable called `drawingBox`, indicating that
 * the user is in drawing mode.
 */
function mousePressed() {
    startX = mouseX;
    startY = mouseY;
    drawingBox = true;
}

/**
 * @description Detects and saves the bounding box coordinates of a user-drawn shape
 * on an image, using the scale factor and image dimensions to constrain the coordinates
 * within the canvas bounds.
 */
function mouseReleased() {
    endX = mouseX;
    endY = mouseY;
    drawingBox = false;

    // Ensure coordinates are within canvas bounds
    startX = constrain(startX, 0, images[currentImageIndex].width * scaleFactor);
    startY = constrain(startY, 0, images[currentImageIndex].height * scaleFactor);
    endX = constrain(endX, 0, images[currentImageIndex].width * scaleFactor);
    endY = constrain(endY, 0, images[currentImageIndex].height * scaleFactor);

    let imgWidth = images[currentImageIndex].width;
    let imgHeight = images[currentImageIndex].height;
    let xRatio = startX / (imgWidth * scaleFactor);
    let yRatio = startY / (imgHeight * scaleFactor);
    let widthRatio = (endX - startX) / (imgWidth * scaleFactor);
    let heightRatio = (endY - startY) / (imgHeight * scaleFactor);

    boundingBoxes[imageFiles[currentImageIndex]] = {
        x: xRatio,
        y: yRatio,
        width: widthRatio,
        height: heightRatio
    };

    console.log(boundingBoxes);

    currentImageIndex++;
    if (currentImageIndex < images.length) {
        showImage(currentImageIndex);
    } else {
        console.log("All images processed.");
    }
}

/**
 * @description Displays an image from a two-dimensional array `images`. The image
 * is positioned at the origin and scaled based on a factor passed as input.
 * 
 * @param { integer } index - 0-based index of the desired image to be displayed from
 * the `images` array.
 */
function showImage(index) {
    if (images[index]) {
        clear();
        image(images[index], 0, 0, images[index].width * scaleFactor, images[index].height * scaleFactor);
    }
}

/**
 * @description Monitors key presses and, when the 's' or 'S' key is pressed, saves
 * bounding boxes.
 */
function keyPressed() {
    if (key === 's' || key === 'S') {
        saveBoundingBoxes();
    }
}

/**
 * @description Generates and downloads a JSON file containing the bounding boxes.
 */
function saveBoundingBoxes() {
    let jsonContent = JSON.stringify(boundingBoxes, null, 2);
    let blob = new Blob([jsonContent], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'bounding_boxes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}