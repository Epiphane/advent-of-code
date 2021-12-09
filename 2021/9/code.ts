import { Map, MapFromInput } from '../../map';
import { ascending, makeInt, multiplyAll, range } from '../../utils';

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
    if (basinMap.get(x, y) !== 0 || height.get(x, y) === 9) {
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
        .map(basin =>
            basinMap.reduce((prev, id) => prev + (id === basin ? 1 : 0), 0)
        )
        .sort(ascending)
        .slice(-3)
        .reduce(multiplyAll, 1)
);
