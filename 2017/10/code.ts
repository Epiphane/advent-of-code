// @ts-nocheck

import * as fs from 'fs';
import { makeInt, range } from '../../utils';
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

function runHash(iterations: number, input: number[]) {
    const list = range(256);
    let pos = 0;
    let skip = 0;

    range(iterations).forEach(() =>
        input.forEach(length => {
            for (let i = 0; i < length / 2; i++) {
                let left = (pos + i) % list.length;
                let right = (pos + length - 1 - i) % list.length;
                list.swap(left, right);
            }

            pos += length + skip;
            skip++;

            pos = pos % list.length;
        })
    );

    return list;
}

const part1Input = raw.split(',').map(makeInt);
const part1 = runHash(1, part1Input);
print(`Part 1: ${part1[0] * part1[1]}`);

const part2Input = raw.split('')
    .map(l => l.charCodeAt(0))
    .concat(17, 31, 73, 47, 23);
const part2 = runHash(64, part2Input);
const hash = range(part2.length / 16).reduce((prev, grp) => {
    const group = part2.slice(grp * 16, (grp + 1) * 16);
    const hash = group.reduce((prev, next) => prev ^ next, 0);
    return prev + hash.toString(16).padStart(2, '0');
}, '');
print(`Part 2: ${hash}`);
