var DEBUG = true;
// DEBUG = false;
// divide, adapte, pre-empt, change property, change material, make efficient, make harmless, save labor

const BROWSE_DECK = 0;
const PROBLEM_DEFINITION = 1;

const GROW = 0;
const SHRINK = 1;
const DISCARD = 2;
const NO_ANIMATION = -1;
const SETUP = -2;
const CONTRADICTION_COUNT = 39;
const doClear = true;

var MODE = BROWSE_DECK;
// var MODE = PROBLEM_DEFINITION;

/**
 * @description The `keyPressed()` function is not defined or implemented.
 *
 * @returns { any } The function `keyPressed()` does not return any output or value.
 */
var cnv;
var aniScaleFactor = 3;
var mainCanvas;
var contradictions, contradictionsLoader;
var cardMoveAnimation = 0;
var cardMoveAnimationDuration = 5.0;
var cardMoveTarget = -1;
var moveableCard, contradictionCurrentX, contradictionCurrentY;
var quadTargets = [];
var contradictionTracker = 0;
var contradictionGrow = [];
var contradictionShrink = [];
var contradictionNA = [];
var buttons = [];

let cardBGColors = [
    [0, 0, 255],
    [0, 255, 255],
    [0, 255, 0],
    [255, 255, 0],
    [255, 0, 0],
    [255, 255, 255],
];
/**
 * @description The function "keyPressed" is an event handler that runs when a key
 * on the keyboard is pressed. It does not contain any specific code and is commented
 * out (Indicated by `//`), therefore it does not perform any action when run.
 */
function keyPressed(event) {
    var doSomething = true;
    switch (event.code) {
        case "Digit1":
            MODE = BROWSE_DECK;
            modeSetup();
            break;
        case "Digit2":
            MODE = PROBLEM_DEFINITION;
            modeSetup();
            break;
        case "ArrowLeft":
            if (MODE == PROBLEM_DEFINITION) {
                discardContradiction();
            }
            break;
        case "ArrowUp":
            if (MODE == PROBLEM_DEFINITION) {
                growContradiction();
            }
            break;
        case "ArrowDown":
            if (MODE == PROBLEM_DEFINITION) {
                shrinkContradiction();
            }
            break;
        default:
            doSomething = false;
            break;
    }
}

/**
 * @description This function is named "deviceTurned", but it does not seem to contain
 * any code that would handle a device turning event.
 *
 * @returns { any } The output returned by the function `deviceTurned()` is undefined.
 */
function deviceTurned() {
    setupScreen();
}

/**
 * @description This function registers a event listener for the "resize" event on
 * the window object and calls the "setupScreen()" function whenever the window is resized.
 *
 * @returns { any } The output of the `windowResized()` function is `undefined`,
 * because the function does not return anything.
 */
function windowResized() {
    setupScreen();
}

/**
 * @description The `mousePressed()` function calls the `chooseIndex()` function when
 * the user presses the mouse button.
 *
 * @returns { any } The `mousePressed()` function will not return any value or output
 * because it does not contain a return statement.
 */
function mousePressed() {
    modeMouse();
}

/**
 * @description Based on the code snippet provided the "modeMouse" function has been
 * set to switch between two functions or modes of a program. The MODE parameter
 * refers to the program's current operational mode. It can have one of two values:
 *
 * BROWSE_DECK  and PROBLEM_DEFINITION
 *
 * Upon encountering this code portion the program will first compare its operational
 * mode ( MODE) to its valid available values; and then execute accordingly using
 * cases statements or a SWITCH-CASE instruction the function performs an action
 * related to what is specified by BROWSE_DECK. If neither condition applies does
 * nothing by falling through all the default branch and potentially doing nothing
 * based on how  this default handling block ends]
 *
 * In essence: it decides what part of the code to run based on current program mode
 * setting; specifically  switching between two modes for handling browsing decks
 * versus defining or viewing problem configurations within an application programming
 * interface  or software application.
 */
function modeMouse() {
    switch (MODE) {
        case BROWSE_DECK:
            chooseIndex();
            break;
        case PROBLEM_DEFINITION:
            for (let button of buttons) {
                button.handleClick(mouseX, mouseY);
            }
            break;
        default:
            break;
    }
}

/**
 * @description This function loads the `cards.json` file and stores its contents
 * into a variable named `cards`.
 *
 * @returns { object } The output returned by the `preload` function is `undefined`.
 * This is because the `loadJSON` function call within the function does not return
 * anything (it loads the data from a JSON file asynchronously), and the function
 * itself does not return a value explicitly.
 */
function preload() {
    cards = loadJSON("cards.json");
    contradictionsLoader = loadJSON("contradiction_sources.json");
}

/**
 * @description This function chooses a random index into an array of cards by first
 * decrementing the current index and wrapping around to the end of the array if necessary.
 *
 * @returns { integer } The `chooseIndex()` function takes no arguments and returns
 * an integer index between 0 and `cardslength - 1`, where `cardslength` is a variable
 * that is not defined within the given scope.
 *
 * The function first decrements the `index` variable by 1. If the resultant index
 * is less than or equal to -1 (inclusive), it adds `cardslength` to the resultant
 * index to bring it back to the range of valid indices.
 */
function chooseIndex() {
    index -= 1;
    if (index == -1) {
        index += cardslength;
    }
    rCol = shuffleColrs();
}

/**
 * @description The `shuffleColrs()` function randomizes the order of an array of
 * colors. It repeats the following steps:
 *
 * 1/ Pushes a randomly selected color from the input array `c` to the end of the
 * output array `j`.
 * 2/ Pops a color from the beginning of `c` and adds it to the end of `j`.
 *
 * This process continues until the length of `j` is equal to the length of `c`.
 *
 * @returns { array } The output returned by the `shuffleColrs` function is an array
 * of colors that have been shuffled randomly. The function takes an array of colors
 * as input and returns a new array with the same colors but rearranged randomly.
 */
function shuffleColrs() {
    let c = [color([0, 0, 255]), color([0, 255, 255]), color([0, 255, 0]), color([255, 255, 0]), color([255, 0, 0])];
    let j = [];
    let cl = c.length;
    while (j.length <= cl) {
        for (let k = 0; k < int(random(0, c.length)); k++) {
            c.push(c.shift());
        }
        j.push(c.pop());
    }
    return j;
}

/**
 * @description This function sets up the screen for a game or interactive experience
 * by defining a list of functions to be called during the gameplay.
 *
 * @returns { any } The output returned by the `setupScreen` function is not explicitly
 * defined or specified. However based on the code it seems that the function sets
 * up various functions or procedures that will be used to process an image.
 *
 * In essence this function sets up a list of functions to be executed at some point.
 */
function setupScreen() {
    if (DEBUG) {
        index = order.indexOf(cardslength - 1);
    } else {
        chooseIndex();
    }
    resizeCanvas(windowWidth, windowHeight);

    cnv = createGraphics(windowWidth, windowHeight);

    widthOnTwo = windowWidth / 2;
    heightOnTwo = windowHeight / 2;
    // pixelDensity(1);
    frameRate(24);
    modeSetup();
}

/**
 * @description This function displays a message to the console based on the value
 * of the "MODE" variable and then calls two functions ( setupCardsForBrowsing and
 * setupCardsForProblemDefinition) depending on that value.
 */
function modeSetup() {
    switch (MODE) {
        case BROWSE_DECK:
            setupCardsForBrowsing();
            break;
        case PROBLEM_DEFINITION:
            setupCardsForProblemDefinition();
            break;
        default:
            break;
    }
}

/**
 * @description This function shuffles an array by randomly sorting it using the
 * `sort()` method and the `Math.random()` function to create a new random order for
 * the array.
 * 
 * @param { array } array - The `array` input parameter in the given function
 * `shuffleArray()` is used to specify the array that will be shuffled. In other
 * words, it is the input array that will be sorted randomly using the `sort()` method
 * with a generator that returns a random number between -0.5 and 0.5.
 * 
 * @returns { array } The `shuffleArray` function takes an array as input and returns
 * a new array with the elements randomly rearranged. The `sort()` method is used to
 * randomize the order of the elements, and the `Math.random()` function is used to
 * generate a random number between -0.5 and 0.5 for each element.
 * 
 * The output returned by this function will be a new array with a randomized sequence
 * of elements, where no two adjacent elements are the same. For example, if the
 * original array is `[1, 2, 3, 4, 5]`, the output of `shuffleArray()` might be `[3,
 * 2, 5, 4, 1]`.
 */
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

/**
 * @description This function prepares the stage for a card game by:
 *
 * 1/ Creating an array of positions to shuffle (order).
 * 2/ Shuffling the order array if debug mode is off.
 * 3/ Setting up the screen and text alignment.
 * 4/ Assigning a background image to the body element based on a random number (0-5).
 *
 * @returns {  } The output of this function is an array of integers `order` with a
 * randomized order based on the length of the `cardslength` array. The function first
 * pushes the numbers from 0 to `cardslength - 1` into the `order` array and then
 * shuffles the array using the `shuffle` function if `DEBUG` is not enabled.
 */
function setup() {
    order = [];
    for (let i = 0; i < cardslength; i++) {
        order.push(i);
    }
    contradictions = [];
    for (let c in contradictionsLoader) {
        contradictions.push(contradictionsLoader[c]);
    }
    shuffleArray(contradictions);
    if (!DEBUG) {
        shuffle(order, true);
    }
    createCanvas(windowWidth, windowHeight);
    setupScreen();
    textAlign(LEFT, TOP);
    document.body.style.backgroundImage = "url('bg" + str(int(random(0, 5))) + ".gif')";
}

/**
 * @description This function draws the front side of a playing card and displays the
 * card number and title at the bottom. It also animates the card's image using the
 * `ani` variable. If the card index is less than 9 , it shows the number "0" followed
 * by the card index +1.
 *
 * @returns {  } The `draw` function takes no arguments and has no return statement.
 * It is a void function. Therefore it does not return anything.
 *
 * It clears the screen and draws elements on it. It is mainly responsible for display
 * cards when the card game application starts up.
 */
function draw() {
    clear();
    drawCnv(cnv);
    image(cnv, 0, 0);
}
