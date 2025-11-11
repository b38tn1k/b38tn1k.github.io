import { BaseEntity } from '../core/BaseEntity.js';

export class Player extends BaseEntity {
  constructor(p) {
    super(p);
    this.speed = 3; // tiles per second
    this.health = 100;
    this.moving = { moveLeft: false, moveRight: false, moveUp: false, moveDown: false };
  }

  onActionStart(action) {
    if (this.moving[action] !== undefined) this.moving[action] = true;
    this.Debug?.log('player', `Started ${action}`);
  }

  onActionEnd(action) {
    if (this.moving[action] !== undefined) this.moving[action] = false;
    this.Debug?.log('player', `Ended ${action}`);
    console.log(this.worldPos);
  }

  update(dt) {
    if (!this.visible) return;
    if (this.moving.moveLeft)  this.worldPos.x -= this.speed * dt;
    if (this.moving.moveRight) this.worldPos.x += this.speed * dt;
    if (this.moving.moveUp)    this.worldPos.y -= this.speed * dt;
    if (this.moving.moveDown)  this.worldPos.y += this.speed * dt;
  }

  draw(layer) {
    if (!this.visible || !this.scene) return;
    const { x, y } = this.scene.worldToScreen(this.worldPos);
    const pxSize = this.size * this.scene.mapTransform.tileSizePx;

    layer.fill(0, 200, 200);
    layer.square(x, y, pxSize);
  }
}

// export function createPlayer(p) {
//     return {
//         x: 0,
//         y: 0,
//         speed: 250,
//         size: 16,
//         visible: false,
//         movingLeft: false,
//         movingRight: false,
//         Debug: p.shared.Debug,
//         health: 100,

//         onActionStart(action) {
//             if (action === "moveLeft") this.movingLeft = true;
//             if (action === "moveLeft") this.Debug.log('player', `Player: move left started`);
//             if (action === "moveRight") this.movingRight = true;
//             if (action === "moveRight") this.Debug.log('player', `Player: move right started`);
//             if (action === "moveUp") this.movingUp = true;
//             if (action === "moveUp") this.Debug.log('player', `Player: move up started`);
//             if (action === "moveDown") this.movingDown = true;
//             if (action === "moveDown") this.Debug.log('player', `Player: move down started`);
//         },

//         onActionEnd(action) {
//             if (action === "moveLeft") this.movingLeft = false;
//             if (action === "moveRight") this.movingRight = false;
//             if (action === "moveUp") this.movingUp = false;
//             if (action === "moveDown") this.movingDown = false;
//         },

//         update(dt) {
//             if (!this.visible) return;
//             if (this.movingLeft) this.x -= this.speed * dt;
//             if (this.movingRight) this.x += this.speed * dt;
//             if (this.movingUp) this.y -= this.speed * dt;
//             if (this.movingDown) this.y += this.speed * dt;
//         },

//         draw(p) {
//             if (!this.visible) return;
//             p.fill(0, 200, 200);
//             p.square(this.x + this.size/2, this.y + this.size/2, this.size);
//         },

//         reset(spawn = { x: 0, y: 0 }) {
//             this.x = spawn.x;
//             this.y = spawn.y;
//             this.movingLeft = false;
//             this.movingRight = false;
//             this.visible = true;
//             if (this.Debug) this.Debug.log('player', `Player reset to (${this.x}, ${this.y})`);
//         },

//         deactivate() {
//             this.visible = false;
//             this.movingLeft = false;
//             this.movingRight = false;
//             if (this.Debug) this.Debug.log('player', 'Player deactivated');
//         }
//     };
// }