class Geometry {
    constructor (x, y, w, h) {
        this.bPos = createVector(x, y);
        this.bDims = {w: w, h: h};
        this.sPos  = createVector(x, y);
        this.sDims = {w: w, h: h};
    }

    update(zoom) {
        this.sPos = boardToScreen(this.bPos.x, this.bPos.y);
        this.sDims.w = this.bDims.w * zoom;
        this.sDims.h = this.bDims.h * zoom;
    }
}