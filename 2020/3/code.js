import fs from 'fs';
import { Map } from '../../map.js';

const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let map = new Map('.');

lines.forEach((line, y) =>
    line.split('').forEach((i, x) =>
        map.set(x, y, i === '#' ? 1 : 0)
    )
)

function trees(dx, dy) {
    let result = 0;
    let x = 0;
    for (let y = 0; y < map.max.y; y += dy) {
        result += map.get(x % (map.max.x), y)
        x += dx;
    }
    return result;
}

print(`Part 1: ${trees(3, 1)}`);
print(`Part 2: ${[[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]].reduce((prev, [dx, dy]) => prev * trees(dx, dy), 1)}`);
