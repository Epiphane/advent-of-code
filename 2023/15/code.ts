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

let HASH = (thing) => {
    let current = 0;
    thing.split('').forEach((l, i) => {
        current += l.charCodeAt(0);
        current *= 17;
        current = current % 256;
    })
    return current;
}

let boxes = range(256).map(() => { return [] });
asLines[0].split(',').forEach(thing => {
    let eq = thing.indexOf('=') >= 0;
    let eqsplit = thing.split('=');

    let osplit = thing.split('-')[0];

    if (!eq) {
        let hash = HASH(osplit);
        let box = boxes[hash];
        boxes[hash] = boxes[hash].filter(i => i[0] !== osplit);
    }
    else {
        let len = +eqsplit[1];
        let hash = HASH(eqsplit[0]);
        let box = boxes[hash];

        let found = false;
        P(eqsplit[0]);
        box.forEach((l, i) => {
            if (l[0] === eqsplit[0]) {
                l[1] = len;
                found = true;
            }
        })

        if (!found) {
            box.push([eqsplit[0], len]);
        }
    }


    // total += current;
})

total = boxes.reduce((prev, box, i) => {
    let tot = 0;
    box.forEach(([label, len], j) => {
        tot += (i + 1) * (j + 1) * len;
    })
    print(i + 1, box, tot);
    return prev + tot;
}, 0)
// print(boxes[0])

print(total);
