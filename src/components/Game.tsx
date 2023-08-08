import { useEffect, useRef, useState } from "react";
import Ball from "../physics/Ball";
import Block from "../physics/Block";
import Entity from "../physics/Entity";
import { createHoleBase } from "../physics/HoleBase";

const Game = () => {
    const canvas = useRef<HTMLCanvasElement | any>();

    const init = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        const holeBase = createHoleBase({ x: 760, y: canvas.height - 100 }, canvas);

        const ball = new Ball(
            { x: 100, y: canvas.height - 500 },
            10
        );
        
        const entities = [
            ...holeBase,
            ball
        ];
    
        update(entities, canvas, ctx);
    };

    const update = (entities: Array<Entity>, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        entities.forEach(entity => {
            if (entity instanceof Ball) {
                entity.update(
                    ctx, 
                    { entities: entities.filter(entity => entity instanceof Block) }
                );
            }
            else entity.update(ctx);
        });
        
        requestAnimationFrame(() => update(entities, canvas, ctx));
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