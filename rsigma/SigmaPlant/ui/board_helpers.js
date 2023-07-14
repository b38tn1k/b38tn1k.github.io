function screenToBoard(x, y) {
    let boardX = (x - width / 2) / globalZoom + scrollX; //+ width/2;
    let boardY = (y - height / 2) / globalZoom + scrollY; // + height/2;
    return createVector(boardX, boardY);
}

function boardToScreen(boardX, boardY) {
    let screenX = (boardX - scrollX) * globalZoom + width / 2;
    let screenY = (boardY - scrollY) * globalZoom + height / 2;
    return createVector(screenX, screenY);
}

function scrollBoard(zoom) {
    if (mouseIsPressed && !menu.isActive && !sess.plant.isActive) {
        scrollX += (pmouseX - mouseX) / zoom;
        scrollY += (pmouseY - mouseY) / zoom;
        fpsEvent();
    }
}