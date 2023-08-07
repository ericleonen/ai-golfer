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