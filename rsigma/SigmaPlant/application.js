
let oldKeyFocus = true;
let oldPlantState = true;

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

    // mouseWheel(event) {
    //     if (
    //         menu.isActive == false &&
    //         sess.plant.isActive == false &&
    //         this.ready
    //     ) {
    //         globalZoom -= event.deltaY * 0.001;
    //         globalZoom = constrain(globalZoom, 0.2, 2);
    //         fpsEvent();
    //     }
    // }

    mouseWheel(event) {
        if (
            menu.isActive == false &&
            sess.plant.isActive == false &&
            this.ready
        ) {
            let boardBeforeZoom = screenToBoard(mouseX, mouseY);
            
            let oldZoom = globalZoom;
            globalZoom -= event.deltaY * 0.001;
            globalZoom = constrain(globalZoom, 0.2, 2);
            
            let boardAfterZoom = screenToBoard(mouseX, mouseY);
            
            scrollX += boardBeforeZoom.x - boardAfterZoom.x;
            scrollY += boardBeforeZoom.y - boardAfterZoom.y;
    
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
        if (oldKeyFocus != keyboardRequiresFocus) {
            console.log("KEYBOARD FOCUS:", keyboardRequiresFocus);
            oldKeyFocus = keyboardRequiresFocus;
        }
    
        if (oldPlantState != sess.plant.isActive) {
            console.log("PLANT ACTIVE:", sess.plant.isActive);
            oldPlantState = sess.plant.isActive;
        }
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