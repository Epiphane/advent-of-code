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
let lines = raw.split('\n').map(line => line.trim()).map(i => +i)

lines.forEach((v, i) => {
    lines.forEach((v2, j) => {
        if (i <= j) return;
        lines.forEach((v3, k) => {
            if (j <= k) return;
            if (v + v2 + v3 === 2020) {
                print(`Part 2: ${v * v2 * v3}`)
            }
        });
        if (v + v2 === 2020) {
            print(`Part 1: ${v * v2}`)
        }
    });
});
