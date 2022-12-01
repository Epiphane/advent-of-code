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

function isGood(t) {

    let end = [];
    let pos = {}
    let dir = {};
    asLines.forEach(line => {
        let [first, second] = line.split(': ').map(makeInt);
        end[first] = second;
        pos[first] = 0;
        dir[first] = 1;
    })
    let layer = -t - 1;
    let sev = 0;
    // function iterate() {
    // }


    while (layer < 99) {
        // iterate();
        layer++;

        if (pos[layer] === 0) {
            sev += layer * end[layer];
            // print(layer, end[layer]);
            return false;
        }

        // print(layer)
        for (let l in pos) {
            pos[l] += dir[l];
            if (pos[l] === end[l] - 1 || pos[l] === 0) {
                dir[l] *= -1;
            }
            // print(l, pos[l]);
        }

        // if (pos[layer])
        //     print(pos[layer]);
    }

    return true;
}

let result = 0;

let gates = {};

asLines.forEach(line => {
    let [first, second] = line.split(': ').map(makeInt);
    gates[first] = (second - 1) * 2;
});

// let delay = 10;
for (let delay = 10; ; delay++) {
    let good = true;
    for (let layer in gates) {
        let timeToGate = parseInt(layer);
        let actualTime = delay + timeToGate;
        let remainder = actualTime % gates[layer];

        if (remainder === 0) {
            // print(delay, actualTime, layer, gates[layer], remainder)
            // break;
            good = false;
        }
    }

    if (good) {
        print(delay);
        break;
    }

}


// let i = 0;
// while (!isGood(i)) {
//     // print(i, isGood(i))
//     i++;
// }
// print(i)

// print(isGood(10));
