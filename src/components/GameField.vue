<template>
    <div>
        <div
            v-for="(row, i) in field"
            :key="i"
        >
            <Cell
                v-for="(cell, j) in row"
                :color="cell.color"
                :status="x === i && y === j ? 'jump' : cell.status"
                :highlight="inPath(i, j)"
                :key="j"
                @click="clickOnCell(i, j)"
            />
        </div>
    </div>
</template>

<script>
import Cell from './Cell';
import astar from '../astar';

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const FIELD_SIZE = 9;
const INITIAL_APPEARED = 40;
const COLORS = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'darkblue',
    'purple',
];

export default {
    name: 'GameField',
    components: { Cell },
    data() {
        const field = new Array(FIELD_SIZE)
            .fill(1)
            .map(() => new Array(FIELD_SIZE).fill(1).map(() =>
                ({
                    color: 'blue',
                    status: 'empty',
                })));

        for (let i = 0; i < INITIAL_APPEARED; i++) {
            const x = rnd(0, FIELD_SIZE - 1);
            const y = rnd(0, FIELD_SIZE - 1);
            const color = COLORS[rnd(0, 6)];
            field[x][y] = { color, status: '' };
        }

        return { field, x: null, y: null, locked: false, path: null };
    },

    methods: {
        checkLine(x, y) {
            const { field } = this;

            const getColor = ({ x, y }) => field[x] && field[x][y] && field[x][y].status === ''
                ? { ...field[x][y], x, y }
                : undefined;
            const hLineFn = t => ({ x, y: t });
            const vLineFn = t => ({ x: t, y });
            const dLineFn = t => ({ x: FIELD_SIZE - t - 1, y: t - FIELD_SIZE + 1 + y + x });
            const rLineFn = t => ({ x: t, y: t - x + y });

            const getLine = lineFn => Array(FIELD_SIZE).fill(0).map((_, i) => getColor(lineFn(i)));

            /*
            const tap = x => { console.log(x); return x; };
            const compose2 = (f, g) => (...args) => f(g(...args));
            const getLineDebug = lineFn => getLine(compose2(tap, lineFn));
            */

            const hLine = getLine(hLineFn);
            const vLine = getLine(vLineFn);
            const dLine = getLine(dLineFn);
            const rLine = getLine(rLineFn);

            console.log(x, y, hLine, vLine, dLine, rLine);
        },

        clickOnCell(x, y) {
            if (this.locked) {
                return;
            }

            const status = this.field[x][y].status;

            if (status === '') {
                this.x = x;
                this.y = y;
                this.path = null;
            } else if (status === 'empty' && this.x !== null && this.y !== null) {
                this.moveBall(x, y);
            }
        },

        moveBall(toX, toY) {
            const field = this.field.map((row, x) => row.map((cell, y) => (cell.status === 'empty' ? ({ x, y }) : undefined)));
            field[this.x][this.y] = { x: this.x, y: this.y };
            const path = astar(field[this.x][this.y], field[toX][toY], field);
            // eslint-disable-next-line no-console
            this.path = path;
            this.rollBall();
        },

        rollBall() {
            if (this.path) {
                this.x = null;
                this.y = null;
                this.locked = true;
                if (this.path.length > 1) {
                    let { x, y } = this.path.shift();
                    const { color } = this.field[x][y];
                    this.field[x][y] = { status: 'empty', color: COLORS[0] };
                    x = this.path[0].x;
                    y = this.path[0].y;
                    this.field[x][y] = { status: '', color };
                    this.$nextTick(() => setTimeout(() => this.rollBall(), 30));
                } else {
                    if (this.path[0]) {
                        let { x, y } = this.path[0];
                        this.checkLine(x, y);
                    }
                    this.path = null;
                    this.locked = false;
                }
            }
        },

        inPath(x, y) {
            // return false;
            return this.path && this.path.some(v => v.x === x && v.y === y);
        },
    },
};
</script>
