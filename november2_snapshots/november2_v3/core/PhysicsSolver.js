// PhysicsSolver.js imports
import { PhysicsParticle } from './PhysicsParticle.js';

// PhysicsSolver.js logic
export class PhysicsSolver {
    constructor(physicsWorld = null, opts = {}) {
        this.world = physicsWorld; // expected to have resolveParticles(particles, dt) or resolveParticle(p, dt)

        this.integrator = opts.integrator || 'euler'; // 'euler' or 'verlet'
        this.springIterations = opts.springIterations ?? 1;
        this.useMemoryTethers = opts.useMemoryTethers ?? true;

        // global forces, useful for gravity, buoyancy, etc
        this.gravity = opts.gravity || { x: 0, y: 0 };
        this.maxDt = opts.maxDt ?? 0.04;         // seconds, clamp for stability
        this.maxVelocity = opts.maxVelocity ?? 20; // world units per second
    }

    /**
     * Main physics step
     * @param {number} dt
     * @param {PhysicsParticle[]} rootParticles root particles or a flat list; children will be discovered automatically
     */
    step(dt, rootParticles) {
        dt = Math.min(dt, this.maxDt);
        if (!rootParticles || rootParticles.length === 0) return;

        const particles = this._collectParticles(rootParticles);

        // 1. reset contact flags
        for (const p of particles) {
            p.clearContacts();
        }

        // 2. apply global forces (gravity etc)
        this._applyGlobalForces(particles);

        // 3. apply spring and memory forces BEFORE integration
        for (let i = 0; i < this.springIterations; i++) {
            this._applySpringsAndMemory(rootParticles, dt);
        }

        // 4. integrate positions and velocities
        if (this.integrator === 'verlet') {
            for (const p of particles) {
                p.integrateVerlet(dt);
            }
        } else {
            for (const p of particles) {
                p.integrateEuler(dt);
                // clamp velocity magnitude for stability
                if (this.maxVelocity > 0 && p.invMass !== 0) {
                    const vx = p.vel.x;
                    const vy = p.vel.y;
                    const v2 = vx * vx + vy * vy;
                    const maxV = this.maxVelocity;
                    if (v2 > maxV * maxV) {
                        const scale = maxV / Math.sqrt(v2);
                        p.vel.x *= scale;
                        p.vel.y *= scale;
                    }
                }
            }
        }

        // 5. resolve collisions via PhysicsWorld if available
        if (this.world) {
            if (typeof this.world.resolveParticles === 'function') {
                this.world.resolveParticles(particles, dt);
            } else if (typeof this.world.resolveParticle === 'function') {
                for (const p of particles) {
                    this.world.resolveParticle(p, dt);
                }
            }
        }
    }

    /**
     * Flatten all particles reachable from the given roots.
     */
    _collectParticles(rootParticles) {
        const list = [];
        const stack = [...rootParticles];

        while (stack.length > 0) {
            const p = stack.pop();
            if (!p || !(p instanceof PhysicsParticle)) continue;

            list.push(p);
            if (p.children && p.children.length) {
                for (const c of p.children) {
                    stack.push(c);
                }
            }
        }

        return list;
    }

    /**
     * Apply global forces like gravity.
     */
    _applyGlobalForces(particles) {
        const gx = this.gravity.x;
        const gy = this.gravity.y;

        if (gx === 0 && gy === 0) return;

        for (const p of particles) {
            if (p.invMass === 0) continue;
            const fx = gx * p.mass;
            const fy = gy * p.mass;
            p.addForce(fx, fy);
        }
    }

    /**
     * Apply spring forces and memory tethers for all parent child links.
     */
    _applySpringsAndMemory(rootParticles, dt) {
        for (const root of rootParticles) {
            this._applySpringsRecursive(root, dt);
        }
    }

    _applySpringsRecursive(parent, dt) {
        if (!parent || !parent.children || parent.children.length === 0) return;

        for (const child of parent.children) {
            parent.solveSpring(child, dt);
            if (this.useMemoryTethers) {
                parent.solveMemory(child, dt);
            }
            this._applySpringsRecursive(child, dt);
        }
    }
}