const DEBUG_COLLISIONS = false;

export class PhysicsWorld {
    constructor(opts = {}) {
        this.getTile = opts.getTile;
        this.restitution = opts.restitution ?? 0.2;
        this.friction = opts.friction ?? 0.05;
    }

    resolveParticles(particles, dt) {
        for (const p of particles) {
            this.resolveParticle(p, dt);
        }
    }

    resolveParticle(particle, dt) {
        if (!this.getTile) return;

        const r = particle.worldUnitRadius;
        const { x, y } = particle.pos;

        const tx = Math.floor(x);
        const ty = Math.floor(y);

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const tile = this.getTile(tx + dx, ty + dy);
                if (tile && tile.solid) {
                    this._resolveParticleTile(particle, tx + dx, ty + dy, r);
                }
            }
        }
    }

    _resolveParticleTile(p, tileX, tileY, radius) {
        const tileCenterX = tileX + 0.5;
        const tileCenterY = tileY + 0.5;
        const half = 0.5;

        const dx = p.pos.x - tileCenterX;
        const px = (half + radius) - Math.abs(dx);
        if (px <= 0) return;

        const dy = p.pos.y - tileCenterY;
        const py = (half + radius) - Math.abs(dy);
        if (py <= 0) return;

        if (px < py) {
            this._separate(p, dx, px, true);
        } else {
            this._separate(p, dy, py, false);
        }
    }

    _separate(p, delta, penetration, isX) {
        if (DEBUG_COLLISIONS) {
            console.log(
                '[COLLIDE] axis:',
                isX ? 'x' : 'y',
                'delta:',
                delta.toFixed(3),
                'pen:',
                penetration.toFixed(3),
                'pos:',
                p.pos.x.toFixed(3),
                p.pos.y.toFixed(3)
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

        // 1. Positional correction
        if (isX) {
            p.pos.x += nx * penetration;
            p.contactAxes.x = true;
        } else {
            p.pos.y += ny * penetration;

            if (DEBUG_COLLISIONS) {
                console.log('[COLLIDE-Y] before clamp velY:', p.vel.y.toFixed(4), 'normalY:', ny);
            }

            // Allow upward escape
            if (p.vel.y < 0 || (p.forces && p.forces.y < 0)) {
                p.contactAxes.y = false;
            } else {
                p.contactAxes.y = true;
            }

            if (DEBUG_COLLISIONS) {
                console.log('[COLLIDE-Y] after clamp contactY:', p.contactAxes.y);
            }
        }

        // 2. Reflect velocity
        const vn = p.vel.x * nx + p.vel.y * ny;
        if (vn < 0) {
            const bounce = -(1 + this.restitution) * vn;
            p.vel.x += bounce * nx;
            p.vel.y += bounce * ny;
        }

        if (DEBUG_COLLISIONS) {
            console.log(
                '[REFLECT] axis:', isX ? 'x' : 'y',
                'vn:', vn.toFixed(4),
                'vel:', p.vel.x.toFixed(4), p.vel.y.toFixed(4)
            );
        }

        // 3. Tangential friction
        if (this.friction > 0) {
            if (isX) p.vel.y *= 1 - this.friction;
            else p.vel.x *= 1 - this.friction;
        }

        // 4. Escape loop using corrected normals
        const small = 0.001;
        for (let i = 0; i < 4; i++) {
            const tx = Math.floor(p.pos.x);
            const ty = Math.floor(p.pos.y);
            const t = this.getTile(tx, ty);
            if (!t || !t.solid) break;

            if (isX) p.pos.x += nx * small;
            else p.pos.y += ny * small;
        }
    }
}