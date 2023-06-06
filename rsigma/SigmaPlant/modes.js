class Mode {
    constructor() {
        this.modeHandOff = NO_CHANGE;
        this.ready = false;
    }
    mouseReleased(event) {}

    mousePressed(mouseButton) {}

    mouseWheel(event) {}

    draw() {}

    touchMoved() {}
}

class Application extends Mode {
    constructor() {
        super();
        this.ready = false;
        setTimeout(() => {
            this.ready = true;
        }, 100);

        let themeNamesArray = Object.keys(themes); // get the names of all themes
        // create the drop-down menu and position it at the top of the screen
        this.sel = createSelect();
        this.sel.position(10, 10);
        // add an option to the menu for each theme
        for (let i = 0; i < themeNamesArray.length; i++) {
            this.sel.option(themeNamesArray[i]);
        }
        // set a callback function to be called whenever the selected option changes
        this.changeTheme = this.changeTheme.bind(this);
        this.sel.changed(this.changeTheme);
        let color = getColor('text');
        let backgroundColor = getColor('secondary');
        this.sel.style('color', color);
        this.sel.style('background-color', backgroundColor);
        this.touchDevice = isTouchDevice();
        this.previousDistance = 0;
    }

    delete() {
        this.sel.remove(); // check all of this :-P
    }

    changeTheme() {
        let themeName = this.sel.value(); // get the name of the selected theme
        setTheme(themeName); // set the theme
        let color = getColor('text');
        let backgroundColor = getColor('secondary');
        this.sel.style('color', color);
        this.sel.style('background-color', backgroundColor);
    }

    mouseReleased() {
        if (sess.plant.isActive == false && this.ready) {
            menu.activate();
            menu.setPosition(mouseX, mouseY);
        }
    }

    activateMenuOnRightClick() {
        if (menu.isActive == false) {
            setTimeout(() => {
                menu.activate();
                menu.setPosition(mouseX, mouseY);
            }, 100);
        }
    }

    plantMousePassThrough() {
        if (menu.isActive == false) {
            sess.plant.handleMousePress(globalZoom);
        }
    }

    menuMousePassThrough() {
        if (menu.isActive == true) {
            const pressed = menu.handleMousePress();
            if (pressed === false) {
                menu.dismiss();
            }
        }
    }

    mousePressed(mouseButton) {
        if (this.ready) {
            if (this.touchDevice) {
                this.plantMousePassThrough();
                this.menuMousePassThrough();
            } else {
                if (mouseButton === RIGHT) {
                    this.activateMenuOnRightClick();
                }
                if (mouseButton === LEFT) {
                    this.plantMousePassThrough();
                    this.menuMousePassThrough();
                }
            }
        }
    }

    mouseWheel(event) {
        if (
            menu.isActive == false &&
            sess.plant.isActive == false &&
            this.ready
        ) {
            globalZoom -= event.deltaY * 0.001;
            globalZoom = constrain(globalZoom, 0.2, 2);
            fpsEvent();
        }
    }

    touchMoved() {
        // Only perform pinch zoom when there are exactly two touch points
        if (
            touches.length === 2 &&
            menu.isActive == false &&
            sess.plant.isActive == false &&
            this.ready
        ) {
            let touchA = touches[0];
            let touchB = touches[1];

            // Calculate the current distance between two touches
            let currentDistance = dist(touchA.x, touchA.y, touchB.x, touchB.y);

            if (this.previousDistance > 0) {
                // The difference in distance represents the zooming action
                let difference = currentDistance - this.previousDistance;

                // Adjust globalZoom by the difference
                // You may want to apply a scaling factor to difference, similar to your mouseWheel() implementation
                globalZoom += difference * 0.001;
                globalZoom = constrain(globalZoom, 0.2, 2);
                fpsEvent();
            }

            // Store the distance for the next frame
            this.previousDistance = currentDistance;
        } else {
            // Reset the previous distance if the screen is not currently being pinched
            this.previousDistance = 0;
        }
    }

    draw(cnv) {
        textSize(myTextSize);
        scrollBoard(globalZoom);
        drawGrid(getColor('gridline'), globalZoom);
        sess.update(globalZoom);
        sess.draw(globalZoom, cnv);
        menu.display();
        // noStroke();
        // fill(255);
        // textSize(12);
        // text('FPS: ' + int(frameRate()).toString(), windowWidth - 75, 50);
        // if (isTouchDevice()) {
        //     text('touch', windowWidth - 75, 65);
        // } else {
        //     text('mouse', windowWidth - 75, 65);
        // }
    }
}

function drawS(x, y, w, h) {
    line(x + w, y + h, x, y + h);
    line(x + w, y + h, x + w, y + h / 2);
    line(x + w, y + h / 2, x, y + h / 2);
    line(x, y + h / 2, x, y);
    line(x + w, y, x, y);
}

function drawI(x, y, w, h) {
    line(x + w / 2, y, x + w / 2, y + h);
}

function drawG(x, y, w, h) {
    line(x, y + h, x + w, y + h);
    line(x, y + h, x, y);
    line(x, y, x + w, y);
    line(x + w, y + h / 2, x + w, y + h);
    line(x + w / 2, y + h / 2, x + w, y + h / 2);
}

function drawM(x, y, w, h) {
    line(x, y + h, x, y);
    line(x, y, x + w / 2, y + h / 2);
    line(x + w / 2, y + h / 2, x + w, y);
    line(x + w, y, x + w, y + h);
}

function drawA(x, y, w, h) {
    line(x, y + h, x + w / 2, y);
    line(x + w / 2, y, x + w, y + h);
    line(x + w / 4, y + h / 2, x + (w * 3) / 4, y + h / 2);
}

function drawP(x, y, w, h) {
    line(x, y, x, y + h);
    line(x, y, x + w, y);
    line(x + w, y, x + w, y + h / 2);
    line(x, y + h / 2, x + w, y + h / 2);
}

function drawL(x, y, w, h) {
    line(x, y, x, y + h);
    line(x, y + h, x + w * 0.5, y + h);
}

function drawN(x, y, w, h) {
    line(x, y + h, x, y);
    line(x, y, x + w, y + h);
    line(x + w, y + h, x + w, y);
}

function drawT(x, y, w, h) {
    line(x, y, x + w, y);
    line(x + w / 2, y, x + w / 2, y + h);
}

class Loading extends Mode {
    constructor() {
        super();
        this.trigger = 0;
        const charWidth = min(windowWidth / 10, windowHeight / 10);
        const spacer = min(windowWidth / 40, windowHeight / 40);
        const charHeight = min(windowWidth / 10, windowHeight / 10);
        const startX = (windowWidth - (charWidth * 5 + 1.75 * spacer)) / 2; // Center 5 characters
        const startY = windowHeight / 2 - charHeight * 2; // windowH eight / 2 - charHeight * 0.5

        this.middleX = (windowWidth - charWidth) / 2;
        this.middleY = (windowHeight - charHeight) / 2;
        this.ratio = 1.0;
        this.letterPos = [];
        this.letterPos.push([startX, startY, charWidth, charHeight]);
        this.letterPos.push([
            startX + charWidth + spacer / 2,
            startY,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 2 + spacer,
            startY,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 3 + spacer * 2,
            startY,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 4 + spacer * 3,
            startY,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX,
            startY + charHeight * 1.5,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth + spacer * 1.5,
            startY + charHeight * 1.5,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 2 + spacer,
            startY + charHeight * 1.5,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 3 + 2 * spacer,
            startY + charHeight * 1.5,
            charWidth,
            charHeight
        ]);
        this.letterPos.push([
            startX + charWidth * 4 + spacer * 3,
            startY + charHeight * 1.5,
            charWidth,
            charHeight
        ]);
        this.transparentBG = getColor('background').levels;
        this.transparentBG[3] = 0;
        this.transparentBG = color(this.transparentBG);
    }
    mouseReleased(event) {
        return true;
    }

    mousePressed(mouseButton) {
        return true;
    }

    mouseWheel(event) {
        return true;
    }

    drawTitle() {
        drawS(
            lerp(this.letterPos[0][0], this.middleX, this.ratio),
            lerp(this.letterPos[0][1], this.middleY, this.ratio),
            this.letterPos[0][2],
            this.letterPos[0][3]
        );
        drawI(
            lerp(this.letterPos[1][0], this.middleX, this.ratio),
            lerp(this.letterPos[1][1], this.middleY, this.ratio),
            this.letterPos[1][2],
            this.letterPos[1][3]
        );
        drawG(
            lerp(this.letterPos[2][0], this.middleX, this.ratio),
            lerp(this.letterPos[2][1], this.middleY, this.ratio),
            this.letterPos[2][2],
            this.letterPos[2][3]
        );
        drawM(
            lerp(this.letterPos[3][0], this.middleX, this.ratio),
            lerp(this.letterPos[3][1], this.middleY, this.ratio),
            this.letterPos[3][2],
            this.letterPos[3][3]
        );
        drawA(
            lerp(this.letterPos[4][0], this.middleX, this.ratio),
            lerp(this.letterPos[4][1], this.middleY, this.ratio),
            this.letterPos[4][2],
            this.letterPos[4][3]
        );
        drawP(
            lerp(this.letterPos[5][0], this.middleX, this.ratio),
            lerp(this.letterPos[5][1], this.middleY, this.ratio),
            this.letterPos[5][2],
            this.letterPos[5][3]
        );
        drawL(
            lerp(this.letterPos[6][0], this.middleX, this.ratio),
            lerp(this.letterPos[6][1], this.middleY, this.ratio),
            this.letterPos[6][2],
            this.letterPos[6][3]
        );
        drawA(
            lerp(this.letterPos[7][0], this.middleX, this.ratio),
            lerp(this.letterPos[7][1], this.middleY, this.ratio),
            this.letterPos[7][2],
            this.letterPos[7][3]
        );
        drawN(
            lerp(this.letterPos[8][0], this.middleX, this.ratio),
            lerp(this.letterPos[8][1], this.middleY, this.ratio),
            this.letterPos[8][2],
            this.letterPos[8][3]
        );
        drawT(
            lerp(this.letterPos[9][0], this.middleX, this.ratio),
            lerp(this.letterPos[9][1], this.middleY, this.ratio),
            this.letterPos[9][2],
            this.letterPos[9][3]
        );
    }

    draw() {
        frameRate(highFrameRate);
        background(getColor('background'));
        if (frameCount > 20) {
            const baseDecrement = 0.05;
            const desiredFrameRate = highFrameRate; // adjust this to the frame rate you designed the animation for
            const currentFrameRate = frameRate();
            const decrement =
                baseDecrement * (desiredFrameRate / currentFrameRate);

            if (this.ratio > 0) {
                this.ratio -= decrement;
                stroke(getColor('outline'));
            } else {
                if (this.trigger == 0) {
                    this.trigger = frameCount + 30;
                }
                scrollBoard(1.0);
                let colorRatio = (frameCount - (this.trigger - 30)) / 30.0;
                let interpColor = lerpColor(
                    getColor('background'),
                    getColor('gridline'),
                    colorRatio
                );
                drawGrid(interpColor);
                interpColor = lerpColor(
                    getColor('outline'),
                    this.transparentBG,
                    colorRatio
                ); // hard coded transparent onyx
                stroke(interpColor);
            }
        } else {
            stroke(getColor('outline'));
        }
        this.drawTitle();

        if (frameCount > this.trigger && this.trigger != 0) {
            this.modeHandOff = APPLICATION;
        }
    }
}
