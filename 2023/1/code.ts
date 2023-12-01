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

[...asLines].forEach(line => {
    let dig = [];

    for (let i = 0; i < line.length; i++) {
        let x = parseInt(line[i]);
        if (x) {
            dig.push(x);
            continue;
        }

        if (line.substring(i).startsWith('one')) {
            dig.push(1);
            continue;
        }
        if (line.substring(i).startsWith('two')) {
            dig.push(2);
            continue;
        }
        if (line.substring(i).startsWith('three')) {
            dig.push(3);
            continue;
        }
        if (line.substring(i).startsWith('four')) {
            dig.push(4);
            continue;
        }
        if (line.substring(i).startsWith('five')) {
            dig.push(5);
            continue;
        }
        if (line.substring(i).startsWith('six')) {
            dig.push(6);
            continue;
        }
        if (line.substring(i).startsWith('seven')) {
            dig.push(7);
            continue;
        }
        if (line.substring(i).startsWith('eight')) {
            dig.push(8);
            continue;
        }
        if (line.substring(i).startsWith('nine')) {
            dig.push(9);
            continue;
        }
    }

    print(line, dig);

    total += (parseInt(`${dig[0]}${dig[dig.length - 1]}`));
    ;
})

print(total);
