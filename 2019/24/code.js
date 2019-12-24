const { Map, MakeMap, MapFromInput } = require('../../map');
const { id } = require('../utils');
const log = console.log;

let asciiToBug = v => v === '#' ? 1 : 0;
let bugAccumulator = (prev, val) => prev + val;

let maps = [MapFromInput(asciiToBug, 0)];

function iterate(recurse) {
    if (recurse) {
        // Make sure top and bottom are empty.
        if (maps[0].reduce(bugAccumulator, 0) > 0) {
            maps.unshift(MakeMap(5, 5, () => 0, 0));
        }
        if (maps[maps.length - 1].reduce(bugAccumulator, 0) > 0) {
            maps.push(MakeMap(5, 5, () => 0, 0));
        }
    }

    // Save previous state.
    let saved = maps.map(m => m.map(id));

    // Update current state.
    maps.forEach((map, level) => {
        let inner = saved[level + 1];
        let current = saved[level];
        let outer = saved[level - 1];

        map.forEach((val, x, y) => {
            if (recurse && x === 2 && y === 2) {
                return;
            }

            let adjacent = 0;
            // Left
            if (recurse && x === 0) {
                if (outer) {
                    adjacent += outer.get(1, 2);
                }
            }
            else if (recurse && x === 3 && y === 2) {
                if (inner) {
                    for (let y_ = 0; y_ < 5; y_ ++) {
                        adjacent += inner.get(4, y_);
                    }
                }
            }
            else {
                adjacent += current.get(x - 1, y);
            }

            // Up
            if (recurse && y === 0) {
                if (outer) {
                    adjacent += outer.get(2, 1);
                }
            }
            else if (recurse && y === 3 && x === 2) {
                if (inner) {
                    for (let x_ = 0; x_ < 5; x_ ++) {
                        adjacent += inner.get(x_, 4);
                    }
                }
            }
            else {
                adjacent += current.get(x, y - 1);
            }

            // Right
            if (recurse && x === 4) {
                if (outer) {
                    adjacent += outer.get(3, 2);
                }
            }
            else if (recurse && x === 1 && y === 2) {
                if (inner) {
                    for (let y_ = 0; y_ < 5; y_ ++) {
                        adjacent += inner.get(0, y_);
                    }
                }
            }
            else {
                adjacent += current.get(x + 1, y);
            }

            // Down
            if (recurse && y === 4) {
                if (outer) {
                    adjacent += outer.get(2, 3);
                }
            }
            else if (recurse && y === 1 && x === 2) {
                if (inner) {
                    for (let x_ = 0; x_ < 5; x_ ++) {
                        adjacent += inner.get(x_, 0);
                    }
                }
            }
            else {
                adjacent += current.get(x, y + 1);
            }

            if (val === 1) {
                if (adjacent !== 1) {
                    map.set(x, y, 0);
                }
            }
            else {
                if (adjacent === 1 || adjacent === 2) {
                    map.set(x, y, 1);
                }
            }
        });
    });

}

// Part 1
let stateMap = {};
stateMap[maps[0].print()] = true;
while (true) {
    iterate();

    if (stateMap[maps[0].print()]) {
        break;
    } else {
        stateMap[maps[0].print()] = true;
    }
}

let inc = 1;
let result = 0;
maps[0].forEach(val => {
    result += inc * val;
    inc *= 2;
});
log(`Part 1: ${result}`);

// Part 2
maps = [MapFromInput(asciiToBug, 0)];

for (let i = 0; i < 200; i ++) {
    iterate(true);
}

log(`Part 2: ${maps.reduce((prev, map) => {
    return prev + map.reduce(bugAccumulator, 0);
}, 0)}`)
