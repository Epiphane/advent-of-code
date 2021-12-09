import { Map, MapFromInput } from '../../map';
import { makeInt, range } from '../../utils';

let height = MapFromInput(9, makeInt);
let basinMap = new Map(0);

interface Node {
    x: number;
    y: number;
    basin: number;
}
const queue: Node[] = [];

function SetBasin(x: number, y: number, basin: number) {
    // Don't go out of bounds, and don't reassign
    // something that already has a basin
    if (
        x < height.min.x || x >= height.max.x ||
        y < height.min.y || y >= height.max.y ||
        basinMap.get(x, y) !== 0 ||
        height.get(x, y) === 9
    ) {
        return;
    }

    basinMap.set(x, y, basin);
    queue.push({ x, y, basin });
}

// Add low points to basin map
let basinId = 0;
height.forEach((n, x, y) => {
    if (
        height.get(x - 1, y) <= n ||
        height.get(x + 1, y) <= n ||
        height.get(x, y - 1) <= n ||
        height.get(x, y + 1) <= n
    ) {
        return;
    }

    SetBasin(x, y, ++basinId);
})

console.log(`Part 1`, queue.reduce((prev, { x, y }) => prev + height.get(x, y) + 1, 0));

// Breadth first search to assign all Basin IDs
while (queue.length !== 0) {
    const { x, y, basin } = queue.shift();

    SetBasin(x - 1, y, basin);
    SetBasin(x + 1, y, basin);
    SetBasin(x, y - 1, basin);
    SetBasin(x, y + 1, basin);
}

console.log(`Part 2`,
    range(basinId)
        .map(basinId =>
            basinMap.reduce((prev, id) => prev + (id === basinId ? 1 : 0), 0)
        )
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((p, n) => p * n, 1)
);
