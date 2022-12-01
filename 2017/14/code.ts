// @ts-nocheck

import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, addAll } from '../../utils';
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

function runHash(iterations: number, input: string) {
    const list = range(256);
    let pos = 0;
    let skip = 0;

    input = input.split('').map(i => i.charCodeAt(0)).concat(17, 31, 73, 47, 23);

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

    return range(list.length / 16).reduce((prev, grp) => {
        const group = list.slice(grp * 16, (grp + 1) * 16);
        const hash = group.reduce((prev, next) => prev ^ next, 0);
        return prev + hash.toString(2).padStart(4, '0');
    }, '');
}

// print(runHash(64, `flqrgnkx-0`))
// print(runHash(64, `flqrgnkx-0`).split('').map(i => parseInt(i, 16).toString(2).padStart(4, '0')).join('').length);

let total = 0;
let used = new Map(false);
range(128).forEach(layer => {
    runHash(64, `${raw}-${layer}`).split('').map(makeInt).forEach((i, col) => {
        used.set(col, layer, i === 1);
    })
    // total += runHash(64, `${raw}-${layer}`).split('').map(makeInt).reduce(addAll, 0);
})

print(used.reduce(addAll, 0));

let regions = new Map(-1);
used.set(128, 128, false);
regions.set(128, 128, 0);

// let total = 0;
function fill(x, y, region) {
    if (regions.get(x, y) >= 0) return;
    regions.set(x, y, region);

    // print(x, y, region);
    print(used.min, used.max);
    used.forNeighbors(x, y, (val, nx, ny) => {
        if (!val && regions.get(nx, ny) < 0) {
            // print(region);
            fill(nx, ny, region);
        }
    })
}

used.forEach((val, x, y) => {
    if (!val && regions.get(x, y) < 0) {
        fill(x, y, ++total);
        // print(x, y, total);
    }
})

print(total);
