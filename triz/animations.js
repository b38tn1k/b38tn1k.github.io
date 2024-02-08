var widthOnTwo, heightOnTwo;
var card, cardDeck;
var cards, index, order;
var textX, textY, textW, logoX, logoY;
var cardslength = 30;
var ani,
    aniX,
    aniY,
    cr,
    icr,
    gap,
    igap,
    gap2,
    gap3,
    gap4,
    gap34,
    gapOn2,
    gapOn3,
    gapOn4,
    gapOn6,
    aniWidthOn2,
    aniHeightOn2,
    aniWidthOn3,
    aniHeightOn3,
    aniWidthOn4,
    aniHeightOn4;
var aniLayers = {};
var titleTextSize = 32;
var tTextSize = 16;
var functionList = [];
var rCol = [];
var mStroke;

functionList.push(segmentation);
functionList.push(takeout);
functionList.push(localquality);
functionList.push(asymmetry);
functionList.push(merging);
functionList.push(universality);
functionList.push(matryoshka);
functionList.push(antiweight);
functionList.push(pantiactions);
functionList.push(preactions);
functionList.push(beforehandcushioning);
functionList.push(equipotentiality);
functionList.push(dothingsbackwards);
functionList.push(curvature);
functionList.push(dynamics);
functionList.push(partialorexcessive);
functionList.push(anotherdimension);
functionList.push(vibrations);
functionList.push(periodicaction);
functionList.push(continuityofusefulaction);
functionList.push(skipping);
functionList.push(harmtobenefit);
functionList.push(feedback);
functionList.push(intermediary);
functionList.push(selfservice);
functionList.push(copying);
functionList.push(cheapshort);
functionList.push(mechanicalsubstitution);
functionList.push(pneumaticsAndHydraulics);
functionList.push(shellsAndFilms);

/**
 * @description The given function is a simplification of the animation of a clock
 * hand. It creates an arrowhead shape at the desired location and angle using the
 * `arc()` function.
 *
 * @returns { any } The `segmentation()` function draws five arcs on the screen with
 * alternating colors (a gap between each arc).
 */
function segmentation() {
    ani.clear();
    ani.noStroke();
    ani.fill(rCol[0]);
    let start = 0;
    let inc = HALF_PI;
    let g4 = gap / 6;
    let ofs = g4 + g4 * sin(millis() / 700);
    ani.arc(aniWidthOn2 + ofs, aniHeightOn2 + ofs, cr, cr, start, start + inc);
    start += inc;
    ani.arc(aniWidthOn2 - ofs, aniHeightOn2 + ofs, cr, cr, start, start + inc);
    start += inc;
    ani.arc(aniWidthOn2 - ofs, aniHeightOn2 - ofs, cr, cr, start, start + inc);
    start += inc;
    ani.arc(aniWidthOn2 + ofs, aniHeightOn2 - ofs, cr, cr, start, start + inc);
    start += inc;
}

/**
 * @description The given function "takeout" animates a three-part circle arc motion
 * using JavaScript's HTML5 canvas. It clears the previous drawings and sets up the
 * colors for animation. Then it calculates new x- and y-coordinates for each circular
 * segment using sine functions and absolute values of input variables to control
 * positioning and scale (using `millis()`).
 *
 * @returns { any } The `takeout()` function returns none or no value as it does not
 * have a return statement. It only modifies the `ani` object by setting its attributes
 * and filling the arc with different colors.
 */
function takeout() {
    ani.clear();
    ani.noStroke();
    ani.fill(rCol[0]);
    let updateValX = abs(gap * sin(millis() / 1000));
    let updateValY = abs((icr / 2) * sin(millis() / 1000));
    ani.arc(aniWidthOn2 + updateValX, aniHeightOn2 - updateValY, cr, cr, 0, HALF_PI);
    ani.fill(rCol[1]);
    ani.arc(aniWidthOn2 + updateValX, aniHeightOn2 - updateValY, cr, cr, PI, TWO_PI);
    ani.fill(rCol[2]);
    ani.arc(aniWidthOn2 - updateValX, aniHeightOn2 + updateValY, cr, cr, HALF_PI, PI);
}

/**
 * @description The `localquality()` function creates and updates an animation for a
 * drawing tool that allows the user to draw with a pencil.
 *
 * @returns { any } The `localquality` function takes no arguments and returns no
 * value. It is a draw() function that modifies the Animation object `ani` by drawing
 * shapes and images on it using the `aniLayers` object.
 *
 * The function first clears the `ani` object and sets the stroke weight and color.
 * Then it calculates the current time (in seconds) based on the system clock and
 * uses this value to determine which of several conditional statements to execute.
 */
function localquality() {
    ani.clear();
    ani.strokeWeight(mStroke);
    ani.stroke(0);
    let ltime = int(millis() / 1000); // second and millis not synced?
    let normd = (millis() % 1000) / 1000;
    let pos = (igap - gap) * normd;
    if (!("pencil" in aniLayers)) {
        aniLayers["pencil"] = createGraphics(gap, gap3);
        aniLayers["pencil"].noStroke();
        aniLayers["pencil"].fill(rCol[0]);
        aniLayers["pencil"].triangle(gapOn2, gap3, 0, gap2, gap, gap2);
        aniLayers["pencil"].fill(rCol[1]);
        aniLayers["pencil"].rect(0, gap, gap, gap);
        aniLayers["pencil"].fill(rCol[2]);
        aniLayers["pencil"].arc(gapOn2, gap, gap, gap2, PI, TWO_PI);
        aniLayers["ipencil"] = createGraphics(gap, gap3);
        aniLayers["ipencil"].imageMode(CENTER);
        aniLayers["ipencil"].push();
        aniLayers["ipencil"].scale(1, -1);
        aniLayers["ipencil"].translate(gapOn2, -1.5 * gap);
        aniLayers["ipencil"].image(aniLayers["pencil"], 0, 0);
        aniLayers["ipencil"].pop();
    }

    if (ltime % 6 == 0) {
        ani.line(gap, cr, gap + pos, cr);
        ani.image(aniLayers["pencil"], gapOn2 + pos, cr - gap3);
    } else if (ltime % 6 == 1) {
        ani.line(gap, cr, igap, cr);
        ani.image(aniLayers["pencil"], igap - gapOn2, cr - gap3);
    } else if (ltime % 6 == 2) {
        ani.line(gap, cr, igap, cr);
        ani.image(aniLayers["ipencil"], igap - gapOn2, cr - gap3);
    } else if (ltime % 6 == 3) {
        ani.line(gap, cr, igap - pos, cr);
        ani.image(aniLayers["ipencil"], igap - pos - gapOn2, cr - gap3);
    } else if (ltime % 6 == 4) {
        ani.image(aniLayers["ipencil"], gapOn2, cr - gap3);
    } else {
        ani.image(aniLayers["pencil"], gapOn2, cr - gap3);
    }
}

/**
 * @description The `asymmetry()` function draws a series of circles and rectangles
 * on the canvas using different colors and scales based on a time-dependent wobble
 * effect.
 *
 * @returns { any } The `asymmetry()` function returns nothing (i.e., `undefined`)
 * as it does not have a return statement. It modifies the canvas context (`ani`) and
 * performs animation using various methods such as `arc`, `rect`, and `circle`.
 */
function asymmetry() {
    ani.clear();
    ani.noStroke();
    let start = 0;
    let ltime = int(millis() / 2000);
    let inc = PI / 8;
    let wobble = sin(millis() / 100) * gapOn4;
    if (ltime % 2 == 0) {
        start = 0.1 * sin(millis() / 100);
    } else {
        wobble = 0;
    }
    for (let i = 0; i < 17; i++) {
        ani.fill(rCol[i % 2]);
        ani.arc(aniWidthOn2 + wobble, aniHeightOn2, cr, cr, start, start + inc);
        start += inc;
    }
    if (ltime % 2 == 1) {
        ani.fill(255);
        ani.rect(0, cr, ani.width, ani.height);
    }
    ani.fill(rCol[0]);
    ani.circle(aniWidthOn2 + wobble, aniHeightOn2, icr);
}

/**
 * @description This function renders a visual representation of a sound wave using
 * animations.
 *
 * @returns {  } The output returned by the `merging` function is a series of lines
 * and curves drawn on the canvas using the provided `ani` object. Specifically:
 *
 * 	- The function clears the canvas and sets the stroke color to the first element
 * of the `rCol` array.
 * 	- It then defines several variables and arrays used for drawing the lines and curves.
 * 	- The main loop of the function iterates over four times to create four series
 * of lines and curves. For each iteration:
 * 	+ It sets the stroke color to the second element of the `rCol` array.
 * 	+ It draws a line from `gap` to `gap2` with an inclination based on the current
 * position within the animation.
 * 	+ It draws several lines connecting the current point to other points along the
 * animation path.
 */
function merging() {
    ani.clear();
    ani.stroke(rCol[0]);
    ani.strokeWeight(2 * mStroke);
    let series = [icr, 2 * icr, 3 * icr, 4 * icr];
    let inc = icr / 5;
    let ltime = int(millis() / 500);
    let l2s = aniWidthOn2 + gap;
    let l2e = aniWidthOn2 + gap2;
    let move = (ltime % 5) - 1;
    let direction = ltime % 10;
    ani.stroke(rCol[2]);
    ani.line(gap, inc, gap, ani.height - inc);
    ani.line(l2s, inc, l2s, ani.height - inc);
    ani.line(l2e, icr + inc + inc * sin(millis() / 300), l2e, 2 * inc + inc * sin(millis() / 300) + 3.8 * gap);

    for (let i = 0; i < 4; i++) {
        ani.stroke(rCol[0]);
        let flye;
        if (direction <= 4) {
            if (i <= move) {
                flye = icr + i * icr + 2 * inc;
            } else {
                flye = icr + i * icr;
            }
        } else {
            if (i > move) {
                flye = icr + i * icr + 2 * inc;
            } else {
                flye = icr + i * icr;
            }
        }
        ani.line(gap, icr + i * icr, gap2, flye);
        ani.stroke(rCol[1]);
        let lys = icr + i * icr;
        let lye = lys + inc + inc * sin(millis() / 300);
        ani.line(l2s, lys, l2e, lye);
    }
}

/**
 * @description This function creates an array of vertices for a scalene equilateral
 * triangle with sides of length 'l'. It takes two parameters 'x' and 'y' as the
 * center coordinates of the triangle and a third parameter 'normal' which specifies
 * if the vertices should be normalized or not. If 'normal' is true(default), then
 * the function creates 6 vertices forming an equilateral triangle with side length
 * 'l' centered at (x*, y*).
 *
 * @param { number } x - The `x` input parameter is used to calculate the position
 * of the equilateral triangle's vertices.
 *
 * @param { number } y - The `y` input parameter sets the height of the equilateral
 * triangle.
 *
 * @param { number } l - The `l` input parameter is used to set the length of the
 * sides of the equilateral triangle.
 *
 * @param { boolean } normal - The `normal` input parameter is used to specify whether
 * the triangle should be formed with its vertices at normal distance from the origin
 * (default: `false`), or with its vertices on the circumcircle of a circle passing
 * through the origin and two given points (alternative: `true`).
 *
 * @returns { array } This function takes a point `x` and a length `l`, and returns
 * an array of six vertices that form an equilateral triangle with sides of length
 * `l`. If the `normal` parameter is set to `true`, then the vertices are arranged
 * so that the normal (i.e., perpendicular) to the triangle's plane passes through
 * the center of the triangle.
 */
function equiTriangle(x, y, l, normal = false) {
    vertices = [];
    l = l * sin(60);
    if (normal) {
        vertices.push(x - l);
        vertices.push(y);
        vertices.push(x + l);
        vertices.push(y - l);
        vertices.push(x + l);
        vertices.push(y + l);
    } else {
        vertices.push(x);
        vertices.push(y + l);
        vertices.push(x + l);
        vertices.push(y - l);
        vertices.push(x - l);
        vertices.push(y - l);
    }
    return vertices;
}

/**
 * @description This function renders an animation of a rotating wheel with a
 * wedge-shaped gap.
 *
 * @returns { any } The output of the `universality` function is a animated graphical
 * representation of a wedge shape made up of two triangles and a circle. The function
 * takes no arguments and returns none.
 */
function universality() {
    ani.clear();
    ani.noStroke();
    let timer = sin(millis() / 600);
    let timer2 = cos(millis() / 600);

    // wedge
    // let gapOn2 = gap/2;
    // let gap2 = 2*gap;
    let gapSin60 = gap * sin(60);
    let t1x = aniWidthOn2 + aniWidthOn4 * timer + gapSin60;
    let t1y = aniHeightOn4;

    let rx = aniWidthOn2;
    let r1y = aniHeightOn4 - gapOn2;
    let r2y = aniHeightOn4;

    if (timer2 < 0) {
        if (timer > 0) {
            r1y += gapSin60;
            r2y -= gapSin60;
            t1x = 3 * aniWidthOn4 + gapSin60;
        } else {
            t1x = aniWidthOn4 + gapSin60;
        }
    } else {
        if (timer > 0) {
            r1y += timer * gapSin60;
            r2y -= timer * gapSin60;
        }
    }
    let tri1 = equiTriangle(t1x, t1y, gap, true);
    ani.fill(rCol[1]);
    ani.rect(rx, r1y, gap2, gapOn2);
    ani.rect(rx, r2y, gap2, gapOn2);
    ani.fill(rCol[0]);
    ani.triangle(tri1[0], tri1[1], tri1[2], tri1[3], tri1[4], tri1[5]);
    // stop
    ani.fill(rCol[0]);
    let t2x = 3 * aniWidthOn4;
    let t2y = 3 * aniHeightOn4;
    let tri2 = equiTriangle(t2x, t2y, gap, false);
    ani.triangle(tri2[0], tri2[1], tri2[2], tri2[3], tri2[4], tri2[5]);
    ani.fill(rCol[1]);
    let ballx = aniWidthOn2 + aniWidthOn4 * timer + gapSin60;
    if (timer2 < 0) {
        if (timer > 0) {
            ballx = 3 * aniWidthOn4 + gapSin60;
        } else {
            ballx = aniWidthOn4 + gapSin60;
        }
    }
    ani.circle(ballx, t2y, gapOn2);
}

/**
 * @description The function "matryoshka" draws a rotating series of nested circles
 * using recursion. It takes no input parameters and has no return value. It uses the
 * Anime library to draw arcs and fill them with different colors.
 *
 * @returns { any } The output returned by the `matryoshka` function is a sequence
 * of nested arcs that spiral outwards from the center of the canvas. Each arc has a
 * different color and size based on the value of `timer`, which is calculated using
 * the current time value (`millis()`) and the base value of 700.
 */
function matryoshka() {
    // yes I should use recursion here
    ani.clear();
    ani.noStroke();
    let timer = sin(millis() / 700);
    let majorDim = gapOn4;
    let mdOn2 = majorDim / 2;
    ani.fill(rCol[0]);
    ani.arc(aniWidthOn2, aniHeightOn2, majorDim, 2 * majorDim, PI, TWO_PI);
    ani.arc(aniWidthOn2, aniHeightOn2, majorDim, majorDim, TWO_PI, PI);
    ani.fill(rCol[1]);
    majorDim *= 2;
    mdOn2 *= 2;
    ani.arc(aniWidthOn2, aniHeightOn2 - timer * mdOn2 - mdOn2, majorDim, 2 * majorDim, PI, TWO_PI);
    ani.arc(aniWidthOn2, aniHeightOn2 + timer * mdOn2 + mdOn2, majorDim, majorDim, TWO_PI, PI);
    ani.fill(rCol[2]);
    majorDim *= 2;
    mdOn2 *= 2;
    ani.arc(aniWidthOn2, aniHeightOn2 - timer * mdOn2 - mdOn2, majorDim, 2 * majorDim, PI, TWO_PI);
    ani.arc(aniWidthOn2, aniHeightOn2 + timer * mdOn2 + mdOn2, majorDim, majorDim, TWO_PI, PI);
}

/**
 * @description This function is drawing a simple animation of two ellipses colliding
 * and merging into one. It uses the current timestamp (in milliseconds) to adjust
 * the position and angle of the ellipse elements using sine and cosine waves.
 *
 * @returns {  } The `antiweight` function returns nothing and draws two triangles
 * and one rectangle on the canvas using the given dimensions and colors. The drawing
 * involves filling the background with a color and then drawing lines and shapes
 * using different stroke weights and colors to create a visual effect.
 */
function antiweight() {
    ani.clear();
    let axs, ays, axe, aye;
    let timer = sin(millis() / 1500);
    let timer2 = cos(millis() / 1500) > 0;
    let osc = (PI / 12) * timer;
    let hypot = aniWidthOn2 - gap2;
    axs = aniWidthOn2 - hypot * cos(osc);
    ays = hypot * sin(osc) + aniHeightOn3;
    axe = aniWidthOn2 + hypot * cos(osc);
    aye = -hypot * sin(osc) + aniHeightOn3;
    ani.noStroke();
    ani.fill(0);
    ani.circle(aniWidthOn2, aniHeightOn3, gapOn2);
    ani.circle(axs, ays, gapOn4);
    ani.circle(axe, aye, gapOn4);
    ani.fill(rCol[0]);
    ani.rect(axe - gapOn4, aye + gap + gapOn2 - mStroke, gapOn2, gapOn2);
    ani.fill(rCol[1]);
    let by = ays + gap + gapOn2 - mStroke;
    ani.rect(axs - gapOn2, by, gap, gapOn2);
    ani.strokeWeight(mStroke);
    if (!timer2) {
        ani.fill(255);
        ani.stroke(255);
        ani.rect(axs - gapOn4, by + gapOn4 / 2, gapOn2, gapOn4);
    }
    ani.stroke(0);
    ani.strokeWeight(mStroke);
    ani.noFill();
    ani.line(axs, ays, axe, aye);
    ani.triangle(axs, ays + mStroke, axs - gap, ays + gap2, axs + gap, ays + gap2);
    ani.triangle(axe, aye + mStroke, axe - gap, aye + gap2, axe + gap, aye + gap2);
}

/**
 * @description The `pantiactions` function is used to draw a variety of animations
 * and graphics on top of an existing canvas context (ani).
 *
 * @returns { any } The `pantiactions` function is a complex animation that generates
 * a series of curved lines and circles on a canvas using the Arduino `ani` library.
 */
function pantiactions() {
    ani.clear();
    let cx = ani.width - (gap + gapOn2); //cy = gap
    let from = color(0, 255, 255);
    let to = color(0, 0, 255);
    let lerpVal = sin(millis() / 400) / 2 + 0.5;
    let mc = lerpColor(from, to, lerpVal);
    let mc2 = lerpColor(to, from, lerpVal);
    ani.stroke(mc);
    ani.strokeWeight(mStroke / 2);
    let toggle = true;
    let cs = 0;
    for (let i = -2; i <= 2; i += 0.5) {
        toggle = true;
        for (let j = gap; j < ani.height - gapOn2; j += gapOn4) {
            if (toggle) {
                ani.line(cx + i * gapOn2, j, cx + i * gapOn2, j + gapOn4 / 2);
                cs++;
            }
            if (cs % 2 == 0) {
                ani.stroke(mc);
            } else {
                ani.stroke(mc2);
            }
            toggle = !toggle;
        }
    }
    for (let i = -1.75; i <= 2; i += 0.5) {
        toggle = false;
        for (let j = gap; j < ani.height - gapOn2; j += gapOn4) {
            if (toggle) {
                ani.line(cx + i * gapOn2, j, cx + i * gapOn2, j + gapOn4 / 2);
                cs++;
            }
            if (cs % 2 == 0) {
                ani.stroke(mc);
            } else {
                ani.stroke(mc2);
            }
            toggle = !toggle;
        }
    }

    ani.noStroke();
    ani.fill(255, 255, 0); //sun
    ani.circle(gap, gap, gap);
    ani.fill(220); //clouds
    for (let i = -2; i <= 2; i++) {
        ani.circle(cx + i * gapOn2, gap, gapOn2);
    }
    for (let i = -1.5; i <= 1.5; i++) {
        ani.circle(cx + i * gapOn2, gap34, gapOn2);
        ani.circle(cx + i * gapOn2, gapOn4 + gap, gapOn2);
    }
    ani.fill(rCol[0]); //umbrella
    let osc = aniWidthOn2 + sin(millis() / 2000) * aniWidthOn3;
    ani.ellipse(osc, aniHeightOn3 * 2, gap2, gap);
    ani.fill(255);
    ani.rect(osc - gap, aniHeightOn3 * 2, gap2, ani.height);
    for (let i = -1; i <= 1; i++) {
        ani.circle(osc + i * gapOn2, aniHeightOn3 * 2 + gapOn4 / 2, gapOn2);
    }
    ani.stroke(0);
    ani.strokeWeight(mStroke);
    ani.line(osc, aniHeightOn3 * 2 - gapOn4 / 2, osc, ani.height - gapOn2);
    ani.point(osc, aniHeightOn3 * 2 - gapOn2);
    ani.fill(255);
    ani.stroke(rCol[0]);
    ani.arc(osc - gapOn4 / 2, ani.height - gapOn2, gapOn4, gapOn4, 0, PI);
}

/**
 * @description This function calculates which element of the array `pArr` should be
 * returned based on the values of `sin` and `cos` of the current time `now` divided
 * by the period `period` shifted by `shift`. It uses two sinusoidal comparators to
 * generate a binary array.
 *
 * @param { number } period - The `period` input parameter specifies the period of
 * the waveform that the function is generating.
 *
 * @param { number } shift - The `shift` input parameter adds a constant value to the
 * `now/period` calculation when computing the sine and cosine values.
 *
 * @param { number } now - The `now` input parameter represents the current time
 * measured as milliseconds since the epoch (January 1st 1970 at midnight UTC), and
 * is used to determine the value of the trigonometric functions `sin` and `cos`
 * within the function.
 *
 * @param { boolean } invert - The `invert` input parameter changes the order of the
 * returned array based on the value of `sin()` and `cos()`.
 *
 * @returns { integer } The output returned by the `countTo3` function is one of the
 * four values: 0 (first argument), 1 (second argument), 2 (third argument), or 3
 * (fourth argument).
 *
 * The function takes three arguments: `period`, `shift`, and `now`. It calculates
 * the value of two trigonometric functions (`sin` and `cos`) at a point `now` that
 * is divided by the period `period`, and uses those values to select one of four
 * possible outputs from an array of values (`pArr`). The output is determined by the
 * current values of `t1` (a function of `now/period + shift`) and `t2` (a function
 * of `now/period + shift`).
 */
function countTo3(period, shift = 0, now = millis(), invert = false) {
    let t1 = sin(now / period + shift) > 0;
    let t2 = cos(now / period + shift) > 0;
    let pArr = [0, 3, 1, 2];
    if (invert) {
        pArr = [3, 0, 2, 1];
    }
    return pArr[t1 + 2 * t2];
}

/**
 * @description This function counts from 1 to 15 using two nested recurrence relations:
 * `countTo3()` and `countTo4()`.
 *
 * @param { number } period - The `period` input parameter specifies the number of
 * milliseconds to count up to before returning the result.
 *
 * @param { number } now - The `now` input parameter passed to `countTo3` and `countTo15`
 * is a timestamp (in milliseconds) that determines the current count position within
 * the cycle.
 *
 * @param { boolean } invert - The `invert` input parameter specifies the direction
 * of the counting. When set to `false`, the function counts forward from 0 to the
 * given value (major component).
 *
 * @returns { integer } The output returned by this function is a value between 0 and
 * 15 that is the sum of two values: a "major" component and a "minor" component.
 */
function countTo15(period, now = millis(), invert = false) {
    let major = 4 * countTo3(period * 4, PI / 4, now, invert);
    let minor = countTo3(period, 0, now, invert);
    return major + minor;
}

/**
 * @description The `aniRulers` function draws two horizontal lines and two vertical
 * lines on the canvas using the `stroke()` and `line()` methods of the `ani` object.
 *
 * @returns {  } The output of the `aniRulers` function is two vertical lines drawn
 * on the canvas representing the gutter (or margin) around the animated visualization.
 */
function aniRulers() {
    ani.stroke(0);
    ani.strokeWeight(1);
    ani.line(0, aniHeightOn2, ani.width, aniHeightOn2);
    ani.line(aniWidthOn2, 0, aniWidthOn2, ani.height);
    // ani.line(0, aniHeightOn2 - (gap + gapOn2), ani.width, aniHeightOn2 - (gap + gapOn2));
    // ani.line(0, aniHeightOn2 + gap, ani.width, aniHeightOn2 + gap);
}

/**
 * @description The function "preactions" prepares the canvas for an animation of a
 * transportation system by clearing the previous state and setting up the current
 * state with houses (dark blue squares), warehouses (pink square), sats (red squares),
 * and gap (white space) on the screen.
 *
 * @returns { array } The `preactions` function draws a simple transportation system
 * animation on the canvas. It takes no arguments and returns undefined.
 */
function preactions() {
    ani.clear();
    ani.rectMode(CENTER);
    ani.stroke(0);
    ani.strokeWeight(mStroke);
    ani.noFill();
    let period = 1000;
    // hub
    let warehouse = [aniWidthOn4 - gapOn2, aniHeightOn2];
    // sats
    let sats = [
        [aniWidthOn2 + gapOn4, aniHeightOn3],
        [aniWidthOn2 + gapOn4, aniHeightOn3 * 2],
    ];
    // houses
    let hx = aniWidthOn4 * 3 + gapOn2; //(gapOn2 + gapOn3);
    let houses = [];
    let inc = ani.height / 5;
    let start = inc;
    for (let i = 0; i < 4; i++) {
        houses.push([hx, start + i * inc]);
    }
    //draw layout
    ani.square(warehouse[0], warehouse[1], gap2);
    for (let i = 0; i < sats.length; i++) {
        ani.square(sats[i][0], sats[i][1], gap);
    }
    let ind = countTo3(period);
    for (let i = 0; i < houses.length; i++) {
        if (i == ind) {
            ani.fill(0);
        } else {
            ani.fill(rCol[1]);
        }
        ani.square(houses[i][0], houses[i][1], gapOn2);
    }
    ani.fill(0);
    ani.square(sats[0][0], sats[0][1], gapOn2);
    ani.square(sats[1][0], sats[1][1], gapOn2);
    // transport test
    ani.fill(rCol[1]);
    ani.noStroke();
    let c = deliver(sats[int(ind / 2)], houses[ind], period, ind);
    ani.square(c[0], c[1], gapOn2 - mStroke);
    let ws = [warehouse[0] + gapOn2, warehouse[1] - gapOn2];
    c = deliver(ws, sats[int(ind / 2)], period, ind);
    ani.square(c[0], c[1], gapOn2 - mStroke);

    // warehouse inventory
    c = deliver([ws[0], ws[1] + gapOn2 + mStroke], ws, period, ind);
    ani.square(c[0], c[1], gapOn2 - mStroke);
    ani.square(c[0], c[1] + (gapOn2 + mStroke), gapOn2 - mStroke);

    let first = [ws[0], ws[1] + gap + 2 * mStroke];
    let offscr = [-gap, first[1]];
    c = deliver(offscr, first, period, ind);
    ani.square(c[0], c[1], gapOn2 - mStroke);
    if (ind == 0 || ind == 1) {
        c = sats[1];
    } else {
        c = sats[0];
    }
    ani.square(c[0], c[1], gapOn2 - mStroke);
    ani.rectMode(CORNER);
    ani.fill(255); //ani.square(warehouse[0], warehouse[1], gap2);
    ani.rect(0, 0, warehouse[0] - gap * 1.05, ani.height);
}

/**
 * @description This function takes a source position `s`, a destination position
 * `d`, a movement period `period`, and an optional phase parameter `phase`. It returns
 * the new position of the movement after a certain amount of time has passed.
 *
 * @param { array } s - The `s` input parameter represents the starting point of the
 * trajectory.
 *
 * @param { array } d - The `d` input parameter specifies the distance between the
 * starting point and the ending point of the delivery path.
 *
 * @param { number } period - The `period` input parameter determines the frequency
 * of the oscillation.
 *
 * @param { number } phase - The `phase` input parameter determines the index of the
 * function to use from the `myFunc` array for calculating the X and Y coordinates.
 *
 * @returns { array } The function `deliver` takes a source `s`, a destination `d`,
 * a period `millis()` / period) and an optional phase value. It uses the values from
 * the sources array `myFunc` (which contains sinusoidal functions of different
 * frequencies) to move the point `s` towards the point `d`.
 *
 * The output returned by the function is an array of two values representing the new
 * coordinates `x` and `y`.
 */
function deliver(s, d, period, phase = 0) {
    let myFunc = [sin, cos, sin, cos];
    let x = s[0] + abs(myFunc[phase](millis() / period)) * (d[0] - s[0]);
    let y = s[1] + abs(myFunc[phase](millis() / period)) * (d[1] - s[1]);
    return [x, y];
}

/**
 * @description The `beforehandcushioning` function prepares the animation canvas by
 * clearing it and setting the stroke weight. It then draws several geometric shapes
 * to create a "cushioning" effect around the center of the canvas.
 *
 * @returns { any } The `beforehandcushioning` function does not return any value.
 * Instead of return undefined statement as it ends without any return statements or
 * assigning the values to any variables.
 * It fills different areas of the animation with different colors ranging from rCol[0]
 * - rCol[2] then creates a line and rectangle and circle for drawing.
 */
function beforehandcushioning() {
    ani.clear();
    ani.rectMode(CENTER);
    let timer = sin(millis() / 1000);
    let x = timer * (aniWidthOn3 / 2) + aniWidthOn3;
    ani.noStroke();
    ani.fill(rCol[0]);
    let ah32 = aniHeightOn3 * 2;
    ani.rect(x, ah32, gap2, gap);
    ani.fill(rCol[1]);
    ani.circle(x - gapOn2, ah32 + gapOn2, gap34);
    ani.circle(x + gapOn2, ah32 + gapOn2, gap34);
    ani.fill(rCol[2]);
    ani.rect(ani.width - aniWidthOn4, aniHeightOn2, aniWidthOn3 - gap, aniHeightOn2 + gap);
    ani.stroke(0);
    ani.strokeWeight(mStroke / 2);
    let spx = x + gap + 1;
    let inc = aniWidthOn3 / 8;
    if (x > aniWidthOn3) {
        inc = (aniWidthOn2 - x) / 4;
    }
    for (let i = 0; i < 5; i++) {
        ani.line(spx, ah32 - gapOn4, spx, ah32 + gapOn4);
        if (i < 4) {
            ani.line(spx, ah32 - gapOn4, spx + inc, ah32 + gapOn4);
        }
        spx += inc;
    }
    ani.rectMode(CORNER);
}

/**
 * @description This function smooths out a square wave using a sine and cosine curve
 * to create a smooth transition between the high and low states of the square wave.
 *
 * @param { number } period - The `period` input parameter controls the frequency of
 * the oscillation generated by the smoothSquare function.
 *
 * @param { number } now - The `now` input parameter controls the phase of the
 * smoothSquare function.
 *
 * @param { integer } shift - The `shift` input parameter advances the phase of the
 * sinusoid by the given value.
 *
 * @returns { number } This function takes three arguments: `period`, `now`, and
 * `shift`. It calculates the sinusoidal position of the input `now` relative to the
 * period `period`, with an offset `shift`.
 */
function smoothSquare(period, now = millis(), shift = 0) {
    let st = sin(now / period + shift);
    let ct = cos(now / period + shift);
    let result = 0;
    if (st > 0 && ct < 0) {
        result = st;
    } else if (st >= 0) {
        result = 1;
    } else if (st < 0 && ct > 0) {
        result = 1 + st;
    }
    return result;
}

/**
 * @description The `equipotentiality()` function animates the movement of a boat on
 * the screen using the Arduino `analyzer` library. It draws the boat's hull and mast
 * on a 2D graphical canvas with varying width and gap settings based on the input
 * signal 't', which smoothly moves the boat between three possible positions.
 *
 * @returns { any } The output returned by the `equipotentiality` function is a
 * animated sketch of a boat sailing on a waves with a mast rising and falling. The
 * function takes no arguments and uses the `millis()` function to control the animation
 * speed.
 */
function equipotentiality() {
    ani.clear();
    ani.rectMode(CORNER);
    let t = smoothSquare(1000);
    let s = smoothSquare(250);
    // let sig = sin(millis()/250) * 0.5 + 0.5;
    ani.noStroke();
    ani.fill(0, 0, 255);
    let low = 2 * aniHeightOn3;
    let high = aniHeightOn3;
    ani.rect(0, low, aniWidthOn3, gap);
    ani.rect(aniWidthOn3 * 2, high, aniWidthOn3, gap + aniHeightOn3);
    ani.rect(aniWidthOn3, low, aniWidthOn3, gap);

    let lockHeight = low - t * high;

    ani.rect(aniWidthOn3, low - t * high, aniWidthOn3, gap + t * high);
    let boatx = 0;
    let boaty = 0;
    let l1 = aniHeightOn3 * 2 + gap;
    let l2 = aniWidthOn3 - gap;
    if (t == 0) {
        // boatx = int(aniWidthOn3 - gap + s * gap2);
        boatx = aniWidthOn2 - (1 - s) * gap2;
        boaty = low - gapOn2 / 2;
    } else if (t == 1) {
        // boatx = int(2*aniWidthOn3 - s * gap2 + gap);
        boatx = aniWidthOn2 + (1 - s) * gap2;
        boaty = high - gapOn2 / 2;
    } else {
        boatx = aniWidthOn2;
        boaty = lockHeight - gapOn2 / 2;
        if (sin(millis() / 1000) > 0) {
            l1 = aniHeightOn3 * 2;
        } else {
            l2 = aniWidthOn3;
        }
    }
    ani.fill(255, 0, 0);
    ani.rectMode(CENTER);
    ani.rect(boatx, boaty, gap, gapOn2);
    ani.triangle(boatx - gapOn2, boaty - gapOn4, boatx - gap, boaty - gapOn4, boatx - gapOn2, boaty + gapOn4);
    ani.triangle(boatx + gapOn2, boaty - gapOn4, boatx + gap, boaty - gapOn4, boatx + gapOn2, boaty + gapOn4);
    ani.rect(boatx, boaty - gap34, gapOn6 / 2, gap);
    ani.fill(255, 255, 0);
    let mast = boatx - gapOn6 / 2;
    ani.triangle(mast, boaty - (gap + gapOn4), mast, boaty - gapOn4, mast - gap34, boaty - gapOn4);
    ani.rectMode(CORNER);
    ani.strokeWeight(mStroke);
    ani.stroke(0);
    ani.line(aniWidthOn3, aniWidthOn3 - gap, aniWidthOn3, l1);
    ani.line(2 * aniWidthOn3, l2, 2 * aniWidthOn3, aniHeightOn3 * 2 + gap);
}

/**
 * @description This function draws an animation of a shape that is rectangular with
 * rounded corners and has a wiggling nail at the top.
 *
 * @returns {  } The output returned by the `dothingsbackwards()` function is a drawn
 * animation of a wave-like shape made up of three rectangles and a triangle.
 */
function dothingsbackwards() {
    ani.clear();
    ani.noStroke();
    let per = 200;

    let ah42 = aniHeightOn4 / 2;
    let aw42 = aniWidthOn4 / 2;
    ani.fill(139, 69, 19);
    ani.rect(aniWidthOn4, ah42, gapOn3, aniWidthOn2);
    let timer = sin(millis() / per);
    let nailx = timer * gap + (aw42 + gap) + gap2;
    let vy1 = ah42 + gapOn3;
    let vy2 = vy1 + gapOn3 * 2;
    let vy3 = (vy1 + vy2) / 2;
    let pos = countTo3(4 * per, -per / 2, millis(), true);
    let gpos = max(pos - 1, 0);
    if (pos == 0) {
        nailx = aw42 + gap2;
    }
    let wpx = nailx + pos * gapOn4;
    ani.rect(wpx, ah42, gap, gap + gapOn2);
    ani.fill(190);
    ani.rect(aw42, ah42 + gapOn4, gap2, gap);
    ani.triangle(nailx, vy1, nailx, vy2, nailx + gap, vy3);
}

/**
 * @description The function `curvature` draws a quarter-circle and two rectangle on
 * an animation canvas using three different colors.
 *
 * @returns { object } The `curvature()` function creates and animates a curve using
 * three rounded rectangles and two circles. It takes no input parameters and returns
 * none.
 */
function curvature() {
    ani.clear();
    let per = 500;
    let tx1 = sin(millis() / per);
    let tx2 = cos(millis() / per);
    let cx = aniWidthOn4;
    let cy = aniWidthOn3;
    let cr = aniWidthOn3 - gap * 1.5;
    let mcx = cx + tx1 * cr;
    let mcy = cy + tx2 * cr;
    ani.noStroke();
    ani.fill(rCol[0]);
    ani.circle(cx, cy, cr * 3);
    let tb = cy - cr * 1.5;
    let aw315 = aniWidthOn3 * 1.5 + cr * 0.5;
    ani.rect(cx, tb, aw315, cr / 2);
    ani.rect(cx, cy + cr, aw315, cr / 2);
    ani.fill(255);
    ani.circle(cx, cy, cr);
    ani.fill(rCol[1]);
    ani.circle(mcx, mcy, gapOn2);
    ani.rect(2 * aniWidthOn3 + tx1 * cr, tb + cr / 2, gapOn4, cr * 2);
    ani.strokeWeight(mStroke);
    ani.stroke(rCol[2]);
    ani.line(mcx, mcy, 2 * aniWidthOn3 + tx1 * cr + gapOn4 / 2, tb + cr * 1.5);
}

/**
 * @description This function creates and animates a dynamically sized sinusoidal
 * wave using JavaScript's `AnimoJS` library. It sets up layers for the wave animation
 * and positions them on the screen based on the position of the mouse cursor.
 *
 * @returns {  } The `dynamics()` function creates and animates a dynamic sine wave
 * using JavaScript and the HTML5 canvas element. The output of the function is an
 * animated visual representation of a sine wave with adjustable amplitude and
 * frequency. The animation cycles through three different colors and displays two
 * rectangles at the top and bottom of the canvas.
 */
function dynamics() {
    if (!("dynSin" in aniLayers)) {
        aniLayers["dynSin"] = createGraphics(int(aniWidthOn2), gap2);
        aniLayers["dynSin"].strokeWeight(mStroke);
        aniLayers["dynSin"].stroke(0);
        for (let i = -1; i < aniLayers["dynSin"].width + 1; i++) {
            let x = i;
            let y = aniLayers["dynSin"].height / 2;
            y += (gapOn4 / 2) * sin((i / aniLayers["dynSin"].width) * TWO_PI * 2);
            aniLayers["dynSin"].point(x, y);
        }
    }
    ani.clear();
    ani.noStroke();

    let cx = aniWidthOn2 + aniWidthOn4 * sin(millis() / 1000);
    let cr = gap;
    let osc = (gapOn4 / 2) * sin((cx / aniLayers["dynSin"].width) * TWO_PI * 2);
    let cy = aniWidthOn2 - gapOn2 + osc;
    let type = countTo3(2000);
    ani.fill(rCol[0]);
    ani.circle(cx, cy, cr);
    ani.strokeWeight(mStroke);
    ani.stroke(0);
    let ah8 = aniHeightOn4 / 2;
    let cyp = cy - ah8;
    ani.line(cx, cy, cx, cyp);
    ani.line(cx - gap, cyp, cx + gap, cyp);
    let pl = aniHeightOn2;
    let inc = (cy - pl) / 3;
    let pos = inc;
    for (let i = 0; i < 3; i++) {
        ani.line(cx - gap, cyp - pos, cx - gapOn2, cyp - pos);
        pos += inc;
    }
    let bb = aniHeightOn4 + gapOn2;
    ani.line(cx + gap34, cyp, cx + gap34, cyp - gapOn6);
    ani.line(cx + gap34, bb, cx + gap34, bb + gapOn6);
    ani.stroke(220);
    ani.line(0, aniHeightOn4 + gapOn4, ani.width, aniHeightOn4 + gapOn4);
    ani.noStroke();
    ani.fill(rCol[1]);
    ani.rect(cx - gap, aniHeightOn4, gap2, gapOn2);
    ani.fill(rCol[2]);
    ani.rect(cx + gapOn2, bb + gapOn6, gapOn2, cyp - bb - gapOn3);
    ani.image(aniLayers["dynSin"], 0, aniHeightOn2);
    ani.image(aniLayers["dynSin"], aniWidthOn2, aniHeightOn2);
}

/**
 * @description The `partialorexcessive` function draws a dynamic starry background
 * on an animation canvas using the Anaframework library. It takes into account the
 * current time since the last frame and updates the drawing based on that.
 *
 * @returns {  } The output returned by the `partialorexcessive` function is a drawn
 * animation that consists of two main components:
 *
 * 1/ A background fill (using the color `rCol[prevInd]` or `rCol[ind]`) with a
 * gradually changing rectangular shape.
 * 2/ A series of stars (drawn using the `star` function) with increasing brightness
 * and size that move horizontally across the screen.
 *
 * The animation is based on the current time (`now`) and the interval between each
 * frame (`per`).
 */
function partialorexcessive() {
    let now = millis();
    let per = 500;
    let ind = countTo3(per * 4, 0, now) + 1;
    let prevInd = ind - 1;
    if (prevInd == 0) {
        prevInd = 4;
    }
    let paintPhase = ind % 2 == 0;
    ani.fill(rCol[ind]);
    ani.noStroke();
    let f = now / per;
    let stencilTimer = sin(f);
    let paintTimer = -cos(f);
    ani.clear();
    ani.background(rCol[prevInd]);
    let xPaint;
    if (stencilTimer >= 0) {
        xPaint = paintTimer * ani.width;
    } else {
        xPaint = ani.width;
    }
    ani.rect(0, 0, xPaint, ani.height);
    let sp = smoothSquare(per, now, per / 2) * aniWidthOn2 + aniWidthOn4;

    let aw34 = aniWidthOn4 * 3;
    // if (xPaint < aw34) {
    //   let pprev = prevInd - 1;
    //   if (pprev < 0) {
    //     pprev = 3;
    //   }
    //   ani.fill(rCol[pprev]);
    // } else {
    //   ani.fill(rCol[prevInd]);
    // }
    ani.fill(255);
    star(aw34, aniHeightOn2, gap, gapOn2, 6);
    if (sp < xPaint) {
        ani.fill(rCol[ind]);
    } else {
        ani.fill(rCol[prevInd]);
    }
    ani.stroke(0);
    ani.strokeWeight(mStroke);
    star(sp, aniHeightOn2, gap, gapOn2, 6);
    // ani.square( sp, aniHeightOn2 - gapOn2, gap);
}

/**
 * @description This function draws a star shape with a given number of points using
 * the provided radius and centered at the origin.
 *
 * @param { number } x - The `x` input parameter is used as the center of the star shape.
 *
 * @param { string } y - The `y` input parameter determines the starting position of
 * the stars along the y-axis.
 *
 * @param { number } radius1 - The `radius1` parameter sets the radius of the smaller
 * stars.
 *
 * @param { number } radius2 - The `radius2` input parameter specifies the radius of
 * the larger stars to be drawn.
 *
 * @param { number } npoints - The `npoints` input parameter specifies the number of
 * points to be generated by the star() function.
 *
 * @returns { any } This function takes six arguments: `x`, `y`, `radius1`, `radius2`,
 * `npoints`, and returns `null`. The function draws a star using a recursive algorithm
 * with `npoints` points. Each point is a vertex of the shape.
 */
function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let off = HALF_PI - angle;
    let halfAngle = angle / 2.0;
    ani.beginShape();
    for (let a = off; a < TWO_PI + off; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        ani.vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        ani.vertex(sx, sy);
    }
    ani.endShape(CLOSE);
}

/**
 * @description This function draws an animation of a truck on an HTML5 canvas using
 * the createGraphics() method.
 *
 * @returns {  } The output returned by the `drawTruck` function is a modified version
 * of the original `aniLayers` object with new properties and attributes added to it.
 */
function drawTruck() {
    if (!("truck" in aniLayers)) {
        aniLayers["truck"] = createGraphics(ani.width, ani.height);
        aniLayers["truck"].noStroke();
        aniLayers["truck"].fill(100);
        let aw8 = aniWidthOn4 / 2;
        aniLayers["truck"].rect(0, ani.height - aniHeightOn4 - gapOn2, aniWidthOn4 * 3, gapOn2);
        aniLayers["truck"].arc(aw8 + aniWidthOn2, ani.height - aniHeightOn4, 6 * gapOn4, 6 * gapOn4, PI, 0);
        aniLayers["truck"].fill(255, 0, 0);
        aniLayers["truck"].rect(0, aniHeightOn4, aniWidthOn4, aniHeightOn2);
        aniLayers["truck"].fill(255, 100, 100);
        aniLayers["truck"].rect(aniWidthOn4 / 2, aniHeightOn3 + gapOn6, aniWidthOn4 / 3, aniHeightOn4);
        aniLayers["truck"].fill(0, 255, 255);
        aniLayers["truck"].rect(0, aniHeightOn3 + gapOn6, gapOn2, gap34);
        aniLayers["truck"].fill(255, 255, 0);
        aniLayers["truck"].rect(0, aniHeightOn2 + gapOn2, gapOn6, gapOn6);
        aniLayers["truck"].fill(0);
        aniLayers["truck"].circle(aw8, ani.height - aniHeightOn4, gap);
        aniLayers["truck"].circle(aw8 + aniWidthOn2, ani.height - aniHeightOn4, gap);
        aniLayers["truck"].fill(100);
        aniLayers["truck"].circle(aw8, ani.height - aniHeightOn4, gapOn3);
        aniLayers["truck"].circle(aw8 + aniWidthOn2, ani.height - aniHeightOn4, gapOn3);
    }
}

/**
 * @description This function "anime" (a variable of the function another dimension)
 * draws a rotating circle using the provided dimensions and colors and has various
 * other components such as:
 *
 * 	- Animated line moving based on elapsed time between max and min lengths.
 * 	- Oscillation effect created by multiplying sine and cosine functions with time
 * passed as parameters.
 *
 * In essence it animates a spinning semi-truck made up of rectangles that light up
 * accordingly.
 *
 * @returns { any } The function `annedimension` draws a truck and road background
 * with an animated wave-like movement on the screen using CSS3 animations.
 */
function anotherdimension() {
    drawTruck();
    ani.clear();
    ani.noStroke();
    ani.rectMode(CORNER);
    bcx = aniWidthOn2 - aniWidthOn4;
    let bcy = aniHeightOn3 * 2 - (aniHeightOn4 + gapOn2);
    let timer = sin(millis() / 1000);
    let osc = timer * (QUARTER_PI / 2) + QUARTER_PI / 2;
    let fall = cos(millis() / 1000);
    let ind = countTo3(4000);
    let cx = ani.width - gapOn2;
    let cy = ani.height - aniHeightOn4 + gapOn4;
    ani.fill(rCol[ind]);
    if (osc > 0.6 && fall > 0) {
        ani.circle(cx - abs(fall * gapOn4), cy - abs(fall * gap), gapOn2);
    } else if (fall < 0) {
        ani.circle(cx, cy, gapOn2);
    }
    ani.strokeWeight(mStroke * 2);
    ani.stroke(150);
    ani.line(
        bcx,
        bcy + aniHeightOn3,
        sin(osc + QUARTER_PI) * aniWidthOn2,
        bcy + aniHeightOn3 - sin(osc + QUARTER_PI) * aniHeightOn3
    );
    ani.strokeWeight(mStroke);
    ani.stroke(100);
    ani.fill(150);
    ani.push();
    ani.translate(bcx + sin(osc) * aniWidthOn2, bcy - sin(osc) * aniHeightOn3);
    ani.rotate(osc);
    ani.rect(0, 0, aniWidthOn2, aniHeightOn3);
    ani.fill(200);
    for (let i = 1; i < 12; i += 2) {
        ani.rect(gapOn4 * i, gapOn4, gapOn4, aniHeightOn3 - gapOn2);
    }
    ani.pop();
    ani.image(aniLayers["truck"], 0, 0);
    ani.stroke(0);
}

/**
 * @description This function draws a vibrating rectangle using the HTML5 canvas API.
 *
 * @returns { any } The `vibrations()` function generates a waving animation of two
 * rectangles on top of each other with alternating colors.
 */
function vibrations() {
    ani.clear();
    ani.noStroke();
    ani.rectMode(CENTER);
    let per = 1000;
    let lt = cos(millis() / per + per / 2);
    let lt2 = (sin(millis() / per + per / 2) + 1) / 4;
    let osc = 0;
    let c1 = lerpColor(rCol[0], rCol[1], lt2);
    let c2 = lerpColor(rCol[1], rCol[0], lt2);
    if (lt > 0) {
        osc = (sin(millis() / 20) * gapOn4) / 2;
    }
    ani.fill(c1);
    ani.rect(aniWidthOn2 + osc, aniHeightOn3 + osc, aniWidthOn3, aniHeightOn3);
    ani.fill(c2);
    ani.rect(aniWidthOn2 + osc, 2 * aniHeightOn3 + osc, aniWidthOn3, aniHeightOn3);
    ani.strokeWeight(mStroke);
    ani.stroke(c1);
    ani.line(aniWidthOn3 + osc, aniHeightOn2 + osc, aniWidthOn3 * 2 + osc, aniHeightOn2 + osc);
    ani.stroke(0);
    ani.noFill();
    ani.rect(aniWidthOn2 + osc, aniHeightOn2 + osc, aniWidthOn3, aniHeightOn3 * 2);
    ani.rectMode(CORNER);
}

/**
 * @description This function animates a rectangle with a circular fill pattern using
 * CSS graphics on a canvas element.
 *
 * @returns { any } The output returned by the `periodicaction()` function is a series
 * of geometric shapes and colors that repeat periodically on the screen. The shapes
 * include circles and squares with different sizes and positions on the screen. The
 * colors used are based on an array `rCol` containing two values.
 */
function periodicaction() {
    ani.clear();
    ani.rectMode(CENTER);
    ani.noFill();
    ani.strokeWeight(mStroke);
    ani.stroke(0);
    let aw34 = 3 * aniWidthOn4;
    let ah34 = 3 * aniHeightOn4;
    let sx = gapOn2 + mStroke;
    let ex = ani.width - (gapOn2 + mStroke);
    let ty = aniHeightOn4;
    let by = ah34;
    ani.fill(rCol[0]);
    let per = 500;
    let t1 = sin(millis() / per);
    let t2 = (cos(millis() / per) + 1) / 2;
    if (t1 >= 0) {
        t2 = 1 - t2;
    }
    ani.noStroke();
    ani.circle(sx + t2 * (ex - sx), ty, gapOn3);

    let batchT = countTo3(2 * per);
    let diffx = ex - sx - gap;
    if (batchT == 0) {
        ani.circle(gap + sx + t2 * diffx, by, gapOn3);
        ani.circle(gap + gapOn2 + sx + t2 * diffx, by, gapOn3);
        ani.circle(gap2 + sx + t2 * diffx, by, gapOn3);
    } else if (batchT == 1) {
        ani.circle(sx + t2 * gap2, by, gapOn3);
    } else if (batchT == 2) {
        ani.circle(sx + gap2, by, gapOn3);
        ani.circle(sx + t2 * (gap + gapOn2), by, gapOn3);
    } else if (batchT == 3) {
        ani.circle(sx + gap + gapOn2, by, gapOn3);
        ani.circle(sx + gap2, by, gapOn3);
        ani.circle(sx + t2 * gap, by, gapOn3);
    }
    ani.fill(255);
    ani.rect(ex + gap, aniHeightOn2, gap2, ani.height);
    ani.fill(rCol[1]);
    ani.square(sx, ty, gap);
    ani.square(sx, by, gap);
    ani.fill(rCol[0]);
    ani.square(ex, ty, gap);
    ani.square(ex, by, gap);
    ani.rectMode(CORNER);
}

/**
 * @description The `continuityofusefulaction()` function animates a water-like motion
 * on a rectangular canvas using CSS animations. It progressively paints a curve of
 * circles with different radii and colors based on the angle of rotation. The circles
 * are arranged to give the appearance of ripples spreading out from the center of
 * the canvas.
 *
 * @returns {  } The `continuityofusefulaction` function is a non-standard arrow
 * function that takes no arguments and returns a value computed using the animation
 * parameters `per`, `gap`, `mStroke`, `aniWidthOn2`, `aniHeightOn3`, `gapOn2`,
 * `gapOn4`, and `lh`. The output returned by this function is the result of animating
 * the graphical elements on the screen based on the current time `millis()/per`
 * passed as an argument.
 *
 * Here's a concise description of the function's output:
 *
 * 1/ It starts by clearing and resetting the canvas.
 * 2/ Based on the current time `millis()/per`, it animates different geometric shapes
 * using the provided animation parameters. These shapes include circles., ellipses
 * ,triangles  and rectangles with varying fills and strokes.
 * 3/ Depending on the time value 0 or greater/less than a predefined threshold
 * (sin(millis()/per)) to alternate between filling some elements (with different
 * colors) while keeping others (stroked and non-filled) animated simultaneously.
 * This gives it an animated  effect with continuous transitions over the full cycle.
 * 4/ At certain times during the animation process., some elements might not be drawn
 * ( based on conditionals `timer > 0` / `< 0` check inside if-else statement).
 */
function continuityofusefulaction() {
    ani.clear();
    ani.noStroke();
    ani.fill(200);
    let per = 1000;
    let timer = sin(millis() / per);
    ani.push();
    ani.translate(aniWidthOn2, ani.height - aniHeightOn3);
    ani.rotate(TWO_PI * (millis() / per));
    ani.circle(0, 0, gap);
    ani.fill(100);
    ani.arc(0, 0, gap, gap, 0, QUARTER_PI);
    ani.arc(0, 0, gap, gap, HALF_PI, HALF_PI + QUARTER_PI);
    ani.arc(0, 0, gap, gap, PI, PI + QUARTER_PI);
    ani.arc(0, 0, gap, gap, -HALF_PI, -QUARTER_PI);
    ani.pop();
    ani.strokeWeight(mStroke);
    ani.stroke(0);
    ani.circle(aniWidthOn2, ani.height - aniHeightOn3, gapOn2);
    ani.rect(aniWidthOn2 - gapOn2, ani.height - aniHeightOn3, gap, gapOn2);
    let lh = ani.height - aniHeightOn3 + gap;
    ani.line(aniWidthOn2, lh - gapOn2, aniWidthOn2, lh);
    if (timer > 0) {
        ani.fill(255, 255, 0);
        ani.stroke(255, 255, 0);
        ani.line(aniWidthOn2, lh, gap, lh);
        ani.line(gap, lh, gap, aniHeightOn3 + gap);
        ani.stroke(0);
        ani.line(aniWidthOn2, lh, ani.width - aniWidthOn3 / 2, lh);
        ani.line(ani.width - aniWidthOn3 / 2, lh, ani.width - aniWidthOn3 / 2, ani.height - aniHeightOn3 / 2);
    } else {
        ani.noFill();
        ani.stroke(255, 255, 0);
        ani.line(aniWidthOn2, lh, ani.width - aniWidthOn3 / 2, lh);
        ani.line(ani.width - aniWidthOn3 / 2, lh, ani.width - aniWidthOn3 / 2, ani.height - aniHeightOn3 / 2);
        ani.stroke(0);
        ani.line(aniWidthOn2, lh, gap, lh);
        ani.line(gap, lh, gap, aniHeightOn3 + gap);
    }
    ani.stroke(0);
    ani.ellipse(gap, aniHeightOn3, gap, gap2);
    ani.noFill();
    ani.triangle(gap - gapOn4, aniHeightOn3, gap + gapOn4, aniHeightOn3, gap, aniHeightOn3 + gap);
    ani.fill(100);
    ani.rect(gapOn2, aniHeightOn3 + gap34, gap, gapOn2);
    ani.fill(0, 0, 255);
    ani.noStroke();
    ani.rect(ani.width - aniWidthOn3, aniHeightOn3 / 2, gap2, 2 * aniHeightOn3);
    let water = 1 - (cos(millis() / per) + 1) / 2;
    ani.fill(255);
    ani.rect(ani.width - aniWidthOn3, aniHeightOn3 / 2, gap2, 2 * aniHeightOn3 * water);
    ani.noFill();
    ani.stroke(0);
    ani.rect(ani.width - aniWidthOn3, aniHeightOn3 / 2, gap2, 2 * aniHeightOn3);
}

/**
 * @description The `skipping()` function creates an animation that gradually fills
 * a circle with colors based on the level of the receiver. It uses the `ani` object
 * to perform drawing operations and create the animation.
 *
 * @returns { any } The `skipping` function returns nothing (void) and displays a
 * circle that animates from color 141 (white) to color 255 (full color) over 3 cycles.
 * The animation slows down towards the end based on the timer value between 0-0.8.
 */
function skipping() {
    ani.clear();
    // let c = [color([141, 85, 36]),color([198, 134, 66]),color([224, 172, 105]),color([241, 194, 125]),color([255, 219, 172])];
    let c = [color([141, 85, 36]), color([224, 172, 105]), color([255, 219, 172])];
    let index = 0;
    for (let i = 0; i < 3; i++) {
        if (rCol[i].levels[0] == 255) {
            index += 1;
        }
    }
    let timer = sin(millis() / 200);
    ani.background(c[index]);
    ani.noStroke();
    if (timer > 0.8) {
        ani.fill(255, 230, 230);
    } else {
        ani.fill(255);
    }
    ani.circle(aniWidthOn2, aniHeightOn2, aniWidthOn2);
    ani.noStroke();
    if (rCol[4].levels[0] == 255) {
        ani.fill(0, 255, 255);
    } else {
        ani.fill(color([198, 134, 66]));
    }
    ani.circle(aniWidthOn2, aniHeightOn2, aniWidthOn4);
    ani.fill(0);
    ani.circle(aniWidthOn2, aniHeightOn2, aniWidthOn4 / 2);
    ani.push();
    ani.translate(aniWidthOn2, aniHeightOn2);
    ani.rotate(-QUARTER_PI);
    if (timer > 0.8) {
        ani.strokeWeight(mStroke);
        ani.stroke(0, 255, 0);
        ani.line(0, 0, ani.width, 0);
    }
    ani.fill(200);
    ani.noStroke();
    ani.rect(aniWidthOn4 + gapOn4, -gapOn2, ani.width, gap);
    ani.pop();
}

/**
 * @description The `drawCar` function draws a car on the screen using the Animatiq
 * framework. It creates or updates the graphics for the car and its windows if they
 * don't already exist and then calls the `beginShape`, `curveVertex`, and `endShape`
 * methods to draw the car and windows as a series of curves.
 *
 * @returns { any } The `drawCar` function returns nothing (i.e., `undefined`) as it
 * does not have a return statement. The function modifies the `aniLayers` object by
 * adding several graphics elements to it. These elements include a car body and two
 * windows. The function also fills certain areas of the car with colors and draws
 * circles to represent headlights and wheels. However.
 */
function drawCar() {
    if (!("car" in aniLayers)) {
        aniLayers["car"] = createGraphics(ani.width, ani.height);
        aniLayers["car window"] = createGraphics(ani.width, ani.height);
        aniLayers["car"].noStroke();
        let body = [];
        body.push([0.1, 0.72]);
        body.push([0.26, 0.63]);
        body.push([0.43, 0.51]);
        body.push([0.83, 0.51]);
        body.push([0.92, 0.65]);
        body.push([0.92, 0.73]);
        body.push([0.93, 0.78]);
        body.push([0.93, 0.86]);
        body.push([0.9, 0.9]);
        body.push([0.09, 0.93]);
        body.push([0.06, 0.84]);
        body.push([0.1, 0.72]);
        body.push([0.26, 0.63]);
        body.push([0.43, 0.51]);
        aniLayers["car"].beginShape();
        aniLayers["car"].fill(0, 0, 255);
        for (let i = 0; i < body.length; i++) {
            aniLayers["car"].curveVertex(body[i][0] * ani.width, body[i][1] * ani.height);
        }
        aniLayers["car"].endShape();
        let windows = [];
        windows.push([0.3, 0.68]);
        windows.push([0.3, 0.68]);
        windows.push([0.4, 0.55]);
        windows.push([0.78, 0.53]);
        windows.push([0.82, 0.66]);
        windows.push([0.3, 0.68]);
        aniLayers["car window"].beginShape();
        aniLayers["car window"].fill(255);
        aniLayers["car window"].noStroke();
        for (let i = 0; i < windows.length; i++) {
            aniLayers["car window"].curveVertex(windows[i][0] * ani.width, windows[i][1] * ani.height);
        }
        aniLayers["car window"].endShape();
        // aniLayers['car'].fill(255, 255, 0);
        // aniLayers['car'].ellipse(0.12*ani.width, 0.77 * ani.height, 0.04*ani.width, 0.06*ani.width);
        // aniLayers['car'].ellipse(0.9*ani.width, 0.68 * ani.height, 0.04*ani.width, 0.06*ani.width);
        // let lights = [[0.12, 0.77], [0.9, 0.7]];
        // let wheels = [[0.23, 0.9], [0.83, 0.9]];
        aniLayers["car"].fill(0);
        aniLayers["car"].circle(0.23 * ani.width, 0.88 * ani.height, 0.16 * ani.width);
        aniLayers["car"].circle(0.83 * ani.width, 0.88 * ani.height, 0.16 * ani.width);
        aniLayers["car"].fill(100);
        aniLayers["car"].circle(0.23 * ani.width, 0.88 * ani.height, 0.08 * ani.width);
        aniLayers["car"].circle(0.83 * ani.width, 0.88 * ani.height, 0.08 * ani.width);
    }
}

/**
 * @description The `harmtobenefit` function is a JavaScript animation function that:
 *
 * 	- Draws a car with different shades of blue using the `ani` object.
 * 	- Animates the car's position and size using the `smoothSquare` function.
 * 	- Tints the car's window with a pale yellow color using the `lerpColor` function.
 *
 * @returns { any } The `harmtobenefit()` function animates a car and returns nothing
 * (i.e., undefined) as it does not have a return statement.
 */
function harmtobenefit() {
    drawCar();
    ani.clear();
    ani.image(aniLayers["car"], 0, -aniHeightOn3 / 2);
    let timer = smoothSquare(500);
    ani.rectMode(CENTER);
    ani.noStroke();
    let c = lerpColor(color(100), color(255, 0, 0), timer);
    ani.fill(c);
    let ex = aniWidthOn2 + gapOn2;
    let ey = aniHeightOn2 + gap34;
    ani.rect(ex, ey, gap, gapOn2);
    ani.rect(ex - gap34, ey, gapOn6, gapOn2);
    ani.rect(ex - gap34 / 2, ey, gap34, gapOn6);
    ani.rect(ex, ey - gapOn3, gapOn2, gapOn6);
    ani.rect(ex + gap34, ey, gapOn6, gapOn2);
    ani.rect(ex + gap34 / 2, ey, gap34, gapOn6);
    c = lerpColor(color(200, 255, 255), color(255, 255, 100), timer);
    ani.tint(c);
    ani.image(aniLayers["car window"], 0, -aniHeightOn3 / 2);
    ani.noTint();
    ani.rectMode(CORNER);
}

/**
 * @description This function draws the flink bench lamp (FB) oscilloscope-like
 * waveform visualization on top of an animation canvas using Paper.js.
 *
 * @returns { any } The `drawFBLoop` function is a procedural drawing function that
 * creates and modifies layer elements on top of an input image (referred to as 'ani')
 * using graphics-related operations such as stroke weight management using the
 * 'mStroke' variable as its primary manipulating parameter; various shapes are created
 * through rectangles using appropriate arguments (i.e., center align); lines are
 * created horizontally connecting three non-coplanar points – (A1), point A(the one
 * not explicitly stated but implied to be the furthest right vertical anchor of three
 * connecting rectangular layers of the graphic shape forming the triangle) - then
 * there’s another instance of it done below an arrow shape (creates arrow down from
 * left) pointing towards point C – using various coordinate pairs:aniHeightOn4/3 and
 * targetX coordinate to determine where one rectangle's bottom edge intersects
 * target's horizontal segment just like point C but on an arc line(with a specified
 * length) above that same intersection point creating yet another triangle by
 * repositioning two previously used endpoints as vertices for said new smaller
 * inscribed shape created upon subtractive intersection math within specific parameters
 * determined before drawing operations commenced involving circles centers near
 * midpoint distance calculation taking each vertical distance delta value divided
 * by respective line endpoint differential between endpoints subtractively compared
 * before creating multiple concentric circles or an overlapping 'ringed effect.'
 * This procedure yields several geometric forms:  rectangles used to represent signals
 * on three layers - one solid color green (mStroke parameter not equal zero) - two
 * additional triangulated shape combinations forming rightward arrows which help
 * illustrate input signals propagation routes from start and endpoint connections
 * when overlaid alongside one another via clipping- masked superimposition effect
 * (the overlay technique referenced inside draw FB loop function near its end);
 * circles are added upon this composition enhancing visualization by creating
 * concentric rings surrounding certain key features of interest on each graphics
 * layer or frame to represent potential movement dynamics based around internal
 * components working under computational parameters controlled by external stimuli
 * acting upstream which could involve user interaction manipulations and/or algorithmic
 * determinants - such processes help manage complexity inherent into system function
 * calls which determine its operation cycles' outcome
 *
 * When everything has been prepared within each frame – a composite set consisting
 * from all previous frames rebuilt into composite video using ani Layers[] object’s
 * array operations(animations could also refer to video still capture states here)
 * The return value remains unknown so no specific format is claimed
 */
function drawFBLoop() {
    if (!("fbl" in aniLayers)) {
        aniLayers["fbl"] = createGraphics(ani.width, ani.height);
        aniLayers["fbl"].rectMode(CENTER);
        aniLayers["fbl"].noFill();
        aniLayers["fbl"].strokeWeight(mStroke);
        aniLayers["fbl"].stroke(0);
        aniLayers["fbl"].rect(aniWidthOn2, aniHeightOn2, aniWidthOn4 * 2.5, aniHeightOn2);
        aniLayers["fbl"].line(0, aniHeightOn4, ani.width, aniHeightOn4);
        aniLayers["fbl"].fill(rCol[1]);
        let aw8 = aniWidthOn4 / 2;
        aniLayers["fbl"].circle(aniWidthOn4 * 0.75, aniHeightOn4, gapOn2);
        aniLayers["fbl"].rect(aniWidthOn2, aniHeightOn4, gapOn2, gapOn2);
        // aniLayers['fbl'].rect(aniWidthOn2 + aw8, aniHeightOn4, gapOn2, gapOn2);
        // aniLayers['fbl'].rect(aniWidthOn2, aniHeightOn4 * 3, gapOn2, gapOn2);
        aniLayers["fbl"].fill(0);
        let txs = ani.width - gapOn6;
        let g12 = gapOn6 / 2;
        aniLayers["fbl"].stroke(255);
        aniLayers["fbl"].strokeWeight(mStroke * 2);
        aniLayers["fbl"].line(txs, aniHeightOn4, txs + gap, aniHeightOn4);
        aniLayers["fbl"].stroke(0);
        aniLayers["fbl"].strokeWeight(mStroke);
        // aniLayers['fbl'].noStroke();
        aniLayers["fbl"].triangle(
            txs,
            aniHeightOn4,
            txs - gapOn6,
            aniHeightOn4 - g12,
            txs - gapOn6,
            aniHeightOn4 + g12
        );
        txs = gapOn3;
        aniLayers["fbl"].stroke(255);
        aniLayers["fbl"].strokeWeight(mStroke * 2);
        aniLayers["fbl"].line(txs, aniHeightOn4, txs + gapOn4, aniHeightOn4);
        aniLayers["fbl"].stroke(0);
        aniLayers["fbl"].strokeWeight(mStroke);
        aniLayers["fbl"].triangle(
            txs,
            aniHeightOn4,
            txs - gapOn6,
            aniHeightOn4 - g12,
            txs - gapOn6,
            aniHeightOn4 + g12
        );
        txs = aniWidthOn2 - aniWidthOn4;
        let ty = aniHeightOn4 * 3;
        aniLayers["fbl"].stroke(255);
        aniLayers["fbl"].strokeWeight(mStroke * 2);
        aniLayers["fbl"].line(txs, ty, txs - gapOn6 / 2, ty);
        aniLayers["fbl"].stroke(0);
        aniLayers["fbl"].strokeWeight(mStroke);
        aniLayers["fbl"].triangle(txs, ty, txs + gapOn6, ty - g12, txs + gapOn6, ty + g12);
        txs = aniWidthOn2 + aniWidthOn4 - gapOn3;
        aniLayers["fbl"].stroke(255);
        aniLayers["fbl"].strokeWeight(mStroke * 2);
        aniLayers["fbl"].line(txs, ty, txs - gapOn6 / 2, ty);
        aniLayers["fbl"].stroke(0);
        aniLayers["fbl"].strokeWeight(mStroke);
        aniLayers["fbl"].triangle(txs, ty, txs + gapOn6, ty - g12, txs + gapOn6, ty + g12);
        aw8 = aniWidthOn4 / 2;
        let gHeight = gap2;
        let inputSignalX = aw8 - gapOn3;
        let inputSignalY = gapOn3;
        let errorX = aniWidthOn3 - gapOn6;
        let errorY = gapOn3;
        let outputSignalX = ani.width - aw8 - gapOn3 / 3;
        let outputSignalY = gapOn3;
        let targetX = aniWidthOn2 + gapOn2;
        let targetY = aniHeightOn2 - gHeight / 2 + gapOn3; //aniHeightOn4 * 3 - gHeight + gapOn4 - mStroke/2;
        aniLayers["fbl overlay"] = createGraphics(ani.width, ani.height);
        aniLayers["fbl overlay"].strokeWeight(mStroke);
        aniLayers["fbl overlay"].stroke(0);
        aniLayers["fbl overlay"].noFill();
        aniLayers["fbl overlay"].rect(inputSignalX, inputSignalY, gapOn3, gHeight);
        aniLayers["fbl overlay"].rect(outputSignalX, outputSignalY, gapOn3, gHeight);
        aniLayers["fbl overlay"].rect(targetX, targetY, gapOn3, gHeight);
        aniLayers["fbl overlay"].rect(errorX, errorY, gapOn3, gHeight);
        aniLayers["fbl overlay"].line(
            targetX + gapOn3,
            targetY + gHeight / 2,
            targetX + gap + gapOn4,
            targetY + gHeight / 2
        );
        aniLayers["fbl overlay"].line(targetX, targetY + gHeight / 2, aniWidthOn2, targetY + gHeight / 2);
        aniLayers["fbl overlay"].line(aniWidthOn2, targetY + gHeight / 2, aniWidthOn2, aniHeightOn3 + gapOn4);
    }
}

/**
 * @description The `feedback` function creates a simulation of a servo motor control
 * system using animations. It displays various signals and target values as rectangles
 * on the screen. It takes into account feedback loops with delays and calculates an
 * error between the input signal and the target value to adjust the output signal accordingly.
 *
 * @returns { any } The `feedback()` function returns no value. It is a drawing
 * function that updates and displays the graphics for a simplified closed-loop control
 * system using Animations (ani) library. The function draws signals and errors on
 * the canvas using various colors and rectangles based on the input and output values.
 */
function feedback() {
    ani.clear();
    drawFBLoop();
    ani.image(aniLayers["fbl"], 0, gapOn3);
    // let input = (sin(millis()/100) + 1) * 0.33 + 0.165;
    let input = (sin(millis() / 50) + 1) * 0.1 + (sin(millis() / 1000) + 1) * 0.3;
    let target = 0.5 * smoothSquare(600) + 0.25;
    // simulate plant delay
    // let inputDelayed = (sin(millis()/per - per/8) + 1) / 2;
    let error = target - input;
    let output = input + error;
    ani.noStroke();
    let aw8 = aniWidthOn4 / 2;
    let gHeight = gap2;
    let inputSignalX = aw8 - gapOn3;
    let inputSignalY = gapOn3;
    ani.fill(255);
    ani.rect(inputSignalX, inputSignalY, gapOn3, gHeight);
    ani.fill(255, 0, 0);
    ani.rect(inputSignalX, inputSignalY + (1 - input) * gHeight, gapOn3, gHeight * input);
    let errorX = aniWidthOn3 - gapOn6;
    let errorY = gapOn3;
    ani.fill(255);
    ani.rect(errorX, errorY, gapOn3, gHeight);
    ani.fill(255, 0, 0);
    ani.rect(errorX, errorY + (1 - error / 2) * gHeight - gHeight / 2, gapOn3 / 2, (gHeight * error) / 2);
    ani.fill(0, 255, 0);
    ani.rect(errorX + gapOn3 / 2, errorY + (1 - error / 2) * gHeight - gHeight / 2, gapOn3 / 2, (gHeight * error) / 2);
    let outputSignalX = ani.width - aw8 - gapOn3 / 3;
    let outputSignalY = gapOn3;
    ani.fill(255);
    ani.rect(outputSignalX, outputSignalY, gapOn3, gHeight);
    ani.fill(0, 255, 0);
    ani.rect(outputSignalX, outputSignalY + (1 - output) * gHeight, gapOn3, gHeight * output);
    let targetX = aniWidthOn2 + gapOn2;
    let targetY = aniHeightOn2 - gHeight / 2 + gapOn3; //aniHeightOn4 * 3 - gHeight + gapOn4 - mStroke/2;
    ani.fill(255);
    ani.rect(targetX, targetY, gapOn3, gHeight);
    ani.fill(255, 0, 255);
    ani.rect(targetX, targetY + (1 - target) * gHeight, gapOn3, gHeight * target);
    let cx = targetX + gap; // + gapOn4;
    ani.image(aniLayers["fbl overlay"], 0, 0);
    ani.strokeWeight(mStroke);
    ani.stroke(0);
    ani.push();
    ani.translate(cx, targetY + gHeight / 2);
    target = -QUARTER_PI + (target - 0.25) * PI;
    ani.rotate(target);
    ani.fill(255, 0, 255);
    ani.circle(0, 0, gap34);
    ani.line(0, 0, 0, -gap34 / 2);
    ani.pop();
}

/**
 * @description The function `drawCarpentry()` creates and animates a simple nail
 * being driven into wood using CSS graphics.
 *
 * @returns { any } The `drawCarpentry` function returns nothing (i.e., it does not
 * return any value) and only modifies the `aniLayers` object by adding a new layer
 * called "nail" and modifying the existing "nail" layer. The function draws a rectangle
 * and a triangle on the "nail" layer using the `rectMode()`, `rect()`, and `triangle()`
 * methods.
 */
function drawCarpentry() {
    if (!("nail" in aniLayers)) {
        aniLayers["nail"] = createGraphics(gap, gap2);
        aniLayers["nail"].stroke(100);
        aniLayers["nail"].fill(100);
        aniLayers["nail"].rectMode(CENTER);
        aniLayers["nail"].rect(gapOn2, 0, gap34, gapOn6);
        aniLayers["nail"].rect(gapOn2, gapOn3 * 2, gapOn4, gap2 - gapOn3);
        aniLayers["nail"].triangle(
            gapOn2,
            gap2,
            gapOn2 - gapOn4 / 2,
            gap2 - gapOn2,
            gapOn2 + gapOn4 / 2,
            gap2 - gapOn2
        );
        aniLayers["nail small"] = createGraphics(gapOn2, gap);
        aniLayers["nail small"].push();
        aniLayers["nail small"].scale(0.5, 0.5);
        aniLayers["nail small"].image(aniLayers["nail"], 0, 0);
        aniLayers["nail small"].pop();
    }
}

/**
 * @description This function animates a carpentry themed graphics using the canvas
 * element. It sets up a simple sine wave animation to drive the movement of different
 * elements on the screen.
 *
 * @returns { any } The output returned by the `intermediary` function is a single
 * `ani` object representing the animated sequence of rectangles and circles. The
 * function does not return anything explicitly but rather modifies the `ani` object's
 * attributes and properties to set up the animation.
 *
 * Here's a concise description of what the output looks like:
 *
 * 	- Aniobject with several rectangular elements of various dimensions and colors
 * superimposed over one another on the same canvas. Some elements have round corners
 * (animated by `sin()` values).
 *
 * The animation runs for approximately 500 milliseconds (set by `per`). It shows a
 * sequence of changing colors and shapes using two differently sized circles and
 * several rectangles of varying heights. Gaps separate some of the elements.
 */
function intermediary() {
    drawCarpentry();
    ani.clear();
    let per = 500;
    let counter = countTo3(per) % 2;
    let timer = 1.0 - sin(millis() / (per / 2));
    let wh = aniHeightOn3 * 2;
    let nh = wh - gap * counter;
    let hh = wh + gapOn4 - gapOn2 * (1.0 - sin(millis() / (per / 2)));
    ani.noStroke();
    ani.fill(rCol[0]);
    ani.rect(0, wh, ani.width, ani.height);
    if (counter == 0) {
        ani.fill(255);
        ani.circle(aniWidthOn3 - gap34, wh - gap34, gap2);
    }
    ani.fill(rCol[1]);
    ani.rect(2 * aniWidthOn3, nh - gapOn2, gapOn2, gapOn2);
    ani.fill(100);
    ani.rect(aniWidthOn3 - gap34 - gapOn4, hh - gap - gapOn2, gapOn2, gap);
    ani.rect(2 * aniWidthOn3, hh - gap2, gapOn2, gap);
    ani.fill(rCol[2]);
    ani.rect(aniWidthOn3 - gapOn2, hh - (gap + gapOn4 / 2), gap, gapOn4);
    ani.rect(2 * aniWidthOn3 + gapOn2, hh - gap - gapOn2 - gapOn4 / 2, gap, gapOn4);
    ani.image(aniLayers["nail small"], aniWidthOn3 - gap, nh);
    ani.image(aniLayers["nail small"], 2 * aniWidthOn3, nh);
}

/**
 * @description This function generates an polygon outline of a circle with the given
 * radius and number of points using the arc() function to create smooth curves.
 *
 * @param { number } x - The `x` input parameter sets the starting position of the
 * vertices along the x-axis.
 *
 * @param { number } y - In the `polygon()` function above:
 *
 * The `y` input parameter specifies the starting y-coordinate of the polygon.
 *
 * @param { number } radius - The `radius` input parameter determines the length of
 * the line segments that are drawn to form the polygon.
 *
 * @param { number } npoints - The `npoints` input parameter specifies the number of
 * points that the polygonal shape should have.
 *
 * @returns {  } The `polygon` function returns a closed shape consisting of multiple
 * lines and corners that form a polygon. It takes five parameters:
 *
 * 	- `x` and `y`: the starting coordinates of the polygon (in the canvas coordinate
 * system)
 * 	- `radius`: the radius of the polygon vertices
 * 	- `npoints`: the number of sides of the polygon
 *
 * The function calculates the angle for each side of the polygon based on the `npoints`
 * parameter and then draws a line from the starting point to the ending point of
 * each side.
 */
function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    let off = angle - HALF_PI;
    ani.beginShape();
    for (let a = off; a < TWO_PI + off; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        ani.vertex(sx, sy);
    }
    ani.endShape(CLOSE);
}

/**
 * @description This function draws a procedurally generated animation of a triangle-shaped
 * object with circular and square components using the HTML5 canvas context's drawing
 * methods.
 *
 * @returns { any } The output returned by the `selfservice` function is not defined
 * or specified. The function only modifies the values of the variables `ani`, `per`,
 * `size`, `t`, `ramp`, `iramp`, `px`, `py`, `rx`, and `ry`, but it does not return
 * any value.
 */
function selfservice() {
    ani.clear();
    ani.rectMode(CENTER);
    let per = 1000;
    let size = gap34;
    let t = sin(millis() / per);
    let t2 = cos(millis() / per);
    let ramp = (t2 + 1) / 2;
    if (t >= 0) {
        ramp = 1 - ramp;
    }
    let iramp = 1 - ramp;
    let px = aniWidthOn4 * 3;
    let py = aniHeightOn2 - gap;
    let rx = aniWidthOn4;
    let drx = px - rx;
    let ry = py + gap2;
    let dry = ry - py;
    ani.noFill();
    ani.stroke(0);
    ani.strokeWeight(mStroke);
    ani.rect(aniWidthOn2, aniHeightOn2, gap3 + gapOn3, gap2);
    ani.line(aniWidthOn2, py, px + gap, py);
    ani.line(gapOn2, ry, rx, ry);
    ani.fill(0);
    ani.triangle(px + gap, py, px + gap34, py - gapOn6, px + gap34, py + gapOn6);
    ani.noStroke();
    // waste
    ani.fill(rCol[1]);
    ani.square(px, py + ramp * gap2, size);
    ani.fill(255);
    ani.circle(px, py + ramp * gap2, size);
    // part
    ani.fill(rCol[1]);
    ani.circle(px + ramp * gap3, py, size);
    ani.square(rx, ry - ramp * dry, size);
    ani.square(rx + drx * ramp, py, size);
    // waste
    ani.fill(rCol[1]);
    ani.square(rx + iramp * drx, ry, size);
    let subSquareSize = 0.85 * size; // sqrt ( Pi (d/2)^2) = sqrt(pi) * (d/2)
    ani.square(rx - iramp * drx, ry, subSquareSize);
    ani.fill(255);
    ani.circle(rx + iramp * drx, ry, size);
    // processors
    ani.fill(rCol[0]);
    ani.square(rx, ry, size * 1.5);
    ani.square(aniWidthOn2, py, size * 1.5);
    ani.fill(rCol[2]);
    star(aniWidthOn2, py, size / 2, size / 4, 5);
    polygon(rx, ry, size / 2, 3);
    ani.rectMode(CORNER);
}

/**
 * @description The `drawTrophy()` function creates and draws a trophy symbol using
 * the `aniLayers` array. It sets the fill color and no stroke for the symbol.
 *
 * @returns { any } The `drawTrophy()` function creates a new Graphics object named
 * "trophy" and modifies its properties to draw a trophy outline using rectangular
 * and circular shapes. The output returned by the function is not defined since it
 * does not return any value.
 */
function drawTrophy() {
    if (!("trophy" in aniLayers)) {
        aniLayers["trophy"] = createGraphics(gap, gap2);
        aniLayers["trophy"].noStroke();
        aniLayers["trophy"].fill(255, 200, 0);
        aniLayers["trophy"].circle(gapOn2, gapOn2, gap);
        aniLayers["trophy"].rect(0, 0, gap, gapOn2);
        aniLayers["trophy"].rectMode(CENTER);
        aniLayers["trophy"].rect(gapOn2, gap, gapOn4, gap2);
        aniLayers["trophy"].rect(gapOn2, gap + gapOn2 + gapOn4, gap34, gapOn4);
        aniLayers["trophy"].rect(gapOn2, gap2, gap, gapOn2);
    }
}

/**
 * @description The function `copying()` draws a rotating trophy using the Animate
 * library. It sets up the drawing canvas and fills the background with a gradient
 * color. Then it defines variables for the ellipse shape and its position and size
 * calculations. It uses sin and cosine functions to determine how much of the ellipse
 * to show or hide based on the angle of the animation.
 *
 * @returns { any } The function `copying()` draws a trophy image on an animation
 * canvas using AS3. The output returned by this function is the updated graphics
 * rendering on the animation canvas after the specified changes have been made to
 * the animation's position and scale.
 */
function copying() {
    drawTrophy();
    ani.clear();
    ani.imageMode(CENTER);
    ani.noStroke();
    let per = 1000;
    let now = millis();
    let r1 = smoothSquare(per, now);
    let t = cos(millis() / (per / 20));
    let ramp = r1;
    let alarm = 0;
    if (ramp == 0) {
        let cv = t * 100;
        ani.fill(255, 255 - cv, 255 - cv);
        ani.ellipse(aniWidthOn4, aniHeightOn2, aniWidthOn2, ani.height);
        // ani.rect(0, 0, aniWidthOn2, ani.height);
        alarm = sin(millis() / (per / 2));
    }
    let tx = aniWidthOn4 - gap + gap * ramp;
    let tx2 = tx + aniWidthOn2;
    let ty = aniHeightOn3;
    ani.image(aniLayers["trophy"], tx, ty);
    ani.image(aniLayers["trophy"], tx2, ty);
    ani.fill(100);
    let bsx = tx2 + gap34;
    ani.rect(tx2 + gap34, ty, gap34, gap, gap, gapOn4, gapOn3, gapOn6);
    bsx += gap34;
    ani.triangle(bsx, ty - gapOn6, bsx - gapOn6, ty + gapOn3, bsx + gapOn6, ty);
    let pw = gap;
    let ph = gap;
    let px = aniWidthOn4 - pw / 2;
    let px2 = px + aniWidthOn2;
    let py = aniHeightOn3 + aniLayers["trophy"].height / 2;
    ani.fill(rCol[1]);
    ani.rect(px, py - alarm * gapOn2, gap, gapOn4);
    ani.rect(px + gapOn4, py - alarm * gapOn2, gapOn2, gap);
    ani.rect(px2, py, gap, gapOn4);
    ani.fill(rCol[0]);
    ani.rect(px, py + gapOn4, gap, gap);
    ani.rect(px2, py + gapOn4, gap, gap);
    ani.stroke(0);
    ani.strokeWeight(mStroke);
    let sx = px + gapOn4;
    let ex = px + gap34;
    let sx2 = px + gapOn4 + aniWidthOn2;
    let ex2 = px + gap34 + aniWidthOn2;
    let sy = py + gap + gapOn4 - mStroke;
    let inc = (py - sy) / 4;
    for (let i = 0; i <= 3; i++) {
        ani.line(sx2, sy, ex2, sy);
        sy += inc;
    }
    sy = py + gap + gapOn4 - mStroke;
    inc = (py - alarm * gapOn2 - sy) / 4;
    for (let i = 0; i <= 3; i++) {
        ani.line(sx, sy, ex, sy);
        sy += inc;
    }
    ani.imageMode(CORNER);
}

/**
 * @description The `cheapshort` function animates a simple breakout game using Paper.js.
 *
 * @returns {  } The output returned by the `cheapshort` function is a animated image
 * object with three parts: the ball (a circle), the wall (a rectangle), and the
 * paddle (a horizontal rectangle). The ball moves horizontally on the screen and can
 * be painted with one of two different colors depending on its position. The wall
 * is static and colored white.
 */
function cheapshort() {
    ani.clear();
    ani.noStroke();
    let per = 500;
    let now = millis();
    let timer = now / per;
    let index = countTo3(per, 0, now);
    let tri = abs((timer % 4) - 2) / 2;
    let tri2f = abs(((timer / 8) % 4) - 2);
    let tri3 = int(4 * abs(((timer / 8 + per / 8) % 4) - 2));
    let tri2 = int(2 * tri2f);
    let offsets = [0, -gap - gapOn2, gap + gapOn2, 0];
    let cx = tri * (ani.width - gap2) + gap;
    let cy;
    // cheap
    if (tri2 == 3) {
        if (tri <= 0.05) {
            ani.fill(rCol[3]);
        } else {
            ani.fill(rCol[2]);
        }
        if (tri3 != 3 && tri3 != 4) {
            ani.rect(gapOn2, aniHeightOn2 + offsets[1] - gapOn2, gapOn4, gap);
        }
        ani.fill(rCol[0]);
        cy = aniHeightOn2 - gapOn2 + (1 - tri) * offsets[1] + gapOn2;
        ani.circle(cx, cy, gapOn2);
    }
    if (tri2 == 0) {
        if (tri <= 0.05) {
            ani.fill(rCol[3]);
        } else {
            ani.fill(rCol[2]);
        }
        if (tri3 != 3 && tri3 != 4) {
            ani.rect(gapOn2, aniHeightOn2 + offsets[1] - gapOn2, gapOn4, gap);
            ani.rect(gapOn2, aniHeightOn2 + offsets[2] - gapOn2, gapOn4, gap);
        }
        ani.fill(rCol[0]);
        cy = aniHeightOn2 - gapOn2 + (1 - tri) * offsets[1] + gapOn2;
        ani.circle(cx, cy, gapOn2);
        cy = aniHeightOn2 - gapOn2 + (1 - tri) * offsets[2] + gapOn2;
        ani.circle(cx, cy, gapOn2);
    }
    // ball(s)
    ani.fill(rCol[0]);
    cy = aniHeightOn2 - gapOn2 + (1 - tri) * offsets[tri2] + gapOn2;
    ani.circle(cx, cy, gapOn2);
    // wall
    ani.fill(rCol[1]);
    ani.rect(ani.width - gap34, 0, gapOn2, ani.height);
    // paddle
    let px = aniHeightOn2 - gapOn2 + (1 - tri) * offsets[tri2];
    ani.rect(gapOn4, px, gapOn2, gap);
}

/**
 * @description This function defines an animation loop that draws a series of circles
 * and arcs on the canvas using different colors and shades.
 *
 * @returns { any } The function "mechanicalsubstitution" produces a 3D animation of
 * two blue circles and one red circle that revolve around a center point with different
 * phases and speeds.
 */
function mechanicalsubstitution() {
    ani.clear();
    ani.noStroke();
    ani.rectMode(CENTER);
    let per = 2000;
    let currentAngle = ((TWO_PI * millis()) / per) % TWO_PI;
    let coscurrentAngle = cos(currentAngle);
    let sincurrentAngle = sin(currentAngle);
    let c1 = color(255, 0, 0);
    let c2 = color(0, 0, 255);
    //brushed()
    ani.push();
    ani.translate(aniWidthOn4 - gapOn6, aniHeightOn2);
    ani.fill(c1);
    ani.rect(-gap, 0, gapOn4, gap3);
    ani.fill(c2);
    ani.rect(gap, 0, gapOn4, gap3);
    ani.rotate(currentAngle);
    if (sincurrentAngle < 0) {
        [c1, c2] = [c2, c1];
    }
    ani.fill(c1);
    let xoff = gap34 / 2;
    ani.rect(-xoff, 0, gap34, gapOn2);
    ani.fill(c2);
    ani.rect(xoff, 0, gap34, gapOn2);
    ani.arc(0, 0, gap34, gap34, PI, 0);
    ani.fill(c1);
    ani.arc(0, 0, gap34, gap34, 0, PI);
    ani.fill(255);
    ani.rect(0, 0, gap34, gapOn6 / 2);
    ani.pop();
    ani.strokeWeight(mStroke);
    ani.stroke(0);
    let yend = gapOn2;
    let x1 = aniWidthOn4 - xoff - gapOn6;
    let x2 = aniWidthOn4 + xoff - gapOn6;
    ani.line(x1, aniHeightOn2, x1, yend);
    ani.line(x2, aniHeightOn2, x2, yend);
    ani.noStroke();
    ani.fill(255, 230, 0);
    ani.circle(x1, aniHeightOn2, gapOn4);
    ani.circle(x2, aniHeightOn2, gapOn4);
    ani.fill(255, 0, 0);
    ani.circle(x1, yend, gapOn2);
    ani.fill(0, 0, 255);
    ani.circle(x2, yend, gapOn2);
    //brushless
    let xc = ani.width - aniWidthOn4 + gapOn6;
    let xy = aniHeightOn2 + gapOn2;
    let radius = gap2;
    ani.strokeWeight(mStroke);
    ani.stroke(0);
    xoff = gap + gapOn6;
    x1 = xc - xoff;
    x2 = xc;
    let x3 = xc + xoff;
    ani.line(x1, gapOn2, x1, xy + 0.35 * aniHeightOn4);
    ani.line(x2, gapOn2, x2, xy - aniHeightOn4);
    ani.line(x3, gapOn2, x3, xy + 0.35 * aniHeightOn4);
    ani.noStroke();
    redC = color(255, 0, 0);
    blueC = color(0, 0, 255);
    off = color(100);
    let stators = [];
    stators.push([
        [off, off],
        [blueC, redC],
        [redC, blueC],
    ]);
    stators.push([
        [redC, blueC],
        [blueC, redC],
        [off, off],
    ]);
    stators.push([
        [redC, blueC],
        [off, off],
        [blueC, redC],
    ]);
    stators.push([
        [off, off],
        [redC, blueC],
        [blueC, redC],
    ]);
    stators.push([
        [blueC, redC],
        [redC, blueC],
        [off, off],
    ]);
    stators.push([
        [blueC, redC],
        [off, off],
        [redC, blueC],
    ]);
    stators.push([
        [off, off],
        [blueC, redC],
        [redC, blueC],
    ]);
    let phase = round(currentAngle);
    ani.fill(stators[phase][0][0]);
    ani.circle(x2, gapOn2, gapOn2);
    ani.fill(stators[phase][1][0]);
    ani.circle(x3, gapOn2, gapOn2);
    ani.fill(stators[phase][2][0]);
    ani.circle(x1, gapOn2, gapOn2);
    let rotations = [0, TWO_PI / 3, (2 * TWO_PI) / 3];
    for (let i = 0; i < 3; i++) {
        ani.push();
        ani.translate(xc, xy);
        ani.rotate(rotations[i]);
        ani.fill(stators[phase][i][0]);
        ani.rect(0, -aniHeightOn4, gapOn2, gapOn4);
        ani.fill(stators[phase][i][1]);
        ani.rect(0, -aniHeightOn4 - gapOn4, gapOn2, gapOn4);
        ani.pop();
    }
    ani.push();
    ani.translate(xc, xy);
    ani.rotate(currentAngle);
    ani.fill(redC);
    let arad = gap + gapOn2;
    ani.arc(0, 0, arad, arad, PI, 0);
    ani.fill(blueC);
    ani.arc(0, 0, arad, arad, 0, PI);
    ani.fill(255);
    ani.circle(0, 0, gap34);
    ani.pop();
    ani.stroke(200);
    ani.line(aniWidthOn2, 0, aniWidthOn2, ani.height);
    ani.rectMode(CORNER);
}

function pneumaticsAndHydraulics() {
    ani.clear();
    ani.noStroke();
    let time = millis();
    ani.fill(0, 0, 255);
    ani.rect(aniWidthOn2, aniHeightOn4, aniWidthOn2, 3 * aniHeightOn4);
    ani.rect(0, 3 * aniHeightOn4, aniWidthOn2, aniHeightOn4);

    ani.fill(100, 100, 100);
    ani.beginShape();
    ani.vertex(aniWidthOn2 - gap, ani.height);
    ani.vertex(aniWidthOn2 - gapOn2, 0);
    ani.vertex(aniWidthOn2 + gapOn2, 0);
    ani.vertex(aniWidthOn2 + gap, ani.height);
    ani.endShape();
    ani.fill(0, 0, 255);
    ani.rect(aniWidthOn2 - gap, aniHeightOn2 + gapOn6, gap2, gapOn3, gapOn6);
    ani.rect(aniWidthOn2 - gap, aniHeightOn2 + gapOn6, gapOn3, aniHeightOn2, gapOn6);
    for (let i = 0; i < 50; i++) {
        ani.fill(0, 200, 200);
        offy = random(gapOn2);
        offyPercent = offy / gapOn2 + 0.2;
        offx = (random(gap) - gapOn2) * offyPercent;
        rad = random(gapOn4) * offyPercent;

        ani.circle(aniWidthOn2 - 5 * gapOn6 + offx, aniHeightOn2 + 3 * gapOn4 + offy, rad);
    }
    ani.fill(255, 0, 0);
    ani.push();
    ani.translate(aniWidthOn2, aniHeightOn2);
    let per = 5000;
    let currentAngle = ((TWO_PI * millis()) / per) % TWO_PI;
    ani.rotate(currentAngle);
    ani.arc(0, 0, gap, gap, 0, QUARTER_PI);
    ani.arc(0, 0, gap, gap, HALF_PI, HALF_PI + QUARTER_PI);
    ani.arc(0, 0, gap, gap, PI, PI + QUARTER_PI);
    ani.arc(0, 0, gap, gap, -HALF_PI, -QUARTER_PI);

    ani.pop();
}

function shellsAndFilms() {
    ani.clear();
    ani.background(204, 171, 139)
    drawCar();
    let per = 20000;
    let currentAngle = ((TWO_PI * millis()) / per) % TWO_PI;
    let coscurrentAngle = cos(currentAngle);
    let sincurrentAngle = sin(currentAngle);
    cw = aniLayers["car"].width / 2;
    ch = aniLayers["car"].height / 2;
    ani.noStroke();
    ani.fill(100, 100, 100);
    ani.rect(0, aniHeightOn4 + ch - gapOn6/2, ani.width, gap2);
    ani.fill(101, 67, 33);
    ani.rect(0, 0, ani.width, gap);
    ani.fill(50, 50, 50);
    ani.circle(gap, gap, gap);
    ani.rect(gapOn2, gap, gapOn6, (ani.height - gap2 - gapOn6/2) * abs(sincurrentAngle));
    ani.fill(200, 200, 200);
    ani.circle(gap, gap, gapOn2);
    ani.image(aniLayers["car"], aniWidthOn2 - gap2, aniHeightOn4, cw, ch);
    ani.image(aniLayers["car window"], aniWidthOn2 - gap2, aniHeightOn4, cw, ch);
    ani.fill(101, 67, 33);
    ani.rect(aniWidthOn2 + gap2, aniHeightOn2-gap, gap, gap2);
    ani.fill(255, 215, 0);
    ani.circle(aniWidthOn2 + gap2 + gapOn6, aniHeightOn2, gapOn6)

}

function eggPan() {
    ani.clear();
    let per = 2000;
    let currentAngle = ((TWO_PI * millis()) / per) % TWO_PI;
    let coscurrentAngle = cos(currentAngle);
    let sincurrentAngle = sin(currentAngle);
    ani.push();
    ani.stroke(200, 200, 200);
    ani.strokeWeight(gapOn6);
    ani.fill(100, 100, 100);
    ani.translate(aniWidthOn3 + sincurrentAngle * gapOn4, 0);
    ani.circle(0, aniHeightOn2, aniWidthOn3);
    ani.noStroke();
    ani.fill(200, 200, 200);
    ani.rect(aniWidthOn3 * 0.5, aniHeightOn2 - gapOn4 * 0.4, gap, gapOn4);
    ani.fill(100, 100, 100);
    ani.rect(aniWidthOn3 * 0.5 + gap, aniHeightOn2 - gapOn4, gap, gapOn2);
    ani.pop();
    ani.noStroke();
    ani.fill(255);
    ani.circle(aniWidthOn3, aniHeightOn2, gap);
    ani.fill(255, 200, 0);
    ani.circle(aniWidthOn3, aniHeightOn2, gapOn2);
}
