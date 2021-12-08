import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm, range } from '../../utils';
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
let asNumberMap = MapFromInput(0, s => parseInt(s))

const numToDigit = {
    2: [1],
    3: 7,
    4: 4,
    5: 5,
    6: 6,
}

let result = 0;
asLines.forEach(line => {
    const [left, right] = line.split(' | ');
    const lWords = left.split(' ').map(w => w.split('').sort().join(''));
    const rWords = right.split(' ').map(w => w.split('').sort().join(''));

    let figuredOut = range(10).map(() => false);
    let mapping = {};

    let is0, is1, is2, is3, is4, is5, is6, is7, is8, is9;

    // 1
    lWords.forEach(word => {
        if (word.length === 2) {
            is1 = word;
        }
    })

    // 7
    let A, B, C, D, E, F, G;
    lWords.forEach(word => {
        if (word.length === 3) {
            A = word.split('').filter(a => a !== is1[0] && a !== is1[1])[0]
        }
    })

    // 4
    let BorD;
    lWords.forEach(word => {
        if (word.length === 4) {
            is4 = word;
            BorD = word.split('').filter(l => is1.indexOf(l) < 0)
        }
    })

    // 3
    lWords.forEach(word => {
        if (word.length === 5) {
            if (word.includes(is1[0]) && word.includes(is1[1])) {
                // 3
                word.split('').forEach(l => {
                    if (l === is1[0] || l === is1[1] || l === A) return;
                    if (BorD.includes(l)) {
                        D = l;
                    }
                    else {
                        G = l;
                    }
                })
            }
        }
    })

    B = BorD.filter(i => i !== D)[0];

    // 5
    lWords.forEach(word => {
        if (word.length === 5) {
            if (!word.includes(is1[0]) || !word.includes(is1[1])) {
                // 5
                if (word.includes(B)) {
                    F = word.split('').filter(l => [A, B, D, G].indexOf(l) < 0)[0]
                    C = is1.split('').filter(l => l !== F)[0]
                }
            }
        }
    })

    // 8
    lWords.forEach(word => {
        if (word.length === 7) {
            E = word.split('').filter(l => [A, B, C, D, F, G].indexOf(l) < 0)[0]
        }
    })

    let num = 0;

    const lookup = [
        [A, B, C, E, F, G].sort().join(''),
        [C, F].sort().join(''),
        [A, C, D, E, G].sort().join(''),
        [A, C, D, F, G].sort().join(''),
        [B, C, D, F].sort().join(''),
        [A, B, D, F, G].sort().join(''),
        [A, B, D, E, F, G].sort().join(''),
        [A, C, F].sort().join(''),
        [A, B, C, D, E, F, G].sort().join(''),
        [A, B, C, D, F, G].sort().join(''),
    ]

    rWords.forEach(word => {
        num *= 10;
        num += lookup.indexOf(word);
    })

    result += num;

    // while (figuredOut.includes(false)) {
    //     lWords.forEach(word => {
    //         if (word.length === 2) {

    //         }
    //     })
    // }

    // rWords.forEach(word => {
    //     if ([2, 4, 3, 7].indexOf(word.length) >= 0) {
    //         result++;
    //     }
    // })
})

print(result);


