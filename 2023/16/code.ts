// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, addAll } from '../../utils';
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

let start = { x: 0, y: 0 };
let dir = RIGHT;

function score({ x, y, dir }) {
    print(x, y, dir);

    let energ = new Map(0);
    let covered = {};

    let beams = [{ x, y, dir }];
    while (beams.length) {
        let { x, y, dir } = beams.shift();

        if (x < 0 || x >= asMap.max.x) {
            continue;
        }
        if (y < 0 || y >= asMap.max.y) {
            continue;
        }

        // if (total++ > 900000) break;

        let maybePush = (point) => {
            if (point.x < 0 || point.y < 0 || point.x >= asMap.max.x || point.y >= asMap.max.y) {
                return;
            }

            let key = `${point.x}|${point.y}|${point.dir.x}|${point.dir.y}`;
            if (!covered[key]) {
                covered[key] = true;
                beams.push(point);
            }

        }

        energ.set(x, y, 1);

        let tile = asMap.get(x, y);
        // print(x, y, dir, tile);
        let newDir;
        switch (tile) {
            case '.':
                maybePush({ x: x + dir.x, y: y + dir.y, dir })
                break;
            case '/':
                newDir = {
                    x: -dir.y,
                    y: -dir.x
                };
                maybePush({ x: x + newDir.x, y: y + newDir.y, dir: newDir });
                break;
            case '\\':
                newDir = {
                    x: dir.y,
                    y: dir.x
                };
                maybePush({ x: x + newDir.x, y: y + newDir.y, dir: newDir });
                break;
            case '|':
                if (dir.x !== 0) {
                    maybePush({
                        x,
                        y: y - 1,
                        dir: UP
                    })
                    maybePush({
                        x,
                        y: y + 1,
                        dir: DOWN
                    })
                }
                else {
                    maybePush({ x: x + dir.x, y: y + dir.y, dir })
                }
                break;

            case '-':
                if (dir.y !== 0) {
                    maybePush({
                        x: x - 1,
                        y,
                        dir: LEFT
                    })
                    maybePush({
                        x: x + 1,
                        y,
                        dir: RIGHT
                    })
                }
                else {
                    maybePush({ x: x + dir.x, y: y + dir.y, dir })
                }
                break;
        }
    }

    return energ.reduce(addAll, 0);
}

let max = 0;
for (let y = 0; y < asMap.max.y; y++) {
    let scr = score({ x: 0, y: y, dir: RIGHT })
    print(scr);
    max = Math.max(max, scr)
    scr = score({ x: asMap.max.x - 1, y: y, dir: LEFT })
    print(scr);
    max = Math.max(max, scr)
}

for (let x = 0; x < asMap.max.x; x++) {
    let scr = score({ x: x, y: 0, dir: DOWN })
    print(scr);
    max = Math.max(max, scr)
    scr = score({ x: x, y: asMap.max.y - 1, dir: UP })
    print(scr);
    max = Math.max(max, scr)
}

print(max);

// print(score({ x: 0, y: 0, RIGHT }))
