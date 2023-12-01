// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, id } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file2 = process.argv[2] || 'input';
let raw = fs.readFileSync(file2 + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line)).map(i => i * 811589153);
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

let file = asNumbers.map(id) as number[];
let indices = asNumbers.map((_, i) => i);

// print(file.length, indices.length);

range(10).forEach(() =>
    asNumbers.forEach((n, i) => {
        let index = indices.indexOf(i);

        let finalIndex = (index + n);
        if (finalIndex <= 0) {
            finalIndex += file.length - 1;
        }
        finalIndex = finalIndex % (file.length - 1);

        file.splice(index, 1);
        file.splice(finalIndex, 0, n);
        indices.splice(index, 1);
        indices.splice(finalIndex, 0, i);
    }));

// print(indices.indexOf(1));
// print(file.indexOf(7675));

let ind0 = file.indexOf(0);

// print(file.slice(ind0, ind0 + 10));
// print(indices.slice(ind0, ind0 + 10));

function get(ind) {
    return file[ind % file.length];
}

print(ind0, get(ind0 + 1000), get(ind0 + 2000), get(ind0 + 3000))
print(get(ind0 + 1000) + get(ind0 + 2000) + get(ind0 + 3000))
