let myColors = {};
let animations = {};
let canvasSize, numCells, cellSize;
let canvas;
let mode = "wwdo";

let IN = 2;
let OUT = 3;
let STATIC = 1;

function toggleInfo(elem) {
    // frameRate(30);
    animations[mode].mode = OUT;
    document.querySelectorAll(".topic-link").forEach(function (element) {
        element.classList.remove("active"); // Remove the class 'active' from each element
    });
    elem.classList.add("active");
    document.getElementById("emphasis-text").innerHTML = contentStrings[elem.id]["emphasis-text"];
    document.getElementById("backup-text").innerHTML = contentStrings[elem.id]["backup-text"];
    mode = elem.id;
    animations[mode].mode = IN;
}

function setupColors() {
    myColors["rustOrange"] = color("#C25B56");
    myColors["teal"] = color("#008B8B");
    myColors["goldenYellow"] = color("#FFD700");
    myColors["oliveGreen"] = color("#808000");
    myColors["plumPurple"] = color("#DDA0DD");
    myColors["burntSienna"] = color("#EA7E5D");
    myColors["mustardYellow"] = color("#FFDB58");
    myColors["sageGreen"] = color("#9DC183");
    myColors["powderBlue"] = color("#B0E0E6");
    myColors["brickRed"] = color("#CB4154");
}

function setup() {
    // canvasSize = int(min(windowHeight * 0.75, windowWidth  * 0.75));
    let rightColumn = document.getElementById("right-column"); // Get the right column by its ID
    let maxWidth = rightColumn.offsetWidth; // Get the width of the right column
    canvasSize = min(windowHeight * 0.85, maxWidth * 0.75); // Calculate the largest square size, adjust the factor as necessary
    canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("right-column");
    setupColors();
    animations[mode] = new TriangleGrid(myColors, canvasSize);
    animations[mode].mode = IN;
    animations["wwdeliver"] = new CircleGrid(myColors, canvasSize);
    animations["wwdeliver"].mode = 0;
    animations["hwdi"] = new NetworkGraph(myColors, canvasSize);
    animations["hwdi"].mode = 0;
    animations["tc"] = new CircleGrid(myColors, canvasSize);
    animations["tc"].mode = 0;
}

function draw() {
    clear();
    for (key in animations) {
        animations[key].draw();
    }
}
