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

let N = 363;

let buffer = [0];

function link(val, next) {
    return {
        val, next
    };
}

let zero = link(0, null);
zero.next = zero;
let buf = zero;
let cursor = buf;
range(50000000).forEach(val => {
    val++;
    range(N).forEach(() => cursor = cursor.next);

    // print(cursor);

    cursor.next = link(val, cursor.next);

    // print(cursor.next);
    cursor = cursor.next;

    // print(zero.val, zero.next.val);

    if (val === 2017)
        print(cursor);

    if (val % 10000 === 0) {
        print(val, zero.next.val);
    }

    // print(zero);
});

print(zero);


// let pos = 0;
// // N = 3;
// range(50000000).forEach(val => {
//     pos += N + 1;

//     while (pos > buffer.length) {
//         pos -= buffer.length;
//     }

//     buffer.splice(pos, 0, val + 1);
//     if (val + 1 === 50000000) {
//         print(buffer.slice(buffer.indexOf(0), 3));
//     }
//     // print(buffer);
// })

// print(buffer.length);
// print(buffer[pos + 1]);

// print(buffer.slice(buffer.indexOf(0), 3));

// print(total);
