class Vector2d {
    x: number;
    y: number;

    magnitude: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.magnitude = Math.sqrt(x * x + y * y);
    }

    project(d: 'x' | 'y') {
        return d === 'x' ?
            new Vector2d(this.x, 0) :
            new Vector2d(0, this.y);
    }

    add(v: Vector2d) {
        return new Vector2d(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector2d) {
        return new Vector2d(this.x - v.x, this.y - v.y);
    }

    dot(v: Vector2d) {
        return this.x * v.x + this.y * v.y;
    }
};

export default Vector2d;