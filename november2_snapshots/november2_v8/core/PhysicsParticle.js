export class PhysicsParticle {
    constructor(x, y, mass = 1, main = false, fixed = false) {
        this.pos = { x, y };
        this.prevPos = { x, y };          // prepare for Verlet
        this.vel = { x: 0, y: 0 };
        this.force = { x: 0, y: 0 };
        this.softFactor = 0.08;
        this.useMemoryTether = true;
        this.mass = mass;
        this.invMass = fixed ? 0 : 1 / mass;
        this.fixed = fixed;
        this.main = main;
        this.collider = true;

        this.children = [];
        this.offsets = { x: 0, y: 0 };
        this.restLength = 0;

        this.springK = 0.2;
        this.springDamping = 0.85;

        this.damping = 0.95;  // velocity damping
        this.forceDamping = 0.0;

        this.contactAxes = { x: false, y: false };

        this.radius = 1;
        this.worldUnitRadius = 0;
        this.springRestoringForce = false;

        this.label = 0;
    }

    /** -------------------------------------------------------
     *  RESET CONTACT STATE
     * ------------------------------------------------------*/
    clearContacts() {
        this.contactAxes.x = false;
        this.contactAxes.y = false;
    }

    /** -------------------------------------------------------
     *  FORCE ACCUMULATION
     * ------------------------------------------------------*/
    addForce(fx, fy) {
        if (this.invMass === 0) return;

        // block/dampen along collision axes
        const damp = this.forceDamping;
        if (this.contactAxes.x) fx *= damp;
        if (this.contactAxes.y) fy *= damp;

        this.force.x += fx;
        this.force.y += fy;
    }

    cascadeForce(fx, fy, decay = 0.5) {
        this.addForce(fx, fy);
        for (const c of this.children) {
            c.cascadeForce(fx * decay, fy * decay, decay);
        }
    }

    /** -------------------------------------------------------
     *  INTEGRATE POSITIONS (Euler version)
     *  — Solver calls this (no children)
     * ------------------------------------------------------*/
    integrateEuler(dt) {
        if (this.invMass === 0) {
            this.force.x = this.force.y = 0;
            return;
        }

        // velocity
        this.vel.x += (this.force.x * this.invMass) * dt;
        this.vel.y += (this.force.y * this.invMass) * dt;

        this.vel.x *= this.damping;
        this.vel.y *= this.damping;

        // position
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;

        // force reset
        this.force.x = 0;
        this.force.y = 0;
    }

    /** -------------------------------------------------------
     *  PREP FOR VERLET
     * ------------------------------------------------------*/

    integrateVerlet(dt) {
        if (this.invMass === 0) {
            this.force.x = this.force.y = 0;
            return;
        }

        const dt2 = dt * dt;

        const oldX = this.pos.x;
        const oldY = this.pos.y;

        const velx = this.pos.x - this.prevPos.x;
        const vely = this.pos.y - this.prevPos.y;

        const ax = this.force.x * this.invMass * dt2;
        const ay = this.force.y * this.invMass * dt2;

        const nx = this.pos.x + velx * this.damping + ax;
        const ny = this.pos.y + vely * this.damping + ay;

        // write new prevPos
        this.prevPos.x = oldX;
        this.prevPos.y = oldY;

        // write new pos
        this.pos.x = nx;
        this.pos.y = ny;

        this.force.x = 0;
        this.force.y = 0;

        // console.log('Verlet integrate',
        //     'pos:', this.pos.x.toFixed(3), this.pos.y.toFixed(3),
        //     'prev:', this.prevPos.x.toFixed(3), this.prevPos.y.toFixed(3),
        //     'vel:', velx.toFixed(3), vely.toFixed(3),
        //     'accel:', ax.toFixed(3), ay.toFixed(3),
        //     'new:', nx.toFixed(3), ny.toFixed(3)
        // );
    }

    /** -------------------------------------------------------
     *  SPRING CONSTRAINT (no recursion)
     *  — Solver calls this for each parent/child pair
     *  — Pure positional + velocity correction
     * ------------------------------------------------------*/
    solveSpring(child, dt) {
        const dx = child.pos.x - this.pos.x;
        const dy = child.pos.y - this.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;

        const rest = child.restLength;
        const diff = dist - rest;

        const nx = dx / dist;
        const ny = dy / dist;

        // spring force (Hooke)
        const k = this.springK;
        const forceMag = -k * diff;

        // velocity damping term
        const dvx = child.vel.x - this.vel.x;
        const dvy = child.vel.y - this.vel.y;
        const relVel = dvx * nx + dvy * ny;

        const c = this.springDamping;
        const dampingForce = -c * relVel;

        const fx = (forceMag + dampingForce) * nx;
        const fy = (forceMag + dampingForce) * ny;

        // apply to both ends
        // this.addForce(+fx, +fy);
        // child.addForce(-fx, -fy);
        if (this.invMass === 0) {
            // only push/pull the child
            child.addForce(-fx, -fy);
        } else {
            this.addForce(+fx, +fy);
            child.addForce(-fx, -fy);
        }

        // // -------------------------------------------------------
        // // POSITIONAL CORRECTION (symmetric), skip if parent fixed
        // // -------------------------------------------------------
        // const percent = 0.5;  // half to each end for symmetric correction
        // const correction = diff * percent;

        // // move child
        // child.pos.x -= nx * correction;
        // child.pos.y -= ny * correction;

        // // move parent unless fixed
        // if (this.invMass !== 0) {
        //     this.pos.x += nx * correction;
        //     this.pos.y += ny * correction;
        // }
    }

    /** -------------------------------------------------------
     *  MEMORY TETHER (soft positional correction)
     * ------------------------------------------------------*/
    solveMemory(child, dt) {
        // if (!child.useMemoryTether) return;
        const targetX = this.pos.x + child.offsets.x;
        const targetY = this.pos.y + child.offsets.y;

        let dx = targetX - child.pos.x;
        let dy = targetY - child.pos.y;

        // dx = Math.min(0.2, dx);
        // dy = Math.min(0.2, dy);

        const dist = Math.sqrt(dx * dx + dy * dy) || 0.000001;
        const rest = child.restLength;

        // HARD constraint if child strays too far from its intended anchor
        const hardLimit = 2.0;
        if (dist > rest * hardLimit) {
            const overshoot = dist - rest;
            const correction = overshoot / dist;
            const factor = correction * 0.1;

            child.pos.x += dx * factor;
            child.pos.y += dy * factor;
            return;
        }

        // SOFT tether: gentle positional slide toward target
        const softFactor = child.softFactor;
        if (child.springRestoringForce) {

            // 1. Deadzone: don't over-correct near equilibrium
            if (dist < 0.02) return;

            // 2. Scale restoring force gently with distance
            const restoring = softFactor;   // tune 0.02–0.15 for softness
            const fx = (dx / dist) * restoring;
            const fy = (dy / dist) * restoring;

            child.addForce(fx, fy);

            return;
        } else {
            child.pos.x += dx * softFactor;
            child.pos.y += dy * softFactor;
        }
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    /** -------------------------------------------------------
     *  CHILD CREATION
     * ------------------------------------------------------*/
    createChild(offsetX, offsetY, scale = 0.5) {
        const c = new PhysicsParticle(
            this.pos.x + offsetX,
            this.pos.y + offsetY,
            this.mass * scale
        );

        c.offsets = { x: offsetX, y: offsetY };
        c.restLength = Math.hypot(offsetX, offsetY);
        c.radius = this.radius * scale;

        this.children.push(c);
        return c;
    }

    /** -------------------------------------------------------
     *  UPDATE RADII VISUALS
     * ------------------------------------------------------*/
    updateRadii(circumference, parentSize, decay = 0.8) {
        this.radius = circumference / 2;
        this.worldUnitRadius = this.radius * parentSize;

        for (const c of this.children) {
            c.updateRadii(circumference * decay, parentSize, decay);
        }
    }
}