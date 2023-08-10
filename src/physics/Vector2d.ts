class Vector2d {
    x: number;
    y: number;

    magnitude: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.magnitude = (() => Math.sqrt(this.x * this.x + this.y * this.y))();
    }

    projectUnit(d: 'x' | 'y') {
        return d === 'x' ?
            new Vector2d(this.x, 0) :
            new Vector2d(0, this.y);
    }

    projectOnto(v: Vector2d) {
        const projectedMagnitude = this.dot(v) / v.magnitude;
        const unitV = v.scalarMultiply(1 / v.magnitude);

        return unitV.scalarMultiply(projectedMagnitude);
    }

    add(v: Vector2d) {
        return new Vector2d(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector2d) {
        return new Vector2d(this.x - v.x, this.y - v.y);
    }

    scalarMultiply(c: number) {
        return new Vector2d(this.x * c, this.y * c);
    }

    dot(v: Vector2d) {
        return this.x * v.x + this.y * v.y;
    }

    print(label: string) {
        console.log(label + ': (' + this.x + ', ' + this.y + ')');
    }
};

export default Vector2d;

export interface VectorObject {
    [key: string]: number
};