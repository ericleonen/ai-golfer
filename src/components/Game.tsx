import { useEffect, useRef } from "react";
import Ball from "../physics/Ball";
import Block from "../physics/Block";
import Entity from "../physics/Entity";
import { createHoleBase } from "../physics/HoleBase";
import Vector2d from "../physics/Vector2d";

const COURSE_HEIGHT: number = 100;
const BALL_RADIUS: number = 15;

const Game = () => {
    const canvas = useRef<HTMLCanvasElement | any>();

    const init = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        const { holeBase, holePos } = createHoleBase({ x: canvas.width - 200, y: canvas.height - COURSE_HEIGHT }, canvas);

        const ball = new Ball(
            { x: 100, y: canvas.height - COURSE_HEIGHT - BALL_RADIUS - 1 },
            BALL_RADIUS,
            holePos
        );

        const ceiling = new Block(
            { x: 0, y: 0 },
            { height: 50, width: canvas.width }
        );

        const leftWall = new Block(
            { x: 0, y: 50 },
            { height: canvas.height - 50 - COURSE_HEIGHT, width: 50 }
        );

        const rightWall = new Block(
            { x: canvas.width - 50, y: 50 },
            { height: canvas.height - 50 - COURSE_HEIGHT, width: 50 }
        );
        
        const course = [
            ...holeBase,
            ceiling,
            leftWall,
            rightWall
        ];
    
        update(ball, course, canvas, ctx);
    };

    const update = (ball: Ball, course: Array<Entity>, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        if (ball.holed) {
            console.log('holed!');
            return;
        }
        else if (ball.dead) {
            // ball.pos = new Vector2d(100, canvas.height - COURSE_HEIGHT - BALL_RADIUS);

            ball.dead = false;
            ball.deadCount = 10;

            ball.randomLaunch();
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ball.update(
            ctx, 
            { 
                entities: course.filter(entity => entity instanceof Block)
            }
        );

        course.forEach(entity => entity.update(ctx));
        
        requestAnimationFrame(() => update(ball, course, canvas, ctx));
    };

    useEffect(() => {
        if (!(canvas.current instanceof HTMLCanvasElement)) return;
        const ctx = canvas.current.getContext('2d');

        if (!(ctx instanceof CanvasRenderingContext2D)) return;

        init(canvas.current, ctx);
    }, [canvas, init]);

    return (
        <canvas id="canvas" height="1000" width="1600" ref={canvas}/>
    )
};

export default Game;