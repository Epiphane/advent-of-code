// @ts-nocheck

import * as fs from 'fs';
import { addAll, descending } from '../../utils';
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let input = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        parseInt(line.trim())));

const elves = input.map(elf => elf.reduce(addAll, 0));
elves.sort(descending);
print(`Part 1: ${elves[0]}`);
print(`Part 2: ${elves.slice(0, 3).reduce(addAll, 0)}`);
