// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
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

// let map = new Map(0);
// for (let line of asLines) {
//     const matches = line.matchAll(/(\d+)/g);
//     const iterator = extractNumbers(matches);
//     for (let [text] of iterator) {
//     }
// }

let nums = asLines[0].split('').map(i => +i);
let files = [];

let filesys = [];
let blocs = [] as [number?, number][];
nums.forEach((n, i) => {
    let id;
    if ((i % 2) === 0) {
        id = i / 2;
        files.push([id, n]);
        blocs.push([id, n]);
    }
    else {
        blocs.push([null, n]);
    }
    range(n).forEach(v => {
        if ((i % 2) === 0) {
            filesys.push(id);
        }
        else {
            filesys.push('.');
        }
    })
})

let done = false;
let curs = 0;
while (filesys[curs] !== '.') {
    curs++;
}

// print(filesys.join(''));

// while (curs < filesys.length - 1) {
//     // print(filesys.join(''));
//     let last = filesys.pop();
//     while (last === '.') {
//         last = filesys.pop();
//     }

//     // print(curs, last, filesys.length)
//     if (curs >= filesys.length) {
//         filesys.push(last);
//         break;
//     }
//     else {
//         filesys[curs++] = last;
//     }

//     while (curs < filesys.length && filesys[curs] !== '.') {
//         curs++;
//     }
// }

// filesys.forEach((v, i) => {
//     if (v === '.') { print(v, i); return; }
//     total += i * v;
// })

function test() {
    let str = '';
    blocs.forEach(([id, siz]) => {
        str += (new Array(siz + 1)).join(id || '.')
    })
    print(str);
}

for (let [id, size] of files.reverse()) {
    // print(id);
    let set = false;
    for (let ndx = 0; ndx < blocs.length; ++ndx) {
        // print('  ', ndx, blocs[ndx][0], blocs[ndx][0] === id)
        if (blocs[ndx][0] === id) {
            if (!set) {
                print('ahh', ndx, id)
                break;
            }
            else {
                print('kill', ndx, id)
                blocs[ndx][0] = null;
                // if (ndx >= blocs.length) break;
            }
        }
        if (blocs[ndx][0] !== null) continue;
        if (blocs[ndx][1] < size) continue;

        if (!set) {
            print('set', id)
            blocs[ndx][1] -= size;
            blocs.splice(ndx, 0, [id, size]);
            set = true;
        }
    }

    // test();

    // print(id);
}

let index = 0;
blocs.forEach(([id, size]) => {
    range(size).forEach(n => {
        total += (index + n) * id;
    });
    index += size;
})

print(blocs);

// print(filesys.slice(50390))

// print(filesys.join('|').substring(0, 200));

print(total);
