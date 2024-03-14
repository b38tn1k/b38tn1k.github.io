let myColors = {};
let animations = {};
let canvasSize, numCells, cellSize;
let canvas;
let mode = "wwdo";

let IN = 2;
let OUT = 3;
let STATIC = 1;

/**
 * @description updates an element's class and innerHTML based on its ID, changes the
 * mode variable, and runs the appropriate animation sequence.
 * 
 * @param { element reference ( HTMLElement ) } elem - element for which the function
 * toggles information, including its class and content, to display the correct text
 * and emphasis based on the mode variable.
 * 
 * 		- `id`: A string attribute that represents the unique identifier for the element.
 * This is used to identify the correct mode from the `contentStrings` array and set
 * the emphasis and backup text for the element.
 */
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

/**
 * @description defines and maps 11 colors to their corresponding hex codes, storing
 * them in a designated array named "myColors".
 */
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
    myColors["forestGreen"] = color("#005411");
    myColors["navyBlue"] = color("#001F3F");
    myColors["skyBlue"] = color("#87CEEB");
    myColors["peachCoral"] = color("#FFB8A1");
    myColors["lightOrange"] = color("#FFCBA4");
    myColors["darkGoldenOrange"] = color("#FFB366");
}

/**
 * @description sets up the screen when a device has turned on or resumed from hibernation.
 */
function deviceTurned() {
  setupScreen();
}

/**
 * @description sets up the screen upon resizing the window.
 */
function windowResized() {
  setupScreen();
}

/**
 * @description sets up the necessary objects for an animated graphics experience on
 * a HTML page. It gets the width and height of the right column, calculates the
 * maximum size of the canvas, creates various animation grids with different shapes,
 * modes and colors, and sets their initial states.
 */
function setupScreen() {
  let rightColumn = document.getElementById("right-column"); // Get the right column by its ID
  let maxWidth = rightColumn.offsetWidth; // Get the width of the right column
  canvasSize = min(windowHeight * 0.85, maxWidth * 0.75); // Calculate the largest square size, adjust the factor as necessary
  resizeCanvas(canvasSize, canvasSize);
  
  // animations[mode] = new CircleLock(myColors, canvasSize);
  animations[mode] = new TriangleGrid(myColors, canvasSize);
  // animations[mode] = new GOL(myColors, canvasSize);
  // animations[mode] = new Terrain(myColors, canvasSize);
  animations[mode].mode = IN;
  animations["wwdeliver"] = new ZoomGrid(myColors, canvasSize);
  animations["wwdeliver"].mode = 0;
  animations["hwdi"] = new Maze(myColors, canvasSize);
  animations["hwdi"].mode = 0;
  // animations["tc"] = new InvaderGrid(myColors, canvasSize);
  animations["tc"] = new Terrain(myColors, canvasSize);
  Terrain
  animations["tc"].mode = 0;

}

/**
 * @description sets up the necessary components for the visualization: a canvas,
 * color palette, and multiple animation grids with different shapes and modes.
 */
function setup() {
    // canvasSize = int(min(windowHeight * 0.75, windowWidth  * 0.75));
    setupColors();
    let rightColumn = document.getElementById("right-column"); // Get the right column by its ID
    let maxWidth = rightColumn.offsetWidth; // Get the width of the right column
    canvasSize = min(windowHeight * 0.85, maxWidth * 0.75); // Calculate the largest square size, adjust the factor as necessary
    canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("right-column");
    setupScreen();
}

/**
 * @description clears the canvas and calls the draw method of each animation object
 * stored in the `animations` key-value pair.
 */
function draw() {
    clear();
    for (key in animations) {
        animations[key].draw();
    }
}
