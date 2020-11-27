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
let input = lines.map(l => {
    return l.split('-').map(i => +i)
});


input.sort((a, b) => {
    return a[0] - b[0];
})

let min = 0;
let totals = 0;
input.forEach(range => {
    if (range[0] <= min) {
        // min = range[1] + 1;
        min = Math.max(range[1] + 1, min);
    }
    else {
        print(range, min, range[0] - min);
        totals += range[0] - min;
        min = Math.max(range[1] + 1, min);
    }
});

// totals += 4294967295 - min;
print(min);
totals += 4294967295 - min + 1;

print(totals);
