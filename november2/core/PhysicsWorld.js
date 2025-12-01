export class PhysicsWorld {
    constructor(opts = {}) {
        this.getTile = opts.getTile;
        this.restitution = opts.restitution ?? 0.2;
        this.friction = opts.friction ?? 0.05;
        this.DEBUG_COLLISIONS = false;
    }

    resolveParticles(particles, dt) {
        for (const p of particles) {
            this.resolveParticle(p, dt);
        }
    }

    resolveParticle(particle, dt) {
        if (!this.getTile) return;

        if (this.DEBUG_COLLISIONS) {
            const fx = particle.forces ? particle.forces.x : 0;
            const fy = particle.forces ? particle.forces.y : 0;
            console.log('[PHYS] resolveParticle start',
                'dt:', dt.toFixed(4),
                'pos:', particle.pos.x.toFixed(3), particle.pos.y.toFixed(3),
                'vel:', particle.vel.x.toFixed(3), particle.vel.y.toFixed(3),
                'forces:', fx.toFixed(3), fy.toFixed(3),
                'radius:', particle.worldUnitRadius != null ? particle.worldUnitRadius.toFixed(3) : 'n/a'
            );
        }

        if (particle.collider == false) return;

        const r = particle.worldUnitRadius;
        const { x, y } = particle.pos;

        const tx = Math.floor(x);

        // choose which Y bounds to sample based on motion intent
        let tySamples = [];

        // upward motion or upward force → check ceiling only
        if (particle.vel.y < 0 || (particle.forces && particle.forces.y < 0)) {
            tySamples.push(Math.floor(y - r));
        }
        // downward motion or downward force → check floor only
        else if (particle.vel.y > 0 || (particle.forces && particle.forces.y > 0)) {
            tySamples.push(Math.floor(y + r));
        }
        // idle / no motion → conservative: check both
        else {
            tySamples.push(Math.floor(y - r), Math.floor(y + r));
        }

        if (this.DEBUG_COLLISIONS) {
            console.log('[PHYS] resolveParticle sampling',
                'tx:', tx,
                'y:', y.toFixed(3),
                'velY:', particle.vel.y.toFixed(3),
                'forceY:', (particle.forces ? particle.forces.y.toFixed(3) : '0.000'),
                'tySamples:', tySamples
            );
        }

        // now perform directed sampling
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                for (const baseY of tySamples) {
                    const tile = this.getTile(tx + dx, baseY + dy);
                    if (tile && tile.solid) {
                        this._resolveParticleTile(particle, tx + dx, baseY + dy, r);
                    }
                }
            }
        }
    }

    _resolveParticleTile(p, tileX, tileY, radius) {
        if (this.DEBUG_COLLISIONS) {
            console.log('[TILE] candidate collision',
                'tile:', tileX, tileY,
                'radius:', radius.toFixed(3),
                'pos:', p.pos.x.toFixed(3), p.pos.y.toFixed(3)
            );
        }

        if (p.collider == false) return;

        const tileCenterX = tileX + 0.5;
        const tileCenterY = tileY + 0.5;
        const half = 0.5;

        const dx = p.pos.x - tileCenterX;
        const px = (half + radius) - Math.abs(dx);

        const dy = p.pos.y - tileCenterY;
        const py = (half + radius) - Math.abs(dy);

        if (this.DEBUG_COLLISIONS) {
            console.log('[TILE] overlap check',
                'dx:', dx.toFixed(3),
                'dy:', dy.toFixed(3),
                'px:', px.toFixed(3),
                'py:', py.toFixed(3)
            );
        }

        if (px <= 0) return;
        if (py <= 0) return;

        if (px < py) {
            this._separate(p, dx, px, true, radius, tileX, tileY);
        } else {
            this._separate(p, dy, py, false, radius, tileX, tileY);
        }
    }

    _separate(p, delta, penetration, isX, radius, tileX, tileY) {
        if (this.DEBUG_COLLISIONS) {
            const fx = p.forces ? p.forces.x : 0;
            const fy = p.forces ? p.forces.y : 0;
            console.log(
                '[COLLIDE] axis:', isX ? 'x' : 'y',
                'delta:', delta.toFixed(3),
                'pen:', penetration.toFixed(3),
                'pos:', p.pos.x.toFixed(3), p.pos.y.toFixed(3),
                'vel:', p.vel.x.toFixed(3), p.vel.y.toFixed(3),
                'forces:', fx.toFixed(3), fy.toFixed(3),
                'tile:', tileX, tileY,
                'radius:', radius.toFixed(3)
            );
        }

        // Compute correct surface normal
        let nx = 0, ny = 0;
        if (isX) {
            nx = delta < 0 ? -1 : 1;
        } else {
            // upward is negative y → push up = -1
            ny = delta < 0 ? -1 : 1;
        }

        if (this.DEBUG_COLLISIONS) {
            console.log(
                '[COLLIDE] normals',
                'axis:', isX ? 'x' : 'y',
                'nx:', nx.toFixed(3),
                'ny:', ny.toFixed(3)
            );
        }

        // 1. Positional correction
        if (isX) {
            // Snap to left or right tile boundary
            const tileEdge = nx > 0
                ? (tileX + radius*1.1 + 1)        // tile is left, push right
                : (tileX - radius * 1.1);   // tile is right, push left
            p.pos.x = tileEdge;
            p.contactAxes.x = true;

            if (this.DEBUG_COLLISIONS) {
                console.log('[COLLIDE-X] snap',
                    'posX:', p.pos.x.toFixed(4),
                    'normalX:', nx,
                    'tileX:', tileX,
                    'radius:', radius.toFixed(3),
                    'contactX:', p.contactAxes.x
                );
            }
        } else {
            // Snap to ceiling or floor tile boundary
            // delta = p.pos.y - tileCenterY
            // ny = -1 → particle is above tile center → tile is below (floor)
            // ny =  1 → particle is below tile center → tile is above (ceiling)
            const tileEdge = ny < 0
                ? (tileY - radius * 1.1)        // tile is below, push particle up to sit on top
                : (tileY + 1 + radius - 1e-4);   // tile is above, push particle down to hang below
            p.pos.y = tileEdge;

            if (this.DEBUG_COLLISIONS) {
                console.log('[COLLIDE-Y] before clamp',
                    'posY:', p.pos.y.toFixed(4),
                    'velY:', p.vel.y.toFixed(4),
                    'normalY:', ny,
                    'tileY:', tileY,
                    'radius:', radius.toFixed(3)
                );
            }

            // For upward motion/force (buoyancy), do NOT treat this as a supporting floor
            if (p.vel.y < 0 || (p.forces && p.forces.y < 0)) {
                p.contactAxes.y = false;
            } else {
                p.contactAxes.y = true;
            }

            if (this.DEBUG_COLLISIONS) {
                console.log('[COLLIDE-Y] after clamp',
                    'posY:', p.pos.y.toFixed(4),
                    'contactY:', p.contactAxes.y
                );
            }
        }

        if (this.DEBUG_COLLISIONS) {
            const fx2 = p.forces ? p.forces.x : 0;
            const fy2 = p.forces ? p.forces.y : 0;
            console.log(
                '[REFLECT] pre',
                'axis:', isX ? 'x' : 'y',
                'vel:', p.vel.x.toFixed(4), p.vel.y.toFixed(4),
                'forces:', fx2.toFixed(4), fy2.toFixed(4)
            );
        }

        // 2. Reflect velocity
        const vn = p.vel.x * nx + p.vel.y * ny;
        if (vn < 0) {
            const bounce = -(1 + this.restitution) * vn;
            p.vel.x += bounce * nx;
            p.vel.y += bounce * ny;
        }

        if (this.DEBUG_COLLISIONS) {
            console.log(
                '[REFLECT] axis:', isX ? 'x' : 'y',
                'vn:', vn.toFixed(4),
                'vel:', p.vel.x.toFixed(4), p.vel.y.toFixed(4)
            );
            console.log(
                '[REFLECT] post',
                'axis:', isX ? 'x' : 'y',
                'vel:', p.vel.x.toFixed(4), p.vel.y.toFixed(4)
            );
        }

        // 3. Tangential friction
        if (this.friction > 0) {
            if (isX) p.vel.y *= 1 - this.friction;
            else p.vel.x *= 1 - this.friction;

            if (this.DEBUG_COLLISIONS) {
                console.log(
                    '[FRICTION]',
                    'axis:', isX ? 'x' : 'y',
                    'vel:', p.vel.x.toFixed(4), p.vel.y.toFixed(4),
                    'friction:', this.friction
                );
            }
        }

        // 4. Escape loop using corrected normals
        const small = 0.001;
        for (let i = 0; i < 4; i++) {
            const tx = Math.floor(p.pos.x);
            const ty = Math.floor(p.pos.y);
            const t = this.getTile(tx, ty);
            if (this.DEBUG_COLLISIONS) {
                console.log(
                    '[ESCAPE] iter', i,
                    'axis:', isX ? 'x' : 'y',
                    'pos:', p.pos.x.toFixed(4), p.pos.y.toFixed(4),
                    'tile:', tx, ty,
                    'solid:', !!(t && t.solid)
                );
            }
            if (!t || !t.solid) break;

            if (isX) p.pos.x += nx * small;
            else p.pos.y += ny * small;
        }

        if (this.DEBUG_COLLISIONS) {
            console.log(
                '[STUCK]',
                'pos:', p.pos.x.toFixed(4), p.pos.y.toFixed(4),
                'floorY:', Math.floor(p.pos.y + radius),
                'radius:', radius.toFixed(3),
                'contactX:', p.contactAxes.x,
                'contactY:', p.contactAxes.y
            );
        }
    }
}