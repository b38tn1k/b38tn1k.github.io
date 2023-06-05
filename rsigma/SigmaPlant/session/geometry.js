class Geometry {
    constructor (x, y, width, height) {
        this.bPos = createVector(x, y);
        this.bDims = {w: 0, h: 0};
        this.sPos  = createVector(x, y);
        this.sDims = {w: 0, h: 0};
        this.sMids = {w: 0, h: 0};
        this.aDims = {w: width, h: height}; //animation
        this.manualOnScreen = false;
    }

    get isOnScreen() {
        return (
            (this.sPos.x < windowWidth &&
            this.sPos.x + this.sDims.w > 0 &&
            this.sPos.y < windowHeight &&
            this.sPos.y + this.sDims.h > 0) ||
            this.manualOnScreen
          );
    }

    update(zoom) {
        this.sPos = boardToScreen(this.bPos.x, this.bPos.y);
        this.sDims.w = this.bDims.w * zoom;
        this.sDims.h = this.bDims.h * zoom;
        this.sMids.w = this.sDims.w >> 1;
        this.sMids.h = this.sDims.h >> 1;
    }
}