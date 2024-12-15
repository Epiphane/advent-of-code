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

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

function* extractNumbers(matches: RegExpStringIterator) {
    for (let match of matches) {
        let result = [];
        for (let key in match) {
            result[key] = match[key];
            if (!isNaN(+result[key])) {
                result[key] = +result[key];
            }
        }
        yield result;
    }
}

let cache = {};
function score(pos, A, B, dest, depth) {
    if (cache[pos.toString()]) return cache[pos.toString()];
    if (pos.x > dest.x) return cache[pos.toString()] = 100000000000;
    if (pos.y > dest.y) return cache[pos.toString()] = 100000000000;
    if (depth >= 200) return cache[pos.toString()] = 100000000000;
    if (pos.equals(dest)) {
        print('done');
        return cache[pos.toString()] = 0;
    }

    // print(depth);
    let a = 3 + score(pos.add(A), A, B, dest, depth + 1);
    let b = 1 + score(pos.add(B), A, B, dest, depth + 1);
    return cache[pos.toString()] = Math.min(a, b);
}

let map = new Map(0);
asGroups.forEach((lines, i) => {
    const matches1 = lines[0].match(/Button A: X\+(\d+), Y\+(\d+)/);
    const matches2 = lines[1].match(/Button B: X\+(\d+), Y\+(\d+)/);
    const matches3 = lines[2].match(/Prize: X=(\d+), Y=(\d+)/);
    let [_1, x1, y1] = matches1;
    let [_2, x2, y2] = matches2;
    let [_3, x3, y3] = matches3;
    cache = {};

    x1 = +x1;
    x2 = +x2;
    x3 = +x3;
    y1 = +y1;
    y2 = +y2;
    y3 = +y3;
    x3 += 10000000000000;
    y3 += 10000000000000;

    // let A = new Point(+x1, +y1);
    // let B = new Point(+x2, +y2);

    // A * x1 + B * x2 = x3
    // B = (x3 - a * x1) / x2;

    // A * y1 + B * y2 = y3
    // A * y1 + y2 * (x3 - a * x1) / x2; = y3
    // A * y1 + x3 * y2 / x2 - y2 * A * x1 / x2 = y3
    // A * y1 - A * x1 * y2 / x2 = y3 - x3 * y2 / x2
    // A = (y3 - x3 * y2 / x2) / (y1 - x1 * y2 / x2)

    // let A = (y3 - x3 * y2 / x2) / (y1 - x1 * y2 / x2);
    // if (A === Math.floor(A)) {
    //     let B = (x3 - A * x1) / x2;
    //     if (B === Math.floor(B)) {
    //         total += 3 * A + B;
    //     }
    // }
    // if (i !== 0) return;

    let b1 = -1;
    if (x3 % x1 === 0) {
        let A = x3 / x1;
        if (y1 * A === y3) {
            b1 = (A * 3);
        }
    }

    if (x3 % x2 === 0) {
        let B = x3 / x2;
        if (y2 * B === y3) {
            b1 = Math.min(b1, B);
        }
    }

    if (b1 >= 0) {
        print(b1);
        total += b1;
        return;
    }

    let B = (y3 - x3 * y1 / x1) / (y2 - x2 * y1 / x1);
    let A = (y3 - x3 * y2 / x2) / (y1 - x1 * y2 / x2);
    // let A = (x3 - B * x2) / x1;
    // print(x3, y3, A, B)
    let hit = 0;
    let best = 10000000000000;
    if (Math.abs(B - Math.round(B)) < 0.0001) {
        if (Math.abs(A - Math.round(A)) < 0.0001
            // && A <= 100 && B <= 100
            && A >= 0 && B >= 0
        ) {
            // total += 3 * Math.round(A) + Math.round(B);
            // print(A, B, lcm(x1, x2), lcm(y1, y2), x3);
            hit = 3 * Math.round(A) + Math.round(B);
            best = hit;
            print(x3);
            print(best, A, B, x3 === A * x1 + B * x2, y3 === A * y1 + B * y2)
        }
    }

    // best = 10000000000000;
    // range(101).forEach(a => {
    //     let B2 = (x3 - a * x1) / x2;
    //     if (B2 === Math.round(B2) && a * y1 + B2 * y2 === y3 && B2 < 101) {
    //         // print(a, B);
    //         let sc = a * 3 + B2;
    //         if (sc < best) {
    //         }
    //         // print(sc, best, a, B2);
    //         best = Math.min(sc, best);
    //     }
    // })
    // let res1 = best;

    // best = 10000000000000;
    // range(101).forEach(a => {
    //     let B2 = (x3 - a * x1) / x2;
    //     if (B2 === Math.round(B2) && a * y1 + B2 * y2 === y3 && B2 < 101) {
    //         // print(a, B);
    //         let sc = a * 3 + B2;
    //         if (sc < best) {
    //         }
    //         // print(sc, best, a, B2);
    //         best = Math.min(sc, best);
    //     }
    // })

    // if (res1 !== best) {
    //     print(lines, res1, best);
    // }

    if (best !== 10000000000000) {
        // print(hit, best)
        if (hit !== best) {
            print('-----')
            print('-----')
        }
        total += best;
    }

    // print(A, B, x3, y3);
    // for (let a = 0; a < 100000000000; a++) {
    //     let B = (x3 - a * x1) / x2;
    //     if (B === Math.floor(B) && a * y1 + B * y2 === y3) {
    //         print(a, B);
    //         let sc = a * 3 + B;
    //         best = Math.min(sc, best);
    //     }
    // }

    // print(best);
    // if (best !== 10000000000000) {
    //     print(A, B, best)
    //     total += best;
    // }

    // print(_1, x1, y1);
    // return;
    // print(new Point(0, 0), new Point(+x1, +y1), new Point(+x2, +y2), new Point(+x3, +y3));
    // return;
    // total += score(new Point(0, 0), new Point(+x1, +y1), new Point(+x2, +y2), new Point(+x3, +y3), 0);
    // return;
});

print(total);
