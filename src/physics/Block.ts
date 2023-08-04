import Entity from "./Entity";
import Vector2d from "./Vector2d";

class Block extends Entity{
    pos: Vector2d;
    dims: Vector2d;

    vertices: Array<Vector2d>;

    constructor({ x, y }: { x: number, y: number}, { height, width }: { height: number, width: number }) {
        super();
        
        this.pos = new Vector2d(x, y);
        this.dims = new Vector2d(width, height);

        // in clockwise order
        this.vertices = [
            this.pos,
            this.pos.add(this.dims.project('x')),
            this.pos.add(this.dims),
            this.pos.add(this.dims.project('y'))
        ];
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.rect(this.pos.x, this.pos.y, this.dims.x, this.dims.y);
        ctx.fill();
    }
};

export default Block;