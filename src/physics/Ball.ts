import Block from "./Block";
import Entity from "./Entity";
import { sameSign } from "./utils";
import Vector2d, { VectorObject } from "./Vector2d";

class Ball extends Entity {
    pos: Vector2d;
    radius: number;

    vel: Vector2d;
    accel: Vector2d;
    maxSpeed: number;
    elasticity: number;

    constructor({ x, y }: VectorObject, radius: number) {
        super();
        
        this.pos = new Vector2d(x, y);
        this.radius = radius;

        this.vel = new Vector2d(5, -10);
        this.accel = new Vector2d(0, .1);
        this.maxSpeed = 8;
        this.elasticity = 0.3;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    update(ctx: CanvasRenderingContext2D, gameInfo: { entities: Array<Entity> }) {
        this.draw(ctx);

        const { entities } = gameInfo;

        this.pos = this.pos.add(this.vel);
        this.vel = this.vel.add(this.accel);

        if (this.vel.magnitude > this.maxSpeed) {
            this.vel = this.vel.scalarMultiply(this.maxSpeed / this.vel.magnitude);
        }

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
                    // collision
                    const velOnV1 = this.vel.projectOnto(v1);
                    this.vel = velOnV1.subtract(this.vel).add(velOnV1).scalarMultiply(this.elasticity);
                    this.elasticity *= this.elasticity;
                }
            }
        });
    }
};

export default Ball;