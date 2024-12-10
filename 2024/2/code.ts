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

let safe = (nums) => {
    let res = true;
    let inc = (nums[1] > nums[0]);
    for (let i = 1; i < nums.length; i++) {
        let diff = nums[i] - nums[i - 1];
        if (inc && diff <= 0) {
            res = false;
            break;
        }
        if (!inc && diff >= 0) {
            res = false;
            break;
        }
        if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {

            res = false;
            break;
        }
    }

    return res;
}

for (let line of asLines) {
    let nums = line.split(' ').map(i => +i);

    if (safe(nums)) total++;
    else {
        for (let i = 0; i < nums.length; i++) {
            if (safe(nums.slice(0, i).concat(nums.slice(i + 1)))) {
                total++;
                break;
            }
        }
    }
}
print(total)
