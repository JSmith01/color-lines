/*
const tap = x => { console.log(x); return x; };
const compose2 = (f, g) => (...args) => f(g(...args));
const getLineDebug = lineFn => getLine(compose2(tap, lineFn));
*/

export const getColor = field => ({ x, y }) => field[x] && field[x][y] != null
    ? { color: field[x][y], x, y }
    : undefined;


export const getLines = (field, x, y) => {
    const FIELD_SIZE = field.length;

    const hLineFn = t => ({ x, y: t });
    const vLineFn = t => ({ x: t, y });
    const dLineFn = t => ({ x: FIELD_SIZE - t - 1, y: t - FIELD_SIZE + 1 + y + x });
    const rLineFn = t => ({ x: t, y: t - x + y });

    const getColorFn = getColor(field);
    const getLine = lineFn => Array(FIELD_SIZE).fill(0).map((_, i) => getColorFn(lineFn(i)));

    return {
        hLine: getLine(hLineFn),
        vLine: getLine(vLineFn),
        dLine: getLine(dLineFn),
        rLine: getLine(rLineFn),
    };
};

export const groupBalls = line => {
    const result = [];
    let c = [];
    for (let i = 0; i < line.length; i++) {
        const v = line[i];
        if (!v) {
            c = [];
        } else {
            if (c.length === 0) {
                c.push(v);
                result.push(c);
            } else {
                if (c[0].color === v.color) {
                    c.push(v);
                } else {
                    c = [];
                    c.push(v);
                    result.push(c);
                }
            }
        }
    }

    return result;
};

export const findMaxArray = arr => arr.reduce((a, v) => v.length > a.length ? v : a, []);

export const getMaxLine = (field, x, y) => {
    const { hLine, vLine, dLine, rLine } = getLines(field, x, y);
    return findMaxArray([
        ...groupBalls(hLine),
        ...groupBalls(vLine),
        ...groupBalls(dLine),
        ...groupBalls(rLine),
    ]);
};
