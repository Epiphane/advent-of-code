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

let map = new Map('.');

let safe = 0;
let firstRow = lines[0].split('').map(i => i === '^');
print(firstRow);


for (let i = 0; i < 400000; i++) {
    firstRow.forEach(i => {
        if (!i) { safe++; }
    })

    let nextRow = [];

    for (let x = 0; x < firstRow.length; x++) {
        let L = !!firstRow[x - 1];
        let C = !!firstRow[x];
        let R = !!firstRow[x + 1];

        let trap = false;
        if (L && C && !R) trap = true;
        if (C && R && !L) trap = true;
        if (L && !C && !R) trap = true;
        if (R && !C && !L) trap = true;

        nextRow.push(trap);
    }

    firstRow = nextRow;
}

print(safe);
