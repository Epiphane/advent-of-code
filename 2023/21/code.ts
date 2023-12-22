// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
import { question } from 'readline-sync';
import { Point } from '../../point';
const md5 = require('../../md5');
const print = console.log;
const P = print;
const UP = new Point(0, -1);
const DOWN = new Point(0, 1);
const LEFT = new Point(-1, 0);
const RIGHT = new Point(1, 0);
const DIRS = [UP, RIGHT, DOWN, LEFT];

let Turn = (dir: number, amount: number) => {
    dir += amount;
    while (dir < 0) dir += 4;
    while (dir > 3) dir -= 4;
    return dir;
}

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let Lines = raw.split('\n').map(line => line);
let Numbers = raw.split('\n').map(line => parseInt(line));
let Groups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let AsMap = MapFromInput('.');
let NumberMap = MapFromInput(0, makeInt)

let start;
AsMap.forEach((v, x, y) => {
    if (v === 'S') {
        start = { x, y }
        AsMap.set(x, y, '.');
    }
})

let total = 0;
let j = 0;

let counted = {};
let found = {};
let soonest = {};

let stack = [{ ...start, steps: 0 }];
let NN = 26501365;

let DSIZE = 7;
let DHALF = Math.floor(DSIZE / 2);

let distances = range(DSIZE).map(() => range(DSIZE).map(() => new Map(0)));
distances[DHALF][DHALF].set(start.x, start.y, 2)

let AllDistances = new Map(0);
AllDistances.set(start.x, start.y, 'S');
AllDistances.set(start.x, start.y, 2);

while (stack.length) {
    let { x, y, steps } = stack.shift();

    let quadX = Math.floor(x / AsMap.max.x) + DHALF
    let quadY = Math.floor(y / AsMap.max.y) + DHALF

    if (quadX >= 0 && quadY >= 0 && quadX < DSIZE && quadY < DSIZE) {
        let mydist = distances[quadY][quadX];
        if ((!mydist.get(x, y) || mydist.get(x, y) > steps) && steps > 0) {
            found[`${x}|${y}`] = steps;
            let inQuadX = Math.floor((x + DHALF * AsMap.max.x) % AsMap.max.x)
            let inQuadY = Math.floor((y + DHALF * AsMap.max.y) % AsMap.max.y)
            mydist.set(inQuadX, inQuadY, steps);
        }
    }

    if (!AllDistances.get(x, y) && steps > 0 && steps <= NN) {
        AllDistances.set(x, y, steps);
    }

    // if (steps % 2 === 1) {
    //     total++;
    //     found[`${x}|${y}`] = steps;
    //     soonest[`${x % AsMap.max.x}|${y % AsMap.max.y}`] = soonest[`${x % AsMap.max.x}|${y % AsMap.max.y}`] || [];
    //     soonest[`${x % AsMap.max.x}|${y % AsMap.max.y}`].push(steps);
    // }

    if (steps >= 100 &&
        (quadX < 0 || quadX >= DSIZE || quadY < 0 || quadY >= DSIZE)) {
        continue;
    }

    let ns = steps + 1;

    DIRS.forEach(({ x: dx, y: dy }) => {
        let nx = x + dx;
        let ny = y + dy;

        let fn = (x, y) => {
            while (x < 0) x += AsMap.max.x;
            while (y < 0) y += AsMap.max.y;
            return AsMap.get(x % AsMap.max.x, y % AsMap.max.y);
        }

        let v = fn(nx, ny);
        if (v !== '.') {
            return;
        }

        let key = `${nx}|${ny}`;
        if (found[key] != undefined) {
            return true;
        }

        counted[key] = counted[key] || [];
        if (counted[key].includes(ns)) {
            return;
        }

        counted[key].push(ns);
        stack.push({
            x: nx, y: ny, steps: ns
        });
    })
}

total = 0;
let pts = [];

print('done prepping');

distances[DHALF][DHALF].forEach((_, x, y) => {
    if (x === 0) print(x, y);
    let deltas = distances.map((distRow, QY) => distRow.map((dist, QX) => {
        // if ([0, 4].includes(QY) && [0, 4].includes(QX)) {
        //     let CQX = QX + Math.sign(2 - QX);
        //     let CQY = QY + Math.sign(2 - QY);
        //     CQX = CQY = 2;
        //     return dist.get(x, y) - distances[CQY][CQX].get(x, y);
        // }
        // else if ([0, 4].includes(QY)) {
        //     let CQY = QY + Math.sign(2 - QY);
        //     // if (x === 0 && y === 0) {
        //     //     print([QX, QY], [QX, CQY], dist.get(x, y), distances[CQY][QX].get(x, y));
        //     //     print
        //     // }
        //     CQY = 2;
        //     return dist.get(x, y) - distances[CQY][QX].get(x, y);
        // }
        // else if ([0, 4].includes(QX)) {
        //     let CQX = QX + Math.sign(2 - QX);
        //     CQX = 2;
        //     return dist.get(x, y) - distances[QY][CQX].get(x, y);
        // }
        if (QX === 2 && QY === 2) {
            return dist.get(x, y);
        }
        else {
            return dist.get(x, y) - distances[2][2].get(x, y);
        }
    }));

    let mydists = distances.map((distRow, QY) => distRow.map((dist, QX) => {
        return dist.get(x, y);
    }));

    let result = 0;
    let found = new Map('.');
    distances.forEach((drow, x_) =>
        drow.forEach((_, y_) => {
            if (x_ === 0 || y_ === 0 || x_ === DSIZE - 1 || y_ === DSIZE - 1) return;

            // if (x === 5 && y === 5 && x_ === 0 && y_ === 0) {
            //     print(mydists[2 + y_][2 + x_])
            //     print(mydists[2 + y_][2 + x_] <= NN)
            //     print(mydists[2 + y_][2 + x_] % 2)
            //     print(NN, NN % 2)
            // }
            // print(mydists, y_, x_)
            if (mydists[y_][x_] <= NN && mydists[y_][x_] % 2 === NN % 2) {
                found.set(x_ - DHALF, y_ - DHALF, (x_ === DHALF && y_ === DHALF) ? `[]` : mydists[y_][x_])
                result++;
                let absX = x + AsMap.max.x * (x_)
                let absY = y + AsMap.max.y * (y_)
                pts.push([absX, absY])
            }

            if (x_ === DHALF && y_ === DHALF) {
                found.set(x_ - DHALF, y_ - DHALF, (x_ === DHALF && y_ === DHALF) ? `[]` : mydists[y_][x_])
            }

            // found.set(x_, y_, '??')
        })
    );

    let dirs = [
        [[1, 2], [[-1, 0]]],
        [[3, 2], [[1, 0]]],
        [[2, 1], [[0, -1]]],
        [[2, 3], [[0, 1]]],

        [[1, 1], [[-1, 0], [0, -1]]],
        [[1, 3], [[-1, 0], [0, 1]]],
        [[3, 1], [[0, -1], [1, 0]]],
        [[3, 3], [[1, 0], [0, 1]]],
    ]

    dirs = [
        ...range(DSIZE - 2).map((x) => [[0, x + 1], [[-1, 0]]]),
        ...range(DSIZE - 2).map((x) => [[DSIZE - 1, x + 1], [[1, 0]]]),

        ...range(DSIZE - 2).map((y) => [[y + 1, 0], [[0, -1]]]),
        ...range(DSIZE - 2).map((y) => [[y + 1, DSIZE - 1], [[0, 1]]]),

        [[0, 0], [[-1, 0], [0, -1]]],
        [[0, DSIZE - 1], [[-1, 0], [0, 1]]],
        [[DSIZE - 1, 0], [[0, -1], [1, 0]]],
        [[DSIZE - 1, DSIZE - 1], [[1, 0], [0, 1]]],
    ]

    let err = false;//(x === 0 && y === 0);

    let recurse = (sx, sy, options, dist, [stepsX, stepsY], indent) => {
        // print(sx, sy, options, dist);
        let result = 0;

        let spread = 1;
        let delta = AsMap.max.y;

        if (dist % 2 !== NN % 2) {
            if (options.length > 1) {
                spread++;
            }
            dist += delta;
        }

        if (dist > NN) {
            return 0;
        }

        for (let d = dist; d <= NN; d += 2 * delta) {
            result += spread;

            if (options.length > 1) {
                spread += 2;
            }

        }

        /*
        if (dist % 2 === NN % 2) {
            if (found.get(sx + stepsX - DHALF, sy + stepsY - DHALF) !== '.') {
                // print(indent, [sx + stepsX - DHALF, sy + stepsY - DHALF], dist)
            }

            let absX = x + AsMap.max.x * (sx + stepsX - DHALF)
            let absY = y + AsMap.max.y * (sy + stepsY - DHALF)
            if (dist !== AllDistances.get(absX, absY) && AllDistances.get(absX, absY) !== 0) {
                print('Failed', absX, absY, dist, AllDistances.get(absX, absY))
                err = true;
            }
            if (options.length === 2)
                found.set(sx + stepsX - DHALF, sy + stepsY - DHALF, dist);
            result++;
            pts.push([absX, absY])
        }
        */

        // options.forEach(([dx, dy]) => {
        //     if (stepsX !== 0 && dy !== 0) {
        //         return;
        //     }

        //     let delta = AsMap.max.y;

        //     result += recurse(sx, sy, options, dist
        //         +
        //         delta
        //         // AsMap.max.y
        //         // 11
        //         , [stepsX + dx, stepsY + dy], indent + ' ');
        // })

        return result;
    }

    // print(dirs)
    dirs.forEach(([[sx, sy], options]) => {
        // print(sx, sy, options)
        result += recurse(sx, sy, options, mydists[sy][sx], [0, 0], '');
    });

    if (err) {
        // if (found.print().indexOf('50') >= 0) {
        // if (false) {
        print(x, y, mydists, result);
        print(found.print());
    }
    total += result;
})

// print(AllDistances.map(i => i !== 0 ? i : '').print());
print('Calc', total);
print('Real', AllDistances.reduce((prev, v) => prev + ((v === 'S' && NN % 2 === 0) || (v !== 0 && v <= NN && v % 2 === NN % 2) ? 1 : 0), 0))
// print(pts.sort(([a, b], [a2, b2]) => a === a2 ? b - b2 : a - a2).join('\n'));
let pts2 = [];
AllDistances.forEach((v, x, y) => {
    if ((v === 'S' && NN % 2 === 0) || (v !== 0 && v <= NN && v % 2 === NN % 2)) {
        pts2.push([x, y])
    }
})
// print(pts2.filter(([x, y]) => !pts.find(([x2, y2]) => x === x2 && y === y2)));
// print('------')
// print(pts.filter(([x, y]) => !pts2.find(([x2, y2]) => x === x2 && y === y2)));

// distances.forEach((drow, QY) =>
//     drow.forEach((dist, QX) => {
//         if ([0, distances.length - 1].includes(QY) || [0, drow.length - 1].includes(QX)) {

//         }
//         else {
//             dist.forEach((v, x, y) => {
//                 if (v === 0 || v % 2 !== NN % 2) return;
//                 total += 1;
//             })
//         }
//     }))

let lines = range((AsMap.max.y + 1) * 5).map(() => '')
distances.forEach((distRow, QY) => {
    distRow.forEach((dist, QX) => {
        let lineNum = QY * (AsMap.max.y + 1);
        dist.print().split('\n').forEach((line, i) => {
            lines[lineNum + i] += ' | ' + line;
        });
    })
})
// print(lines.join('\n'));



// distances[0][0].forEach((v, x, y) => { if (y === 0) print(x, v) })

// let lines = range(AsMap.max.y * 5 + 25).map(() => ['', '', '', '', '']);

// [1, 2, 3].forEach(y => {
//     distances[y].forEach((dx, _x) => {
//         if (_x === 0 || _x === 4) return;
//         // print(dx, dx.print());
//         // if (!dx.print()) return;
//         dx.map(v => v.toString().padEnd(3)).print().split('\n').forEach((l, li) => lines[li + y * 5 * AsMap.max.y][_x] = l);
//     });
// })

// print(lines.map(l => l.join('|')).join('\n'))

// print(distances[0][1].map(v => (v === 0 || v % 2 !== 0) ? '.' : v).print());
// print('-')
// print(distances[1][0].map(v => (v === 0 || v % 2 !== 0) ? '.' : v).print());
// print('-')
// print(distances[2][2].map(v => (v === 0) ? '.' : v).print());
// print(total);
// print(dist.get(start.x, start.y))
