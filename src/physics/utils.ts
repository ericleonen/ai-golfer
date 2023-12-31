export const sameSign = (a: number, b: number) => {
    return a * b >= 0;
};

export const epsilon = 1e-10;

export const basicallyZero = (x: number) => {
    return Math.abs(x) < epsilon;
};

export const sign = (x: number) => {
    if (x === 0) return 0;
    else return x / Math.abs(x);
}

export const toRad = (degrees: number) => degrees * Math.PI / 180;

export function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
};