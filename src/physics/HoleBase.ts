import Block from "./Block";
import { VectorObject } from "./Vector2d";

const HOLE_WIDTH: number = 40;
const HOLE_HEIGHT: number = 50;

export const createHoleBase = ({ x, y }: VectorObject, canvas: HTMLCanvasElement) => {
    const left = new Block(
        { x: 0, y },
        { height: canvas.height - y, width: x - HOLE_WIDTH / 2 }
    );

    const right = new Block(
        { x: x + HOLE_WIDTH / 2, y },
        { height: canvas.height - y, width: canvas.width - x - HOLE_WIDTH / 2 }
    );

    const bottom = new Block(
        { x: x - HOLE_WIDTH / 2, y: y + HOLE_HEIGHT },
        { height: HOLE_HEIGHT, width: HOLE_WIDTH }
    )

    return [left, right, bottom];
};