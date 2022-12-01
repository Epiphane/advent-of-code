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

let conns = {};

asLines.forEach(entry => {
    let [num, ar, ...end] = entry.split(' ').map(makeInt);

    conns[num] = end;
});

let done = false;
let visited = {};
let groups = 0;
let next = 0;
while (!done) {
    groups++;

    let stack = [next];
    let size = 0;
    while (stack.length) {
        let top = stack.shift();

        if (visited[top]) continue;

        size++;
        visited[top] = true;

        stack = stack.concat(conns[top]);
    }

    done = true;
    for (let key in conns) {
        if (!visited[key]) {
            done = false;
            next = key;
        }
    }
}
print(groups);
