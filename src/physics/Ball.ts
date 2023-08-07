import Block from "./Block";
import Entity from "./Entity";
import { basicallyZero, sameSign, sign } from "./utils";
import Vector2d, { VectorObject } from "./Vector2d";

class Ball extends Entity {
    pos: Vector2d;
    radius: number;

    vel: Vector2d;
    accel: Vector2d;

    constructor({ x, y }: VectorObject, radius: number) {
        super();
        
        this.pos = new Vector2d(x, y);
        this.radius = radius;

        this.vel = new Vector2d(2, -10);
        this.accel = new Vector2d(0, .3);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    update(ctx: CanvasRenderingContext2D, gameInfo: { entities: Array<Entity> }) {
        const { entities } = gameInfo;

        this.pos = this.pos.add(this.vel);
        this.vel = this.vel.add(this.accel);

        entities.forEach(entity => {
            if (!(entity instanceof Block)) return;

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
                    // fix over-pos
                    const oppVelUnit = this.vel.scalarMultiply(-1 / this.vel.magnitude);
                    const z = oppVelUnit.projectOnto(normal);
                    const a = this.vel.scalarMultiply((this.radius - normal.magnitude) / this.vel.magnitude);

                    const newPos = this.pos.subtract(oppVelUnit.scalarMultiply(
                        !basicallyZero(z.x) ? a.x / z.x : a.y / z.y
                    ));
                    const displacement = newPos.subtract(this.pos);
                    this.pos = newPos;

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
                    this.vel = velOnV1.subtract(this.vel.subtract(this.accel)).add(velOnV1);
                }
            }
        });

        this.draw(ctx);
    }
};

export default Ball;