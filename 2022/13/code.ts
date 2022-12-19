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

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let part1 = 0;

function parse(string) {
    let result = { left: 0, right: 0 };
    return JSON.parse(string);
}

function compare(left, right) {
    // print(left, right);
    if (typeof (left) === 'number') {
        if (typeof (right) === 'number') {
            if (left !== right) {
                return left < right ? 1 : 2;
            }
            else {
                return 0;
            }
        }
        else {
            return compare([left], right);
        }
    }
    else {
        if (typeof (right) === 'number') {
            return compare(left, [right]);
        }
        else {
            let i = 0;
            for (; i < left.length; i++) {
                if (i >= right.length) {
                    return 2;
                }

                let l = left[i];
                let r = right[i];

                let diff = compare(l, r);
                if (diff !== 0) {
                    return diff;
                }
            }

            if (i === left.length && i < right.length) {
                return 1;
            }

        }
    }
    return 0;
}

let all = [[[2]], [[6]]];
let ind = [1, 2];
asGroups.forEach((group, i) => {
    // if (i !== 1) return;
    let first = JSON.parse(group[0]);
    let second = JSON.parse(group[1]);
    if (compare(first, second) === 1) {
        part1 += i + 1;
    }

    all.push(first);
    ind.push(ind.length + 1);
    all.push(second);
    ind.push(ind.length + 1);
})

print(`Part 1:`, part1);

while (true) {
    let done = true;
    for (let i = 1; i < all.length; i++) {
        if (compare(all[i - 1], all[i]) === 2) {
            all.swap(i - 1, i);
            ind.swap(i - 1, i);
            done = false;
        }
    }

    if (done) break;
}

print(`Part 2:`, (ind.indexOf(1) + 1) * (ind.indexOf(2) + 1))
