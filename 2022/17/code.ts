// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, addAll } from '../../utils';
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

let map = new Map(' ');

let pieces = ['-', '+', 'L', 'I', 'O'];
let currentPiece = 0;

range(8).forEach(i => map.set(i, 0, '#'));

range(10).forEach(i => map.set(0, i, '#'));
range(10).forEach(i => map.set(8, i, '#'));

function collides(map, shape, x, y) {
    switch (shape) {
        case '-':
            return x <= 0 || x >= 5 ||
                map.get(x, y) !== ' ' ||
                map.get(x + 1, y) !== ' ' ||
                map.get(x + 2, y) !== ' ' ||
                map.get(x + 3, y) !== ' ';
        case '+':
            return x <= 0 || x >= 6 ||
                map.get(x + 1, y) !== ' ' ||
                map.get(x, y + 1) !== ' ' ||
                map.get(x + 1, y + 1) !== ' ' ||
                map.get(x + 2, y + 1) !== ' ' ||
                map.get(x + 1, y + 2) !== ' ';
        case 'L':
            return x <= 0 || x >= 6 ||
                map.get(x + 2, y + 2) !== ' ' ||
                map.get(x + 2, y + 1) !== ' ' ||
                map.get(x + 0, y) !== ' ' ||
                map.get(x + 1, y) !== ' ' ||
                map.get(x + 2, y) !== ' ';
        case 'I':
            return x <= 0 || x >= 8 ||
                map.get(x, y) !== ' ' ||
                map.get(x, y + 1) !== ' ' ||
                map.get(x, y + 2) !== ' ' ||
                map.get(x, y + 3) !== ' ';
        case 'O':
            return x <= 0 || x >= 7 ||
                map.get(x, y) !== ' ' ||
                map.get(x, y + 1) !== ' ' ||
                map.get(x + 1, y + 0) !== ' ' ||
                map.get(x + 1, y + 1) !== ' ';
    }
}

function place(map, shape, x, y) {
    switch (shape) {
        case '-':
            map.set(x, y, '@');
            map.set(x + 1, y, '@');
            map.set(x + 2, y, '@');
            map.set(x + 3, y, '@');
            break;
        case '+':
            map.set(x + 1, y, '@');
            map.set(x, y + 1, '@');
            map.set(x + 1, y + 1, '@');
            map.set(x + 2, y + 1, '@');
            map.set(x + 1, y + 2, '@');
            break;
        case 'L':
            map.set(x + 2, y + 2, '@');
            map.set(x + 2, y + 1, '@');
            map.set(x + 0, y, '@');
            map.set(x + 1, y, '@');
            map.set(x + 2, y, '@');
            break;
        case 'I':
            map.set(x, y, '@');
            map.set(x, y + 1, '@');
            map.set(x, y + 2, '@');
            map.set(x, y + 3, '@');
            break;
        case 'O':
            map.set(x, y, '@');
            map.set(x, y + 1, '@');
            map.set(x + 1, y, '@');
            map.set(x + 1, y + 1, '@');
            break;
    }
}

let highest = 0;
let x = 0;
let y = highest + 3;
let lastH = highest;
let nPieces = 0;
let samples = [];
let delta = 10;
let magic = {};
let f = false
function newPiece() {
    let key = `${currentPiece % pieces.length}`;
    for (let i = highest; i >= highest - 15; i--) {
        for (let j = 1; j <= 7; j++) {
            key += map.get(j, i);
        }
    }

    if (magic[key] && !f) {
        print('found!', key.substring(0, 10), nPieces, magic[key]);

        let dp = nPieces - magic[key].nPieces;
        let dh = highest - magic[key].highest;
        let remain = 1000000000000 - nPieces;
        let batches = remain % dp;
        let nb = remain / dp;
        if (batches === 0) {
            f = true;
            let final = highest + dh * nb
            print(final);
        }
    }
    else {
        magic[key] = { nPieces, highest };
    }

    currentPiece++;
    if (currentPiece % (pieces.length * 5) === 0) {
        // if (nPieces > 0)
        //     samples.push(1000000000000 * highest / nPieces);

        // if (samples.length % 50000 === 0) {
        //     print(nPieces, samples.reduce(addAll, 0) / 50000);
        //     samples = [];
        // }

        if (nPieces % delta === 0) {
            // print(1000000000000 * highest / nPieces, nPieces);
            delta *= 5;
        }
    }
    x = 3;
    y = highest + 4;
}

currentPiece = -1;
newPiece();
let stop = false;

let N = 10;
while (nPieces < N) {
    raw.split('').forEach((dir, i) => {
        if (stop) return;
        let letter = pieces[currentPiece % pieces.length];
        let moved = false;
        // map.set(x, y, '*');
        // if (nPieces === 22) print(dir, moved, x, y, map.print());
        // map.set(x, y, ' ');

        if (dir === '>') {
            if (!collides(map, letter, x + 1, y)) {
                x++;
                moved = true;
            }
        }
        else if (dir === '<') {
            if (!collides(map, letter, x - 1, y)) {
                x--;
                moved = true;
            }
        }

        let t = map.get(x, y);
        map.set(x, y, '*');
        //if (nPieces === 22) 
        print(letter, dir, moved, x, y, map.print());
        map.set(x, y, t);

        if (collides(map, letter, x, y - 1)) {
            place(map, letter, x, y);
            let nh = y;
            if (letter === '+' || letter === 'L') {
                nh += 2;
            }
            if (letter === 'O') {
                nh++;
            }
            if (letter === 'I') {
                nh += 3;
            }
            let lh = highest;
            highest = Math.max(nh, highest);
            nPieces++;

            // print(nPieces, highest - lh);

            range(4).forEach(i =>
                map.set(0, Math.max(highest - i, 0), '#'));
            range(4).forEach(i =>
                map.set(8, Math.max(highest - i, 0), '#'));

            // let mh = 0;
            // map.forEach((v, x, y) => {
            //     if (v === '@') mh = Math.max(y, mh);
            // })
            // if (mh !== highest)
            //     print(highest, mh);

            // print(letter, nPieces, highest);
            newPiece();
            // print('new piece', x, y, highest);
            // print(map.print());
            // stop = true;
            stop = nPieces == N;
            // print(nPieces, highest);
            // if (nPieces < 22) print(map.print(), highest);
            // print(nPieces, highest);

            if (nPieces % 100000 === 0) {
                let newMap = new Map(' ');
                map.forEach((val, x, y) => {
                    if (y > highest - 10000) {
                        newMap.set(x, y, val);
                    }
                })
                map = newMap;
                // print('newMap', nPieces);
            }
        }
        else {
            y--;
        }
    });

    // if (nPieces % 10000 === 0)
    //     print('-', nPieces, 1000000000000 * highest / nPieces);

    print('RESET BRO');
}

print(highest);
