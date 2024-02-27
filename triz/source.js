var DEBUG = true;
// DEBUG = false;
// divide, adapte, pre-empt, change property, change material, make efficient, make harmless, save labor

const BROWSE_DECK = 0;
const PROBLEM_DEFINITION = 1;

const GROW = 0;
const SHRINK = 1;
const DISCARD = 2;
const NO_ANIMATION = -1;
const CONTRADICTION_COUNT = 39;

var MODE = BROWSE_DECK;

/**
 * @description The `keyPressed()` function is not defined or implemented.
 *
 * @returns { any } The function `keyPressed()` does not return any output or value.
 */
var cnv;
var mainCanvas;
var contradictions;
var cardMoveAnimation = 0;
var cardMoveAnimationDuration = 5.0;
var cardMoveTarget = -1;
var moveableCard, contradictionCurrentX, contradictionCurrentY;
var quadTargets = [];
var contradictionTracker = 0;
var contradictionGrow = [];
var contradictionShrink = [];
var contradictionNA = [];

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
            break;
        case "Digit2":
            MODE = PROBLEM_DEFINITION;
            break;
        case "ArrowLeft":
            if (MODE == PROBLEM_DEFINITION) {
                discardContradiction();
                cardMoveAnimation = cardMoveAnimationDuration;
            }
            break;
        case "ArrowUp":
            if (MODE == PROBLEM_DEFINITION) {
                growContradiction();
                cardMoveAnimation = cardMoveAnimationDuration;
            }
            break;
        case "ArrowDown":
            if (MODE == PROBLEM_DEFINITION) {
                shrinkContradiction();
                cardMoveAnimation = cardMoveAnimationDuration;
            }
            break;
        default:
            doSomething = false;
            break;
    }
    if (doSomething) {
        modeSetup();
    }
}

<<<<<<< Updated upstream
/**
 * @description This function increments a counter (`contradictionTracker`) for the
 * number of contradictions found in the game, and then pushes that value onto an
 * array (`contradictionNA`) along with the current card move target (`cardMoveTarget`,
 * which is set to `DISCARD`). In other words, it keeps track of the number of
 * contradictions found and what move was most recently made.
 */
function discardContradiction(){
    contradictionTracker += 1;
=======
/**
 * @description This function increments the `contradictionTracker` variable by 1
 * each time it detects a contradiction, and caps it at `CONTRADICTION_COUNT`. It
 * also sets the `cardMoveTarget` to `DISCARD`.
 */
/**
 * @description This function grows a contradiction in a system by incrementing a
 * tracker variable and pushing the updated value onto an array, while also setting
 * a target variable to indicate the direction of movement (in this case, growth).
 * The function repeats this process until the maximum allowed value for the tracker
 * is reached.
 */
/**
 * @description This function shrinks the `contradictionTracker` variable by taking
 * its minimum value between `contradictionTracker+1` and `CONTRADICTION_COUNT`. The
 * result is stored in the `contradictionShrink` array, and the `cardMoveTarget`
 * variable is set to `SHRINK`.
 */
function discardContradiction() {
>>>>>>> Stashed changes
    contradictionNA.push(contradictionTracker);
    contradictionTracker = min(contradictionTracker+1, CONTRADICTION_COUNT);
    cardMoveTarget = DISCARD;
}

<<<<<<< Updated upstream
/**
 * @description This function grows the `contradictionTracker` by `1` and updates the
 * `cardMoveTarget` to `GROW`. It also pushes the current value of `contraditionTracker`
 * into an array called `contradictionGrow`.
 */
function growContradiction(){
=======
function growContradiction() {
>>>>>>> Stashed changes
    contradictionGrow.push(contradictionTracker);
    contradictionTracker = min(contradictionTracker+1, CONTRADICTION_COUNT);
    cardMoveTarget = GROW;
}

<<<<<<< Updated upstream
/**
 * @description This function takes in a variable `contradictionTracker` and adds it
 * to an array called `contradictionShrink`. It then increments the value of
 * `contradictionTracker` by 1, and sets the `cardMoveTarget` variable to `SHRINK`.
 * In summary, this function is shrinking a contradiction.
 */
function shrinkContradiction(){
=======
function shrinkContradiction() {
>>>>>>> Stashed changes
    contradictionShrink.push(contradictionTracker);
    contradictionTracker = min(contradictionTracker+1, CONTRADICTION_COUNT);
    cardMoveTarget = SHRINK;
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
    chooseIndex();
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
    contradictions = loadJSON("contradiction_sources.json");
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
    modeSetup();
}

/**
 * @description This function displays a message to the console based on the value
 * of the "MODE" variable and then calls two functions ( setupCardsForBrowsing and
 * setupCardsForProblemDefinition) depending on that value.
 */
function modeSetup() {
    console.log("MODE: ");
    switch (MODE) {
        case BROWSE_DECK:
            console.log("BROWSE_DECK");
            setupCardsForBrowsing();
            break;
        case PROBLEM_DEFINITION:
            console.log("PROBLEM_DEFINITION");
            setupCardsForProblemDefinition();
            break;
        default:
            break;
    }
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
    if (!DEBUG) {
        shuffle(order, true);
    }
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
