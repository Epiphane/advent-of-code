// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput, MapFromString } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, Directions } from '../../utils';
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

let dirmap = new Map(0);
let map = asMap;
let checkNor = (x, y, map, vals) => {
    if (map.get(x, y - 1) === '.' && map.get(x - 1, y - 1) === '.' && map.get(x + 1, y - 1) === '.') {
        vals.set(x, y, 'N');
        return true;
    }
    return false;
}
let checkSou = (x, y, map, vals) => {
    if (map.get(x, y + 1) === '.' && map.get(x - 1, y + 1) === '.' && map.get(x + 1, y + 1) === '.') {
        vals.set(x, y, 'S');
        return true;
    }
    return false;
}
let checkWes = (x, y, map, vals) => {
    if (map.get(x - 1, y) === '.' && map.get(x - 1, y + 1) === '.' && map.get(x - 1, y - 1) === '.') {
        vals.set(x, y, 'W');
        return true;
    }
    return false;
}
let checkEas = (x, y, map, vals) => {
    if (map.get(x + 1, y) === '.' && map.get(x + 1, y + 1) === '.' && map.get(x + 1, y - 1) === '.') {
        vals.set(x, y, 'E');
        return true;
    }
    return false;
}
let checks = [checkNor, checkSou, checkWes, checkEas]

function round() {
    let vals = new Map(' ');

    map.forEach((elf, x, y) => {
        let n = 0;
        map.forNeighbors(x, y, (val, x, y) => {
            if (val === '#') n++;
        })

        if (n === 0) return;

        if (elf === '#') {
            for (let i = 0; i < checks.length; i++) {
                if (checks[i](x, y, map, vals)) {
                    break;
                }
            }
        }
    });
    // print(map.print(' '), map.reduce((p, i) => p + (i === '#' ? 1 : 0), 0));
    // print('------------------------------');

    let counts = new Map(0);
    vals.forEach((prop, x, y) => {
        switch (prop) {
            case 'N':
                counts.set(x, y - 1, counts.get(x, y - 1) + 1);
                break;
            case 'E':
                counts.set(x + 1, y, counts.get(x + 1, y) + 1);
                break;
            case 'W':
                counts.set(x - 1, y, counts.get(x - 1, y) + 1);
                break;
            case 'S':
                counts.set(x, y + 1, counts.get(x, y + 1) + 1);
                break;
        }
    });
    // print(map.print(' '), map.reduce((p, i) => p + (i === '#' ? 1 : 0), 0));
    // print('------------------------------');

    let newmap = new Map('.');
    map.forEach((elf, x, y) => {
        let prop = vals.get(x, y);
        let done = false;
        switch (prop) {
            case 'N':
                if (counts.get(x, y - 1) === 1) {
                    newmap.set(x, y - 1, '#');
                    done = true;
                    return;
                }
                break;
            case 'E':
                if (counts.get(x + 1, y) === 1) {
                    newmap.set(x + 1, y, '#');
                    done = true;
                    return;
                }
                break;
            case 'W':
                if (counts.get(x - 1, y) === 1) {
                    newmap.set(x - 1, y, '#');
                    done = true;
                    return;
                }
                break;
            case 'S':
                if (counts.get(x, y + 1) === 1) {
                    newmap.set(x, y + 1, '#');
                    done = true;
                    return;
                }
                break;
        }

        if (!done && elf === '#') {
            newmap.set(x, y, '#');
        }
    })

    map = newmap;
    let tmp = checks.shift();
    checks.push(tmp);
    // print(vals.print(''));
    // print(newmap.print(''));
    // print('------------------------------');
    return vals.reduce((prev, v) => prev + (v !== ' ' ? 1 : 0), 0)
}

for (let i = 1; ; i++) {
    // print(i);
    if (round() === 0) {
        print(`Part 2`, i);
        break;
    }

    print('\n------------------------------\n');
    print(map.print(''));
    if (i === 10) {
        let min = { x: 100, y: 100 };
        let max = { x: 0, y: 0 };
        map.forEach((e, x, y) => {
            if (e === '#') {
                min.x = Math.min(min.x, x);
                min.y = Math.min(min.y, y);
                max.x = Math.max(max.x, x);
                max.y = Math.max(max.y, y);
            }
        })

        let total = 0;
        for (let i = min.x; i <= max.x; i++) {
            for (let j = min.y; j <= max.y; j++) {
                if (map.get(i, j) === '.') {
                    total++;
                }
            }
        }
        // print(total);
        break;
    }
}

// print(map.print(''));
// print('------------------------------');
// range(10).forEach(() => round());

// print(map.min, map.max);


// print(min, max);
