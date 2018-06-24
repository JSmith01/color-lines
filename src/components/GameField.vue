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
        },

        inPath(x, y) {
            return this.path && this.path.some(v => v.x === x && v.y === y);
        },
    },
};
</script>
