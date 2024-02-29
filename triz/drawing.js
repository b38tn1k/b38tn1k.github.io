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

function undo() {
    console.log("UNDO");
}

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
