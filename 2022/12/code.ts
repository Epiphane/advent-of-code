// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trimEnd();

let asLines = raw.split('\n').map(line => line.trimEnd());
let asNumbers = raw.split('\n').map(line => parseInt(line.trimEnd()));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trimEnd().split('\n').map(line =>
        line.trimEnd()));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, (a) => a.charCodeAt(0) - 'a'.charCodeAt(0));

let mes = [];
let dest = {};
asMap.forEach((v, x, y) => {
    if (v === 'S' || v === 'a') {
        asNumberMap.set(x, y, 0);
        mes.push({ x, y, dist: 0 });
    }
    if (v === 'E') {
        asNumberMap.set(x, y, 25);
        dest = { x, y };
    }
})

// BFS
let dists = mes.map(me => {
    let stack = [me];
    let dists = new Map(100000);
    while (stack.length) {
        let { x, y, dist } = stack.shift();
        let elevation = asNumberMap.get(x, y);

        // if

        if (x === dest.x && y === dest.y) {
            return dist;
        }

        asNumberMap.forAdjacent(x, y, (v, x, y) => {
            if (v > elevation + 1) return;

            if (dists.get(x, y) <= dist + 1) {
                return;
            }

            dists.set(x, y, dist + 1);
            stack.push({
                x, y, dist: dist + 1
            })
        })

        stack.sort((a, b) => a.dist - b.dist);
        // print(stack);
    }
}).filter(i => !!i);

print(Math.min(...dists));

print(asNumberMap.print(',', ','));

// print(total);
