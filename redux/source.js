let baseImage;
let images = {};
let boundingBoxes = {};
let revealedImages = new Set(); // To keep track of already revealed images
let scaleFactor = 0.25; // Assuming images are scaled to fit the screen
let canvasWidth = 1005; // 2009 * 0.5
let canvasHeight = 1247.5; // 2495 * 0.5

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

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    image(baseImage, 0, 0, baseImage.width * scaleFactor, baseImage.height * scaleFactor);
}

function draw() {
    // Display already revealed images
    revealedImages.forEach(imageKey => {
        if (images[imageKey]) {
            image(images[imageKey], 0, 0, images[imageKey].width * scaleFactor, images[imageKey].height * scaleFactor);
        }
    });
}

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