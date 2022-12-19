// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
import { question, setEncoding } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

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

class MyInterpreter extends Interpreter {
    constructor(instrs: string[]) {
        super(instrs);
    }
}

let program = new MyInterpreter(asLines);

let sensors = [];
let beacons = {};
let minx = 0;
let maxx = 0;
asLines.forEach(line => {
    const words = line.split(' ');

    let x1 = words[2].split('=').map(makeInt)[1];
    let y1 = words[3].split('=').map(makeInt)[1];
    let x2 = words[8].split('=').map(makeInt)[1];
    let y2 = words[9].split('=').map(makeInt)[1];

    const s = {
        x: x1, y: y1, radius: Math.abs(x2 - x1) + Math.abs(y2 - y1)
    }
    sensors.push(s);

    minx = Math.min(minx, x1 - s.radius);
    maxx = Math.max(maxx, x1 + s.radius);

    beacons[y2] = beacons[y2] || [];
    if (beacons[y2].indexOf(x2) < 0) {
        beacons[y2].push(x2);
    }
});

sensors.sort((a, b) => a.x - b.x);
// print(sensors);

function xMin(cx, cy, r, y) {
    let dist = Math.abs(cy - y);
    return cx - (r - dist);
}
function xMax(cx, cy, r, y) {
    let dist = Math.abs(cy - y);
    // print(r - dist);
    return cx + (r - dist);
}

let taken = [];

function freeX(Y) {
    // let Y = 2000000;
    // Y = 10;
    let X = 0;

    // let good = true;
    // for (let i = 0; i < sensors.length; i++) {
    //     const { x, y, radius } = sensors[i];
    //     if (Math.abs(y - Y) > radius) continue;
    //     let minX = xMin(x, y, radius, Y);
    //     let maxX = xMax(x, y, radius, Y);

    //     if (minX > X) {
    //         // return X;
    //     }

    //     X = maxX + 1;
    // }

    let taken = []
    sensors.forEach(({ x, y, radius }) => {
        if (Math.abs(y - Y) > radius) return;
        let minX = xMin(x, y, radius, Y);
        let maxX = xMax(x, y, radius, Y);

        // print(x, y, radius);
        // print([xMin(x, y, radius, Y), xMax(x, y, radius, Y)]);
        taken.push([xMin(x, y, radius, Y), xMax(x, y, radius, Y)]);
    })

    taken.sort((a, b) => a[0] - b[0]);
    // print(taken);

    taken.forEach((l, i) => {
        taken.slice(i + 1).forEach(other => {
            if (l[1] >= other[0]) {
                other[1] = Math.max(l[1], other[1])
                l[1] = other[0] - 1;
            }
        });
    });

    taken = taken.filter(([a, b]) => b >= a)
    // print(taken);

    // let leftX = taken[0][0];
    // let final = [];
    // for (let i = 0; i < taken.length; i++) {

    // }
    X = 0;
    let changed = true;
    while (X < 4000000 && changed) {
        changed = false;
        taken.forEach(([l, r]) => {
            if (l <= X && r >= X) {
                X = r + 1;
                changed = true;
            }
        })
    }

    if (X > 4000000) return false;
    return X;

    // print(X)

    // if (taken[0][0] > 0) {
    //     print(x, Y);
    // }
    // else {
    //     let xmin = taken[0][0];
    //     for (let i = 0; i < taken.length; i++) {

    //     }
    // }

    // total = taken.reduce((prev, i) => prev + (i[1] - i[0] + 1), 0);

    // // print(beacons.filter(({ x, y }) => y === Y));
    // total -= beacons[Y].length;

    // for (let x = minx; x <= maxx; x++) {

    // }

    return false;
}

print(freeX(2000000));

const result = range(4000000).find(Y => freeX(Y))

print(result, freeX(result), freeX(result) * 4000000 + result);


// print(total);
