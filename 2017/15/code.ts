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

let total = 0;


let AS = 873;
let BS = 583;

function calc(n, factor) {
    return (n * factor) % 2147483647;
}

let a = 873
let b = BS;

// a = 65;
// b = 8921;

range(5 * 1000000).forEach(() => {
    do {
        a = calc(a, 16807)
    }
    while (a % 4 !== 0);

    do { b = calc(b, 48271) }
    while (b % 8 !== 0);

    // print(a, b);

    let _a = a & 0xffff;
    let _b = b & 0xffff;

    // print(a, b);

    // let aEnd = a.toString(2).padStart(16, '0');
    // let bEnd = b.toString(2).padStart(16, '0');

    // aEnd = aEnd.substring(aEnd.length - 16);
    // bEnd = bEnd.substring(bEnd.length - 16);

    // print(aEnd.length, bEnd.length);
    if (_a === _b) total++;
});

// print(a, b);

print(total);
