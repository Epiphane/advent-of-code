// @ts-nocheck

import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line.trim());
let asNumbers = raw.split('\n').map(line => parseInt(line.trim()));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

asLines.forEach(line => {
    const [] = line.split(',');
})

let programs = range('p'.charCodeAt(0) - 'a'.charCodeAt(0) + 1);

function spin(n) {
    let x = programs.splice(programs.length - n, n);
    programs = x.concat(programs);
    // programs.splice(0, 0, x);
    // print(programs);
}

function xch(a, b) {
    programs.swap(a, b);
}

function part(a, b) {
    // print(a, b);
    let ia = programs.indexOf(a);
    let ib = programs.indexOf(b);

    // print(programs, ia, ib);

    programs.swap(ia, ib);
}

let time = {};
range(100000).forEach((i) =>
    range(10000).forEach((j) => {
        raw.split(',').forEach((word, i) => {
            const l = word[0];
            let parts = word.substring(1).split('/');
            // if (i < 10) print(programs.map(i => String.fromCharCode('a'.charCodeAt(0) + i)).join(''));

            switch (l) {
                case 'x':
                    xch(makeInt(parts[0]), makeInt(parts[1]));
                    break;
                case 's':
                    spin(makeInt(parts[0]));
                    break;
                case 'p':
                    // print(parts);
                    part(parts[0].charCodeAt(0) - 'a'.charCodeAt(0), parts[1].charCodeAt(0) - 'a'.charCodeAt(0));
                    break;
            }

            // if (i < 10) print(word, programs.map(i => String.fromCharCode('a'.charCodeAt(0) + i)).join(''));

        })

        let w = programs.map(i => String.fromCharCode('a'.charCodeAt(0) + i)).join('');
        if (!time[w]) {
            time[w] = i * 10000 + j;
        }
        else {
            // print(time[w]);
        }

        if (i * 10000 + j === 39) print(w)
    }));

// spin(1);

// print(programs);
print(programs.map(i => String.fromCharCode('a'.charCodeAt(0) + i)).join(''));


// // BFS
// let stack = []
// while (stack.length) {
//     top = stack.shift();
// }

// print(total);
