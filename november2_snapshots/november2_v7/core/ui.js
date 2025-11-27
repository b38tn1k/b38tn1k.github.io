export function createUI(p) {
  const ui = {
    visible: true,

    show() { this.visible = true; },
    hide() { this.visible = false; },

    draw(layer) {
      if (!this.visible) return;
      // layer.fill(100, 100, 255);
      // layer.textAlign(p.LEFT, p.TOP);
      // layer.textSize(layer.width / 80);

      // // Example: show FPS + player info
      // const fps = p.frameRate().toFixed(0);
      // const player = p.shared?.player;
      // const hp = player ? player.health : '-';

      //WEBGL canvas mode has (0,0) in center
      // layer.text(`FPS: ${fps}`, 10, 10);
      // layer.text(`HP: ${hp}`, 10, 10 + layer.textSize());
    }
  };

  p.shared.ui = ui;
  return ui;
}