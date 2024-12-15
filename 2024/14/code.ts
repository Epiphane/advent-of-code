// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, multiplyAll } from '../../utils';
import { question } from 'readline-sync';
import { Point } from '../../point';
const md5 = require('../../md5');
const print = console.log;
const P = (x, y) => new Point(x, y);
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

let robos = asLines.map(line => {
    const matches = line.matchAll(/p=([-\d]+),([-\d]+) v=([-\d]+),([-\d]+)/g);
    const iterator = extractNumbers(matches);
    for (let [text, p1, p2, v1, v2] of iterator) {
        return {
            pos: new Point(p1, p2),
            vel: new Point(v1, v2),
        }
    }
}).filter(i => !!i);

// let map = new Map('.', P(0,0), P(101,103))

const W = 101;
const H = 103;

function iterate(time) {
    let nrobos = robos.map(({ pos, vel }) => ({ pos: pos.copy(), vel: vel.copy() }));

    let quads = [0, 0, 0, 0];
    nrobos.forEach(robo => {
        robo.pos = robo.pos.add(robo.vel.mult(time));
        if (robo.pos.x < 0) {
            robo.pos.x += W * Math.ceil(-robo.pos.x / W);
        }
        if (robo.pos.y < 0) {
            robo.pos.y += H * Math.ceil(-robo.pos.y / H);
        }
        robo.pos.x %= W;
        robo.pos.y %= H;

        let ndx = 0;
        // print(robo.pos);
        if (robo.pos.x === (W - 1) / 2 || robo.pos.y === (H - 1) / 2) {
            return;
        }
        if (robo.pos.x > (W - 1) / 2) {
            ndx += 2;
        }
        if (robo.pos.y > (H - 1) / 2) {
            ndx += 1;
        }

        quads[ndx]++;
    })

    // print(quads);
    return quads;//.reduce(multiplyAll, 1);
}

// total = iterate(100);

// let f = fs.open('./tree.txt');
// let i = 0;
// let map = new Map('.');
function go(n) {
    i += n;
    robos.forEach(robo => {
        robo.pos = robo.pos.add(robo.vel.mult(n));
        if (robo.pos.x < 0) {
            robo.pos.x += W * Math.ceil(-robo.pos.x / W);
        }
        if (robo.pos.y < 0) {
            robo.pos.y += H * Math.ceil(-robo.pos.y / H);
        }
        robo.pos.x %= W;
        robo.pos.y %= H;
    });

    // let good = true;
    // for (let y = 0; y < 1; y++) {
    //     if (!robos.find(({ pos }) => pos.y === y && pos.x === (W - 1) / 2)) {
    //         good = false;
    //     }
    // }

    map = new Map('.');
    robos.forEach(({ pos }) => map.set(pos, '#'));
    print(map.print('', '\n', false));
    print(i)

}

// go(17815 - lcm(101, 103))
// // setInterval(() => go(101), 1000);

// // go(lcm(101, 103));
// // go(101);
// // print(map.print('', '\n', false));
// // print(i)

let i2 = 0;
while (i2 < 7420) {
    let res = iterate(i2);
    if (Math.abs(i2 - 7412) < 50) print(`t=`, i2, `groups`, res)
    if (res.reduce(multiplyAll, 1) < robos.length * 100) {
        go(i2);
        break;
    }
    i2++;
}

print(total);
