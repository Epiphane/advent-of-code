// @ts-nocheck

import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line.trim());
let asNumbers = raw.split('\n').map(line => parseInt(line.trim()));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let words = raw.split(',');

let end = [0, 0];

function len(end) {
    return Math.abs(end[0]) + Math.abs(end[1] - Math.abs(end[0])) / 2;
}

let max = 0;
words.forEach(dir => {
    switch (dir) {
        case 'ne':
            end[1] += 1;
            end[0] += 1;
            break;
        case 'n':
            end[1] += 2;
            break;
        case 'nw':
            end[1] += 1;
            end[0] -= 1;
            break;
        case 'sw':
            end[1] -= 1;
            end[0] -= 1;
            break;
        case 's':
            end[1] -= 2;
            break;
        case 'se':
            end[1] -= 1;
            end[0] += 1;
            break;
    }

    max = Math.max(max, len(end));
});

print(max);
