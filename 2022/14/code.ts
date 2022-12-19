// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { Point } from '../../point';
import { makeInt } from '../../utils';
const print = console.log;

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim();

const landscape = new Map('.');
let bottom = 0;
input.split('\n').forEach(line => {
    print(line);
    const points = line.split(' -> ')
        .map(l => l.split(',').map(makeInt))
        .map(([x, y]) => new Point(x, y));

    points.forEach(({ x, y }, idx) => {
        bottom = Math.max(bottom, y);
        if (idx + 1 >= points.length) return;

        const { x: nx, y: ny } = points[idx + 1];
        let dx = Math.sign(nx - x);
        let dy = Math.sign(ny - y);

        let position = new Point(x, y);
        while (position.x !== nx + dx || position.y !== ny + dy) {
            landscape.set(position.x, position.y, '#');
            position.x += dx;
            position.y += dy;
        }
    });
});
bottom += 1;

function dropSand(map: Map<string>, part1: boolean) {
    let sand = new Point(500, 0);

    if (map.get(500, 0) !== '.') return false;

    while (true) {
        if (sand.y < bottom) {
            if (map.get(sand.x, sand.y + 1) === '.') {
                sand.y++;
                continue;
            }

            if (map.get(sand.x - 1, sand.y + 1) === '.') {
                sand.y++;
                sand.x--;
                continue;
            }

            if (map.get(sand.x + 1, sand.y + 1) === '.') {
                sand.y++;
                sand.x++;
                continue;
            }
        }
        else if (part1) {
            return false;
        }

        map.set(sand.x, sand.y, 'o');
        return true;
    }
}

function compute(part1: boolean) {
    const map = landscape.copy();
    let grains = 0;
    while (dropSand(map, part1)) {
        grains++;
    }

    return grains;
}

print(`Part 1:`, compute(true));
print(`Part 2:`, compute(false));
