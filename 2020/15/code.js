import fs from 'fs';
import md5 from '../../md5.js';
import { Map } from '../../map.js';
import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from '../../utils.js';
import { question } from 'readline-sync';

const log = console.log;
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let map = new Map('.');

input = [7, 12, 1, 0, 16, 2];
// input = [0, 3, 6];
let count = {};
input.forEach(n => count[n] = 1);

let lastSaid = {};
lastSaid = new Array(30000000)
input.forEach((n, i) => lastSaid[n] = i);
lastSaid[2] = null;
let freq = {};

// let ninput = input.map(i => i);
// while (ninput.length !== 2020) {
//     let last = ninput[ninput.length - 1];
//     if (last === 410) print(ninput.length);
//     let lastTime = ninput.slice(0, ninput.length - 1).lastIndexOf(last);
//     if (lastTime === -1) {
//         ninput.push(0);
//         continue;
//     }
//     else {
//         // print(lastTime);
//         // print(ninput.slice(0, lastTime));
//         let n = ninput.length - 1 - lastTime;//lastTime - ninput.slice(0, lastTime).lastIndexOf(last);
//         // print(n);
//         // break;
//         ninput.push(n);
//         continue;
//     }
// }
// print(ninput.slice(6));
// print(ninput[ninput.length - 1]);

let ll = 0;
let lli = 0;
let last = input[input.length - 1];
for (let i = input.length - 1; i <= 30000000 - 2; i++) {
    if (!lastSaid[last] && lastSaid[last] !== 0) {
        // print(lastSaid, last);
        lastSaid[last] = i;
        last = 0;
    } else {
        let l = i - lastSaid[last];
        lastSaid[last] = i;
        last = l;
    }

    // if (i < 100) print(last);
    if (i % 100000 === 0) print(i);
    // if (last > ll) {
    //     ll = last;
    //     print(i, ll, i - lli);
    //     lli = i;
    // }

    // for (let k in lastSaid) {
    //     if (lastSaid[k] < i - 100000) {
    //         delete lastSaid[k];
    //     }
    // }
    // if (i + 20 >= 2020) print(i, last);
    // if (last !== ninput[i + 1]) {
    //     print(i, last, ninput[i + 1]);
    //     break;
    // }
    // print(i, last);
}
print(last);
