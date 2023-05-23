class MenuButton {
    constructor(label, x, y, action, level = 0) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.action = action;
        this.buttonRadius = 50;
        this.level = level;
    }

    display() {
        switch(this.level) {
            case 1:
                fill(getColor("secondary"));
                break;
            default:
                fill(getColor("primary"));
                
        }
        stroke(getColor("outline"));
        ellipse(this.x, this.y, this.buttonRadius * 2, this.buttonRadius * 2);
        fill(getColor("text"));
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.label, this.x, this.y);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    checkMouseClick() {
        if (dist(mouseX, mouseY, this.x, this.y) < this.buttonRadius) {
            console.log(this.label);
            if (this.action) {
                this.action();
            }
        }
    }
}

class SubMenu {
    constructor(buttons, label) {
        this.buttons = buttons;
        this.isActive = false;
        this.label = label;
    }

    activate() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }

    display() {
        if (this.isActive) {
            for (let i = 0; i < this.buttons.length; i++) {
                this.buttons[i].display();
            }
        }
    }

    handleMousePress() {
        if (mouseButton === LEFT && this.isActive) {
            for (let i = 0; i < this.buttons.length; i++) {
                this.buttons[i].checkMouseClick();
            }
        }
    }
}

class CircularMenu {
    constructor() {
        this.isActive = false;
        this.position = createVector(0, 0);
        this.buttons = [];
        this.subMenus = [];
        this.activeSubMenu = null;
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
        this.isActive = true;
        mouseHasFocus = true;
    }

    dismiss() {
        this.isActive = false;
        mouseHasFocus = false;
        if (this.activeSubMenu) {
            this.activeSubMenu.deactivate();
            this.activeSubMenu = null;
        }
    }

    setPosition(x, y) {
        this.position.set(x, y);
        this.updateButtonPositions();
    }

    updateButtonPositions() {
        const buttonRadius = 60;
        for (let i = 0; i < this.buttons.length; i++) {
            const angle = map(i, 0, this.buttons.length, 0, TWO_PI);
            const x = this.position.x + cos(angle) * buttonRadius;
            const y = this.position.y + sin(angle) * buttonRadius;
            this.buttons[i].setPosition(x, y);
        }
        for (let i = 0; i < this.subMenus.length; i++) {
            for (let j = 0; j < this.subMenus[i].buttons.length; j++) {
                const angle = map(j, 0, this.subMenus[i].buttons.length, 0, TWO_PI);
                const x = this.position.x + cos(angle) * buttonRadius * 3;
                const y = this.position.y + sin(angle) * buttonRadius * 3;
                this.subMenus[i].buttons[j].setPosition(x, y);
            }
        }
    }

    newSubMenu(buttonGroup, label) {
        const subMenu = new SubMenu(buttonGroup, label);
        this.subMenus.push(subMenu);
        return subMenu;
    }

    activateSubMenu(label) {
        if (this.activeSubMenu) {
            this.activeSubMenu.deactivate();
            this.activeSubMenu = null;
        } else {
            this.activeSubMenu = this.subMenus.find(subMenu => subMenu.label === label);
            if (this.activeSubMenu) {
                this.activeSubMenu.activate();
            }
        }
    }

    display() {
        strokeWeight(1);
        if (this.activeSubMenu) {
            this.activeSubMenu.display();
        }
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].display();
        }
        
    }

    handleMousePress() {
        if (mouseButton === LEFT && this.isActive) {
            for (let i = 0; i < this.buttons.length; i++) {
                this.buttons[i].checkMouseClick();
            }
            if (this.activeSubMenu) {
                this.activeSubMenu.handleMousePress();
            }
        }
    }
}
