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
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

class MyInterpreter extends Interpreter {
    constructor(instrs: string[]) {
        super(instrs);
    }
}

let program = new MyInterpreter(asLines);

// let result = 'hello my name is thomade x=3 fds';
// print(result.match(/hello my name is (.*) x=([0-9]+)/))

let cubeMap = {};

let cubes = [];
let maxX = 0;
let maxY = 0;
let maxZ = 0;
asLines.forEach(line => {
    const [x, y, z] = line.split(',').map(makeInt);
    cubes.push({ x, y, z });
    cubeMap[`${x},${y},${z}`] = true;
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
    // const words = line.match(/hi/);
});

function hasCube(x, y, z) {
    return cubes.find(({ x: x_, y: y_, z: z_ }) => x === x_ && y === y_ && z === z_);
}

let memo = {};
function isFree(x, y, z) {
    if (hasCube(x, y, z)) return false;
    // return !hasCube(x, y, z);
    if (typeof (memo[`${x},${y},${z}`]) != 'undefined') {
        return memo[`${x},${y},${z}`];
    }

    let myMap = {};
    let counts = 0;
    let stack = [{ x, y, z }];
    myMap[`${x},${y},${z}`] = true;
    let maybe = (x, y, z) => {
        if (!myMap[`${x},${y},${z}`] && !hasCube(x, y, z)) {
            myMap[`${x},${y},${z}`] = true;
            stack.push({ x, y, z });
            counts++;
        }
    }
    while (stack.length) {
        let { x, y, z } = stack.shift();
        if (x > maxX || y > maxY || z > maxZ) {
            memo[`${x},${y},${z}`] = true;
            return true;
        }
        if (x < 0 || y < 0 || z < 0) {
            memo[`${x},${y},${z}`] = true;
            return true;
        }

        maybe(x - 1, y, z);
        maybe(x + 1, y, z);
        maybe(x, y - 1, z);
        maybe(x, y + 1, z);
        maybe(x, y, z - 1);
        maybe(x, y, z + 1);

        // if (counts > 500) {
        //     return true;
        // }
    }

    memo[`${x},${y},${z}`] = false;
    return false;
}

cubes.forEach(({ x, y, z }) => {
    // print(x, y, z);
    if (isFree(x - 1, y, z)) {
        total++;
    }
    if (isFree(x + 1, y, z)) {
        total++;
    }
    if (isFree(x, y - 1, z)) {
        total++;
    }
    if (isFree(x, y + 1, z)) {
        total++;
    }
    if (isFree(x, y, z - 1)) {
        total++;
    }
    if (isFree(x, y, z + 1)) {
        total++;
    }

    // let covered = range(6).map(() => false);
    // cubes.forEach(({ x: x2, y: y2, z: z2 }) => {
    //     if (x2 - x === 1 && y2 === y && z2 === z) covered[0] = true;
    //     if (y2 - y === 1 && x2 === x && z2 === z) covered[1] = true;
    //     if (z2 - z === 1 && y2 === y && x2 === x) covered[2] = true;
    //     if (x2 - x === -1 && y2 === y && z2 === z) covered[3] = true;
    //     if (y2 - y === -1 && x2 === x && z2 === z) covered[4] = true;
    //     if (z2 - z === -1 && y2 === y && x2 === x) covered[5] = true;
    // })

    // let free = covered.reduce((prev, x) => prev + (x ? 0 : 1), 0);
    // total += free;

    // print(x, y, z, total, covered.map(x => x ? 1 : 0));
});

// BFS
let stack = []
while (stack.length) {
    top = stack.shift();
}

print(total);
