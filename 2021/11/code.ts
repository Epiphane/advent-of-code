import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm, makeInt, range } from '../../utils';
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

const oct = asNumberMap;
let result = 0;
function iterate() {
    const flashed = new Map(false);

    oct.forEach((val, x, y) => {
        oct.set(x, y, val + 1);
    })

    let goagain = true;
    do {
        goagain = false;
        oct.forEach((val, x, y) => {
            if (val > 9 && !flashed.get(x, y)) {
                flashed.set(x, y, true);

                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (dx === 0 && dy === 0) continue;

                        if (x + dx < oct.min.x) continue;
                        if (y + dy < oct.min.y) continue;
                        if (x + dx >= oct.max.x) continue;
                        if (y + dy >= oct.max.y) continue;
                        oct.set(x + dx, y + dy, oct.get(x + dx, y + dy) + 1);
                    }
                }
                goagain = true;
            }
        })
        // print(oct.max);
    } while (goagain);


    flashed.forEach((v, x, y) => {
        if (v) {
            oct.set(x, y, 0);
            result++;
        }
    })
}


let step = 0;
while (true) {
    iterate();

    step++;

    let done = true;
    oct.forEach(v => {
        if (v !== 0) done = false;
    })

    if (done) break;
}
print(step);
