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

let lines = raw.split('\n').map(line => line.trim()).slice(2)
let input = lines;

let map = new Map('.');

lines.forEach(line => {
    let match = line.match(/\/dev\/grid\/node-x([0-9]+)-y([0-9]+)\s+([0-9]+)T\s+([0-9]+)T\s+([0-9]+)T\s+([0-9]+)\%/);
    map.set(+match[1], +match[2], {
        size: +match[3],
        used: +match[4],
        avail: +match[5],
        perc: +match[6],
    });
});

function pairs(map, any) {
    let viable = [];
    map.forEach((A, x, y) => {
        if (A.used === 0) {
            return;
        }
        map.forEach((B, x2, y2) => {
            // if (y2 < y) return;
            // if (y2 === y && x2 <= x) return;

            if (A.used <= B.avail) {
                viable.push([
                    { x, y }, { x: x2, y: y2 }
                ]);
            }
        });
    })

    return viable;
}

print(pairs(map).length)

// Part 2: I gave up on an A* and solved this by hand
print(map.map(val => `${val.used}/${val.size}`).print(' '))
