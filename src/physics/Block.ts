import Entity from "./Entity";
import Vector2d from "./Vector2d";

class Block extends Entity{
    pos: Vector2d;
    dims: Vector2d;

    vertices: Array<Vector2d>;

    constructor(pos: Vector2d, dims: Vector2d, ctx: CanvasRenderingContext2D) {
        super(ctx);
        
        this.pos = pos;
        this.dims = dims;

        // in clockwise order
        this.vertices = [
            pos,
            pos.add(dims.project('x')),
            pos.add(dims),
            pos.add(dims.project('y'))
        ];
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.pos.x, this.pos.y, this.dims.x, this.dims.y);
        this.ctx.fill();
    }
};

export default Block;