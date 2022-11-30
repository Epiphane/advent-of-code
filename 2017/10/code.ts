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

let list = range(256);
let pos = 0;
let skip = 0;
let input = raw.split('').map(l => l.charCodeAt(0));
input = input.concat(17, 31, 73, 47, 23);

function rev(arr: number[], start, size) {
    for (let i = 0; i < size / 2; i++) {
        let left = start + i;
        let right = start + size - i - 1;

        left %= arr.length;
        right %= arr.length;

        arr.swap(left, right);
    }
}

range(64).forEach(() =>
    input.forEach(num => {
        rev(list, pos, num);

        pos += num + skip;
        skip++;

        pos = pos % list.length;
    })
);

print(list[0] * list[1])

let result = '';
for (let i = 0; i < list.length; i) {
    let num = 0;
    for (let j = 0; j < 16; j++) {
        num ^= list[i++];
    }
    let str = num.toString(16).padStart(2, '0');
    result += str;
}

print(result)
