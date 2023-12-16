// @ts-nocheck

import * as fs from 'fs';
import { permute, gcd, lcm, makeInt, range, mode, multiplyAll } from '../../utils';
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line);


let times = asLines[0].split(' ').slice(1).map(makeInt).filter(i => !isNaN(i));
let distances = asLines[1].split(' ').slice(1).map(makeInt).filter(i => !isNaN(i));

let total = 1;
for (let i = 0; i < 1; i++) {
    let num = 0;

    print(times[i], distances[i])

    for (let t = 0; t < times[i]; t++) {
        let speed = t;

        let finalDist = speed * (times[i] - t);
        // print(t, distances[i], finalDist, finalDist > distances[i]);
        if (finalDist > distances[i]) {
            num++;
        }
    }

    print(num);
}
