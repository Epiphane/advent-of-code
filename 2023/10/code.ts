// @ts-nocheck

import { Map, MapFromInput } from '../../map';
import { id } from '../../utils';
const print = console.log;

let asMap = MapFromInput('.');

let loopSize = 0;

let currentPosition;
asMap.forEach((v, x, y) => {
    if (v === 'S') {
        currentPosition = { x, y };
        asMap.set(x, y, 'J');
    }
})

const start = { ...currentPosition };
let prev = { ...currentPosition };
let loop = [];
do {
    let { x, y } = currentPosition;
    loop.push(`${x},${y}`);
    switch (asMap.get(x, y)) {
        case '|':
            if (prev.y === y - 1) {
                y++;
            }
            else {
                y--;
            }
            break;
        case '-':
            if (prev.x === x - 1) {
                x++;
            }
            else {
                x--;
            }
            break;
        case 'L':
            if (prev.x === x + 1) {
                y--;
            }
            else {
                x++;
            }
            break;
        case 'J':
            if (prev.x === x - 1) {
                y--;
            }
            else {
                x--;
            }
            break;
        case '7':
            if (prev.x === x - 1) {
                y++;
            }
            else {
                x--;
            }
            break;
        case 'F':
            if (prev.x === x + 1) {
                y++;
            }
            else {
                x++;
            }
            break;

    }
    prev = currentPosition;
    currentPosition = { x, y };
    loopSize++;
} while (currentPosition.x !== start.x || currentPosition.y !== start.y);

// let visual = asMap.map(id);
let part2 = 0;
for (let y = asMap.min.y; y < asMap.max.y; y++) {
    let inside = 0;
    asMap.forEachInRow(y, (v, x, y) => {
        if (loop.includes(`${x},${y}`)) {
            if (['|', 'L', 'J'].includes(v)) {
                inside = 1 - inside;
            }
        }
        else {
            part2 += inside;
        }
    })
}

// print(visual.print().replaceAll('0', ' '));
print(`Part 1:`, loopSize / 2);
print(`Part 2:`, part2);
