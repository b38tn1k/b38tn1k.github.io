let baseImage;
let images = {};
let boundingBoxes = {};
let revealedImages = new Set();
let scaleFactor = 0.25; // Scaling factor for the images
let canvasWidth = 2009 * scaleFactor; // Scaled width
let canvasHeight = 2495 * scaleFactor; // Scaled height

/**
 * @description 1) loads an image and 2) fetches and processes a JSON file containing
 * bounding boxes for subsequent image loading.
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
 * @description Sets up an image display by creating a canvas and displaying an image
 * on it.
 */
function setup() {
    createCanvas(canvasWidth, canvasHeight);
    image(baseImage, 0, 0, baseImage.width * scaleFactor, baseImage.height * scaleFactor);
}

/**
 * @description Displays already revealed images by looping through an array of image
 * keys and calling the `image` function with the corresponding image and scale factor
 * values.
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
 * @description Scales the mouse coordinates to match the scaled canvas, and then
 * checks the scaled mouse position against each bounding box. If the mouse is within
 * the bounds of a revealed image, it is added to the list of revealed images.
 */
function mouseMoved() {
    // Scale the mouse coordinates to match the scaled canvas
    let scaledMouseX = mouseX / scaleFactor;
    let scaledMouseY = mouseY / scaleFactor;

    // Check scaled mouse position against each bounding box
    for (let key in boundingBoxes) {
        let bbox = boundingBoxes[key];
        let x = bbox.x * canvasWidth / scaleFactor;
        let y = bbox.y * canvasHeight / scaleFactor;
        let w = bbox.width * canvasWidth / scaleFactor;
        let h = bbox.height * canvasHeight / scaleFactor;

        if (scaledMouseX > x && scaledMouseX < x + w && scaledMouseY > y && scaledMouseY < y + h) {
            if (!revealedImages.has(key)) {
                revealedImages.add(key);
            }
        }
    }
}