let baseImage;
let images = {};
let boundingBoxes = {};
let revealedImages = new Set(); // To keep track of already revealed images
let scaleFactor = 0.5; // Assuming images are scaled to fit the screen
let canvasWidth = 1005; // 2009 * 0.5
let canvasHeight = 1247.5; // 2495 * 0.5

/**
 * @description Loads images based on bounding boxes defined in a JSON file.
 */
function preload() {
    // Load the base image
    baseImage = loadImage('img/image042.png');

    // Load the bounding boxes JSON
    loadJSON('bounding_boxes.json', (data) => {
        boundingBoxes = data;

        // Load all other images based on the bounding boxes JSON
        for (let key in boundingBoxes) {
            images[key] = loadImage('img/' + key);
        }
    });
}

/**
 * @description Initializes a canvas by setting its width and height based on the
 * input values, then loads an image onto the canvas at the top-left corner using the
 * `image` function.
 */
function setup() {
    createCanvas(canvasWidth, canvasHeight);
    image(baseImage, 0, 0, baseImage.width * scaleFactor, baseImage.height * scaleFactor);
}

/**
 * @description Iterates over the `revealedImages` array and displays each image by
 * calling the `image()` function with the corresponding image object and scaling factors.
 */
function draw() {
    // Display already revealed images
    revealedImages.forEach(imageKey => {
        if (images[imageKey]) {
            image(images[imageKey], 0, 0, images[imageKey].width * scaleFactor, images[imageKey].height * scaleFactor);
        }
    });
}

/**
 * @description Checks the position of the mouse pointer relative to the bounding
 * boxes of a set of images, adding each image that intersects with the mouse pointer
 * to an array of revealed images.
 */
function mouseMoved() {
    // Check mouse position against each bounding box
    for (let key in boundingBoxes) {
        let bbox = boundingBoxes[key];
        let x = bbox.x * canvasWidth;
        let y = bbox.y * canvasHeight;
        let w = bbox.width * canvasWidth;
        let h = bbox.height * canvasHeight;

        if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
            if (!revealedImages.has(key)) {
                revealedImages.add(key);
            }
        }
    }
}