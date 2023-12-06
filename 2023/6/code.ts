// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, multiplyAll } from '../../utils';
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

let times = asLines[0].split(' ').slice(1).map(makeInt).filter(i => !isNaN(i));
let distances = asLines[1].split(' ').slice(1).map(makeInt).filter(i => !isNaN(i));

let nums = [];
for (let i = 0; i < 1; i++) {
    let num = 0;

    print(times[i], distances[i])

    for (let t = 0; t < times[i]; t++) {
        let speed = t;

        let finalDist = speed * (times[i] - t);
        // print(t, distances[i], finalDist, finalDist > distances[i]);
        if (finalDist > distances[i]) {
            num++;
        }
    }

    // nums.push(num.length);
    print(num);
}

// print(nums.reduce(multiplyAll, 1))
