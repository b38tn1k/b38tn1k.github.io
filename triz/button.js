class Button {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.action;
        this.debugMode = true;
    }

    update() {
        if (this.debugMode) {
            stroke(255, 0, 0);
            noFill();
            rect(this.x, this.y, this.w, this.h);
            noStroke();
        }
    }

    checkMouse(mouseX, mouseY) {
        if (mouseX >= this.x && mouseX <= this.x + this.w && mouseY >= this.y && mouseY <= this.y + this.h) {
            return true;
        } else {
            return false;
        }
    }

    handleClick(mouseX, mouseY) {
        if (this.checkMouse(mouseX, mouseY)) {
            if (this.action){
                this.action();
            }
        }
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
    }
}
