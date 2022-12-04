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

function score(me, you) {
    let s = 0;
    // if (me === 'X') {
    //     s += 1;

    //     if (you === 'C') {
    //         s += 6;
    //     }
    //     else if (you === 'A') {
    //         s += 3;
    //     }
    // }
    // else if (me === 'Y') {
    //     s += 2;

    //     if (you === 'A') {
    //         s += 6;
    //     }
    //     else if (you === 'B') {
    //         s += 3;
    //     }
    // }
    // else {
    //     s += 3;

    //     if (you === 'B') {
    //         s += 6;
    //     }
    //     else if (you === 'C') {
    //         s += 3;
    //     }
    // }

    if (you === 'A') {
        switch (me) {
            case 'X':
                s += 3;
                break;
            case 'Y':
                s += 1;
                break;
            case 'Z':
                s += 2;
                break;
        }
    }

    if (you === 'B') {
        switch (me) {
            case 'X':
                s += 1;
                break;
            case 'Y':
                s += 2;
                break;
            case 'Z':
                s += 3;
                break;
        }

    }

    if (you === 'C') {
        switch (me) {
            case 'X':
                s += 2;
                break;
            case 'Y':
                s += 3;
                break;
            case 'Z':
                s += 1;
                break;
        }

    }
    switch (me) {
        case 'X':
            break;
        case 'Y':
            s += 3;
            break;
        case 'Z':
            s += 6;
            break;
    }

    return s;
}



asLines.forEach(line => {
    const [f, s] = line.split(' ');
    print(f, s, score(s, f));

    total += score(s, f);
})




print(total);
