<template>
    <div>
        <div
            v-for="(row, i) in field"
            :key="i"
        >
            <Cell
                v-for="(cell, j) in row"
                :color="getColor(i, j)"
                :jump="x === i && y === j"
                :highlight="path && inPath(i, j)"
                :vanish="maxLine && inMaxLine(i, j)"
                :small="next && inNext(i, j)"
                :key="j"
                @click="clickOnCell(i, j)"
            />
        </div>
    </div>
</template>

<script>
import Cell from './Cell';
import astar from '../logic/astar';
import { getMaxLine } from '../logic/lines';

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const FIELD_SIZE = 9;
const INITIAL_APPEARED = 3;
const COLORS = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'darkblue',
    'purple',
];

const inList = (list, x, y) => list && list.some(v => v.x === x && v.y === y);

function initField() {
    const field = new Array(FIELD_SIZE)
        .fill(1)
        .map(() => new Array(FIELD_SIZE).fill(1).map(() => null));

    for (let i = 0; i < INITIAL_APPEARED; i++) {
        const x = rnd(0, FIELD_SIZE - 1);
        const y = rnd(0, FIELD_SIZE - 1);
        field[x][y] = rnd(0, COLORS.length - 1);
    }

    return field;
}

export default {
    name: 'GameField',

    components: { Cell },

    data() {
        return {
            field: initField(),
            x: null,
            y: null,
            locked: false,
            path: null,
            maxLine: null,
            next: null,
        };
    },

    created() {
        this.next = this.getNext();
    },

    methods: {
        getColor(x, y) {
            return this.getNativeColor(x, y) || this.getNextColor(x, y) || '';
        },

        getNativeColor(x, y) {
            return COLORS[this.field[x][y]];
        },

        getNextColor(x, y) {
            return this.next && COLORS[(this.next.find(v => v.x === x && v.y === y) || {}).color];
        },

        async proceedNext() {
            let leftNext = this.next.filter(({ x, y }) => this.field[x][y] == null);
            if (leftNext.length < 3) {
                leftNext = leftNext.concat(this.getNext(3 - leftNext.length));
            }

            for (let i = 0; i < leftNext.length; i++) {
                const { color, x, y } = leftNext[i];
                this.$set(this.field[x], y, color);
                // may need to wait for ball to appear
                await this.checkLine(x, y);
            }

            this.next = this.getNext();
        },

        checkLine(x, y) {
            const maxLine = getMaxLine(this.field, x, y);
            if (maxLine.length < 5) {
                return Promise.resolve(false);
            }

            return new Promise(resolve => {
                this.maxLine = maxLine;
                this.locked = true;
                this.$nextTick(() =>
                    setTimeout(() => {
                        maxLine.forEach(({ x, y }) => { this.$set(this.field[x], y, null); });
                        this.locked = false;
                        this.maxLine = null;
                        resolve(true);
                    }, 500)
                );
            });
        },

        clickOnCell(x, y) {
            if (this.locked) {
                return;
            }

            const status = this.field[x][y];

            if (status != null) {
                this.x = x;
                this.y = y;
                this.path = null;
            } else if (status == null && this.x !== null && this.y !== null) {
                this.moveBall(x, y);
            }
        },

        moveBall(toX, toY) {
            const field = this.field.map((row, x) => row.map((cell, y) => (cell == null ? ({ x, y }) : undefined)));
            field[this.x][this.y] = { x: this.x, y: this.y };
            this.path = astar(field[this.x][this.y], field[toX][toY], field);
            this.rollBall();
        },

        rollBall() {
            if (this.path) {
                this.x = null;
                this.y = null;
                this.locked = true;
                if (this.path.length > 1) {
                    let { x, y } = this.path.shift();
                    const color = this.field[x][y];
                    this.field[x][y] = null;
                    x = this.path[0].x;
                    y = this.path[0].y;
                    this.$set(this.field[x], y, color);
                    this.$nextTick(() => setTimeout(() => this.rollBall(), 30));
                } else {
                    if (this.path[0]) {
                        const { x, y } = this.path[0];
                        this.checkLine(x, y).then(success => {
                            if (!success) {
                                this.proceedNext();
                            }
                        });
                    }
                    this.path = null;
                    this.locked = false;
                }
            }
        },

        inPath(x, y) {
            return inList(this.path, x, y);
        },

        inMaxLine(x, y) {
            return inList(this.maxLine, x, y);
        },

        inNext(x, y) {
            return inList(this.next, x, y);
        },

        getAllEmpty() {
            return this.field.reduce(
                (acc, row, x) => acc.concat(row.map((color, y) => color == null ? { x, y } : null).filter(v => v)),
                []
            );
        },

        getNext(qty = 3) {
            const allEmpty = this.getAllEmpty();
            const next = [];
            for (let i = 0; i < qty; i++) {
                if (allEmpty.length > 0) {
                    let nextPosition = allEmpty.splice(rnd(0, allEmpty.length - 1), 1);
                    next.push({
                        color: rnd(0, COLORS.length - 1),
                        ...nextPosition[0]
                    });
                }
            }

            return next;
        }
    },
};
</script>
