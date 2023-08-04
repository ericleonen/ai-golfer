class Entity {
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    draw() { return };
    update() { this.draw() };
};

export default Entity;