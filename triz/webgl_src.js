var DEBUG = true;
// DEBUG = false;
// divide, adapte, pre-empt, change property, change material, make efficient, make harmless, save labor

/**
 * @description The `keyPressed()` function is not defined or implemented.
 *
 * @returns { any } The function `keyPressed()` does not return any output or value.
 */
var cnv;
var mainCanvas;
var myShader;
function keyPressed() {
    // chooseIndex();
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
    myShader = loadShader("shader.vert", "shader.frag");
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
 * Here is a list of the functions that are pushed into the `functionList` array:
 *
 * 1/ `segmentation`
 * 2/ `takeout`
 * 3/ `localquality`
 * 4/ `asymmetry`
 * 5/ `merging`
 * 6/ `universality`
 * 7/ `matryoshka`
 * 8/ `antiweight`
 * 9/ `pantiactions`
 * 10/ `preactions`
 * 11/ `beforehandcushioning`
 * 12/ `equipotentiality`
 * 13/ `dothingsbackwards`
 * 14/ `curvature`
 * 15/ `dynamics`
 * 16/ `partialorexcessive`
 * 17/ `anotherdimension`
 * 18/ `vibrations`
 * 19/ `periodicaction`
 * 20/ `continuityofusefulaction`
 * 21/ `skipping`
 * 22/ `harmtobenefit`
 * 23/ `feedback`
 * 24/ `intermediary`
 * 25/ `selfservice`
 * 26/ `copying`
 * 27/ `cheapshort`
 * 28/ `mechanicalsubstitution`
 *
 * In essence this function sets up a list of functions to be executed at some point.
 */
function setupScreen() {
    if (DEBUG) {
        index = order.indexOf(cardslength - 1);
    } else {
        chooseIndex();
    }
    mainCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
    // mainCanvas.style('background-color', 'transparent');
    // mainCanvas.GL.clearColor(0, 0, 0, 0);
    // console.log(mainCanvas.GL)
    // let gl = mainCanvas._renderer.GL;
    // gl.clearColor(0, 0, 0, 0);

    cnv = createGraphics(windowWidth, windowHeight);

    widthOnTwo = windowWidth / 2;
    heightOnTwo = windowHeight / 2;
    drawCard();
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
    myShader.setUniform("texture", mainCanvas);
    myShader.setUniform("texelSize", [1.0/width, 1.0/height]);
    myShader.setUniform("res", [1 * width, 1 * height, 0]);
    myShader.setUniform("randomNumbers", [random(), random()]);
    myShader.setUniform("sinWave", 3 + sin(millis() / 600));
    drawCnv();
    image(cnv, -width / 2, -height / 2, width, height); // WEBGL canvas
    
}

function drawCnv() {
    let curr = order[index];
    cnv.textAlign(LEFT, TOP);
    cnv.clear();
    cnv.image(cardDeck, 0, 0);
    cnv.image(card, 0, 0);
    cnv.fill(0);
    cnv.textSize(titleTextSize);
    cnv.textStyle(BOLD);
    cnv.text(cards[curr]["title"], textX, textY, textW);
    let tTextY = textY + titleTextSize;
    let tL = cnv.textWidth(cards[curr]["title"]);
    while (tL > textW) {
        tTextY += titleTextSize;
        tL -= textW;
    }
    tTextY += titleTextSize * 0.5;
    cnv.textStyle(NORMAL);
    cnv.textSize(tTextSize);
    cnv.text(cards[curr]["text"], textX, tTextY, textW);
    functionList[curr]();
    cnv.fill(220);
    cnv.textStyle(BOLD);
    cnv.textSize(titleTextSize);
    cnv.textAlign(RIGHT, BOTTOM);
    // console.log(index);
    if (curr < 9) {
        cnv.text("0" + str(curr + 1), logoX, logoY);
    } else {
        cnv.text(curr + 1, logoX, logoY);
    }
    cnv.image(ani, aniX, aniY);
    if (DEBUG) {
        cnv.fill(0);
        cnv.stroke(255);
        cnv.strokeWeight(1);
        cnv.textAlign(LEFT, TOP);
        cnv.text("TESTING", 10, 10);
    }
}

/**
 * @description The `drawCard` function prepares a graphical card with shuffled
 * background colors and displays a text logo using GPU-accelerated graphics for
 * animations. It sets up a graphics deck for creating cards with the correct dimensions
 * based on aspect ratios.
 *
 * @returns { object } The `drawCard()` function returns a graphics object (`ani`)
 * and a set of properties for layout anchoring (`rCol`, `cardDeck`, `card`,
 * `titleTextSize`, `tTextSize`, `logoX`, `logoY`, `textX`, `textY`, `cr`, `icr`,
 * `gap`, `igap`, `gap2`, `gap3`, `gap4`, `gap34`, `gapOn2`, `gapOn3`, `gapOn4`,
 * `gapOn6`, `aniWidthOn2`, `aniHeightOn2`, `aniWidthOn3`, `aniHeightOn3`, `aniWidthOn4`,
 * `aniHeightOn4`).
 *
 * The function is responsible for generating a rectangular card with rounded corners
 * and customizing text elements. The resulting graphics object `ani` includes the
 * card deck's backdrop with five transparent shades of the chosen color plus logotype
 * lettering atop it (with custom text styling) at an optional location inside or
 * outside an image box that serves as the overall backing.
 *
 * Card characteristics like y ratio and margin control its appearance regarding
 * height/width proportion.  Various gaps measure anchor placement to ensure text
 * positioning appropriately inside specific components like cards without becoming
 * excessively long or obscured during subsequent animation steps by determining how
 * many anchors should be placed around a particular area; all relevant variables
 * that influence layout within this specific implementation of creating custom digital
 * trading cards using graphics objects are neatly organized within `rCol`, 'cardDeck'',
 * and card'. The result is returned so other parts of the program may modify or draw
 * from these variables later if needed.
 */
function drawCard() {
    aniLayers = {};
    rCol = shuffleColrs();
    cardDeck = createGraphics(windowWidth, windowHeight);
    card = createGraphics(windowWidth, windowHeight);
    let y_ratio = 8.8;
    let x_ratio = 6.3;
    let margin = 0.85;
    let h = windowHeight * margin;
    let w = (h / y_ratio) * x_ratio;
    if (w > windowWidth * margin) {
        w = windowWidth * margin;
        h = (w / x_ratio) * y_ratio;
    }
    let rad = 0.05 * w;
    mStroke = rad * 0.25;
    cardDeck.clear();
    cardDeck.rectMode(CENTER);
    cardDeck.noStroke();
    let c = [
        [0, 0, 255],
        [0, 255, 255],
        [0, 255, 0],
        [255, 255, 0],
        [255, 0, 0],
        [255, 255, 255],
    ];
    let px = widthOnTwo + c.length * mStroke;
    let py = heightOnTwo + c.length * mStroke;
    for (let i = 0; i < c.length; i++) {
        cardDeck.fill(color(c[i]));
        px -= mStroke;
        py -= mStroke;
        cardDeck.rect(int(px), int(py), w, h, rad);
    }
    card.rectMode(CENTER);
    card.noStroke();
    card.fill(255);
    card.rect(int(px), int(py), w, h, rad);
    card.stroke(0);
    card.strokeWeight(mStroke);
    card.rect(int(px), int(py), w - rad, h - rad, rad * 0.6);
    titleTextSize = int(h / 17);
    tTextSize = int(titleTextSize / 2);
    let l1 = px - w * 0.45;
    let l2 = px + w * 0.45;
    card.line(l1, py, l2, py);
    card.noStroke();
    card.fill(230);
    card.textStyle(BOLD);
    card.textSize(0.75 * titleTextSize);
    logoX = widthOnTwo + w / 2 - rad - 1.6 * titleTextSize;
    logoY = heightOnTwo + h / 2 - rad;
    card.textSize(tTextSize);
    card.text("TRIZ40", logoX, logoY);
    logoY -= tTextSize * 0.5;
    logoX += 1.6 * titleTextSize;
    textX = l1;
    textY = py + mStroke;
    textW = 0.9 * w;
    ani = createGraphics(int(w * 0.9), int(h * 0.45));
    aniX = l1;
    aniY = heightOnTwo - int(0.47 * h);
    cr = ani.height * 0.8;
    icr = ani.height * 0.2;
    gap = (ani.width - ani.height) / 2;
    igap = ani.width - gap;
    gap2 = gap * 2;
    gap3 = gap * 3;
    gap4 = gap * 4;
    gap34 = 0.75 * gap;
    gapOn2 = gap / 2;
    gapOn3 = gap / 3;
    gapOn4 = gap / 4;
    gapOn6 = gap / 6;
    aniWidthOn2 = ani.width / 2;
    aniHeightOn2 = ani.height / 2;
    aniWidthOn3 = ani.width / 3;
    aniHeightOn3 = ani.height / 3;
    aniWidthOn4 = ani.width / 4;
    aniHeightOn4 = ani.height / 4;
}
