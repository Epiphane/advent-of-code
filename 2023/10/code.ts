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

let borderMap = new Map(0, 0, asMap.max.mult(3));

const start = { ...currentPosition };
let prev = { ...currentPosition };
let loop = [];
do {
    let { x, y } = currentPosition;
    loop.push(`${x},${y}`);
    switch (asMap.get(x, y)) {
        case '|':
            borderMap.set(x * 3 + 1, y * 3 + 0, 1)
            borderMap.set(x * 3 + 1, y * 3 + 1, 1)
            borderMap.set(x * 3 + 1, y * 3 + 2, 1)
            if (prev.y === y - 1) {
                y++;
            }
            else {
                y--;
            }
            break;
        case '-':
            borderMap.set(x * 3 + 0, y * 3 + 1, 1)
            borderMap.set(x * 3 + 1, y * 3 + 1, 1)
            borderMap.set(x * 3 + 2, y * 3 + 1, 1)
            if (prev.x === x - 1) {
                x++;
            }
            else {
                x--;
            }
            break;
        case 'L':
            borderMap.set(x * 3 + 1, y * 3 + 0, 1)
            borderMap.set(x * 3 + 1, y * 3 + 1, 1)
            borderMap.set(x * 3 + 2, y * 3 + 1, 1)
            if (prev.x === x + 1) {
                y--;
            }
            else {
                x++;
            }
            break;
        case 'J':
            borderMap.set(x * 3 + 1, y * 3 + 0, 1)
            borderMap.set(x * 3 + 1, y * 3 + 1, 1)
            borderMap.set(x * 3 + 0, y * 3 + 1, 1)
            if (prev.x === x - 1) {
                y--;
            }
            else {
                x--;
            }
            break;
        case '7':
            borderMap.set(x * 3 + 1, y * 3 + 2, 1)
            borderMap.set(x * 3 + 1, y * 3 + 1, 1)
            borderMap.set(x * 3 + 0, y * 3 + 1, 1)
            if (prev.x === x - 1) {
                y++;
            }
            else {
                x--;
            }
            break;
        case 'F':
            borderMap.set(x * 3 + 1, y * 3 + 2, 1)
            borderMap.set(x * 3 + 1, y * 3 + 1, 1)
            borderMap.set(x * 3 + 2, y * 3 + 1, 1)
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

console.log(`Part 1:`, loopSize / 2);

let exposed = 0;
let visited = { "0.0": true };

let stack = [{ x: 0, y: 0 }];
let i = 0;
let result = borderMap.map(id);
while (stack.length) {
    let { x, y } = stack.shift();

    if (x % 3 === 1 && y % 3 === 1) {
        exposed++;
        result.set(x, y, 'X');
    }

    borderMap.forNeighbors(x, y, (v, nx, ny) => {
        let key = `${nx}_${ny}`;
        if (v === 0 && !visited[key]) {
            visited[key] = true;

            stack.push({ x: nx, y: ny });
        }
    })
}

let part2 = 0;

let visual = asMap.map(id);
for (let y = asMap.min.y; y < asMap.max.y; y++) {
    let inside = false;
    let lastHalfWall;
    asMap.forEachInRow(y, (v, x, y) => {
        if (loop.includes(`${x},${y}`)) {
            if (v === '|') {
                inside = !inside;
            }
            else if (['F', 'J', '7', 'L'].includes(v)) {
                if (lastHalfWall) {
                    if (lastHalfWall === 'L' && v === '7' ||
                        lastHalfWall === 'F' && v === 'J') {
                        inside = !inside;
                    }
                    lastHalfWall = null;
                }
                else {
                    lastHalfWall = v;
                }
            }
        }
        else {
            if (inside) {
                print(x, y, v);
                part2++;
                visual.set(x, y, 'I')
            }
            else {
                visual.set(x, y, 'O');
            }
        }
    })
}

print(visual.print().replaceAll('0', ' '));
print(`Part 2:`, part2);

print(`Part 2:`, asMap.max.x * asMap.max.y - loopSize - exposed);
