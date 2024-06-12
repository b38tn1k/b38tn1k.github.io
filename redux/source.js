let baseImage;
let images = {};
let boundingBoxes = {};
let revealedImages = new Set(); // To keep track of already revealed images
let scaleFactor = 0.25; // Assuming images are scaled to fit the screen
let canvasWidth = 1005; // 2009 * 0.5
let canvasHeight = 1247.5; // 2495 * 0.5

/**
 * @description Loads an image and a JSON file containing bounding boxes, then loads
 * all other images based on the bounding boxes JSON using a for loop.
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
 * @description Sets up an art canvas with the specified width and height and displays
 * an image on it with a scaling factor applied to its original dimensions.
 */
function setup() {
    createCanvas(canvasWidth, canvasHeight);
    image(baseImage, 0, 0, baseImage.width * scaleFactor, baseImage.height * scaleFactor);
}

/**
 * @description Iterates through an array of image keys and displays the corresponding
 * images using the `image` function, scaling them to fit within a specified size range.
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
 * @description Iterates over bounding boxes and checks if the mouse position falls
 * within each box's boundaries. If it does, the corresponding image is marked as revealed.
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