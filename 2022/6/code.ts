// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
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

let total = 0;

let input = raw.split('');

let done = false;
let mapping = {};
input.forEach((l, i) => {
    mapping[l] = mapping[l] || 0;
    mapping[l]++;

    if (i >= 14) {
        mapping[input[i - 14]]--;
    }

    for (let l2 in mapping) {
        if (mapping[l2] > 1) {
            return;
        }
    }

    if (total > 0 || i < 13) return;

    total = i + 1;
    // print(i);
    // print(input.slice(i - 4, i));
    // print(input[1624]);
})


print(total);
