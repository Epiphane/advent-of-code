// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, addAll, id } from '../../utils';
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

let start;
asMap.forEach((v, x, y) => {
    if (v === '^') {
        start = { x, y }
    }
})

let res = new Map(0);
res.set(start.x, start.y, 1);

function test(newmap, testing) {
    let dir = 0;
    let options = {};
    let pos = { ...start };
    let exited = false;
    let visited = newmap.map(id);
    function step() {
        if (newmap.get(pos.x + DIRS[dir].x, pos.y + DIRS[dir].y) === '#') {
            dir = Turn(dir, 1);
            let key = `${pos.x},${pos.y},${dir}`;
            if (options[key]) {
                return false;
            }
            options[key] = true;
            return true;
        }
        else {
            pos.x += DIRS[dir].x;
            pos.y += DIRS[dir].y;

            if (newmap.contains(pos.x, pos.y)) {
                res.set(pos.x, pos.y, 1);
                visited.set(pos.x, pos.y, '|');
                let key = `${pos.x},${pos.y},${dir}`;
                if (options[key]) {
                    return false;
                }
                options[key] = true;

            }
            else {
                exited = true;
                return false;
            }
        }
        return true;
    }

    while (step()) { }

    if (!!testing) {
        print(visited.print());
    }

    return !exited;
}

let answer = asMap.map((v, x, y) => {
    if (v === '#') return;
    if (v === '^') return;

    let newmap = asMap.copy();
    print(x, y);
    newmap.set(x, y, '#')
    if (x === 1 && y === 8) {
        print(newmap.print());
        print()
        print()
    }
    if (test(newmap, x === 1 && y === 8)) {
        total++;
        return 1;
    }

    return 0;
})

print(total);
// print(answer.reduce(addAll, 0))

// print(res.reduce((p, v) => p + v, 0))
