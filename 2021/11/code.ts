import { Map, MapFromInput } from '../../map';
import { makeInt } from '../../utils';

const octopi = MapFromInput(0, makeInt);
let part1 = 0;
function iterate() {
    const flashed = new Map();
    octopi.forEach((val, x, y) => octopi.set(x, y, val + 1));

    let changed: boolean;
    do {
        changed = false;
        octopi.forEach((val, x, y) => {
            if (val > 9 && !flashed.get(x, y)) {
                flashed.set(x, y, true);
                changed = true;

                octopi.forNeighbors(x, y, (v, x2, y2) => {
                    octopi.set(x2, y2, v + 1);
                });
            }
        });
    } while (changed);

    flashed.forEach((_, x, y) => {
        octopi.set(x, y, 0);
        part1++;
    });
}

let steps = 0;
for (let synced = false; !synced;) {
    iterate();
    steps++;

    if (steps === 100) {
        console.log(`Part 1:`, part1);
    }

    synced = octopi.reduce((prev: boolean, val) => prev && val === 0, true);
}
console.log(`Part 2:`, steps);
