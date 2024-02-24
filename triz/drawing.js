/**
 * @description This drawCnv() function is responsible for rendering the UI and
 * animation of a card deck-based game. It takes the current drawn card and some
 * configuration data as input and updates the canvas context with appropriate graphics
 * and text according to the following steps:
 *
 * - Clearing the canvas
 * - Drawing the entire deck's image
 * - Placing and styling the drawn card's image
 * - Displaying the title and text of the current card at an appropriately measured
 * position
 * - Calls a function specific to the currently drawn card
 * - Updates an animation progress indicator using another canvas image
 */
function drawCnv(cnv) {
    cnv.clear();
    switch (MODE) {
        case BROWSE_DECK:
            drawBrowseDeck(cnv);
            break;
        case PROBLEM_DEFINITION:
            drawProblemDefinitionDeck(cnv)
            break;
        default:
            break;
    }

    if (DEBUG) {
        cnv.fill(0);
        cnv.stroke(255);
        cnv.strokeWeight(1);
        cnv.textAlign(LEFT, TOP);
        cnv.text("TESTING", 10, 10);
    }
}

/**
 * @description This function draws the front side of a card. It loads the title and
 * text for the current card from an array 'cards', draws both using text functions
 * provided by the Canvas object.  It then passes the title to another function (which
 * is not shown), draws the back of the same card at logoY coordinate using an image
 * object from the array 'ani' at logoX location.,
 * 
 * @param { object } cnv - The input parameter 'cnv' represents the canvas that the
 * functions draw on. The other parameters can be found within the context of this
 * answer at:  https://stackoverflow.com/questions/67382139/what-does-the-cnv-input-parameter-do-in-this-function-answer-concisely
 * .
 */
function drawBrowseDeck(cnv) {
    let curr = order[index];
    cnv.textAlign(LEFT, TOP);
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
}

/**
 * @description The `drawCard` function prepares a graphical card with shuffled
 * background colors and displays a text logo using GPU-accelerated graphics for
 * animations. It sets up a graphics deck for creating cards with the correct dimensions
 * based on aspect ratios.
 *
 * @returns { object } The `setupCardsForBrowsing()` function returns a graphics object (`ani`)
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
function setupCardsForBrowsing() {
    aniLayers = {};
    rCol = shuffleColrs();
    
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
    if (cardDeck) {
        cardDeck.clear();
    }
    [cardDeck, px, py] = createCardDeck(w, h, rad, mStroke);
    card = createGraphics(windowWidth, windowHeight);
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

/**
 * @description This function creates a temporary 2D graphics object called "cardDeck"
 * with the dimensions of the game window's width and height (w and h) and a corner
 * radius (rad). The cardBGColors are a list of background colors for each card. The
 * function clears the graphics object and sets its rect mode to center and no stroke.
 * It then loops through each color on the cardBackgroundColors list and creates a
 * rectangle with that color and size (w and h) minus two times the marginStroke
 * around each card with x-position progressing from the window's left border to the
 * right and y-position progressing top down. The function returns an array of [cardDeck
 * object], x-coord of the first card border(px), y-coord of the first card border(py).
 * 
 * @param { number } w - In the "createCardDeck" function `w` is a parameter used to
 * represent width of each card rectangles drawn inside the graphics temp canvas using
 * "rect" function which will set its position. This way every card would have similar
 * proportions while being drawn regardless the size screen being used
 * 
 * @param {  } h - Here's what I found:
 * 
 * In this context of the createCardDeck function call h represents half (or half a
 * dimension), because within this code snippet for...of loop h becomes a pixel
 * distance subtracted on the y-axis (vertically down) after calculating py by halfing
 * heightOnTwo.
 * 
 * @param {  } rad - Rad is used to set rounded corners on each card when it is created
 * 
 * @returns { object } This function returns three items: 1) a graphics object created
 * with the canvas context of the current web page using the specified window width
 * and height; 2) the x-position of the last card on the bottom of the deck (calculated
 * based on the number of cards and their size); and 3) the y-position of the last
 * card on the bottom of the deck.
 */
function createCardDeck(w, h, rad) {
    tempCardDeck = createGraphics(windowWidth, windowHeight);
    tempCardDeck.clear();
    tempCardDeck.rectMode(CENTER);
    tempCardDeck.noStroke();
    let px = widthOnTwo + cardBGColors.length * mStroke;
    let py = heightOnTwo + cardBGColors.length * mStroke;
    for (let i = 0; i < cardBGColors.length; i++) {
        tempCardDeck.fill(color(cardBGColors[i]));
        px -= mStroke;
        py -= mStroke;
        tempCardDeck.rect(int(px), int(py), w, h, rad);
    }
    return [tempCardDeck, px, py]
}

/**
 * @description The provided JavaScript function creates a new graphics canvas element
 * with rounded corners using specified color parameters 'c1' and optionally 'c2'.
 * If the parameter 'c2' is included as true within its parameter list (the second
 * argument), it will create bordering lines that are also round. Specifically designed
 * to function within the code that utilizes p5 library functions.
 * 
 * @param {  } w - Based on the code provided the input parameter "w" represents the
 * width of the rectangle to be created within the draw function of the created
 * graphics object. In simpler words: "w" is representing the width of the card.
 * 
 * @param { integer } h - The `h` parameter is the height of the card being drawn.
 * 
 * @param { number } rad - Based on the given code snippet the `rad` input parameter
 * is a value used to define the corner radius of the card when drawn with rect mode
 * center.
 * 
 * @param { object } c1 - In this `createMoveableCard()` function:
 * 
 * ... `c1` represents a color or shade fill (i.e. "centre-filled").
 * 
 * @param { integer } c2 - The `c2` parameter sets a second fill color for a smaller
 * inner rect on the moveable card.
 * 
 * @param { false } pattern - The `pattern` parameter allows you to pass a pattern
 * or color to fill the card with instead of a single color. This means you can make
 * cards that are striped or checkered.
 * 
 * @returns {  } The function creates a new graphics object called `tempCardDeck`
 * that has the same size as the screen. It fills the background of the card with the
 * first color (`c1`), and then draws a rounded rectangle with the second color (`c2`)
 * inside it with a stroke weight of `mStroke`. The output returned by the function
 * is the created `tempCardDeck` graphics object.
 */
function createMoveableCard(w, h, rad, c1, c2, pattern=false) {
    tempCardDeck = createGraphics(windowWidth, windowHeight);
    tempCardDeck.clear();
    tempCardDeck.rectMode(CENTER);
    tempCardDeck.noStroke();
    tempCardDeck.fill(c1);
    tempCardDeck.rect(int(widthOnTwo), int(heightOnTwo), w, h, rad);
    if (c2) {
        tempCardDeck.stroke(c2);
        tempCardDeck.strokeWeight(mStroke);
        tempCardDeck.rect(int(px), int(py), w - rad, h - rad, rad * 0.6);
    }
    tempCardDeck.rectMode(CENTER);
    return tempCardDeck
}

/**
 * @description This function prepares the display for the TRIZ 40 game by defining
 * various variables related to the card deck's dimensions and color palettes.
 */
function setupCardsForProblemDefinition() {
    aniLayers = {};
    rCol = shuffleColrs();
    
    let y_ratio = 2.8;//6.3;
    let x_ratio = 4;//8.8;
    let margin = 0.3;
    let h = windowHeight * margin;
    let w = (h / y_ratio) * x_ratio;
    if (w > windowWidth * margin) {
        w = windowWidth * margin;
        h = (w / x_ratio) * y_ratio;
    }
    let rad = 0.05 * w;
    mStroke = rad * 0.25;
    [d1, px, py] = createCardDeck(w, h, rad, mStroke);
    d2 = createMoveableCard(w, h, rad, color(255, 255, 255, 127));
    d3 = createMoveableCard(w, h, rad, color(255, 255, 255), color(0));
    moveableCard = d3;
    cardDeck = createGraphics(windowWidth, windowHeight);

    const wi = 0.9 * windowWidth;
    const hi = 0.9 * windowHeight;
    quadTargets = [];
    quadTargets.push([-wi*0.25, -hi * 0.25]);
    quadTargets.push([wi*0.25, -hi * 0.25]);
    quadTargets.push([-wi*0.25, hi * 0.25]);
    quadTargets.push([wi*0.25, hi * 0.25]);

    cardDeck.image(d1, quadTargets[0][0], quadTargets[0][1]);
    cardDeck.image(d3, quadTargets[1][0], quadTargets[1][1]);
    cardDeck.image(d2, quadTargets[2][0], quadTargets[2][1]);
    cardDeck.image(d2, quadTargets[3][0], quadTargets[3][1]);
    
    textW = 0.9 * w;
    textX = quadTargets[0][0] + windowWidth/2 - textW/2;
    textY = quadTargets[0][1] + windowHeight/2;
    moveableCard.noStroke();
    moveableCard.fill(230);
    moveableCard.textStyle(BOLD);
    moveableCard.textSize(0.75 * titleTextSize);
    logoX = widthOnTwo + w / 2 - rad - 1.6 * titleTextSize;
    logoY = heightOnTwo + h / 2 - rad;
    moveableCard.textSize(tTextSize);
    moveableCard.text("TRIZ40", logoX, logoY);
    cardDeck.image(moveableCard, -wi*0.25, -hi * 0.25);
}

/**
 * @description This function draws a problem definition deck on a canvas (cnv) by:
 * 1/ Imaging the cardDeck at position (0，0) of the canvas
 * 2/ Filling the entire canvas with the background color (i.e., clearing it out first).
 * 3/ Aligning text to center both horizontally and vertically using two variables.
 * 4/ Specifying font size using another variable titleTextSize.
 * 5/ Setting text style bold and drawing text from the contradictions[2] array at
 * textX / textY / textW points respectively
 * 
 * @param {  } cnv - In the `drawProblemDefinitionDeck()` function shown here:
 * 
 * <https://stackoverflow.com/questions/63894108/what-does-the-cnv-input-parameter-do-in-this-function-answer-concisely>
 * 
 * The input parameter `cnv` is the canvas object being used to draw the problem
 * definition deck.
 */
function drawProblemDefinitionDeck(cnv) {
    cnv.image(cardDeck, 0, 0);
    cnv.fill(0);
    cnv.textAlign(CENTER, CENTER);
    cnv.textSize(titleTextSize);
    cnv.textStyle(BOLD);
    cnv.text(contradictions[2], int(textX), int(textY), int(textW));
}
