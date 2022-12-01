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

export function KnotHash(input: string) {
    const list = range(256);
    let pos = 0;
    let skip = 0;

    input = input.split('').map(i => i.charCodeAt(0)).concat(17, 31, 73, 47, 23);

    range(64).forEach(() =>
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
        return prev + hash.toString(16).padStart(2, '0');
    }, '');
}

function getRow(input: string) {
    return KnotHash(input).split('').map(l => parseInt(l, 16).toString(2).padStart(4, '0')).join('');
}

let total = 0;
let used = new Map(false);
range(128).forEach(layer => {
    getRow(`${raw}-${layer}`).split('').map(makeInt).forEach((i, col) => {
        used.set(col, layer, i === 1);
    })
})

print(used.reduce(addAll, 0));

let regions = new Map(0);
regions.set(0, 0, 0);
regions.set(127, 127, 0);

function fill(x: number, y: number, region: number) {
    let _x, _y;
    try {
        if (regions.get(x, y) > 0) return;

        // console.log(x, y);
        _x = x;
        _y = y;
        regions.set(x, y, region);
        used.forAdjacent(x, y, (val, nx, ny) => {
            if (val) {
                // print(region);
                fill(nx, ny, region);
            }
        })
    }
    catch (e) {
        print(_x, _y, region);
        print("HELP");
        // return;
    }
}

print(used.map(i => i ? '#' : '.').print());
let nextRegion = 0;
used.forEach((val, x, y) => {
    if (val && !regions.get(x, y)) {
        print('new region', x, y, nextRegion + 1);
        fill(x, y, ++nextRegion);
    }
})

regions.max.x = 16;
regions.max.y = 16;
print(regions.print('\t'));
print(nextRegion);
