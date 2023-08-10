import Block from "./Block";
import Entity from "./Entity";
import { HOLE_WIDTH } from "./HoleBase";
import { basicallyZero, sameSign, sign, toRad } from "./utils";
import Vector2d, { VectorObject } from "./Vector2d";

class Ball extends Entity {
    pos: Vector2d;
    radius: number;
    holePos: Vector2d;

    vel: Vector2d;
    accel: Vector2d;

    elasticity: number;
    maxSpeed: number;

    holed: boolean;

    constructor({ x, y }: VectorObject, radius: number, holePos: Vector2d) {
        super();
        
        this.pos = new Vector2d(x, y);
        this.radius = radius;
        this.holePos = holePos;

        this.vel = new Vector2d(0, 0);
        this.accel = new Vector2d(0, .15);
        this.elasticity = 0.5;
        this.maxSpeed = radius * 2;

        this.holed = false;

        this.launch(13.9, 90);
    }

    launch(speed: number, theta: number) {
        theta = toRad(theta);

        this.vel.x = Math.cos(theta) * speed;
        this.vel.y = -Math.sin(theta) * speed;
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
                // fix over-pos
                const a = normal.scalarMultiply((this.radius + normal.magnitude * Math.sign(normal.dot(this.vel))) / normal.magnitude);
                const s = (Math.pow(a.x, 2) + Math.pow(a.y, 2)) / (a.x * this.vel.x + a.y * this.vel.y);
                const displacement = this.vel.scalarMultiply(s);

                this.pos = this.pos.add(displacement);

                if (displacement.magnitude > 5) {
                    normal.print('normal');
                    a.print('a');
                    displacement.print('displacement');
                }

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
                    Math.abs(this.pos.y + this.radius - this.holePos.y) < 1 &&
                    Math.abs(this.holePos.x - this.pos.x) <= HOLE_WIDTH - this.radius
                ) {
                    this.holed = true;
                }

                break;
            }
        }

        return handled;
    }

    update(ctx: CanvasRenderingContext2D, gameInfo: { entities: Array<Entity> }) {
        const { entities } = gameInfo;

        if (this.vel.magnitude > this.maxSpeed)
            this.vel = this.vel.scalarMultiply(this.maxSpeed / this.vel.magnitude);

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