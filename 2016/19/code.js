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

let input = 3012210;
// input = 5;

function Solve(part1) {
    let elves = { id: 1 };
    elves.next = elves;
    elves.prev = elves;

    let cursor = elves;
    let target;
    for (let i = 2; i <= input; ++i) {
        let newelf = { id: i, prev: cursor, next: elves };
        elves.prev = newelf;
        cursor.next = newelf;
        cursor = newelf;

        if (part1) {
            if (i === 2) {
                target = cursor;
            }
        }
        else {
            if (i === Math.floor(input / 2) + 1) {
                target = cursor;
            }
        }
    }

    let remain = input;
    while (target.next !== target) {
        target.next.prev = target.prev;
        target.prev.next = target.next;
        target = target.next;

        if (part1 || remain-- % 2 === 1) {
            target = target.next;
        }
    }

    return target.id;
}

print(Solve(true));
print(Solve(false));
