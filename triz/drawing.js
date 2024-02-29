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
            drawProblemDefinitionDeck(cnv);
            break;
        default:
            break;
    }

    if (DEBUG) {
        cnv.fill(0);
        cnv.stroke(255);
        cnv.strokeWeight(1);
        cnv.textSize(titleTextSize);
        cnv.textAlign(LEFT, TOP);
        cnv.text("TESTING", 10, 10);
        cnv.text(int(frameRate()), 10, titleTextSize + 10);
    }
}

/**
 * @description This function creates and animates a deck of cards. It does the following:
 * 
 * 1/ Draws an image of a card at the top of the screen.
 * 2/ Displays the card's title and text.
 * 3/ Calls a function (`functionList[curr]()`) that draws an animation of a particular
 * card (determined by the value of `curr`).
 * 4/ Draws an image of a logo at the bottom of the screen.
 * 5/ Updates the position of the logo based on the current card number.
 * 
 * @param { array } cnv - The `cnv` input parameter is likely the canvas context for
 * the current deck being displayed. It is used to draw elements on the canvas, such
 * as images and text. The `drawBrowseDeck()` function manipulates the canvas context
 * to render the brows deck, including drawing images, text, and animations.
 */
function drawBrowseDeck(cnv) {
    let curr = order[index];
    textAlign(LEFT, TOP);
    image(cardDeck, 0, 0);
    image(card, 0, 0);
    fill(0);
    textSize(titleTextSize);
    textStyle(BOLD);
    text(cards[curr]["title"], textX, textY, textW);
    let tTextY = textY + titleTextSize;
    let tL = textWidth(cards[curr]["title"]);
    while (tL > textW) {
        tTextY += titleTextSize;
        tL -= textW;
    }
    tTextY += titleTextSize * 0.5;
    textStyle(NORMAL);
    textSize(tTextSize);
    text(cards[curr]["text"], textX, tTextY, textW);
    functionList[curr](); // where ani is drawn
    fill(220);
    textStyle(BOLD);
    textSize(titleTextSize);
    textAlign(RIGHT, BOTTOM);
    if (curr < 9) {
        text("0" + str(curr + 1), logoX, logoY);
    } else {
        text(curr + 1, logoX, logoY);
    }
    // noSmooth();
    image(ani, aniX, aniY, ani.width * aniScaleFactor, ani.height * aniScaleFactor);
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
    titleTextSize = int(h / 17);
    tTextSize = int(titleTextSize / 2);
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
    ani = createGraphics(int((w * 0.9) / aniScaleFactor), int((h * 0.45) / aniScaleFactor));
    mStroke = int(mStroke / aniScaleFactor);
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
 * @description This function creates a new graphics object (tempCardDeck) and clears
 * its contents, sets the drawing mode to center, and sets the stroke weight to 0.
 * Then, it iterates over an array of background colors for cards (cardBGColors) and
 * draws a card-sized rectangle with each color using the fill() method. Finally, it
 * returns the tempCardDeck object and two additional variables (px and py) that
 * represent the starting positions of the drawn rectangles.
 * 
 * @param { number } w - In the `createCardDeck` function, the `w` input parameter
 * represents the width of the card deck. It is used to determine the size of the
 * rectangle that will be drawn on the graphics canvas to create each card in the
 * deck. The value of `w` is passed as an argument to the `rect()` method when creating
 * each card, and it determines the width of the rectangular shape that will be filled
 * with a color representing the background of each card.
 * 
 * @param { number } h - The `h` input parameter in the `createCardDeck()` function
 * controls the height of each card background rectangle that is drawn in the deck.
 * A larger value of `h` will result in taller cards, while a smaller value will
 * result in shorter cards.
 * 
 * @param { number } rad - The `rad` input parameter is used to set the radius of the
 * rounded corners of each card in the deck. It takes a value between 0 and 1,
 * inclusive, which is then applied to the radius of the `rect()` method call. This
 * allows for the creation of cards with rounded corners.
 * 
 * @returns { object } The `createCardDeck` function returns a 2D graphics object
 * (temporary deck) and two coordinates (px and py) that represent the top-left corner
 * of the deck and its size, respectively. The returned value can be described as follows:
 * 
 * 	- `tempCardDeck`: A 2D graphics object created in memory with a width and height
 * equal to the window width and height, respectively. The object is cleared and no
 * stroke is drawn.
 * 	- `px`: An integer representing the distance from the top-left corner of the deck
 * to the start of the first card.
 * 	- `py`: An integer representing the distance from the top-left corner of the deck
 * to the start of the first card.
 * 
 * In summary, the function creates a virtual deck of cards in memory and returns the
 * deck's position and size relative to the window boundaries.
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
    return [tempCardDeck, px, py];
}

/**
 * @description This function creates a moveable card with the given dimensions,
 * radius, and colors for the background and any text or images. It also has an
 * optional pattern parameter that allows you to specify a separate fill color for
 * the inner circle. The return value is the tempCardDeck object, which can be used
 * to draw the card on the screen.
 * 
 * @param { integer } w - In the `createMoveableCard()` function, the `w` input
 * parameter represents the width of the card. It is used to set the width of the
 * rectangle that will be drawn on the temporary graphics object `tempCardDeck`.
 * 
 * @param {  } h - The `h` input parameter in the `createMoveableCard()` function
 * determines the height of the card rectangle that is drawn on the temporary graphics
 * object.
 * 
 * @param {  } rad - The `rad` input parameter in the `createMoveableCard` function
 * controls the size of the card's corner radius. It sets the radius of the rounded
 * corners of the card.
 * 
 * @param {  } c1 - The `c1` input parameter sets the color of the card's background.
 * 
 * @param { string } c2 - In the provided code, `c2` is an optional input parameter
 * that represents a different fill color for the card's inner shape, if it is
 * specified. When `c2` is provided, it will be used to draw a smaller inner rectangle
 * within the main rectangular shape, with a stroke of the same width as the main
 * shape. The `mStroke` variable controls the thickness of the stroke.
 * 
 * @param { false } pattern - The `pattern` input parameter in the `createMoveableCard()`
 * function allows the user to specify whether or not a pattern should be drawn on
 * the card. If `pattern` is `true`, then a small pattern will be drawn inside the
 * card's border, otherwise no pattern will be drawn.
 * 
 * @returns { object } The `createMoveableCard` function returns a `Graphics` object,
 * which is an object that represents a graphics canvas in Processing. The object has
 * several methods and properties that can be used to draw and manipulate objects on
 * the canvas.
 * 
 * The output of this function is a `Graphics` object that can be used to draw a
 * moveable card with the specified width, height, radius, color, and pattern (if
 * provided). The object returned by the function can be used to draw the card, as
 * well as to move it around on the canvas using the `set()` method.
 */
function createMoveableCard(w, h, rad, c1, c2, pattern = false) {
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
    return tempCardDeck;
}

let discardX;
let discardY;
let growX;
let growY;
let shrinkX;
let shrinkY;

/**
 * @description This function creates the visual elements and behaviors of a TriZ40
 * game deck. Specifically:
 * 
 * 1/ It defines various constants such as window width, height, title text size, etc.
 * 2/ It creates a button card red and green, which are displayed at specific positions
 * on the screen when the corresponding buttons are pressed.
 * 3/ It sets up the logo, text, and images for the game, including the main title,
 * grow/shrink text, undo/done buttons, and various other cards.
 * 4/ It defines the cardDeck class, which takes in quadTargets as an argument and
 * sets up the image display of each card at its specified position.
 * 5/ Finally, it sets the cardMoveTarget to SETUP, indicating that the game has begun
 * and the player can interact with the cards by pressing buttons or dragging them.
 */
function setupCardsForProblemDefinition() {
    buttons = [];
    let y_ratio = 2.8; //6.3;
    let x_ratio = 4; //8.8;
    let margin = 0.3;
    let h = windowHeight * margin;
    let w = (h / y_ratio) * x_ratio;
    if (w > windowWidth * margin) {
        w = windowWidth * margin;
        h = (w / x_ratio) * y_ratio;
    }
    titleTextSize = int(h / 8);
    tTextSize = int(titleTextSize / 2);
    let rad = 0.05 * w;
    mStroke = rad * 0.25;
    [d1, px, py] = createCardDeck(w, h, rad, mStroke);
    d2 = createMoveableCard(w, h, rad, color(255, 255, 255, 127));
    moveableCard = createMoveableCard(w, h, rad, color(255, 255, 255), color(0));

    titleCard = createMoveableCard(w * 0.35, h, rad, color(255, 255, 255), color(0));

    let buttonCardRed = createMoveableCard(w * 0.35, h * 0.35, rad, color(255, 255, 255), color(255, 0, 0));
    let buttonCardGreen = createMoveableCard(w * 0.35, h * 0.35, rad, color(255, 255, 255), color(0, 255, 0));

    cardDeck = createGraphics(windowWidth, windowHeight);

    const wi = 0.9 * windowWidth;
    const hi = 0.9 * windowHeight;
    quadTargets = [];
    quadTargets.push([-w, -hi * 0.25, w, h]); // contradiction source
    quadTargets.push([quadTargets[0][0], hi * 0.2, w, h]); // not applicable
    quadTargets.push([w * 0.5, quadTargets[0][1], w, h]); //grow
    quadTargets.push([quadTargets[2][0], quadTargets[1][1], w, h]); //shrink
    quadTargets.push([quadTargets[2][0] + w * 0.75, quadTargets[2][1], w * .35, h]);
    quadTargets.push([quadTargets[4][0], quadTargets[3][1], w * .35, h]);
    quadTargets.push([quadTargets[0][0] - (quadTargets[0][2] - w*.35)/2, quadTargets[1][1] + quadTargets[1][3] * .75, w * .35, h* .35]);
    quadTargets.push([quadTargets[0][0] + (quadTargets[0][2] - w*.35)/2, quadTargets[1][1] + quadTargets[1][3] * .75, w * .35, h* .35]);

    for (let t of quadTargets) {
        buttons.push(new Button(t[0] + width / 2 - t[3] * 0.725, t[1] + height / 2 - t[3] / 2, t[2], t[3]));
    }
    buttons[4].x += buttons[4].w;
    buttons[5].x += buttons[5].w;
    buttons[0].action = undo;
    buttons[1].action = discardContradiction;
    buttons[2].action = growContradiction;
    buttons[3].action = shrinkContradiction;
    buttons[4].action = growContradiction;
    buttons[5].action = shrinkContradiction;
    buttons[6].action = undo;
    buttons[7].action = contradictionsDone;

    textW = 0.9 * w;
    textX = quadTargets[0][0] + windowWidth / 2 - textW / 2;
    textY = quadTargets[0][1] + windowHeight / 2;
    discardX = width / 2 + quadTargets[1][0] - textW / 2;
    discardY = height / 2 + quadTargets[1][1];
    growX = width / 2 + quadTargets[2][0] - textW / 2;
    growY = height / 2 + quadTargets[2][1];
    shrinkX = width / 2 + quadTargets[3][0] - textW / 2;
    shrinkY = height / 2 + quadTargets[3][1];
    moveableCard.noStroke();
    moveableCard.fill(230);
    moveableCard.textStyle(BOLD);
    moveableCard.textSize(0.75 * titleTextSize);
    logoX = widthOnTwo + w / 2 - rad - 1.6 * titleTextSize;
    logoY = heightOnTwo + h / 2 - rad;
    moveableCard.textSize(tTextSize);
    moveableCard.text("TRIZ40", logoX, logoY);
    cardDeck.image(d1, quadTargets[0][0], quadTargets[0][1]);
    cardDeck.image(moveableCard, quadTargets[0][0], quadTargets[0][1]);
    cardDeck.image(moveableCard, quadTargets[1][0], quadTargets[1][1]);

    cardDeck.image(d2, quadTargets[2][0], quadTargets[2][1]);
    cardDeck.image(titleCard, quadTargets[4][0], quadTargets[4][1]);

    cardDeck.image(d2, quadTargets[3][0], quadTargets[3][1]);
    cardDeck.image(titleCard, quadTargets[5][0], quadTargets[5][1]);
    cardDeck.image(buttonCardRed, quadTargets[6][0], quadTargets[6][1]);
    cardDeck.image(buttonCardGreen, quadTargets[7][0], quadTargets[7][1]);

    cardDeck.noStroke();
    cardDeck.fill(0);
    cardDeck.textSize(titleTextSize);
    cardDeck.textStyle(BOLD);
    cardDeck.textAlign(CENTER, CENTER);

    let tX = widthOnTwo + quadTargets[6][0]
    let tY = heightOnTwo + quadTargets[6][1]
    cardDeck.text("UNDO", tX, tY);

    tX = widthOnTwo + quadTargets[7][0]
    tY = heightOnTwo + quadTargets[7][1]
    cardDeck.text("DONE", tX, tY);

    tX = width / 2 + quadTargets[4][0];
    tY = height / 2 + quadTargets[4][1] - titleTextSize / 2;
    cardDeck.textSize(titleTextSize);
    cardDeck.textStyle(BOLD);
    cardDeck.text("Grow", tX, tY);
    cardDeck.textSize(tTextSize);
    cardDeck.textStyle(ITALIC);
    cardDeck.text("(Up)", tX, tY + titleTextSize);

    tX = width / 2 + quadTargets[5][0];
    tY = height / 2 + quadTargets[5][1] - titleTextSize / 2;
    cardDeck.textSize(titleTextSize);
    cardDeck.textStyle(BOLD);
    cardDeck.text("Shrink", tX, tY);
    cardDeck.textSize(tTextSize);
    cardDeck.textStyle(ITALIC);
    cardDeck.text("(Down)", tX, tY + titleTextSize);
    cardMoveTarget = SETUP;
}

/**
 * @description This function draws a problem definition deck on the screen. It
 * performs the following actions:
 * 
 * 1/ Image(cardDeck, 0, 0): Draws the card deck image on the screen.
 * 2/ Fill(0): Sets the background color to black.
 * 3/ TextAlign(CENTER, CENTER): Centers the text horizontally and vertically.
 * 4/ TextSize(titleTextSize): Sets the font size of the deck's title.
 * 5/ TextStyle(BOLD): Sets the font style of the deck's title to bold.
 * 6/ Let tempTracker = contradictionTracker; if (cardMoveAnimation == 0) {...}:
 * Tracks the current card position and updates its position based on the animation.
 * 7/ Let lastGrowItem = contradictionGrow[contradictionGrow.length - 1]; let
 * lastShrinkItem = contradictionShrink[contradictionShrink.length - 1]: Updates the
 * positions of the growing and shrinking cards.
 * 8/ Let interpolationFactor = (cardMoveAnimationDuration - cardMoveAnimation) /
 * cardMoveAnimationDuration: Calculates the interpolation factor for the current
 * card position update.
 * 9/ image(moveableCard, quadTargets[2][0], quadTargets[2][1]): Draws the moveable
 * card at the current position of the contradictionary.
 * 10/ Text(contradictions[tempTracker], contradictionCurrentX, contradictionCurrentY,
 * int(textW)): Displays the text for the current card.
 * 11/ image(moveableCard, quadTargets[3][0], quadTargets[3][1]): Draws the moveable
 * card at the current position of the contradictions.
 * 12/ Let tX = width / 2 + quadTargets[1][0]: Calculates the x-coordinate for the
 * "Not Applicable" text.
 * 13/ Text("Not Applicable", tX, tY): Displays the "Not Applicable" text.
 * 14/ Let tTextSize = titleTextSize + 2: Sets the font size of the "Not Applicable"
 * text to the same as the title font size plus 2 points.
 * 15/ Text("(Left)", tX, tY + titleTextSize): Displays the "()" text for the left alignment.
 * 
 * @param {  } cnv - The `cnv` input parameter in the `drawProblemDefinitionDeck`
 * function appears to be a reference to the Canvas element that the function is being
 * called on. It allows the function to access and modify the content of the Canvas
 * element. Specifically, it provides the address of the canvas context, which the
 * function uses to draw images, text, and other graphical elements on the canvas.
 */
function drawProblemDefinitionDeck(cnv) {
    image(cardDeck, 0, 0);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(titleTextSize);
    textStyle(BOLD);
    let tempTracker = contradictionTracker;
    if (cardMoveAnimation == 0) {
        contradictionCurrentX = textX;
        contradictionCurrentY = textY;
        cardMoveTarget = NO_ANIMATION;
    } else {
        cardMoveAnimation -= 1;
        text(contradictions[tempTracker], textX, textY, int(textW));
        tempTracker -= 1;
    }
    let lastGrowItem = contradictionGrow[contradictionGrow.length - 1];
    let lastShrinkItem = contradictionShrink[contradictionShrink.length - 1];
    let interpolationFactor = 1;

    switch (cardMoveTarget) {
        case GROW:
            interpolationFactor = (cardMoveAnimationDuration - cardMoveAnimation) / cardMoveAnimationDuration;
            contradictionCurrentX = textX + (growX - textX) * interpolationFactor;
            contradictionCurrentY = textY + (growY - textY) * interpolationFactor;
            if (contradictionGrow.length > 1) {
                lastGrowItem = contradictionGrow[contradictionGrow.length - 2];
            }
            if (contradictionGrow.length == 1) {
                lastGrowItem = -1;
            }

            break;
        case SHRINK:
            interpolationFactor = (cardMoveAnimationDuration - cardMoveAnimation) / cardMoveAnimationDuration;
            contradictionCurrentX = textX + (shrinkX - textX) * interpolationFactor;
            contradictionCurrentY = textY + (shrinkY - textY) * interpolationFactor;
            if (contradictionShrink.length > 1) {
                lastShrinkItem = contradictionShrink[contradictionShrink.length - 2];
            }
            if (contradictionShrink.length == 1) {
                lastShrinkItem = -1;
            }
            break;
        case DISCARD:
            interpolationFactor = (cardMoveAnimationDuration - cardMoveAnimation) / cardMoveAnimationDuration;
            contradictionCurrentX = textX + (discardX - textX) * interpolationFactor;
            contradictionCurrentY = textY + (discardY - textY) * interpolationFactor;
            break;

        default:
            break;
    }

    if (contradictionGrow.length > 0) {
        if (lastGrowItem != -1) {
            image(moveableCard, quadTargets[2][0], quadTargets[2][1]);
            text(contradictions[lastGrowItem], growX, growY, int(textW));
        }
    }

    if (contradictionShrink.length > 0) {
        if (lastShrinkItem != -1) {
            image(moveableCard, quadTargets[3][0], quadTargets[3][1]);
            text(contradictions[lastShrinkItem], shrinkX, shrinkY, int(textW));
        }
    }
    image(moveableCard, contradictionCurrentX - width / 2 + textW / 2, contradictionCurrentY - height / 2);
    text(contradictions[tempTracker], contradictionCurrentX, contradictionCurrentY, int(textW));

    image(moveableCard, quadTargets[1][0], quadTargets[1][1]);
    let tX = width / 2 + quadTargets[1][0];
    let tY = height / 2 + quadTargets[1][1];
    textSize(titleTextSize);
    textStyle(BOLD);
    text("Not Applicable", tX, tY);
    textSize(tTextSize);
    textStyle(ITALIC);
    text("(Left)", tX, tY + titleTextSize);
    // for (let button of buttons) {
    //     button.update();
    // }
}

/**
 * @description This function discards a contradiction card from the game, increments
 * a counter for the number of contradictions, and updates the target card to be moved
 * next to discard.
 */
function discardContradiction() {
    contradictionNA.push(contradictionTracker);
    contradictionTracker = min(contradictionTracker + 1, CONTRADICTION_COUNT);
    cardMoveTarget = DISCARD;
    cardMoveAnimation = cardMoveAnimationDuration;
}

/**
 * @description This function will log the message "UNDO" to the console every time
 * it is called. It does not perform any actual undo functionality.
 */
function undo() {
    console.log("UNDO");
}

/**
 * @description This function "contradictionsDone" seems to be a utility function
 * that performs the following tasks:
 * 
 * 1/ Logs the message "DONE" to the console.
 * 2/ Logs the values of two variables called "contradictionGrow" and "contradictionShrink".
 * 3/ Changes the value of the `MODE` variable to `"BROWSE_DECK"`.
 * 4/ Calls the function `modeSetup()` passing the new value of `MODE`.
 * 
 * In summary, this function seems to be a utility function that is called when a
 * specific task is completed and it logs some information and updates some variables
 * before setting a new mode.
 */
function contradictionsDone() {
    console.log("DONE");
    console.log(contradictionGrow, contradictionShrink);
    MODE = BROWSE_DECK;
    modeSetup();
}

/**
 * @description This function grows the `contradictionTracker` by `1` and updates the
 * `cardMoveTarget` to `GROW`. It also pushes the current value of `contraditionTracker`
 * into an array called `contradictionGrow`.
 */
function growContradiction() {
    contradictionGrow.push(contradictionTracker);
    contradictionTracker = min(contradictionTracker + 1, CONTRADICTION_COUNT);
    cardMoveTarget = GROW;
    cardMoveAnimation = cardMoveAnimationDuration;
}

/**
 * @description This function shrinks the value of a variable called "contradictionTracker"
 * by 1, and if it is less than or equal to the maximum value of "CONTRADICTION_COUNT",
 * it sets the new value as the "cardMoveTarget". The function also pushes the old
 * value of contradictionTracker into an array called "contradictionShrink".
 */
function shrinkContradiction() {
    contradictionShrink.push(contradictionTracker);
    contradictionTracker = min(contradictionTracker + 1, CONTRADICTION_COUNT);
    cardMoveTarget = SHRINK;
    cardMoveAnimation = cardMoveAnimationDuration;
}
