// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
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

asLines.forEach(line => {
    const [_, num, rest] = line.match(/Game ([0-9]+): (.*)$/);

    let good = true;
    let rgb = [0, 0, 0];
    let bags = rest.split('; ').map(bag => bag.split(', '));

    bags.forEach(b => {
        b.forEach(cont => {
            const [n, c] = cont.split(' ')
            let num = parseInt(n);
            if (c === 'red') rgb[0] = Math.max(rgb[0], num);
            if (c === 'green') rgb[1] = Math.max(rgb[1], num);
            if (c === 'blue') rgb[2] = Math.max(rgb[2], num);
        })
    })

    total += rgb[0] * rgb[1] * rgb[2];
})
print(total);
