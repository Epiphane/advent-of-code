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

let ij = 0;
let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

let stack = [{
    x: 0, y: 0, lastDir: RIGHT, lastDirNum: 0, score: 0, path: []
}];

let endX = asNumberMap.max.x - 1;
let endY = asNumberMap.max.y - 1;

let KEY = (x, y, dir, num) => `${x}|${y}|${dir.x}|${dir.y}|${num}`

let min = {};
min[KEY(0, 0, RIGHT, 0)] = 0;
let minS = {};
while (stack.length) {
    let { x, y, lastDir, lastDirNum, score, path } = stack.shift();

    if (x === endX && y === endY && lastDirNum >= 4) {
        print(score, path.join(' '));
        break;
    }

    let myKey = KEY(x, y, lastDir, lastDirNum);
    // if (min[myKey].score !== score) continue;
    min[myKey] = null;

    DIRS.forEach(dir => {
        if (dir === lastDir && lastDirNum >= 10) {
            return;
        }

        if (dir !== lastDir && lastDirNum < 4) {
            return;
        }

        if (dir.x + lastDir.x === 0 && dir.y + lastDir.y === 0) {
            return;
        }

        if (!asNumberMap.contains(x + dir.x, y + dir.y)) {
            return;
        }

        let nNum = dir === lastDir ? lastDirNum + 1 : 1;
        let nScore = score + asNumberMap.get(x + dir.x, y + dir.y);

        let key = KEY(x + dir.x, y + dir.y, dir, nNum);// `${x + dir.x}|${y + dir.y}|${dir.x}|${dir.y}|${nNum}`;
        if (min[key]) {
            min[key].score = Math.min(min[key].score, nScore);
            return;
        }
        // } && min[key] < nScore) {
        //     return;
        // }

        if (minS[key] && minS[key] < nScore) {
            return;
        }

        minS[key] = nScore;

        let obj = { x: x + dir.x, y: y + dir.y, lastDir: dir, lastDirNum: nNum, score: nScore, path: path.concat([x + dir.x, y + dir.y].join(',')) };
        min[key] = obj;
        stack.push(obj);
    })

    stack.sort((a, b) => {
        let Adist = Math.abs(a.x - endX) + Math.abs(a.y - endY);
        let Bdist = Math.abs(b.x - endX) + Math.abs(b.y - endY);
        // if (Adist !== Bdist) return Adist - Bdist;
        // if (a.path.length === b.path.length) return Bdist - Adist;
        if (a.score === b.score) {
            return Adist - Bdist;
        }
        return (a.score + 0 * Adist) - (b.score + 0 * Bdist);
    })

    if (ij++ % 10000 === 0)
        print(stack.length, stack[0])
}
