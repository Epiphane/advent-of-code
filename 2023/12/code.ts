// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput, MapFromString } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
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

asGroups.forEach(group => {
    // let map = MapFromString(group);

    let group2 = [];
    for (let j = 0; j < group[0].length; j++) {
        let row = '';
        for (let i = 0; i < group.length; i++) {
            row += group[i][j]
        }
        group2.push(row);
    }

    // map.forEach((v, x, y) => group2[x] += v);

    let score = 0;
    // for (let r = 1.5; r < group.length; r++) {
    //     let good = true;

    //     for (let d = 0.5; r + d < group.length && r - d >= 0; d++) {
    //         let y1 = r - d;
    //         let y2 = r + d;
    //         if (group[y1] !== group[y2]) {
    //             good = false;
    //             break;
    //         }
    //     }

    //     if (good) {
    //         score += 100 * (r - 0.5);
    //         print('row', (r - 0.5))
    //     }
    // }

    let fn = (grp, mul) => {
        for (let r = 0.5; r < grp.length - 0.5; r++) {
            let diffs = 0;
            let good = true;

            for (let d = 0.5; r + d < grp.length && r - d >= 0; d++) {
                let y1 = r - d;
                let y2 = r + d;
                grp[y1].split('').forEach((v, i) => {
                    if (v !== grp[y2][i]) {
                        diffs++;
                    }
                })

                if (diffs > 1) {
                    break;
                }
                // if (grp[y1] !== grp[y2]) {
                //     good = false;
                //     break;
                // }
            }

            if (diffs === 1) {
                score += mul * (r + 0.5);
                print('col', mul, (r + 1))
            }
        }
    };

    fn(group, 100);
    fn(group2, 1);


    // for (let r = 0; r < group2.length; r++) {
    //     let good = true;

    //     for (let d = 0; r + d < group2.length && r - d >= 0; d++) {
    //         let y1 = r + d;
    //         let y2 = r - d - 1;
    //         if (group2[y1] !== group2[y2]) {
    //             good = false;
    //             break;
    //         }
    //     }

    //     if (good) {
    //         score += r;
    //         print('col', r)
    //     }
    // }

    total += score;
    print(group.join('\n'), score, '\n');
})

print(total);
