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

function preload() {
    for (let i = 0; i < imageFiles.length; i++) {
        images[i] = loadImage(imageFiles[i]);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    boundingBoxes = {};
    showImage(currentImageIndex);
}

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

function mousePressed() {
    startX = mouseX;
    startY = mouseY;
    drawingBox = true;
}

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

function showImage(index) {
    if (images[index]) {
        clear();
        image(images[index], 0, 0, images[index].width * scaleFactor, images[index].height * scaleFactor);
    }
}

function keyPressed() {
    if (key === 's' || key === 'S') {
        saveBoundingBoxes();
    }
}

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