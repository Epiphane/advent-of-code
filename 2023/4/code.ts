// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, addAll } from '../../utils';
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

function P(x, y) {
    return { x, y };
}

let scores = [];
let inst = [1];
let adds = [];
let from = []
let stack = [];
let counts = [];
asLines.forEach((line, n) => {
    n++;

    const [win, have] = line.split(': ')[1].split(' | ').map(l => l.split(' ').map(makeInt).filter(f => !isNaN(f)));

    let score = 0;
    let inc = 1;

    let wins = [];
    win.forEach(w => {
        if (have.includes(w)) {
            wins.push(w);
            from[w] = from[w] || [];
            from[w].push(n);
        }
    })

    // scores.push(wins);
    adds[n] = wins;
    stack.push(n);
    counts[n] = 1;
})

let cards = 0;
// let count = asLines.map(() => 1);
// count.unshift(0);
// while (count.reduce(addAll, 0) !== 0) {
//     for (let n = 1; n <= asLines.length; n++) {
//         if (adds[n].length !== 0) {
//             continue;
//         }

//         if (count[n] === 0) continue;

//         print(n, `is from ${(from[n] || []).join(',')} and wins ${adds[n]}`)

//         total += count[n];
//         if (from[n])
//             from[n].forEach(fromN => {
//                 count[fromN] += count[n];
//                 adds[fromN] = adds[fromN].filter(a => a !== n)
//                 print('\t', fromN, `(${count[fromN]}) now adds ${adds[fromN].join(',')} and is from ${(from[fromN] || []).join(',')}`)
//             })
//         count[n] = 0;
//         break;
//     }

// if (tot)

// print(count[82], adds[82].join())

// print(adds[117], from[117]);

// let i = 0;
// while (stack.length > 0) {
//     // print(stack);
//     let card = stack.shift();

//     let count = counts[card];
//     counts[card] = 0;

//     // print(card, count);
//     if (count === 0) continue;

//     total += count;

//     adds[card].forEach(n => {
//         if (!stack.includes(n)) stack.push(n);
//         counts[n] += count;
//     })

//     if (i++ % 1000000 === 0) {
//         print(stack.length);
//     }
// }
// }

let count = asLines.map(() => 1);
count.unshift(0);
for (let i = 1; i <= asLines.length; i++) {
    let c = count[i];

    total += c;

    print(c, adds[i].length);
    adds[i].forEach((n, j) => {
        count[i + j + 1] += c;
    })
}

print(total);
