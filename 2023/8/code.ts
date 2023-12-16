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

let now = [];//'AAA'
let tree = {};
for (let line of asLines.slice(2)) {
    let [_, a, b, c] = line.match(/(.*) = \((.*), (.*)\)/)
    // let [a, _, b, c] = line.split(' ');
    // b = b.substring(1, 4);
    // c = c.substring(0, c.length - 1);
    tree[a] = { L: b, R: c };

    if (a[2] === 'A') {
        now.push(a);
    }
}
print(tree);

let instrs = asLines[0];

function lowest(now) {
    let total = 0;
    let curs = 0;
    while (now[2] !== 'Z') {
        now = tree[now][instrs[curs]];

        curs = (curs + 1) % instrs.length;
        total++
    }
    print(total);
    return total;
}

let denoms = now.map(n => lowest(n));
print(denoms);

print(denoms.reduce((prev, i) => lcm(prev, i), 1));
