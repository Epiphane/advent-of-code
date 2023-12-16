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
const UP = new Point(0, 1);
const DOWN = new Point(0, -1);
const LEFT = new Point(1, 0);
const RIGHT = new Point(-1, 0);
const DIRS = [UP, LEFT, DOWN, RIGHT];

let Turn = (dir: number, amount: number) => {
    dir += amount;
    while (dir < 0) dir += 4;
    while (dir > 3) dir -= 4;
    return dir;
}

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

let totals = [];

let loads = {};
// for (let cycle = 0; cycle < 1000000000; cycle++) {
//     DIRS.forEach(({ x: dx, y: dy }) => {
//         for (let i of range(100)) {
//             let nextMap = asMap.map((v, x, y) => v);

//             nextMap.forEach((v, x, y) => {
//                 if (v === '#') return;
//                 else if (v === '.') {
//                     if (nextMap.get(x + dx, y + dy) === 'O') {
//                         nextMap.set(x + dx, y + dy, '.');
//                         nextMap.set(x, y, 'O');
//                     }
//                 }
//             })

//             asMap = nextMap;
//         }
//     });

//     let total = 0;
//     let rows = asMap.max.y;
//     asMap.forEach((v, x, y) => {
//         if (v === 'O') {
//             total += rows - y;
//         }
//     })

//     // print(cycle, total);
//     if (loads[total] != undefined) {
//         print(cycle, loads[total], total, cycle - loads[total]);
//     }
//     else {
//         loads[total] = cycle;
//     }
// };

// 172 102 94245 70
// 173 99 94255 74
// 174 104 94263 70
// 175 105 94278 70
// 176 106 94295 70
// 177 107 94312 70
// 178 108 94313 70
// 179 109 94315 70
// 180 110 94309 70
// 181 111 94302 70
// 182 112 94283 70
// 183 113 94269 70
// 184 114 94258 70
// 185 115 94253 70
// 186 102 94245 84
// 187 99 94255 88

// 2371 99 94255
// 2372 104 94263
// 2373 105 94278
// 2374 106 94295
// 2375 107 94312
// 2376 108 94313
// 2377 109 94315
// 2378 110 94309
// 2379 111 94302
// 2380 112 94283
// 2381 113 94269
// 2382 114 94258
// 2383 115 94253
// 2384 102 94245
// 2385 99 94255
// 2386 104 94263
// 2387 105 94278

let nums = [
    94255,
    94263,
    94278,
    94295,
    94312,
    94313,
    94315,
    94309,
    94302,
    94283,
    94269,
    94258,
    94253,
    94245,
]

let N = 1000000000 - 1;
let R = (N - 173) % 14;
print(N, nums[R])

// print(asMap.print());

// print(total);
