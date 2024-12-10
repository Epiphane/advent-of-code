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

let enabled = true;
for (let line of asLines) {
    // let [_, a, b] = line.match(/mul\((\d+),(\d+)\)/);
    let matches = line.matchAll(/(mul\(\d+,\d+\))|do\(\)|don't\(\)/g);
    for (let match of matches) {
        let mul = match[0].match(/mul\((\d+),(\d+)\)/);
        let doo = match[0].match(/do\(\)/);
        let dont = match[0].match(/don't\(\)/);

        if (mul && enabled) {
            print(+mul[1], +mul[2])
            total += (+mul[1] * +mul[2])
        }
        else if (doo) {
            enabled = true;
        }
        else if (dont) {
            enabled = false;
        }
    }

}

print(total)
