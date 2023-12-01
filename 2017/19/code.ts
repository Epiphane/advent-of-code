// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
import { question } from 'readline-sync';
import { Point } from '../../point';
const md5 = require('../../md5');
const print = console.log;
const UP = new Point(0, -1);
const DOWN = new Point(0, 1);
const LEFT = new Point(-1, 0);
const RIGHT = new Point(1, 0);
const dirs = [UP, DOWN, LEFT, RIGHT];

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput(' ');
let asNumberMap = MapFromInput(0, makeInt)

let start;

asMap.forEach((v, x, y) => {
    if (y != 0) return;

    if (v === '|') {
        start = new Point(x, y);
    }
});

print(start);

let dir = DOWN;

let pos = start.copy();
let answer = '';
let i = 0;
while (true) {
    pos = pos.add(dir);
    i++;

    print(pos, asMap.get(pos.x, pos.y));
    switch (asMap.get(pos.x, pos.y)) {
        case '|':
        case '-':
            break;
        case '+':
            if (asMap.get(pos.x + dir.x, pos.y + dir.y) === ' ') {
                // Turn
                let ndirs = dirs.filter(d => d.x + dir.x !== 0 && d.y + dir.y !== 0);
                dir = ndirs.filter(d => asMap.get(pos.x + d.x, pos.y + d.y) !== ' ')[0];
            }
            break;
        case ' ':
            print(answer, i);
            return;
        default:
            answer += asMap.get(pos.x, pos.y);
    }
}

print(dir);
