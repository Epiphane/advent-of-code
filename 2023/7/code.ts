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

let asLines = raw.split('\n').map(line => line.split(' '));
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

let scores = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']
let scoreR = scores.map(i => i).reverse();
let hands = [];
for (let [f, bid] of asLines) {
    let cards = f.split('').sort((a, b) => scores.indexOf(b) - scores.indexOf(a));

    let mode = 0;
    let best = f[0];
    let count = {};
    for (let card of cards) {
        if (card === 'J') card = best;
        count[card] = count[card] || 0;
        count[card]++;

        if (count[card] > mode) {
            mode = count[card];
            best = card;
        }
    }

    let counts = [];
    for (let val of count.values()) {
        counts.push(val);
    }
    counts = counts.sort((a, b) => b - a);
    // print(counts);

    let score1 = 0;
    f.split('').forEach(c => {
        score1 *= 100;
        score1 += scores.indexOf(c);
    })
    let score2 = 0;
    if (counts[0] === 5) {
        score2 += 9;
    }
    else if (counts[0] === 4) {
        score2 += 8;
    }
    else if (counts[0] === 4) {
        score2 += 8;
    }
    else if (counts[0] === 3) {
        if (counts[1] === 2) {
            score2 += 7;
        }
        else {
            score2 += 6;
        }
    }
    else if (counts[0] === 2) {
        if (counts[1] === 2) {
            score2 += 5;
        }
        else {
            score2 += 4;
        }
    }

    hands.push([f, +bid, score2, score1])
}

hands.sort((a, b) => {
    if (a[2] === b[2]) return a[3] - b[3];
    return a[2] - b[2];
}
);

hands.forEach(([f, bid, score], i) => {
    total += +bid * (i + 1);
})

P(total);
