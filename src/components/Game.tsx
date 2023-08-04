import { useEffect, useState } from "react";

const Game = () => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement>();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    useEffect(() => {
        const htmlCanvas = document.getElementById('canvas');

        if (htmlCanvas instanceof HTMLCanvasElement) {
            setCanvas(htmlCanvas);

            const htmlCtx = htmlCanvas.getContext('2d');
            if (htmlCtx instanceof CanvasRenderingContext2D)
                setCtx(htmlCtx);
        }
    });

    useEffect(() => {
        if (canvas && ctx) {
            
        }
    }, [canvas, ctx]);

    return (
        <canvas id="canvas" height="500" width="800" />
    )
};

export default Game;