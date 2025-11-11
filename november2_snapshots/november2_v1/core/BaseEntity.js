export class BaseEntity {
  constructor(p) {
    this.p = p;
    this.scene = null;
    this.worldPos = { x: 0, y: 0 };
    this.visible = false;
    this.size = 1; // in world units (tiles)
    this.Debug = p.shared.Debug;
  }

  setScene(scene) {
    this.scene = scene;
  }

  reset(spawn = { x: 0, y: 0 }) {
    this.worldPos.x = spawn.x;
    this.worldPos.y = spawn.y;
    this.visible = true;
    this.Debug?.log('entity', `Entity reset to world (${spawn.x}, ${spawn.y})`);
  }

  update(dt) {
    // Default: do nothing — override in subclass
  }

  draw(layer) {
    if (!this.visible || !this.scene) return;

    const { x, y } = this.scene.worldToScreen(this.worldPos);
    const pxSize = this.size * this.scene.mapTransform.tileSizePx;

    layer.noStroke();
    layer.fill(180, 180, 180);
    layer.rect(x, y, pxSize, pxSize);
  }

  deactivate() {
    this.visible = false;
  }
}