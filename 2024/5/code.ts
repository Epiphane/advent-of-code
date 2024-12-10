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

class MyInterpreter extends Interpreter {
}

let interp = new MyInterpreter();

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

let rules = {};
for (let line of asGroups[0]) {
    const matches = line.matchAll(/(\d+)\|(\d+)/g);
    const iterator = extractNumbers(matches);
    for (let [text, a, b] of iterator) {
        rules[a] = rules[a] || [];
        rules[a].push(b)
    }
}

for (let line of asGroups[1]) {
    const nums = line.split(',').map(i => +i);
    let good = true;
    for (let i = 0; i < nums.length; i++) {
        nums.slice(i + 1).forEach((other, j) => {
            if (rules[other] && rules[other].includes(nums[i])) {
                let temp = nums[i];
                nums[i] = other;
                nums[j + i + 1] = temp;
                good = false;
            }
        })
    }

    print(nums);
    if (!good) total += nums[Math.floor(nums.length / 2)];
}

print(total);
