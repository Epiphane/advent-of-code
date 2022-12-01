// @ts-nocheck

import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, descending } from '../../utils';
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
let asWords = raw.split(',');

let total = 0;

let max = 0;
let weights = [];

asGroups.forEach(group => {
    let w = 0;
    group.forEach(line => w += parseInt(line));
    max = Math.max(max, w);
    weights.push(w);
})


weights.sort(descending);

print(weights[0] + weights[1] + weights[2])

print(max);














// print(total);
