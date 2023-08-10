import Block from "./Block";
import Entity from "./Entity";
import { HOLE_WIDTH } from "./HoleBase";
import { basicallyZero, sameSign, sign } from "./utils";
import Vector2d, { VectorObject } from "./Vector2d";

class Ball extends Entity {
    pos: Vector2d;
    radius: number;
    holePos: Vector2d;

    vel: Vector2d;
    accel: Vector2d;

    elasticity: number;

    holed: boolean;

    constructor({ x, y }: VectorObject, radius: number, holePos: Vector2d) {
        super();
        
        this.pos = new Vector2d(x, y);
        this.radius = radius;
        this.holePos = holePos;

        this.vel = new Vector2d(5.4, -18);
        this.accel = new Vector2d(0, .15);
        this.elasticity = 0.5;

        this.holed = false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    handleVertexCollision(entity: Entity) {
        if (!(entity instanceof Block)) return;
        
        let handled = false;

        entity.vertices.forEach(vertex => {
            const f = this.pos.subtract(vertex);

            if (f.magnitude < this.radius) {
                // fix over-pos
                this.pos = this.pos.add(f.scalarMultiply((this.radius - f.magnitude) / f.magnitude));
                this.vel = f.scalarMultiply(this.vel.magnitude / f.magnitude).scalarMultiply(this.elasticity);

                handled = true;
            }
        });

        return handled;
    }

    handleEdgeCollision(entity: Entity) {
        if (!(entity instanceof Block)) return;

        let handled = false;

        for (let i = 0; i < entity.vertices.length; i++) {
            const p1 = entity.vertices[i];
            const p2 = entity.vertices[i < entity.vertices.length - 1 ? i + 1 : 0];

            const v1 = p2.subtract(p1);
            const v2 = this.pos.subtract(p1);

            const v2onV1 = v2.projectOnto(v1);

            // check if closest point is within v1
            if (v2onV1.magnitude > v1.magnitude || !sameSign(v2onV1.x, v1.x) || !sameSign(v2onV1.y, v1.y)) continue;

            const normal = v2.subtract(v2onV1);

            if (normal.magnitude <= this.radius) {
                this.pos.print('orig pos')
                // fix over-pos
                const oppVelUnit = this.vel.scalarMultiply(-1 / this.vel.magnitude);
                const z = oppVelUnit.projectOnto(normal);
                const a = this.vel.scalarMultiply((this.radius + normal.magnitude * sign(this.vel.dot(normal))) / this.vel.magnitude);
                const c = !basicallyZero(z.x) ? a.x / z.x : a.y / z.y;
                const o = oppVelUnit.scalarMultiply(c);
                
                const oldPos = new Vector2d(this.pos.x, this.pos.y);

                this.pos = this.pos.subtract(o);
                this.pos.x = Math.round(this.pos.x);
                this.pos.y = Math.round(this.pos.y);

                const displacement = this.pos.subtract(oldPos);

                // fix over-vel
                this.vel.y = Math.sqrt(
                    Math.abs(
                        Math.pow(this.vel.y, 2) + 2 * this.accel.y * displacement.y
                    )
                ) * sign(this.vel.y);
                this.vel.x = Math.sqrt(
                    Math.abs(
                        Math.pow(this.vel.x, 2) + 2 * this.accel.x * displacement.x
                    )
                ) * sign(this.vel.x);

                // collision
                const velOnV1 = this.vel.projectOnto(v1);
                this.vel = velOnV1.subtract(this.vel.subtract(this.accel)).add(velOnV1).scalarMultiply(this.elasticity);
            
                handled = true;

                // check if ball is at the bottom of the cup
                if (
                    this.pos.y + this.radius === this.holePos.y &&
                    Math.abs(this.holePos.x - this.pos.x) <= HOLE_WIDTH - this.radius
                ) {
                    this.holed = true;
                }
                
                this.pos.print('fixed pos')

                break;
            }
        }

        return handled;
    }

    update(ctx: CanvasRenderingContext2D, gameInfo: { entities: Array<Entity> }) {
        const { entities } = gameInfo;

        this.pos = this.pos.add(this.vel);
        this.vel = this.vel.add(this.accel);

        entities.forEach(entity => {
            if (this.handleEdgeCollision(entity)) return;
            if (this.handleVertexCollision(entity)) return;
        });

        this.draw(ctx);
    }
};

export default Ball;