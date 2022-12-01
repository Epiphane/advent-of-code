// @ts-nocheck

import * as fs from 'fs';
import { Map } from '../../map';
import { makeInt, range, addAll } from '../../utils';
const print = console.log;

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim();

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
    return KnotHash(input)
        .split('')
        .map(l => parseInt(l, 16)
            .toString(2)
            .padStart(4, '0'))
        .join('');
}

let used = new Map(false);
range(128).forEach(layer => {
    getRow(`${input}-${layer}`).split('').map(makeInt).forEach((i, col) => {
        used.set(col, layer, i === 1);
    })
})

print(`Part 1:`, used.reduce(addAll, 0));

let regions = new Map(0, 0, 127);

function fill(x: number, y: number, region: number) {
    if (regions.get(x, y) > 0) return;

    regions.set(x, y, region);
    used.forAdjacent(x, y, (val, nx, ny) => {
        if (val) {
            fill(nx, ny, region);
        }
    })
}

let nextRegion = 0;
used.forEach((val, x, y) => {
    if (val && !regions.get(x, y)) {
        fill(x, y, ++nextRegion);
    }
})

print(`Part 2:`, nextRegion);
