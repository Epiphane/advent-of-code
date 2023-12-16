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

let rows = [];
let cols = [];
asMap.forEach((v, x, y) => {
    rows[y] = rows[y] || false;
    cols[x] = cols[x] || false;
    if (v === '#') {
        rows[y] = true;
        cols[x] = true;
    }
});

let newMap = new Map('.');
let stars = [];

asMap.forEach((v, x, y) => {
    let inc = 0;
    for (let _x in cols) {
        if (!cols[_x] && _x < x) {
            inc += 1000000 - 1;
        }
    }
    x += inc;

    inc = 0;
    for (let _y in rows) {
        if (!rows[_y] && _y < y) {
            inc += 1000000 - 1;
        }
    }
    y += inc;

    newMap.set(x, y, v);
    if (v === '#') stars.push({ x, y });
})

let k = 0;
print(stars);
stars.forEach((s, i) => {
    stars.forEach((s2, j) => {
        if (i >= j) return;
        if (i === 2 && j === 5) print(s, s2, Math.abs(s.x - s2.x) + Math.abs(s.y - s2.y))
        total += (Math.abs(s.x - s2.x) + Math.abs(s.y - s2.y))
    });
})

// print(newMap.print());
print(total);
