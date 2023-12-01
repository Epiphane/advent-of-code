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

let rots = (s) => {
    if (sets.length === 9) {
        return [
            `${s[0]}${s[1]}${s[2]}${s[3]}${s[4]}${s[5]}${s[6]}${s[7]}${s[8]}`,
            `${s[6]}${s[3]}${s[0]}${s[7]}${s[4]}${s[1]}${s[8]}${s[5]}${s[2]}`,
            `${s[8]}${s[7]}${s[6]}${s[5]}${s[4]}${s[3]}${s[2]}${s[1]}${s[0]}`,
            `${s[2]}${s[5]}${s[8]}${s[1]}${s[4]}${s[7]}${s[0]}${s[3]}${s[6]}`,
            `${s[6]}${s[7]}${s[8]}${s[3]}${s[4]}${s[5]}${s[0]}${s[1]}${s[2]}`,
            `${s[8]}${s[5]}${s[2]}${s[7]}${s[4]}${s[1]}${s[6]}${s[3]}${s[0]}`,
            `${s[2]}${s[1]}${s[0]}${s[5]}${s[4]}${s[3]}${s[8]}${s[7]}${s[6]}`,
            `${s[0]}${s[3]}${s[6]}${s[1]}${s[4]}${s[7]}${s[2]}${s[5]}${s[8]}`,
            `${s[2]}${s[1]}${s[0]}${s[5]}${s[4]}${s[3]}${s[8]}${s[7]}${s[6]}`,
            `${s[0]}${s[3]}${s[6]}${s[1]}${s[4]}${s[7]}${s[2]}${s[5]}${s[8]}`,
            `${s[6]}${s[7]}${s[8]}${s[3]}${s[4]}${s[5]}${s[0]}${s[1]}${s[2]}`,
            `${s[8]}${s[5]}${s[2]}${s[7]}${s[4]}${s[1]}${s[6]}${s[3]}${s[0]}`,
            `${s[8]}${s[7]}${s[6]}${s[5]}${s[4]}${s[3]}${s[2]}${s[1]}${s[0]}`,
            `${s[2]}${s[5]}${s[8]}${s[1]}${s[4]}${s[7]}${s[0]}${s[3]}${s[6]}`,
            `${s[0]}${s[1]}${s[2]}${s[3]}${s[4]}${s[5]}${s[6]}${s[7]}${s[8]}`,
            `${s[6]}${s[3]}${s[0]}${s[7]}${s[4]}${s[1]}${s[8]}${s[5]}${s[2]}`,
        ]
    }
    else {
        return [
            `${s[0]}${s[1]}${s[2]}${s[3]}`,
            `${s[3]}${s[0]}${s[1]}${s[2]}`,
            `${s[2]}${s[3]}${s[0]}${s[1]}`,
            `${s[1]}${s[2]}${s[3]}${s[0]}`,
            `${s[0]}${s[1]}${s[2]}${s[3]}`,
            `${s[3]}${s[0]}${s[1]}${s[2]}`,
            `${s[2]}${s[3]}${s[0]}${s[1]}`,
            `${s[1]}${s[2]}${s[3]}${s[0]}`,
        ]
    }
}

let rules = {};
asLines.forEach(line => {
    const [_, before, after] = line.match(/(.*) => (.*)/);
    print(before, after);

    before = 
})

let sets = '.#...####';

let threes = [];
