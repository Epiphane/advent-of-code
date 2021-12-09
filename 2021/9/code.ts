import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm, makeInt, range } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line.trim());
let asNumbers = raw.split('\n').map(line => parseInt(line.trim()));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(9, s => parseInt(s))

let basinMap = new Map(-1);

let result = 0;
let queue = [];
let basinId = 0;
asNumberMap.forEach((n, x, y) => {
    if (asNumberMap.get(x - 1, y) <= n) {
        return;
    }
    if (asNumberMap.get(x + 1, y) <= n) {
        return;
    }
    if (asNumberMap.get(x, y - 1) <= n) {
        return;
    }
    if (asNumberMap.get(x, y + 1) <= n) {
        return;
    }

    result += 1 + n;

    queue.push({
        x, y,
        basinId
    })
    basinMap.set(x, y, basinId);
    basinId++;
})
print(result);

let found = new Map(false);
while (queue.length !== 0) {
    const { x, y, basinId } = queue.shift();

    // if (basinMap.get(x, y) >= 0) {
    //     continue;
    // }

    if (found.get(x, y)) {
        continue;
    }
    found.set(x, y, true);

    if (x >= asNumberMap.max.x || y >= asNumberMap.max.y) {
        continue;
    }
    if (x < asNumberMap.min.x || y < asNumberMap.min.y) {
        continue;
    }

    if (basinMap.get(x - 1, y) < 0 && asNumberMap.get(x - 1, y) !== 9) {
        if (x > 0) {
            basinMap.set(x - 1, y, basinId);
            queue.push({
                x: x - 1,
                y,
                basinId
            })
        }
    }

    if (basinMap.get(x + 1, y) < 0 && asNumberMap.get(x + 1, y) !== 9) {
        if (x + 1 < asNumberMap.max.x) {
            basinMap.set(x + 1, y, basinId);
            queue.push({
                x: x + 1,
                y,
                basinId
            })
        }
    }

    if (basinMap.get(x, y - 1) < 0 && asNumberMap.get(x, y - 1) !== 9) {
        if (y > 0) {
            basinMap.set(x, y - 1, basinId);
            queue.push({
                x,
                y: y - 1,
                basinId
            })
        }
    }

    if (basinMap.get(x, y + 1) < 0 && asNumberMap.get(x, y + 1) !== 9) {
        basinMap.set(x, y + 1, basinId);
        queue.push({
            x: x,
            y: y + 1,
            basinId
        })
    }

}

const basins = range(basinId).map(id => {
    let res = 0;
    basinMap.forEach((i, x, y) => {
        if (asNumberMap.get(x, y) !== 9 && i === id) {
            res++;
        }
    })
    // asNumberMap.forEach((n, x, y) => {
    //     if (basinMap.get(x, y) === id && n !== 9) {
    //         res++;
    //     }
    // })
    return res;
});

print(basinMap.print());
print(basins);
print(basins.sort((a, b) => b - a).slice(0, 3));
print(basins.sort((a, b) => b - a));
