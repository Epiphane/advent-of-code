import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from '../../utils';
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

let fish = raw.split(',').map(i => parseInt(i));

function iterate2(fish) {
    let newFish = fish.map(f => f - 1);

    newFish.forEach((val, i) => {
        if (val === -1) {
            newFish[i] = 6;
            newFish.push(8);
        }
    });

    return newFish
}

let nWithAge = [0, 0, 0, 0, 0, 0, 0, 0, 0];
fish.forEach(f => {
    nWithAge[f]++;
})

function iterate() {
    const growing = nWithAge[0];

    for (let i = 0; i < 8; i++) {
        nWithAge[i] = nWithAge[i + 1];
    }

    nWithAge[6] += growing;
    nWithAge[8] = growing;
}


for (let steps = 0; steps < 256; steps++) {
    iterate();
}
console.log(nWithAge.reduce((prev, i) => prev + i, 0))


// for (let steps = 0; steps < 256; steps++) {
//     fish = iterate(fish);
//     console.log(steps);
// }

// console.log(fish.length);
