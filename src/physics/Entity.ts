class Entity {
    constructor() {
        return;
    }

    draw(ctx: CanvasRenderingContext2D) { return };
    update(ctx: CanvasRenderingContext2D) { this.draw(ctx) };
};

export default Entity;