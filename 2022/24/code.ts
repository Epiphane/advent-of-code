// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('#');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

let blizz = new Map([]);

asMap.forEach((v, x, y) => {
    blizz.set(x, y, [v]);
})

function time() {
    let newmap = new Map('.');
    asMap.forEach((v, x, y) => {
        if (v === '#') {
            newmap.set(x, y, '#');
        }
    })
}

let maps = [blizz];

let blizzards = [[]];
asMap.forEach((v, x, y) => {
    if (v === '<') {
        blizzards[0].push({ dir: '<', x, y })
    }
    else if (v === '^') {
        blizzards[0].push({ dir: '^', x, y })
    } if (v === 'v') {
        blizzards[0].push({ dir: 'v', x, y })
    } if (v === '>') {
        blizzards[0].push({ dir: '>', x, y })
    }
})

function getBlizz(t) {
    if (!blizzards[t]) {
        let prev = blizzards[t - 1];

        let newb = blizzards[t] = [];
        let ii = -1;
        prev.forEach(({ dir, x, y }, i) => {
            switch (dir) {
                case '>':
                    x++;
                    if (asMap.get(x, y) === '#') {
                        x = 1;
                        ii = i;
                    }
                    break;
                case '<':
                    x--;
                    if (x === 0) {
                        x = asMap.max.x - 2;
                    }
                    break;
                case '^':
                    y--;
                    if (y === 0) {
                        y = asMap.max.y - 2;
                    }
                    break;
                case 'v':
                    y++;
                    if (asMap.get(x, y) === '#') {
                        y = 1;
                    }
                    break;
            }

            newb.push({ dir, x, y });
        })

        // if (t === 2) {
        //     print(blizzards[t]);//.filter(({ x, y }) => x === 3 && y === 1));
        // }

        // if (ii >= 0) {
        //     print(newb[ii]);
        // }
    }

    return blizzards[t]

    // if (maps[t]) {
    //     return maps[t];
    // }
    // else {
    //     let prev = maps[t - 1];

    //     let newmap = new Map([]);

    //     prev.forEach((v, x, y) => {
    //         switch (v) {
    //             case '>':
    //                 x++;
    //                 if (asMap.get(x, y) === '#') {
    //                     x = 1;
    //                 }
    //                 newmap.get(x, y).push('>');
    //                 break;
    //             case '<':
    //                 x--;
    //                 if (x === 0) {
    //                     x = 150;
    //                 }
    //                 newmap.get(x, y).push('<');
    //                 break;
    //             case '^':
    //                 y--;
    //                 if (y === 0) {
    //                     y = 20;
    //                 }
    //                 newmap.get(x, y).push('^');
    //                 break;
    //             case 'v':
    //                 y++;
    //                 if (asMap.get(x, y) === '#') {
    //                     y = 1;
    //                 }
    //                 newmap.get(x, y).push('^');
    //                 break;
    //             case '#':
    //                 newmap.set(x, y, ['#']);
    //                 break;
    //             case '.':
    //                 break;
    //         }
    //     })

    //     maps[t] = newmap;
    //     print(newmap.print());
    // }
    // return maps[t];
}

let bigT = 0;

function doSearch(t, sx, sy, destX, destY) {
    let stack = [{
        t,
        x: sx,
        y: sy,
        dist: destX + destY,
        history: [],
    }]

    let foundM = {};
    while (stack.length) {
        let { t, x, y, history } = stack.shift();

        let debug = false;//(t === 0);
        if (debug) {
            print({ t, x, y, destX, destY, history });
        }
        // print('blizz', blizz.slice(0, 5));

        // print(t, x, y);
        // if (i++ % 10 === 0) print(t, x, y);

        if (x === destX && y === destY) {
            print(t, history, history.length);
            return t;
        }
        // print(blizz);

        let blizz = getBlizz(t + 1);
        if (debug) {
            print(blizz);
        }
        t++;

        asMap.forAdjacent(x, y, (val, x2, y2) => {
            if (debug) print(val, x2, y2);
            if (val !== '#') {
                let bad = blizz.find(({ dir, x, y }) => x === x2 && y === y2);
                if (bad) {
                    if (debug) print('bad', x2, y2, bad);
                    return;
                }

                let key = `${t},${x2},${y2}`;
                if (!foundM[key] || foundM[key] > t) {
                    foundM[key] = t;
                    let aDist = Math.abs(x2 - destX) + Math.abs(y2 - destY);
                    aDist += t;
                    if (aDist < 5) {
                        print('good', {
                            x: x2, y: y2, t, dist: aDist
                        })
                    }
                    if (debug) print('good', {
                        x: x2, y: y2, t, dist: aDist
                    })
                    stack.push({
                        x: x2, y: y2, t, dist: aDist, history: [...history, `${x2},${y2}`]
                    });
                }
                else {
                    if (debug) print('already?', key, foundM[key]);
                }
            }
        })

        let bad = blizz.find(({ dir, x: x_, y: y_ }) => x === x_ && y === y_);
        if (bad && t === 3) {
            print('bad', blizz);
        }
        if (!bad) {
            let key = `${t},${x},${y}`;
            if (!foundM[key] || foundM[key] < t) {
                foundM[key] = t;
                let aDist = Math.abs(x - destX) + Math.abs(y - destY);
                aDist += t;
                if (debug) print('good', {
                    x, y, t, dist: aDist
                })
                stack.push({
                    x, y, t, dist: aDist, history: [...history, 'w']
                });
            }
        }

        // stack.sort((a, b) => {
        //     let aDist = Math.abs(a.x - destX) + Math.abs(a.y - destY);
        //     let bDist = Math.abs(b.x - destX) + Math.abs(b.y - destY);

        //     aDist += a.t;
        //     bDist += b.t;
        //     return aDist - bDist;
        // });
        // if (debug) print(stack);
        stack.sort((a, b) => {
            if (a.t !== b.t)
                return a.t - b.t;
            return a.dist - b.dist
        });
        // if (stack[0].dist !== stack[1].dist)
        //     print(stack[0].dist, stack[1].dist)
    }
}

let DY = asMap.max.y - 1;
let DX = asMap.contents[DY].indexOf('.');
let t1 = doSearch(0, 1, 0, DX, DY);
print(t1);
let t2 = doSearch(t1, DX, DY, 1, 0);
print(t2);
let t3 = doSearch(t2, 1, 0, DX, DY);
print(t3);
