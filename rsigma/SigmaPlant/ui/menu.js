class MenuButton {
    constructor(label, x, y, action, level = 0) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.action = action;
        this.buttonRadius = 50;
        this.level = level;
        this.numEdges = 5;
        this.isAnimating = true;
        this.animationCountDown = 0.0;
        this.animateForward = true;
    }

    resetAnimation(forward) {
        this.animateForward = forward;
        if (forward) {
            this.animationCountDown = 0.0;
        } else {
            this.animationCountDown = 1.0;
        }
        this.isAnimating = true;
    }

    noAnimation() {
        this.isAnimating = false;
    }

    display(offAlpha = 0) {
        switch (this.level) {
            case 1:
                fill(getColor('secondary'));
                break;
            default:
                fill(getColor('primary'));

        }
        stroke(getColor('outline'));
        if (this.numEdges === 0) {
            ellipse(this.x, this.y, this.buttonRadius * 2, this.buttonRadius * 2);
        } else {
            let br;
            if (this.isAnimating) {
                const baseIncrement = 0.1;
                const desiredFrameRate = highFrameRate; // adjust this to the frame rate you designed the animation for
                const currentFrameRate = frameRate();
                const increment = baseIncrement * (desiredFrameRate / currentFrameRate);
                if (this.animateForward) {
                    this.animationCountDown += increment;
                } else {
                    this.animationCountDown -= increment;
                }
                if ((this.animationCountDown >= 1 && this.animateForward) || (this.animationCountDown <= 0 && !this.animateForward)) {
                    this.animationCountDown = 1;
                    this.isAnimating = false;
                }
                br = this.animationCountDown * this.buttonRadius;
            } else {
                br = this.buttonRadius;
            }
            push();
            translate(this.x, this.y);
            rotate(PI / 2); // To have one vertex pointing to the center
            beginShape();
            for (let i = 0; i < this.numEdges; i++) {
                let angle = map(i, 0, this.numEdges, 0, TWO_PI);
                let x = cos(angle + offAlpha) * br;
                let y = sin(angle + offAlpha) * br;
                vertex(x, y);
            }
            endShape(CLOSE);
            pop();
        }
        if (!this.isAnimating) {
            fill(getColor('text'));
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.label, this.x, this.y);
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    checkMouseClick() {
        let pressed = false;
        if (dist(mouseX, mouseY, this.x, this.y) < this.buttonRadius) {
            pressed = true;
            if (this.action) {
                this.action();
            }
        }
        return pressed;
    }
}

class SubMenu {
    constructor(buttons, label) {
        this.buttons = buttons;
        this.isActive = false;
        this.label = label;
    }

    resetAnimation() {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].resetAnimation();
        }
    }

    noAnimation() {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].noAnimation();
        }
    }

    activate() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].resetAnimation();
        }
    }

    display() {
        if (this.isActive) {
            for (let i = 0; i < this.buttons.length; i++) {
                this.buttons[i].display(map(i, 0, this.buttons.length, 0, TWO_PI) - radians(90));
            }
        }
    }

    handleMousePress() {
        let pressed = false;
        if (mouseButton === LEFT && this.isActive) {
            for (let i = 0; i < this.buttons.length; i++) {
                pressed = pressed || this.buttons[i].checkMouseClick();
            }
        }
        return pressed;
    }
}

class CircularMenu {
    constructor() {
        this.isActive = false;
        this.position = createVector(0, 0);
        this.buttons = [];
        this.subMenus = [];
        this.activeSubMenu = null;
        this.isAnimating = false;
        this.animationCountDown = null;
        this.resetAnimation();
    }

    addButton(label, action) {
        const button = new MenuButton(label, 0, 0, action);
        this.buttons.push(button);
        return button;
    }

    getButton(label) {
        return this.buttons.find(button => button.label === label);
    }

    activate() {
        if (!this.isActive) {
            this.isActive = true;
            this.resetAnimation(true);
        }
    }

    resetAnimation(forward) {
        this.animationCountDown = radians(90);
        this.isAnimating = true;
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].resetAnimation(forward);
        }
        // this.isAnimating = false;
        // this.animationCountDown = 0;
    }

    dismiss() {
        setTimeout(() => {
            if (this.isActive) {
                this.isActive = false;
                this.resetAnimation(false);
                if (this.activeSubMenu) {
                    this.activeSubMenu.deactivate();
                    this.activeSubMenu = null;
                }
            }
        }, 100);
    }

    setPosition(x, y) {
        this.position.set(x, y);
        this.updateButtonPositions();
    }

    updateButtonPositions() {
        const buttonRadius = 80;
        for (let i = 0; i < this.buttons.length; i++) {
            const angle = map(i, 0, this.buttons.length, 0, TWO_PI);
            const x = this.position.x + cos(angle + this.animationCountDown) * buttonRadius;
            const y = this.position.y + sin(angle + this.animationCountDown) * buttonRadius;
            this.buttons[i].setPosition(x, y);
        }
        for (let i = 0; i < this.subMenus.length; i++) {
            for (let j = 0; j < this.subMenus[i].buttons.length; j++) {
                const angle = map(j, 0, this.subMenus[i].buttons.length, 0, TWO_PI);
                const x = this.position.x + cos(angle - this.animationCountDown) * buttonRadius * 2;
                const y = this.position.y + sin(angle - this.animationCountDown) * buttonRadius * 2;
                this.subMenus[i].buttons[j].setPosition(x, y);
            }
        }
    }

    newSubMenu(buttonGroup, label) {
        const subMenu = new SubMenu(buttonGroup, label);
        this.subMenus.push(subMenu);
        return subMenu;
    }

    deactivateSubMenu() {
        this.activeSubMenu.deactivate();
        this.activeSubMenu = null;
    }

    activateSubMenu(label) {
        // if (this.activeSubMenu) {
        //     this.activeSubMenu.deactivate();
        //     this.activeSubMenu = null;
        // } else {
        this.activeSubMenu = this.subMenus.find(subMenu => subMenu.label === label);
        if (this.activeSubMenu) {
            this.activeSubMenu.noAnimation();
            this.activeSubMenu.activate();
        }
        // }
    }

    display() {
        if (this.isActive) {
            textSize(myTextSize);
            if (this.isAnimating) {
                const baseDecrement = radians(9);
                const desiredFrameRate = highFrameRate; // adjust this to the frame rate you designed the animation for
                const currentFrameRate = frameRate();
                const decrement = baseDecrement * (desiredFrameRate / currentFrameRate);
                this.animationCountDown -= decrement;
                if (this.animationCountDown <= 0) {
                    // this.animationCountDown = 0;
                    this.isAnimating = false;
                }
                this.updateButtonPositions();
            }
            strokeWeight(1);
            if (this.activeSubMenu) {
                this.activeSubMenu.display();
            }
            for (let i = 0; i < this.buttons.length; i++) {
                this.buttons[i].display(map(i, 0, this.buttons.length, 0, TWO_PI) - radians(90));
            }
        }
        if (this.isAnimating) {
            const baseDecrement = radians(9);
            const desiredFrameRate = highFrameRate; // adjust this to the frame rate you designed the animation for
            const currentFrameRate = frameRate();
            const decrement = baseDecrement * (desiredFrameRate / currentFrameRate);
            this.animationCountDown -= decrement;
            if (this.animationCountDown <= 0.0) {
                // this.animationCountDown = 0;
                this.isAnimating = false;
            }
        }

        if (this.isAnimating) {
            this.updateButtonPositions();
            for (let i = 0; i < this.buttons.length; i++) {
                this.buttons[i].display(map(i, 0, this.buttons.length, 0, TWO_PI) - radians(90));
            }
        }
    }

    handleMousePress() {
        let pressed = false;
        if (mouseButton === LEFT && this.isActive) {
            for (let i = 0; i < this.buttons.length; i++) {
                pressed = pressed || this.buttons[i].checkMouseClick();
            }
            if (this.activeSubMenu) {
                pressed = pressed || this.activeSubMenu.handleMousePress();
            }
        }
        return pressed;
    }
}
