// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, Directions } from '../../utils';
import { question } from 'readline-sync';
import { Point } from '../../point';
const md5 = require('../../md5');
const print = console.log;
const P = print;
const UP = new Point(0, -1);
const DOWN = new Point(0, 1);
const LEFT = new Point(-1, 0);
const RIGHT = new Point(1, 0);
const DIRS = [UP, RIGHT, DOWN, LEFT];

let Turn = (dir: number, amount: number) => {
    dir += amount;
    while (dir < 0) dir += 4;
    while (dir > 3) dir -= 4;
    return dir;
}

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

function* extractNumbers(matches: RegExpStringIterator) {
    for (let match of matches) {
        let result = [];
        for (let key in match) {
            result[key] = match[key];
            if (!isNaN(+result[key])) {
                result[key] = +result[key];
            }
        }
        yield result;
    }
}

let covered = new Map(false);
// let map = new Map(0);
// for (let line of asLines) {
//     const matches = line.matchAll(/(\d+)/g);
//     const iterator = extractNumbers(matches);
//     for (let [text] of iterator) {
//     }
// }

function flood(map, v, x, y) {
    covered.set(x, y, true);
    map.set(x, y, v);
    // print(v, map.print());
    asMap.forAdjacent(x, y, (v2, x2, y2) => {
        if (v2 !== v || covered.get(x2, y2)) {
            return;
        }

        flood(map, v, x2, y2);
    })
}

let plots = [];
let done = false;
while (!done) {
    done = true;
    asMap.forEach((v, x, y) => {
        if (!covered.get(x, y)) {
            done = false;
            let plot = new Map('.');
            flood(plot, v, x, y);
            // print(plot.print());
            plots.push(plot);

            let perim = 0;
            let sides = 0;
            plot.min.x--;
            plot.min.y--;
            plot.max.x++;
            plot.max.y++;
            let fences = new Map('.');
            plot.forEach((l, a, b) => {
                if (l === '.') return;
                // plot.forAdjacent(a, b, (l2, a2, b2) => {
                //     if (l2 === '.') {
                //         perim++;
                //         fences.set(3 * a + (a2 - a), 3 * b + (b2 - b), '#');
                //     }
                // })
                if (plot.get(a, b - 1) === '.') {
                    perim++;
                    range(3).forEach(i =>
                        fences.set(3 * a + i, 3 * b, '#'));
                }
                if (plot.get(a, b + 1) === '.') {
                    perim++;
                    range(3).forEach(i =>
                        fences.set(3 * a + i, 3 * b + 2, '#'));
                }
                if (plot.get(a + 1, b) === '.') {
                    perim++;
                    range(3).forEach(i =>
                        fences.set(3 * a + 2, 3 * b + i, '#'));
                }
                if (plot.get(a - 1, b) === '.') {
                    perim++;
                    range(3).forEach(i =>
                        fences.set(3 * a, 3 * b + i, '#'));
                }
                if (plot.get(a + 1, b + 1) === '.') {
                    perim++;
                    range(3).forEach(i =>
                        fences.set(3 * a + 2, 3 * b + 2, '#'));
                }
                if (plot.get(a - 1, b - 1) === '.') {
                    perim++;
                    range(3).forEach(i =>
                        fences.set(3 * a, 3 * b, '#'));
                }
                if (plot.get(a - 1, b + 1) === '.') {
                    perim++;
                    range(3).forEach(i =>
                        fences.set(3 * a, 3 * b + 2, '#'));
                }
                if (plot.get(a + 1, b - 1) === '.') {
                    perim++;
                    range(3).forEach(i =>
                        fences.set(3 * a + 2, 3 * b, '#'));
                }
            })
            print(plot.print());
            print(fences.print());
            // print(perim);
            let area = plot.reduce((p, l) => l !== '.' ? p + 1 : p, 0)


            let cov = new Map(false);

            let start = false;
            let dir = 0;
            fences.forEach((v, x, y) => {
                if (v !== '.' && !cov.get(x, y)) {
                    cov.set(x, y, true);
                    start = new Point(x, y);

                    let pos = start.copy();
                    do {
                        let lastdir = dir;
                        let npos = pos.add(DIRS[dir]);
                        if (dir === -1 || fences.get(npos.x, npos.y) === '.') {
                            // print(pos, npos);
                            // print(fences.get(pos.x, pos.y));
                            // print('+1', fences.get(pos.x + 1, pos.y));
                            // print('-1', fences.get(pos.x - 1, pos.y));
                            // print(fences.get(pos.x, pos.y));
                            // print(fences.get(npos.x, npos.y));
                            // break;
                            sides++;
                            while (fences.get(npos.x, npos.y) === '.' || (lastdir >= 0 && ((lastdir + 2) % 4) === dir)) {
                                // print(pos, npos.x, npos.y, dir, fences.get(npos));
                                dir = (dir + 1) % 4;
                                npos = pos.add(DIRS[dir]);
                                // print(npos);
                                // if (dir === 0) break;
                            }
                            // break;
                        }

                        // print(pos, npos, fences.get(npos.x, npos.y), dir);
                        pos = npos;
                        cov.set(pos.x, pos.y, true);
                        // if (total++ > 150) break;
                        // print(pos, start, pos.equals(start));
                    } while (!(pos.equals(start)))
                    print(sides);
                }
            });

            total += area * sides;
        }
    })
}

print(total);
