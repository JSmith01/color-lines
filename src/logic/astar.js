/* eslint-disable no-restricted-syntax,no-continue */

const FIELD_SIZE = 9;

const FIELD = Array(FIELD_SIZE).fill(1).map((_, x) =>
    Array(FIELD_SIZE).fill(1).map((__, y) => ({ x, y })),
);

const sq = x => x * x;

/**
 * Heuristics function
 * @param {{ x: number, y: number}} start
 * @param {{ x: number, y: number}} goal
 * @returns {number}
 */
const estimate = (start, goal) => sq(start.x - goal.x) + sq(start.y - goal.y);

/**
 *
 * @param {Set} openSet
 * @param {Map} score
 * @returns {{ x: number, y: number}}
 */
function findMinValue(openSet, score) {
    let min = Infinity;
    let found;

    for (const i of openSet) {
        if (score.get(i) < min) {
            min = score.get(i);
            found = i;
        }
    }

    return found;
}

const getCellFactory = field => (x, y) => (field[x] || {})[y];

const getNeighboursFactory = getCell => ({ x, y }) => [
    getCell(x - 1, y),
    getCell(x + 1, y),
    getCell(x, y - 1),
    getCell(x, y + 1),
].filter(i => !!i);

/**
 * @param {Map} cameFrom
 * @param current
 */
function reconstructPath(cameFrom, current) {
    let c = current;
    const result = [c];

    while (cameFrom.has(c)) {
        c = cameFrom.get(c);
        result.unshift(c);
    }

    return result;
}

/**
 * Finds path from start to goal or returns null if it's not possible
 * @see https://en.wikipedia.org/wiki/A*_search_algorithm
 * @param {{ x: number, y: number}} start
 * @param {{ x: number, y: number}} goal
 * @param {{ x: number, y: number}[][] | null} field
 * @return {{ x: number, y: number}[] | null}
 */
function astar(start, goal, field = null) {
    const closedSet = new Set();
    const openSet = new Set([start]);
    const cameFrom = new Map();
    const gScore = new Map();
    gScore.set(start, 0);
    const fScore = new Map();
    fScore.set(start, estimate(start, goal));
    const getNeighbours = getNeighboursFactory(getCellFactory(field || FIELD));

    while (openSet.size > 0) {
        const current = findMinValue(openSet, fScore);
        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(current);
        closedSet.add(current);

        for (const neighbor of getNeighbours(current)) {
            if (closedSet.has(neighbor)) {
                continue;
            }
            if (!openSet.has(neighbor)) {
                openSet.add(neighbor);
            }
            const tentativeGScore = gScore.get(current) + estimate(current, neighbor);
            const neighborGScore = gScore.get(neighbor);
            if (neighborGScore !== undefined && tentativeGScore >= neighborGScore) {
                continue;
            }
            cameFrom.set(neighbor, current);
            gScore.set(neighbor, tentativeGScore);
            fScore.set(neighbor, tentativeGScore + estimate(neighbor, goal));
        }
    }

    return null;
}

export default astar;
