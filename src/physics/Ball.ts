import Entity from "./Entity";
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

        this.vel = new Vector2d(0, 0);
        this.accel = new Vector2d(0, -5);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    update(ctx: CanvasRenderingContext2D) {
        this.pos = this.pos.add(this.vel);
        this.vel = this.vel.add(this.accel);

        this.draw(ctx);
    }
};

export default Ball;